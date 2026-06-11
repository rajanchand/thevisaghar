import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { serviceSchema } from "@/lib/validations";
import { logAudit } from "@/lib/audit";

// GET all services for administration
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const services = await prisma.service.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error("[Admin Services GET Error]:", error);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}

// POST create a new service
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = serviceSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validatedData.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Check if slug is unique
    const existingService = await prisma.service.findUnique({
      where: { slug: validatedData.data.slug },
    });

    if (existingService) {
      return NextResponse.json(
        { error: "A service with this slug already exists" },
        { status: 400 }
      );
    }

    const { documentsRequired, faq, ...rest } = validatedData.data;

    const service = await prisma.service.create({
      data: {
        ...rest,
        documentsRequired: JSON.stringify(documentsRequired),
        faq: faq ? JSON.stringify(faq) : "[]",
      },
    });

    // Audit log
    await logAudit({
      action: "CREATE",
      entity: "Service",
      entityId: service.id,
      userId: session.user.id,
      details: { title: service.title, slug: service.slug },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error("[Admin Services POST Error]:", error);
    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 }
    );
  }
}
