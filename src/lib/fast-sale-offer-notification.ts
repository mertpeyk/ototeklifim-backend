import { sendSms } from './sms.js';

type FastSaleOfferNotificationInput = {
  amount: number;
  customerName: string;
  customMessage: string;
  phone?: string | null;
  requestNo: string;
  validUntil: Date;
  vehicleSummary: string;
};

export type FastSaleOfferNotificationResult = {
  delivered: boolean;
  message: string;
  provider: 'log' | 'twilio' | 'none';
};

function normalizeSmsPhone(phone?: string | null) {
  const digits = String(phone || '').replace(/\D/g, '');
  const normalized = digits.startsWith('90') && digits.length === 12
    ? digits.slice(2)
    : digits.startsWith('0') && digits.length === 11
      ? digits.slice(1)
      : digits;

  return /^5\d{9}$/.test(normalized) ? normalized : '';
}

function compactMessage(value: string, maxLength: number) {
  const compact = String(value || '').replace(/\s+/g, ' ').trim();
  if (compact.length <= maxLength) return compact;
  return `${compact.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
}

function toGsmSafeText(value: string) {
  return String(value || '')
    .replace(/[çÇ]/g, (character) => character === 'ç' ? 'c' : 'C')
    .replace(/[ğĞ]/g, (character) => character === 'ğ' ? 'g' : 'G')
    .replace(/[ıİ]/g, (character) => character === 'ı' ? 'i' : 'I')
    .replace(/[öÖ]/g, (character) => character === 'ö' ? 'o' : 'O')
    .replace(/[şŞ]/g, (character) => character === 'ş' ? 's' : 'S')
    .replace(/[üÜ]/g, (character) => character === 'ü' ? 'u' : 'U')
    .replace(/[^\x20-\x7E]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function buildFastSaleOfferSmsMessage(input: Omit<FastSaleOfferNotificationInput, 'phone'>) {
  const firstName = toGsmSafeText(compactMessage(input.customerName, 30)).split(' ')[0] || 'Musterimiz';
  const vehicleSummary = toGsmSafeText(compactMessage(input.vehicleSummary, 90));
  const amount = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 }).format(input.amount);
  const validUntil = new Intl.DateTimeFormat('tr-TR', {
    dateStyle: 'short',
    timeZone: 'Europe/Istanbul',
  }).format(input.validUntil);
  const prefix = `OtoTeklifim: Merhaba ${firstName}, `;
  const suffix = ` icin hizli satis teklifimiz ${amount} TL. Son: ${validUntil}. No: ${input.requestNo}.`;
  const maxVehicleLength = Math.max(12, 160 - prefix.length - suffix.length);
  const compactVehicle = vehicleSummary.slice(0, maxVehicleLength).trim();

  return `${prefix}${compactVehicle}${suffix}`;
}

export async function sendFastSaleOfferSms(input: FastSaleOfferNotificationInput): Promise<FastSaleOfferNotificationResult> {
  const phone = normalizeSmsPhone(input.phone);

  if (!phone) {
    return {
      delivered: false,
      provider: 'none',
      message: 'Müşterinin geçerli bir telefon numarası bulunamadı.',
    };
  }

  const smsMessage = buildFastSaleOfferSmsMessage(input);

  try {
    const result = await sendSms({ phone, message: smsMessage });
    const providerStatus = result.providerStatus?.toLowerCase();
    const isConfirmedDelivered = result.provider === 'twilio' && providerStatus === 'delivered';
    return {
      delivered: isConfirmedDelivered,
      provider: result.provider,
      message: isConfirmedDelivered
        ? 'Teklif SMS’i müşterinin kayıtlı telefonuna teslim edildi.'
        : result.delivered
          ? 'Teklif Twilio’ya iletildi; operatör teslim onayı bekleniyor.'
          : 'Teklif kaydedildi; SMS sağlayıcısı log modunda olduğu için gerçek gönderim yapılmadı.',
    };
  } catch (error) {
    console.error('[fast-sale-offer-sms] gönderim başarısız', {
      requestNo: input.requestNo,
      error: error instanceof Error ? error.message : 'unknown_error',
    });
    return {
      delivered: false,
      provider: 'none',
      message: error instanceof Error
        ? `Teklif kaydedildi ancak ${error.message}`
        : 'Teklif kaydedildi ancak SMS gönderimi tamamlanamadı.',
    };
  }
}
