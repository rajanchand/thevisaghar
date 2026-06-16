import { rateLimit, RATE_LIMITS, getClientIP } from "@/lib/rate-limit";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { logAudit } from "@/lib/audit";

export async function POST(
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

    // Only ADMIN and EDITOR roles can restore soft-deleted leads
    const canRestore = ["ADMIN", "EDITOR"].includes(session.user.role);
    if (!canRestore) {
      return NextResponse.json(
        { error: "Forbidden - administrator or editor permissions required" },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Verify lead exists
    const inquiry = await prisma.inquiry.findUnique({
      where: { id },
    });

    if (!inquiry) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    // Update isDeleted flag to false
    const restoredInquiry = await prisma.inquiry.update({
      where: { id },
      data: { isDeleted: false },
    });

    // Log the restore audit action
    await logAudit({
      action: "RESTORE_LEAD",
      entity: "Inquiry",
      entityId: id,
      userId: session.user.id,
      details: { name: inquiry.name, email: inquiry.email },
    });

    return NextResponse.json({
      success: true,
      message: "Lead restored successfully",
      lead: restoredInquiry,
    });
  } catch (error) {
    console.error("[Admin Inquiries Restore POST Error]:", error);
    return NextResponse.json(
      { error: "Failed to restore lead" },
      { status: 500 }
    );
  }
}
