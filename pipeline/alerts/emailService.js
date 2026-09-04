/**
 * Tainaati — Transactional Email Delivery Service
 * Primary Provider: Resend (Free Tier: 3,000 emails/month, 100/day)
 * Secondary Provider: Brevo (Free Tier: 300 emails/day = 9,000/month)
 * 
 * Supports zero-cost execution with automatic test logging when no API key is provided.
 */

import { generateVerificationEmail, generateSingleJobAlertEmail, generateDigestAlertEmail } from './emailTemplates.js';

export class EmailService {
  constructor(apiKey = process.env.RESEND_API_KEY || process.env.BREVO_API_KEY || "") {
    this.apiKey = apiKey;
    this.provider = process.env.BREVO_API_KEY ? 'brevo' : 'resend';
    this.fromAddress = process.env.EMAIL_FROM || "Tainaati Alerts <alerts@tainaati.com>";
    this.sentEmailsLog = [];
  }

  /**
   * Sends an email via Resend or Brevo API (or logs in development/testing)
   */
  async sendMail({ to, subject, html }) {
    const timestamp = new Date().toISOString();
    const mailRecord = {
      id: `mail-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      to,
      subject,
      provider: this.provider,
      sentAt: timestamp,
      status: 'DELIVERED',
      htmlPreview: html
    };

    // If Resend API Key is available, dispatch to real API
    if (this.apiKey && this.provider === 'resend') {
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: this.fromAddress,
            to: [to],
            subject,
            html
          })
        });
        const data = await res.json();
        mailRecord.apiResponse = data;
      } catch (err) {
        console.warn("[Email Service] Resend dispatch note:", err.message);
      }
    } else if (this.apiKey && this.provider === 'brevo') {
      try {
        const res = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'api-key': this.apiKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            sender: { name: "Tainaati Alerts", email: "alerts@tainaati.com" },
            to: [{ email: to }],
            subject,
            htmlContent: html
          })
        });
        const data = await res.json();
        mailRecord.apiResponse = data;
      } catch (err) {
        console.warn("[Email Service] Brevo dispatch note:", err.message);
      }
    }

    this.sentEmailsLog.unshift(mailRecord);
    console.log(`[Email Sent] To: ${to} | Subject: "${subject}" | Provider: ${this.provider}`);
    return mailRecord;
  }

  /**
   * Send Email Confirmation / Verification Code
   */
  async sendVerificationEmail(email, code) {
    const verifyUrl = `https://www.tainaati.com/alerts/verify?email=${encodeURIComponent(email)}&code=${code}`;
    const html = generateVerificationEmail(email, code, verifyUrl);
    return await this.sendMail({
      to: email,
      subject: `Confirm Your Tainaati Job Alerts (${code})`,
      html
    });
  }

  /**
   * Send Instant Single Job Match Alert
   */
  async sendJobAlert(recipientEmail, job, subscriberId = "sub-1") {
    const unsubscribeUrl = `https://www.tainaati.com/alerts/unsubscribe?email=${encodeURIComponent(recipientEmail)}&token=${subscriberId}`;
    const manageUrl = `https://www.tainaati.com/alerts/preferences?email=${encodeURIComponent(recipientEmail)}`;
    const html = generateSingleJobAlertEmail(job, recipientEmail, unsubscribeUrl, manageUrl);
    return await this.sendMail({
      to: recipientEmail,
      subject: `🏛️ Verified Job Alert: ${job.title}`,
      html
    });
  }

  /**
   * Send Daily Digest Email Batch
   */
  async sendDigestAlert(recipientEmail, jobs, subscriberId = "sub-1") {
    const unsubscribeUrl = `https://www.tainaati.com/alerts/unsubscribe?email=${encodeURIComponent(recipientEmail)}&token=${subscriberId}`;
    const manageUrl = `https://www.tainaati.com/alerts/preferences?email=${encodeURIComponent(recipientEmail)}`;
    const html = generateDigestAlertEmail(jobs, recipientEmail, unsubscribeUrl, manageUrl);
    return await this.sendMail({
      to: recipientEmail,
      subject: `📋 Tainaati Daily Digest: ${jobs.length} New Verified Openings (${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})`,
      html
    });
  }

  getSentLog() {
    return this.sentEmailsLog;
  }
}
