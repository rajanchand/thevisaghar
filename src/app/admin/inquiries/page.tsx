"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Download,
  Mail,
  Phone,
  Clock,
  Eye,
  Trash2,
  Filter,
  X,
  RefreshCw,
} from "lucide-react";

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
}

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "replied">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/inquiries");
      if (res.ok) {
        const data = await res.json();
        setInquiries(data);
      }
    } catch (error) {
      console.error("Failed to fetch inquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void (async () => { await fetchInquiries(); })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleToggleStatus = async (id: string, updates: { isRead?: boolean; isReplied?: boolean }) => {
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
      console.error("Failed to update inquiry status:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setInquiries((prev) => prev.filter((inq) => inq.id !== id));
        setIsDeleting(null);
        if (selectedInquiry && selectedInquiry.id === id) {
          setSelectedInquiry(null);
        }
      }
    } catch (error) {
      console.error("Failed to delete inquiry:", error);
    }
  };

  const handleExportCSV = () => {
    window.open("/api/admin/inquiries?export=csv", "_blank");
  };

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch =
      inq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.message.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === "unread") return !inq.isRead;
    if (filter === "replied") return inq.isReplied;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Client Inquiries</h1>
          <p className="text-gray-500 text-sm mt-1">Manage questions and queries submitted by visitors.</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="inline-flex items-center justify-center gap-2 bg-navy hover:bg-navy/90 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm group hover:scale-[1.02]"
        >
          <Download size={16} className="text-gold group-hover:translate-y-0.5 transition-transform" />
          Export to CSV
        </button>
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search inquiries (name, email, message)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0">
          <Filter size={16} className="text-gray-400" />
          {(["all", "unread", "replied"] as const).map((tab) => (
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
            onClick={fetchInquiries}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-navy transition-colors ml-auto"
            title="Refresh Inquiries"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* inquiries Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400 space-y-3">
            <RefreshCw className="animate-spin mx-auto text-gold" size={28} />
            <p className="text-sm">Loading inquiries...</p>
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div className="p-16 text-center text-gray-500">
            <Mail className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="font-bold text-navy">No inquiries found</p>
            <p className="text-sm mt-1">Try resetting filters or checking back later.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-100 text-navy font-bold">
                <tr>
                  <th className="p-4 px-6">Client</th>
                  <th className="p-4">Visa Type</th>
                  <th className="p-4">Message Excerpt</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredInquiries.map((inq) => (
                  <tr
                    key={inq.id}
                    className={`hover:bg-gray-50/80 transition-colors ${
                      !inq.isRead ? "font-medium text-navy" : "text-gray-600"
                    }`}
                  >
                    <td className="p-4 px-6">
                      <div>
                        <div className="font-bold text-navy">{inq.name}</div>
                        <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <Mail size={12} /> {inq.email}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-gold/10 text-navy border border-gold/25 text-xs font-semibold rounded-full">
                        {inq.visaType}
                      </span>
                    </td>
                    <td className="p-4 max-w-xs truncate">
                      {inq.message}
                    </td>
                    <td className="p-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span
                          className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded ${
                            inq.isRead ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600"
                          }`}
                        >
                          {inq.isRead ? "Read" : "Unread"}
                        </span>
                        {inq.isReplied && (
                          <span className="px-2 py-0.5 bg-purple-50 text-purple-600 text-[10px] uppercase font-bold tracking-wider rounded">
                            Replied
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedInquiry(inq);
                            if (!inq.isRead) {
                              handleToggleStatus(inq.id, { isRead: true });
                            }
                          }}
                          className="p-1.5 hover:bg-navy/5 text-navy hover:text-navy/80 rounded transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => setIsDeleting(inq.id)}
                          className="p-1.5 hover:bg-red-50 text-red-500 rounded transition-colors"
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

      {/* Inquiry Detail Modal */}
      <AnimatePresence>
        {selectedInquiry && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl border border-gray-100"
            >
              {/* Header */}
              <div className="bg-navy p-6 text-white flex items-center justify-between">
                <div>
                  <span className="text-xs text-gold uppercase tracking-widest font-bold">Inquiry Details</span>
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
              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                {/* Meta details grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="space-y-1.5">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Email Address</p>
                    <a href={`mailto:${selectedInquiry.email}`} className="text-sm font-medium text-navy hover:underline flex items-center gap-1.5">
                      <Mail size={14} className="text-gold" /> {selectedInquiry.email}
                    </a>
                  </div>
                  {selectedInquiry.phone && (
                    <div className="space-y-1.5">
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Phone Number</p>
                      <a href={`tel:${selectedInquiry.phone}`} className="text-sm font-medium text-navy hover:underline flex items-center gap-1.5">
                        <Phone size={14} className="text-gold" /> {selectedInquiry.phone}
                      </a>
                    </div>
                  )}
                  <div className="space-y-1.5">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Visa Type of Interest</p>
                    <span className="inline-block px-2.5 py-0.5 bg-gold/10 text-navy border border-gold/20 text-xs font-semibold rounded-full">
                      {selectedInquiry.visaType}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Submitted On</p>
                    <span className="text-sm text-gray-600 flex items-center gap-1.5">
                      <Clock size={14} className="text-gold" /> {new Date(selectedInquiry.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Client Message</p>
                  <div className="bg-white border border-gray-100 p-4 rounded-xl text-gray-700 text-sm whitespace-pre-wrap leading-relaxed shadow-inner">
                    {selectedInquiry.message}
                  </div>
                </div>

                {/* Status Toggles */}
                <div className="flex flex-wrap items-center gap-3 border-t border-gray-100 pt-4">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider mr-2">Quick Status:</span>
                  <button
                    onClick={() => handleToggleStatus(selectedInquiry.id, { isRead: !selectedInquiry.isRead })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                      selectedInquiry.isRead
                        ? "bg-green-50 text-green-600 border-green-200"
                        : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
                    }`}
                  >
                    {selectedInquiry.isRead ? "✓ Read" : "Mark as Read"}
                  </button>
                  <button
                    onClick={() => handleToggleStatus(selectedInquiry.id, { isReplied: !selectedInquiry.isReplied })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                      selectedInquiry.isReplied
                        ? "bg-purple-50 text-purple-600 border-purple-200"
                        : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
                    }`}
                  >
                    {selectedInquiry.isReplied ? "✓ Replied" : "Mark as Replied"}
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-100">
                <button
                  onClick={() => setIsDeleting(selectedInquiry.id)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 size={14} /> Delete Inquiry
                </button>
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="bg-navy hover:bg-navy/90 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-colors"
                >
                  Close
                </button>
              </div>
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
                <h4 className="text-lg font-bold text-navy">Delete Inquiry?</h4>
                <p className="text-gray-500 text-xs mt-1">This action cannot be undone. Are you sure you want to permanently delete this inquiry?</p>
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
