"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import { formatDate, truncate } from "@/lib/utils";

interface BlogCardProps {
  title: string;
  slug: string;
  excerpt?: string | null;
  featuredImage?: string | null;
  category: string;
  publishedAt?: Date | string | null;
  index?: number;
}

export function BlogCard({ title, slug, excerpt, featuredImage, category, publishedAt, index = 0 }: BlogCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/blog/${slug}`} className="group block h-full">
        <article
          className="bg-surface-raised rounded-2xl overflow-hidden border border-border-faint shadow-sm hover:shadow-md hover:border-accent transition-all duration-300 hover:-translate-y-1 h-full flex flex-col"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {/* Image */}
          <div className="relative h-48 bg-primary-muted overflow-hidden">
            {featuredImage ? (
              <Image
                src={featuredImage}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                unoptimized
              />
            ) : (
              <div className="w-full h-full bg-primary flex items-center justify-center">
                <span className="text-accent-light/25 text-6xl font-bold font-serif">{title.charAt(0)}</span>
              </div>
            )}
            {/* Category Badge */}
            <span className="absolute top-4 left-4 px-3 py-1 bg-accent text-primary text-xs font-bold rounded-full shadow-sm">
              {category}
            </span>
          </div>

          {/* Content */}
          <div className="p-6 flex-1 flex flex-col">
            {/* Date */}
            {publishedAt && (
              <div className="flex items-center gap-2 text-ink-faint text-xs mb-3">
                <Calendar size={14} />
                {formatDate(publishedAt)}
              </div>
            )}

            <h3
              className="text-primary font-bold text-lg mb-3 group-hover:text-accent-dark transition-colors line-clamp-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {title}
            </h3>

            {excerpt && (
              <p className="text-ink-muted text-sm leading-relaxed flex-1 mb-4">
                {truncate(excerpt, 120)}
              </p>
            )}

            <div className="flex items-center gap-2 text-accent-dark font-semibold text-sm mt-auto">
              Read More
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
