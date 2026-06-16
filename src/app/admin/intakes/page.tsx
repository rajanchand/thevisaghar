"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import {
  Calendar,
  Plus,
  Edit,
  Trash2,
  X,
  RefreshCw,
  Info,
  Clock,
  Globe,
} from "lucide-react";

interface Intake {
  id: string;
  country: string;
  intakeMonth: string;
  intakeYear: number;
  deadlineDate?: string | null;
  notes?: string | null;
}

const COUNTRIES = ["United Kingdom", "United States", "Australia", "Canada", "New Zealand", "Japan", "South Korea", "Finland", "Denmark"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function AdminIntakes() {
  const { data: session } = useSession();
  const userRole = session?.user?.role || "VIEWER";
  const isReadOnly = userRole === "VIEWER";

  const [intakes, setIntakes] = useState<Intake[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIntake, setEditingIntake] = useState<Intake | null>(null);
  const [filterCountry, setFilterCountry] = useState("all");

  // Form states
  const [country, setCountry] = useState("United Kingdom");
  const [intakeMonth, setIntakeMonth] = useState("September");
  const [intakeYear, setIntakeYear] = useState(new Date().getFullYear());
  const [deadlineDate, setDeadlineDate] = useState("");
  const [notes, setNotes] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [restorableIntake, setRestorableIntake] = useState<{ id: string; country: string; intake: string } | null>(null);

  const fetchIntakes = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/intakes");
      if (res.ok) {
        const data = await res.json();
        setIntakes(data);
      }
    } catch (error) {
      console.error("Failed to fetch intakes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void (async () => { await fetchIntakes(); })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleOpenCreate = () => {
    if (isReadOnly) return;
    setEditingIntake(null);
    setCountry(filterCountry !== "all" ? filterCountry : "United Kingdom");
    setIntakeMonth("September");
    setIntakeYear(new Date().getFullYear() + 1);
    setDeadlineDate("");
    setNotes("");
    setErrorMsg("");
    setModalOpen(true);
  };

  const handleOpenEdit = (intake: Intake) => {
    setEditingIntake(intake);
    setCountry(intake.country);
    setIntakeMonth(intake.intakeMonth);
    setIntakeYear(intake.intakeYear);
    setDeadlineDate(intake.deadlineDate ? new Date(intake.deadlineDate).toISOString().split("T")[0] : "");
    setNotes(intake.notes || "");
    setErrorMsg("");
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;
    if (!country || !intakeMonth || !intakeYear) {
      setErrorMsg("Country, Intake Month, and Intake Year are required fields.");
      return;
    }

    try {
      setSaving(true);
      setErrorMsg("");

      const payload = {
        country,
        intakeMonth,
        intakeYear: Number(intakeYear),
        deadlineDate: deadlineDate || null,
        notes: notes || null,
      };

      const url = editingIntake ? `/api/admin/intakes/${editingIntake.id}` : "/api/admin/intakes";
      const method = editingIntake ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setModalOpen(false);
        fetchIntakes();
      } else {
        setErrorMsg(data.error || "Failed to save intake.");
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("Failed to connect to the server.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (userRole !== "ADMIN") return;
    try {
      const res = await fetch(`/api/admin/intakes/${id}`, { method: "DELETE" });
      if (res.ok) {
        const deleted = intakes.find((i) => i.id === id);
        if (deleted) {
          setRestorableIntake({
            id: deleted.id,
            country: deleted.country,
            intake: `${deleted.intakeMonth} ${deleted.intakeYear}`,
          });
          setTimeout(() => {
            setRestorableIntake((curr) => (curr?.id === id ? null : curr));
          }, 5000);
        }
        setIntakes(intakes.filter((i) => i.id !== id));
        setIsDeleting(null);
      }
    } catch (error) {
      console.error("Failed to delete intake:", error);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/intakes/${id}/restore`, { method: "POST" });
      if (res.ok) {
        setRestorableIntake(null);
        await fetchIntakes();
      }
    } catch (error) {
      console.error("Failed to restore intake:", error);
    }
  };

  const filteredIntakes = intakes.filter(
    (int) => filterCountry === "all" || int.country === filterCountry
  );

  const formatDeadline = (dateStr?: string | null) => {
    if (!dateStr) return "Rolling Admissions";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">University Intake Schedules</h1>
          <p className="text-gray-500 text-sm mt-1">Configure admission application deadlines for destination countries.</p>
        </div>
        {!isReadOnly && (
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 bg-navy hover:bg-navy/90 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm"
          >
            <Plus size={16} className="text-gold" /> Add Intake
          </button>
        )}
      </div>

      {/* Filter and Content list */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Country filters */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm h-fit space-y-4">
          <h2 className="text-xs font-bold text-navy uppercase tracking-wider">Filter by Destination</h2>
          <div className="space-y-1">
            <button
              onClick={() => setFilterCountry("all")}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                filterCountry === "all"
                  ? "bg-gold/15 text-navy font-bold"
                  : "text-gray-500 hover:bg-gray-50 hover:text-navy"
              }`}
            >
              All Destinations ({intakes.length})
            </button>
            {COUNTRIES.map((c) => {
              const count = intakes.filter((i) => i.country === c).length;
              return (
                <button
                  key={c}
                  onClick={() => setFilterCountry(c)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    filterCountry === c
                      ? "bg-gold/15 text-navy font-bold"
                      : "text-gray-500 hover:bg-gray-50 hover:text-navy"
                  }`}
                >
                  {c} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Intakes List */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="p-12 text-center bg-white border border-gray-100 rounded-2xl shadow-sm text-gray-400 space-y-3">
              <RefreshCw className="animate-spin mx-auto text-gold" size={28} />
              <p className="text-sm">Loading intake schedules...</p>
            </div>
          ) : filteredIntakes.length === 0 ? (
            <div className="p-16 text-center bg-white border border-gray-100 rounded-2xl shadow-sm text-gray-500">
              <Calendar className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="font-bold text-navy">No intakes configured in this country</p>
              {!isReadOnly && (
                <button
                  onClick={handleOpenCreate}
                  className="mt-3 text-xs bg-navy text-gold font-bold px-3 py-2 rounded-lg"
                >
                  Create Intake Slot
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100 text-sm">
                  <thead className="bg-gray-50/50 text-navy font-bold text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4 text-left">Destination</th>
                      <th className="px-6 py-4 text-left">Intake Term</th>
                      <th className="px-6 py-4 text-left">Application Deadline</th>
                      <th className="px-6 py-4 text-left">Notes</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 font-semibold text-gray-600">
                    {filteredIntakes.map((int) => (
                      <tr key={int.id} className="hover:bg-gray-50/20 transition-colors">
                        <td className="px-6 py-4 flex items-center gap-2 text-navy">
                          <Globe size={14} className="text-gray-400" /> {int.country}
                        </td>
                        <td className="px-6 py-4 font-bold text-navy">
                          {int.intakeMonth} {int.intakeYear}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs ${
                            int.deadlineDate ? "bg-amber-50 text-amber-600 border border-amber-100" : "bg-gray-100 text-gray-500"
                          }`}>
                            <Clock size={12} /> {formatDeadline(int.deadlineDate)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs font-medium max-w-xs truncate" title={int.notes || ""}>
                          {int.notes || "—"}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="inline-flex gap-2">
                            <button
                              onClick={() => handleOpenEdit(int)}
                              className="p-1.5 bg-white border border-gray-200 text-navy hover:bg-navy hover:text-white rounded-lg transition-all"
                              title="Edit intake"
                            >
                              <Edit size={12} />
                            </button>
                            {userRole === "ADMIN" && (
                              <button
                                onClick={() => setIsDeleting(int.id)}
                                className="p-1.5 bg-white border border-red-100 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                                title="Delete intake"
                              >
                                <Trash2 size={12} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
              className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-gray-100 my-8 flex flex-col"
            >
              {/* Header */}
              <div className="bg-navy p-6 text-white flex items-center justify-between flex-shrink-0">
                <div>
                  <span className="text-xs text-gold uppercase tracking-widest font-bold">
                    {editingIntake ? "Update Intake Slot" : "Add Intake Term"}
                  </span>
                  <h3 className="text-xl font-bold mt-1">
                    {editingIntake ? "Edit Intake Schedule" : "Configure Intake Slot"}
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
                  <label className="text-xs text-navy font-bold uppercase tracking-wider">Destination Country</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none bg-white"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-navy font-bold uppercase tracking-wider">Intake Month</label>
                    <select
                      value={intakeMonth}
                      onChange={(e) => setIntakeMonth(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none bg-white font-semibold"
                    >
                      {MONTHS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-navy font-bold uppercase tracking-wider">Intake Year</label>
                    <input
                      type="number"
                      required
                      min={2020}
                      max={2100}
                      value={intakeYear}
                      onChange={(e) => setIntakeYear(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-navy font-bold uppercase tracking-wider">Deadline Date (Optional)</label>
                  <input
                    type="date"
                    value={deadlineDate}
                    onChange={(e) => setDeadlineDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-navy font-bold uppercase tracking-wider">Additional Notes / Guidance</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Requires draft credentials for pre-checks by August 1..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none resize-none"
                  />
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
                      {saving ? "Saving..." : editingIntake ? "Update Intake" : "Create Intake"}
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
                <h4 className="text-lg font-bold text-navy">Delete Intake?</h4>
                <p className="text-gray-500 text-xs mt-1">Are you sure you want to delete this intake? You can undo this action within 5 seconds.</p>
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
        {restorableIntake && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-[70] bg-navy text-white px-5 py-4 rounded-2xl shadow-2xl border border-white/10 flex items-center justify-between gap-6 max-w-md w-full"
          >
            <div className="space-y-0.5">
              <p className="text-xs text-white/50 font-bold uppercase tracking-wider">Intake Deleted</p>
              <p className="text-sm font-bold text-white leading-tight">Deleted {restorableIntake.country} &apos;{restorableIntake.intake}&apos;</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleRestore(restorableIntake.id)}
                className="bg-gold/15 text-gold hover:bg-gold/25 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              >
                Undo / Restore
              </button>
              <button
                onClick={() => setRestorableIntake(null)}
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
