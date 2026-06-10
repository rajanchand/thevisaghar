"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 lg:py-28 bg-gradient-navy relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-5" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />

      <div className="section-container relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Start Your{" "}
            <span className="text-gradient">Visa Journey</span>?
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-10">
            Book a free consultation with our experts today. We&apos;ll assess your eligibility
            and create a personalized roadmap for your immigration goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/book"
              className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark text-navy font-bold text-lg px-10 py-4 rounded-xl transition-all duration-200 hover:shadow-gold transform hover:-translate-y-0.5"
            >
              Book Free Consultation
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-lg px-10 py-4 rounded-xl border border-white/20 transition-all duration-200 backdrop-blur-sm"
            >
              Contact Us
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
