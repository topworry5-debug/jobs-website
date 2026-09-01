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
      <div className="card p-6 md:p-8 mb-8 border-emerald-subtle bg-gradient-subtle">
        <div className="flex items-center gap-2 mb-3">
          <span className="badge badge-govt">
            <BookOpen size={13} />
            <span>Official Knowledge Hub</span>
          </span>
          <span className="badge badge-verified">
            <ShieldCheck size={13} />
            <span>Fact-Checked & Gazette Verified</span>
          </span>
        </div>

        <h1 className="text-2xl md:text-4xl font-extrabold text-primary mb-3 leading-tight font-display">
          Pakistani Public Service & Career Intelligence Guides
        </h1>
        <p className="text-secondary text-sm md:text-base max-w-3xl leading-relaxed">
          Master the official application procedures, syllabus breakdowns, 1Link PSID challan steps, and exam strategies across Federal (FPSC) and Provincial Commissions (PPSC, SPSC, KPPSC).
        </p>

        {/* Featured Flagship Card */}
        {featuredArticle && (
          <div className="mt-6 p-5 md:p-6 rounded-xl bg-surface border border-subtle hover:border-emerald-500 transition-all shadow-sm">
            <div className="flex items-center gap-2 text-xs text-emerald-600 font-bold mb-2">
              <Sparkles size={14} />
              <span>FLAGSHIP GUIDE • {featuredArticle.clusterLabel}</span>
            </div>
            <h2 className="text-lg md:text-2xl font-bold text-primary mb-2 font-display">
              <Link href={`/blog/${featuredArticle.slug}`} className="hover:text-emerald-500 transition-colors">
                {featuredArticle.title}
              </Link>
            </h2>
            <p className="text-secondary text-sm mb-4 line-clamp-2 leading-relaxed">
              {featuredArticle.metaDescription}
            </p>
            <div className="flex items-center justify-between flex-wrap gap-3 pt-3 border-t border-subtle">
              <div className="flex items-center gap-2 text-xs text-muted">
                <span>{featuredArticle.author.name}</span>
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
