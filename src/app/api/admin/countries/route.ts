import { rateLimit, RATE_LIMITS, getClientIP } from "@/lib/rate-limit";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { countrySchema } from "@/lib/validations";
import { logAudit } from "@/lib/audit";

// GET all countries for administration
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

    const countries = await prisma.country.findMany({
      where: { isDeleted: false },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(countries);
  } catch (error) {
    console.error("[Admin Countries GET Error]:", error);
    return NextResponse.json(
      { error: "Failed to fetch countries" },
      { status: 500 }
    );
  }
}

// POST create a new country
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
    const validatedData = countrySchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validatedData.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Check if slug is unique
    const existingCountry = await prisma.country.findFirst({
      where: { slug: validatedData.data.slug },
    });

    if (existingCountry) {
      return NextResponse.json(
        { error: "A country with this slug already exists" },
        { status: 400 }
      );
    }

    const country = await prisma.country.create({
      data: {
        ...validatedData.data,
        costTableFields: validatedData.data.costTableFields || [],
        requirements: validatedData.data.requirements || [],
        englishRequirements: validatedData.data.englishRequirements || [],
        intakes: validatedData.data.intakes || [],
        faqList: validatedData.data.faqList || [],
        images: validatedData.data.images || [],
      },
    });

    // Audit log
    await logAudit({
      action: "CREATE",
      entity: "Country",
      entityId: country.id,
      userId: session.user.id,
      details: { name: country.name, slug: country.slug },
    });

    return NextResponse.json(country, { status: 201 });
  } catch (error) {
    console.error("[Admin Countries POST Error]:", error);
    return NextResponse.json(
      { error: "Failed to create country" },
      { status: 500 }
    );
  }
}
