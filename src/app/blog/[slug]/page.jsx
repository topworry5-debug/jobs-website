import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BLOG_ARTICLES } from '../../../data/blogData';
import { generateBreadcrumbSchema, generateFAQSchema } from '../../../utils/seoHelpers';
import { 
  Calendar, 
  Clock, 
  User, 
  Share2, 
  Bookmark, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight,
  ExternalLink,
  BookOpen,
  FileText,
  Landmark,
  ShieldCheck,
  Sparkles,
  HelpCircle
} from 'lucide-react';

export async function generateStaticParams() {
  return BLOG_ARTICLES.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }) {
  const article = BLOG_ARTICLES.find((a) => a.slug === params.slug);
  if (!article) return { title: 'Guide Not Found | RozgarPK' };

  const canonical = `https://rozgar.pk/blog/${article.slug}`;

  return {
    title: `${article.metaTitle || article.title} | RozgarPK`,
    description: article.metaDescription,
    keywords: article.targetKeywords,
    alternates: {
      canonical: canonical
    },
    openGraph: {
      type: 'article',
      locale: 'en_PK',
      url: canonical,
      siteName: 'RozgarPK',
      title: article.title,
      description: article.metaDescription,
      publishedTime: `${article.publishedDate}T00:00:00+05:00`,
      modifiedTime: `${article.updatedDate}T00:00:00+05:00`,
      authors: [article.author.name],
      tags: article.targetKeywords
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.metaDescription
    }
  };
}

export default function BlogArticlePage({ params }) {
  const article = BLOG_ARTICLES.find((a) => a.slug === params.slug);
  if (!article) notFound();

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://rozgar.pk" },
    { name: "Guides & Blog", url: "https://rozgar.pk/blog" },
    { name: article.title, url: `https://rozgar.pk/blog/${article.slug}` }
  ]);

  const faqSchema = generateFAQSchema(article.faqs || []);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.metaDescription,
    "datePublished": `${article.publishedDate}T00:00:00+05:00`,
    "dateModified": `${article.updatedDate}T00:00:00+05:00`,
    "author": {
      "@type": "Organization",
      "name": article.author.name,
      "url": "https://rozgar.pk"
    },
    "publisher": {
      "@type": "Organization",
      "name": "RozgarPK",
      "logo": {
        "@type": "ImageObject",
        "url": "https://rozgar.pk/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://rozgar.pk/blog/${article.slug}`
    }
  };

  return (
    <div className="container-xl py-6">
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Breadcrumb Bar */}
      <nav className="flex items-center gap-2 text-xs text-muted mb-4 flex-wrap">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-primary transition-colors">Career Guides</Link>
        <span>/</span>
        <span className="text-secondary font-medium truncate max-w-xs md:max-w-md">{article.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Article Prose Column (8 Columns) */}
        <main className="lg:col-span-8">
          <article className="card p-6 md:p-8 bg-surface">
            {/* Badges & Meta */}
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <span className="badge badge-govt">
                {article.clusterLabel}
              </span>
              <span className="badge badge-verified flex items-center gap-1">
                <ShieldCheck size={12} />
                <span>Verified Gazette Rules</span>
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-primary mb-4 leading-tight font-display">
              {article.title}
            </h1>

            {/* Author & Timestamp Bar */}
            <div className="flex items-center justify-between flex-wrap gap-3 pb-6 border-b border-subtle text-xs text-muted">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-primary">{article.author.name}</span>
                <span>•</span>
                <span>{article.author.role}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Clock size={13} />
                  <span>{article.readTime}</span>
                </span>
                <span>•</span>
                <span>Updated: {article.updatedDate}</span>
              </div>
            </div>

            {/* AEO / GEO Direct Answer Callout Box */}
            {article.directAnswer && (
              <div className="my-6 p-4 md:p-5 rounded-xl bg-surface-subtle border-l-4 border-emerald-500 shadow-sm">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 mb-1.5 uppercase tracking-wider">
                  <Sparkles size={14} />
                  <span>Executive Summary & Key Takeaways</span>
                </div>
                <p className="text-secondary text-sm md:text-base leading-relaxed font-medium">
                  {article.directAnswer}
                </p>
              </div>
            )}

            {/* In-Depth Article Content Sections */}
            <div className="article-body-content mt-6 flex flex-col gap-8 text-secondary text-sm md:text-base leading-relaxed">
              {article.contentSections.map((sec) => (
                <section key={sec.id} id={sec.id} className="scroll-mt-20">
                  <h2 className="text-xl md:text-2xl font-bold text-primary mb-3 pb-2 border-b border-subtle font-display">
                    {sec.heading}
                  </h2>
                  <div 
                    className="prose-content space-y-4"
                    dangerouslySetInnerHTML={{ 
                      __html: formatMarkdownContent(sec.content) 
                    }}
                  />
                </section>
              ))}

              {/* Verified FAQs Section */}
              {article.faqs && article.faqs.length > 0 && (
                <section id="faqs" className="scroll-mt-20 pt-4 border-t border-subtle">
                  <div className="flex items-center gap-2 mb-4">
                    <HelpCircle size={20} className="text-emerald-500" />
                    <h2 className="text-xl md:text-2xl font-bold text-primary font-display m-0">
                      Frequently Asked Questions (FAQs)
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {article.faqs.map((faq, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-surface-subtle border border-subtle">
                        <h3 className="font-bold text-sm md:text-base text-primary mb-1.5">
                          {faq.question}
                        </h3>
                        <p className="text-secondary text-xs md:text-sm leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Contextual Action Banner */}
            <div className="mt-8 p-6 rounded-xl bg-gradient-subtle border border-emerald-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-base text-primary mb-1">
                  Ready to apply or prepare for upcoming tests?
                </h3>
                <p className="text-xs text-secondary">
                  Explore verified gazetted openings or practice timed MCQs directly on RozgarPK.
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
                <Link href="/" className="btn btn-primary btn-sm flex-1 sm:flex-none">
                  Browse Active Jobs
                </Link>
                <Link href="/test-prep" className="btn btn-outline btn-sm flex-1 sm:flex-none">
                  Test Prep
                </Link>
              </div>
            </div>
          </article>
        </main>

        {/* Sticky Sidebar (4 Columns) */}
        <aside className="lg:col-span-4 sticky top-20 flex flex-col gap-6">
          {/* Table of Contents Box */}
          {article.tableOfContents && (
            <div className="card p-5 bg-surface">
              <h3 className="font-bold text-sm text-primary uppercase tracking-wider mb-3 pb-2 border-b border-subtle flex items-center gap-1.5">
                <BookOpen size={14} className="text-emerald-500" />
                <span>Table of Contents</span>
              </h3>
              <nav className="flex flex-col gap-2 text-xs">
                {article.tableOfContents.map((item) => (
                  <a 
                    key={item.id} 
                    href={`#${item.id}`}
                    className="text-secondary hover:text-emerald-500 transition-colors py-1 pl-2 border-l-2 border-transparent hover:border-emerald-500"
                  >
                    {item.title}
                  </a>
                ))}
              </nav>
            </div>
          )}

          {/* Related Tools Box */}
          {article.relatedTools && (
            <div className="card p-5 bg-surface">
              <h3 className="font-bold text-sm text-primary uppercase tracking-wider mb-3 pb-2 border-b border-subtle flex items-center gap-1.5">
                <Sparkles size={14} className="text-emerald-500" />
                <span>Interactive Career Tools</span>
              </h3>
              <div className="flex flex-col gap-3">
                {article.relatedTools.map((tool, idx) => (
                  <Link 
                    key={idx} 
                    href={tool.href}
                    className="p-3 rounded-lg bg-surface-subtle hover:bg-surface border border-subtle hover:border-emerald-500 transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-semibold text-primary">{tool.title}</span>
                    </div>
                    <span className="badge badge-bps text-[10px]">{tool.badge}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Return to Guides Link */}
          <Link 
            href="/blog" 
            className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1.5 pl-1"
          >
            <ArrowLeft size={14} />
            <span>Back to All Career Guides</span>
          </Link>
        </aside>
      </div>
    </div>
  );
}

/**
 * Basic Markdown to HTML parser for tables, bold text, and lists
 */
function formatMarkdownContent(markdown) {
  if (!markdown) return '';

  let html = markdown;

  // Tables
  html = html.replace(/\|(.+)\|/g, (match) => {
    return match; // We will format tables via simple replace
  });

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-primary mt-4 mb-2">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-primary mt-6 mb-3 pb-1 border-b border-subtle">$1</h2>');

  // Bold text
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-primary">$1</strong>');

  // Code inline
  html = html.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-surface-subtle border border-subtle font-mono text-xs text-emerald-600">$1</code>');

  // Bullet points
  html = html.replace(/^\- (.*$)/gim, '<li class="ml-4 list-disc">$1</li>');

  // Numbered lists
  html = html.replace(/^\d+\. (.*$)/gim, '<li class="ml-4 list-decimal">$1</li>');

  // Paragraphs
  html = html.split('\n\n').map(p => {
    if (p.startsWith('<h') || p.startsWith('<li') || p.startsWith('<table') || p.includes('|')) return p;
    return `<p class="leading-relaxed mb-3">${p}</p>`;
  }).join('');

  return html;
}
