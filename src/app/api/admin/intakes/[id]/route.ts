import { rateLimit, RATE_LIMITS, getClientIP } from "@/lib/rate-limit";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { intakeSchema } from "@/lib/validations";
import { logAudit } from "@/lib/audit";

// GET an intake by ID
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

    const intake = await prisma.intake.findUnique({
      where: { id },
    });

    if (!intake || intake.isDeleted) {
      return NextResponse.json({ error: "Intake not found" }, { status: 404 });
    }

    return NextResponse.json(intake);
  } catch (error) {
    console.error("[Admin Intake GET Error]:", error);
    return NextResponse.json(
      { error: "Failed to fetch intake detail" },
      { status: 500 }
    );
  }
}

// PUT update an intake by ID
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
    const validatedData = intakeSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validatedData.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Verify intake exists
    const intakeExists = await prisma.intake.findUnique({
      where: { id },
    });

    if (!intakeExists || intakeExists.isDeleted) {
      return NextResponse.json({ error: "Intake not found" }, { status: 404 });
    }

    const updatedIntake = await prisma.intake.update({
      where: { id },
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
      action: "UPDATE",
      entity: "Intake",
      entityId: id,
      userId: session.user.id,
      details: { country: updatedIntake.country, intake: `${updatedIntake.intakeMonth} ${updatedIntake.intakeYear}` },
    });

    return NextResponse.json(updatedIntake);
  } catch (error) {
    console.error("[Admin Intake PUT Error]:", error);
    return NextResponse.json(
      { error: "Failed to update intake" },
      { status: 500 }
    );
  }
}

// DELETE an intake by ID (Soft Delete)
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

    // Verify intake exists
    const intake = await prisma.intake.findUnique({
      where: { id },
    });

    if (!intake || intake.isDeleted) {
      return NextResponse.json({ error: "Intake not found" }, { status: 404 });
    }

    await prisma.intake.update({
      where: { id },
      data: { isDeleted: true },
    });

    // Audit log
    await logAudit({
      action: "SOFT_DELETE",
      entity: "Intake",
      entityId: id,
      userId: session.user.id,
      details: { country: intake.country, intake: `${intake.intakeMonth} ${intake.intakeYear}` },
    });

    return NextResponse.json({ success: true, message: "Intake soft-deleted successfully" });
  } catch (error) {
    console.error("[Admin Intake DELETE Error]:", error);
    return NextResponse.json(
      { error: "Failed to delete intake" },
      { status: 500 }
    );
  }
}
