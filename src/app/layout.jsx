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
    default: "Tainaati — Government Jobs & Exam Portal in Pakistan",
    template: "%s | Tainaati"
  },
  description: "Find verified Federal & Provincial Government jobs (FPSC, PPSC, SPSC, KPPSC, NTS), competitive exam schedules, syllabus guidelines, and ATS-ready resume tools.",
  authors: [{ name: "Tainaati Editorial" }],
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
    title: "Tainaati — Government Jobs & Exam Portal in Pakistan",
    description: "Federal & Provincial Public Service Commission job notices, official gazette links, exam schedules, and resume tools.",
    images: [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630, alt: 'Tainaati Jobs and Exams' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: "Tainaati — Government Jobs in Pakistan",
    description: "FPSC, PPSC, SPSC, KPPSC, and NTS jobs in Pakistan with official application links.",
    images: [`${siteUrl}/og-image.png`],
    creator: '@tainaati'
  },
  alternates: {
    canonical: siteUrl
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/icon.png'
  }
};

export const viewport = {
  themeColor: '#064e3b',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html 
      lang="en" 
      data-theme="dark" 
      className={`${inter.variable} ${fraunces.variable} ${outfit.variable} ${jetbrainsMono.variable} ${notoNaskhArabic.variable}`}
    >
      <body>
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
