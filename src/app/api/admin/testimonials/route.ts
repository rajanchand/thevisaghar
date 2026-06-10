import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { testimonialSchema } from "@/lib/validations";
import { logAudit } from "@/lib/audit";

// GET all testimonials (approved and pending) for administration
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(testimonials);
  } catch (error) {
    console.error("[Admin Testimonials GET Error]:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

// POST create a new testimonial
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = testimonialSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validatedData.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const testimonial = await prisma.testimonial.create({
      data: validatedData.data,
    });

    // Audit log
    await logAudit({
      action: "CREATE",
      entity: "Testimonial",
      entityId: testimonial.id,
      userId: session.user.id,
      details: { clientName: testimonial.clientName, visaType: testimonial.visaType, isApproved: testimonial.isApproved },
    });

    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    console.error("[Admin Testimonials POST Error]:", error);
    return NextResponse.json(
      { error: "Failed to create testimonial" },
      { status: 500 }
    );
  }
}
