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

    // Fetch counts
    const totalInquiries = await prisma.inquiry.count();
    const totalBookings = await prisma.booking.count();
    const totalBlogPosts = await prisma.blogPost.count();
    const activeServices = await prisma.service.count({
      where: { isActive: true },
    });

    // Fetch recent activities
    const recentInquiries = await prisma.inquiry.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
    });

    const recentBookings = await prisma.booking.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
    });

    const recentBlogs = await prisma.blogPost.findMany({
      take: 2,
      orderBy: { createdAt: "desc" },
    });

    // Format recent activities into a single timeline
    const activities = [
      ...recentInquiries.map((inq: any) => ({
        id: inq.id,
        type: "inquiry",
        message: `New inquiry from ${inq.name} for ${inq.visaType}`,
        time: inq.createdAt.toISOString(),
      })),
      ...recentBookings.map((book: any) => ({
        id: book.id,
        type: "booking",
        message: `Consultation booked by ${book.name} (${book.status})`,
        time: book.createdAt.toISOString(),
      })),
      ...recentBlogs.map((post: any) => ({
        id: post.id,
        type: "blog",
        message: `Blog post '${post.title}' created`,
        time: post.createdAt.toISOString(),
      })),
    ]
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 5);

    return NextResponse.json({
      stats: {
        totalInquiries,
        totalBookings,
        totalBlogPosts,
        activeServices,
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
