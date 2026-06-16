"use client";

import React, { useState } from "react";
import { testimonials } from "../../../../data/testimonials";
import { getInitials } from "@/lib/utils";
import { Star, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function SuccessStoriesPage() {
  const [selectedCountry, setSelectedCountry] = useState("All");

  // Dynamically extract all countries represented in testimonials
  const countries = ["All", ...Array.from(new Set(testimonials.map((t) => t.country)))];

  const filteredTestimonials =
    selectedCountry === "All"
      ? testimonials
      : testimonials.filter((t) => t.country === selectedCountry);

  return (
    <>
      {/* ─── Hero Section ───────────────────────────────────────────── */}
      <section className="pt-32 pb-16 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-[0.02]" />
        <div className="section-container relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-accent text-sm font-semibold uppercase tracking-wider mb-4 border border-white/15">
            Success Stories
          </span>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Real Results, Honest Journeys
          </h1>
          <p
            className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Read reviews from Nepali students and couples who navigated the university admission and visa application process successfully with us.
          </p>
        </div>
      </section>

      {/* ─── Filter Tabs Bar ────────────────────────────────────────── */}
      <section className="py-6 border-b border-border-faint sticky top-[72px] bg-surface/95 backdrop-blur-md z-40">
        <div className="section-container flex items-center justify-center gap-2 flex-wrap">
          {countries.map((country) => (
            <button
              key={country}
              onClick={() => setSelectedCountry(country)}
              className={`px-4.5 py-2 rounded-xl text-xs uppercase tracking-wider font-bold transition-all ${
                selectedCountry === country
                  ? "bg-primary text-accent shadow-sm"
                  : "bg-surface-sunken text-ink-light hover:bg-border/40 border border-border-faint"
              }`}
              style={{ fontFamily: "var(--font-body)" }}
            >
              {country === "All" ? "All Stories" : `Study in ${country}`}
            </button>
          ))}
        </div>
      </section>

      {/* ─── Testimonials Grid ──────────────────────────────────────── */}
      <section className="py-16 bg-surface min-h-[400px]">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
            {filteredTestimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-surface-raised border border-border-faint rounded-3xl p-8 shadow-sm flex flex-col justify-between"
                style={{ fontFamily: "var(--font-body)" }}
              >
                <div>
                  {/* Rating & Location Tag */}
                  <div className="flex items-center justify-between gap-4 mb-5 pb-5 border-b border-border-faint">
                    <div className="flex gap-0.5 text-accent">
                      {Array.from({ length: testimonial.rating }).map((_, starIdx) => (
                        <Star key={starIdx} size={16} fill="currentColor" className="text-accent" />
                      ))}
                    </div>
                    <span className="inline-block px-3 py-1 bg-surface-sunken rounded-lg text-xs font-bold text-accent-dark border border-border-faint">
                      {testimonial.country} — {testimonial.visaType}
                    </span>
                  </div>

                  {/* Comment */}
                  <p className="text-ink-light text-sm leading-relaxed italic mb-8">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                </div>

                {/* Client Profile */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-base shadow-sm border border-white/5">
                    {getInitials(testimonial.clientName)}
                  </div>
                  <div>
                    <h3
                      className="font-bold text-primary text-base leading-snug"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {testimonial.clientName}
                    </h3>
                    <span className="text-ink-faint text-xs font-semibold">
                      Successful Visa Applicant
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Start Your Journey CTA ─────────────────────────────────── */}
      <section className="py-20 bg-surface-sunken border-t border-border-faint text-center">
        <div className="section-container max-w-xl mx-auto space-y-6" style={{ fontFamily: "var(--font-body)" }}>
          <h2
            className="text-2xl md:text-3xl font-bold text-primary"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Ready to Begin Your Success Story?
          </h2>
          <p className="text-ink-muted text-sm md:text-base leading-relaxed">
            Get personalized, transparent visa counseling from certified experts. Our track record is built on honest guidance, one-on-one.
          </p>
          <div className="pt-2">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-primary font-bold px-8 py-4 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 shadow-accent text-sm uppercase tracking-wider"
            >
              Book Free Appointment <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
