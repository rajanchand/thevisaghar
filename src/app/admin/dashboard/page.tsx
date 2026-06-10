"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Calendar,
  FileText,
  Briefcase,
  ArrowUpRight,
  TrendingUp,
  RefreshCw,
} from "lucide-react";

interface Stats {
  totalInquiries: number;
  totalBookings: number;
  totalBlogPosts: number;
  activeServices: number;
}

interface Activity {
  id: string;
  type: string;
  message: string;
  time: string;
}

export default function AdminDashboard() {
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
    fetchDashboardData();
  }, []);

  const statsCards = stats
    ? [
        {
          label: "Total Inquiries",
          value: stats.totalInquiries,
          icon: MessageSquare,
          color: "bg-blue-50 text-blue-600",
        },
        {
          label: "Total Bookings",
          value: stats.totalBookings,
          icon: Calendar,
          color: "bg-green-50 text-green-600",
        },
        {
          label: "Blog Articles",
          value: stats.totalBlogPosts,
          icon: FileText,
          color: "bg-purple-50 text-purple-600",
        },
        {
          label: "Active Services",
          value: stats.activeServices,
          icon: Briefcase,
          color: "bg-amber-50 text-amber-600",
        },
      ]
    : [];

  const timeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${Math.max(1, diffMins)} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  return (
    <div className="space-y-8">
      {/* Welcome & Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Welcome back, Admin</h1>
          <p className="text-gray-500 text-sm mt-1">Here&apos;s what&apos;s happening with The Visa Ghar today.</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-500 hover:text-navy transition-colors shadow-sm"
          title="Refresh stats"
        >
          <RefreshCw size={18} />
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <stat.icon size={20} />
                </div>
              </div>
              <p className="text-2xl font-bold text-navy">{stat.value}</p>
              <p className="text-gray-500 text-sm mt-1 font-semibold">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Recent Activity + Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h2 className="font-bold text-navy">Recent Activity</h2>
          </div>
          {loading ? (
            <div className="p-6 text-center text-gray-400">Loading activities timeline...</div>
          ) : activities.length === 0 ? (
            <div className="p-12 text-center text-gray-400 italic">No recent activities recorded.</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {activities.map((activity, index) => (
                <div key={index} className="p-4 px-6 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${
                        activity.type === "inquiry"
                          ? "bg-blue-500"
                          : activity.type === "booking"
                          ? "bg-green-500"
                          : "bg-purple-500"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 font-semibold">{activity.message}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{timeAgo(activity.time)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h2 className="font-bold text-navy">Quick Actions</h2>
          </div>
          <div className="p-4 space-y-2">
            {[
              { href: "/admin/inquiries", label: "View Inquiries", icon: MessageSquare },
              { href: "/admin/bookings", label: "Manage Bookings", icon: Calendar },
              { href: "/admin/blog", label: "Write Blog Post", icon: FileText },
              { href: "/admin/services", label: "Edit Services", icon: Briefcase },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <link.icon size={18} className="text-gray-400 group-hover:text-gold transition-colors" />
                  <span className="text-sm font-medium text-gray-700">{link.label}</span>
                </div>
                <ArrowUpRight size={16} className="text-gray-300 group-hover:text-gold transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
