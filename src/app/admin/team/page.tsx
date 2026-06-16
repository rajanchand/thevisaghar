"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Users,
  Plus,
  Edit,
  Trash2,
  X,
  RefreshCw,
  Info,
} from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo?: string;
  bio?: string;
  order: number;
  isActive: boolean;
}

export default function AdminTeam() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [photo, setPhoto] = useState("");
  const [bio, setBio] = useState("");
  const [order, setOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  // UX states
  const [errorMsg, setErrorMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/team");
      if (res.ok) {
        const data = await res.json();
        setTeam(data);
      }
    } catch (error) {
      console.error("Failed to fetch team members:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void (async () => { await fetchTeam(); })();
  }, []);

  const handleOpenCreate = () => {
    setEditingMember(null);
    setName("");
    setRole("");
    setPhoto("/images/team-placeholder.jpg");
    setBio("");
    setOrder(team.length);
    setIsActive(true);
    setErrorMsg("");
    setModalOpen(true);
  };

  const handleOpenEdit = (member: TeamMember) => {
    setEditingMember(member);
    setName(member.name);
    setRole(member.role);
    setPhoto(member.photo || "/images/team-placeholder.jpg");
    setBio(member.bio || "");
    setOrder(member.order);
    setIsActive(member.isActive);
    setErrorMsg("");
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !role) {
      setErrorMsg("Name and Role are required.");
      return;
    }

    try {
      setSaving(true);
      setErrorMsg("");

      const payload = {
        name,
        role,
        photo: photo || undefined,
        bio: bio || undefined,
        order: Number(order),
        isActive,
      };

      const url = editingMember ? `/api/admin/team/${editingMember.id}` : "/api/admin/team";
      const method = editingMember ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setModalOpen(false);
        fetchTeam();
      } else {
        setErrorMsg(data.error || "Failed to save team member.");
      }
    } catch (error) {
      setErrorMsg("Server error occurred.");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/team/${id}`, { method: "DELETE" });
      if (res.ok) {
        setTeam(team.filter((m) => m.id !== id));
        setIsDeleting(null);
      }
    } catch (error) {
      console.error("Failed to delete team member:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Team Directory</h1>
          <p className="text-gray-500 text-sm mt-1">Configure members displayed on the About Us page.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 bg-navy hover:bg-navy/90 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm"
        >
          <Plus size={16} className="text-gold" /> Add Member
        </button>
      </div>

      {/* Team list */}
      {loading ? (
        <div className="p-12 text-center text-gray-400 bg-white border border-gray-100 rounded-xl shadow-sm space-y-3">
          <RefreshCw className="animate-spin mx-auto text-gold" size={28} />
          <p className="text-sm">Loading team members...</p>
        </div>
      ) : team.length === 0 ? (
        <div className="p-16 text-center bg-white border border-gray-100 rounded-xl shadow-sm text-gray-500">
          <Users className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="font-bold text-navy">No team members added</p>
          <p className="text-sm mt-1">Create member profiles to build trust with clients.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((member, idx) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all group"
            >
              {/* Header profile cards */}
              <div className="p-6 border-b border-gray-50 flex items-center gap-4">
                <div className="w-14 h-14 bg-navy/5 text-navy border border-navy/10 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                  {member.photo ? (
                    <Image src={member.photo} alt={member.name} width={56} height={56} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-lg font-bold">{member.name.charAt(0)}</span>
                  )}
                </div>
                <div className="space-y-0.5 flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 justify-between">
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                      Order: {member.order}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 text-[8px] uppercase tracking-wider font-bold rounded ${
                        member.isActive
                          ? "bg-green-50 text-green-600 border border-green-200"
                          : "bg-gray-100 text-gray-400 border border-gray-200"
                      }`}
                    >
                      {member.isActive ? "Active" : "Hidden"}
                    </span>
                  </div>
                  <h3 className="font-bold text-navy text-base truncate">{member.name}</h3>
                  <p className="text-xs text-gold font-semibold truncate">{member.role}</p>
                </div>
              </div>

              {/* Bio block */}
              <div className="p-6 flex-1 text-sm text-gray-500">
                <p className="line-clamp-3 italic">
                  {member.bio ? `"${member.bio}"` : "No biography details provided."}
                </p>
              </div>

              {/* Footer Actions */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-2 flex-shrink-0">
                <button
                  onClick={() => handleOpenEdit(member)}
                  className="inline-flex items-center gap-1 bg-white hover:bg-navy hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold text-navy border border-gray-200 transition-all"
                >
                  <Edit size={12} /> Edit
                </button>
                <button
                  onClick={() => setIsDeleting(member.id)}
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
                    {editingMember ? "Modify Profile" : "New Team Profile"}
                  </span>
                  <h3 className="text-lg font-bold mt-1">
                    {editingMember ? `Edit: ${editingMember.name}` : "Add Team Member"}
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
                  <label className="text-xs text-navy font-bold uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Adhikari"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-navy font-bold uppercase tracking-wider">Role / Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior UK Visa Consultant"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-navy font-bold uppercase tracking-wider">Photo URL Path</label>
                    <input
                      type="text"
                      placeholder="/images/team- Ramesh.jpg"
                      value={photo}
                      onChange={(e) => setPhoto(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-navy font-bold uppercase tracking-wider">Order Position</label>
                    <input
                      type="number"
                      value={order}
                      onChange={(e) => setOrder(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-navy font-bold uppercase tracking-wider">Biography Summary (Bio)</label>
                  <textarea
                    rows={3}
                    placeholder="Brief background profile description..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none resize-none"
                  />
                </div>

                {/* Publish Toggle */}
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <input
                    type="checkbox"
                    id="isActiveMember"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded text-navy focus:ring-navy"
                  />
                  <label htmlFor="isActiveMember" className="text-xs font-bold text-navy select-none cursor-pointer">
                    Display profile publicly on the consultancy page
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
                    {saving ? "Saving..." : editingMember ? "Save Profile" : "Create Profile"}
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
                <h4 className="text-lg font-bold text-navy">Delete Team Member?</h4>
                <p className="text-gray-500 text-xs mt-1">This action cannot be undone. Are you sure you want to permanently delete this team member profile?</p>
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
