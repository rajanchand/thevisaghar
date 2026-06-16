"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, DollarSign, Clock, Globe } from "lucide-react";
import { countries } from "../../../../data/countries";

export default function CountriesPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-[0.02]" />
        <div className="section-container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-accent text-xs font-semibold uppercase tracking-[0.15em] mb-4 border border-white/15">
              Study Abroad Destinations
            </span>
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Choose Your Future Path
            </h1>
            <p
              className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed"
              style={{ fontFamily: "var(--font-body)" }}
            >
              We guide you through the complete admission and student visa processes for the world&apos;s most sought-after academic hubs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-20 lg:py-28 bg-surface-sunken">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            {countries.map((country, index) => (
              <motion.div
                key={country.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-surface-raised rounded-3xl p-8 md:p-10 border border-border-faint shadow-sm hover:shadow-md hover:border-accent/40 transition-all duration-300 flex flex-col justify-between"
                style={{ fontFamily: "var(--font-body)" }}
              >
                <div>
                  {/* Header info */}
                  <div className="flex items-center gap-5 mb-6">
                    <span className="text-5xl" role="img" aria-label={`${country.name} Flag`}>
                      {country.flag}
                    </span>
                    <div>
                      <h2
                        className="text-2xl font-bold text-primary"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {country.name}
                      </h2>
                      <p className="text-accent text-xs font-bold tracking-wide uppercase mt-0.5">
                        {country.tagline}
                      </p>
                    </div>
                  </div>

                  <p className="text-ink-muted text-sm leading-relaxed mb-8">
                    {country.description}
                  </p>

                  {/* Highlights */}
                  <div className="mb-8">
                    <h3
                      className="text-primary font-bold text-xs uppercase tracking-wider mb-4"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      Key Highlights
                    </h3>
                    <ul className="space-y-3">
                      {country.whyStudy.slice(0, 3).map((point, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-ink-light">
                          <CheckCircle2 size={16} className="text-accent mt-0.5 flex-shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  {/* Practical details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-border-faint bg-surface/40 rounded-2xl p-5 mb-8">
                    <div>
                      <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-1">
                        <DollarSign size={14} className="text-accent" /> Estimated Tuition
                      </div>
                      <p className="text-sm font-semibold text-ink-light">{country.costSummary}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-1">
                        <Clock size={14} className="text-accent" /> Stay-Back Rights
                      </div>
                      <p className="text-sm font-semibold text-ink-light">{country.postStudyWork}</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <Link
                      href={`/countries/${country.slug}`}
                      className="w-full sm:w-auto text-center border border-border-strong text-primary hover:text-accent-dark hover:border-accent-dark font-semibold text-sm px-6 py-3 rounded-xl transition-all"
                    >
                      Explore details
                    </Link>
                    <Link
                      href="/book"
                      className="w-full sm:w-auto text-center inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark text-primary font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-accent"
                    >
                      Apply Now <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust CTA */}
      <section className="py-20 bg-primary text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-[0.02]" />
        <div className="section-container relative z-10 max-w-2xl mx-auto space-y-6">
          <Globe className="w-12 h-12 text-accent mx-auto mb-4 animate-pulse" />
          <h2
            className="text-3xl md:text-4xl font-bold text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Unsure Which Destination Suits Your Profile?
          </h2>
          <p
            className="text-white/80 leading-relaxed text-base md:text-lg"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Our expert admissions team will review your qualifications, test scores, and budget to help you choose the ideal country and course.
          </p>
          <div className="pt-4" style={{ fontFamily: "var(--font-body)" }}>
            <Link
              href="/book"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-primary font-bold px-8 py-4 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 shadow-accent"
            >
              Book Profiling Consultation <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
