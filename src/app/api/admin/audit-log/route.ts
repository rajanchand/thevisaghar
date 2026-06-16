import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";

// GET audit logs with pagination, search, and filtering
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admin privilege required" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "30", 10)));
    const skip = (page - 1) * limit;

    // Filter params
    const search = searchParams.get("search") || "";
    const action = searchParams.get("action") || "";
    const entity = searchParams.get("entity") || "";
    const userId = searchParams.get("userId") || "";
    const startDateStr = searchParams.get("startDate") || "";
    const endDateStr = searchParams.get("endDate") || "";

    // Build prisma query filters
    const where: Prisma.AuditLogWhereInput = {};

    // Exact matches
    if (action) {
      where.action = action;
    }
    if (entity) {
      where.entity = entity;
    }
    if (userId) {
      where.userId = userId;
    }

    // Date range
    if (startDateStr || endDateStr) {
      const dateFilter: Prisma.DateTimeFilter = {};
      if (startDateStr) {
        dateFilter.gte = new Date(startDateStr);
      }
      if (endDateStr) {
        const endDate = new Date(endDateStr);
        // Extend to end of the day (23:59:59.999)
        endDate.setHours(23, 59, 59, 999);
        dateFilter.lte = endDate;
      }
      where.createdAt = dateFilter;
    }

    // General text search (searches in action, entity, user name, or details JSON)
    if (search) {
      where.OR = [
        { action: { contains: search, mode: "insensitive" } },
        { entity: { contains: search, mode: "insensitive" } },
        {
          user: {
            name: { contains: search, mode: "insensitive" },
          },
        },
      ];
    }

    const [logs, total] = await prisma.$transaction([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          user: {
            select: { name: true, email: true, role: true },
          },
        },
      }),
      prisma.auditLog.count({ where }),
    ]);

    return NextResponse.json({
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[Admin Audit Logs GET Error]:", error);
    return NextResponse.json(
      { error: "Failed to fetch audit logs" },
      { status: 500 }
    );
  }
}
