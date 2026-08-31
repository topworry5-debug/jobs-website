import '../styles/index.css';
import '../styles/components.css';
import { Inter, Outfit, JetBrains_Mono } from 'next/font/google';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans'
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

export const metadata = {
  metadataBase: new URL('https://rozgar.pk'),
  title: {
    default: "RozgarPK — Pakistan's #1 Verified Jobs & Exam Intelligence Portal",
    template: "%s | RozgarPK"
  },
  description: "Find verified Federal & Provincial Government jobs (FPSC, PPSC, SPSC, KPPSC, NTS), high-growth tech careers, competitive exam schedules, past papers, and build ATS-ready resumes.",
  keywords: [
    "Government Jobs in Pakistan", "FPSC Jobs 2026", "PPSC Jobs 2026", "NTS Jobs", 
    "SPSC Jobs", "KPPSC Jobs", "IT Jobs Lahore", "Software Engineer Karachi", 
    "Islamabad Jobs", "CSS Exam 2027", "BPS-17 Jobs", "Rozgar PK"
  ],
  authors: [{ name: "RozgarPK Intelligence Team" }],
  creator: "RozgarPK",
  publisher: "RozgarPK",
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
    url: 'https://rozgar.pk',
    siteName: 'RozgarPK',
    title: "RozgarPK — Pakistan's #1 Verified Jobs & Exam Intelligence Portal",
    description: "Official Federal & Provincial Public Service Commission intelligence, private tech careers, and ATS resume tools.",
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'RozgarPK Job Intelligence' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: "RozgarPK — Verified Jobs in Pakistan",
    description: "FPSC, PPSC, SPSC, KPPSC, and Tech jobs in Pakistan with verified application links.",
    creator: '@rozgarpk'
  },
  alternates: {
    canonical: 'https://rozgar.pk'
  }
};

export const viewport = {
  themeColor: '#064e3b',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

import ClientProviders from '../components/ClientProviders';

export default function RootLayout({ children }) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "RozgarPK",
    "url": "https://rozgar.pk",
    "logo": "https://rozgar.pk/logo.png",
    "description": "Pakistan's leading career intelligence authority for verified Government and Private/IT jobs.",
    "foundingLocation": "Islamabad, Pakistan",
    "areaServed": {
      "@type": "Country",
      "name": "Pakistan"
    },
    "sameAs": [
      "https://twitter.com/rozgarpk",
      "https://linkedin.com/company/rozgarpk"
    ]
  };

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "RozgarPK",
    "url": "https://rozgar.pk",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://rozgar.pk/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html 
      lang="en" 
      data-theme="dark" 
      className={`${inter.variable} ${outfit.variable} ${jetbrainsMono.variable}`}
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
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
