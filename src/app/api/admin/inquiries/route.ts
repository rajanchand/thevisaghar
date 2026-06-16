import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";
import { logAudit } from "@/lib/audit";

// Helper to escape CSV values safely
function escapeCSV(val: unknown) {
  if (val === null || val === undefined) return "";
  let str = String(val);
  str = str.replace(/"/g, '""');
  if (str.includes(",") || str.includes("\n") || str.includes('"')) {
    return `"${str}"`;
  }
  return str;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Allow ADMIN, EDITOR, and VIEWER roles to fetch inquiries
    const hasAccess = ["ADMIN", "EDITOR", "VIEWER"].includes(session.user.role);
    if (!hasAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const isExport = searchParams.get("export") === "csv";

    // 1. Pagination Parameters
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    // 2. Filters & Search parameters
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const source = searchParams.get("source") || "";
    const country = searchParams.get("country") || "";
    const startDate = searchParams.get("startDate") || "";
    const endDate = searchParams.get("endDate") || "";
    const showDeleted = searchParams.get("deleted") === "true";

    // Build dynamic Prisma query filter
    const where: Prisma.InquiryWhereInput = {
      isDeleted: showDeleted ? undefined : false,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { message: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { visaType: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status) {
      where.status = status;
    }
    if (source) {
      where.source = source;
    }
    if (country) {
      where.country = { equals: country, mode: "insensitive" };
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
    }

    // 3. Sorting Parameters
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = (searchParams.get("sortOrder") || "desc") as Prisma.SortOrder;
    const orderBy: Prisma.InquiryOrderByWithRelationInput = { [sortBy]: sortOrder };

    // Secure requirement: Log PII access or export
    await logAudit({
      action: isExport ? "EXPORT_PII" : "ACCESS_PII",
      entity: "Inquiry",
      userId: session.user.id,
      details: {
        filters: { search, status, source, country, startDate, endDate, showDeleted },
        page: isExport ? "all" : page,
      },
    });

    if (isExport) {
      const inquiries = await prisma.inquiry.findMany({
        where,
        orderBy,
        include: {
          assignedTo: {
            select: { name: true, email: true },
          },
        },
      });

      const headers = ["ID", "Name", "Email", "Phone", "Visa Type", "Source", "Status", "Country", "Assigned Staff", "Created At"];
      const rows = inquiries.map((inq) => [
        inq.id,
        inq.name,
        inq.email,
        inq.phone || "",
        inq.visaType,
        inq.source,
        inq.status,
        inq.country || "",
        inq.assignedTo?.name || "Unassigned",
        inq.createdAt.toISOString(),
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.map(escapeCSV).join(",")),
      ].join("\n");

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": "attachment; filename=leads_export.csv",
        },
      });
    }

    // Fetch total matching count & paginated items
    const [totalItems, items] = await prisma.$transaction([
      prisma.inquiry.count({ where }),
      prisma.inquiry.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          assignedTo: {
            select: { id: true, name: true, email: true, role: true },
          },
        },
      }),
    ]);

    return NextResponse.json({
      items,
      meta: {
        totalItems,
        page,
        limit,
        totalPages: Math.ceil(totalItems / limit),
      },
    });
  } catch (error) {
    console.error("[Admin Inquiries GET Error]:", error);
    return NextResponse.json(
      { error: "Failed to fetch inquiries" },
      { status: 500 }
    );
  }
}
