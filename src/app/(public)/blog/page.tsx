"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BlogCard } from "@/components/ui/BlogCard";
import { Search, Filter, RefreshCw, FileText } from "lucide-react";

interface BlogPost {
  title: string;
  slug: string;
  excerpt?: string;
  category: string;
  publishedAt: string;
  featuredImage?: string;
}

const categories = ["All", "UK Visas", "Schengen Visas", "Australia PR", "General", "News"];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams();
        if (selectedCategory && selectedCategory !== "All") {
          queryParams.set("category", selectedCategory);
        }
        if (debouncedSearch) {
          queryParams.set("search", debouncedSearch);
        }

        const res = await fetch(`/api/blog?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setPosts(data.posts || []);
        }
      } catch (error) {
        console.error("Failed to fetch public blog posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [selectedCategory, debouncedSearch]);

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-navy">
        <div className="section-container text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-gold text-sm font-medium mb-4 border border-white/15">
              Blog & Updates
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Immigration Insights
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Stay updated with the latest visa news, expert tips, and comprehensive guides.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters & Search sticky bar */}
      <section className="py-8 border-b border-gray-100 sticky top-[72px] bg-white/95 backdrop-blur-md z-40">
        <div className="section-container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Category Tabs */}
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === cat
                      ? "bg-navy text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="search"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none text-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16 min-h-[400px]">
        <div className="section-container">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-gray-50 rounded-2xl h-[380px] border border-gray-150"
                />
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
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
            <div className="text-center py-16 text-gray-500">
              <FileText className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-lg font-bold text-navy">No articles found matching your criteria.</p>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="mt-4 text-gold font-semibold hover:underline"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
