import { env } from '../config.js';

type TelegramPayload = {
  message: string;
  chatId?: string;
};

export type TelegramSendResult = {
  delivered: boolean;
  provider: 'log' | 'telegram';
};

function escapeTelegramMarkdown(value: string) {
  return value.replace(/([_*\[\]()~`>#+\-=|{}.!\\])/g, '\\$1');
}

export async function sendTelegramMessage({
  message,
  chatId = env.TELEGRAM_ALERT_CHAT_ID,
}: TelegramPayload): Promise<TelegramSendResult> {
  if (!chatId) {
    console.info(`[telegram] chat id missing -> ${message}`);
    return {
      delivered: false,
      provider: 'log',
    };
  }

  if (!env.TELEGRAM_BOT_TOKEN) {
    console.info(`[telegram:${chatId}] bot token missing -> ${message}`);
    return {
      delivered: false,
      provider: 'log',
    };
  }

  const response = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: escapeTelegramMarkdown(message),
      parse_mode: 'MarkdownV2',
      disable_web_page_preview: true,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Telegram bildirimi basarisiz: ${details}`);
  }

  return {
    delivered: true,
    provider: 'telegram',
  };
}
