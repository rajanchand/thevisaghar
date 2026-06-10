"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, DollarSign, Clock, Globe } from "lucide-react";
import { MOCK_COUNTRIES } from "@/lib/mock-data";

export default function CountriesPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-navy relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-5" />
        <div className="section-container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-gold text-sm font-medium mb-4 border border-white/15">
              Study Abroad Destinations
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Choose Your Future Path
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              We guide you through the complete admission and student visa processes for the world's most sought-after academic hubs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-20 lg:py-28 bg-gray-50/50">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {MOCK_COUNTRIES.map((country, index) => (
              <motion.div
                key={country.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Header info */}
                <div className="flex items-center gap-5 mb-6">
                  <span className="text-5xl" role="img" aria-label={`${country.name} Flag`}>
                    {country.flagUrl}
                  </span>
                  <div>
                    <h2 className="text-2xl font-bold text-navy">{country.name}</h2>
                    <p className="text-gold text-sm font-semibold tracking-wide uppercase">
                      {country.tagline}
                    </p>
                  </div>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed mb-8">
                  {country.description}
                </p>

                {/* Highlights */}
                <div className="mb-8">
                  <h3 className="text-navy font-bold text-sm uppercase tracking-wider mb-4">
                    Key Highlights
                  </h3>
                  <ul className="space-y-2.5">
                    {country.whyChoose.map((point, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-500">
                        <CheckCircle2 size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="font-medium">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Practical details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-gray-100 bg-gray-50/50 rounded-2xl p-5">
                  <div>
                    <div className="flex items-center gap-2 text-navy font-bold text-xs uppercase tracking-wider mb-1">
                      <DollarSign size={14} className="text-gold" /> Estimated Tuition
                    </div>
                    <p className="text-sm font-semibold text-gray-600">{country.costs}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-navy font-bold text-xs uppercase tracking-wider mb-1">
                      <Clock size={14} className="text-gold" /> Part-Time Work Rights
                    </div>
                    <p className="text-sm font-semibold text-gray-600">{country.workPermit}</p>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <Link
                    href="/book"
                    className="inline-flex items-center gap-2 bg-navy hover:bg-gold hover:text-navy text-white font-bold px-6 py-3 rounded-xl transition-all text-sm"
                  >
                    Apply for {country.name} <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust CTA */}
      <section className="py-20 bg-gradient-navy text-white text-center relative overflow-hidden">
        <div className="section-container relative z-10 max-w-2xl mx-auto space-y-6">
          <Globe className="w-12 h-12 text-gold mx-auto mb-4 animate-pulse" />
          <h2 className="text-3xl font-bold">Unsure Which Destination Suits Your Profile?</h2>
          <p className="text-gray-300 leading-relaxed">
            Our expert admissions team will review your qualifications, test scores, and budget to help you choose the ideal country and course.
          </p>
          <div className="pt-4">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-navy font-bold px-8 py-4 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Book Profiling Consultation <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
