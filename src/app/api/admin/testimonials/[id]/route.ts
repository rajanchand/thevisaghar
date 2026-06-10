import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { testimonialSchema } from "@/lib/validations";
import { logAudit } from "@/lib/audit";

// PUT update a testimonial by ID
export async function PUT(
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
    const validatedData = testimonialSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validatedData.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Verify testimonial exists
    const testimonialExists = await prisma.testimonial.findUnique({
      where: { id },
    });

    if (!testimonialExists) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }

    const updatedTestimonial = await prisma.testimonial.update({
      where: { id },
      data: validatedData.data,
    });

    // Audit log
    await logAudit({
      action: "UPDATE",
      entity: "Testimonial",
      entityId: id,
      userId: session.user.id,
      details: { clientName: updatedTestimonial.clientName, isApproved: updatedTestimonial.isApproved },
    });

    return NextResponse.json(updatedTestimonial);
  } catch (error) {
    console.error("[Admin Testimonials PUT Error]:", error);
    return NextResponse.json(
      { error: "Failed to update testimonial" },
      { status: 500 }
    );
  }
}

// DELETE testimonial by ID
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

    // Verify testimonial exists
    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
    });

    if (!testimonial) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }

    await prisma.testimonial.delete({
      where: { id },
    });

    // Audit log
    await logAudit({
      action: "DELETE",
      entity: "Testimonial",
      entityId: id,
      userId: session.user.id,
      details: { clientName: testimonial.clientName },
    });

    return NextResponse.json({ success: true, message: "Testimonial deleted successfully" });
  } catch (error) {
    console.error("[Admin Testimonials DELETE Error]:", error);
    return NextResponse.json(
      { error: "Failed to delete testimonial" },
      { status: 500 }
    );
  }
}
