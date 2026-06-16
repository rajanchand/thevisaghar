import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

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

    // Basic counts
    const totalInquiries = await prisma.inquiry.count({ where: { isDeleted: false } });
    const totalBookings = await prisma.booking.count({ where: { isDeleted: false } });
    const totalBlogPosts = await prisma.blogPost.count({ where: { isDeleted: false } });
    const activeServices = await prisma.service.count({
      where: { isActive: true, isDeleted: false },
    });

    // CRM Lead Metrics
    const startOfToday = new Date();
    startOfToday.setUTCHours(0, 0, 0, 0);

    const inquiriesToday = await prisma.inquiry.count({
      where: {
        createdAt: { gte: startOfToday },
        isDeleted: false,
      },
    });

    const inquiriesInProgress = await prisma.inquiry.count({
      where: {
        status: { in: ["CONTACTED", "COUNSELLING_BOOKED", "APPLIED"] },
        isDeleted: false,
      },
    });

    const wonCount = await prisma.inquiry.count({
      where: { status: "CLOSED_WON", isDeleted: false },
    });
    const lostCount = await prisma.inquiry.count({
      where: { status: "CLOSED_LOST", isDeleted: false },
    });
    const totalClosed = wonCount + lostCount;
    const winRate = totalClosed > 0 ? Math.round((wonCount / totalClosed) * 100) : 0;

    // Breakdown by Country
    const countryBreakdownRaw = await prisma.inquiry.groupBy({
      by: ["country"],
      where: { isDeleted: false },
      _count: { _all: true },
    });
    const countryBreakdown = countryBreakdownRaw.map((item) => ({
      country: item.country || "Unspecified",
      count: item._count._all,
    })).sort((a, b) => b.count - a.count);

    // Breakdown by Source
    const sourceBreakdownRaw = await prisma.inquiry.groupBy({
      by: ["source"],
      where: { isDeleted: false },
      _count: { _all: true },
    });
    const sourceBreakdown = sourceBreakdownRaw.map((item) => ({
      source: item.source || "Unknown",
      count: item._count._all,
    })).sort((a, b) => b.count - a.count);

    // Fetch the 10 most recent AuditLog entries for the activity timeline
    const auditLogs = await prisma.auditLog.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { name: true, role: true },
        },
      },
    });

    // Map logs to UI friendly structures
    const activities = auditLogs.map((log) => {
      const actor = log.user?.name || "System";
      let message = `${actor} performed action ${log.action} on ${log.entity}`;
      
      // Customize standard audit log actions for friendlier dashboard viewing
      if (log.action === "ACCESS_PII") {
        message = `${actor} accessed lead details`;
      } else if (log.action === "EXPORT_PII") {
        message = `${actor} exported lead data CSV`;
      } else if (log.action === "UPDATE_LEAD") {
        const details = log.details as Record<string, unknown> | null;
        const nameStr = details?.name ? ` for '${details.name}'` : "";
        message = `${actor} updated lead info${nameStr}`;
      } else if (log.action === "SOFT_DELETE") {
        const details = log.details as Record<string, unknown> | null;
        const nameStr = details?.name ? ` '${details.name}'` : "";
        message = `${actor} soft-deleted lead${nameStr}`;
      } else if (log.action === "RESTORE_LEAD") {
        const details = log.details as Record<string, unknown> | null;
        const nameStr = details?.name ? ` '${details.name}'` : "";
        message = `${actor} restored lead${nameStr}`;
      } else if (log.action === "LOGIN") {
        message = `${actor} logged into the admin portal`;
      } else if (log.action === "CREATE") {
        const details = log.details as Record<string, unknown> | null;
        const titleStr = details?.title || details?.name || "";
        message = `${actor} created new ${log.entity.toLowerCase()} ${titleStr}`.trim();
      } else if (log.action === "UPDATE") {
        const details = log.details as Record<string, unknown> | null;
        const titleStr = details?.title || details?.name || "";
        message = `${actor} updated ${log.entity.toLowerCase()} ${titleStr}`.trim();
      } else if (log.action === "DELETE") {
        const details = log.details as Record<string, unknown> | null;
        const titleStr = details?.title || details?.name || "";
        message = `${actor} permanently deleted ${log.entity.toLowerCase()} ${titleStr}`.trim();
      }

      return {
        id: log.id,
        action: log.action,
        message,
        time: log.createdAt.toISOString(),
      };
    });

    return NextResponse.json({
      stats: {
        totalInquiries,
        totalBookings,
        totalBlogPosts,
        activeServices,
        inquiriesToday,
        inquiriesInProgress,
        winRate,
        countryBreakdown,
        sourceBreakdown,
      },
      activities,
    });
  } catch (error) {
    console.error("[Admin Stats API Error]:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard statistics" },
      { status: 500 }
    );
  }
}
