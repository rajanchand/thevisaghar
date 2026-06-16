"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Plus,
  Edit,
  Trash2,
  X,
  RefreshCw,
  Info,
} from "lucide-react";

interface FAQItem {
  q: string;
  a: string;
}

interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  icon: string;
  price?: string;
  documentsRequired: string[];
  processingTime?: string;
  eligibility?: string;
  faq?: FAQItem[] | string; // FAQItem[] stored as JSON
  order: number;
  isActive: boolean;
}

const ICONS = ["briefcase", "graduation-cap", "plane", "heart", "globe2", "award", "shield", "users"];

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [icon, setIcon] = useState("briefcase");
  const [price, setPrice] = useState("");
  const [processingTime, setProcessingTime] = useState("");
  const [eligibility, setEligibility] = useState("");
  const [order, setOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [documents, setDocuments] = useState<string[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);

  // Helpers
  const [newDocText, setNewDocText] = useState("");
  const [newFaqQ, setNewFaqQ] = useState("");
  const [newFaqA, setNewFaqA] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [restorableService, setRestorableService] = useState<{ id: string; title: string } | null>(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/services");
      if (res.ok) {
        const data = await res.json();
        setServices(data);
      }
    } catch (error) {
      console.error("Failed to fetch services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void (async () => { await fetchServices(); })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Slug generator useEffect removed to prevent cascading renders

  const handleOpenCreate = () => {
    setEditingService(null);
    setTitle("");
    setSlug("");
    setDescription("");
    setShortDescription("");
    setIcon("briefcase");
    setPrice("");
    setProcessingTime("");
    setEligibility("");
    setOrder(services.length);
    setIsActive(true);
    setDocuments([]);
    setFaqs([]);
    setErrorMsg("");
    setModalOpen(true);
  };

  const handleOpenEdit = (service: Service) => {
    setEditingService(service);
    setTitle(service.title);
    setSlug(service.slug);
    setDescription(service.description);
    setShortDescription(service.shortDescription || "");
    setIcon(service.icon);
    setPrice(service.price || "");
    setProcessingTime(service.processingTime || "");
    setEligibility(service.eligibility || "");
    setOrder(service.order);
    setIsActive(service.isActive);
    setDocuments(service.documentsRequired || []);
    
    // Parse FAQ
    let parsedFaqs: FAQItem[] = [];
    if (service.faq) {
      try {
        parsedFaqs = typeof service.faq === "string" ? JSON.parse(service.faq) : service.faq;
      } catch (e) {
        console.error("Failed to parse FAQs JSON:", e);
      }
    }
    setFaqs(parsedFaqs);
    setErrorMsg("");
    setModalOpen(true);
  };

  const handleAddDocument = () => {
    if (newDocText.trim()) {
      setDocuments([...documents, newDocText.trim()]);
      setNewDocText("");
    }
  };

  const handleRemoveDocument = (index: number) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  const handleAddFaq = () => {
    if (newFaqQ.trim() && newFaqA.trim()) {
      setFaqs([...faqs, { q: newFaqQ.trim(), a: newFaqA.trim() }]);
      setNewFaqQ("");
      setNewFaqA("");
    }
  };

  const handleRemoveFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !description) {
      setErrorMsg("Title, Slug, and Description are required fields.");
      return;
    }

    try {
      setSaving(true);
      setErrorMsg("");

      const payload = {
        title,
        slug,
        description,
        shortDescription: shortDescription || undefined,
        icon,
        price: price || undefined,
        processingTime: processingTime || undefined,
        eligibility: eligibility || undefined,
        order: Number(order),
        isActive,
        documentsRequired: documents,
        faq: faqs,
      };

      const url = editingService ? `/api/admin/services/${editingService.id}` : "/api/admin/services";
      const method = editingService ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setModalOpen(false);
        fetchServices();
      } else {
        setErrorMsg(data.error || "An error occurred while saving the service.");
      }
    } catch (error) {
      setErrorMsg("Failed to connect to the server.");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
      if (res.ok) {
        const deleted = services.find((s) => s.id === id);
        if (deleted) {
          setRestorableService({ id: deleted.id, title: deleted.title });
          // Auto clear after 5s
          setTimeout(() => {
            setRestorableService((curr) => (curr?.id === id ? null : curr));
          }, 5000);
        }
        setServices(services.filter((s) => s.id !== id));
        setIsDeleting(null);
      }
    } catch (error) {
      console.error("Failed to delete service:", error);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/services/${id}/restore`, { method: "POST" });
      if (res.ok) {
        setRestorableService(null);
        await fetchServices();
      }
    } catch (error) {
      console.error("Failed to restore service:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Service Catalog</h1>
          <p className="text-gray-500 text-sm mt-1">Configure and display consultancy visa packages.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 bg-navy hover:bg-navy/90 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm"
        >
          <Plus size={16} className="text-gold" /> Add Service
        </button>
      </div>

      {/* Grid of services */}
      {loading ? (
        <div className="p-12 text-center text-gray-400 space-y-3 bg-white border border-gray-100 rounded-xl shadow-sm">
          <RefreshCw className="animate-spin mx-auto text-gold" size={28} />
          <p className="text-sm">Loading services list...</p>
        </div>
      ) : services.length === 0 ? (
        <div className="p-16 text-center bg-white border border-gray-100 rounded-xl shadow-sm text-gray-500">
          <Briefcase className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="font-bold text-navy">No services configured</p>
          <p className="text-sm mt-1">Click the &quot;Add Service&quot; button to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all group"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-50 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-navy/5 text-navy rounded-lg inline-flex">
                      <Briefcase size={16} />
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      Order: {service.order}
                    </span>
                  </div>
                  <h3 className="font-bold text-navy text-lg group-hover:text-gold transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-gray-400 font-mono">/{service.slug}</p>
                </div>

                <span
                  className={`px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold rounded ${
                    service.isActive
                      ? "bg-green-50 text-green-600 border border-green-200"
                      : "bg-gray-100 text-gray-400 border border-gray-200"
                  }`}
                >
                  {service.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 space-y-4 text-sm text-gray-600">
                <p className="line-clamp-2 text-gray-500">{service.shortDescription || "No short description provided."}</p>

                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs">
                  <div>
                    <span className="text-gray-400 block mb-0.5">Est. Price</span>
                    <span className="font-semibold text-navy">{service.price || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-0.5">Processing</span>
                    <span className="font-semibold text-navy">{service.processingTime || "N/A"}</span>
                  </div>
                </div>

                <div className="text-xs text-gray-400 flex flex-col gap-1">
                  <span>💼 {service.documentsRequired.length} documents required</span>
                  <span>❓ {service.faq ? (typeof service.faq === "string" ? JSON.parse(service.faq).length : service.faq.length) : 0} FAQ items configured</span>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(service)}
                  className="inline-flex items-center gap-1 bg-white hover:bg-navy hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold text-navy border border-gray-200 transition-all"
                >
                  <Edit size={12} /> Edit
                </button>
                <button
                  onClick={() => setIsDeleting(service.id)}
                  className="inline-flex items-center gap-1 bg-white hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold text-red-500 border border-red-100 hover:border-red-500 transition-all"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Creation/Edit Form Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl border border-gray-100 my-8 flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="bg-navy p-6 text-white flex items-center justify-between flex-shrink-0">
                <div>
                  <span className="text-xs text-gold uppercase tracking-widest font-bold">
                    {editingService ? "Update Existing" : "Add New Package"}
                  </span>
                  <h3 className="text-xl font-bold mt-1">
                    {editingService ? `Edit: ${editingService.title}` : "Create Service Card"}
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
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                {errorMsg && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs flex items-center gap-2">
                    <Info size={16} />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Grid 1: Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-navy font-bold uppercase tracking-wider">Service Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. UK Student Visa"
                      value={title}
                      onChange={(e) => {
                        const val = e.target.value;
                        setTitle(val);
                        if (!editingService) {
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
                      placeholder="e.g. uk-student-visa"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-navy/20"
                    />
                  </div>
                </div>

                {/* Grid 2: Sub-info */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs text-navy font-bold uppercase tracking-wider">Short description (for list cards)</label>
                    <input
                      type="text"
                      placeholder="e.g. Step-by-step guidance for Tier 4 sponsor licenses..."
                      value={shortDescription}
                      onChange={(e) => setShortDescription(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-navy font-bold uppercase tracking-wider">Icon Class</label>
                    <select
                      value={icon}
                      onChange={(e) => setIcon(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 bg-white"
                    >
                      {ICONS.map((ic) => (
                        <option key={ic} value={ic}>
                          {ic}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-navy font-bold uppercase tracking-wider">Display Order</label>
                    <input
                      type="number"
                      value={order}
                      onChange={(e) => setOrder(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-navy font-bold uppercase tracking-wider">Estimated Price / Package Fee</label>
                    <input
                      type="text"
                      placeholder="e.g. NPR 45,000 or £700 + Surcharge"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-navy font-bold uppercase tracking-wider">Average Processing Time</label>
                    <input
                      type="text"
                      placeholder="e.g. 3-6 weeks"
                      value={processingTime}
                      onChange={(e) => setProcessingTime(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none"
                    />
                  </div>
                </div>

                {/* Description Textarea */}
                <div className="space-y-1.5">
                  <label className="text-xs text-navy font-bold uppercase tracking-wider">Full Overview & Description</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide a comprehensive introduction and details of the visa package..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 resize-none"
                  />
                </div>

                {/* Eligibility Criteria */}
                <div className="space-y-1.5">
                  <label className="text-xs text-navy font-bold uppercase tracking-wider">Eligibility Requirements (Text format)</label>
                  <textarea
                    rows={3}
                    placeholder="Who is eligible? (e.g. Undergraduates with 6.0 IELTS, professionals with verified UK sponsorship...)"
                    value={eligibility}
                    onChange={(e) => setEligibility(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none"
                  />
                </div>

                {/* Active Checkbox */}
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded text-navy focus:ring-navy"
                  />
                  <label htmlFor="isActive" className="text-sm font-bold text-navy select-none">
                    Publish immediately (Show this service card publicly on the website)
                  </label>
                </div>

                {/* Dynamic Section: Documents Checklist */}
                <div className="border border-gray-100 rounded-2xl p-4 space-y-3 bg-gray-50/50">
                  <h4 className="text-sm font-bold text-navy uppercase tracking-wider flex items-center gap-1.5">
                    📑 Documents Required Checklist
                  </h4>
                  
                  {/* List of current docs */}
                  {documents.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">No document requirements defined yet.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {documents.map((doc, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 shadow-sm"
                        >
                          {doc}
                          <button
                            type="button"
                            onClick={() => handleRemoveDocument(index)}
                            className="text-red-400 hover:text-red-600 transition-colors"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Add document text input */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Add document (e.g. Valid Passport, Bank Statement...)"
                      value={newDocText}
                      onChange={(e) => setNewDocText(e.target.value)}
                      className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddDocument();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddDocument}
                      className="p-2 bg-navy hover:bg-navy/90 text-white rounded-lg transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Dynamic Section: FAQs */}
                <div className="border border-gray-100 rounded-2xl p-4 space-y-4 bg-gray-50/50">
                  <h4 className="text-sm font-bold text-navy uppercase tracking-wider">
                    ❓ Frequently Asked Questions (FAQ)
                  </h4>

                  {/* List of current FAQs */}
                  {faqs.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">No FAQ items defined yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {faqs.map((faq, index) => (
                        <div
                          key={index}
                          className="p-3 bg-white border border-gray-100 rounded-xl relative shadow-sm"
                        >
                          <p className="text-xs font-bold text-navy pr-6">Q: {faq.q}</p>
                          <p className="text-xs text-gray-500 mt-1">A: {faq.a}</p>
                          <button
                            type="button"
                            onClick={() => handleRemoveFaq(index)}
                            className="absolute top-3 right-3 text-red-400 hover:text-red-600 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* FAQ inputs */}
                  <div className="space-y-2 bg-white p-3 rounded-xl border border-gray-100">
                    <input
                      type="text"
                      placeholder="Frequently Asked Question"
                      value={newFaqQ}
                      onChange={(e) => setNewFaqQ(e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs"
                    />
                    <textarea
                      rows={2}
                      placeholder="Answer to the question above..."
                      value={newFaqA}
                      onChange={(e) => setNewFaqA(e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs resize-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddFaq}
                      className="inline-flex items-center gap-1 bg-navy text-gold text-xs px-3 py-1.5 rounded-lg font-bold hover:bg-navy/90"
                    >
                      <Plus size={12} /> Add FAQ Item
                    </button>
                  </div>
                </div>

                {/* Save Footer Button */}
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
                    disabled={saving}
                    className="bg-navy hover:bg-navy/90 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
                  >
                    {saving ? "Saving..." : editingService ? "Update Service" : "Create Service"}
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
                <h4 className="text-lg font-bold text-navy">Delete Service?</h4>
                <p className="text-gray-500 text-xs mt-1">Are you sure you want to delete this visa service category? You can undo this action within 5 seconds.</p>
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
        {restorableService && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-[70] bg-navy text-white px-5 py-4 rounded-2xl shadow-2xl border border-white/10 flex items-center justify-between gap-6 max-w-md w-full"
          >
            <div className="space-y-0.5">
              <p className="text-xs text-white/50 font-bold uppercase tracking-wider">Service Deleted</p>
              <p className="text-sm font-bold text-white leading-tight">Deleted &apos;{restorableService.title}&apos;</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleRestore(restorableService.id)}
                className="bg-gold/15 text-gold hover:bg-gold/25 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              >
                Undo / Restore
              </button>
              <button
                onClick={() => setRestorableService(null)}
                className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"
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
