"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Search,
  Filter,
  Clock,
  Mail,
  Phone,
  Edit,
  Trash2,
  X,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  visaType: string;
  preferredDate: string;
  message?: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  notes?: string;
  createdAt: string;
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "PENDING" | "CONFIRMED" | "CANCELLED">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  
  // Edit form state
  const [editStatus, setEditStatus] = useState<"PENDING" | "CONFIRMED" | "CANCELLED">("PENDING");
  const [editNotes, setEditNotes] = useState("");
  const [editDate, setEditDate] = useState("");
  const [updating, setUpdating] = useState(false);

  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/bookings");
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void (async () => { await fetchBookings(); })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleOpenEdit = (booking: Booking) => {
    setSelectedBooking(booking);
    setEditStatus(booking.status);
    setEditNotes(booking.notes || "");
    // Format date for datetime-local input (YYYY-MM-DDTHH:MM)
    const d = new Date(booking.preferredDate);
    const tzOffset = d.getTimezoneOffset() * 60000; // offset in milliseconds
    const localISOTime = (new Date(d.getTime() - tzOffset)).toISOString().slice(0, 16);
    setEditDate(localISOTime);
  };

  const handleUpdateBooking = async () => {
    if (!selectedBooking) return;
    try {
      setUpdating(true);
      const res = await fetch(`/api/admin/bookings/${selectedBooking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: editStatus,
          notes: editNotes,
          preferredDate: new Date(editDate).toISOString(),
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setBookings((prev) => prev.map((b) => (b.id === selectedBooking.id ? updated : b)));
        setSelectedBooking(null);
        fetchBookings(); // Refresh list
      }
    } catch (error) {
      console.error("Failed to update booking:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setBookings((prev) => prev.filter((b) => b.id !== id));
        setIsDeleting(null);
        if (selectedBooking && selectedBooking.id === id) {
          setSelectedBooking(null);
        }
      }
    } catch (error) {
      console.error("Failed to delete booking:", error);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.phone.includes(searchQuery) ||
      b.visaType.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filter !== "all" && b.status !== filter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Consultations & Bookings</h1>
          <p className="text-gray-500 text-sm mt-1">Review and manage student and work visa consultations.</p>
        </div>
        <button
          onClick={fetchBookings}
          className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-500 hover:text-navy transition-colors shadow-sm"
          title="Refresh Bookings"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by client name, email, phone, or visa type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0">
          <Filter size={16} className="text-gray-400" />
          {(["all", "PENDING", "CONFIRMED", "CANCELLED"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                filter === status
                  ? "bg-navy text-gold"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {status === "all" ? "All" : status}
            </button>
          ))}
        </div>
      </div>

      {/* Table grid */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400 space-y-3">
            <RefreshCw className="animate-spin mx-auto text-gold" size={28} />
            <p className="text-sm">Loading bookings...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="p-16 text-center text-gray-500">
            <Calendar className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="font-bold text-navy">No bookings found</p>
            <p className="text-sm mt-1">Try relaxing filters or search terms.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-100 text-navy font-bold">
                <tr>
                  <th className="p-4 px-6">Client Details</th>
                  <th className="p-4">Visa Category</th>
                  <th className="p-4">Preferred Appointment</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/80 transition-colors text-gray-600">
                    <td className="p-4 px-6">
                      <div>
                        <div className="font-bold text-navy">{b.name}</div>
                        <div className="text-xs text-gray-400 flex flex-col gap-0.5 mt-1">
                          <span className="flex items-center gap-1"><Mail size={12} /> {b.email}</span>
                          <span className="flex items-center gap-1"><Phone size={12} /> {b.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-gold/10 text-navy border border-gold/20 text-xs font-semibold rounded-full">
                        {b.visaType}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-navy font-medium">
                        {new Date(b.preferredDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                      <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <Clock size={12} />
                        {new Date(b.preferredDate).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          b.status === "CONFIRMED"
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : b.status === "CANCELLED"
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {b.status === "CONFIRMED" && <CheckCircle size={12} />}
                        {b.status === "CANCELLED" && <XCircle size={12} />}
                        {b.status === "PENDING" && <AlertCircle size={12} />}
                        {b.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(b)}
                          className="p-1.5 hover:bg-navy/5 text-navy hover:text-navy/80 rounded transition-colors"
                          title="Manage Booking"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => setIsDeleting(b.id)}
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

      {/* Edit Booking Dialog Modal */}
      <AnimatePresence>
        {selectedBooking && (
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
                  <span className="text-xs text-gold uppercase tracking-widest font-bold">Manage consultation</span>
                  <h3 className="text-lg font-bold mt-1">Appointment: {selectedBooking.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body Form */}
              <div className="p-6 space-y-4">
                {/* Meta Summary */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-xs text-gray-500 space-y-1">
                  <p><strong>Client email:</strong> {selectedBooking.email}</p>
                  <p><strong>Phone:</strong> {selectedBooking.phone}</p>
                  <p><strong>Visa category:</strong> {selectedBooking.visaType}</p>
                  {selectedBooking.message && (
                    <p className="mt-2 text-gray-700 bg-white border p-2 rounded italic">
                      &quot;{selectedBooking.message}&quot;
                    </p>
                  )}
                </div>

                {/* Edit Date */}
                <div className="space-y-1.5">
                  <label className="text-xs text-navy font-bold uppercase tracking-wider">Date & Time</label>
                  <input
                    type="datetime-local"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
                  />
                </div>

                {/* Edit Status */}
                <div className="space-y-1.5">
                  <label className="text-xs text-navy font-bold uppercase tracking-wider">Appointment Status</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["PENDING", "CONFIRMED", "CANCELLED"] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setEditStatus(st)}
                        className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                          editStatus === st
                            ? st === "CONFIRMED"
                              ? "bg-green-500 border-green-500 text-white shadow-sm"
                              : st === "CANCELLED"
                              ? "bg-red-500 border-red-500 text-white shadow-sm"
                              : "bg-amber-500 border-amber-500 text-white shadow-sm"
                            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Edit Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs text-navy font-bold uppercase tracking-wider">Internal Admin Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Add notes about calls, schedules, documents required..."
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy resize-none"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsDeleting(selectedBooking.id)}
                  className="text-xs text-red-500 font-semibold hover:underline flex items-center gap-1"
                >
                  <Trash2 size={14} /> Delete Booking
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedBooking(null)}
                    className="px-4 py-2 border border-gray-200 hover:bg-gray-100 rounded-xl text-xs font-semibold text-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={updating}
                    onClick={handleUpdateBooking}
                    className="bg-navy hover:bg-navy/90 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
                  >
                    {updating ? "Saving..." : "Save Changes"}
                  </button>
                </div>
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
                <h4 className="text-lg font-bold text-navy">Delete Booking?</h4>
                <p className="text-gray-500 text-xs mt-1">This action cannot be undone. Are you sure you want to permanently delete this booking?</p>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setIsDeleting(null)}
                  className="flex-1 py-2 border border-gray-200 hover:bg-gray-50 rounded-xl text-sm font-semibold text-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteBooking(isDeleting)}
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
