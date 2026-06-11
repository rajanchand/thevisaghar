import { rateLimit, RATE_LIMITS, getClientIP } from "@/lib/rate-limit";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { serviceSchema } from "@/lib/validations";
import { logAudit } from "@/lib/audit";

// PUT update a service by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Rate limiting
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
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = serviceSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validatedData.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Verify service exists
    const serviceExists = await prisma.service.findUnique({
      where: { id },
    });

    if (!serviceExists) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    // Check slug uniqueness if slug changed
    if (validatedData.data.slug !== serviceExists.slug) {
      const slugConflict = await prisma.service.findUnique({
        where: { slug: validatedData.data.slug },
      });
      if (slugConflict) {
        return NextResponse.json(
          { error: "Another service with this slug already exists" },
          { status: 400 }
        );
      }
    }

    const updatedService = await prisma.service.update({
      where: { id },
      data: {
        ...validatedData.data,
        faq: validatedData.data.faq ? validatedData.data.faq : [],
      },
    });

    // Audit log
    await logAudit({
      action: "UPDATE",
      entity: "Service",
      entityId: id,
      userId: session.user.id,
      details: { title: updatedService.title, slug: updatedService.slug },
    });

    return NextResponse.json(updatedService);
  } catch (error) {
    console.error("[Admin Services PUT Error]:", error);
    return NextResponse.json(
      { error: "Failed to update service" },
      { status: 500 }
    );
  }
}

// DELETE a service by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Rate limiting
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
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    // Verify service exists
    const service = await prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    await prisma.service.delete({
      where: { id },
    });

    // Audit log
    await logAudit({
      action: "DELETE",
      entity: "Service",
      entityId: id,
      userId: session.user.id,
      details: { title: service.title, slug: service.slug },
    });

    return NextResponse.json({ success: true, message: "Service deleted successfully" });
  } catch (error) {
    console.error("[Admin Services DELETE Error]:", error);
    return NextResponse.json(
      { error: "Failed to delete service" },
      { status: 500 }
    );
  }
}
