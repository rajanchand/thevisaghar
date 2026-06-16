"use client";

import React, { useState } from "react";
import { BlogCard } from "@/components/ui/BlogCard";
import { Search, FileText } from "lucide-react";
import { blogPosts } from "../../../../data/blog-posts";

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Extract category options dynamically from blog posts
  const categories = ["All", ...Array.from(new Set(blogPosts.map((post) => post.category)))];

  // Perform search and category filtering client-side
  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      {/* ─── Hero Section ───────────────────────────────────────────── */}
      <section className="pt-32 pb-16 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-[0.02]" />
        <div className="section-container relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-accent text-sm font-semibold uppercase tracking-wider mb-4 border border-white/15">
            Resources & News
          </span>
          <h1
            className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Immigration Guides & Academic Insights
          </h1>
          <p
            className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Stay updated with study abroad guidelines, language coaching tips, and official MoEST notices.
          </p>
        </div>
      </section>

      {/* ─── Filter & Search Sticky Bar ─────────────────────────────── */}
      <section className="py-6 border-b border-border-faint sticky top-[72px] bg-surface/95 backdrop-blur-md z-40">
        <div className="section-container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5">
            {/* Category Tabs */}
            <div className="flex gap-2 flex-wrap" style={{ fontFamily: "var(--font-body)" }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-bold transition-all ${
                    selectedCategory === cat
                      ? "bg-primary text-accent shadow-xs"
                      : "bg-surface-sunken text-ink-light hover:bg-border/40 border border-border-faint"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72" style={{ fontFamily: "var(--font-body)" }}>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" size={16} />
              <input
                type="search"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-border bg-surface-sunken focus:bg-surface-raised focus:border-accent focus:ring-2 focus:ring-accent/25 outline-none text-sm font-semibold text-ink-light"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Articles Grid ──────────────────────────────────────────── */}
      <section className="py-16 bg-surface min-h-[400px]">
        <div className="section-container">
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <BlogCard
                  key={post.slug}
                  title={post.title}
                  slug={post.slug}
                  excerpt={post.excerpt}
                  category={post.category}
                  publishedAt={post.publishedAt}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-ink-muted" style={{ fontFamily: "var(--font-body)" }}>
              <FileText className="mx-auto text-ink-faint mb-4" size={48} />
              <p className="text-lg font-bold text-primary" style={{ fontFamily: "var(--font-display)" }}>
                No articles match your search criteria.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="mt-4 text-accent-dark font-bold hover:underline text-sm uppercase tracking-wider"
              >
                Clear Search & Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
