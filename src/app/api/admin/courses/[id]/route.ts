import { rateLimit, RATE_LIMITS, getClientIP } from "@/lib/rate-limit";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { courseSchema } from "@/lib/validations";
import { logAudit } from "@/lib/audit";

// GET a course by ID
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

    const course = await prisma.course.findUnique({
      where: { id },
    });

    if (!course || course.isDeleted) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error("[Admin Course GET Error]:", error);
    return NextResponse.json(
      { error: "Failed to fetch course detail" },
      { status: 500 }
    );
  }
}

// PUT update a course by ID
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
    const validatedData = courseSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validatedData.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Verify course exists
    const courseExists = await prisma.course.findUnique({
      where: { id },
    });

    if (!courseExists || courseExists.isDeleted) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: {
        ...validatedData.data,
        outcomes: validatedData.data.outcomes || [],
      },
    });

    // Audit log
    await logAudit({
      action: "UPDATE",
      entity: "Course",
      entityId: id,
      userId: session.user.id,
      details: { title: updatedCourse.title },
    });

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error("[Admin Course PUT Error]:", error);
    return NextResponse.json(
      { error: "Failed to update course" },
      { status: 500 }
    );
  }
}

// DELETE a course by ID (Soft Delete)
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

    // Verify course exists
    const course = await prisma.course.findUnique({
      where: { id },
    });

    if (!course || course.isDeleted) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    await prisma.course.update({
      where: { id },
      data: { isDeleted: true },
    });

    // Audit log
    await logAudit({
      action: "SOFT_DELETE",
      entity: "Course",
      entityId: id,
      userId: session.user.id,
      details: { title: course.title },
    });

    return NextResponse.json({ success: true, message: "Course soft-deleted successfully" });
  } catch (error) {
    console.error("[Admin Course DELETE Error]:", error);
    return NextResponse.json(
      { error: "Failed to delete course" },
      { status: 500 }
    );
  }
}
