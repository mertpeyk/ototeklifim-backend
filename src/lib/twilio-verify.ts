import { env } from '../config.js';

type TwilioVerifyPayload = Record<string, unknown>;

const verifyErrorMessages: Record<string, string> = {
  '60200': 'Telefon numarası geçersiz.',
  '60202': 'Çok fazla doğrulama denemesi yapıldı.',
  '60203': 'Doğrulama kodu için azami deneme sayısına ulaşıldı.',
  '60205': 'Doğrulama kodunun süresi doldu.',
  '60212': 'Bu numaraya doğrulama gönderimi desteklenmiyor.',
  '60410': 'Bu numaraya kısa sürede çok fazla kod gönderildi.',
  '60605': 'Türkiye için Twilio Verify erişimi kapalı.',
};

export const isTwilioVerifyConfigured = Boolean(
  env.TWILIO_ACCOUNT_SID &&
  env.TWILIO_AUTH_TOKEN,
);

let serviceSidPromise: Promise<string> | undefined;

function authorizationHeader() {
  return `Basic ${Buffer.from(
    `${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`,
  ).toString('base64')}`;
}

async function resolveVerifyServiceSid() {
  if (env.TWILIO_VERIFY_SERVICE_SID) {
    return env.TWILIO_VERIFY_SERVICE_SID;
  }

  if (!isTwilioVerifyConfigured) {
    throw new Error('Twilio Verify ayarları eksik.');
  }

  if (!serviceSidPromise) {
    serviceSidPromise = (async () => {
      const listResponse = await fetch('https://verify.twilio.com/v2/Services?PageSize=50', {
        headers: { Authorization: authorizationHeader() },
      });
      const listPayload = await listResponse.json().catch(() => null) as TwilioVerifyPayload | null;

      if (!listResponse.ok) {
        throw new Error(verifyFailureMessage(listResponse.status, listPayload));
      }

      const services = Array.isArray(listPayload?.services)
        ? listPayload.services as TwilioVerifyPayload[]
        : [];
      const existing = services.find((service) =>
        service.friendly_name === 'OtoTeklifim Verify' || service.friendly_name === 'OtoTeklifim',
      );

      if (typeof existing?.sid === 'string') {
        return existing.sid;
      }

      const createResponse = await fetch('https://verify.twilio.com/v2/Services', {
        method: 'POST',
        headers: {
          Authorization: authorizationHeader(),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ FriendlyName: 'OtoTeklifim Verify' }),
      });
      const createPayload = await createResponse.json().catch(() => null) as TwilioVerifyPayload | null;

      if (!createResponse.ok || typeof createPayload?.sid !== 'string') {
        throw new Error(verifyFailureMessage(createResponse.status, createPayload));
      }

      return createPayload.sid;
    })().catch((error) => {
      serviceSidPromise = undefined;
      throw error;
    });
  }

  return serviceSidPromise;
}

function normalizeVerifyPhone(phone: string) {
  const digits = String(phone || '').replace(/\D/g, '');
  const local = digits.startsWith('90') && digits.length === 12
    ? digits.slice(2)
    : digits.startsWith('0') && digits.length === 11
      ? digits.slice(1)
      : digits;

  if (!/^5\d{9}$/.test(local)) {
    throw new Error('Geçerli bir cep telefonu numarası girin.');
  }

  return `+90${local}`;
}

function verifyFailureMessage(status: number, payload: TwilioVerifyPayload | null) {
  const code = String(payload?.code ?? status);
  const providerMessage = typeof payload?.message === 'string' ? payload.message : '';
  return `Twilio Verify hatası (${code}): ${verifyErrorMessages[code] || providerMessage || 'İşlem tamamlanamadı.'}`;
}

async function verifyRequest(path: string, body: URLSearchParams) {
  if (!isTwilioVerifyConfigured) {
    throw new Error('Twilio Verify ayarları eksik.');
  }

  const serviceSid = await resolveVerifyServiceSid();
  const response = await fetch(
    `https://verify.twilio.com/v2/Services/${serviceSid}/${path}`,
    {
      method: 'POST',
      headers: {
        Authorization: authorizationHeader(),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    },
  );
  const payload = await response.json().catch(() => null) as TwilioVerifyPayload | null;

  if (!response.ok) {
    throw new Error(verifyFailureMessage(response.status, payload));
  }

  return payload ?? {};
}

export async function startTwilioVerification(phone: string) {
  const payload = await verifyRequest('Verifications', new URLSearchParams({
    To: normalizeVerifyPhone(phone),
    Channel: 'sms',
    Locale: 'tr',
  }));
  const status = typeof payload.status === 'string' ? payload.status : '';

  if (status !== 'pending') {
    throw new Error(`Twilio Verify kod gönderimini başlatamadı (${status || 'bilinmeyen durum'}).`);
  }
}

export async function checkTwilioVerification(phone: string, code: string) {
  const payload = await verifyRequest('VerificationCheck', new URLSearchParams({
    To: normalizeVerifyPhone(phone),
    Code: code,
  }));

  return payload.status === 'approved' && payload.valid === true;
}
