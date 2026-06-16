"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 lg:py-28 bg-primary relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-[0.02]" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-muted rounded-full blur-3xl" />

      <div className="section-container relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Ready to Start Your{" "}
            <span className="text-accent">Visa Journey</span>?
          </h2>
          <p
            className="text-white/80 text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Book a free consultation with our experts today. We&apos;ll assess your eligibility
            and create a personalized roadmap for your immigration goals.
          </p>
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <Link
              href="/book"
              className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark text-primary font-bold text-lg px-10 py-4 rounded-xl transition-all duration-200 hover:shadow-accent transform hover:-translate-y-0.5"
            >
              Book Free Consultation
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold text-lg px-10 py-4 rounded-xl border border-white/20 transition-all duration-200 backdrop-blur-sm"
            >
              Contact Us
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
