import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import AdminLayoutClientWrapper from "@/components/admin/AdminLayoutClientWrapper";
import React from "react";
import prisma from "@/lib/db";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  let serializedUser = null;
  if (session?.user?.id) {
    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true, role: true, status: true }
    });

    // Only allow active admin panel users to render the full layout shell
    if (dbUser && dbUser.status === "ACTIVE") {
      serializedUser = {
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role as "ADMIN" | "EDITOR" | "VIEWER",
      };
    }
  }

  return (
    <AdminLayoutClientWrapper user={serializedUser}>
      {children}
    </AdminLayoutClientWrapper>
  );
}
