"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { generateStarArray, getInitials } from "@/lib/utils";

interface TestimonialCardProps {
  clientName: string;
  clientPhoto?: string | null;
  visaType: string;
  rating: number;
  content: string;
}

export function TestimonialCard({ clientName, clientPhoto, visaType, rating, content }: TestimonialCardProps) {
  const stars = generateStarArray(rating);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-surface-raised rounded-2xl p-8 shadow-sm border border-border-faint hover:shadow-md transition-shadow duration-300 flex flex-col h-full"
      style={{ fontFamily: "var(--font-body)" }}
    >
      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {stars.map((filled, i) => (
          <Star
            key={i}
            size={18}
            className={filled ? "text-accent fill-accent" : "text-border"}
          />
        ))}
      </div>

      {/* Quote */}
      <blockquote className="text-ink-light text-sm leading-relaxed flex-1 mb-6">
        &ldquo;{content}&rdquo;
      </blockquote>

      {/* Client Info */}
      <div className="flex items-center gap-3 pt-4 border-t border-border-faint">
        {/* Avatar */}
        <div className="w-11 h-11 rounded-full bg-primary-muted flex items-center justify-center flex-shrink-0">
          {clientPhoto ? (
            <Image
              src={clientPhoto}
              alt={clientName}
              width={44}
              height={44}
              className="rounded-full object-cover"
              unoptimized
            />
          ) : (
            <span className="text-primary text-sm font-bold">{getInitials(clientName)}</span>
          )}
        </div>

        <div className="min-w-0">
          <p className="text-primary font-semibold text-sm truncate">{clientName}</p>
          <span className="inline-block px-2.5 py-0.5 bg-accent-muted text-accent-dark text-xs font-semibold rounded-full border border-accent/10 mt-0.5">
            {visaType}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
