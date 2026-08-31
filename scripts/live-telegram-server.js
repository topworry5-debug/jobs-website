/**
 * RozgarPK — Live Telegram Bot Long-Polling Daemon
 * Connects to official Telegram Bot API (https://api.telegram.org/bot<TOKEN>/)
 * 
 * Usage:
 * 1. Create a free bot on Telegram via @BotFather (takes 60 seconds).
 * 2. Set your token: `export TELEGRAM_BOT_TOKEN="your_token_here"` (or create a .env file)
 * 3. Run: `node scripts/live-telegram-server.js`
 */

import { TelegramAlertsBot } from '../pipeline/alerts/telegramAlertsBot.js';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const TELEGRAM_API_BASE = `https://api.telegram.org/bot${BOT_TOKEN}`;

if (!BOT_TOKEN) {
  console.log("==================================================================");
  console.log("⚠️  TELEGRAM_BOT_TOKEN is not set.");
  console.log("To run the LIVE Telegram Bot listener:");
  console.log("1. Open Telegram and search for @BotFather");
  console.log("2. Send `/newbot`, choose a name (e.g., 'RozgarPK Job Alerts')");
  console.log("3. Choose a username (e.g., 'MyRozgarPKBot')");
  console.log("4. Copy the HTTP API Token provided by BotFather.");
  console.log("5. Run: TELEGRAM_BOT_TOKEN=\"your_token\" node scripts/live-telegram-server.js");
  console.log("==================================================================");
}

const botLogic = new TelegramAlertsBot(BOT_TOKEN);
let lastUpdateId = 0;

async function sendTelegramMessage(chatId, text) {
  if (!BOT_TOKEN) return;
  try {
    const res = await fetch(`${TELEGRAM_API_BASE}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: false
      })
    });
    return await res.json();
  } catch (err) {
    console.error(`[Telegram Error] Failed to send to ${chatId}:`, err.message);
  }
}

async function pollUpdates() {
  if (!BOT_TOKEN) return;

  try {
    const res = await fetch(`${TELEGRAM_API_BASE}/getUpdates?offset=${lastUpdateId + 1}&timeout=30`);
    const data = await res.json();

    if (data.ok && data.result.length > 0) {
      for (const update of data.result) {
        lastUpdateId = update.update_id;

        if (update.message && update.message.text) {
          const chatId = update.message.chat.id;
          const text = update.message.text;
          const username = update.message.from?.username || update.message.from?.first_name || "Candidate";

          console.log(`[Telegram Incoming] From @${username} (${chatId}): "${text}"`);
          
          const response = botLogic.handleIncomingCommand(String(chatId), text, username);
          await sendTelegramMessage(chatId, response.reply);
        }
      }
    }
  } catch (err) {
    console.error("[Telegram Poll Error]:", err.message);
  }

  setTimeout(pollUpdates, 2000);
}

if (BOT_TOKEN) {
  console.log(`[Telegram Live Bot] Starting polling for bot token: ${BOT_TOKEN.substring(0, 8)}...`);
  pollUpdates();
}
