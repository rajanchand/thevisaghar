import React from "react";
import Link from "next/link";
import { HelpCircle, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | The Visa Ghar",
  description: "Find answers to general questions about studying abroad, visa requirements, IELTS/PTE classes, and consultancy fees.",
};

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  title: string;
  items: FAQItem[];
}

const faqCategories: FAQCategory[] = [
  {
    title: "Study Abroad & Student Visas",
    items: [
      {
        question: "How does The Visa Ghar support students?",
        answer:
          "We offer comprehensive, end-to-end guidance. This includes matching your profile to suitable universities in the UK, USA, Australia, Canada, New Zealand, Japan, South Korea, Finland, or Denmark, reviewing academic/financial documents, assisting with Statement of Purpose (SOP) writing, and conducting realistic mock visa interviews.",
      },
      {
        question: "Are there any upfront counseling fees?",
        answer:
          "No. All initial consultations, eligibility profiling, and university options assessments are completely free. We believe in transparency and honest advice from the very first meeting.",
      },
      {
        question: "Can I apply with a dependent?",
        answer:
          "Dependent visa policies vary by country. For example, some postgraduate research programs in the UK or universities in Finland allow spouses/dependents to apply. Our counselors will evaluate your options during your session.",
      },
    ],
  },
  {
    title: "Language & Test Preparation Classes",
    items: [
      {
        question: "What classes are currently available at Boudha, Kathmandu?",
        answer:
          "We offer IELTS Academic, PTE Academic, Japanese Language (JLPT N5 and N4 levels), and Basic Computer/MS Office literacy programs. Classes start every Sunday and Monday.",
      },
      {
        question: "Do you offer mock tests?",
        answer:
          "Yes. We conduct full-length, timed mock exams every week. For IELTS and PTE, students receive personalized scoring reviews and instructor feedback on writing and speaking modules.",
      },
      {
        question: "Do I get access to study materials?",
        answer:
          "Absolutely. Every student enrolled in our classes receives structured study booklets, worksheets, vocabulary decks, and mock software practice accounts without any extra charge.",
      },
    ],
  },
  {
    title: "Registration & Location Inquiries",
    items: [
      {
        question: "Is The Visa Ghar government authorized?",
        answer:
          "Yes. We are officially registered with the Government of Nepal (Regd. No: 319208/080/081) and have received license approvals from the Ministry of Education, Science and Technology (MoEST) for educational consultancy operations.",
      },
      {
        question: "How do I book a consultation with Rajan Chand?",
        answer:
          "You can book an appointment directly through our online booking tool (/book), call our office lines at 01-4913776 / 9851338645, or visit our central office at Boudha-6, Pipalbot, Kathmandu.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <>
      {/* ─── Hero Section ───────────────────────────────────────────── */}
      <section className="pt-32 pb-16 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-[0.02]" />
        <div className="section-container relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-accent text-sm font-semibold uppercase tracking-wider mb-4 border border-white/15">
            Help Center
          </span>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Frequently Asked Questions
          </h1>
          <p
            className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Find clear, straightforward answers to common questions about study visas, exam coaching, and documentation procedures.
          </p>
        </div>
      </section>

      {/* ─── Categorized FAQ Accordions ─────────────────────────────── */}
      <section className="py-20 lg:py-28 bg-surface">
        <div className="section-container max-w-4xl">
          <div className="space-y-16">
            {faqCategories.map((category, catIdx) => (
              <div key={catIdx} className="space-y-6">
                <h2
                  className="text-2xl font-bold text-primary border-b border-border pb-3"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {category.title}
                </h2>

                <div className="space-y-4" style={{ fontFamily: "var(--font-body)" }}>
                  {category.items.map((item, idx) => (
                    <details
                      key={idx}
                      className="group bg-surface-raised border border-border-faint rounded-2xl p-5 [&_summary::-webkit-details-marker]:hidden cursor-pointer"
                    >
                      <summary className="flex items-center justify-between font-bold text-primary text-base list-none select-none">
                        <span className="flex items-start gap-3">
                          <HelpCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                          {item.question}
                        </span>
                        <span className="ml-2 flex-shrink-0 text-ink-faint group-open:rotate-180 transition-transform duration-200">
                          ▼
                        </span>
                      </summary>
                      <div className="mt-4 pl-8 border-t border-border-faint pt-4 text-ink-muted text-sm leading-relaxed whitespace-pre-line">
                        {item.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Still Have Questions CTA ────────────────────────────────── */}
      <section className="py-16 bg-surface-sunken border-t border-border-faint text-center">
        <div className="section-container max-w-xl mx-auto space-y-6" style={{ fontFamily: "var(--font-body)" }}>
          <h2
            className="text-2xl md:text-3xl font-bold text-primary"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Still Have Unanswered Questions?
          </h2>
          <p className="text-ink-muted text-sm md:text-base leading-relaxed">
            Every student case is unique. Contact us directly or book a free personalized advisory session to discuss your academic and immigration profile.
          </p>
          <div className="pt-2 flex justify-center gap-4 flex-wrap">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border border-border hover:border-accent hover:bg-accent-muted text-primary font-bold px-6 py-3.5 rounded-xl transition-all duration-200 text-sm uppercase tracking-wider"
            >
              Send a Message
            </Link>
            <Link
              href="/book"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-primary font-bold px-6 py-3.5 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 shadow-accent text-sm uppercase tracking-wider"
            >
              Book Free Session <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
