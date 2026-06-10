"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Calendar, ArrowLeft, Tag, User, Clock, RefreshCw } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Author {
  name: string;
}

interface BlogPost {
  title: string;
  slug: string;
  content: any; // Stored as Json { html: string } or raw string html
  category: string;
  tags: string[];
  publishedAt: string;
  author: Author;
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/blog/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setPost(data);
        }
      } catch (error) {
        console.error("Failed to fetch public blog details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const getHtmlContent = (content: any): string => {
    if (!content) return "";
    if (typeof content === "object") {
      return content.html || "";
    }
    return String(content);
  };

  if (loading) {
    return (
      <div className="pt-32 pb-20 section-container text-center space-y-4">
        <RefreshCw className="animate-spin mx-auto text-gold" size={32} />
        <p className="text-gray-400 text-sm">Loading article details...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-32 pb-20 section-container text-center">
        <h1 className="text-3xl font-bold text-navy mb-4">Post Not Found</h1>
        <p className="text-gray-500 mb-8">The blog post you are looking for does not exist or has been archived.</p>
        <Link href="/blog" className="text-gold font-semibold hover:underline">
          ← Back to Blog
        </Link>
      </div>
    );
  }

  const articleHtml = getHtmlContent(post.content);

  return (
    <>
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
              <span className="flex items-center gap-2">
                <Calendar size={14} />
                {formatDate(post.publishedAt)}
              </span>
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
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-gray-200">
                <Tag size={16} className="text-gray-400 mt-1" />
                {post.tags.map((tag) => (
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
