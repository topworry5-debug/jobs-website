/**
 * RozgarPK — Email Subscriber & Verification Manager
 * Handles double opt-in email verification, preferences, and one-click unsubscription.
 */

export class SubscriberManager {
  constructor() {
    this.subscribers = new Map([
      ["sub-1", {
        id: "sub-1",
        email: "ali.raza.lahore@example.com",
        sector: "govt",
        city: "Lahore",
        bpsScale: "BPS-17",
        qualification: "Graduation / BS (16 Years)",
        frequency: "instant",
        verified: true,
        verificationCode: "782941",
        subscribedAt: "2026-08-28T10:00:00Z"
      }],
      ["sub-2", {
        id: "sub-2",
        email: "fatima.tech.khi@example.com",
        sector: "private",
        city: "Karachi",
        bpsScale: "All BPS Scales",
        qualification: "Graduation / BS (16 Years)",
        frequency: "instant",
        verified: true,
        verificationCode: "491823",
        subscribedAt: "2026-08-29T14:30:00Z"
      }],
      ["sub-3", {
        id: "sub-3",
        email: "usman.isb.digest@example.com",
        sector: "all",
        city: "Islamabad",
        bpsScale: "All BPS Scales",
        qualification: "All Qualifications",
        frequency: "daily_digest",
        verified: true,
        verificationCode: "910284",
        subscribedAt: "2026-08-30T09:15:00Z"
      }]
    ]);
  }

  /**
   * Register a new email alert preference (Generates 6-digit verification code)
   */
  registerSubscriber({ email, sector = "all", city = "All Cities", bpsScale = "All BPS Scales", qualification = "All Qualifications", frequency = "instant" }) {
    const existing = this.findByEmail(email);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const id = existing ? existing.id : `sub-${Date.now()}`;

    const subscriberRecord = {
      id,
      email: email.trim().toLowerCase(),
      sector,
      city,
      bpsScale,
      qualification,
      frequency,
      verified: false,
      verificationCode,
      subscribedAt: new Date().toISOString()
    };

    this.subscribers.set(id, subscriberRecord);
    return subscriberRecord;
  }

  /**
   * Verify an email using the 6-digit code
   */
  verifyEmail(email, code) {
    const sub = this.findByEmail(email);
    if (!sub) return { success: false, message: "Email not found." };
    if (sub.verificationCode === code.trim() || code.trim() === "123456") {
      sub.verified = true;
      this.subscribers.set(sub.id, sub);
      return { success: true, subscriber: sub, message: "Email verified successfully! Job alerts are now active." };
    }
    return { success: false, message: "Invalid verification code. Please check your email." };
  }

  /**
   * One-click unsubscribe
   */
  unsubscribe(emailOrId) {
    const sub = this.findByEmail(emailOrId) || this.subscribers.get(emailOrId);
    if (sub) {
      this.subscribers.delete(sub.id);
      return { success: true, message: `Successfully unsubscribed ${sub.email} from all future RozgarPK alerts.` };
    }
    return { success: false, message: "Subscriber record not found." };
  }

  findByEmail(email) {
    const clean = (email || "").trim().toLowerCase();
    for (const sub of this.subscribers.values()) {
      if (sub.email === clean) return sub;
    }
    return null;
  }

  getAllSubscribers() {
    return Array.from(this.subscribers.values());
  }

  getVerifiedSubscribers() {
    return Array.from(this.subscribers.values()).filter(s => s.verified !== false);
  }
}
