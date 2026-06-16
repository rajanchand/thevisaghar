"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import {
  HelpCircle,
  Plus,
  Edit,
  Trash2,
  X,
  RefreshCw,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  group: string;
  order: number;
  published: boolean;
}

const FAQ_GROUPS = ["General", "IELTS/PTE Classes", "UK Student Visa", "Australia Visa", "USA Visa", "Canada Visa", "Other Destinations"];

export default function AdminFAQ() {
  const { data: session } = useSession();
  const userRole = session?.user?.role || "VIEWER";
  const isReadOnly = userRole === "VIEWER";

  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);
  const [filterGroup, setFilterGroup] = useState("all");

  // Form states
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [group, setGroup] = useState("General");
  const [order, setOrder] = useState(0);
  const [published, setPublished] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [restorableFaq, setRestorableFaq] = useState<{ id: string; question: string } | null>(null);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/faq");
      if (res.ok) {
        const data = await res.json();
        setFaqs(data);
      }
    } catch (error) {
      console.error("Failed to fetch FAQs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void (async () => { await fetchFaqs(); })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleOpenCreate = () => {
    if (isReadOnly) return;
    setEditingFaq(null);
    setQuestion("");
    setAnswer("");
    setGroup(filterGroup !== "all" ? filterGroup : "General");
    setOrder(faqs.length);
    setPublished(true);
    setErrorMsg("");
    setModalOpen(true);
  };

  const handleOpenEdit = (faq: FAQ) => {
    setEditingFaq(faq);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setGroup(faq.group);
    setOrder(faq.order);
    setPublished(faq.published);
    setErrorMsg("");
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;
    if (!question || !answer || !group) {
      setErrorMsg("Question, Answer, and FAQ group are required fields.");
      return;
    }

    try {
      setSaving(true);
      setErrorMsg("");

      const payload = {
        question,
        answer,
        group,
        order: Number(order),
        published,
      };

      const url = editingFaq ? `/api/admin/faq/${editingFaq.id}` : "/api/admin/faq";
      const method = editingFaq ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setModalOpen(false);
        fetchFaqs();
      } else {
        setErrorMsg(data.error || "Failed to save FAQ.");
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("Failed to connect to server.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (userRole !== "ADMIN") return;
    try {
      const res = await fetch(`/api/admin/faq/${id}`, { method: "DELETE" });
      if (res.ok) {
        const deleted = faqs.find((f) => f.id === id);
        if (deleted) {
          setRestorableFaq({ id: deleted.id, question: deleted.question });
          setTimeout(() => {
            setRestorableFaq((curr) => (curr?.id === id ? null : curr));
          }, 5000);
        }
        setFaqs(faqs.filter((f) => f.id !== id));
        setIsDeleting(null);
      }
    } catch (error) {
      console.error("Failed to delete FAQ:", error);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/faq/${id}/restore`, { method: "POST" });
      if (res.ok) {
        setRestorableFaq(null);
        await fetchFaqs();
      }
    } catch (error) {
      console.error("Failed to restore FAQ:", error);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedFaqId(expandedFaqId === id ? null : id);
  };

  // Filter list by selected group
  const filteredFaqs = faqs.filter(
    (faq) => filterGroup === "all" || faq.group === filterGroup
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Global FAQs Catalog</h1>
          <p className="text-gray-500 text-sm mt-1">Configure site-wide and visa informational accordion items.</p>
        </div>
        {!isReadOnly && (
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 bg-navy hover:bg-navy/90 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm"
          >
            <Plus size={16} className="text-gold" /> Add FAQ
          </button>
        )}
      </div>

      {/* Filter and Content layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Side: Category filtering */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm h-fit space-y-4">
          <h2 className="text-xs font-bold text-navy uppercase tracking-wider">Filter by Category</h2>
          <div className="space-y-1">
            <button
              onClick={() => setFilterGroup("all")}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                filterGroup === "all"
                  ? "bg-gold/15 text-navy font-bold"
                  : "text-gray-500 hover:bg-gray-50 hover:text-navy"
              }`}
            >
              All Categories ({faqs.length})
            </button>
            {FAQ_GROUPS.map((g) => {
              const count = faqs.filter((f) => f.group === g).length;
              return (
                <button
                  key={g}
                  onClick={() => setFilterGroup(g)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    filterGroup === g
                      ? "bg-gold/15 text-navy font-bold"
                      : "text-gray-500 hover:bg-gray-50 hover:text-navy"
                  }`}
                >
                  {g} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Accordion Lists */}
        <div className="lg:col-span-3 space-y-3">
          {loading ? (
            <div className="p-12 text-center bg-white border border-gray-100 rounded-2xl shadow-sm text-gray-400 space-y-3">
              <RefreshCw className="animate-spin mx-auto text-gold" size={28} />
              <p className="text-sm">Loading FAQs...</p>
            </div>
          ) : filteredFaqs.length === 0 ? (
            <div className="p-16 text-center bg-white border border-gray-100 rounded-2xl shadow-sm text-gray-500">
              <HelpCircle className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="font-bold text-navy">No FAQs configured in this group</p>
              {!isReadOnly && (
                <button
                  onClick={handleOpenCreate}
                  className="mt-3 text-xs bg-navy text-gold font-bold px-3 py-2 rounded-lg"
                >
                  Add FAQ Card
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFaqs.map((faq) => {
                const isExpanded = expandedFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden transition-all"
                  >
                    {/* Header trigger */}
                    <div
                      onClick={() => toggleExpand(faq.id)}
                      className="p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 transition-colors gap-4"
                    >
                      <div className="space-y-1">
                        <span className="px-2 py-0.5 bg-navy/5 text-navy rounded text-[9px] uppercase font-bold tracking-wider">
                          {faq.group} (Order: {faq.order})
                        </span>
                        <h3 className="font-bold text-navy text-sm mt-1">{faq.question}</h3>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-1.5 py-0.5 text-[8px] uppercase font-bold rounded ${
                            faq.published
                              ? "bg-green-50 text-green-600 border border-green-200"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {faq.published ? "Active" : "Draft"}
                        </span>
                        {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                      </div>
                    </div>

                    {/* Expandable answer */}
                    {isExpanded && (
                      <div className="p-5 pt-0 border-t border-gray-50 bg-gray-50/20 text-xs text-gray-600 space-y-4">
                        <div className="py-3 leading-relaxed whitespace-pre-line font-medium">{faq.answer}</div>
                        <div className="flex justify-end gap-2 border-t border-gray-100 pt-3">
                          <button
                            onClick={() => handleOpenEdit(faq)}
                            className="inline-flex items-center gap-1 bg-white hover:bg-navy hover:text-white px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-navy border border-gray-200 transition-all"
                          >
                            <Edit size={10} /> Edit
                          </button>
                          {userRole === "ADMIN" && (
                            <button
                              onClick={() => setIsDeleting(faq.id)}
                              className="inline-flex items-center gap-1 bg-white hover:bg-red-500 hover:text-white px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-red-500 border border-red-100 hover:border-red-500 transition-all"
                            >
                              <Trash2 size={10} /> Delete
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-gray-100 my-8 flex flex-col"
            >
              {/* Header */}
              <div className="bg-navy p-6 text-white flex items-center justify-between flex-shrink-0">
                <div>
                  <span className="text-xs text-gold uppercase tracking-widest font-bold">
                    {editingFaq ? "Update FAQ Card" : "Add FAQ Item"}
                  </span>
                  <h3 className="text-xl font-bold mt-1">
                    {editingFaq ? "Edit FAQ" : "Configure New FAQ"}
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
                  <label className="text-xs text-navy font-bold uppercase tracking-wider">Frequently Asked Question</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. What language scores are required for UK?"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-navy font-bold uppercase tracking-wider">FAQ Group / Category</label>
                  <select
                    value={group}
                    onChange={(e) => setGroup(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none bg-white"
                  >
                    {FAQ_GROUPS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-navy font-bold uppercase tracking-wider">Display Order weight</label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-navy font-bold uppercase tracking-wider">Detailed Answer</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide a comprehensive answer..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none resize-none"
                  />
                </div>

                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <input
                    type="checkbox"
                    id="published"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="w-4 h-4 rounded text-navy focus:ring-navy"
                  />
                  <label htmlFor="published" className="text-sm font-bold text-navy select-none">
                    Publish immediately (Show publicly on site)
                  </label>
                </div>

                {/* Save Footer Button */}
                <div className="pt-4 border-t border-gray-100 flex justify-end gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 border border-gray-200 hover:bg-gray-100 rounded-xl text-sm font-semibold text-gray-500"
                  >
                    Cancel
                  </button>
                  {!isReadOnly && (
                    <button
                      type="submit"
                      disabled={saving}
                      className="bg-navy hover:bg-navy/90 text-white px-5 py-2 rounded-xl text-sm font-semibold disabled:opacity-50"
                    >
                      {saving ? "Saving..." : editingFaq ? "Update FAQ" : "Create FAQ"}
                    </button>
                  )}
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
                <h4 className="text-lg font-bold text-navy">Delete FAQ?</h4>
                <p className="text-gray-500 text-xs mt-1">Are you sure you want to delete this FAQ? You can undo this action within 5 seconds.</p>
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

      {/* Undo/Restore Toast Banner */}
      <AnimatePresence>
        {restorableFaq && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-[70] bg-navy text-white px-5 py-4 rounded-2xl shadow-2xl border border-white/10 flex items-center justify-between gap-6 max-w-md w-full"
          >
            <div className="space-y-0.5">
              <p className="text-xs text-white/50 font-bold uppercase tracking-wider">FAQ Deleted</p>
              <p className="text-sm font-bold text-white leading-tight">Deleted question: &apos;{restorableFaq.question}&apos;</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleRestore(restorableFaq.id)}
                className="bg-gold/15 text-gold hover:bg-gold/25 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              >
                Undo / Restore
              </button>
              <button
                onClick={() => setRestorableFaq(null)}
                className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
