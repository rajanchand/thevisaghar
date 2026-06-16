"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Star,
  Plus,
  Edit,
  Trash2,
  X,
  RefreshCw,
  Info,
  CheckCircle2,
  AlertCircle,
  MessageSquareQuote,
} from "lucide-react";

interface Testimonial {
  id: string;
  clientName: string;
  clientPhoto?: string;
  visaType: string;
  rating: number;
  content: string;
  isApproved: boolean;
  createdAt: string;
}

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  // Form states
  const [clientName, setClientName] = useState("");
  const [clientPhoto, setClientPhoto] = useState("");
  const [visaType, setVisaType] = useState("");
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [isApproved, setIsApproved] = useState(false);

  // UX states
  const [errorMsg, setErrorMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/testimonials");
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data);
      }
    } catch (error) {
      console.error("Failed to fetch testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void (async () => { await fetchTestimonials(); })();
  }, []);

  const handleOpenCreate = () => {
    setEditingTestimonial(null);
    setClientName("");
    setClientPhoto("/images/client-placeholder.jpg");
    setVisaType("");
    setRating(5);
    setContent("");
    setIsApproved(false);
    setErrorMsg("");
    setModalOpen(true);
  };

  const handleOpenEdit = (t: Testimonial) => {
    setEditingTestimonial(t);
    setClientName(t.clientName);
    setClientPhoto(t.clientPhoto || "/images/client-placeholder.jpg");
    setVisaType(t.visaType);
    setRating(t.rating);
    setContent(t.content);
    setIsApproved(t.isApproved);
    setErrorMsg("");
    setModalOpen(true);
  };

  const handleToggleApproval = async (id: string, currentStatus: boolean) => {
    try {
      // Find the testimonial details
      const t = testimonials.find((x) => x.id === id);
      if (!t) return;

      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: t.clientName,
          clientPhoto: t.clientPhoto,
          visaType: t.visaType,
          rating: t.rating,
          content: t.content,
          isApproved: !currentStatus,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setTestimonials((prev) => prev.map((x) => (x.id === id ? updated : x)));
      }
    } catch (error) {
      console.error("Failed to toggle testimonial status:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !visaType || !content) {
      setErrorMsg("Name, Visa type, and Content are required fields.");
      return;
    }

    try {
      setSaving(true);
      setErrorMsg("");

      const payload = {
        clientName,
        clientPhoto: clientPhoto || undefined,
        visaType,
        rating: Number(rating),
        content,
        isApproved,
      };

      const url = editingTestimonial ? `/api/admin/testimonials/${editingTestimonial.id}` : "/api/admin/testimonials";
      const method = editingTestimonial ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setModalOpen(false);
        fetchTestimonials();
      } else {
        setErrorMsg(data.error || "Failed to save testimonial.");
      }
    } catch (error) {
      setErrorMsg("Server transaction error.");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
      if (res.ok) {
        setTestimonials(testimonials.filter((t) => t.id !== id));
        setIsDeleting(null);
      }
    } catch (error) {
      console.error("Failed to delete testimonial:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Client Testimonials</h1>
          <p className="text-gray-500 text-sm mt-1">Moderate and review feedback left by successful clients.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 bg-navy hover:bg-navy/90 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm"
        >
          <Plus size={16} className="text-gold" /> Add Review
        </button>
      </div>

      {/* Grid of testimonials */}
      {loading ? (
        <div className="p-12 text-center text-gray-400 bg-white border border-gray-100 rounded-xl shadow-sm space-y-3">
          <RefreshCw className="animate-spin mx-auto text-gold" size={28} />
          <p className="text-sm">Loading reviews list...</p>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="p-16 text-center bg-white border border-gray-100 rounded-xl shadow-sm text-gray-500">
          <MessageSquareQuote className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="font-bold text-navy">No testimonials left</p>
          <p className="text-sm mt-1">Publish client reviews to improve success credibility.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all group"
            >
              {/* Header info */}
              <div className="p-6 border-b border-gray-50 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-navy/5 text-navy border rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                    {t.clientPhoto ? (
                      <Image src={t.clientPhoto} alt={t.clientName} width={40} height={40} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-bold text-sm">{t.clientName.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-navy text-sm">{t.clientName}</h3>
                    <p className="text-[10px] text-gold font-bold uppercase tracking-wider">{t.visaType}</p>
                  </div>
                </div>

                {/* Rating stars */}
                <div className="flex gap-0.5 text-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      fill={i < t.rating ? "currentColor" : "none"}
                      className={i < t.rating ? "text-gold" : "text-gray-200"}
                    />
                  ))}
                </div>
              </div>

              {/* Message content */}
              <div className="p-6 flex-1 text-sm text-gray-600 space-y-3">
                <p className="italic leading-relaxed line-clamp-4 text-gray-500">&quot;{t.content}&quot;</p>
              </div>

              {/* Footer toggles and actions */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-4">
                {/* Approval switch */}
                <button
                  type="button"
                  onClick={() => handleToggleApproval(t.id, t.isApproved)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${
                    t.isApproved
                      ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                      : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                  }`}
                >
                  {t.isApproved ? (
                    <>
                      <CheckCircle2 size={12} /> Approved
                    </>
                  ) : (
                    <>
                      <AlertCircle size={12} /> Pending Approval
                    </>
                  )}
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(t)}
                    className="p-1.5 hover:bg-navy/5 text-navy rounded transition-colors"
                    title="Edit Review"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => setIsDeleting(t.id)}
                    className="p-1.5 hover:bg-red-50 text-red-500 rounded transition-colors"
                    title="Delete Review"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Creation/Edit Form Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-gray-100"
            >
              {/* Header */}
              <div className="bg-navy p-6 text-white flex items-center justify-between">
                <div>
                  <span className="text-xs text-gold uppercase tracking-widest font-bold">
                    {editingTestimonial ? "Edit Feedback" : "Add Client Feedback"}
                  </span>
                  <h3 className="text-lg font-bold mt-1">
                    {editingTestimonial ? `Review: ${editingTestimonial.clientName}` : "New Testimonial"}
                  </h3>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {errorMsg && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs flex items-center gap-2">
                    <Info size={16} />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs text-navy font-bold uppercase tracking-wider">Client Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sabina Shrestha"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-navy font-bold uppercase tracking-wider">Visa Type Granted</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. UK Skilled Worker Visa"
                      value={visaType}
                      onChange={(e) => setVisaType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-navy font-bold uppercase tracking-wider">Star Rating (1-5)</label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none bg-white"
                    >
                      {[5, 4, 3, 2, 1].map((val) => (
                        <option key={val} value={val}>
                          {val} Stars
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-navy font-bold uppercase tracking-wider">Client Photo URL</label>
                  <input
                    type="text"
                    placeholder="/images/client-sabina.jpg"
                    value={clientPhoto}
                    onChange={(e) => setClientPhoto(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-navy font-bold uppercase tracking-wider">Review Content</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe their visa success story and experience working with us..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none resize-none"
                  />
                </div>

                {/* Approval toggle */}
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <input
                    type="checkbox"
                    id="isApproved"
                    checked={isApproved}
                    onChange={(e) => setIsApproved(e.target.checked)}
                    className="w-4 h-4 rounded text-navy focus:ring-navy"
                  />
                  <label htmlFor="isApproved" className="text-xs font-bold text-navy select-none cursor-pointer">
                    Approve immediately (Display review live on public home page slider)
                  </label>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-gray-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 border border-gray-200 hover:bg-gray-100 rounded-xl text-xs font-semibold text-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-navy hover:bg-navy/90 text-white px-5 py-2 rounded-xl text-xs font-semibold disabled:opacity-50"
                  >
                    {saving ? "Saving..." : editingTestimonial ? "Save Review" : "Create Review"}
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
                <h4 className="text-lg font-bold text-navy">Delete Review?</h4>
                <p className="text-gray-500 text-xs mt-1">This action cannot be undone. Are you sure you want to permanently delete this client review?</p>
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
