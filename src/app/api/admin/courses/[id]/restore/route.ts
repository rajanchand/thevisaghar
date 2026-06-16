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

    // Only ADMIN and EDITOR roles can restore soft-deleted courses
    const canRestore = ["ADMIN", "EDITOR"].includes(session.user.role);
    if (!canRestore) {
      return NextResponse.json(
        { error: "Forbidden - administrator or editor permissions required" },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Verify course exists
    const course = await prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Update isDeleted flag to false
    const restoredCourse = await prisma.course.update({
      where: { id },
      data: { isDeleted: false },
    });

    // Log the restore audit action
    await logAudit({
      action: "RESTORE_LEAD",
      entity: "Course",
      entityId: id,
      userId: session.user.id,
      details: { title: course.title },
    });

    return NextResponse.json({
      success: true,
      message: "Course restored successfully",
      course: restoredCourse,
    });
  } catch (error) {
    console.error("[Admin Courses Restore POST Error]:", error);
    return NextResponse.json(
      { error: "Failed to restore course" },
      { status: 500 }
    );
  }
}
