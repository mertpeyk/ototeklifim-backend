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

export function buildFastSaleOfferSmsMessage(input: Omit<FastSaleOfferNotificationInput, 'phone'>) {
  const firstName = compactMessage(input.customerName, 50).split(' ')[0] || 'Değerli müşterimiz';
  const vehicleSummary = compactMessage(input.vehicleSummary, 90);
  const customMessage = compactMessage(input.customMessage, 220);
  const amount = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 }).format(input.amount);
  const validUntil = new Intl.DateTimeFormat('tr-TR', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'Europe/Istanbul',
  }).format(input.validUntil);

  return [
    `Merhaba ${firstName},`,
    `${vehicleSummary} aracınız için hızlı satış teklifimiz ${amount} TL'dir.`,
    customMessage,
    `Teklif ${validUntil} tarihine kadar geçerlidir. Talep No: ${input.requestNo}.`,
    'Detaylar: https://www.ototeklifim.com/tekliflerim',
    'OtoTeklifim',
  ].filter(Boolean).join(' ');
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
    return {
      delivered: result.delivered,
      provider: result.provider,
      message: result.delivered
        ? 'Teklif SMS’i müşterinin kayıtlı telefonuna gönderildi.'
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
      message: 'Teklif kaydedildi ancak SMS gönderimi tamamlanamadı.',
    };
  }
}
