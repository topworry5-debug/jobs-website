import React from 'react';
import AlertsManager from '../../components/AlertsManager';
import { generateBreadcrumbSchema } from '../../utils/seoHelpers';
import { Mail, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: "Verified Email Job Alerts in Pakistan (FPSC, PPSC & Tech)",
  description: "Subscribe to verified Pakistani job alerts via email. Double opt-in confirmation, zero spam, instant match or daily digest with one-click unsubscribe.",
  alternates: {
    canonical: "https://rozgar.pk/alerts"
  }
};

export default function AlertsPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://rozgar.pk" },
    { name: "Email Alerts", url: "https://rozgar.pk/alerts" }
  ]);

  return (
    <div className="py-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <AlertsManager />
    </div>
  );
}
