"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  GraduationCap,
  Plane,
  Heart,
  Globe,
  MapPin,
  RefreshCw,
  Languages,
  BookOpen,
  FileText,
  Monitor,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  briefcase: Briefcase,
  "graduation-cap": GraduationCap,
  plane: Plane,
  heart: Heart,
  globe2: Globe,
  award: Globe,
  shield: Globe,
  users: MapPin,
  languages: Languages,
  "book-open": BookOpen,
  "file-text": FileText,
  monitor: Monitor,
};

interface Service {
  title: string;
  slug: string;
  shortDescription?: string;
  icon: string;
  price?: string;
  processingTime?: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/services");
        if (res.ok) {
          const data = await res.json();
          setServices(data);
        }
      } catch (error) {
        console.error("Failed to fetch public services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-navy relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-5" />
        <div className="section-container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-gold text-sm font-medium mb-4 border border-white/15">
              What We Offer
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our Visa Services
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Comprehensive immigration solutions tailored for Nepali clients seeking opportunities abroad.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 lg:py-28 min-h-[400px]">
        <div className="section-container">
          {loading ? (
            <div className="text-center py-12 text-gray-400 space-y-3">
              <RefreshCw className="animate-spin mx-auto text-gold" size={32} />
              <p className="text-sm">Loading visa services catalog...</p>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Briefcase className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-lg font-bold text-navy">No visa services configured</p>
              <p className="text-sm mt-1">Please check back later or contact us directly.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {services.map((service, index) => {
                const Icon = iconMap[service.icon] || Briefcase;
                return (
                  <motion.div
                    key={service.slug}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link href={`/services/${service.slug}`} className="group block">
                      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        <div className="flex items-start gap-6">
                          <div className="w-16 h-16 rounded-xl bg-navy/5 group-hover:bg-gold/10 flex items-center justify-center flex-shrink-0 transition-colors">
                            <Icon className="w-8 h-8 text-navy group-hover:text-gold transition-colors" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold text-navy mb-2 group-hover:text-gold transition-colors">
                              {service.title}
                            </h3>
                            <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
                              {service.shortDescription || "No short description provided."}
                            </p>
                            <div className="flex flex-wrap items-center gap-4 text-sm">
                              <span className="px-3 py-1 bg-gold/10 text-navy font-semibold rounded-full border border-gold/25">
                                {service.price || "Contact Us"}
                              </span>
                              {service.processingTime && (
                                <span className="text-gray-400">
                                  Processing: {service.processingTime}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-gold font-medium text-sm mt-4 opacity-0 group-hover:opacity-100 transition-all">
                              View Details <ArrowRight size={14} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-off-white">
        <div className="section-container text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-navy mb-4">
            Not Sure Which Visa Is Right for You?
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto mb-8">
            Book a free consultation and our experts will assess your eligibility and recommend the best visa option.
          </p>
          <Link
            href="/book"
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-navy font-bold px-8 py-4 rounded-xl transition-all hover:shadow-gold hover:-translate-y-0.5"
          >
            Book Free Consultation
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
