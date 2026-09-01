import React from 'react';
import Link from 'next/link';
import { BLOG_ARTICLES, BLOG_CLUSTERS } from '../../data/blogData';
import BlogClientHub from '../../components/BlogClientHub';
import { generateBreadcrumbSchema } from '../../utils/seoHelpers';
import { BookOpen, Sparkles, TrendingUp, ShieldCheck, ArrowRight } from 'lucide-react';

export const metadata = {
  title: "Career Guides & Exam Intelligence Hub (PPSC, FPSC & Govt Jobs) | RozgarPK",
  description: "Comprehensive, fact-checked guides on PPSC, FPSC, NJP, and Government of Pakistan recruitment processes, syllabus patterns, challan payment, and exam preparation.",
  alternates: {
    canonical: "https://rozgar.pk/blog"
  }
};

export default function BlogIndexPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://rozgar.pk" },
    { name: "Career Guides & Blog", url: "https://rozgar.pk/blog" }
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
          <span className="badge badge-govt flex items-center gap-1.5">
            <BookOpen size={13} />
            <span>Official Knowledge Hub</span>
          </span>
          <span className="badge badge-verified flex items-center gap-1.5">
            <ShieldCheck size={13} />
            <span>Fact-Checked & Gazette Verified</span>
          </span>
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
            <div className="blog-flagship-badge">
              <Sparkles size={14} className="text-emerald-500" />
              <span>FLAGSHIP GUIDE • {featuredArticle.clusterLabel}</span>
            </div>
            <h2 className="blog-flagship-title">
              <Link href={`/blog/${featuredArticle.slug}`}>
                {featuredArticle.title}
              </Link>
            </h2>
            <p className="blog-flagship-desc">
              {featuredArticle.metaDescription}
            </p>
            <div className="blog-flagship-footer">
              <div className="flex items-center gap-2 text-xs text-muted">
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
                <ArrowRight size={14} />
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
