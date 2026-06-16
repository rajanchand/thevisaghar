"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminLayoutClient from "./AdminLayoutClient";

interface WrapperProps {
  user: {
    name: string;
    email: string;
    role: "ADMIN" | "EDITOR" | "VIEWER";
  } | null;
  children: React.ReactNode;
}

const roleRestrictedPaths = [
  { prefix: "/admin/settings", roles: ["ADMIN"] },
  { prefix: "/admin/countries", roles: ["ADMIN", "EDITOR"] },
  { prefix: "/admin/services", roles: ["ADMIN", "EDITOR"] },
  { prefix: "/admin/courses", roles: ["ADMIN", "EDITOR"] },
  { prefix: "/admin/faq", roles: ["ADMIN", "EDITOR"] },
  { prefix: "/admin/intakes", roles: ["ADMIN", "EDITOR"] },
  { prefix: "/admin/blog", roles: ["ADMIN", "EDITOR"] },
  { prefix: "/admin/media", roles: ["ADMIN", "EDITOR"] },
  { prefix: "/admin/team", roles: ["ADMIN", "EDITOR"] },
  { prefix: "/admin/users", roles: ["ADMIN"] },
  { prefix: "/admin/audit-log", roles: ["ADMIN"] },
  { prefix: "/admin/testimonials", roles: ["ADMIN", "EDITOR"] },
  { prefix: "/admin/inquiries", roles: ["ADMIN", "EDITOR", "VIEWER"] },
  { prefix: "/admin/bookings", roles: ["ADMIN", "EDITOR", "VIEWER"] },
  { prefix: "/admin/dashboard", roles: ["ADMIN", "EDITOR", "VIEWER"] },
];

export default function AdminLayoutClientWrapper({ user, children }: WrapperProps) {
  const pathname = usePathname();
  const router = useRouter();

  // 1. Skip wrapper rendering on the login screen
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // 2. If session or user properties are not present (loading state fallback)
  if (!user) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60 text-sm font-medium">Authorizing credentials...</p>
        </div>
      </div>
    );
  }

  // 3. Enforce RBAC page boundaries on client-side routing
  const matchedRestriction = roleRestrictedPaths.find((path) =>
    pathname.startsWith(path.prefix)
  );

  if (matchedRestriction && !matchedRestriction.roles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0-6v2m0-5h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-navy mb-3">Access Denied</h2>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            Your current account role (<span className="font-bold text-navy">{user.role}</span>) does not have permission to view the <span className="font-semibold">{pathname}</span> module.
          </p>
          <button
            onClick={() => router.push("/admin/dashboard")}
            className="w-full bg-navy hover:bg-navy-light text-white font-semibold py-3 rounded-xl text-sm transition-all"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <AdminLayoutClient user={user}>
      {children}
    </AdminLayoutClient>
  );
}
