import { getSiteUrl } from '../../utils/siteUrl';

const siteUrl = getSiteUrl();

export const metadata = {
  title: 'Contact Editorial Desk & Support | Tainaati',
  description: 'Contact the Tainaati editorial desk for recruitment inquiries, advertisement source corrections, or technical support.',
  alternates: {
    canonical: `${siteUrl}/contact`
  },
  openGraph: {
    title: 'Contact Editorial Desk & Support | Tainaati',
    description: 'Contact the Tainaati editorial desk for recruitment inquiries, advertisement source corrections, or technical support.',
    url: `${siteUrl}/contact`,
    images: [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630 }]
  }
};

export default function ContactLayout({ children }) {
  return children;
}
