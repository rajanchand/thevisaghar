import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Languages, BookOpen, FileText, Monitor } from "lucide-react";
import { services } from "../../../../data/services";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Language Classes & Exam Preparation | The Visa Ghar",
  description: "Join premier IELTS, PTE, Japanese Language, and computer training classes at Boudha, Kathmandu. Flexible slots and expert instructors.",
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "languages": Languages,
  "book-open": BookOpen,
  "file-text": FileText,
  "monitor": Monitor,
};

export default function CoursesPage() {
  // Filter out student-visa to only display training courses
  const classes = services.filter((s) => s.slug !== "student-visa");

  return (
    <>
      {/* ─── Hero Section ───────────────────────────────────────────── */}
      <section className="pt-32 pb-16 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-[0.02]" />
        <div className="section-container relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-accent text-sm font-semibold uppercase tracking-wider mb-4 border border-white/15">
            Training & Preparation Classes
          </span>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Enhance Your Language & Digital Skills
          </h1>
          <p
            className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Expert-led instruction, comprehensive study materials, and practical computer lab facilities in Kathmandu to help you meet international requirements.
          </p>
        </div>
      </section>

      {/* ─── Courses Showcase Grid ──────────────────────────────────── */}
      <section className="py-20 lg:py-28 bg-surface">
        <div className="section-container">
          <div className="space-y-12 lg:space-y-20">
            {classes.map((course, index) => {
              const IconComponent = iconMap[course.icon] || BookOpen;
              const isEven = index % 2 === 0;

              return (
                <div
                  key={course.slug}
                  className={`flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch bg-surface-raised rounded-3xl p-6 md:p-8 lg:p-12 border border-border-faint shadow-sm ${
                    isEven ? "" : "lg:flex-row-reverse"
                  }`}
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {/* Visual Left Block */}
                  <div className="w-full lg:w-1/3 flex flex-col justify-center items-center p-8 bg-surface-sunken rounded-2xl border border-border flex-shrink-0">
                    <div className="w-20 h-20 rounded-2xl bg-accent-muted flex items-center justify-center text-primary mb-6 shadow-sm">
                      <IconComponent className="w-10 h-10 text-accent-dark" />
                    </div>
                    <h2
                      className="text-2xl font-bold text-primary text-center mb-3 leading-tight"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {course.title}
                    </h2>
                    <span className="px-3.5 py-1 bg-surface-raised text-ink-light font-bold text-xs rounded-full border border-border shadow-xs">
                      Duration: {course.processingTime}
                    </span>
                  </div>

                  {/* Content Right Block */}
                  <div className="w-full lg:w-2/3 flex flex-col justify-between space-y-6">
                    <div>
                      <p className="text-ink-light leading-relaxed mb-6">
                        {course.description}
                      </p>

                      <div className="space-y-3">
                        <h3 className="font-bold text-primary text-xs uppercase tracking-wider">
                          What You Need / Intake Requirements:
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {course.documentsRequired.map((doc, i) => (
                            <div key={i} className="flex items-start gap-2.5 text-sm text-ink-muted">
                              <CheckCircle2 size={16} className="text-accent mt-0.5 flex-shrink-0" />
                              <span className="font-semibold">{doc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-border-faint flex flex-wrap gap-4 items-center justify-between">
                      <div>
                        <span className="text-[10px] text-ink-faint font-bold uppercase tracking-wider block">
                          Course Eligibility
                        </span>
                        <span className="text-sm font-bold text-ink-light">
                          {course.eligibility}
                        </span>
                      </div>

                      <div className="flex gap-3">
                        <Link
                          href={`/services/${course.slug}`}
                          className="inline-flex items-center gap-2 border border-border hover:border-accent hover:bg-accent-muted text-primary font-bold px-5 py-3 rounded-xl transition-all text-xs uppercase tracking-wider"
                        >
                          More Details
                        </Link>
                        <Link
                          href="/book"
                          className="inline-flex items-center gap-2 bg-primary hover:bg-accent hover:text-primary text-white font-bold px-5 py-3 rounded-xl transition-all text-xs uppercase tracking-wider shadow-sm"
                        >
                          Book Seat <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Batch Start CTA ────────────────────────────────────────── */}
      <section className="py-20 bg-surface-sunken border-t border-border-faint text-center">
        <div className="section-container max-w-xl mx-auto space-y-6" style={{ fontFamily: "var(--font-body)" }}>
          <h2
            className="text-3xl font-bold text-primary"
            style={{ fontFamily: "var(--font-display)" }}
          >
            New Classes Start Every Sunday & Monday
          </h2>
          <p className="text-ink-muted text-sm md:text-base leading-relaxed">
            Get comprehensive study materials, online mock test credentials, and regular evaluation practice under experienced faculty.
          </p>
          <div className="pt-2">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-primary font-bold px-8 py-4 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 shadow-accent"
            >
              Book 3-Day Free Trial <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
