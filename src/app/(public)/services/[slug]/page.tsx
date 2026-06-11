import React from "react";
import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import { ServiceDetailClient } from "./ServiceDetailClient";
import type { Metadata } from "next";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

// ─── Dynamic SEO Metadata ───────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const service = await prisma.service.findUnique({
    where: { slug: resolvedParams.slug, isActive: true },
  });

  if (!service) {
    return {
      title: "Service Not Found | The Visa Ghar",
    };
  }

  return {
    title: `${service.title} | The Visa Ghar`,
    description: service.shortDescription || service.description.slice(0, 155),
    openGraph: {
      title: `${service.title} | The Visa Ghar`,
      description: service.shortDescription || service.description.slice(0, 155),
      url: `https://thevisaghar.com/services/${service.slug}`,
      type: "website",
    },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const service = await prisma.service.findUnique({
    where: { slug: resolvedParams.slug, isActive: true },
  });

  if (!service) {
    notFound();
  }

  return <ServiceDetailClient service={service} />;
}
