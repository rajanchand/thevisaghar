"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Award, Users, Clock, Globe2 } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { TestimonialCard } from "@/components/ui/TestimonialCard";
import { BlogCard } from "@/components/ui/BlogCard";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { CTASection } from "@/components/home/CTASection";

// Direct imports from data layer files
import { countries } from "../../../data/countries";
import { services } from "../../../data/services";
import { testimonials } from "../../../data/testimonials";
import { blogPosts } from "../../../data/blog-posts";

export default function HomePage() {
  // Asymmetric grouping of destinations
  const featuredCountries = countries.filter(
    (c) => c.slug === "uk" || c.slug === "australia"
  );
  const secondaryCountries = countries.filter(
    (c) => c.slug !== "uk" && c.slug !== "australia"
  );

  return (
    <>
      {/* ─── Hero ──────────────────────────────────────────────────── */}
      <HeroSection />

      {/* ─── Services ──────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 bg-surface-sunken" id="services">
        <div className="section-container">
          <SectionHeading
            badge="Our Services"
            title="Expert Guidance at Every Stage"
            subtitle="From university admission support to English test preparation and visa processing — we cover it all."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {services.map((service, index) => (
              <ServiceCard
                key={service.slug}
                title={service.title}
                description={service.shortDescription}
                icon={service.icon}
                slug={service.slug}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Countries Showcase ────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 bg-surface" id="countries">
        <div className="section-container">
          <SectionHeading
            badge="Study Abroad"
            title="Explore Your Study Destinations"
            subtitle="We offer complete admission and student visa guidance for top global study destinations."
          />

          {/* Featured Destinations (Asymmetric Grid) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {featuredCountries.map((country) => (
              <div
                key={country.slug}
                className="group relative bg-surface-raised rounded-3xl p-8 lg:p-10 border border-border-faint shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3.5 mb-5">
                    <span className="text-4xl" role="img" aria-label={`${country.name} flag`}>
                      {country.flag}
                    </span>
                    <div>
                      <h3
                        className="text-2xl font-bold text-primary"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {country.name}
                      </h3>
                      <p className="text-accent text-xs font-semibold uppercase tracking-[0.12em]">
                        {country.tagline}
                      </p>
                    </div>
                  </div>

                  <p
                    className="text-ink-muted text-[14px] leading-relaxed mb-6"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {country.description}
                  </p>

                  <div className="space-y-3 mb-8">
                    <h4
                      className="text-xs font-bold uppercase tracking-wider text-primary"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      Why Study in {country.name}:
                    </h4>
                    <ul
                      className="space-y-2 text-sm text-ink-light"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {country.whyStudy.slice(0, 3).map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span className="text-accent mt-0.5 font-bold">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <div
                    className="flex flex-wrap gap-x-8 gap-y-3 border-t border-border-faint pt-5 text-sm mb-6"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    <div>
                      <span className="text-ink-faint block text-xs uppercase tracking-wider mb-0.5">
                        Est. Tuition
                      </span>
                      <span className="font-semibold text-primary">
                        {country.costSummary.split(" (")[0]}
                      </span>
                    </div>
                    <div>
                      <span className="text-ink-faint block text-xs uppercase tracking-wider mb-0.5">
                        Post-Study Work
                      </span>
                      <span className="font-semibold text-primary">
                        {country.postStudyWork.split(" (")[0].split(" visa")[0]}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/countries/${country.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-bold text-primary group-hover:text-accent-dark transition-colors"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Explore Destination
                    <ArrowRight
                      size={14}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Secondary Destinations */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {secondaryCountries.map((country) => (
              <div
                key={country.slug}
                className="group bg-surface-raised rounded-2xl p-6 border border-border-faint shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3.5">
                    <span className="text-3xl" role="img" aria-label={`${country.name} flag`}>
                      {country.flag}
                    </span>
                    <div>
                      <h4
                        className="text-lg font-bold text-primary"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {country.name}
                      </h4>
                      <p
                        className="text-accent text-[10px] font-semibold uppercase tracking-wider"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {country.costSummary.split(" (")[0]}
                      </p>
                    </div>
                  </div>
                  <p
                    className="text-ink-muted text-xs leading-relaxed mb-4 line-clamp-2"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {country.description}
                  </p>
                </div>
                <div className="border-t border-border-faint pt-4 mt-2">
                  <Link
                    href={`/countries/${country.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary group-hover:text-accent-dark transition-colors"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Learn More
                    <ArrowRight
                      size={12}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Stats / Why Choose Us ─────────────────────────────────── */}
      <section className="py-20 lg:py-28 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-[0.02]" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-muted rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-muted rounded-full blur-3xl" />

        <div className="section-container relative z-10">
          <SectionHeading
            badge="Why Choose Us"
            title="Trusted by Thousands of Nepali Students"
            subtitle="Our track record speaks for itself. Here is why students choose The Visa Ghar for their international education journey."
            light
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 mt-16">
            <AnimatedCounter
              end={98}
              suffix="%"
              label="Success Rate"
              icon={<Award className="w-8 h-8" />}
            />
            <AnimatedCounter
              end={2000}
              suffix="+"
              label="Happy Students"
              icon={<Users className="w-8 h-8" />}
            />
            <AnimatedCounter
              end={10}
              suffix="+"
              label="Years Experience"
              icon={<Clock className="w-8 h-8" />}
            />
            <AnimatedCounter
              end={15}
              suffix="+"
              label="Countries Covered"
              icon={<Globe2 className="w-8 h-8" />}
            />
          </div>
        </div>
      </section>

      {/* ─── How It Works ──────────────────────────────────────────── */}
      <HowItWorksSection />

      {/* ─── Testimonials ──────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 bg-surface-sunken" id="testimonials">
        <div className="section-container">
          <SectionHeading
            badge="Student Stories"
            title="What Our Students Say"
            subtitle="Real experiences from Nepali students who achieved their study abroad goals with The Visa Ghar."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                clientName={testimonial.clientName}
                clientPhoto={testimonial.clientPhoto}
                visaType={`${testimonial.country} ${testimonial.visaType}`}
                rating={testimonial.rating}
                content={testimonial.content}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Latest Blog ───────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 bg-surface" id="blog">
        <div className="section-container">
          <SectionHeading
            badge="Resources & News"
            title="Latest Study Abroad Guides"
            subtitle="Stay informed with expert advice, immigration updates, and preparation tips from our team."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {blogPosts.map((post, index) => (
              <BlogCard
                key={post.slug}
                title={post.title}
                slug={post.slug}
                excerpt={post.excerpt}
                featuredImage={post.featuredImage}
                category={post.category}
                publishedAt={post.publishedAt}
                index={index}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-primary hover:text-accent-dark font-semibold transition-colors"
              style={{ fontFamily: "var(--font-body)" }}
            >
              View All Articles
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── CTA ───────────────────────────────────────────────────── */}
      <CTASection />
    </>
  );
}
