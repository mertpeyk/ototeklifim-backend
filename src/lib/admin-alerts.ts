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
  compact?: boolean;
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

export function buildApplicationAlertMessage(input: NewApplicationAlertInput) {
  const applicationType = input.type === 'hizli-sat' ? 'hızlı satış' : 'konsinye';
  const lines = [
    `${input.compact ? '🚗 ' : ''}Yeni ${applicationType} başvurusu`,
    `Talep No: ${input.referenceNo}`,
    `Müşteri: ${input.customerName}`,
    `Telefon: ${input.customerPhone || '-'}`,
    `Araç: ${input.vehicleSummary}`,
  ];

  if (!input.compact) {
    lines.splice(4, 0, `E-posta: ${input.customerEmail || '-'}`);
  }

  if (!input.compact && input.city) {
    lines.push(`Konum: ${input.city}${input.district ? ` / ${input.district}` : ''}`);
  }

  if (input.details?.length) {
    lines.push(...input.details);
  }

  lines.push('Admin panelinden kontrol edebilirsin.');

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
