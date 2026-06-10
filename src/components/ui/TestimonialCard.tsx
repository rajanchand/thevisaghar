"use client";

import React from "react";
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
      className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
    >
      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {stars.map((filled, i) => (
          <Star
            key={i}
            size={18}
            className={filled ? "text-gold fill-gold" : "text-gray-200"}
          />
        ))}
      </div>

      {/* Quote */}
      <blockquote className="text-gray-600 text-sm leading-relaxed flex-1 mb-6">
        &ldquo;{content}&rdquo;
      </blockquote>

      {/* Client Info */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
        {/* Avatar */}
        <div className="w-11 h-11 rounded-full bg-navy flex items-center justify-center flex-shrink-0">
          {clientPhoto ? (
            <img
              src={clientPhoto}
              alt={clientName}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-gold text-sm font-bold">{getInitials(clientName)}</span>
          )}
        </div>

        <div className="min-w-0">
          <p className="text-navy font-semibold text-sm truncate">{clientName}</p>
          <span className="inline-block px-2 py-0.5 bg-gold/10 text-gold-dark text-xs font-medium rounded-full mt-0.5">
            {visaType}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
