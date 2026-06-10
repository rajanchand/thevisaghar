import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { blogPostSchema } from "@/lib/validations";
import { logAudit } from "@/lib/audit";

// GET all blog posts for administration
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("[Admin Blog GET Error]:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}

// POST create a new blog post
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = blogPostSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validatedData.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Check if slug is unique
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug: validatedData.data.slug },
    });

    if (existingPost) {
      return NextResponse.json(
        { error: "A blog post with this slug already exists" },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    const post = await prisma.blogPost.create({
      data: {
        ...validatedData.data,
        content: validatedData.data.content || {},
        authorId: userId,
        publishedAt: validatedData.data.published ? new Date() : null,
      },
    });

    // Audit log
    await logAudit({
      action: "CREATE",
      entity: "BlogPost",
      entityId: post.id,
      userId,
      details: { title: post.title, slug: post.slug, published: post.published },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("[Admin Blog POST Error]:", error);
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    );
  }
}
