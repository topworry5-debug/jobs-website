/**
 * Tainaati — Telegram Alerts Bot Engine (Zero-Cost Free Tier)
 * Connects to Telegram Bot API (https://api.telegram.org/bot<TOKEN>/...)
 * Handles conversational command flows for Pakistani job seekers.
 */

export class TelegramAlertsBot {
  constructor(botToken = "TAINAATI_BOT_TOKEN_DEV") {
    this.botToken = botToken;
    this.subscribers = new Map([
      ["chat-101", {
        chatId: "chat-101",
        username: "ali_raza_lahore",
        sector: "govt",
        city: "Lahore",
        bpsScale: "BPS-17",
        qualification: "Masters",
        channel: "telegram",
        frequency: "instant",
        subscribedAt: "2026-08-28T10:00:00Z"
      }],
      ["chat-102", {
        chatId: "chat-102",
        username: "fatima_tech_khi",
        sector: "private",
        city: "Karachi",
        bpsScale: "All Scales",
        qualification: "Bachelor",
        channel: "telegram",
        frequency: "instant",
        subscribedAt: "2026-08-29T14:30:00Z"
      }],
      ["chat-103", {
        chatId: "chat-103",
        username: "usman_isb",
        sector: "all",
        city: "Islamabad",
        bpsScale: "All Scales",
        qualification: "Any Qualification",
        channel: "telegram",
        frequency: "daily_digest",
        subscribedAt: "2026-08-30T09:15:00Z"
      }]
    ]);
  }

  handleIncomingCommand(chatId, text, username = "JobSeeker") {
    const cleanText = text.trim().toLowerCase();

    // 1. /start command
    if (cleanText.startsWith('/start')) {
      const existing = this.subscribers.get(chatId);
      if (!existing) {
        this.subscribers.set(chatId, {
          chatId,
          username,
          sector: "all",
          city: "All Pakistan",
          bpsScale: "All Scales",
          qualification: "Any Qualification",
          channel: "telegram",
          frequency: "instant",
          subscribedAt: new Date().toISOString()
        });
      }

      return {
        reply: `
🇵🇰 <b>Welcome to Tainaati Automated Job Alerts Bot!</b>

You are now connected to Pakistan's fastest official government & private job alerts system.

<b>Your Current Preferences:</b>
• <b>Sector:</b> ${this.subscribers.get(chatId)?.sector.toUpperCase()}
• <b>City:</b> ${this.subscribers.get(chatId)?.city}
• <b>Scale:</b> ${this.subscribers.get(chatId)?.bpsScale}
• <b>Frequency:</b> ${this.subscribers.get(chatId)?.frequency}

<b>Available Bot Commands:</b>
/govt — Receive ONLY Federal & Provincial Govt openings (FPSC/PPSC)
/private — Receive ONLY Software, IT & Corporate jobs
/lahore or /karachi or /islamabad — Filter by your city
/digest — Switch to daily 8:00 AM PST summary
/stop — Unsubscribe and pause all alerts
`.trim(),
        userState: this.subscribers.get(chatId)
      };
    }

    // 2. /govt or /private sector toggles
    if (cleanText === '/govt') {
      const sub = this.subscribers.get(chatId) || { chatId, username };
      sub.sector = 'govt';
      this.subscribers.set(chatId, sub);
      return {
        reply: `✅ <b>Updated!</b> You will now receive verified <b>Government Jobs only</b> (FPSC, PPSC, SPSC, KPPSC, NTS).`,
        userState: sub
      };
    }

    if (cleanText === '/private') {
      const sub = this.subscribers.get(chatId) || { chatId, username };
      sub.sector = 'private';
      this.subscribers.set(chatId, sub);
      return {
        reply: `✅ <b>Updated!</b> You will now receive verified <b>Private & Tech Jobs only</b>.`,
        userState: sub
      };
    }

    // 3. /stop or /unsubscribe
    if (cleanText === '/stop' || cleanText === '/unsubscribe') {
      this.subscribers.delete(chatId);
      return {
        reply: `🛑 <b>Alerts Paused.</b> You will no longer receive job notifications. Type <code>/start</code> anytime to reactivate for free.`,
        userState: null
      };
    }

    // Default fallback
    return {
      reply: `ℹ️ <b>Command Received.</b> Type <code>/start</code> to review your profile, or <code>/govt</code> / <code>/private</code> to adjust filters.`,
      userState: this.subscribers.get(chatId)
    };
  }

  getAllSubscribers() {
    return Array.from(this.subscribers.values());
  }
}
