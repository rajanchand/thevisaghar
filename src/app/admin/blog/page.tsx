"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  X,
  Eye,
  Search,
  Filter,
  RefreshCw,
  Info,
  Calendar,
  User,
} from "lucide-react";
import { TipTapEditor } from "@/components/admin/TipTapEditor";

interface Author {
  id: string;
  name: string;
  email: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: unknown; // HTML string stored as Json { html: string }
  excerpt?: string;
  featuredImage?: string;
  category: string;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  published: boolean;
  publishedAt?: string;
  createdAt: string;
  author: Author;
}

const CATEGORIES = ["General", "UK Visas", "Schengen Visas", "Australia PR", "News"];

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [category, setCategory] = useState("General");
  const [tagsInput, setTagsInput] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [published, setPublished] = useState(false);

  // UX states
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [errorMsg, setErrorMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isSlugChecking, setIsSlugChecking] = useState(false);
  const [isSlugAvailable, setIsSlugAvailable] = useState(true);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/blog");
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (error) {
      console.error("Failed to fetch blog posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void (async () => { await fetchPosts(); })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!slug) {
      setIsSlugAvailable(true);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSlugChecking(true);
        const params = new URLSearchParams({ slug });
        if (editingPost) {
          params.append("excludeId", editingPost.id);
        }
        const res = await fetch(`/api/admin/blog/check-slug?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setIsSlugAvailable(data.available);
        }
      } catch (err) {
        console.error("Error checking slug availability:", err);
      } finally {
        setIsSlugChecking(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [slug, editingPost]);

  // Slug generator useEffect removed in favor of handleTitleChange during render / onChange to prevent cascading renders

  const handleOpenCreate = () => {
    setEditingPost(null);
    setTitle("");
    setSlug("");
    setExcerpt("");
    setContentHtml("");
    setFeaturedImage("/images/blog-placeholder.jpg");
    setCategory("General");
    setTagsInput("");
    setSeoTitle("");
    setSeoDescription("");
    setPublished(false);
    setErrorMsg("");
    setModalOpen(true);
  };

  const handleOpenEdit = (post: BlogPost) => {
    setEditingPost(post);
    setTitle(post.title);
    setSlug(post.slug);
    setExcerpt(post.excerpt || "");
    
    // Support content format of either raw string or nested { html: "..." }
    const htmlContent = typeof post.content === "object" && post.content !== null ? (post.content as { html?: string }).html || "" : (post.content as string) || "";
    setContentHtml(htmlContent);
    
    setFeaturedImage(post.featuredImage || "/images/blog-placeholder.jpg");
    setCategory(post.category);
    setTagsInput(post.tags?.join(", ") || "");
    setSeoTitle(post.seoTitle || "");
    setSeoDescription(post.seoDescription || "");
    setPublished(post.published);
    setErrorMsg("");
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !contentHtml) {
      setErrorMsg("Title, Slug, and content are required.");
      return;
    }

    try {
      setSaving(true);
      setErrorMsg("");

      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      // Structure content as JSON payload
      const payload = {
        title,
        slug,
        content: { html: contentHtml },
        excerpt: excerpt || undefined,
        featuredImage: featuredImage || undefined,
        category,
        tags,
        seoTitle: seoTitle || undefined,
        seoDescription: seoDescription || undefined,
        published,
      };

      const url = editingPost ? `/api/admin/blog/${editingPost.id}` : "/api/admin/blog";
      const method = editingPost ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setModalOpen(false);
        fetchPosts();
      } else {
        setErrorMsg(data.error || "Failed to save post.");
      }
    } catch (error) {
      setErrorMsg("Server connection failure.");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPosts(posts.filter((p) => p.id !== id));
        setIsDeleting(null);
      }
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (filter === "published") return post.published;
    if (filter === "draft") return !post.published;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Blog Administration</h1>
          <p className="text-gray-500 text-sm mt-1">Publish news, guidelines, and articles for clients.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 bg-navy hover:bg-navy/90 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm"
        >
          <Plus size={16} className="text-gold" /> Write Article
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search posts (title, excerpt, url slug)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0">
          <Filter size={16} className="text-gray-400" />
          {(["all", "published", "draft"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                filter === tab
                  ? "bg-navy text-gold"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
          <button
            onClick={fetchPosts}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-navy transition-colors ml-auto"
            title="Refresh list"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400 space-y-3">
            <RefreshCw className="animate-spin mx-auto text-gold" size={28} />
            <p className="text-sm">Loading articles...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-16 text-center text-gray-500">
            <FileText className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="font-bold text-navy">No articles found</p>
            <p className="text-sm mt-1">Write your first post or adjust filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-100 text-navy font-bold">
                <tr>
                  <th className="p-4 px-6">Featured Info</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Author</th>
                  <th className="p-4">Publish Date</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50/80 transition-colors text-gray-600">
                    <td className="p-4 px-6 max-w-sm">
                      <div className="flex gap-3">
                        {post.featuredImage && (
                          <Image
                            src={post.featuredImage}
                            alt=""
                            width={64}
                            height={40}
                            className="w-16 h-10 object-cover rounded-lg border border-gray-100 flex-shrink-0"
                          />
                        )}
                        <div>
                          <div className="font-bold text-navy line-clamp-1">{post.title}</div>
                          <p className="text-xs text-gray-400 font-mono mt-0.5">/{post.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-gold/10 text-navy border border-gold/25 text-xs font-semibold rounded-full">
                        {post.category}
                      </span>
                    </td>
                    <td className="p-4 text-xs">
                      <span className="flex items-center gap-1.5">
                        <User size={12} className="text-gray-400" />
                        {post.author?.name || "Admin"}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={12} />
                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "Draft"}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded ${
                          post.published
                            ? "bg-green-50 text-green-600 border border-green-200"
                            : "bg-gray-100 text-gray-400 border border-gray-200"
                        }`}
                      >
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <a
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 hover:bg-navy/5 text-navy rounded"
                          title="View Live Page"
                        >
                          <Eye size={16} />
                        </a>
                        <button
                          onClick={() => handleOpenEdit(post)}
                          className="p-1.5 hover:bg-navy/5 text-navy rounded"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => setIsDeleting(post.id)}
                          className="p-1.5 hover:bg-red-50 text-red-500 rounded"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Editor Modal Overlay (Full-screen sheet style) */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="bg-white w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col h-[90vh]"
            >
              {/* Header */}
              <div className="bg-navy p-6 text-white flex items-center justify-between flex-shrink-0">
                <div>
                  <span className="text-xs text-gold uppercase tracking-widest font-bold">
                    {editingPost ? "Edit Article" : "Compose New Article"}
                  </span>
                  <h3 className="text-xl font-bold mt-0.5">
                    {editingPost ? `Edit: ${editingPost.title}` : "Blog Editor"}
                  </h3>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form Body - Scrollable */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col">
                {errorMsg && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs flex items-center gap-2">
                    <Info size={16} />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Grid Title & Slug */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-navy font-bold uppercase tracking-wider">Article Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Complete Guide to Schengen Visa from Nepal"
                      value={title}
                      onChange={(e) => {
                        const val = e.target.value;
                        setTitle(val);
                        if (!editingPost) {
                          setSlug(
                            val
                              .toLowerCase()
                              .replace(/[^a-z0-9]+/g, "-")
                              .replace(/(^-|-$)+/g, "")
                          );
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-navy font-bold uppercase tracking-wider">URL Slug (Unique)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. schengen-visa-guide"
                      value={slug}
                      onChange={(e) => {
                        setSlug(
                          e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9-]+/g, "-")
                        );
                      }}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-navy/20"
                    />
                    {isSlugChecking && (
                      <p className="text-[10px] text-gray-400">Verifying slug uniqueness...</p>
                    )}
                    {!isSlugChecking && !isSlugAvailable && (
                      <p className="text-[10px] text-red-500 font-semibold">⚠️ This slug is already taken by another article.</p>
                    )}
                    {!isSlugChecking && isSlugAvailable && slug && (
                      <p className="text-[10px] text-green-600 font-semibold">✓ Slug is available.</p>
                    )}
                  </div>
                </div>

                {/* Category & Tags & Image */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-navy font-bold uppercase tracking-wider">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none bg-white"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-navy font-bold uppercase tracking-wider">Featured Image URL</label>
                    <input
                      type="text"
                      placeholder="URL path to cover photo..."
                      value={featuredImage}
                      onChange={(e) => setFeaturedImage(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-navy font-bold uppercase tracking-wider">Tags (comma separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. uk, visa, 2024, travel"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none"
                    />
                  </div>
                </div>

                {/* Excerpt */}
                <div className="space-y-1.5">
                  <label className="text-xs text-navy font-bold uppercase tracking-wider">Short Excerpt (Snippet)</label>
                  <input
                    type="text"
                    placeholder="Short 1-2 sentence description summarizing the article..."
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none"
                  />
                </div>

                {/* TipTap Rich Editor */}
                <div className="space-y-1.5 flex-1 flex flex-col">
                  <label className="text-xs text-navy font-bold uppercase tracking-wider">Article Content</label>
                  <div className="flex-1 flex flex-col min-h-[300px]">
                    <TipTapEditor
                      content={contentHtml}
                      onChange={(html) => setContentHtml(html)}
                      placeholder="Draft your visa guides and consultancy updates here..."
                    />
                  </div>
                </div>

                {/* SEO Configurations */}
                <div className="border border-gray-150 rounded-2xl p-4 bg-gray-50/50 space-y-4">
                  <h4 className="text-xs font-bold text-navy uppercase tracking-wider">🔍 Search Engine Optimization (SEO) Metadata</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">SEO Title Tag Override</label>
                      <input
                        type="text"
                        placeholder="e.g. Student Visa Nepal Guide (Max 70 chars)"
                        value={seoTitle}
                        onChange={(e) => setSeoTitle(e.target.value)}
                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">SEO Meta Description Override</label>
                      <input
                        type="text"
                        placeholder="e.g. Detailed process and requirements for visa applicants... (Max 160 chars)"
                        value={seoDescription}
                        onChange={(e) => setSeoDescription(e.target.value)}
                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Publish Checkbox */}
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <input
                    type="checkbox"
                    id="published"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="w-4 h-4 rounded text-navy focus:ring-navy animate-pulse"
                  />
                  <label htmlFor="published" className="text-sm font-bold text-navy select-none cursor-pointer">
                    Publish Live (Set to published status. Unchecked leaves it as a draft)
                  </label>
                </div>

                {/* Modal actions */}
                <div className="pt-4 border-t border-gray-100 flex justify-end gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 border border-gray-200 hover:bg-gray-100 rounded-xl text-sm font-semibold text-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving || isSlugChecking || !isSlugAvailable}
                    className="bg-navy hover:bg-navy/90 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
                  >
                    {saving ? "Publishing..." : editingPost ? "Save Changes" : "Publish Article"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Alert */}
      <AnimatePresence>
        {isDeleting && (
          <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="bg-white max-w-sm w-full p-6 rounded-2xl shadow-2xl border border-gray-100 text-center space-y-4"
            >
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500">
                <Trash2 size={24} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-navy">Delete Article?</h4>
                <p className="text-gray-500 text-xs mt-1">This action cannot be undone. Are you sure you want to permanently delete this blog post?</p>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setIsDeleting(null)}
                  className="flex-1 py-2 border border-gray-200 hover:bg-gray-50 rounded-xl text-sm font-semibold text-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(isDeleting)}
                  className="flex-1 py-2 bg-red-500 hover:bg-red-600 rounded-xl text-sm font-semibold text-white transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
