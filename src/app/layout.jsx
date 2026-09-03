import '../styles/index.css';
import '../styles/components.css';
import { Inter, Fraunces, Outfit, JetBrains_Mono, Noto_Naskh_Arabic } from 'next/font/google';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ClientProviders from '../components/ClientProviders';
import { Analytics } from '@vercel/analytics/next';
import { getSiteUrl } from '../utils/siteUrl';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans'
});

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
});

const outfit = Outfit({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display'
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono'
});

const notoNaskhArabic = Noto_Naskh_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-urdu'
});

const siteUrl = getSiteUrl();

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Tainaati — Pakistan's #1 Verified Jobs & Exam Intelligence Portal",
    template: "%s | Tainaati"
  },
  description: "Find verified Federal & Provincial Government jobs (FPSC, PPSC, SPSC, KPPSC, NTS), competitive exam schedules, syllabus guidelines, and ATS-ready resume tools.",
  keywords: [
    "Government Jobs in Pakistan", "FPSC Jobs 2026", "PPSC Jobs 2026", "NTS Jobs", 
    "SPSC Jobs", "KPPSC Jobs", "CSS Exam 2027", "BPS-17 Jobs", "Tainaati", "Tainaati Jobs"
  ],
  authors: [{ name: "Tainaati Intelligence Team" }],
  creator: "Tainaati",
  publisher: "Tainaati",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    url: siteUrl,
    siteName: 'Tainaati',
    title: "Tainaati — Pakistan's #1 Verified Jobs & Exam Intelligence Portal",
    description: "Official Federal & Provincial Public Service Commission intelligence, verified gazette notices, exam schedules, and ATS resume tools.",
    images: [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630, alt: 'Tainaati Job Intelligence' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: "Tainaati — Verified Jobs in Pakistan",
    description: "FPSC, PPSC, SPSC, KPPSC, and NTS jobs in Pakistan with verified official application links.",
    images: [`${siteUrl}/og-image.png`],
    creator: '@tainaati'
  },
  alternates: {
    canonical: siteUrl
  }
};

export const viewport = {
  themeColor: '#064e3b',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  const currentDomain = getSiteUrl();

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Tainaati",
    "url": currentDomain,
    "logo": `${currentDomain}/icons/logo.png`,
    "description": "Pakistan's leading career intelligence authority for verified Government and Private/IT jobs.",
    "foundingLocation": "Islamabad, Pakistan",
    "areaServed": {
      "@type": "Country",
      "name": "Pakistan"
    },
    "sameAs": [
      "https://twitter.com/tainaati",
      "https://linkedin.com/company/tainaati"
    ]
  };

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Tainaati",
    "url": currentDomain,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${currentDomain}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html 
      lang="en" 
      data-theme="dark" 
      className={`${inter.variable} ${fraunces.variable} ${outfit.variable} ${jetbrainsMono.variable} ${notoNaskhArabic.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
        />
        <ClientProviders>
          <div className="site-wrapper">
            <Navbar />
            <main className="main-content">
              {children}
            </main>
            <Footer />
          </div>
        </ClientProviders>
        <Analytics />
      </body>
    </html>
  );
}
