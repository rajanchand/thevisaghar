"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import {
  Globe2,
  Plus,
  Edit,
  Trash2,
  X,
  RefreshCw,
  Info,
  Calendar,
  BookOpen,
  DollarSign,
  HelpCircle,
  Eye,
} from "lucide-react";

interface CostField {
  category: string;
  feeName: string;
  amount: string;
}

interface FAQItem {
  q: string;
  a: string;
}

interface Country {
  id: string;
  name: string;
  slug: string;
  overview: string;
  costTableFields: CostField[] | string;
  requirements: string[] | string;
  englishRequirements: string[] | string;
  intakes: string[] | string;
  scholarships?: string | null;
  workRights?: string | null;
  faqList: FAQItem[] | string;
  images: string[] | string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  published: boolean;
}

export default function AdminCountries() {
  const { data: session } = useSession();
  const userRole = session?.user?.role || "VIEWER";
  const isReadOnly = userRole === "VIEWER";

  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "requirements" | "costs" | "seo">("general");
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [overview, setOverview] = useState("");
  const [scholarships, setScholarships] = useState("");
  const [workRights, setWorkRights] = useState("");
  const [published, setPublished] = useState(false);

  // Lists form states
  const [requirements, setRequirements] = useState<string[]>([]);
  const [englishRequirements, setEnglishRequirements] = useState<string[]>([]);
  const [intakes, setIntakes] = useState<string[]>([]);
  const [costFields, setCostFields] = useState<CostField[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);

  // SEO
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");

  // Helpers inputs
  const [newReq, setNewReq] = useState("");
  const [newEng, setNewEng] = useState("");
  const [newIntake, setNewIntake] = useState("");
  const [newCostCategory, setNewCostCategory] = useState("Tuition");
  const [newCostName, setNewCostName] = useState("");
  const [newCostAmount, setNewCostAmount] = useState("");
  const [newFaqQ, setNewFaqQ] = useState("");
  const [newFaqA, setNewFaqA] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [restorableCountry, setRestorableCountry] = useState<{ id: string; name: string } | null>(null);

  const fetchCountries = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/countries");
      if (res.ok) {
        const data = await res.json();
        setCountries(data);
      }
    } catch (error) {
      console.error("Failed to fetch countries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void (async () => { await fetchCountries(); })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleOpenCreate = () => {
    if (isReadOnly) return;
    setEditingCountry(null);
    setName("");
    setSlug("");
    setOverview("");
    setScholarships("");
    setWorkRights("");
    setPublished(true);
    setRequirements([]);
    setEnglishRequirements([]);
    setIntakes([]);
    setCostFields([]);
    setFaqs([]);
    setSeoTitle("");
    setSeoDescription("");
    setActiveTab("general");
    setErrorMsg("");
    setModalOpen(true);
  };

  const handleOpenEdit = (country: Country) => {
    setEditingCountry(country);
    setName(country.name);
    setSlug(country.slug);
    setOverview(country.overview);
    setScholarships(country.scholarships || "");
    setWorkRights(country.workRights || "");
    setPublished(country.published);
    setSeoTitle(country.seoTitle || "");
    setSeoDescription(country.seoDescription || "");

    // Safe parses for lists
    const safeParse = <T,>(val: unknown, fallback: T): T => {
      if (!val) return fallback;
      try {
        return typeof val === "string" ? (JSON.parse(val) as T) : (val as T);
      } catch {
        return fallback;
      }
    };

    setRequirements(safeParse<string[]>(country.requirements, []));
    setEnglishRequirements(safeParse<string[]>(country.englishRequirements, []));
    setIntakes(safeParse<string[]>(country.intakes, []));
    setCostFields(safeParse<CostField[]>(country.costTableFields, []));
    setFaqs(safeParse<FAQItem[]>(country.faqList, []));

    setActiveTab("general");
    setErrorMsg("");
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;
    if (!name || !slug || !overview) {
      setErrorMsg("Country name, URL slug, and overview content are required.");
      return;
    }

    try {
      setSaving(true);
      setErrorMsg("");

      const payload = {
        name,
        slug,
        overview,
        scholarships: scholarships || null,
        workRights: workRights || null,
        published,
        requirements,
        englishRequirements,
        intakes,
        costTableFields: costFields,
        faqList: faqs,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        images: [],
      };

      const url = editingCountry ? `/api/admin/countries/${editingCountry.id}` : "/api/admin/countries";
      const method = editingCountry ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setModalOpen(false);
        fetchCountries();
      } else {
        setErrorMsg(data.error || "Failed to save country.");
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("A server error occurred while saving profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (userRole !== "ADMIN") return;
    try {
      const res = await fetch(`/api/admin/countries/${id}`, { method: "DELETE" });
      if (res.ok) {
        const deleted = countries.find((c) => c.id === id);
        if (deleted) {
          setRestorableCountry({ id: deleted.id, name: deleted.name });
          setTimeout(() => {
            setRestorableCountry((curr) => (curr?.id === id ? null : curr));
          }, 5000);
        }
        setCountries(countries.filter((c) => c.id !== id));
        setIsDeleting(null);
      }
    } catch (error) {
      console.error("Failed to delete country:", error);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/countries/${id}/restore`, { method: "POST" });
      if (res.ok) {
        setRestorableCountry(null);
        await fetchCountries();
      }
    } catch (error) {
      console.error("Failed to restore country:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Country Destinations</h1>
          <p className="text-gray-500 text-sm mt-1">Configure study abroad hubs, cost details, and student requirements.</p>
        </div>
        {!isReadOnly && (
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 bg-navy hover:bg-navy/90 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm"
          >
            <Plus size={16} className="text-gold" /> Add Country
          </button>
        )}
      </div>

      {/* Grid view */}
      {loading ? (
        <div className="p-12 text-center text-gray-400 space-y-3 bg-white border border-gray-100 rounded-xl shadow-sm">
          <RefreshCw className="animate-spin mx-auto text-gold" size={28} />
          <p className="text-sm">Loading destinations list...</p>
        </div>
      ) : countries.length === 0 ? (
        <div className="p-16 text-center bg-white border border-gray-100 rounded-xl shadow-sm text-gray-500">
          <Globe2 className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="font-bold text-navy">No countries profiles created</p>
          <p className="text-sm mt-1">Click the &quot;Add Country&quot; button to set up student hubs.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {countries.map((c, idx) => {
            const intakesList = typeof c.intakes === "string" ? JSON.parse(c.intakes) : c.intakes;
            const reqList = typeof c.requirements === "string" ? JSON.parse(c.requirements) : c.requirements;
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all group"
              >
                <div className="p-6 border-b border-gray-50 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="font-bold text-navy text-lg group-hover:text-gold transition-colors">
                      {c.name}
                    </h3>
                    <p className="text-xs text-gray-400 font-mono">/countries/{c.slug}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold rounded ${
                      c.published
                        ? "bg-green-50 text-green-600 border border-green-200"
                        : "bg-amber-50 text-amber-600 border border-amber-200"
                    }`}
                  >
                    {c.published ? "Published" : "Draft"}
                  </span>
                </div>

                <div className="p-6 flex-1 space-y-4 text-sm text-gray-600">
                  <p className="line-clamp-3 text-gray-500 leading-relaxed">{c.overview}</p>

                  <div className="space-y-2 bg-gray-50 p-3.5 rounded-xl border border-gray-100 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Intakes:</span>
                      <span className="font-bold text-navy truncate max-w-[150px]">
                        {intakesList?.join(", ") || "None set"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Prerequisites:</span>
                      <span className="font-bold text-navy">
                        {reqList?.length || 0} items defined
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                  <a
                    href={`/countries/${c.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-navy hover:text-gold inline-flex items-center gap-1 transition-colors"
                  >
                    <Eye size={12} /> Preview
                  </a>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(c)}
                      className="inline-flex items-center gap-1 bg-white hover:bg-navy hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold text-navy border border-gray-200 transition-all"
                    >
                      <Edit size={12} /> {isReadOnly ? "View" : "Edit"}
                    </button>
                    {userRole === "ADMIN" && (
                      <button
                        onClick={() => setIsDeleting(c.id)}
                        className="inline-flex items-center gap-1 bg-white hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold text-red-500 border border-red-100 hover:border-red-500 transition-all"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Create/Edit Tabbed Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl border border-gray-100 my-8 flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="bg-navy p-6 text-white flex items-center justify-between flex-shrink-0">
                <div>
                  <span className="text-xs text-gold uppercase tracking-widest font-bold">
                    {editingCountry ? "Update Destination" : "Create Study Abroad Country Profile"}
                  </span>
                  <h3 className="text-xl font-bold mt-1">
                    {editingCountry ? `Edit Info: ${editingCountry.name}` : "Configure New Destination"}
                  </h3>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Tabs selector */}
              <div className="bg-gray-50 border-b border-gray-100 px-6 flex gap-4 text-xs font-bold uppercase tracking-wider flex-shrink-0">
                {[
                  { id: "general", label: "General overview", icon: Globe2 },
                  { id: "requirements", label: "Prerequisites & Intakes", icon: Calendar },
                  { id: "costs", label: "Financials & Fees", icon: DollarSign },
                  { id: "seo", label: "FAQs & SEO", icon: HelpCircle },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id as typeof activeTab)}
                    className={`py-4 border-b-2 px-1 flex items-center gap-1.5 transition-all ${
                      activeTab === t.id
                        ? "border-gold text-navy"
                        : "border-transparent text-gray-400 hover:text-navy"
                    }`}
                  >
                    <t.icon size={14} /> {t.label}
                  </button>
                ))}
              </div>

              {/* Form Body - Scrollable */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                {errorMsg && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs flex items-center gap-2">
                    <Info size={16} />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Tab 1: General Info */}
                {activeTab === "general" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs text-navy font-bold uppercase tracking-wider">Country Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. United Kingdom"
                          value={name}
                          onChange={(e) => {
                            const val = e.target.value;
                            setName(val);
                            if (!editingCountry) {
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
                          placeholder="e.g. uk"
                          value={slug}
                          onChange={(e) => setSlug(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-navy/20"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-navy font-bold uppercase tracking-wider">Overview Content</label>
                      <textarea
                        required
                        rows={6}
                        placeholder="Provide an overview of studying in this country, why it's a great destination, etc."
                        value={overview}
                        onChange={(e) => setOverview(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs text-navy font-bold uppercase tracking-wider">Scholarships summary info</label>
                        <input
                          type="text"
                          placeholder="e.g. Up to £5,000 merit-based automatic discount..."
                          value={scholarships}
                          onChange={(e) => setScholarships(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-navy font-bold uppercase tracking-wider">Work Rights / Post Study visa</label>
                        <input
                          type="text"
                          placeholder="e.g. 20 hours/week during term, 2-year Graduate Route..."
                          value={workRights}
                          onChange={(e) => setWorkRights(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none"
                        />
                      </div>
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
                        Publish country page publicly on the website.
                      </label>
                    </div>
                  </div>
                )}

                {/* Tab 2: Prerequisites & Intakes */}
                {activeTab === "requirements" && (
                  <div className="space-y-6">
                    {/* Intakes selection */}
                    <div className="border border-gray-100 rounded-2xl p-4 bg-gray-50/50 space-y-3">
                      <h4 className="text-sm font-bold text-navy flex items-center gap-1.5">
                        <Calendar size={16} className="text-gold" /> Country Academic Intakes
                      </h4>
                      {intakes.length === 0 ? (
                        <p className="text-xs text-gray-400 italic">No intakes defined yet (e.g. September, January).</p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {intakes.map((int, i) => (
                            <span key={i} className="inline-flex items-center gap-1 bg-white border border-gray-200 px-3 py-1 rounded-lg text-xs font-semibold text-gray-600">
                              {int}
                              <button type="button" onClick={() => setIntakes(intakes.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600"><X size={12} /></button>
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Add intake (e.g. Sept / Oct 2026)"
                          value={newIntake}
                          onChange={(e) => setNewIntake(e.target.value)}
                          className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              if (newIntake.trim()) {
                                setIntakes([...intakes, newIntake.trim()]);
                                setNewIntake("");
                              }
                            }
                          }}
                        />
                        <button type="button" onClick={() => { if (newIntake.trim()) { setIntakes([...intakes, newIntake.trim()]); setNewIntake(""); } }} className="p-2 bg-navy text-white rounded-lg"><Plus size={14} /></button>
                      </div>
                    </div>

                    {/* Academic Requirements list */}
                    <div className="border border-gray-100 rounded-2xl p-4 bg-gray-50/50 space-y-3">
                      <h4 className="text-sm font-bold text-navy flex items-center gap-1.5">
                        <BookOpen size={16} className="text-gold" /> General Academic Entry Requirements
                      </h4>
                      {requirements.length === 0 ? (
                        <p className="text-xs text-gray-400 italic">No requirements defined yet.</p>
                      ) : (
                        <div className="space-y-2">
                          {requirements.map((req, i) => (
                            <div key={i} className="flex justify-between items-start bg-white p-2 border border-gray-150 rounded-xl text-xs text-navy font-medium">
                              <span>• {req}</span>
                              <button type="button" onClick={() => setRequirements(requirements.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600 pr-1"><X size={14} /></button>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Add requirement (e.g. Minimum 2.8 GPA in High School / Bachelors...)"
                          value={newReq}
                          onChange={(e) => setNewReq(e.target.value)}
                          className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              if (newReq.trim()) {
                                setRequirements([...requirements, newReq.trim()]);
                                setNewReq("");
                              }
                            }
                          }}
                        />
                        <button type="button" onClick={() => { if (newReq.trim()) { setRequirements([...requirements, newReq.trim()]); setNewReq(""); } }} className="p-2 bg-navy text-white rounded-lg"><Plus size={14} /></button>
                      </div>
                    </div>

                    {/* Language Requirements list */}
                    <div className="border border-gray-100 rounded-2xl p-4 bg-gray-50/50 space-y-3">
                      <h4 className="text-sm font-bold text-navy flex items-center gap-1.5">
                        💬 Language Competency Requirements (IELTS, PTE, etc.)
                      </h4>
                      {englishRequirements.length === 0 ? (
                        <p className="text-xs text-gray-400 italic">No language prerequisites defined.</p>
                      ) : (
                        <div className="space-y-2">
                          {englishRequirements.map((eng, i) => (
                            <div key={i} className="flex justify-between items-start bg-white p-2 border border-gray-150 rounded-xl text-xs text-navy font-medium">
                              <span>• {eng}</span>
                              <button type="button" onClick={() => setEnglishRequirements(englishRequirements.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600 pr-1"><X size={14} /></button>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Add test criteria (e.g. IELTS: 6.0 overall with no band less than 5.5...)"
                          value={newEng}
                          onChange={(e) => setNewEng(e.target.value)}
                          className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              if (newEng.trim()) {
                                setEnglishRequirements([...englishRequirements, newEng.trim()]);
                                setNewEng("");
                              }
                            }
                          }}
                        />
                        <button type="button" onClick={() => { if (newEng.trim()) { setEnglishRequirements([...englishRequirements, newEng.trim()]); setNewEng(""); } }} className="p-2 bg-navy text-white rounded-lg"><Plus size={14} /></button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 3: Financials & Fees */}
                {activeTab === "costs" && (
                  <div className="space-y-4">
                    <div className="border border-gray-100 rounded-2xl p-4 bg-gray-50/50 space-y-3">
                      <h4 className="text-sm font-bold text-navy flex items-center gap-1.5">
                        <DollarSign size={16} className="text-gold" /> Dynamic Cost Estimation Table
                      </h4>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        Populate key tuition fees and living cost guidelines. These will display in a tabular calculator layout.
                      </p>

                      {/* Cost table list */}
                      {costFields.length === 0 ? (
                        <p className="text-xs text-gray-400 italic">No estimation fields created yet.</p>
                      ) : (
                        <div className="overflow-x-auto bg-white rounded-xl border border-gray-150 shadow-sm">
                          <table className="min-w-full divide-y divide-gray-150 text-xs">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-2 text-left font-bold text-navy uppercase">Category</th>
                                <th className="px-4 py-2 text-left font-bold text-navy uppercase">Fee Description</th>
                                <th className="px-4 py-2 text-left font-bold text-navy uppercase">Amount Guidance</th>
                                <th className="px-4 py-2 text-right"></th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {costFields.map((field, i) => (
                                <tr key={i} className="hover:bg-gray-50/50">
                                  <td className="px-4 py-2 font-semibold text-navy">{field.category}</td>
                                  <td className="px-4 py-2 text-gray-600">{field.feeName}</td>
                                  <td className="px-4 py-2 text-gray-600 font-mono font-semibold">{field.amount}</td>
                                  <td className="px-4 py-2 text-right">
                                    <button
                                      type="button"
                                      onClick={() => setCostFields(costFields.filter((_, idx) => idx !== i))}
                                      className="text-red-400 hover:text-red-600"
                                    >
                                      <X size={14} />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* Cost row creator */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-white p-3 rounded-xl border border-gray-150">
                        <select
                          value={newCostCategory}
                          onChange={(e) => setNewCostCategory(e.target.value)}
                          className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs"
                        >
                          <option value="Tuition">Tuition Fee</option>
                          <option value="Living">Living Costs</option>
                          <option value="Visa">Visa & Insurance</option>
                          <option value="Other">Other Expenses</option>
                        </select>
                        <input
                          type="text"
                          placeholder="Fee Name (e.g. Undergraduate Courses)"
                          value={newCostName}
                          onChange={(e) => setNewCostName(e.target.value)}
                          className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs"
                        />
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Amount (e.g. £12,000 - £18,000 / yr)"
                            value={newCostAmount}
                            onChange={(e) => setNewCostAmount(e.target.value)}
                            className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (newCostName.trim() && newCostAmount.trim()) {
                                setCostFields([
                                  ...costFields,
                                  {
                                    category: newCostCategory,
                                    feeName: newCostName.trim(),
                                    amount: newCostAmount.trim(),
                                  },
                                ]);
                                setNewCostName("");
                                setNewCostAmount("");
                              }
                            }}
                            className="p-2 bg-navy text-white rounded-lg"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 4: FAQs & SEO */}
                {activeTab === "seo" && (
                  <div className="space-y-6">
                    {/* FAQ creator */}
                    <div className="border border-gray-100 rounded-2xl p-4 bg-gray-50/50 space-y-3">
                      <h4 className="text-sm font-bold text-navy flex items-center gap-1.5">
                        <HelpCircle size={16} className="text-gold" /> Country Destination FAQs
                      </h4>
                      {faqs.length === 0 ? (
                        <p className="text-xs text-gray-400 italic">No FAQs configured yet.</p>
                      ) : (
                        <div className="space-y-2.5">
                          {faqs.map((faq, i) => (
                            <div key={i} className="p-3 bg-white border border-gray-100 rounded-xl relative shadow-sm text-xs">
                              <p className="font-bold text-navy pr-6">Q: {faq.q}</p>
                              <p className="text-gray-500 mt-1">A: {faq.a}</p>
                              <button
                                type="button"
                                onClick={() => setFaqs(faqs.filter((_, idx) => idx !== i))}
                                className="absolute top-3 right-3 text-red-400 hover:text-red-600"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="space-y-2 bg-white p-3 rounded-xl border border-gray-150">
                        <input
                          type="text"
                          placeholder="Question (e.g. Can students work in the UK?)"
                          value={newFaqQ}
                          onChange={(e) => setNewFaqQ(e.target.value)}
                          className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs"
                        />
                        <textarea
                          rows={2}
                          placeholder="Answer content..."
                          value={newFaqA}
                          onChange={(e) => setNewFaqA(e.target.value)}
                          className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs resize-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (newFaqQ.trim() && newFaqA.trim()) {
                              setFaqs([...faqs, { q: newFaqQ.trim(), a: newFaqA.trim() }]);
                              setNewFaqQ("");
                              setNewFaqA("");
                            }
                          }}
                          className="inline-flex items-center gap-1 bg-navy text-gold text-xs px-3 py-1.5 rounded-lg font-bold"
                        >
                          <Plus size={12} /> Add FAQ Item
                        </button>
                      </div>
                    </div>

                    {/* SEO fields */}
                    <div className="border border-gray-100 rounded-2xl p-4 bg-gray-50/50 space-y-4">
                      <h4 className="text-sm font-bold text-navy">🔍 SEO Meta Configurations</h4>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs text-navy font-bold uppercase tracking-wider">SEO Custom Title</label>
                          <input
                            type="text"
                            placeholder="e.g. Study in UK | The Visa Ghar"
                            value={seoTitle}
                            onChange={(e) => setSeoTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs text-navy font-bold uppercase tracking-wider">SEO Meta Description</label>
                          <textarea
                            rows={3}
                            placeholder="Briefly state target benefits to drive search clickthroughs..."
                            value={seoDescription}
                            onChange={(e) => setSeoDescription(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Save Footer Button */}
                <div className="pt-4 border-t border-gray-100 flex justify-end gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 border border-gray-200 hover:bg-gray-100 rounded-xl text-sm font-semibold text-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                  {!isReadOnly && (
                    <button
                      type="submit"
                      disabled={saving}
                      className="bg-navy hover:bg-navy/90 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
                    >
                      {saving ? "Saving..." : editingCountry ? "Update Profile" : "Create Profile"}
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
                <h4 className="text-lg font-bold text-navy">Delete Country?</h4>
                <p className="text-gray-500 text-xs mt-1">Are you sure you want to delete this study destination profile? You can undo this action within 5 seconds.</p>
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
        {restorableCountry && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-[70] bg-navy text-white px-5 py-4 rounded-2xl shadow-2xl border border-white/10 flex items-center justify-between gap-6 max-w-md w-full"
          >
            <div className="space-y-0.5">
              <p className="text-xs text-white/50 font-bold uppercase tracking-wider">Country Profile Deleted</p>
              <p className="text-sm font-bold text-white leading-tight">Deleted &apos;{restorableCountry.name}&apos;</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleRestore(restorableCountry.id)}
                className="bg-gold/15 text-gold hover:bg-gold/25 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              >
                Undo / Restore
              </button>
              <button
                onClick={() => setRestorableCountry(null)}
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
