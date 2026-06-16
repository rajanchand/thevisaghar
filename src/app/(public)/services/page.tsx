import React from "react";
import Link from "next/link";
import { ArrowRight, Briefcase, GraduationCap, BookOpen, FileText, Languages, Monitor } from "lucide-react";
import { services } from "../../../../data/services";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services & Training Programs | The Visa Ghar",
  description: "Comprehensive education consultancy and language courses in Kathmandu. Secure your visa and excel in IELTS, PTE, or Japanese.",
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "graduation-cap": GraduationCap,
  "book-open": BookOpen,
  "file-text": FileText,
  "languages": Languages,
  "monitor": Monitor,
};

export default function ServicesPage() {
  return (
    <>
      {/* ─── Hero Section ───────────────────────────────────────────── */}
      <section className="pt-32 pb-16 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-[0.02]" />
        <div className="section-container relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-accent text-sm font-semibold uppercase tracking-wider mb-4 border border-white/15">
              Professional Catalog
            </span>
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Our Consultancy & Training Services
            </h1>
            <p
              className="text-white/80 text-lg md:text-xl leading-relaxed max-w-2xl"
              style={{ fontFamily: "var(--font-body)" }}
            >
              From university admission and visa documentation to expert language and test preparation classes, we provide honest, personalized guidance every step of the way.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Services Grid ──────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 bg-surface">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {services.map((service, index) => {
              const IconComponent = iconMap[service.icon] || Briefcase;
              const isLead = index === 0; // Highlight first service (Student Visa) slightly differently

              return (
                <div
                  key={service.slug}
                  className={`bg-surface-raised rounded-3xl p-8 lg:p-10 border border-border-faint shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between ${
                    isLead ? "md:col-span-2 border-accent/20" : ""
                  }`}
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-6 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-accent-muted flex items-center justify-center flex-shrink-0 text-primary">
                        <IconComponent className="w-7 h-7 text-accent-dark" />
                      </div>
                      <span className="px-3.5 py-1 bg-surface-sunken text-ink-light text-xs font-bold rounded-full border border-border">
                        Duration: {service.processingTime}
                      </span>
                    </div>

                    {/* Content */}
                    <h3
                      className={`font-bold text-primary mb-3 leading-tight ${
                        isLead ? "text-2xl md:text-3xl" : "text-xl"
                      }`}
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {service.title}
                    </h3>
                    <p className="text-ink-muted text-sm md:text-base leading-relaxed mb-6">
                      {service.description}
                    </p>

                    {/* Quick highlights */}
                    <div className="space-y-2 mb-8">
                      <span className="text-xs uppercase tracking-wider text-ink-faint font-semibold block">
                        Requirements Snapshot
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {service.documentsRequired.slice(0, 3).map((doc, docIdx) => (
                          <span
                            key={docIdx}
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-sunken rounded-lg text-xs font-semibold text-ink-light border border-border-faint"
                          >
                            <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                            {doc}
                          </span>
                        ))}
                        {service.documentsRequired.length > 3 && (
                          <span className="px-3 py-1 bg-surface-sunken text-ink-faint text-xs font-semibold rounded-lg border border-border-faint">
                            +{service.documentsRequired.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-6 border-t border-border-faint flex flex-wrap items-center justify-between gap-4">
                    <div className="text-sm">
                      <span className="text-ink-faint font-medium">Fee: </span>
                      <span className="font-bold text-accent-dark">{service.price}</span>
                    </div>
                    <div className="flex gap-3">
                      <Link
                        href={`/services/${service.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-accent-dark font-bold hover:underline py-2"
                      >
                        Explore Details <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── General Consultation CTA ─────────────────────────────────── */}
      <section className="py-16 bg-surface-sunken border-t border-border-faint text-center">
        <div className="section-container max-w-xl mx-auto space-y-6" style={{ fontFamily: "var(--font-body)" }}>
          <h2
            className="text-2xl md:text-3xl font-bold text-primary"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Not Sure Which Program is Right for You?
          </h2>
          <p className="text-ink-muted text-sm md:text-base leading-relaxed">
            Schedule a free, one-on-one consultation with Rajan Chand or our senior counseling team. We will help match your academic goals with the best-fit country or course.
          </p>
          <div className="pt-2">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-primary font-bold px-8 py-4 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 shadow-accent"
            >
              Book Consultation Session <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
