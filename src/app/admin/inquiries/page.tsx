"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Download,
  Mail,
  Phone,
  Clock,
  Eye,
  Trash2,
  X,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  MessageSquare,
  Undo2,
  BookOpen,
  DollarSign
} from "lucide-react";

interface TimelineNote {
  text: string;
  author: string;
  createdAt: string;
  system?: boolean;
}

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  visaType: string;
  message: string;
  isRead: boolean;
  isReplied: boolean;
  createdAt: string;
  status: string;
  source: string;
  country?: string;
  assignedToId?: string;
  assignedTo?: {
    id: string;
    name: string;
    email: string;
  };
  notes?: TimelineNote[];
  academicInfo?: {
    degree?: string;
    scoreType?: string;
    academicScore?: number;
    englishScore?: number;
    gapYears?: number;
  };
  costInfo?: {
    calcLevel?: string;
    calcMonths?: number;
    includeDependent?: boolean;
  };
}

interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function AdminInquiries() {
  const { data: session } = useSession();
  const userRole = session?.user?.role || "VIEWER";
  const isReadOnly = userRole === "VIEWER";

  // Data States
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [staffList, setStaffList] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filter & Query States
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Interaction States
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [restorableLead, setRestorableLead] = useState<{ id: string; name: string } | null>(null);
  const [newNoteText, setNewNoteText] = useState("");
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  // Fetch paginated leads from database
  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder,
      });

      if (searchQuery) params.append("search", searchQuery);
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (sourceFilter !== "all") params.append("source", sourceFilter);
      if (countryFilter !== "all") params.append("country", countryFilter);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const res = await fetch(`/api/admin/inquiries?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setInquiries(data.items || []);
        setTotalItems(data.meta?.totalItems || 0);
        setTotalPages(data.meta?.totalPages || 1);
      }
    } catch (error) {
      console.error("Failed to fetch inquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch active staff lists for assignment dropdown
  const fetchStaffList = async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setStaffList(data);
      }
    } catch (error) {
      console.error("Failed to fetch staff list:", error);
    }
  };

  useEffect(() => {
    const loadLeads = async () => {
      await fetchInquiries();
    };
    void loadLeads();
  }, [page, statusFilter, sourceFilter, countryFilter, startDate, endDate, sortBy, sortOrder]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (session) {
      const loadStaff = async () => {
        await fetchStaffList();
      };
      void loadStaff();
    }
  }, [session]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchInquiries();
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setSourceFilter("all");
    setCountryFilter("all");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  // Toggle Read / Replied or update other fields
  const handleUpdateLead = async (id: string, updates: Record<string, unknown>) => {
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (res.ok) {
        const updated = await res.json();
        setInquiries((prev) => prev.map((inq) => (inq.id === id ? updated : inq)));
        if (selectedInquiry && selectedInquiry.id === id) {
          setSelectedInquiry(updated);
        }
      }
    } catch (error) {
      console.error("Failed to update inquiry:", error);
    }
  };

  // Submit internal note timeline entry
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry || !newNoteText.trim() || isSubmittingNote) return;

    try {
      setIsSubmittingNote(true);
      const res = await fetch(`/api/admin/inquiries/${selectedInquiry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteText: newNoteText }),
      });

      if (res.ok) {
        const updated = await res.json();
        setInquiries((prev) => prev.map((inq) => (inq.id === selectedInquiry.id ? updated : inq)));
        setSelectedInquiry(updated);
        setNewNoteText("");
      }
    } catch (error) {
      console.error("Failed to add note:", error);
    } finally {
      setIsSubmittingNote(false);
    }
  };

  // Soft Delete Lead
  const handleSoftDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        const target = inquiries.find((inq) => inq.id === id);
        if (target) {
          setRestorableLead({ id: target.id, name: target.name });
          // Clear restore banner after 6 seconds
          setTimeout(() => {
            setRestorableLead((prev) => (prev?.id === id ? null : prev));
          }, 6000);
        }
        setInquiries((prev) => prev.filter((inq) => inq.id !== id));
        setIsDeleting(null);
        if (selectedInquiry && selectedInquiry.id === id) {
          setSelectedInquiry(null);
        }
      }
    } catch (error) {
      console.error("Failed to delete lead:", error);
    }
  };

  // Restore Soft-Deleted Lead
  const handleRestoreLead = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/inquiries/${id}/restore`, {
        method: "POST",
      });

      if (res.ok) {
        setRestorableLead(null);
        fetchInquiries();
      }
    } catch (error) {
      console.error("Failed to restore lead:", error);
    }
  };

  // Export CSV with current filters
  const handleExportCSV = () => {
    const params = new URLSearchParams({
      export: "csv",
      sortBy,
      sortOrder,
    });

    if (searchQuery) params.append("search", searchQuery);
    if (statusFilter !== "all") params.append("status", statusFilter);
    if (sourceFilter !== "all") params.append("source", sourceFilter);
    if (countryFilter !== "all") params.append("country", countryFilter);
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    window.open(`/api/admin/inquiries?${params.toString()}`, "_blank");
  };

  const handleHeaderSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  return (
    <div className="space-y-6">
      {/* Restore Banner */}
      <AnimatePresence>
        {restorableLead && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-navy border border-gold/20 p-4 rounded-2xl flex items-center justify-between text-white shadow-lg"
          >
            <div className="flex items-center gap-2.5">
              <Undo2 className="text-gold" size={18} />
              <span className="text-sm font-semibold">
                Lead &quot;{restorableLead.name}&quot; has been soft-deleted.
              </span>
            </div>
            <button
              onClick={() => handleRestoreLead(restorableLead.id)}
              className="bg-gold hover:bg-gold-dark text-navy px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
            >
              Undo Restore
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Leads & Inquiries CRM</h1>
          <p className="text-gray-500 text-sm mt-1">
            Track student eligibility, study cost calculators, and contact forms.
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="inline-flex items-center justify-center gap-2 bg-navy hover:bg-navy/90 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm group hover:scale-[1.02]"
        >
          <Download size={16} className="text-gold group-hover:translate-y-0.5 transition-transform" />
          Export filtered CSV
        </button>
      </div>

      {/* Advanced Filters */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search leads by name, email, query, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
            />
          </div>
          <button
            type="submit"
            className="bg-navy hover:bg-navy-light text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all"
          >
            Search
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 pt-2">
          {/* Status Filter */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Pipeline Status</label>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 bg-gray-50 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="NEW">New</option>
              <option value="CONTACTED">Contacted</option>
              <option value="COUNSELLING_BOOKED">Counselling Booked</option>
              <option value="APPLIED">Applied</option>
              <option value="CLOSED_WON">Closed (Won)</option>
              <option value="CLOSED_LOST">Closed (Lost)</option>
            </select>
          </div>

          {/* Source Filter */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Lead Source</label>
            <select
              value={sourceFilter}
              onChange={(e) => { setSourceFilter(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 bg-gray-50 focus:outline-none"
            >
              <option value="all">All Sources</option>
              <option value="CONTACT_PAGE">Contact Page</option>
              <option value="INQUIRY_FORM">Inquiry Form</option>
              <option value="ELIGIBILITY_CHECK">Eligibility Checker</option>
              <option value="COST_CALCULATOR">Cost Calculator</option>
            </select>
          </div>

          {/* Country Filter */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Destination Country</label>
            <select
              value={countryFilter}
              onChange={(e) => { setCountryFilter(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 bg-gray-50 focus:outline-none"
            >
              <option value="all">All Countries</option>
              <option value="uk">United Kingdom</option>
              <option value="australia">Australia</option>
              <option value="usa">USA</option>
              <option value="canada">Canada</option>
              <option value="japan">Japan</option>
              <option value="finland">Finland</option>
            </select>
          </div>

          {/* Date range inputs */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">From Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
              className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 bg-gray-50 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">To Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
              className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 bg-gray-50 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
          <button
            onClick={handleResetFilters}
            className="text-xs font-bold text-gold hover:text-gold-dark flex items-center gap-1 transition-colors"
          >
            <X size={12} /> Clear Filter Settings
          </button>
          <div className="text-xs text-gray-400 font-semibold">
            Found {totalItems} matching lead entries
          </div>
        </div>
      </div>

      {/* CRM Leads Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400 space-y-3">
            <RefreshCw className="animate-spin mx-auto text-gold" size={28} />
            <p className="text-sm">Loading lead registry...</p>
          </div>
        ) : inquiries.length === 0 ? (
          <div className="p-16 text-center text-gray-500">
            <Mail className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="font-bold text-navy text-lg">No leads match filters</p>
            <p className="text-sm text-gray-400 mt-1">Try resetting the search terms or filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-100 text-navy font-bold text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-4 px-6 cursor-pointer hover:bg-gray-100/50" onClick={() => handleHeaderSort("name")}>
                    Student Name {sortBy === "name" && (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                  <th className="p-4">Visa Category</th>
                  <th className="p-4">Source</th>
                  <th className="p-4">Staff Assigned</th>
                  <th className="p-4 cursor-pointer hover:bg-gray-100/50" onClick={() => handleHeaderSort("createdAt")}>
                    Registered {sortBy === "createdAt" && (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {inquiries.map((inq) => (
                  <tr
                    key={inq.id}
                    className={`hover:bg-gray-50/50 transition-colors ${
                      !inq.isRead ? "font-bold text-navy" : "text-gray-600 font-medium"
                    }`}
                  >
                    <td className="p-4 px-6">
                      <div>
                        <div className="text-navy">{inq.name}</div>
                        <div className="text-xs text-gray-400 flex items-center gap-1.5 mt-1 font-medium">
                          <Mail size={12} /> {inq.email}
                          {inq.phone && (
                            <>
                              <span className="text-gray-300">|</span>
                              <Phone size={12} /> {inq.phone}
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-gold/10 text-navy border border-gold/20 text-xs font-bold rounded-full">
                        {inq.visaType}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-semibold text-gray-500 capitalize">
                        {inq.source.toLowerCase().replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-bold text-navy/80 flex items-center gap-1">
                        <UserCheck size={12} className="text-gold" />
                        {inq.assignedTo?.name || "Unassigned"}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-lg border ${
                          inq.status === "NEW"
                            ? "bg-blue-50 text-blue-600 border-blue-200"
                            : inq.status === "CONTACTED"
                            ? "bg-yellow-50 text-yellow-600 border-yellow-200"
                            : inq.status === "COUNSELLING_BOOKED"
                            ? "bg-purple-50 text-purple-600 border-purple-200"
                            : inq.status === "APPLIED"
                            ? "bg-orange-50 text-orange-600 border-orange-200"
                            : inq.status === "CLOSED_WON"
                            ? "bg-green-50 text-green-600 border-green-200"
                            : "bg-red-50 text-red-600 border-red-200"
                        }`}
                      >
                        {inq.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedInquiry(inq);
                            if (!inq.isRead) {
                              handleUpdateLead(inq.id, { isRead: true });
                            }
                          }}
                          className="p-1.5 hover:bg-navy/5 text-navy hover:text-navy/80 rounded-lg transition-all"
                          title="Open Details CRM"
                        >
                          <Eye size={16} />
                        </button>
                        {!isReadOnly && (
                          <button
                            onClick={() => setIsDeleting(inq.id)}
                            className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-all"
                            title="Soft Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="bg-gray-50 border-t border-gray-100 px-6 py-4 flex items-center justify-between">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-navy disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft size={16} /> Previous Page
                </button>
                <span className="text-xs font-bold text-gray-500">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-navy disabled:opacity-40 transition-colors"
                >
                  Next Page <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Inquiry Detail CRM Modal */}
      <AnimatePresence>
        {selectedInquiry && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-end backdrop-blur-xs">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="bg-white w-full max-w-2xl h-full shadow-2xl border-l border-gray-200 flex flex-col"
            >
              {/* Header */}
              <div className="bg-navy p-6 text-white flex items-center justify-between flex-shrink-0">
                <div>
                  <span className="text-xs text-gold uppercase tracking-widest font-bold">
                    Lead CRM Profile
                  </span>
                  <h3 className="text-xl font-bold mt-1">{selectedInquiry.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                {/* Meta details grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-200">
                  <div className="space-y-1">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Email Address</p>
                    <a href={`mailto:${selectedInquiry.email}`} className="text-sm font-bold text-navy hover:underline flex items-center gap-1.5">
                      <Mail size={14} className="text-gold" /> {selectedInquiry.email}
                    </a>
                  </div>
                  {selectedInquiry.phone && (
                    <div className="space-y-1">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Phone Number</p>
                      <a href={`tel:${selectedInquiry.phone}`} className="text-sm font-bold text-navy hover:underline flex items-center gap-1.5">
                        <Phone size={14} className="text-gold" /> {selectedInquiry.phone}
                      </a>
                    </div>
                  )}
                  <div className="space-y-1">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Visa Type</p>
                    <span className="inline-block px-2.5 py-0.5 bg-gold/10 text-navy border border-gold/20 text-xs font-bold rounded-full">
                      {selectedInquiry.visaType}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Registered</p>
                    <span className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                      <Clock size={14} className="text-gold" /> {new Date(selectedInquiry.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Eligibility Check Details */}
                {selectedInquiry.academicInfo && (
                  <div className="border border-blue-100 bg-blue-50/30 p-4 rounded-2xl space-y-3">
                    <h4 className="text-xs font-extrabold text-navy uppercase tracking-wider flex items-center gap-2">
                      <BookOpen size={14} className="text-blue-500" /> Academic Profile Eligibility Check
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-gray-400 font-medium">Highest Degree:</span>
                        <p className="font-bold text-navy mt-0.5">{selectedInquiry.academicInfo.degree || "N/A"}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 font-medium">Academic Mark/GPA:</span>
                        <p className="font-bold text-navy mt-0.5">
                          {selectedInquiry.academicInfo.academicScore || "N/A"} ({selectedInquiry.academicInfo.scoreType})
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-400 font-medium">English Proficiency Score:</span>
                        <p className="font-bold text-navy mt-0.5">{selectedInquiry.academicInfo.englishScore || "N/A"} IELTS/PTE</p>
                      </div>
                      <div>
                        <span className="text-gray-400 font-medium">Academic Study Gap:</span>
                        <p className="font-bold text-navy mt-0.5">{selectedInquiry.academicInfo.gapYears || 0} years</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Cost Calculator Details */}
                {selectedInquiry.costInfo && (
                  <div className="border border-green-100 bg-green-50/30 p-4 rounded-2xl space-y-3">
                    <h4 className="text-xs font-extrabold text-navy uppercase tracking-wider flex items-center gap-2">
                      <DollarSign size={14} className="text-green-600" /> Cost Calculator Estimation
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-gray-400 font-medium">Intended Study Level:</span>
                        <p className="font-bold text-navy mt-0.5">{selectedInquiry.costInfo.calcLevel || "N/A"}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 font-medium">Financial Term:</span>
                        <p className="font-bold text-navy mt-0.5">{selectedInquiry.costInfo.calcMonths || 0} Months</p>
                      </div>
                      <div>
                        <span className="text-gray-400 font-medium">Include Dependents:</span>
                        <p className="font-bold text-navy mt-0.5">{selectedInquiry.costInfo.includeDependent ? "Yes" : "No"}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Staff Assignment & Pipeline Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-b border-gray-100 py-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Assigned Counselor
                    </label>
                    <select
                      value={selectedInquiry.assignedToId || ""}
                      onChange={(e) => handleUpdateLead(selectedInquiry.id, { assignedToId: e.target.value || null })}
                      disabled={isReadOnly}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-bold text-navy bg-white focus:outline-none disabled:opacity-50"
                    >
                      <option value="">Unassigned</option>
                      {staffList.map((staff) => (
                        <option key={staff.id} value={staff.id}>
                          {staff.name} ({staff.role})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Pipeline Status Step
                    </label>
                    <select
                      value={selectedInquiry.status}
                      onChange={(e) => handleUpdateLead(selectedInquiry.id, { status: e.target.value })}
                      disabled={isReadOnly}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-bold text-navy bg-white focus:outline-none disabled:opacity-50"
                    >
                      <option value="NEW">New Lead</option>
                      <option value="CONTACTED">Contacted</option>
                      <option value="COUNSELLING_BOOKED">Counselling Booked</option>
                      <option value="APPLIED">Applied</option>
                      <option value="CLOSED_WON">Closed (Won)</option>
                      <option value="CLOSED_LOST">Closed (Lost)</option>
                    </select>
                  </div>
                </div>

                {/* Client Message */}
                <div className="space-y-1.5">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Client Query / Message</p>
                  <div className="bg-white border border-gray-200 p-4 rounded-2xl text-gray-700 text-sm whitespace-pre-wrap leading-relaxed shadow-sm">
                    {selectedInquiry.message || "(No message provided)"}
                  </div>
                </div>

                {/* Timeline Notes Feed */}
                <div className="space-y-4 pt-2">
                  <h4 className="text-xs font-extrabold text-navy uppercase tracking-wider flex items-center gap-2">
                    <MessageSquare size={14} className="text-gold" /> Notes & Activity History
                  </h4>

                  {/* Notes Feed Container */}
                  <div className="space-y-3 pl-2 max-h-56 overflow-y-auto">
                    {(!selectedInquiry.notes || selectedInquiry.notes.length === 0) ? (
                      <p className="text-xs text-gray-400 italic">No notes or activities recorded.</p>
                    ) : (
                      selectedInquiry.notes.map((note, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-xl border text-xs leading-relaxed ${
                            note.system
                              ? "bg-gray-50 border-gray-100 text-gray-500 font-medium italic"
                              : "bg-white border-gray-200 text-gray-700"
                          }`}
                        >
                          <p>{note.text}</p>
                          <div className="flex justify-between items-center text-[10px] text-gray-400 font-semibold mt-1">
                            <span>By {note.author}</span>
                            <span>{new Date(note.createdAt).toLocaleString()}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Note Form */}
                  {!isReadOnly && (
                    <form onSubmit={handleAddNote} className="flex gap-2 pt-2">
                      <textarea
                        value={newNoteText}
                        onChange={(e) => setNewNoteText(e.target.value)}
                        placeholder="Add an internal note or counselor update..."
                        className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-navy"
                        rows={2}
                      />
                      <button
                        type="submit"
                        disabled={isSubmittingNote || !newNoteText.trim()}
                        className="bg-navy hover:bg-navy-light text-white font-bold text-xs uppercase px-4 rounded-xl transition-all disabled:opacity-50"
                      >
                        Add
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-100 flex-shrink-0">
                {!isReadOnly && (
                  <button
                    onClick={() => setIsDeleting(selectedInquiry.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 size={14} /> Soft-Delete Lead
                  </button>
                )}
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="bg-navy hover:bg-navy-light text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition-colors ml-auto"
                >
                  Close Panel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Alert Modal */}
      <AnimatePresence>
        {isDeleting && (
          <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white max-w-sm w-full p-6 rounded-2xl shadow-2xl border border-gray-100 text-center space-y-4"
            >
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500">
                <Trash2 size={24} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-navy">Soft-Delete Lead?</h4>
                <p className="text-gray-500 text-xs mt-1">
                  The lead will be removed from standard listings, but can be restored by an Administrator or Editor.
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setIsDeleting(null)}
                  className="flex-1 py-2 border border-gray-200 hover:bg-gray-50 rounded-xl text-sm font-semibold text-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSoftDelete(isDeleting)}
                  className="flex-1 py-2 bg-red-500 hover:bg-red-600 rounded-xl text-sm font-semibold text-white transition-colors"
                >
                  Delete Lead
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
