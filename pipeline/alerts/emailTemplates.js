/**
 * Tainaati — Transactional Email Templates (Responsive & High-Deliverability)
 * Matches Tainaati Brand Identity: Institutional Emerald Green, Dark Slate, Clean Sans-Serif.
 */

export function generateVerificationEmail(email, verificationCode, verifyUrl) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm Your Tainaati Job Alerts</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0f172a; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.3);">
          <!-- Header -->
          <tr>
            <td style="background-color: #064e3b; padding: 30px; text-align: center;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <span style="display: inline-block; background-color: #059669; color: #ffffff; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">Official Job Intelligence</span>
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">Tainaa<span style="color: #fbbf24;">ti</span></h1>
                    <p style="color: #a7f3d0; margin: 6px 0 0 0; font-size: 13px;">Pakistan's #1 Verified Jobs & Career Portal</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 35px 30px;">
              <h2 style="color: #0f172a; font-size: 20px; font-weight: 700; margin: 0 0 16px 0;">Verify Your Email Address</h2>
              <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0;">
                You recently requested to receive automated job alerts for <strong>${email}</strong> on Tainaati. To activate matching notifications for official government and high-growth private openings, please confirm your address.
              </p>

              <!-- Verification Code Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                <tr>
                  <td align="center" style="background-color: #f0fdf4; border: 2px dashed #059669; border-radius: 8px; padding: 20px;">
                    <div style="font-size: 12px; color: #065f46; font-weight: 600; text-transform: uppercase; margin-bottom: 6px;">Your 6-Digit Verification Code</div>
                    <div style="font-size: 32px; font-family: monospace; font-weight: 800; letter-spacing: 6px; color: #064e3b;">${verificationCode}</div>
                  </td>
                </tr>
              </table>

              <!-- Action Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="${verifyUrl}" style="display: inline-block; background-color: #059669; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 15px; font-weight: 700; letter-spacing: 0.3px;">Confirm Alert Subscription</a>
                  </td>
                </tr>
              </table>

              <p style="color: #64748b; font-size: 13px; line-height: 1.5; margin: 0;">
                If you did not request this email, you can safely ignore it. No job alerts will be sent without verification.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 30px; text-align: center;">
              <p style="color: #94a3b8; font-size: 12px; margin: 0 0 8px 0;">
                Tainaati • Federal & Provincial Public Service Commission Intelligence
              </p>
              <p style="color: #94a3b8; font-size: 11px; margin: 0;">
                Islamabad, Lahore, Karachi, Pakistan
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export function generateSingleJobAlertEmail(job, recipientEmail, unsubscribeUrl, manageUrl) {
  const isGovt = job.type === 'govt';
  const badgeColor = isGovt ? '#059669' : '#4f46e5';
  const badgeBg = isGovt ? '#ecfdf5' : '#eef2ff';
  const categoryLabel = isGovt ? `Government • ${job.bpsScale || 'Gazetted'}` : 'Private & IT Sector';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Verified Job Alert: ${job.title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0f172a; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.3);">
          <!-- Header -->
          <tr>
            <td style="background-color: #064e3b; padding: 25px 30px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 800;">Tainaa<span style="color: #fbbf24;">ti</span> <span style="font-size: 13px; font-weight: 400; color: #a7f3d0; margin-left: 8px;">• Instant Verified Job Alert</span></h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 30px;">
              <!-- Sector Badge -->
              <span style="display: inline-block; background-color: ${badgeBg}; color: ${badgeColor}; border: 1px solid ${badgeColor}; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 12px;">
                ${categoryLabel}
              </span>

              <h2 style="color: #0f172a; font-size: 22px; font-weight: 800; line-height: 1.3; margin: 0 0 12px 0;">
                ${job.title}
              </h2>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #334155;">
                    <strong>Department:</strong> ${job.department || job.company}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #334155;">
                    <strong>Location:</strong> ${job.city}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #334155;">
                    <strong>Total Vacancies:</strong> ${job.vacancies || 1}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #dc2626; font-weight: 700;">
                    <strong>Deadline to Apply:</strong> ${job.lastDate}
                  </td>
                </tr>
              </table>

              <!-- Action Links -->
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                <tr>
                  <td>
                    <a href="${job.officialUrl || 'https://tainaati.com'}" target="_blank" style="display: inline-block; background-color: #059669; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-size: 14px; font-weight: 700; margin-right: 12px;">
                      Apply on Official Portal &rarr;
                    </a>
                  </td>
                  <td>
                    <a href="https://tainaati.com/jobs/${job.id}" target="_blank" style="display: inline-block; background-color: #f1f5f9; color: #334155; text-decoration: none; padding: 12px 20px; border-radius: 8px; font-size: 14px; font-weight: 600;">
                      View Details
                    </a>
                  </td>
                </tr>
              </table>

              <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 12px; color: #64748b; line-height: 1.5;">
                <strong>Official Verification Note:</strong> This notice was cross-checked directly against official government circulars and employer registries.
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 30px; text-align: center;">
              <p style="color: #64748b; font-size: 12px; margin: 0 0 8px 0;">
                You received this verified alert because you subscribed on Tainaati (${recipientEmail}).
              </p>
              <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                <a href="${manageUrl}" style="color: #059669; text-decoration: underline; margin-right: 12px;">Update Preferences</a>
                <a href="${unsubscribeUrl}" style="color: #dc2626; text-decoration: underline;">Unsubscribe Instantly</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export function generateDigestAlertEmail(jobs, recipientEmail, unsubscribeUrl, manageUrl) {
  const jobsListHtml = jobs.map((job, idx) => {
    const isGovt = job.type === 'govt';
    const tag = isGovt ? `[${job.bpsScale || 'Govt'}]` : `[Private]`;

    return `
      <tr>
        <td style="padding: 16px; border-bottom: ${idx === jobs.length - 1 ? 'none' : '1px solid #e2e8f0'};">
          <div style="font-size: 11px; font-weight: 700; color: ${isGovt ? '#059669' : '#4f46e5'}; text-transform: uppercase; margin-bottom: 4px;">
            ${tag} ${job.agency || job.category || 'Tainaati'}
          </div>
          <h3 style="margin: 0 0 6px 0; font-size: 16px; font-weight: 700; color: #0f172a;">
            <a href="${job.officialUrl || 'https://tainaati.com'}" target="_blank" style="color: #0f172a; text-decoration: none;">
              ${job.title}
            </a>
          </h3>
          <div style="font-size: 13px; color: #475569; margin-bottom: 6px;">
            🏢 ${job.department || job.company} • 📍 ${job.city}
          </div>
          <div style="font-size: 12px; color: #dc2626; font-weight: 600;">
            ⏳ Deadline: ${job.lastDate}
          </div>
        </td>
      </tr>
    `;
  }).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tainaati Daily Jobs Digest (${jobs.length} Verified Matches)</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0f172a; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.3);">
          <!-- Header -->
          <tr>
            <td style="background-color: #064e3b; padding: 30px; text-align: center;">
              <span style="display: inline-block; background-color: #059669; color: #ffffff; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Daily 8:00 AM Digest</span>
              <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800;">Tainaa<span style="color: #fbbf24;">ti</span> Job Intelligence</h1>
              <p style="color: #a7f3d0; margin: 6px 0 0 0; font-size: 13px;">${jobs.length} new verified openings matching your career profile</p>
            </td>
          </tr>

          <!-- Jobs Table -->
          <tr>
            <td style="padding: 10px 20px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #ffffff;">
                ${jobsListHtml}
              </table>
            </td>
          </tr>

          <!-- CTA to Portal -->
          <tr>
            <td align="center" style="padding: 24px;">
              <a href="https://tainaati.com" target="_blank" style="display: inline-block; background-color: #059669; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 14px; font-weight: 700;">
                Explore All Opportunities on Tainaati &rarr;
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 30px; text-align: center;">
              <p style="color: #64748b; font-size: 12px; margin: 0 0 8px 0;">
                You received this daily digest because you subscribed on Tainaati (${recipientEmail}).
              </p>
              <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                <a href="${manageUrl}" style="color: #059669; text-decoration: underline; margin-right: 12px;">Update Preferences</a>
                <a href="${unsubscribeUrl}" style="color: #dc2626; text-decoration: underline;">Unsubscribe Instantly</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
