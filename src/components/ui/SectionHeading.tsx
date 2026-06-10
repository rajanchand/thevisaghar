"use client";

import React from "react";
import { motion } from "framer-motion";

interface SectionHeadingProps {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
}

export function SectionHeading({ badge, title, subtitle, align = "center", light = false }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`mb-12 ${align === "center" ? "text-center" : ""}`}
    >
      {badge && (
        <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 ${
          light
            ? "bg-white/10 text-gold border border-white/20"
            : "bg-gold/10 text-gold-dark border border-gold/20"
        }`}>
          {badge}
        </span>
      )}
      <h2 className={`text-3xl md:text-4xl lg:text-[2.75rem] font-bold leading-tight ${
        light ? "text-white" : "text-navy"
      }`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-lg max-w-2xl ${align === "center" ? "mx-auto" : ""} ${
          light ? "text-gray-300" : "text-gray-500"
        }`}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
