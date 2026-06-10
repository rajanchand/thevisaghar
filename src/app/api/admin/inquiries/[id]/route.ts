import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { logAudit } from "@/lib/audit";

// PATCH update inquiry status (isRead / isReplied)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { isRead, isReplied } = body;

    // Verify inquiry exists
    const inquiry = await prisma.inquiry.findUnique({
      where: { id },
    });

    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    const updatedInquiry = await prisma.inquiry.update({
      where: { id },
      data: {
        ...(typeof isRead === "boolean" ? { isRead } : {}),
        ...(typeof isReplied === "boolean" ? { isReplied } : {}),
      },
    });

    // Audit log
    await logAudit({
      action: "UPDATE_STATUS",
      entity: "Inquiry",
      entityId: id,
      userId: session.user.id,
      details: { name: inquiry.name, isRead, isReplied },
    });

    return NextResponse.json(updatedInquiry);
  } catch (error) {
    console.error("[Admin Inquiries PATCH Error]:", error);
    return NextResponse.json(
      { error: "Failed to update inquiry" },
      { status: 500 }
    );
  }
}

// DELETE inquiry by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    // Verify inquiry exists
    const inquiry = await prisma.inquiry.findUnique({
      where: { id },
    });

    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    await prisma.inquiry.delete({
      where: { id },
    });

    // Audit log
    await logAudit({
      action: "DELETE",
      entity: "Inquiry",
      entityId: id,
      userId: session.user.id,
      details: { name: inquiry.name, email: inquiry.email },
    });

    return NextResponse.json({ success: true, message: "Inquiry deleted successfully" });
  } catch (error) {
    console.error("[Admin Inquiries DELETE Error]:", error);
    return NextResponse.json(
      { error: "Failed to delete inquiry" },
      { status: 500 }
    );
  }
}
