import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { Inquiry } from "@prisma/client";

// Helper to escape CSV values
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
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const isExport = searchParams.get("export") === "csv";

    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: "desc" },
    });

    if (isExport) {
      // Generate CSV
      const headers = ["ID", "Name", "Email", "Phone", "Visa Type", "Message", "Read", "Replied", "Created At"];
      const rows = inquiries.map((inq: Inquiry) => [
        inq.id,
        inq.name,
        inq.email,
        inq.phone || "",
        inq.visaType,
        inq.message,
        inq.isRead ? "Yes" : "No",
        inq.isReplied ? "Yes" : "No",
        inq.createdAt.toISOString(),
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map((row: unknown[]) => row.map(escapeCSV).join(",")),
      ].join("\n");

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": "attachment; filename=inquiries_export.csv",
        },
      });
    }

    return NextResponse.json(inquiries);
  } catch (error) {
    console.error("[Admin Inquiries GET Error]:", error);
    return NextResponse.json(
      { error: "Failed to fetch inquiries" },
      { status: 500 }
    );
  }
}
