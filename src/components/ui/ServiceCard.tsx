"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Plane, Heart, Globe, MapPin, Languages, BookOpen, FileText, Monitor, type LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  briefcase: Briefcase,
  "graduation-cap": GraduationCap,
  plane: Plane,
  heart: Heart,
  globe: Globe,
  "map-pin": MapPin,
  languages: Languages,
  "book-open": BookOpen,
  "file-text": FileText,
  monitor: Monitor,
};

interface ServiceCardProps {
  title: string;
  description: string;
  icon: string;
  slug: string;
  index?: number;
}

export function ServiceCard({ title, description, icon, slug, index = 0 }: ServiceCardProps) {
  const Icon = iconMap[icon] || Briefcase;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/services/${slug}`} className="group block h-full">
        <div className="relative h-full bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
          {/* Gradient accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold to-gold-light transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

          {/* Icon */}
          <div className="w-14 h-14 rounded-xl bg-navy/5 group-hover:bg-gold/10 flex items-center justify-center mb-5 transition-colors duration-300">
            <Icon className="w-7 h-7 text-navy group-hover:text-gold transition-colors duration-300" />
          </div>

          {/* Content */}
          <h3 className="text-lg font-bold text-navy mb-3 group-hover:text-gold-dark transition-colors">
            {title}
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-4">
            {description}
          </p>

          {/* Arrow */}
          <div className="flex items-center gap-2 text-gold font-medium text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-8px] group-hover:translate-x-0">
            Learn More
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
