import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, ArrowLeft, User } from "lucide-react";
import { blogPosts } from "../../../../../data/blog-posts";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

// Pre-render all blog article routes statically
export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

// Generate dynamic SEO metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: "Article Not Found | The Visa Ghar",
    };
  }

  return {
    title: `${post.title} | The Visa Ghar`,
    description: post.excerpt || `${post.title} - Read the latest immigration guides and study abroad insights from The Visa Ghar.`,
    openGraph: {
      title: `${post.title} | The Visa Ghar`,
      description: post.excerpt || `${post.title} - Read the latest immigration guides and study abroad insights from The Visa Ghar.`,
      url: `https://thevisaghar.com/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      {/* Schema.org Blog Posting Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "datePublished": post.publishedAt,
            "author": {
              "@type": "Person",
              "name": "Rajan Chand",
            },
            "publisher": {
              "@type": "Organization",
              "name": "The Visa Ghar",
              "logo": "https://thevisaghar.com/images/logo.png",
            },
          }),
        }}
      />

      {/* ─── Hero Section ───────────────────────────────────────────── */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-surface to-surface-sunken border-b border-border-faint relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-[0.015]" />
        <div className="section-container relative z-10">
          <div className="max-w-4xl">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-ink-muted hover:text-primary text-sm font-semibold mb-6 transition-colors"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <ArrowLeft size={16} /> All Articles
            </Link>

            <span className="inline-block px-3 py-1 bg-accent-muted text-accent-dark border border-accent/15 text-xs font-bold rounded-lg mb-4 uppercase tracking-wider">
              {post.category}
            </span>
            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary mb-6 leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {post.title}
            </h1>

            <div
              className="flex flex-wrap items-center gap-6 text-ink-muted text-sm"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <span className="flex items-center gap-2 font-semibold">
                <User size={14} className="text-accent" />
                Rajan Chand
              </span>
              <span className="flex items-center gap-2 font-semibold">
                <Calendar size={14} className="text-accent" />
                {formatDate(post.publishedAt)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Article Content ────────────────────────────────────────── */}
      <section className="py-16 bg-surface">
        <div className="section-container">
          <div className="max-w-3xl mx-auto" style={{ fontFamily: "var(--font-body)" }}>
            <article
              className="prose prose-sm md:prose-base max-w-none text-ink-light leading-relaxed space-y-6 
                prose-headings:text-primary prose-headings:font-bold prose-headings:font-display prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                prose-p:text-sm prose-p:md:text-base prose-p:leading-relaxed prose-p:mb-6
                prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2 prose-ul:mb-6 prose-li:text-ink-light prose-li:text-sm prose-li:md:text-base"
              dangerouslySetInnerHTML={{ __html: post.contentHtml }}
            />

            <div className="mt-12 pt-8 border-t border-border-faint flex items-center justify-between">
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-accent-dark font-bold hover:underline"
              >
                <ArrowLeft size={12} /> Back to Articles
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
