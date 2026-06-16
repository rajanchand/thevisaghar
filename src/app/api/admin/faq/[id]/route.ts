import { rateLimit, RATE_LIMITS, getClientIP } from "@/lib/rate-limit";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { faqSchema } from "@/lib/validations";
import { logAudit } from "@/lib/audit";

// GET a FAQ by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const hasAccess = ["ADMIN", "EDITOR", "VIEWER"].includes(session.user.role);
    if (!hasAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    const faq = await prisma.fAQ.findUnique({
      where: { id },
    });

    if (!faq || faq.isDeleted) {
      return NextResponse.json({ error: "FAQ not found" }, { status: 404 });
    }

    return NextResponse.json(faq);
  } catch (error) {
    console.error("[Admin FAQ GET Error]:", error);
    return NextResponse.json(
      { error: "Failed to fetch FAQ detail" },
      { status: 500 }
    );
  }
}

// PUT update a FAQ by ID
export async function PUT(
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
    const canWrite = ["ADMIN", "EDITOR"].includes(session.user.role);
    if (!canWrite) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = faqSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validatedData.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Verify FAQ exists
    const faqExists = await prisma.fAQ.findUnique({
      where: { id },
    });

    if (!faqExists || faqExists.isDeleted) {
      return NextResponse.json({ error: "FAQ not found" }, { status: 404 });
    }

    const updatedFaq = await prisma.fAQ.update({
      where: { id },
      data: validatedData.data,
    });

    // Audit log
    await logAudit({
      action: "UPDATE",
      entity: "FAQ",
      entityId: id,
      userId: session.user.id,
      details: { question: updatedFaq.question },
    });

    return NextResponse.json(updatedFaq);
  } catch (error) {
    console.error("[Admin FAQ PUT Error]:", error);
    return NextResponse.json(
      { error: "Failed to update FAQ" },
      { status: 500 }
    );
  }
}

// DELETE a FAQ by ID (Soft Delete)
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
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden - Administrator access required" }, { status: 403 });
    }

    const { id } = await params;

    // Verify FAQ exists
    const faq = await prisma.fAQ.findUnique({
      where: { id },
    });

    if (!faq || faq.isDeleted) {
      return NextResponse.json({ error: "FAQ not found" }, { status: 404 });
    }

    await prisma.fAQ.update({
      where: { id },
      data: { isDeleted: true },
    });

    // Audit log
    await logAudit({
      action: "SOFT_DELETE",
      entity: "FAQ",
      entityId: id,
      userId: session.user.id,
      details: { question: faq.question },
    });

    return NextResponse.json({ success: true, message: "FAQ soft-deleted successfully" });
  } catch (error) {
    console.error("[Admin FAQ DELETE Error]:", error);
    return NextResponse.json(
      { error: "Failed to delete FAQ" },
      { status: 500 }
    );
  }
}
