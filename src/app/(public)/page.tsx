export const dynamic = "force-dynamic";

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
import prisma from "@/lib/db";
import {
  MOCK_SERVICES,
  MOCK_TESTIMONIALS,
  MOCK_BLOG_POSTS,
  MOCK_COUNTRIES,
  type ServiceSummary,
  type TestimonialSummary,
  type BlogPostSummary,
} from "@/lib/mock-data";

export default async function HomePage() {
  let services: ServiceSummary[] = [];
  let testimonials: TestimonialSummary[] = [];
  let blogPosts: BlogPostSummary[] = [];

  try {
    const [dbServices, dbTestimonials, dbBlogPosts] = await Promise.all([
      prisma.service.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
        take: 6,
        select: { title: true, shortDescription: true, icon: true, slug: true, price: true, processingTime: true },
      }),
      prisma.testimonial.findMany({
        where: { isApproved: true },
        orderBy: { createdAt: "desc" },
        take: 3,
        select: { clientName: true, clientPhoto: true, visaType: true, rating: true, content: true },
      }),
      prisma.blogPost.findMany({
        where: { published: true },
        orderBy: { publishedAt: "desc" },
        take: 3,
        select: { title: true, slug: true, excerpt: true, featuredImage: true, category: true, publishedAt: true },
      }),
    ]);

    // Handle database entries check
    services = dbServices.length > 0 
      ? dbServices.map(s => ({
          title: s.title,
          slug: s.slug,
          shortDescription: s.shortDescription ?? "",
          icon: s.icon,
          price: s.price ?? "Contact Us",
          processingTime: s.processingTime ?? "4-12 weeks",
        })) 
      : MOCK_SERVICES;

    testimonials = dbTestimonials.length > 0 ? dbTestimonials : MOCK_TESTIMONIALS;

    blogPosts = dbBlogPosts.length > 0 
      ? dbBlogPosts.map(p => ({
          title: p.title,
          slug: p.slug,
          excerpt: p.excerpt ?? "",
          featuredImage: p.featuredImage,
          category: p.category,
          publishedAt: p.publishedAt ?? new Date(),
        })) 
      : MOCK_BLOG_POSTS;
  } catch {
    console.warn("Database offline during home page build, falling back to mock data.");
    services = MOCK_SERVICES;
    testimonials = MOCK_TESTIMONIALS;
    blogPosts = MOCK_BLOG_POSTS;
  }

  return (
    <>
      {/* ─── Hero ──────────────────────────────────────────────────── */}
      <HeroSection />

      {/* ─── Services ──────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 bg-gray-50" id="services">
        <div className="section-container">
          <SectionHeading
            badge="Our Services"
            title="Expert Visa Solutions for Every Need"
            subtitle="From work permits to permanent residency, we provide comprehensive immigration services tailored to your goals."
          />

          {services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {services.map((service: ServiceSummary, index: number) => (
                <ServiceCard
                  key={service.slug}
                  title={service.title}
                  description={service.shortDescription ?? ""}
                  icon={service.icon}
                  slug={service.slug}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-12">Our services are coming soon. Please check back shortly.</p>
          )}
        </div>
      </section>

      {/* ─── Countries Showcase ────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 bg-white" id="countries">
        <div className="section-container">
          <SectionHeading
            badge="Study Abroad"
            title="Explore Your Study Destinations"
            subtitle="We offer complete admission and student visa guidance for top global study destinations."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-12">
            {MOCK_COUNTRIES.map((country) => (
              <div
                key={country.name}
                className="group relative bg-off-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fadeIn"
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-4xl" role="img" aria-label={`${country.name} flag`}>
                    {country.flagUrl}
                  </span>
                  <div>
                    <h3 className="text-xl font-bold text-navy group-hover:text-gold transition-colors">
                      {country.name}
                    </h3>
                    <p className="text-gold text-xs font-semibold uppercase tracking-wider">
                      {country.tagline}
                    </p>
                  </div>
                </div>

                <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
                  {country.description}
                </p>

                <div className="space-y-3 pt-4 border-t border-gray-100 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span className="font-semibold text-navy">Est. Cost:</span>
                    <span>{country.costs}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-navy">Work Rights:</span>
                    <span>{country.workPermit}</span>
                  </div>
                </div>

                <div className="mt-6">
                  <Link
                    href={`/countries`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-navy group-hover:text-gold transition-colors font-sans"
                  >
                    Learn More <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Stats / Why Choose Us ─────────────────────────────────── */}
      <section className="py-20 lg:py-28 bg-gradient-navy relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl" />

        <div className="section-container relative z-10">
          <SectionHeading
            badge="Why Choose Us"
            title="Trusted by Thousands of Nepali Clients"
            subtitle="Our track record speaks for itself. Here's why clients choose The Visa Ghar."
            light
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            <AnimatedCounter end={98} suffix="%" label="Success Rate" icon={<Award className="w-8 h-8" />} />
            <AnimatedCounter end={2000} suffix="+" label="Happy Clients" icon={<Users className="w-8 h-8" />} />
            <AnimatedCounter end={10} suffix="+" label="Years Experience" icon={<Clock className="w-8 h-8" />} />
            <AnimatedCounter end={15} suffix="+" label="Countries Covered" icon={<Globe2 className="w-8 h-8" />} />
          </div>
        </div>
      </section>

      {/* ─── How It Works ──────────────────────────────────────────── */}
      <HowItWorksSection />

      {/* ─── Testimonials ──────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 bg-off-white" id="testimonials">
        <div className="section-container">
          <SectionHeading
            badge="Client Stories"
            title="What Our Clients Say"
            subtitle="Real stories from Nepali clients who achieved their visa goals with our help."
          />

          {testimonials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {testimonials.map((testimonial: TestimonialSummary, index: number) => (
                <TestimonialCard key={index} {...testimonial} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-12">Client testimonials coming soon.</p>
          )}
        </div>
      </section>

      {/* ─── Latest Blog ───────────────────────────────────────────── */}
      <section className="py-20 lg:py-28" id="blog">
        <div className="section-container">
          <SectionHeading
            badge="Latest News"
            title="Immigration Insights & Updates"
            subtitle="Stay informed with the latest visa news, tips, and guides from our expert team."
          />

          {blogPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {blogPosts.map((post: BlogPostSummary, index: number) => (
                <BlogCard key={post.slug} {...post} index={index} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-12">Blog articles coming soon.</p>
          )}

          <div className="text-center mt-12">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-navy hover:text-gold font-semibold transition-colors"
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
