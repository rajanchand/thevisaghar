import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { MOCK_SERVICES } from "@/lib/mock-data";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const service = await prisma.service.findUnique({
      where: { slug },
    });

    if (!service || !service.isActive) {
      const mockService = MOCK_SERVICES.find((s) => s.slug === slug);
      if (mockService) {
        return NextResponse.json(mockService);
      }
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json(service);
  } catch {
    console.warn("[Public Service Detail GET Warning] Database offline, checking mock data.");
    try {
      const { slug } = await params;
      const mockService = MOCK_SERVICES.find((s) => s.slug === slug);
      if (mockService) {
        return NextResponse.json(mockService);
      }
    } catch {}
    return NextResponse.json(
      { error: "Failed to fetch service details" },
      { status: 500 }
    );
  }
}
