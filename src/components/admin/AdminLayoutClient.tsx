"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Logo } from "@/components/ui/Logo";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  MessageSquare,
  Calendar,
  Users,
  Star,
  Settings,
  LogOut,
  Menu,
  X,
  Globe,
  BookOpen,
  HelpCircle,
  Image as ImageIcon,
  UserCheck,
  ShieldAlert,
} from "lucide-react";

interface AdminLayoutClientProps {
  user: {
    name: string;
    email: string;
    role: "ADMIN" | "EDITOR" | "VIEWER";
  };
  children: React.ReactNode;
}

const sidebarLinks = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard", roles: ["ADMIN", "EDITOR", "VIEWER"] },
  { href: "/admin/inquiries", icon: MessageSquare, label: "Inquiries", roles: ["ADMIN", "EDITOR", "VIEWER"] },
  { href: "/admin/bookings", icon: Calendar, label: "Bookings", roles: ["ADMIN", "EDITOR", "VIEWER"] },
  { href: "/admin/countries", icon: Globe, label: "Countries", roles: ["ADMIN", "EDITOR"] },
  { href: "/admin/services", icon: Briefcase, label: "Services", roles: ["ADMIN", "EDITOR"] },
  { href: "/admin/courses", icon: BookOpen, label: "Courses", roles: ["ADMIN", "EDITOR"] },
  { href: "/admin/blog", icon: FileText, label: "Blog Posts", roles: ["ADMIN", "EDITOR"] },
  { href: "/admin/media", icon: ImageIcon, label: "Media Library", roles: ["ADMIN", "EDITOR"] },
  { href: "/admin/testimonials", icon: Star, label: "Testimonials", roles: ["ADMIN", "EDITOR"] },
  { href: "/admin/faq", icon: HelpCircle, label: "FAQs", roles: ["ADMIN", "EDITOR"] },
  { href: "/admin/intakes", icon: Calendar, label: "Intakes", roles: ["ADMIN", "EDITOR"] },
  { href: "/admin/team", icon: Users, label: "Team", roles: ["ADMIN", "EDITOR"] },
  { href: "/admin/users", icon: UserCheck, label: "Staff Accounts", roles: ["ADMIN"] },
  { href: "/admin/audit-log", icon: ShieldAlert, label: "Security Logs", roles: ["ADMIN"] },
  { href: "/admin/settings", icon: Settings, label: "Settings", roles: ["ADMIN"] },
];

export default function AdminLayoutClient({ user, children }: AdminLayoutClientProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // Filter sidebar links based on the user's role
  const allowedLinks = sidebarLinks.filter((link) => link.roles.includes(user.role));

  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  const getActiveHeaderLabel = () => {
    const activeLink = sidebarLinks.find((l) => pathname.startsWith(l.href));
    return activeLink ? activeLink.label : "Admin Portal";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar toggle button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200"
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <X size={20} className="text-navy" /> : <Menu size={20} className="text-navy" />}
      </button>

      {/* Sidebar navigation */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-navy z-40 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo container */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <Logo variant="white" size="sm" />
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/60 hover:text-white">
              <X size={20} />
            </button>
          </div>

          {/* Navigation links */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto" aria-label="Admin navigation">
            {allowedLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-gold/15 text-gold"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <link.icon size={18} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Profile footer and Sign out */}
          <div className="p-4 border-t border-white/10 space-y-2">
            <div className="px-4 py-2 flex items-center gap-3 bg-white/5 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                <span className="text-gold font-bold text-sm">{getInitial(user.name)}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-white text-xs font-bold truncate leading-tight">{user.name}</p>
                <p className="text-white/60 text-[10px] uppercase tracking-wider font-semibold truncate leading-none mt-1">
                  {user.role}
                </p>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-white/5 transition-colors w-full"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile drawer backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Content wrapper */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-20 flex items-center justify-between h-[72px]">
          <h1 className="text-lg font-bold text-navy lg:ml-0 ml-12">
            {getActiveHeaderLabel()}
          </h1>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-bold text-navy">{user.name}</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">{user.role}</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-navy flex items-center justify-center">
              <span className="text-gold text-xs font-bold">{getInitial(user.name)}</span>
            </div>
          </div>
        </header>

        {/* Main layout container */}
        <main className="p-6 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
