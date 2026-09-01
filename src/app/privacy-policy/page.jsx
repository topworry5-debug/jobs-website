import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Eye, FileText, Database, Server, RefreshCw, Mail, ArrowLeft } from 'lucide-react';
import { getSiteUrl } from '../../utils/siteUrl';

const siteUrl = getSiteUrl();

export const metadata = {
  title: "Privacy Policy — RozgarPK",
  description: "Read the official RozgarPK Privacy Policy. Learn how we handle job alerts, local CV data, cookies, and ensure candidate privacy.",
  alternates: {
    canonical: `${siteUrl}/privacy-policy`
  },
  openGraph: {
    title: "Privacy Policy — RozgarPK",
    description: "Read the official RozgarPK Privacy Policy.",
    url: `${siteUrl}/privacy-policy`,
    images: [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630 }]
  }
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container-xl py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-secondary hover:text-primary transition-colors">
            <ArrowLeft size={14} />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Header Hero */}
        <div className="card p-6 md:p-8 legal-hero-card">
          <div className="flex items-center gap-2 mb-3">
            <span className="badge badge-verified">
              <ShieldCheck size={14} />
              <span>Official Policy Document</span>
            </span>
            <span className="text-xs text-muted">Last Updated: September 1, 2026</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-primary mb-3">
            Privacy Policy
          </h1>
          <p className="text-secondary text-sm md:text-base leading-relaxed">
            At RozgarPK (accessible from <Link href="/" className="text-emerald-500 font-semibold underline">https://rozgar.pk</Link>), 
            we value your trust and are committed to safeguarding candidate data. This Privacy Policy details our operational data practices, 
            cookie usage, and local processing guarantees.
          </p>
        </div>

        {/* Content Body */}
        <div className="card p-6 md:p-8 space-y-6 text-secondary leading-relaxed">
          {/* Section 1 */}
          <section className="legal-section-block">
            <h2 className="legal-heading-flex">
              <Eye size={20} className="text-emerald-500 flex-shrink-0" />
              <span>1. Information We Collect & How It Is Handled</span>
            </h2>
            <p>
              RozgarPK is designed from the ground up as a privacy-respecting career intelligence index. We minimize personal data collection to the minimum required for user-initiated tools:
            </p>
            <ul className="legal-list-bulleted">
              <li>
                <strong>Email Alert Subscriptions:</strong> When you subscribe to job alerts, we collect your email address and your chosen preference filters (e.g., Federal FPSC, Punjab PPSC, Sindh SPSC, or Software & IT). This information is solely used to send verified job notices matching your selected criteria. Every email alert includes an instant one-click unsubscribe mechanism.
              </li>
              <li>
                <strong>ATS CV Builder Data (100% Client-Side):</strong> Data entered into the RozgarPK ATS CV Builder (including your name, contact details, education, and work history) is processed <strong>strictly on your local browser</strong>. We do not transmit, save, or store your CV contents on our servers or in any remote database. When you download or print your resume as a PDF, the document is generated directly within your browser session.
              </li>
              <li>
                <strong>Local User Preferences:</strong> We use your browser&apos;s standard <code className="text-xs bg-surface-subtle px-1.5 py-0.5 rounded font-mono">localStorage</code> to remember your UI preferences—such as your Dark/Light theme mode (<code className="text-xs bg-surface-subtle px-1.5 py-0.5 rounded font-mono">rozgar_theme</code>), language selection (<code className="text-xs bg-surface-subtle px-1.5 py-0.5 rounded font-mono">rozgar_lang</code>), and bookmarked job IDs (<code className="text-xs bg-surface-subtle px-1.5 py-0.5 rounded font-mono">rozgar_saved_jobs</code>).
              </li>
              <li>
                <strong>Technical Server Logs:</strong> Like standard web infrastructure, our hosting environment (Vercel) automatically logs anonymous technical metadata (including your IP address, browser type, referring URLs, and timestamp) for cybersecurity auditing, DDoS mitigation, and server performance monitoring.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-primary flex items-center gap-2 border-b border-subtle pb-2">
              <Lock size={18} className="text-emerald-500" />
              2. Cookies & Advertising (Google AdSense Disclosure)
            </h2>
            <p>
              Cookies are small text files placed on your device to maintain site functionality and enhance your user experience:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li>
                <strong>Essential Functional Cookies:</strong> Used solely to preserve your visual theme preference (Dark or Light Mode) and language orientation (English, Urdu RTL, or Roman Urdu).
              </li>
              <li>
                <strong>Third-Party & Advertising Partners (Google AdSense):</strong> Third-party vendors, including Google, may use cookies (such as the DoubleClick DART cookie) to serve relevant advertisements based on a user&apos;s prior visits to this website or other websites across the internet.
              </li>
              <li>
                <strong>Opt-Out Choices:</strong> Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-emerald-500 underline font-medium">Google Ads Settings</a> or by visiting <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-emerald-500 underline font-medium">www.aboutads.info</a>.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-primary flex items-center gap-2 border-b border-subtle pb-2">
              <Server size={18} className="text-emerald-500" />
              3. Outbound Links to Official Government Portals
            </h2>
            <p>
              RozgarPK links directly to official government commission portals (e.g., <code className="text-xs bg-surface-subtle px-1.5 py-0.5 rounded font-mono">online.fpsc.gov.pk</code>, <code className="text-xs bg-surface-subtle px-1.5 py-0.5 rounded font-mono">ppsc.gop.pk</code>, <code className="text-xs bg-surface-subtle px-1.5 py-0.5 rounded font-mono">spsc.gos.pk</code>, <code className="text-xs bg-surface-subtle px-1.5 py-0.5 rounded font-mono">nts.org.pk</code>). We do not control and are not responsible for the privacy practices, cookie policies, or content of external government websites. We encourage candidates to review the privacy notices of external portals before submitting personal application documents or fee challans.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-primary flex items-center gap-2 border-b border-subtle pb-2">
              <Database size={18} className="text-emerald-500" />
              4. Data Retention & Your Rights
            </h2>
            <p>
              You maintain full ownership and control of your personal data:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li>
                <strong>Right to Unsubscribe:</strong> You can cancel your email alert subscription at any time using the unsubscribe link at the bottom of every email alert.
              </li>
              <li>
                <strong>Right to Deletion:</strong> You may request complete erasure of your email address from our subscriber store by emailing <a href="mailto:privacy@rozgar.pk" className="text-emerald-500 font-semibold underline">privacy@rozgar.pk</a>. Requests are fulfilled within 48 business hours.
              </li>
              <li>
                <strong>Local Browser Storage:</strong> You can clear your bookmarked jobs and theme preferences at any time by clearing your browser cookies and site data.
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-primary flex items-center gap-2 border-b border-subtle pb-2">
              <Mail size={18} className="text-emerald-500" />
              5. Contact Our Data Protection Team
            </h2>
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy, please contact our data integrity team:
            </p>
            <div className="bg-surface-subtle p-4 rounded-lg border border-subtle text-sm">
              <p className="font-bold text-primary">RozgarPK Privacy & Compliance Desk</p>
              <p>Email: <a href="mailto:privacy@rozgar.pk" className="text-emerald-500 font-medium underline">privacy@rozgar.pk</a></p>
              <p>Contact Form: <Link href="/contact" className="text-emerald-500 font-medium underline">https://rozgar.pk/contact</Link></p>
              <p className="text-xs text-muted mt-2">Islamabad, Islamic Republic of Pakistan</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
