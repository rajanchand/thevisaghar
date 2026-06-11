import { rateLimit, RATE_LIMITS, getClientIP } from "@/lib/rate-limit";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { SiteSetting } from "@prisma/client";
import { logAudit } from "@/lib/audit";

// GET all site settings as key-value pairs
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const settings = await prisma.siteSetting.findMany();
    
    // Map array into a convenient dictionary format: { [key]: value }
    const settingsMap = settings.reduce((acc: Record<string, string>, current: SiteSetting) => {
      acc[current.key] = current.value;
      return acc;
    }, {} as Record<string, string>);

    return NextResponse.json(settingsMap);
  } catch (error) {
    console.error("[Admin Settings GET Error]:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// PUT bulk update site settings
export async function PUT(request: NextRequest) {
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

    const body = await request.json(); // Expected format: { [key]: value }
    
    if (typeof body !== "object" || body === null) {
      return NextResponse.json(
        { error: "Invalid payload format. Expected an object of key-value pairs." },
        { status: 400 }
      );
    }

    const updatedKeys: string[] = [];

    // Perform upserts in a transaction or sequential loops
    await prisma.$transaction(
      Object.entries(body).map(([key, val]) => {
        updatedKeys.push(key);
        return prisma.siteSetting.upsert({
          where: { key },
          update: { value: String(val) },
          create: { key, value: String(val) },
        });
      })
    );

    // Audit log
    await logAudit({
      action: "UPDATE_SETTINGS",
      entity: "SiteSetting",
      userId: session.user.id,
      details: { updatedKeys },
    });

    return NextResponse.json({ success: true, updatedKeys });
  } catch (error) {
    console.error("[Admin Settings PUT Error]:", error);
    return NextResponse.json(
      { error: "Failed to update site settings" },
      { status: 500 }
    );
  }
}
