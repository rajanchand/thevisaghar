"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, ArrowLeft, Tag, User } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface BlogPostClientProps {
  post: {
    title: string;
    slug: string;
    content: any; // Json type
    category: string;
    tags: any; // Json type
    publishedAt: Date | null;
    author: {
      name: string;
    };
  };
}

export function BlogPostClient({ post }: BlogPostClientProps) {
  const getHtmlContent = (content: { html?: string } | string | null): string => {
    if (!content) return "";
    if (typeof content === "object") {
      return content.html || "";
    }
    return String(content);
  };

  // Safely parse tags
  let parsedTags: string[] = [];
  if (post.tags) {
    try {
      parsedTags = typeof post.tags === "string" ? JSON.parse(post.tags) : post.tags;
    } catch (e) {
      console.error("Error parsing tags:", e);
    }
  }

  const articleHtml = getHtmlContent(post.content);

  return (
    <>
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
              "name": post.author?.name || "Admin",
            },
            "publisher": {
              "@type": "Organization",
              "name": "The Visa Ghar",
              "logo": "https://thevisaghar.com/images/logo.png",
            },
          }),
        }}
      />
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-navy">
        <div className="section-container">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft size={16} /> All Articles
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block px-3 py-1 bg-gold text-navy text-xs font-semibold rounded-full mb-4">
              {post.category}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 max-w-4xl">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-300 text-sm">
              <span className="flex items-center gap-2">
                <User size={14} />
                {post.author?.name || "Admin"}
              </span>
              {post.publishedAt && (
                <span className="flex items-center gap-2">
                  <Calendar size={14} />
                  {formatDate(post.publishedAt.toISOString())}
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="section-container">
          <div className="max-w-3xl mx-auto">
            {/* Rich text container */}
            <article
              className="prose prose-sm md:prose-base max-w-none text-gray-700 leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ __html: articleHtml }}
            />

            {/* Tags */}
            {parsedTags && parsedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-gray-200">
                <Tag size={16} className="text-gray-400 mt-1" />
                {parsedTags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
