import React from 'react';
import BpsSalaryCalculator from '../../components/BpsSalaryCalculator';
import { generateBreadcrumbSchema } from '../../utils/seoHelpers';
import { getSiteUrl } from '../../utils/siteUrl';

const siteUrl = getSiteUrl();

export const metadata = {
  title: "BPS Pay Scale Salary Calculator 2026 — Government of Pakistan Pay Scales (BPS-1 to BPS-22)",
  description: "Calculate monthly salary and allowance breakdowns for Government of Pakistan civil service positions (BPS-1 to BPS-22). Basic pay, House Rent, Medical, Conveyance, and Adhoc Relief allowances.",
  alternates: {
    canonical: `${siteUrl}/salary-calculator`
  },
  openGraph: {
    title: "BPS Pay Scale Salary Calculator 2026 — Government of Pakistan",
    description: "Official BPS Grade 1 to 22 salary calculation engine with house rent, adhoc relief, and net take-home estimates.",
    url: `${siteUrl}/salary-calculator`,
    images: [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630 }]
  }
};

export default function SalaryCalculatorPage() {
  const currentUrl = getSiteUrl();
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: `${currentUrl}` },
    { name: "Tools", url: `${currentUrl}` },
    { name: "BPS Salary Calculator", url: `${currentUrl}/salary-calculator` }
  ]);

  return (
    <div className="py-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <BpsSalaryCalculator />
    </div>
  );
}
