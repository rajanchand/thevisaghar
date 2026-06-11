import { rateLimit, RATE_LIMITS, getClientIP } from "@/lib/rate-limit";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { blogPostSchema } from "@/lib/validations";
import { logAudit } from "@/lib/audit";

// PUT update a blog post by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const body = await request.json();
    const validatedData = blogPostSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validatedData.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Verify post exists
    const postExists = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!postExists) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    // Check slug uniqueness if changed
    if (validatedData.data.slug !== postExists.slug) {
      const slugConflict = await prisma.blogPost.findUnique({
        where: { slug: validatedData.data.slug },
      });
      if (slugConflict) {
        return NextResponse.json(
          { error: "Another blog post with this slug already exists" },
          { status: 400 }
        );
      }
    }

    // Determine publishedAt changes
    let publishedAt = postExists.publishedAt;
    if (validatedData.data.published && !postExists.published) {
      publishedAt = new Date();
    } else if (!validatedData.data.published) {
      publishedAt = null;
    }

    const updatedPost = await prisma.blogPost.update({
      where: { id },
      data: {
        ...validatedData.data,
        content: validatedData.data.content || {},
        publishedAt,
      },
    });

    // Audit log
    await logAudit({
      action: "UPDATE",
      entity: "BlogPost",
      entityId: id,
      userId: session.user.id,
      details: { title: updatedPost.title, slug: updatedPost.slug, published: updatedPost.published },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("[Admin Blog PUT Error]:", error);
    return NextResponse.json(
      { error: "Failed to update blog post" },
      { status: 500 }
    );
  }
}

// DELETE a blog post by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    // Verify post exists
    const post = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    await prisma.blogPost.delete({
      where: { id },
    });

    // Audit log
    await logAudit({
      action: "DELETE",
      entity: "BlogPost",
      entityId: id,
      userId: session.user.id,
      details: { title: post.title, slug: post.slug },
    });

    return NextResponse.json({ success: true, message: "Blog post deleted successfully" });
  } catch (error) {
    console.error("[Admin Blog DELETE Error]:", error);
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}
