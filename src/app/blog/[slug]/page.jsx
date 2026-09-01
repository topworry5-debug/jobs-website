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
 * Markdown to HTML parser for tables, bold text, lists, and headings
 */
function formatMarkdownContent(markdown) {
  if (!markdown) return '';

  const lines = markdown.split('\n');
  let resultHtml = '';
  let inTable = false;
  let tableRows = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Table Row Detection
    if (line.startsWith('|') && line.endsWith('|')) {
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
      // Table ended, compile table HTML
      resultHtml += renderTableHtml(tableRows);
      inTable = false;
      tableRows = [];
    }

    if (!line) {
      resultHtml += '<br/>';
      continue;
    }

    // Headings
    if (line.startsWith('### ')) {
      resultHtml += `<h3 class="text-base md:text-lg font-bold text-primary mt-4 mb-2 font-display">${parseInline(line.substring(4))}</h3>`;
    } else if (line.startsWith('## ')) {
      resultHtml += `<h2 class="text-lg md:text-xl font-bold text-primary mt-6 mb-3 pb-1 border-b border-subtle font-display">${parseInline(line.substring(3))}</h2>`;
    } else if (line.startsWith('- ')) {
      resultHtml += `<div class="flex items-start gap-2 ml-2 my-1.5"><span class="text-emerald-500 font-bold">•</span><div class="text-secondary">${parseInline(line.substring(2))}</div></div>`;
    } else if (/^\d+\.\s/.test(line)) {
      const match = line.match(/^(\d+)\.\s(.*)$/);
      resultHtml += `<div class="flex items-start gap-2 ml-2 my-1.5"><span class="badge badge-bps text-[10px] px-1.5 py-0.5">${match[1]}</span><div class="text-secondary">${parseInline(match[2])}</div></div>`;
    } else {
      resultHtml += `<p class="leading-relaxed mb-3 text-secondary">${parseInline(line)}</p>`;
    }
  }

  if (inTable) {
    resultHtml += renderTableHtml(tableRows);
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
