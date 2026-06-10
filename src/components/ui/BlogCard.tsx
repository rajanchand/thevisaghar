"use client";

import React from "react";
import Link from "next/link";
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
        <article className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
          {/* Image */}
          <div className="relative h-48 bg-gradient-to-br from-navy/10 to-navy/5 overflow-hidden">
            {featuredImage ? (
              <img
                src={featuredImage}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-navy to-navy-light flex items-center justify-center">
                <span className="text-gold/40 text-6xl font-bold">{title.charAt(0)}</span>
              </div>
            )}
            {/* Category Badge */}
            <span className="absolute top-4 left-4 px-3 py-1 bg-gold text-navy text-xs font-semibold rounded-full">
              {category}
            </span>
          </div>

          {/* Content */}
          <div className="p-6 flex-1 flex flex-col">
            {/* Date */}
            {publishedAt && (
              <div className="flex items-center gap-2 text-gray-400 text-xs mb-3">
                <Calendar size={14} />
                {formatDate(publishedAt)}
              </div>
            )}

            <h3 className="text-navy font-bold text-lg mb-3 group-hover:text-gold-dark transition-colors line-clamp-2">
              {title}
            </h3>

            {excerpt && (
              <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-4">
                {truncate(excerpt, 120)}
              </p>
            )}

            <div className="flex items-center gap-2 text-gold font-medium text-sm mt-auto">
              Read More
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
