"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  X,
  RefreshCw,
  Info,
  Calendar,
  CheckSquare,
} from "lucide-react";

interface Course {
  id: string;
  title: string;
  level: string;
  schedule: string;
  outcomes: string[] | string;
  published: boolean;
}

export default function AdminCourses() {
  const { data: session } = useSession();
  const userRole = session?.user?.role || "VIEWER";
  const isReadOnly = userRole === "VIEWER";

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [level, setLevel] = useState("");
  const [schedule, setSchedule] = useState("");
  const [published, setPublished] = useState(false);
  const [outcomes, setOutcomes] = useState<string[]>([]);
  const [newOutcome, setNewOutcome] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [restorableCourse, setRestorableCourse] = useState<{ id: string; title: string } | null>(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/courses");
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void (async () => { await fetchCourses(); })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleOpenCreate = () => {
    if (isReadOnly) return;
    setEditingCourse(null);
    setTitle("");
    setLevel("");
    setSchedule("");
    setPublished(true);
    setOutcomes([]);
    setErrorMsg("");
    setModalOpen(true);
  };

  const handleOpenEdit = (course: Course) => {
    setEditingCourse(course);
    setTitle(course.title);
    setLevel(course.level);
    setSchedule(course.schedule);
    setPublished(course.published);

    let parsedOutcomes: string[] = [];
    if (course.outcomes) {
      try {
        parsedOutcomes = typeof course.outcomes === "string" ? JSON.parse(course.outcomes) : course.outcomes;
      } catch {
        parsedOutcomes = [];
      }
    }
    setOutcomes(parsedOutcomes);
    setErrorMsg("");
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;
    if (!title || !level || !schedule) {
      setErrorMsg("Title, Level, and Schedule are required fields.");
      return;
    }

    try {
      setSaving(true);
      setErrorMsg("");

      const payload = {
        title,
        level,
        schedule,
        published,
        outcomes,
      };

      const url = editingCourse ? `/api/admin/courses/${editingCourse.id}` : "/api/admin/courses";
      const method = editingCourse ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setModalOpen(false);
        fetchCourses();
      } else {
        setErrorMsg(data.error || "Failed to save course.");
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
      const res = await fetch(`/api/admin/courses/${id}`, { method: "DELETE" });
      if (res.ok) {
        const deleted = courses.find((c) => c.id === id);
        if (deleted) {
          setRestorableCourse({ id: deleted.id, title: deleted.title });
          setTimeout(() => {
            setRestorableCourse((curr) => (curr?.id === id ? null : curr));
          }, 5000);
        }
        setCourses(courses.filter((c) => c.id !== id));
        setIsDeleting(null);
      }
    } catch (error) {
      console.error("Failed to delete course:", error);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/courses/${id}/restore`, { method: "POST" });
      if (res.ok) {
        setRestorableCourse(null);
        await fetchCourses();
      }
    } catch (error) {
      console.error("Failed to restore course:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Test Preparation Classes</h1>
          <p className="text-gray-500 text-sm mt-1">Configure language preparation and visa pre-screen courses.</p>
        </div>
        {!isReadOnly && (
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 bg-navy hover:bg-navy/90 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm"
          >
            <Plus size={16} className="text-gold" /> Add Course
          </button>
        )}
      </div>

      {/* Course Cards */}
      {loading ? (
        <div className="p-12 text-center text-gray-400 space-y-3 bg-white border border-gray-100 rounded-xl shadow-sm">
          <RefreshCw className="animate-spin mx-auto text-gold" size={28} />
          <p className="text-sm">Loading courses list...</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="p-16 text-center bg-white border border-gray-100 rounded-xl shadow-sm text-gray-500">
          <BookOpen className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="font-bold text-navy">No preparation courses configured</p>
          <p className="text-sm mt-1">Click the &quot;Add Course&quot; button to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, idx) => {
            const parsedOut = typeof course.outcomes === "string" ? JSON.parse(course.outcomes) : course.outcomes;
            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all group"
              >
                <div className="p-6 border-b border-gray-50 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="font-bold text-navy text-lg group-hover:text-gold transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-xs text-gray-400">{course.level}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold rounded ${
                      course.published
                        ? "bg-green-50 text-green-600 border border-green-200"
                        : "bg-gray-100 text-gray-400 border border-gray-250"
                    }`}
                  >
                    {course.published ? "Active" : "Draft"}
                  </span>
                </div>

                <div className="p-6 flex-1 space-y-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                    <Calendar size={14} className="text-gold" />
                    <span className="font-semibold text-navy">Schedule: {course.schedule}</span>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Target Outcomes:</span>
                    <ul className="text-xs space-y-1 text-gray-500 font-medium">
                      {parsedOut && parsedOut.length > 0 ? (
                        parsedOut.map((out: string, i: number) => (
                          <li key={i} className="flex items-start gap-1.5 leading-tight">
                            <span className="text-gold text-xs">✓</span> {out}
                          </li>
                        ))
                      ) : (
                        <li className="italic text-gray-400">No outcomes defined.</li>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleOpenEdit(course)}
                    className="inline-flex items-center gap-1 bg-white hover:bg-navy hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold text-navy border border-gray-200 transition-all"
                  >
                    <Edit size={12} /> {isReadOnly ? "View" : "Edit"}
                  </button>
                  {userRole === "ADMIN" && (
                    <button
                      onClick={() => setIsDeleting(course.id)}
                      className="inline-flex items-center gap-1 bg-white hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold text-red-500 border border-red-100 hover:border-red-500 transition-all"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Edit Form Modal */}
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
                    {editingCourse ? "Update Class" : "Add New Course"}
                  </span>
                  <h3 className="text-xl font-bold mt-1">
                    {editingCourse ? `Edit: ${editingCourse.title}` : "Create Preparation Course"}
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
              <form onSubmit={handleSubmit} className="p-6 space-y-4 flex-1">
                {errorMsg && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs flex items-center gap-2">
                    <Info size={16} />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs text-navy font-bold uppercase tracking-wider">Course Name / Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. IELTS Academic Prep"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-navy font-bold uppercase tracking-wider">Difficulty / Level</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Intermediate to Advanced"
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-navy font-bold uppercase tracking-wider">Schedule Time</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Daily 7:00 AM - 9:00 AM"
                      value={schedule}
                      onChange={(e) => setSchedule(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none"
                    />
                  </div>
                </div>

                {/* Outcomes */}
                <div className="border border-gray-100 rounded-2xl p-4 bg-gray-50/50 space-y-3">
                  <h4 className="text-xs font-bold text-navy uppercase tracking-wider flex items-center gap-1.5">
                    <CheckSquare size={14} className="text-gold" /> Outcomes & Checklists
                  </h4>
                  {outcomes.length === 0 ? (
                    <p className="text-[10px] text-gray-400 italic">No checklist items set yet.</p>
                  ) : (
                    <div className="space-y-1.5">
                      {outcomes.map((out, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-white border border-gray-150 px-2 py-1 rounded-lg text-xs font-semibold text-gray-600">
                          <span>✓ {out}</span>
                          <button type="button" onClick={() => setOutcomes(outcomes.filter((_, i) => i !== idx))} className="text-red-400 hover:text-red-600"><X size={12} /></button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add outcome (e.g. Free Mock Tests weekly)"
                      value={newOutcome}
                      onChange={(e) => setNewOutcome(e.target.value)}
                      className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (newOutcome.trim()) {
                            setOutcomes([...outcomes, newOutcome.trim()]);
                            setNewOutcome("");
                          }
                        }
                      }}
                    />
                    <button type="button" onClick={() => { if (newOutcome.trim()) { setOutcomes([...outcomes, newOutcome.trim()]); setNewOutcome(""); } }} className="p-2 bg-navy text-white rounded-lg"><Plus size={14} /></button>
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
                    Show course publicly in lists.
                  </label>
                </div>

                {/* Modal actions */}
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
                      {saving ? "Saving..." : editingCourse ? "Update Course" : "Create Course"}
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
                <h4 className="text-lg font-bold text-navy">Delete Course?</h4>
                <p className="text-gray-500 text-xs mt-1">Are you sure you want to delete this test prep course? You can undo this action within 5 seconds.</p>
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
        {restorableCourse && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-[70] bg-navy text-white px-5 py-4 rounded-2xl shadow-2xl border border-white/10 flex items-center justify-between gap-6 max-w-md w-full"
          >
            <div className="space-y-0.5">
              <p className="text-xs text-white/50 font-bold uppercase tracking-wider">Course Deleted</p>
              <p className="text-sm font-bold text-white leading-tight">Deleted &apos;{restorableCourse.title}&apos;</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleRestore(restorableCourse.id)}
                className="bg-gold/15 text-gold hover:bg-gold/25 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              >
                Undo / Restore
              </button>
              <button
                onClick={() => setRestorableCourse(null)}
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
