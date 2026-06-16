import { rateLimit, RATE_LIMITS, getClientIP } from "@/lib/rate-limit";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { intakeSchema } from "@/lib/validations";
import { logAudit } from "@/lib/audit";

// GET all intakes
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

    const intakes = await prisma.intake.findMany({
      where: { isDeleted: false },
      orderBy: [
        { intakeYear: "asc" },
        { intakeMonth: "asc" }
      ],
    });

    return NextResponse.json(intakes);
  } catch (error) {
    console.error("[Admin Intakes GET Error]:", error);
    return NextResponse.json(
      { error: "Failed to fetch intakes" },
      { status: 500 }
    );
  }
}

// POST create an intake
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
    const validatedData = intakeSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validatedData.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const intake = await prisma.intake.create({
      data: {
        country: validatedData.data.country,
        intakeMonth: validatedData.data.intakeMonth,
        intakeYear: validatedData.data.intakeYear,
        deadlineDate: validatedData.data.deadlineDate ? new Date(validatedData.data.deadlineDate) : null,
        notes: validatedData.data.notes,
      },
    });

    // Audit log
    await logAudit({
      action: "CREATE",
      entity: "Intake",
      entityId: intake.id,
      userId: session.user.id,
      details: { country: intake.country, intake: `${intake.intakeMonth} ${intake.intakeYear}` },
    });

    return NextResponse.json(intake, { status: 201 });
  } catch (error) {
    console.error("[Admin Intakes POST Error]:", error);
    return NextResponse.json(
      { error: "Failed to create intake" },
      { status: 500 }
    );
  }
}
