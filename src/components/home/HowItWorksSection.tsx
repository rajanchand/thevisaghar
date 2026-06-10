"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, FileCheck, CheckCircle2, Send, ThumbsUp } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const processSteps = [
  {
    icon: <FileCheck className="w-7 h-7" />,
    title: "Free Consultation",
    description: "Book a free session with our experts to discuss your visa options and eligibility.",
  },
  {
    icon: <CheckCircle2 className="w-7 h-7" />,
    title: "Document Review",
    description: "We review your documents, identify gaps, and prepare a complete application package.",
  },
  {
    icon: <Send className="w-7 h-7" />,
    title: "Application Filing",
    description: "We file your application with precision, ensuring every detail meets the requirements.",
  },
  {
    icon: <ThumbsUp className="w-7 h-7" />,
    title: "Visa Approval",
    description: "Track your application and receive expert support until your visa is approved.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 lg:py-28" id="process">
      <div className="section-container">
        <SectionHeading
          badge="How It Works"
          title="Your Path to Visa Success"
          subtitle="Our streamlined 4-step process makes your visa application journey smooth and stress-free."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {processSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative text-center"
            >
              {/* Connector Line (desktop) */}
              {index < processSteps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-gold/30 to-gold/10" />
              )}

              {/* Step Number + Icon */}
              <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-navy/5 mb-6 group hover:bg-gold/10 transition-colors duration-300">
                <div className="text-navy group-hover:text-gold transition-colors">
                  {step.icon}
                </div>
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gold text-navy text-xs font-bold flex items-center justify-center shadow-gold">
                  {index + 1}
                </span>
              </div>

              <h3 className="text-navy font-bold text-lg mb-3">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-14"
        >
          <Link
            href="/book"
            className="inline-flex items-center gap-2 bg-navy hover:bg-navy-light text-white font-semibold text-base px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Start Your Journey
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
