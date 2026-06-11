import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import { BlogPostClient } from "./BlogPostClient";
import type { Metadata } from "next";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

// ─── Dynamic SEO Metadata ───────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug: resolvedParams.slug, published: true },
  });

  if (!post) {
    return {
      title: "Article Not Found | The Visa Ghar",
    };
  }

  return {
    title: `${post.title} | The Visa Ghar`,
    description: post.excerpt || `${post.title} - Read the latest immigration guides and study abroad insights from The Visa Ghar.`,
    openGraph: {
      title: `${post.title} | The Visa Ghar`,
      description: post.excerpt || `${post.title} - Read the latest immigration guides and study abroad insights from The Visa Ghar.`,
      url: `https://thevisaghar.com/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const resolvedParams = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug: resolvedParams.slug, published: true },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!post) {
    notFound();
  }

  return <BlogPostClient post={post} />;
}
