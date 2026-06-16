"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserCheck,
  Plus,
  Edit,
  Shield,
  X,
  RefreshCw,
  Info,
  CheckCircle2,
  AlertCircle,
  Mail,
  User,
  Key,
  ShieldAlert,
} from "lucide-react";

interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "EDITOR" | "VIEWER";
  status: "ACTIVE" | "DEACTIVATED";
  lastLogin?: string;
  createdAt: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<StaffUser | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"ADMIN" | "EDITOR" | "VIEWER">("VIEWER");
  const [status, setStatus] = useState<"ACTIVE" | "DEACTIVATED">("ACTIVE");

  // UX states
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const res = await fetch("/api/admin/users?all=true");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "Failed to load staff list.");
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("Failed to connect to users service.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void (async () => { await fetchUsers(); })();
  }, []);

  const handleOpenCreate = () => {
    setEditingUser(null);
    setName("");
    setEmail("");
    setPassword("");
    setRole("VIEWER");
    setStatus("ACTIVE");
    setErrorMsg("");
    setSuccessMsg("");
    setModalOpen(true);
  };

  const handleOpenEdit = (user: StaffUser) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
    setPassword(""); // Leave blank to skip reset
    setRole(user.role);
    setStatus(user.status);
    setErrorMsg("");
    setSuccessMsg("");
    setModalOpen(true);
  };

  const handleToggleStatus = async (user: StaffUser) => {
    const newStatus = user.status === "ACTIVE" ? "DEACTIVATED" : "ACTIVE";
    try {
      setErrorMsg("");
      setSuccessMsg("");
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const updated = await res.json();
        setUsers((prev) => prev.map((u) => (u.id === user.id ? updated : u)));
        setSuccessMsg(`Account for ${user.name} is now ${newStatus.toLowerCase()}.`);
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "Failed to toggle account status.");
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("Connection error when toggling user status.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || (!editingUser && !password)) {
      setErrorMsg("Please fill out all required fields.");
      return;
    }

    try {
      setSaving(true);
      setErrorMsg("");
      setSuccessMsg("");

      const payload = {
        name,
        email,
        role,
        status,
        ...(password.trim() !== "" ? { password } : {}),
      };

      const url = editingUser ? `/api/admin/users/${editingUser.id}` : "/api/admin/users";
      const method = editingUser ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setModalOpen(false);
        setSuccessMsg(editingUser ? "Staff credentials saved successfully." : "New staff member invited successfully.");
        setTimeout(() => setSuccessMsg(""), 4000);
        await fetchUsers();
      } else {
        setErrorMsg(data.error || "Failed to update staff credentials.");
      }
    } catch (error) {
      setErrorMsg("Server transaction error.");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const formatLastLogin = (dateString?: string) => {
    if (!dateString) return "Never logged in";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Staff & Access Accounts</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage administrative credentials, assign roles (Admin, Editor, Viewer), and revoke user access instantly.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 bg-navy hover:bg-navy/90 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm"
        >
          <Plus size={16} className="text-gold" /> Add Staff Member
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-bold flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Users List Grid */}
      {loading ? (
        <div className="p-12 text-center text-gray-400 bg-white border border-gray-100 rounded-xl shadow-sm space-y-3">
          <RefreshCw className="animate-spin mx-auto text-gold" size={28} />
          <p className="text-sm font-semibold">Loading staff credentials...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="p-16 text-center bg-white border border-gray-100 rounded-xl shadow-sm text-gray-500">
          <UserCheck className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="font-bold text-navy">No staff accounts found</p>
          <p className="text-sm mt-1">Invite your first counselor or administrator using the button above.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-400 text-xs font-bold uppercase tracking-wider">
                  <th className="p-5 px-6">Name</th>
                  <th className="p-5">Email Address</th>
                  <th className="p-5">System Role</th>
                  <th className="p-5">Status</th>
                  <th className="p-5">Last Logged In</th>
                  <th className="p-5 text-right px-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className={`hover:bg-gray-50/50 transition-colors ${
                      user.status === "DEACTIVATED" ? "opacity-60 bg-gray-50/20" : ""
                    }`}
                  >
                    <td className="p-5 px-6 font-bold text-navy">{user.name}</td>
                    <td className="p-5 text-gray-500">{user.email}</td>
                    <td className="p-5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${
                          user.role === "ADMIN"
                            ? "bg-red-50 text-red-700 border border-red-100"
                            : user.role === "EDITOR"
                            ? "bg-blue-50 text-blue-700 border border-blue-100"
                            : "bg-gray-100 text-gray-600 border border-gray-200"
                        }`}
                      >
                        <Shield size={12} />
                        {user.role}
                      </span>
                    </td>
                    <td className="p-5">
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
                          user.status === "ACTIVE"
                            ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                            : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                        }`}
                      >
                        {user.status === "ACTIVE" ? "Active" : "Deactivated"}
                      </button>
                    </td>
                    <td className="p-5 text-gray-500 font-semibold">{formatLastLogin(user.lastLogin)}</td>
                    <td className="p-5 text-right px-6">
                      <button
                        onClick={() => handleOpenEdit(user)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-navy/5 text-navy font-semibold text-xs transition-all bg-white shadow-sm"
                      >
                        <Edit size={12} /> Edit Account
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
                    {editingUser ? "Edit Credentials" : "Add Staff Account"}
                  </span>
                  <h3 className="text-lg font-bold mt-1">
                    {editingUser ? `Configure: ${editingUser.name}` : "New Team Login Account"}
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

                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs text-navy font-bold uppercase tracking-wider flex items-center gap-1">
                    <User size={12} className="text-gold" /> Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Binod Kharel"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs text-navy font-bold uppercase tracking-wider flex items-center gap-1">
                    <Mail size={12} className="text-gold" /> Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. binod@thevisaghar.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
                  />
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                  <label className="text-xs text-navy font-bold uppercase tracking-wider flex items-center gap-1">
                    <Key size={12} className="text-gold" /> Password
                  </label>
                  <input
                    type="password"
                    required={!editingUser}
                    placeholder={editingUser ? "Leave blank to keep current password" : "Minimum 6 characters"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
                  />
                  {editingUser && (
                    <p className="text-[10px] text-gray-400">
                      Inputting a password resets the account access credentials instantly.
                    </p>
                  )}
                </div>

                {/* Selects: Role and Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-navy font-bold uppercase tracking-wider">System Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as "ADMIN" | "EDITOR" | "VIEWER")}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none bg-white"
                    >
                      <option value="VIEWER">VIEWER (Read inquiries only)</option>
                      <option value="EDITOR">EDITOR (Manage site pages & leads)</option>
                      <option value="ADMIN">ADMIN (Full database access)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-navy font-bold uppercase tracking-wider">Account Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as "ACTIVE" | "DEACTIVATED")}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none bg-white"
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="DEACTIVATED">DEACTIVATED</option>
                    </select>
                  </div>
                </div>

                {/* Info Note on RBAC */}
                <div className="flex gap-2 bg-gray-50 border border-gray-100 p-3.5 rounded-xl text-xs text-gray-500">
                  <ShieldAlert size={18} className="text-gold flex-shrink-0 mt-0.5" />
                  <div className="space-y-1.5 leading-relaxed">
                    <p className="font-bold text-navy">Privilege Boundary</p>
                    <p>
                      <strong>ADMIN:</strong> Can access dashboard settings, invite users, and review activity audits.<br />
                      <strong>EDITOR:</strong> Can modify countries, services, courses, and blogs.<br />
                      <strong>VIEWER:</strong> Can read inquires/bookings lists but cannot edit public pages.
                    </p>
                  </div>
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
                    {saving ? "Saving..." : editingUser ? "Save Credentials" : "Create Account"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
