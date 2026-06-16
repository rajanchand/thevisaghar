"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw,
  Search,
  Calendar,
  User,
  Shield,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Info,
  SlidersHorizontal,
} from "lucide-react";

interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityId?: string;
  userId?: string;
  ipAddress?: string;
  createdAt: string;
  details?: Record<string, unknown> | null;
  user?: {
    name: string;
    email: string;
    role: string;
  } | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AdminAuditLog() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 30,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Filter lists
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAction, setSelectedAction] = useState("");
  const [selectedEntity, setSelectedEntity] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);

  // Toggle options panel
  const [showFilters, setShowFilters] = useState(false);

  const fetchUsersList = async () => {
    try {
      const res = await fetch("/api/admin/users?all=true");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Failed to fetch users list for filter:", error);
    }
  };

  const fetchLogs = async (currentPage = page) => {
    try {
      setLoading(true);
      
      const queryParams = new URLSearchParams({
        page: String(currentPage),
        limit: "30",
        search: searchTerm,
        action: selectedAction,
        entity: selectedEntity,
        userId: selectedUser,
        startDate,
        endDate,
      });

      const res = await fetch(`/api/admin/audit-log?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch audit logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void (async () => {
      await fetchUsersList();
    })();
  }, []);

  useEffect(() => {
    void (async () => {
      await fetchLogs(page);
    })();
  }, [page, selectedAction, selectedEntity, selectedUser, startDate, endDate]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchLogs(1);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedAction("");
    setSelectedEntity("");
    setSelectedUser("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getActionColor = (action: string) => {
    if (action.includes("DELETE") || action.includes("DEACTIVATE")) {
      return "bg-red-50 text-red-700 border-red-100";
    }
    if (action.includes("RESTORE") || action.includes("CREATE")) {
      return "bg-green-50 text-green-700 border-green-100";
    }
    if (action.includes("PII") || action.includes("RATE_LIMIT")) {
      return "bg-amber-50 text-amber-700 border-amber-100";
    }
    return "bg-blue-50 text-blue-700 border-blue-100";
  };

  const getFriendlyDetails = (log: AuditLog) => {
    const details = log.details as Record<string, unknown> | null;
    
    switch (log.action) {
      case "ACCESS_PII":
        return `Opened lead contact file for '${details?.name || "Unknown student"}'`;
      case "EXPORT_PII":
        return `Exported CRM inquiries list to CSV containing ${details?.count || 0} leads`;
      case "UPDATE_LEAD":
        return `Updated parameters for lead '${details?.name || "Unknown"}'. Fields changed: ${details?.changedFields ? JSON.stringify(details.changedFields) : "N/A"}`;
      case "SOFT_DELETE":
        return `Soft-deleted lead record for '${details?.name || "Unknown"}'`;
      case "RESTORE_LEAD":
        return `Restored soft-deleted lead record for '${details?.name || "Unknown"}'`;
      case "LOGIN":
        return `Admin session authenticated successfully`;
      case "CREATE":
        return `Created new ${log.entity.toLowerCase()} record: '${details?.title || details?.name || "N/A"}'`;
      case "UPDATE":
        return `Modified parameters for ${log.entity.toLowerCase()}: '${details?.title || details?.name || "N/A"}'`;
      case "DELETE":
        return `Permanently removed ${log.entity.toLowerCase()} entry: '${details?.title || details?.name || "N/A"}'`;
      default:
        return `${log.action} performed on ${log.entity}`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Audit Security Logs</h1>
          <p className="text-gray-500 text-sm mt-1">
            Browse regulatory audit activity, PII accesses, login histories, and CRUD transactions.
          </p>
        </div>
        <button
          onClick={() => fetchLogs(page)}
          disabled={loading}
          className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-500 hover:text-navy transition-all shadow-sm"
          title="Refresh logs"
        >
          <RefreshCw size={18} className={loading ? "animate-spin text-gold" : ""} />
        </button>
      </div>

      {/* Control panel */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search audit records by keyword, user, or entity..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-navy hover:bg-navy/90 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-all"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-4 py-2 border rounded-xl text-sm font-semibold transition-all ${
                showFilters || selectedAction || selectedEntity || selectedUser || startDate || endDate
                  ? "border-navy bg-navy/5 text-navy"
                  : "border-gray-200 text-gray-500 hover:bg-gray-50"
              }`}
            >
              <SlidersHorizontal size={14} /> Filters
            </button>
          </div>
        </form>

        {/* Collapsible Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden pt-2"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 text-xs">
                {/* User filter */}
                <div className="space-y-1.5">
                  <label className="font-bold text-navy uppercase tracking-wider flex items-center gap-1">
                    <User size={12} className="text-gold" /> Actor (Staff)
                  </label>
                  <select
                    value={selectedUser}
                    onChange={(e) => { setSelectedUser(e.target.value); setPage(1); }}
                    className="w-full px-2.5 py-2 border border-gray-200 rounded-lg bg-white"
                  >
                    <option value="">All Actors</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>

                {/* Action filter */}
                <div className="space-y-1.5">
                  <label className="font-bold text-navy uppercase tracking-wider flex items-center gap-1">
                    <Shield size={12} className="text-gold" /> Action Class
                  </label>
                  <select
                    value={selectedAction}
                    onChange={(e) => { setSelectedAction(e.target.value); setPage(1); }}
                    className="w-full px-2.5 py-2 border border-gray-200 rounded-lg bg-white"
                  >
                    <option value="">All Actions</option>
                    <option value="LOGIN">LOGIN</option>
                    <option value="ACCESS_PII">ACCESS_PII</option>
                    <option value="EXPORT_PII">EXPORT_PII</option>
                    <option value="UPDATE_LEAD">UPDATE_LEAD</option>
                    <option value="SOFT_DELETE">SOFT_DELETE</option>
                    <option value="RESTORE_LEAD">RESTORE_LEAD</option>
                    <option value="CREATE_USER">CREATE_USER</option>
                    <option value="UPDATE_USER">UPDATE_USER</option>
                    <option value="CREATE">CREATE (Content)</option>
                    <option value="UPDATE">UPDATE (Content)</option>
                    <option value="DELETE">DELETE (Content)</option>
                    <option value="UPLOAD_MEDIA">UPLOAD_MEDIA</option>
                    <option value="DELETE_MEDIA">DELETE_MEDIA</option>
                    <option value="UPDATE_SETTINGS">UPDATE_SETTINGS</option>
                  </select>
                </div>

                {/* Entity filter */}
                <div className="space-y-1.5">
                  <label className="font-bold text-navy uppercase tracking-wider">Affected Entity</label>
                  <select
                    value={selectedEntity}
                    onChange={(e) => { setSelectedEntity(e.target.value); setPage(1); }}
                    className="w-full px-2.5 py-2 border border-gray-200 rounded-lg bg-white"
                  >
                    <option value="">All Entities</option>
                    <option value="User">User</option>
                    <option value="Inquiry">Inquiry (Lead)</option>
                    <option value="Booking">Booking</option>
                    <option value="BlogPost">BlogPost (Blog)</option>
                    <option value="Service">Service</option>
                    <option value="Country">Country</option>
                    <option value="Course">Course</option>
                    <option value="FAQ">FAQ</option>
                    <option value="Intake">Intake</option>
                    <option value="TeamMember">TeamMember</option>
                    <option value="Testimonial">Testimonial</option>
                    <option value="MediaAsset">MediaAsset</option>
                    <option value="SiteSetting">SiteSetting</option>
                  </select>
                </div>

                {/* Date range filters */}
                <div className="space-y-1.5">
                  <label className="font-bold text-navy uppercase tracking-wider flex items-center gap-1">
                    <Calendar size={12} className="text-gold" /> Date Range
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
                      className="w-full px-2 py-1.5 border border-gray-200 rounded-lg bg-white"
                    />
                    <span className="text-gray-400 font-bold">to</span>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
                      className="w-full px-2 py-1.5 border border-gray-200 rounded-lg bg-white"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-2 px-2">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-navy hover:text-gold text-xs font-bold transition-all px-3 py-1.5"
                >
                  Reset All Filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Audit Logs Table */}
      {loading && logs.length === 0 ? (
        <div className="p-12 text-center text-gray-400 bg-white border border-gray-100 rounded-xl shadow-sm space-y-3">
          <RefreshCw className="animate-spin mx-auto text-gold" size={28} />
          <p className="text-sm font-semibold">Loading security audit feed...</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="p-16 text-center bg-white border border-gray-100 rounded-xl shadow-sm text-gray-500 space-y-2">
          <AlertTriangle className="mx-auto text-amber-400 stroke-[1.5]" size={48} />
          <p className="font-bold text-navy">No audit logs found</p>
          <p className="text-sm">No records match the current filters or search terms.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-400 text-xs font-bold uppercase tracking-wider">
                    <th className="p-4 px-6">Timestamp</th>
                    <th className="p-4">Staff Actor</th>
                    <th className="p-4">Action</th>
                    <th className="p-4">Target Entity</th>
                    <th className="p-4">IP Address</th>
                    <th className="p-4 px-6 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {logs.map((log) => {
                    const isExpanded = expandedId === log.id;
                    const date = new Date(log.createdAt);
                    return (
                      <React.Fragment key={log.id}>
                        <tr
                          onClick={() => toggleExpand(log.id)}
                          className="hover:bg-gray-50/30 cursor-pointer transition-colors"
                        >
                          <td className="p-4 px-6 font-semibold text-gray-500 whitespace-nowrap">
                            {date.toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })}
                          </td>
                          <td className="p-4 font-bold text-navy whitespace-nowrap">
                            {log.user?.name || "System"}
                            <span className="block text-[10px] font-normal text-gray-400 uppercase tracking-wider leading-none mt-0.5">
                              {log.user?.role || "SYSTEM"}
                            </span>
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            <span
                              className={`inline-block px-2.5 py-0.5 border rounded-md text-[10px] font-bold uppercase tracking-wider ${getActionColor(
                                log.action
                              )}`}
                            >
                              {log.action}
                            </span>
                          </td>
                          <td className="p-4 font-semibold text-gray-700 whitespace-nowrap">
                            {log.entity}
                          </td>
                          <td className="p-4 text-gray-500 font-mono text-xs whitespace-nowrap">
                            {log.ipAddress || "::1"}
                          </td>
                          <td className="p-4 px-6 text-right whitespace-nowrap">
                            <button className="text-gray-400 hover:text-navy transition-colors inline-flex items-center gap-1 text-xs">
                              {isExpanded ? (
                                <>
                                  Hide <ChevronUp size={14} />
                                </>
                              ) : (
                                <>
                                  Inspect <ChevronDown size={14} />
                                </>
                              )}
                            </button>
                          </td>
                        </tr>
                        {/* Expanded Payload row */}
                        <AnimatePresence>
                          {isExpanded && (
                            <tr>
                              <td colSpan={6} className="bg-gray-50/50 p-6 border-t border-gray-100">
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="space-y-4"
                                >
                                  {/* Explanation banner */}
                                  <div className="flex gap-2.5 bg-white border border-gray-200 p-4 rounded-xl text-xs text-gray-600 shadow-sm">
                                    <Info size={16} className="text-gold flex-shrink-0 mt-0.5" />
                                    <div>
                                      <p className="font-bold text-navy mb-0.5">Operation Summary</p>
                                      <p>{getFriendlyDetails(log)}</p>
                                    </div>
                                  </div>

                                  {/* Raw JSON details if present */}
                                  {log.details && (
                                    <div className="space-y-1.5">
                                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                                        Payload Context (JSON)
                                      </span>
                                      <pre className="bg-navy text-white text-xs font-mono p-4 rounded-xl overflow-x-auto max-h-48 border border-white/5 shadow-inner">
                                        {JSON.stringify(log.details, null, 2)}
                                      </pre>
                                    </div>
                                  )}
                                </motion.div>
                              </td>
                            </tr>
                          )}
                        </AnimatePresence>
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between bg-white border border-gray-100 p-4 rounded-2xl shadow-sm text-sm">
              <span className="text-gray-500 font-medium">
                Showing page <strong className="text-navy">{pagination.page}</strong> of{" "}
                <strong className="text-navy">{pagination.totalPages}</strong> ({pagination.total} total logs)
              </span>

              <div className="flex gap-1">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-3.5 py-1.5 border border-gray-200 hover:bg-gray-50 rounded-lg text-xs font-bold text-gray-600 transition-colors disabled:opacity-50 disabled:pointer-events-none"
                >
                  Previous
                </button>
                {Array.from({ length: pagination.totalPages }).map((_, i) => {
                  const pNum = i + 1;
                  // Show pages around current
                  if (Math.abs(page - pNum) > 2 && pNum !== 1 && pNum !== pagination.totalPages) {
                    return null;
                  }
                  return (
                    <button
                      key={pNum}
                      onClick={() => setPage(pNum)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                        page === pNum
                          ? "bg-navy border-navy text-white"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
                  disabled={page === pagination.totalPages}
                  className="px-3.5 py-1.5 border border-gray-200 hover:bg-gray-50 rounded-lg text-xs font-bold text-gray-600 transition-colors disabled:opacity-50 disabled:pointer-events-none"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
