import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BLOG_ARTICLES, BLOG_CLUSTERS } from '../../data/blogData';
import BlogClientHub from '../../components/BlogClientHub';
import SectionBadge from '../../components/SectionBadge';
import { generateBreadcrumbSchema } from '../../utils/seoHelpers';
import { BookOpen, Sparkles, TrendingUp, ShieldCheck, ArrowRight } from 'lucide-react';
import { getSiteUrl } from '../../utils/siteUrl';

const siteUrl = getSiteUrl();

export const metadata = {
  title: "Career Guides & Exam Intelligence Hub (PPSC, FPSC & Govt Jobs) | Tainaati",
  description: "Comprehensive, fact-checked guides on PPSC, FPSC, NJP, and Government of Pakistan recruitment processes, syllabus patterns, challan payment, and exam preparation.",
  alternates: {
    canonical: `${siteUrl}/blog`
  },
  openGraph: {
    title: "Career Guides & Exam Intelligence Hub | Tainaati",
    description: "Fact-checked guides on PPSC, FPSC, NJP recruitment processes, syllabus, and exam preparation.",
    url: `${siteUrl}/blog`,
    images: [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630 }]
  }
};

export default function BlogIndexPage() {
  const currentUrl = getSiteUrl();
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: `${currentUrl}` },
    { name: "Career Guides & Blog", url: `${currentUrl}/blog` }
  ]);

  const featuredArticle = BLOG_ARTICLES[0];

  return (
    <div className="container-xl py-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero Header */}
      <div className="blog-hero-header bg-gradient-subtle border-emerald-subtle">
        <div className="blog-trust-badges">
          <SectionBadge variant="govt" size="sm" icon={BookOpen}>
            Official Knowledge Hub
          </SectionBadge>
          <SectionBadge variant="verified" size="sm" icon={ShieldCheck}>
            Fact-Checked & Gazette Verified
          </SectionBadge>
        </div>

        <h1 className="blog-hero-title font-display">
          Pakistani Public Service & Career Intelligence Guides
        </h1>
        <p className="blog-hero-desc leading-relaxed">
          Master the official application procedures, syllabus breakdowns, 1Link PSID challan steps, and exam strategies across Federal (FPSC) and Provincial Commissions (PPSC, SPSC, KPPSC).
        </p>

        {/* Featured Flagship Card */}
        {featuredArticle && (
          <div className="blog-flagship-card">
            <div className="flex items-center justify-between gap-4 flex-wrap mb-3">
              <SectionBadge 
                variant="flagship" 
                size="sm" 
                icon={Sparkles}
                uppercase
              >
                FLAGSHIP GUIDE • {featuredArticle.clusterLabel}
              </SectionBadge>
              {featuredArticle.heroBanner?.quickStats && (
                <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
                  {featuredArticle.heroBanner.quickStats.slice(0, 2).map((s, idx) => (
                    <span key={idx} className="badge badge-bps">
                      {s.label}: {s.value}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col md:flex-row items-start gap-5">
              {featuredArticle.heroBanner?.logo && (
                <div className="article-crest-box hidden sm:flex">
                  <Image 
                    src={featuredArticle.heroBanner.logo} 
                    alt={featuredArticle.heroBanner.departmentName} 
                    className="article-crest-img"
                    width={56}
                    height={56}
                    priority
                  />
                </div>
              )}
              <div className="flex-1">
                <h2 className="blog-flagship-title">
                  <Link href={`/blog/${featuredArticle.slug}`}>
                    {featuredArticle.title}
                  </Link>
                </h2>
                <p className="blog-flagship-desc">
                  {featuredArticle.metaDescription}
                </p>
              </div>
            </div>

            <div className="blog-flagship-footer">
              <div className="flex items-center gap-2 text-xs text-muted flex-wrap">
                <span className="font-semibold text-primary">{featuredArticle.author.name}</span>
                <span>•</span>
                <span>{featuredArticle.readTime}</span>
                <span>•</span>
                <span>Updated: {featuredArticle.updatedDate}</span>
              </div>
              <Link 
                href={`/blog/${featuredArticle.slug}`} 
                className="btn btn-primary btn-sm flex items-center gap-1.5"
              >
                <span>Read Full Guide</span>
                <ArrowRight size={14} className="flex-shrink-0" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Hub Grid Component */}
      <BlogClientHub 
        articles={BLOG_ARTICLES} 
        clusters={BLOG_CLUSTERS} 
      />
    </div>
  );
}
