import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { logAudit } from "@/lib/audit";

type Params = Promise<{ id: string }>;

export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, email, password, role, status } = body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "Staff user not found" }, { status: 404 });
    }

    // Prepare update payload
    const updateData: {
      name?: string;
      email?: string;
      role?: string;
      status?: string;
      passwordHash?: string;
    } = {};

    if (name) updateData.name = name;
    if (email) {
      // Validate unique email if it's changing
      if (email !== existingUser.email) {
        const emailExists = await prisma.user.findUnique({
          where: { email },
        });
        if (emailExists) {
          return NextResponse.json({ error: "A user with this email already exists" }, { status: 400 });
        }
      }
      updateData.email = email;
    }

    if (role) {
      if (!["ADMIN", "EDITOR", "VIEWER"].includes(role)) {
        return NextResponse.json({ error: "Invalid role specified" }, { status: 400 });
      }
      updateData.role = role;
    }

    if (status) {
      if (!["ACTIVE", "DEACTIVATED"].includes(status)) {
        return NextResponse.json({ error: "Invalid status specified" }, { status: 400 });
      }
      // Prevent self-deactivation
      if (id === session.user.id && status === "DEACTIVATED") {
        return NextResponse.json({ error: "You cannot deactivate your own account" }, { status: 400 });
      }
      updateData.status = status;
    }

    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      updateData.passwordHash = await bcrypt.hash(password, salt);
    }

    // Perform DB update
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        updatedAt: true,
      },
    });

    // Audit log
    await logAudit({
      action: "UPDATE_USER",
      entity: "User",
      entityId: updatedUser.id,
      userId: session.user.id,
      details: {
        email: updatedUser.email,
        role: updatedUser.role,
        status: updatedUser.status,
        changedFields: Object.keys(updateData).filter((k) => k !== "passwordHash"),
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("[Admin Users PUT Error]:", error);
    return NextResponse.json(
      { error: "Failed to update staff member" },
      { status: 500 }
    );
  }
}
