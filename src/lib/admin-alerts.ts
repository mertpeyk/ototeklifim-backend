import { AccountType } from '@prisma/client';

import { env } from '../config.js';
import { prisma } from '../db.js';
import { sendTelegramMessage } from './telegram.js';
import { normalizeTurkeyPhone, sendWhatsapp } from './whatsapp.js';

type NewApplicationAlertInput = {
  type: 'hizli-sat' | 'konsinye';
  referenceNo: string;
  customerName: string;
  customerPhone?: string | null;
  customerEmail?: string | null;
  vehicleSummary: string;
  city?: string | null;
  district?: string | null;
  details?: string[];
};

async function resolveAlertPhone() {
  const envPhone = normalizeTurkeyPhone(env.WHATSAPP_ALERT_PHONE || env.ADMIN_PHONE);

  if (envPhone) {
    return envPhone;
  }

  const adminUser = await prisma.user.findFirst({
    where: {
      accountType: AccountType.ADMIN,
      phone: {
        not: null,
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
    select: {
      phone: true,
    },
  });

  return normalizeTurkeyPhone(adminUser?.phone);
}

function buildApplicationAlertMessage(input: NewApplicationAlertInput) {
  const lines = [
    `Yeni ${input.type} basvurusu geldi`,
    `No: ${input.referenceNo}`,
    `Musteri: ${input.customerName}`,
    `Telefon: ${input.customerPhone || '-'}`,
    `E-posta: ${input.customerEmail || '-'}`,
    `Arac: ${input.vehicleSummary}`,
  ];

  if (input.city) {
    lines.push(`Konum: ${input.city}${input.district ? ` / ${input.district}` : ''}`);
  }

  if (input.details?.length) {
    lines.push(...input.details);
  }

  lines.push('Admin panelden kontrol edebilirsin.');

  return lines.join('\n');
}

export async function notifyNewApplicationViaTelegram(input: NewApplicationAlertInput) {
  await sendTelegramMessage({
    message: buildApplicationAlertMessage(input),
  });
}

export async function notifyNewApplicationViaWhatsapp(input: NewApplicationAlertInput) {
  const targetPhone = await resolveAlertPhone();

  if (!targetPhone) {
    console.warn(`[whatsapp] admin hedef telefonu bulunamadi (${input.referenceNo})`);
    return;
  }

  await sendWhatsapp({
    phone: targetPhone,
    message: buildApplicationAlertMessage(input),
  });
}
