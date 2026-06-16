import { rateLimit, RATE_LIMITS, getClientIP } from "@/lib/rate-limit";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { faqSchema } from "@/lib/validations";
import { logAudit } from "@/lib/audit";

// GET all FAQs
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const hasAccess = ["ADMIN", "EDITOR", "VIEWER"].includes(session.user.role);
    if (!hasAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const faqs = await prisma.fAQ.findMany({
      where: { isDeleted: false },
      orderBy: [
        { group: "asc" },
        { order: "asc" }
      ],
    });

    return NextResponse.json(faqs);
  } catch (error) {
    console.error("[Admin FAQs GET Error]:", error);
    return NextResponse.json(
      { error: "Failed to fetch FAQs" },
      { status: 500 }
    );
  }
}

// POST create a FAQ
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const validatedData = faqSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validatedData.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const faq = await prisma.fAQ.create({
      data: validatedData.data,
    });

    // Audit log
    await logAudit({
      action: "CREATE",
      entity: "FAQ",
      entityId: faq.id,
      userId: session.user.id,
      details: { question: faq.question },
    });

    return NextResponse.json(faq, { status: 201 });
  } catch (error) {
    console.error("[Admin FAQs POST Error]:", error);
    return NextResponse.json(
      { error: "Failed to create FAQ" },
      { status: 500 }
    );
  }
}
