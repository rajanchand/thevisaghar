import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { MOCK_SERVICES } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
    if (services.length === 0) {
      return NextResponse.json(MOCK_SERVICES);
    }
    return NextResponse.json(services);
  } catch (error) {
    console.warn("[Public Services GET Warning] Database offline, returning mock data.");
    return NextResponse.json(MOCK_SERVICES);
  }
}
