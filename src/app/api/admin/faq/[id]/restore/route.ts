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

    // Only ADMIN and EDITOR roles can restore soft-deleted FAQs
    const canRestore = ["ADMIN", "EDITOR"].includes(session.user.role);
    if (!canRestore) {
      return NextResponse.json(
        { error: "Forbidden - administrator or editor permissions required" },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Verify FAQ exists
    const faq = await prisma.fAQ.findUnique({
      where: { id },
    });

    if (!faq) {
      return NextResponse.json({ error: "FAQ not found" }, { status: 404 });
    }

    // Update isDeleted flag to false
    const restoredFaq = await prisma.fAQ.update({
      where: { id },
      data: { isDeleted: false },
    });

    // Log the restore audit action
    await logAudit({
      action: "RESTORE_LEAD",
      entity: "FAQ",
      entityId: id,
      userId: session.user.id,
      details: { question: faq.question },
    });

    return NextResponse.json({
      success: true,
      message: "FAQ restored successfully",
      faq: restoredFaq,
    });
  } catch (error) {
    console.error("[Admin FAQs Restore POST Error]:", error);
    return NextResponse.json(
      { error: "Failed to restore FAQ" },
      { status: 500 }
    );
  }
}
