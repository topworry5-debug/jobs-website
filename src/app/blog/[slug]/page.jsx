import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { BLOG_ARTICLES } from '../../../data/blogData';
import { generateBreadcrumbSchema, generateFAQSchema } from '../../../utils/seoHelpers';
import SectionBadge from '../../../components/SectionBadge';
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
  HelpCircle,
  Award,
  Layers
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
  const bannerImage = article.heroBanner?.logo ? `https://rozgar.pk${article.heroBanner.logo}` : 'https://rozgar.pk/logo.png';

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
      images: [
        {
          url: bannerImage,
          width: 800,
          height: 600,
          alt: article.title
        }
      ],
      publishedTime: `${article.publishedDate}T00:00:00+05:00`,
      modifiedTime: `${article.updatedDate}T00:00:00+05:00`,
      authors: [article.author.name],
      tags: article.targetKeywords
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.metaDescription,
      images: [bannerImage]
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
    "image": article.heroBanner?.logo ? `https://rozgar.pk${article.heroBanner.logo}` : 'https://rozgar.pk/logo.png',
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

      {/* Featured Visual Hero Header Banner */}
      {article.heroBanner && (
        <div className="article-hero-banner">
          <div className="article-hero-banner-inner">
            <div className="article-hero-crest-wrapper">
              <div className="article-crest-box">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={article.heroBanner.logo} 
                  alt={article.heroBanner.departmentName}
                  className="article-crest-img"
                  width={60}
                  height={60}
                />
              </div>
              <div className="article-crest-meta">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <SectionBadge variant="govt" size="xs">
                    {article.clusterLabel}
                  </SectionBadge>
                  <SectionBadge variant="verified" size="xs" icon={ShieldCheck}>
                    Verified Gazette Authority
                  </SectionBadge>
                </div>
                <h2 className="article-crest-dept-name">
                  {article.heroBanner.departmentName}
                </h2>
                <p className="article-crest-dept-sub">
                  {article.heroBanner.departmentSub}
                </p>
              </div>
            </div>

            {/* Quick Stats Grid */}
            {article.heroBanner.quickStats && (
              <div className="article-stat-grid">
                {article.heroBanner.quickStats.map((stat, idx) => (
                  <div key={idx} className="article-stat-pill">
                    <span className="article-stat-pill-label">{stat.label}</span>
                    <span className="article-stat-pill-value">{stat.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Article Prose Column (8 Columns) */}
        <main className="lg:col-span-8">
          <article className="card p-6 md:p-8 bg-surface">
            {/* Top Badges */}
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <SectionBadge variant="govt" size="sm">
                {article.clusterLabel}
              </SectionBadge>
              <SectionBadge variant="verified" size="sm" icon={ShieldCheck}>
                Verified Gazette Rules
              </SectionBadge>
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
                <span className="flex items-center gap-1.5">
                  <Clock size={13} className="text-emerald-500 flex-shrink-0" />
                  <span>{article.readTime}</span>
                </span>
                <span>•</span>
                <span>Updated: {article.updatedDate}</span>
              </div>
            </div>

            {/* AEO / GEO Direct Answer Callout Box */}
            {article.directAnswer && (
              <div className="article-summary-box">
                <SectionBadge 
                  variant="flagship" 
                  size="sm" 
                  icon={Sparkles} 
                  uppercase 
                  className="mb-2"
                >
                  Executive Summary & Key Takeaways
                </SectionBadge>
                <p className="text-secondary text-sm md:text-base leading-relaxed font-medium mt-1">
                  {article.directAnswer}
                </p>
              </div>
            )}

            {/* In-Depth Article Content Sections */}
            <div className="article-body-content mt-6 flex flex-col gap-8 text-secondary text-sm md:text-base leading-relaxed">
              {article.contentSections.map((sec) => {
                const sectionInfographic = article.infographics?.find(
                  (info) => info.sectionId === sec.id
                );

                return (
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

                    {/* Embedded Supporting Visual Infographic Card */}
                    {sectionInfographic && (
                      <div className="article-infographic-card">
                        <div className="article-infographic-header">
                          <div className="article-infographic-title">
                            <Layers size={18} className="text-emerald-500 flex-shrink-0" />
                            <span>{sectionInfographic.title}</span>
                          </div>
                          <SectionBadge variant="emerald" size="xs">
                            Official Pattern Breakdown
                          </SectionBadge>
                        </div>
                        <div className={`article-infographic-grid ${sectionInfographic.items.length >= 3 ? 'article-infographic-grid-3' : ''}`}>
                          {sectionInfographic.items.map((item, idx) => (
                            <div 
                              key={idx} 
                              className={`article-infographic-item ${item.highlight ? 'article-infographic-item-highlight' : ''}`}
                            >
                              <div className="article-infographic-item-num">{item.num}</div>
                              <div className="article-infographic-item-title">{item.title}</div>
                              <div className="article-infographic-item-desc">{item.desc}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </section>
                );
              })}

              {/* Verified FAQs Section */}
              {article.faqs && article.faqs.length > 0 && (
                <section id="faqs" className="scroll-mt-20 pt-4 border-t border-subtle">
                  <div className="flex items-center gap-2 mb-4">
                    <HelpCircle size={20} className="text-emerald-500 flex-shrink-0" />
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
              <div className="mb-3 pb-2 border-b border-subtle">
                <SectionBadge variant="emerald" size="sm" icon={BookOpen} uppercase>
                  Table of Contents
                </SectionBadge>
              </div>
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
              <div className="mb-3 pb-2 border-b border-subtle">
                <SectionBadge variant="emerald" size="sm" icon={Sparkles} uppercase>
                  Interactive Career Tools
                </SectionBadge>
              </div>
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
            <ArrowLeft size={14} className="flex-shrink-0" />
            <span>Back to All Career Guides</span>
          </Link>
        </aside>
      </div>
    </div>
  );
}

/**
 * Markdown to HTML parser for tables, bold text, lists, and headings
 */
function formatMarkdownContent(markdown) {
  if (!markdown) return '';

  const lines = markdown.split('\n');
  let resultHtml = '';
  let inTable = false;
  let tableRows = [];
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Table Row Detection
    if (line.startsWith('|') && line.endsWith('|')) {
      if (inList) {
        resultHtml += '</ul>';
        inList = false;
      }
      if (!inTable) {
        inTable = true;
        tableRows = [];
      }
      // Skip separator row (| :--- | :--- |)
      if (!line.includes('---')) {
        const cells = line.split('|').filter((_, idx, arr) => idx > 0 && idx < arr.length - 1).map(c => c.trim());
        tableRows.push(cells);
      }
      continue;
    } else if (inTable) {
      resultHtml += renderTableHtml(tableRows);
      inTable = false;
      tableRows = [];
    }

    if (!line) {
      if (inList) {
        resultHtml += '</ul>';
        inList = false;
      }
      continue;
    }

    // Headings
    if (line.startsWith('### ')) {
      if (inList) { resultHtml += '</ul>'; inList = false; }
      resultHtml += `<h3 class="text-base md:text-lg font-bold text-primary mt-5 mb-2 font-display">${parseInline(line.substring(4))}</h3>`;
    } else if (line.startsWith('## ')) {
      if (inList) { resultHtml += '</ul>'; inList = false; }
      resultHtml += `<h2 class="text-lg md:text-xl font-bold text-primary mt-6 mb-3 pb-1 border-b border-subtle font-display">${parseInline(line.substring(3))}</h2>`;
    } else if (line.startsWith('- ')) {
      if (!inList) {
        resultHtml += '<ul class="article-bullet-list my-3 space-y-2 pl-5 list-disc text-secondary">';
        inList = true;
      }
      resultHtml += `<li class="leading-relaxed">${parseInline(line.substring(2))}</li>`;
    } else if (/^\d+\.\s/.test(line)) {
      if (inList) { resultHtml += '</ul>'; inList = false; }
      const match = line.match(/^(\d+)\.\s(.*)$/);
      resultHtml += `<div class="flex items-start gap-2.5 my-2.5"><span class="badge badge-bps font-mono text-[11px] px-2 py-0.5 mt-0.5 flex-shrink-0">${match[1]}</span><div class="text-secondary leading-relaxed">${parseInline(match[2])}</div></div>`;
    } else {
      if (inList) { resultHtml += '</ul>'; inList = false; }
      resultHtml += `<p class="leading-relaxed mb-3 text-secondary">${parseInline(line)}</p>`;
    }
  }

  if (inTable) {
    resultHtml += renderTableHtml(tableRows);
  }
  if (inList) {
    resultHtml += '</ul>';
  }

  return resultHtml;
}

function parseInline(text) {
  if (!text) return '';
  let res = text;
  // Bold
  res = res.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-primary">$1</strong>');
  // Inline Code
  res = res.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-surface-subtle border border-subtle font-mono text-xs text-emerald-500">$1</code>');
  // Right arrows
  res = res.replace(/&rarr;/g, '→');
  return res;
}

function renderTableHtml(rows) {
  if (!rows || rows.length === 0) return '';
  const header = rows[0];
  const bodyRows = rows.slice(1);

  let html = '<div class="table-responsive-wrapper my-5 overflow-x-auto rounded-xl border border-subtle"><table class="w-full text-xs text-left border-collapse bg-surface-subtle">';
  
  // Header
  html += '<thead><tr class="bg-surface border-b border-subtle">';
  header.forEach(h => {
    html += `<th class="p-3 font-bold text-primary uppercase tracking-wider text-[11px]">${parseInline(h)}</th>`;
  });
  html += '</tr></thead>';

  // Body
  html += '<tbody>';
  bodyRows.forEach((r, idx) => {
    const isEven = idx % 2 === 0;
    html += `<tr class="${isEven ? 'bg-surface/50' : 'bg-surface-subtle'} border-b border-subtle/50 hover:bg-surface transition-colors">`;
    r.forEach(cell => {
      html += `<td class="p-3 text-secondary">${parseInline(cell)}</td>`;
    });
    html += '</tr>';
  });
  html += '</tbody></table></div>';

  return html;
}
