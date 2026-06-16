"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const statBadges = [
  {
    label: "15 Locations",
    color: "bg-primary text-white",
    position: "top-[10%] right-[5%]",
    delay: 0.8,
  },
  {
    label: "300+ Students on Full Scholarships",
    color: "bg-accent text-primary",
    position: "top-[32%] left-[-5%]",
    delay: 1.0,
  },
  {
    label: "10+ Years",
    color: "bg-primary text-white",
    position: "top-[55%] right-[-8%]",
    delay: 1.2,
  },
  {
    label: "97% Success Rate",
    color: "bg-primary text-white",
    position: "bottom-[18%] left-[-2%]",
    delay: 1.4,
  },
];

export function HeroSection() {
  return (
    <section className="relative min-h-[100vh] flex items-center overflow-hidden bg-gradient-to-br from-surface to-surface-sunken pt-[72px]">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, #0E3B2E 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />

      {/* Content Container */}
      <div className="relative z-10 section-container w-full py-16 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[calc(100vh-72px)]">
          
          {/* Left Column — Text Content */}
          <div className="order-2 lg:order-1">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-[3.5rem] xl:text-[4rem] font-extrabold leading-[1.1] mb-8 text-primary"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Study Abroad
              <br />
              Consultancy in{" "}
              <span className="text-accent">Nepal</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-[15px] md:text-base text-ink-muted max-w-md mb-10 leading-[1.8]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              The Visa Ghar helps Nepali students achieve their study abroad goals
              through expert counselling, student recruitment, university
              selection, application support, test preparation, and visa
              guidance. We work with leading universities in Australia,
              the UK, Canada, the USA, and New Zealand to help students
              access world-class education. With over 10 years of
              experience and a high visa success rate, The Visa Ghar
              provides trusted support from course selection to
              successful visa outcomes.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Link
                href="/book"
                className="group inline-flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-[0.15em] hover:text-accent-dark transition-all duration-300"
                style={{ fontFamily: "var(--font-body)" }}
              >
                GET FREE COUNSELLING
                <span className="flex items-center justify-center w-7 h-7 bg-accent rounded-full text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <ArrowRight size={14} />
                </span>
              </Link>
            </motion.div>
          </div>

          {/* Right Column — Student Image with Decorations */}
          <div className="order-1 lg:order-2 relative flex items-center justify-center">
            {/* Decorative circles */}
            <div className="relative w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] lg:w-[480px] lg:h-[480px] xl:w-[520px] xl:h-[520px]">
              
              {/* Outer dashed circle */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="absolute inset-0 rounded-full"
                style={{
                  border: '2px dashed rgba(14, 59, 46, 0.12)',
                }}
              />

              {/* Middle dashed circle */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="absolute inset-[12%] rounded-full"
                style={{
                  border: '2px dashed rgba(225, 161, 6, 0.15)',
                }}
              />

              {/* Inner solid circle (subtle) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="absolute inset-[24%] rounded-full bg-primary-muted/20"
                style={{
                  border: '1px solid rgba(14, 59, 46, 0.06)',
                }}
              />

              {/* Small decorative dots on circles */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute top-[28%] left-[2%] w-3 h-3 bg-primary rounded-full"
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
                className="absolute bottom-[22%] left-[8%] w-3 h-3 bg-accent rounded-full"
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="absolute top-[12%] right-[20%] w-2 h-2 bg-accent-light rounded-full"
              />

              {/* Student Image */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="absolute inset-0 flex items-end justify-center"
              >
                <div className="relative w-[75%] h-[85%]">
                  <Image
                    src="/images/hero-student.png"
                    alt="Happy student giving thumbs up"
                    fill
                    className="object-contain object-bottom drop-shadow-2xl"
                    priority
                    sizes="(max-width: 768px) 280px, (max-width: 1024px) 360px, 440px"
                  />
                </div>
              </motion.div>

              {/* Floating Stat Badges */}
              {statBadges.map((badge, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: badge.delay,
                    type: "spring",
                    stiffness: 200,
                  }}
                  className={`absolute ${badge.position} z-20`}
                >
                  <div
                    className={`${badge.color} px-4 py-2 rounded-full text-xs font-bold shadow-lg whitespace-nowrap`}
                    style={{
                      boxShadow: '0 4px 20px rgba(14, 59, 46, 0.15)',
                    }}
                  >
                    {badge.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp-style floating button hint */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, type: "spring" }}
        className="absolute bottom-8 right-8 z-20 hidden lg:flex items-center gap-2"
      >
        <span className="bg-success text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg border border-success-light/10">
          Talk with us!
        </span>
      </motion.div>
    </section>
  );
}
