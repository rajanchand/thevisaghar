import { rateLimit, RATE_LIMITS, getClientIP } from "@/lib/rate-limit";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { countrySchema } from "@/lib/validations";
import { logAudit } from "@/lib/audit";

// GET a country by ID
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

    const country = await prisma.country.findUnique({
      where: { id },
    });

    if (!country || country.isDeleted) {
      return NextResponse.json({ error: "Country not found" }, { status: 404 });
    }

    return NextResponse.json(country);
  } catch (error) {
    console.error("[Admin Country GET Error]:", error);
    return NextResponse.json(
      { error: "Failed to fetch country detail" },
      { status: 500 }
    );
  }
}

// PUT update a country by ID
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
    const validatedData = countrySchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validatedData.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Verify country exists
    const countryExists = await prisma.country.findUnique({
      where: { id },
    });

    if (!countryExists || countryExists.isDeleted) {
      return NextResponse.json({ error: "Country not found" }, { status: 404 });
    }

    // Check slug uniqueness if slug changed
    if (validatedData.data.slug !== countryExists.slug) {
      const slugConflict = await prisma.country.findFirst({
        where: { slug: validatedData.data.slug, isDeleted: false },
      });
      if (slugConflict) {
        return NextResponse.json(
          { error: "Another country with this slug already exists" },
          { status: 400 }
        );
      }
    }

    const updatedCountry = await prisma.country.update({
      where: { id },
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
      action: "UPDATE",
      entity: "Country",
      entityId: id,
      userId: session.user.id,
      details: { name: updatedCountry.name, slug: updatedCountry.slug },
    });

    return NextResponse.json(updatedCountry);
  } catch (error) {
    console.error("[Admin Country PUT Error]:", error);
    return NextResponse.json(
      { error: "Failed to update country" },
      { status: 500 }
    );
  }
}

// DELETE a country by ID (Soft Delete)
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

    // Verify country exists
    const country = await prisma.country.findUnique({
      where: { id },
    });

    if (!country || country.isDeleted) {
      return NextResponse.json({ error: "Country not found" }, { status: 404 });
    }

    await prisma.country.update({
      where: { id },
      data: { isDeleted: true },
    });

    // Audit log
    await logAudit({
      action: "SOFT_DELETE",
      entity: "Country",
      entityId: id,
      userId: session.user.id,
      details: { name: country.name, slug: country.slug },
    });

    return NextResponse.json({ success: true, message: "Country soft-deleted successfully" });
  } catch (error) {
    console.error("[Admin Country DELETE Error]:", error);
    return NextResponse.json(
      { error: "Failed to delete country" },
      { status: 500 }
    );
  }
}
