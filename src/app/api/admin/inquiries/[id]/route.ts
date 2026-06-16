import { rateLimit, RATE_LIMITS, getClientIP } from "@/lib/rate-limit";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { logAudit } from "@/lib/audit";
import { Prisma } from "@prisma/client";

// PATCH update inquiry status, assignment, notes timeline, etc.
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = getClientIP(request);
    const { success: rateLimitOk } = rateLimit(`adminWrite:${ip}`, RATE_LIMITS.adminWrite);
    if (!rateLimitOk) {
      return NextResponse.json(
        { error: "Too many write requests. Please try again later." },
        { status: 429 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Only ADMIN and EDITOR can write / modify lead details
    const canWrite = ["ADMIN", "EDITOR"].includes(session.user.role);
    if (!canWrite) {
      return NextResponse.json({ error: "Forbidden - write permissions required" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { isRead, isReplied, status, country, assignedToId, notes, noteText } = body;

    // Verify lead exists
    const inquiry = await prisma.inquiry.findUnique({
      where: { id },
    });

    if (!inquiry) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    // Build update object
    const updateData: Prisma.InquiryUpdateInput = {};

    if (typeof isRead === "boolean") updateData.isRead = isRead;
    if (typeof isReplied === "boolean") updateData.isReplied = isReplied;
    if (status && status !== inquiry.status) {
      updateData.status = status;
    }
    if (country !== undefined) updateData.country = country;
    if (assignedToId !== undefined) {
      if (assignedToId) {
        updateData.assignedTo = { connect: { id: assignedToId } };
      } else {
        updateData.assignedTo = { disconnect: true };
      }
    }

    // Handle Notes & Timeline Updates
    let updatedNotesList = Array.isArray(inquiry.notes)
      ? [...(inquiry.notes as unknown as Record<string, unknown>[])]
      : [];

    if (notes && Array.isArray(notes)) {
      updatedNotesList = notes;
    }

    // Append status transition to timeline
    if (status && status !== inquiry.status) {
      updatedNotesList.push({
        text: `Status changed from ${inquiry.status} to ${status}`,
        author: session.user.name || "System",
        createdAt: new Date().toISOString(),
        system: true,
      });
    }

    // Append manual note comment
    if (noteText && typeof noteText === "string" && noteText.trim()) {
      updatedNotesList.push({
        text: noteText.trim(),
        author: session.user.name || "System",
        createdAt: new Date().toISOString(),
        system: false,
      });
    }

    updateData.notes = updatedNotesList as Prisma.InputJsonValue;

    const updatedInquiry = await prisma.inquiry.update({
      where: { id },
      data: updateData,
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    // Audit log PII change
    await logAudit({
      action: "UPDATE_LEAD",
      entity: "Inquiry",
      entityId: id,
      userId: session.user.id,
      details: {
        name: inquiry.name,
        changedFields: Object.keys(updateData),
      },
    });

    return NextResponse.json(updatedInquiry);
  } catch (error) {
    console.error("[Admin Inquiries PATCH Error]:", error);
    return NextResponse.json(
      { error: "Failed to update lead" },
      { status: 500 }
    );
  }
}

// DELETE inquiry by ID (Soft Delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = getClientIP(request);
    const { success: rateLimitOk } = rateLimit(`adminWrite:${ip}`, RATE_LIMITS.adminWrite);
    if (!rateLimitOk) {
      return NextResponse.json(
        { error: "Too many write requests. Please try again later." },
        { status: 429 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Deletions are restricted to ADMIN only
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden - administrator permissions required" }, { status: 403 });
    }

    const { id } = await params;

    const inquiry = await prisma.inquiry.findUnique({
      where: { id },
    });

    if (!inquiry) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    // Soft delete by updating isDeleted flag
    await prisma.inquiry.update({
      where: { id },
      data: { isDeleted: true },
    });

    // Audit log
    await logAudit({
      action: "SOFT_DELETE",
      entity: "Inquiry",
      entityId: id,
      userId: session.user.id,
      details: { name: inquiry.name, email: inquiry.email },
    });

    return NextResponse.json({ success: true, message: "Lead soft-deleted successfully" });
  } catch (error) {
    console.error("[Admin Inquiries DELETE Error]:", error);
    return NextResponse.json(
      { error: "Failed to delete lead" },
      { status: 500 }
    );
  }
}
