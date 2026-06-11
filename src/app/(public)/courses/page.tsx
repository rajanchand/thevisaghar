"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Languages, BookOpen, FileText, Monitor } from "lucide-react";
import { MOCK_SERVICES } from "@/lib/mock-data";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "languages": Languages,
  "book-open": BookOpen,
  "file-text": FileText,
  "monitor": Monitor,
};

export default function CoursesPage() {
  // Filter out non-class services if needed.
  // Services representing classes are Japanese Language (Japanese-language), IELTS Class (ielts-class), PTE Class (pte-class), Computer Class (computer-class).
  const classes = MOCK_SERVICES.filter(s => s.slug !== "student-visa");

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
              Preparation Classes & Languages
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Enhance Your Skills & Score High
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Our professional training classes and expert language courses help you meet global standard prerequisites.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Courses Details */}
      <section className="py-20 lg:py-28 bg-gray-50/50">
        <div className="section-container">
          <div className="space-y-12 lg:space-y-20">
            {classes.map((course, index) => {
              const IconComponent = iconMap[course.icon] || BookOpen;
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={course.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className={`flex flex-col lg:flex-row gap-8 lg:gap-12 items-center bg-white rounded-3xl p-8 lg:p-12 border border-gray-100 shadow-sm ${
                    isEven ? "" : "lg:flex-row-reverse"
                  }`}
                >
                  {/* Left (Visual Icon Block) */}
                  <div className="w-full lg:w-1/3 flex flex-col justify-center items-center p-8 bg-navy/5 rounded-2xl border border-navy/5">
                    <div className="w-24 h-24 rounded-full bg-gold/10 flex items-center justify-center text-gold mb-6 shadow-sm">
                      <IconComponent className="w-12 h-12" />
                    </div>
                    <h2 className="text-2xl font-bold text-navy text-center mb-2">
                      {course.title}
                    </h2>
                    <span className="px-3.5 py-1 bg-gold/20 text-navy font-bold text-xs rounded-full border border-gold/30">
                      Duration: {course.processingTime}
                    </span>
                  </div>

                  {/* Right (Content Block) */}
                  <div className="w-full lg:w-2/3 space-y-6">
                    <p className="text-gray-600 leading-relaxed">
                      {course.description}
                    </p>

                    <div>
                      <h3 className="font-bold text-navy text-sm uppercase tracking-wider mb-3">
                        Required Materials / Admission Requirements:
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {course.documentsRequired.map((doc, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm text-gray-500">
                            <CheckCircle2 size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{doc}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100 flex flex-wrap gap-4 items-center justify-between">
                      <div>
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">
                          Eligibility
                        </span>
                        <span className="text-sm font-semibold text-gray-600">
                          {course.eligibility}
                        </span>
                      </div>

                      <div className="flex gap-4">
                        <Link
                          href={`/services/${course.slug}`}
                          className="inline-flex items-center gap-2 border border-navy/20 hover:border-gold hover:bg-gold/5 text-navy font-bold px-5 py-3 rounded-xl transition-all text-sm"
                        >
                          More Details
                        </Link>
                        <Link
                          href="/book"
                          className="inline-flex items-center gap-2 bg-navy hover:bg-gold hover:text-navy text-white font-bold px-5 py-3 rounded-xl transition-all text-sm shadow-md"
                        >
                          Book Seat <ArrowRight size={16} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Booking CTA */}
      <section className="py-20 bg-off-white text-center">
        <div className="section-container max-w-xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold text-navy">New Batches Starting Every Monday</h2>
          <p className="text-gray-500">
            Secure your slot for the upcoming batch. Get study materials, mock practice accounts, and instructor support directly.
          </p>
          <div>
            <Link
              href="/book"
              className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-navy font-bold px-8 py-4 rounded-xl transition-all shadow-md"
            >
              Book Free Trial Class <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
