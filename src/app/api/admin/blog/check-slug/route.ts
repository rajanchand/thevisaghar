import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const excludeId = searchParams.get("excludeId");

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const whereClause: { slug: string; id?: { not: string }; isDeleted: boolean } = {
      slug,
      isDeleted: false,
    };

    if (excludeId) {
      whereClause.id = { not: excludeId };
    }

    const existing = await prisma.blogPost.findFirst({
      where: whereClause,
    });

    return NextResponse.json({ available: !existing });
  } catch (error) {
    console.error("[Admin Blog Check-Slug Error]:", error);
    return NextResponse.json(
      { error: "Failed to check slug uniqueness" },
      { status: 500 }
    );
  }
}
