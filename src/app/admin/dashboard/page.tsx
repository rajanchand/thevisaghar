"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import {
  MessageSquare,
  Calendar,
  FileText,
  Briefcase,
  ArrowUpRight,
  RefreshCw,
  TrendingUp,
  Globe2,
  Users,
  Award,
} from "lucide-react";

interface CountryBreakdown {
  country: string;
  count: number;
}

interface SourceBreakdown {
  source: string;
  count: number;
}

interface Stats {
  totalInquiries: number;
  totalBookings: number;
  totalBlogPosts: number;
  activeServices: number;
  inquiriesToday: number;
  inquiriesInProgress: number;
  winRate: number;
  countryBreakdown: CountryBreakdown[];
  sourceBreakdown: SourceBreakdown[];
}

interface Activity {
  id: string;
  action: string;
  message: string;
  time: string;
}

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<Stats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setActivities(data.activities || []);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void (async () => { await fetchDashboardData(); })();
  }, []);

  const timeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${Math.max(1, diffMins)}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const displayName = session?.user?.name || "User";

  const statsCards = stats
    ? [
        {
          label: "Leads Today",
          value: stats.inquiriesToday,
          icon: MessageSquare,
          color: "bg-blue-50 text-blue-600 border border-blue-100",
        },
        {
          label: "Active Counselling Leads",
          value: stats.inquiriesInProgress,
          icon: TrendingUp,
          color: "bg-amber-50 text-amber-600 border border-amber-100",
        },
        {
          label: "CRM Win Rate",
          value: `${stats.winRate}%`,
          icon: Award,
          color: "bg-green-50 text-green-600 border border-green-100",
        },
        {
          label: "Active Services",
          value: stats.activeServices,
          icon: Briefcase,
          color: "bg-purple-50 text-purple-600 border border-purple-100",
        },
      ]
    : [];

  return (
    <div className="space-y-8">
      {/* Welcome & Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Welcome back, {displayName}</h1>
          <p className="text-gray-500 text-sm mt-1 font-medium">Here&apos;s the CRM & consultancy pipeline breakdown for today.</p>
        </div>
        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-500 hover:text-navy transition-all shadow-sm disabled:opacity-50"
          title="Refresh stats"
        >
          <RefreshCw size={18} className={loading ? "animate-spin text-gold" : ""} />
        </button>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-white border border-gray-100 rounded-xl p-6 shadow-sm h-32" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all"
            >
              <div className="space-y-1">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                <p className="text-3xl font-black text-navy">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon size={22} />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Main Grid: CRM Data & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CRM Leads Demographics Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-navy text-lg mb-4 flex items-center gap-2">
              <Globe2 size={20} className="text-gold" /> Destination & Lead Source Analytics
            </h2>

            {loading ? (
              <div className="h-48 flex items-center justify-center text-gray-400 text-sm">Loading CRM analytics...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Countries Breakdown */}
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Target Countries</h3>
                  {stats?.countryBreakdown && stats.countryBreakdown.length > 0 ? (
                    <div className="space-y-3">
                      {stats.countryBreakdown.map((c) => {
                        const total = stats.totalInquiries || 1;
                        const percent = Math.round((c.count / total) * 100);
                        return (
                          <div key={c.country} className="space-y-1">
                            <div className="flex justify-between text-sm font-semibold text-navy">
                              <span>{c.country}</span>
                              <span>{c.count} ({percent}%)</span>
                            </div>
                            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                              <div className="bg-navy h-full" style={{ width: `${percent}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 italic">No destination data recorded.</p>
                  )}
                </div>

                {/* Lead Sources Breakdown */}
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Lead Sources</h3>
                  {stats?.sourceBreakdown && stats.sourceBreakdown.length > 0 ? (
                    <div className="space-y-3">
                      {stats.sourceBreakdown.map((s) => {
                        const total = stats.totalInquiries || 1;
                        const percent = Math.round((s.count / total) * 100);
                        return (
                          <div key={s.source} className="space-y-1">
                            <div className="flex justify-between text-sm font-semibold text-navy">
                              <span>{s.source.replace(/_/g, " ")}</span>
                              <span>{s.count} ({percent}%)</span>
                            </div>
                            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                              <div className="bg-gold h-full" style={{ width: `${percent}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 italic">No lead source data recorded.</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Audit Logs Timeline */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-navy text-lg flex items-center gap-2">
                <Users size={20} className="text-gold" /> System Activity & Access Audit Log
              </h2>
              {session?.user?.role === "ADMIN" && (
                <Link href="/admin/audit-log" className="text-xs text-navy font-bold hover:text-gold transition-colors flex items-center gap-1">
                  View Full Log <ArrowUpRight size={14} />
                </Link>
              )}
            </div>

            {loading ? (
              <div className="p-12 text-center text-gray-400">Loading audit feed...</div>
            ) : activities.length === 0 ? (
              <div className="p-12 text-center text-gray-400 italic">No operations recorded yet.</div>
            ) : (
              <div className="divide-y divide-gray-50 max-h-[360px] overflow-y-auto">
                {activities.map((act) => (
                  <div key={act.id} className="p-4 px-6 hover:bg-gray-50/50 transition-colors flex justify-between items-center gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${
                        act.action.includes("DELETE") ? "bg-red-500" :
                        act.action.includes("RESTORE") ? "bg-green-500" :
                        act.action.includes("PII") ? "bg-amber-500" : "bg-navy"
                      }`} />
                      <p className="text-sm text-gray-700 font-semibold truncate min-w-0">{act.message}</p>
                    </div>
                    <span className="text-xs text-gray-400 font-bold whitespace-nowrap">{timeAgo(act.time)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Links & Pipeline Overview */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="font-bold text-navy">Quick Actions</h2>
            </div>
            <div className="p-4 space-y-1">
              {[
                { href: "/admin/inquiries", label: "View Inquiries", icon: MessageSquare },
                { href: "/admin/bookings", label: "Manage Bookings", icon: Calendar },
                { href: "/admin/blog", label: "Write Blog Post", icon: FileText },
                { href: "/admin/services", label: "Edit Services", icon: Briefcase },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between p-3.5 rounded-xl hover:bg-gray-50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <link.icon size={18} className="text-gray-400 group-hover:text-navy transition-colors" />
                    <span className="text-sm font-semibold text-gray-700">{link.label}</span>
                  </div>
                  <ArrowUpRight size={16} className="text-gray-300 group-hover:text-gold transition-colors" />
                </Link>
              ))}
            </div>
          </div>

          {/* CRM Lead pipeline definition */}
          <div className="bg-navy rounded-2xl p-6 text-white border border-white/5 space-y-4">
            <h3 className="font-bold text-gold flex items-center gap-1.5">
              📌 Lead Status Pipeline Guide
            </h3>
            <p className="text-white/75 text-xs leading-relaxed">
              Use the Status dropdown within Inquiry details to advance leads through the conversion funnel:
            </p>
            <div className="space-y-2.5 text-xs">
              <div>
                <span className="font-bold text-blue-300">NEW</span>
                <p className="text-white/60">Freshly submitted inquiry, awaiting assignment or initial contact.</p>
              </div>
              <div>
                <span className="font-bold text-amber-300">CONTACTED / COUNSELLING</span>
                <p className="text-white/60">Phone call/email sent, or student booked for counselor appointment.</p>
              </div>
              <div>
                <span className="font-bold text-purple-300">APPLIED</span>
                <p className="text-white/60">Student credentials submitted to a foreign university program.</p>
              </div>
              <div>
                <span className="font-bold text-green-300">CLOSED WON</span>
                <p className="text-white/60">Visa application approved and processed successfully.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
