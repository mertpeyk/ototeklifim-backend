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

export function buildFastSaleOfferCustomerMessage(amount: number) {
  const formattedAmount = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 }).format(amount);

  return `Merhaba, aracınız için fiyat teklifimiz hazır! 🚘

Aracınıza özel teklifimiz: ${formattedAmount} TL

Teklifimiz size cazip geldiyse, detaylı bilgi almak ve satış sürecini başlatmak için 0533 651 66 06 numaralı telefondan bizimle iletişime geçebilirsiniz.

Nihai teklif; aracın ekspertiz kontrolü, kilometresi, hasar durumu ve mevcut kondisyonunun doğrulanmasının ardından kesinleşecektir.

OtoTeklifim
Aracını hızlı, güvenli ve değerinde sat.`;
}

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
    .replace(/\s+/g, ' ')
    .replace(/[^\x20-\x7E]/g, '')
    .trim();
}

export function buildFastSaleOfferSmsMessage(input: Omit<FastSaleOfferNotificationInput, 'phone'>) {
  return toGsmSafeText(input.customMessage || buildFastSaleOfferCustomerMessage(input.amount));
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
