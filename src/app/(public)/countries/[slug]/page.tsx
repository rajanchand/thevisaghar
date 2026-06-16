import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, Calendar, ShieldCheck, HelpCircle } from "lucide-react";
import { countries } from "../../../../../data/countries";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static paths for SEO pre-rendering of all countries
export async function generateStaticParams() {
  return countries.map((country) => ({
    slug: country.slug,
  }));
}

export default async function CountryDetailPage({ params }: Props) {
  const { slug } = await params;
  const country = countries.find((c) => c.slug === slug);

  if (!country) {
    notFound();
  }

  return (
    <>
      {/* ─── Hero Section ───────────────────────────────────────────── */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-surface to-surface-sunken border-b border-border-faint relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-[0.015]" />
        <div className="section-container relative z-10">
          <div className="max-w-4xl">
            {/* Flag emblem & Title */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-6 mb-6">
              <span
                className="w-16 h-16 rounded-2xl bg-surface-raised flex items-center justify-center text-4xl shadow-sm border border-border-faint flex-shrink-0"
                role="img"
                aria-label={`${country.name} flag`}
              >
                {country.flag}
              </span>
              <div>
                <span className="text-accent text-xs font-semibold uppercase tracking-[0.2em] block mb-1">
                  Study Abroad Destination
                </span>
                <h1
                  className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary leading-tight"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Study in the {country.name}
                </h1>
              </div>
            </div>

            <p
              className="text-primary font-semibold text-lg md:text-xl lg:text-2xl leading-relaxed mb-6 italic"
              style={{ fontFamily: "var(--font-display)" }}
            >
              &ldquo;{country.tagline}&rdquo;
            </p>

            <p
              className="text-ink-muted text-base md:text-lg leading-relaxed max-w-3xl"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {country.description}
            </p>
          </div>
        </div>
      </section>

      {/* ─── Why Study & Admission Dashboard ────────────────────────── */}
      <section className="py-16 bg-surface">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left Col: Why Study Checkpoints (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <h2
                className="text-2xl md:text-3xl font-bold text-primary mb-6"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Why Choose {country.name}?
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {country.whyStudy.map((point, index) => (
                  <div
                    key={index}
                    className="p-5 bg-surface-raised rounded-2xl border border-border-faint shadow-sm flex items-start gap-3.5 hover:shadow-md transition-shadow"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-ink-light leading-relaxed font-medium">
                      {point}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Col: Snapshot Dashboard (5 cols) */}
            <div className="lg:col-span-5 bg-surface-sunken rounded-3xl p-6 lg:p-8 border border-border">
              <h3
                className="text-lg font-bold text-primary mb-6 flex items-center gap-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <ShieldCheck className="text-accent" /> Quick Facts
              </h3>

              <div className="space-y-5" style={{ fontFamily: "var(--font-body)" }}>
                {/* IELTS/PTE */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-surface-raised border border-border-faint flex items-center justify-center flex-shrink-0 text-primary">
                    🎓
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider text-ink-faint block">
                      English Requirements
                    </span>
                    <p className="text-sm font-semibold text-primary mt-0.5">
                      {country.englishRequirements}
                    </p>
                  </div>
                </div>

                {/* Work rights */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-surface-raised border border-border-faint flex items-center justify-center flex-shrink-0 text-primary">
                    💼
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider text-ink-faint block">
                      Part-Time Work
                    </span>
                    <p className="text-sm font-semibold text-primary mt-0.5">
                      {country.workRights}
                    </p>
                  </div>
                </div>

                {/* Post Study Work */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-surface-raised border border-border-faint flex items-center justify-center flex-shrink-0 text-primary">
                    ⌛
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider text-ink-faint block">
                      Post-Study Stay Back
                    </span>
                    <p className="text-sm font-semibold text-primary mt-0.5">
                      {country.postStudyWork}
                    </p>
                  </div>
                </div>

                {/* Intakes summary */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-surface-raised border border-border-faint flex items-center justify-center flex-shrink-0 text-primary">
                    📅
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider text-ink-faint block">
                      Primary Intakes
                    </span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {country.intakes.map((intake, idx) => (
                        <span
                          key={idx}
                          className="inline-block px-2.5 py-0.5 bg-accent-muted text-accent-dark text-xs font-semibold rounded-full border border-accent/10"
                        >
                          {intake.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── Intakes and Timelines ─────────────────────────────────── */}
      <section className="py-16 bg-surface-sunken">
        <div className="section-container">
          <h2
            className="text-2xl md:text-3xl font-bold text-primary mb-8 text-center"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Intakes & Application Deadlines
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {country.intakes.map((intake, index) => (
              <div
                key={index}
                className="bg-surface-raised rounded-2xl p-6 border border-border-faint shadow-sm flex gap-4"
                style={{ fontFamily: "var(--font-body)" }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary-muted flex items-center justify-center flex-shrink-0 text-primary">
                  <Calendar size={22} />
                </div>
                <div>
                  <h3
                    className="text-lg font-bold text-primary mb-1.5"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {intake.name} Intake
                  </h3>
                  <p className="text-xs uppercase tracking-wider text-accent-dark font-semibold mb-2">
                    Active Months: {intake.months}
                  </p>
                  <p className="text-sm text-ink-muted leading-relaxed">
                    {intake.deadline}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Costs Breakdown Table ─────────────────────────────────── */}
      <section className="py-16 bg-surface">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <h2
              className="text-2xl md:text-3xl font-bold text-primary mb-3 text-center"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Estimated Cost of Study & Living
            </h2>
            <p
              className="text-ink-muted text-sm text-center mb-8 max-w-xl mx-auto"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Below is a realistic breakdown of tuition fees, monthly living costs, and necessary visa charges for international students.
            </p>

            <div className="bg-surface-raised border border-border rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table
                  className="w-full text-left border-collapse text-sm"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  <thead>
                    <tr className="bg-primary text-white text-xs uppercase tracking-wider">
                      <th className="px-6 py-4 font-semibold">Expense Category</th>
                      <th className="px-6 py-4 font-semibold">Cost / Range</th>
                      <th className="px-6 py-4 font-semibold">Note / Conditions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-faint">
                    {country.costs.map((cost, idx) => (
                      <tr key={idx} className="hover:bg-surface transition-colors">
                        <td className="px-6 py-4.5 font-semibold text-primary">{cost.item}</td>
                        <td className="px-6 py-4.5 text-accent-dark font-bold">{cost.range}</td>
                        <td className="px-6 py-4.5 text-ink-muted">{cost.note || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Scholarships ───────────────────────────────────────────── */}
      {country.scholarships && (
        <section className="py-16 bg-surface-sunken">
          <div className="section-container">
            <div className="max-w-3xl mx-auto bg-surface-raised rounded-3xl p-8 border border-border-faint shadow-sm flex flex-col md:flex-row gap-6 md:gap-8 items-start">
              <div className="w-14 h-14 rounded-2xl bg-accent-muted flex items-center justify-center flex-shrink-0 text-3xl">
                🏆
              </div>
              <div style={{ fontFamily: "var(--font-body)" }}>
                <h2
                  className="text-2xl font-bold text-primary mb-3"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Scholarships & Financial Aid
                </h2>
                <p className="text-ink-light text-sm leading-relaxed mb-4">
                  {country.scholarships}
                </p>
                <div className="flex items-center gap-2 text-xs text-ink-faint font-semibold">
                  <span className="w-2 h-2 bg-success rounded-full" /> We guide and support you through scholarship essay writing and application submission.
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── FAQ Section (Details/Summary Accordion) ────────────────── */}
      {country.faq.length > 0 && (
        <section className="py-16 bg-surface">
          <div className="section-container">
            <div className="max-w-3xl mx-auto">
              <h2
                className="text-2xl md:text-3xl font-bold text-primary mb-8 text-center"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Frequently Asked Questions
              </h2>

              <div className="space-y-4" style={{ fontFamily: "var(--font-body)" }}>
                {country.faq.map((faq, index) => (
                  <details
                    key={index}
                    className="group bg-surface-raised border border-border-faint rounded-2xl p-5 [&_summary::-webkit-details-marker]:hidden cursor-pointer"
                  >
                    <summary className="flex items-center justify-between font-bold text-primary text-base list-none select-none">
                      <span className="flex items-start gap-3">
                        <HelpCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                        {faq.question}
                      </span>
                      <span className="ml-2 flex-shrink-0 text-ink-faint group-open:rotate-180 transition-transform duration-200">
                        ▼
                      </span>
                    </summary>
                    <div className="mt-4 pl-8 border-t border-border-faint pt-4 text-ink-muted text-sm leading-relaxed">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── Call to Action ─────────────────────────────────────────── */}
      <section className="py-16 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-[0.02]" />
        <div className="section-container relative z-10 text-center max-w-3xl mx-auto space-y-6">
          <h2
            className="text-3xl md:text-4xl font-extrabold text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Start Your Journey to the {country.name}
          </h2>
          <p
            className="text-white/80 text-base md:text-lg max-w-xl mx-auto leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Apply through The Visa Ghar to receive honest admissions and visa guidance from certified student advisors based in Kathmandu.
          </p>
          <div className="pt-4" style={{ fontFamily: "var(--font-body)" }}>
            <Link
              href="/book"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-primary font-bold px-8 py-4 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 shadow-accent"
            >
              Book Free Counselling Session <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
