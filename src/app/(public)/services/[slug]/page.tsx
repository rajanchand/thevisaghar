import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Clock, DollarSign, FileText, HelpCircle, ShieldCheck } from "lucide-react";
import { services } from "../../../../../data/services";
import type { Metadata } from "next";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

// Statically pre-render all service detail pages
export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

// Generate dynamic SEO metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);

  if (!service) {
    return {
      title: "Service Not Found | The Visa Ghar",
    };
  }

  return {
    title: `${service.title} | The Visa Ghar`,
    description: service.shortDescription || service.description.slice(0, 155),
    openGraph: {
      title: `${service.title} | The Visa Ghar`,
      description: service.shortDescription || service.description.slice(0, 155),
      url: `https://thevisaghar.com/services/${service.slug}`,
      type: "website",
    },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  return (
    <>
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": service.title,
            "description": service.description,
            "provider": {
              "@type": "LocalBusiness",
              "name": "The Visa Ghar",
              "url": "https://thevisaghar.com",
            },
            "areaServed": "NP",
          }),
        }}
      />

      {/* ─── Hero Section ───────────────────────────────────────────── */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-surface to-surface-sunken border-b border-border-faint relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-[0.015]" />
        <div className="section-container relative z-10">
          <div className="max-w-4xl">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-ink-muted hover:text-primary text-sm font-semibold mb-6 transition-colors"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <ArrowLeft size={16} /> Back to Catalog
            </Link>

            <span className="text-accent text-xs font-semibold uppercase tracking-[0.2em] block mb-1">
              Program Details
            </span>
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary leading-tight mb-6"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {service.title}
            </h1>

            <p
              className="text-ink-light text-base md:text-lg lg:text-xl leading-relaxed max-w-3xl"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {service.description}
            </p>
          </div>
        </div>
      </section>

      {/* ─── Main Content & Sidebar Grid ────────────────────────────── */}
      <section className="py-16 bg-surface">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left Column (8 cols) */}
            <div className="lg:col-span-8 space-y-12" style={{ fontFamily: "var(--font-body)" }}>
              {/* Quick Facts Dashboard */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-surface-raised rounded-2xl p-5 border border-border-faint text-center shadow-sm">
                  <DollarSign className="w-6 h-6 text-accent mx-auto mb-2" />
                  <span className="text-[10px] uppercase tracking-wider text-ink-faint font-bold block mb-1">
                    Service Fee
                  </span>
                  <p className="text-primary font-bold text-base">{service.price}</p>
                </div>
                <div className="bg-surface-raised rounded-2xl p-5 border border-border-faint text-center shadow-sm">
                  <Clock className="w-6 h-6 text-accent mx-auto mb-2" />
                  <span className="text-[10px] uppercase tracking-wider text-ink-faint font-bold block mb-1">
                    Duration / Processing
                  </span>
                  <p className="text-primary font-bold text-base">{service.processingTime}</p>
                </div>
                <div className="bg-surface-raised rounded-2xl p-5 border border-border-faint text-center shadow-sm">
                  <CheckCircle2 className="w-6 h-6 text-accent mx-auto mb-2" />
                  <span className="text-[10px] uppercase tracking-wider text-ink-faint font-bold block mb-1">
                    Direct Advisor
                  </span>
                  <p className="text-primary font-bold text-base">Rajan Chand</p>
                </div>
              </div>

              {/* Eligibility Checkpoints */}
              <div className="p-6 md:p-8 bg-surface-sunken border border-border rounded-3xl">
                <h3
                  className="text-lg font-bold text-primary mb-4 flex items-center gap-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <ShieldCheck className="text-accent" /> Eligibility Prerequisites
                </h3>
                <p className="text-sm text-ink-light leading-relaxed">
                  {service.eligibility}
                </p>
              </div>

              {/* Required Documents */}
              {service.documentsRequired.length > 0 && (
                <div>
                  <h2
                    className="text-2xl font-bold text-primary mb-6"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Required Documentation & Materials
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {service.documentsRequired.map((doc, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-4 bg-surface-raised border border-border-faint rounded-2xl"
                      >
                        <FileText size={18} className="text-accent mt-0.5 flex-shrink-0" />
                        <span className="text-sm font-semibold text-ink-light leading-relaxed">
                          {doc}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQ Section */}
              {service.faq.length > 0 && (
                <div>
                  <h2
                    className="text-2xl font-bold text-primary mb-6"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Frequently Asked Questions
                  </h2>
                  <div className="space-y-4">
                    {service.faq.map((faqItem, idx) => (
                      <details
                        key={idx}
                        className="group bg-surface-raised border border-border-faint rounded-2xl p-5 [&_summary::-webkit-details-marker]:hidden cursor-pointer"
                      >
                        <summary className="flex items-center justify-between font-bold text-primary text-base list-none select-none">
                          <span className="flex items-start gap-3">
                            <HelpCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                            {faqItem.question}
                          </span>
                          <span className="ml-2 flex-shrink-0 text-ink-faint group-open:rotate-180 transition-transform duration-200">
                            ▼
                          </span>
                        </summary>
                        <div className="mt-4 pl-8 border-t border-border-faint pt-4 text-ink-muted text-sm leading-relaxed whitespace-pre-line">
                          {faqItem.answer}
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar (4 cols) */}
            <div className="lg:col-span-4" style={{ fontFamily: "var(--font-body)" }}>
              <div className="sticky top-28 space-y-6">
                {/* Booking Callout */}
                <div className="bg-primary text-white rounded-3xl p-8 border border-white/10 shadow-md relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-[0.015]" />
                  <div className="relative z-10 text-center space-y-4">
                    <h4
                      className="text-xl font-bold text-white leading-snug"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      Start Your Program Application
                    </h4>
                    <p className="text-white/80 text-sm leading-relaxed">
                      Discuss your qualifications and details directly with our lead advisor.
                    </p>
                    <div className="pt-2">
                      <Link
                        href="/book"
                        className="block w-full bg-accent hover:bg-accent-dark text-primary font-bold py-3 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 text-center shadow-accent text-sm"
                      >
                        Book Free Consultation
                      </Link>
                    </div>
                    <span className="text-[10px] text-white/50 block font-semibold">
                      NO UPFRONT ADVISORY CHARGES
                    </span>
                  </div>
                </div>

                {/* Direct Contacts Card */}
                <div className="bg-surface-sunken border border-border rounded-3xl p-6 space-y-4">
                  <h5
                    className="font-bold text-primary text-sm uppercase tracking-wider"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Direct Office Contacts
                  </h5>
                  <div className="space-y-2.5 text-sm">
                    <div className="text-ink-muted">
                      Have urgent inquiries about enrollment? Talk to us today.
                    </div>
                    <div>
                      <span className="text-xs text-ink-faint font-semibold block uppercase">
                        Phone lines
                      </span>
                      <a href="tel:+97714913776" className="font-bold text-accent-dark hover:underline block mt-0.5">
                        01-4913776
                      </a>
                      <a href="tel:+9779851338645" className="font-bold text-accent-dark hover:underline block mt-0.5">
                        +977-9851338645
                      </a>
                    </div>
                    <div>
                      <span className="text-xs text-ink-faint font-semibold block uppercase">
                        Email Support
                      </span>
                      <a href="mailto:info@thevisaghar.com" className="font-bold text-accent-dark hover:underline block mt-0.5">
                        info@thevisaghar.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
