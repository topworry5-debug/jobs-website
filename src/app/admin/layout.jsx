import React from 'react';

export const metadata = {
  title: "Admin & Pipeline Telemetry — Tainaati",
  description: "Internal administrative portal for Tainaati pipeline monitoring and job verification.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'none',
      'max-snippet': -1,
    }
  }
};

export default function AdminLayout({ children }) {
  return children;
}
