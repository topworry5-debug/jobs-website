import { getSiteUrl } from '../../utils/siteUrl';

const siteUrl = getSiteUrl();

export const metadata = {
  title: "Contact Desk & Verification Inquiries — Tainaati",
  description: "Contact Tainaati support for official job advertisement corrections, verification inquiries, and candidate assistance.",
  alternates: {
    canonical: `${siteUrl}/contact`
  },
  openGraph: {
    title: "Contact Desk & Verification Inquiries — Tainaati",
    description: "Contact Tainaati support for job verification inquiries and candidate assistance.",
    url: `${siteUrl}/contact`,
    images: [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630 }]
  }
};

export default function ContactLayout({ children }) {
  return children;
}
