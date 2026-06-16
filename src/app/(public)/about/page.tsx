import React from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Award, Shield, Users, Clock, CheckCircle2 } from "lucide-react";
import { team } from "../../../../data/team";
import { getInitials } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Rajan Chand & The Team | The Visa Ghar",
  description: "Learn about Kathmandu's trusted educational consultancy, registered under Regd. No: 319208/080/081 with MoEST approval.",
};

const timeline = [
  {
    year: "2016",
    title: "Founded in Kathmandu",
    description: "Established our central office at Boudha, Pipalbot, Kathmandu to guide Nepali students towards global education.",
  },
  {
    year: "2018",
    title: "500+ Student Milestone",
    description: "Successfully processed and guided over 500 students across leading universities in the UK, USA, and Australia.",
  },
  {
    year: "2020",
    title: "Language Classes & Labs",
    description: "Inaugurated dedicated preparation classrooms and computer lab facilities for IELTS, PTE, and Japanese language courses.",
  },
  {
    year: "2022",
    title: "Official MoEST Approval",
    description: "Granted official educational consultancy registration by the Government of Nepal (Regd. No: 319208/080/081) and MoEST.",
  },
  {
    year: "2024",
    title: "2,000+ Visas Approved",
    description: "Achieved an outstanding 98% enrollment success rate with over 2,000 happy students placed worldwide.",
  },
];

const values = [
  {
    icon: <Shield className="w-6 h-6 text-accent-dark" />,
    title: "Trust & Transparency",
    description: "Clear, honest assessments with no hidden charges or misleading claims.",
  },
  {
    icon: <Award className="w-6 h-6 text-accent-dark" />,
    title: "Certified Guidance",
    description: "British Council and MoEST certified counselors with up-to-date immigration expertise.",
  },
  {
    icon: <Users className="w-6 h-6 text-accent-dark" />,
    title: "Student Centricity",
    description: "Tailored university shortlisting matching your academic and financial preferences.",
  },
  {
    icon: <Clock className="w-6 h-6 text-accent-dark" />,
    title: "Timely Processing",
    description: "Punctual correspondence, rapid CAS/I-20 tracking, and prompt interview preparation.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* ─── Hero Section ───────────────────────────────────────────── */}
      <section className="pt-32 pb-16 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-[0.02]" />
        <div className="section-container relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-accent text-sm font-semibold uppercase tracking-wider mb-4 border border-white/15">
            Who We Are
          </span>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Your Trusted Education Advisors
          </h1>
          <p
            className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Guiding Nepali students with integrity, expertise, and personalized attention since 2016 from Kathmandu.
          </p>
        </div>
      </section>

      {/* ─── Core Values ────────────────────────────────────────────── */}
      <section className="py-20 bg-surface">
        <div className="section-container">
          <SectionHeading
            badge="Our Pillars"
            title="The Principles That Drive Us"
            subtitle="At The Visa Ghar, we believe in honest educational consulting that puts your academic future first."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {values.map((val, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-surface-raised border border-border-faint shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                style={{ fontFamily: "var(--font-body)" }}
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-accent-muted flex items-center justify-center mb-6">
                    {val.icon}
                  </div>
                  <h3
                    className="font-bold text-primary text-lg mb-2 leading-tight"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {val.title}
                  </h3>
                  <p className="text-ink-muted text-sm leading-relaxed">
                    {val.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Timeline / Journey ──────────────────────────────────────── */}
      <section className="py-20 bg-surface-sunken border-t border-b border-border-faint">
        <div className="section-container">
          <SectionHeading
            badge="Our Path"
            title="A History of Student Success"
            subtitle="From a dedicated startup to Kathmandu's most reliable consultancy."
          />
          <div className="max-w-3xl mx-auto mt-12 space-y-8 relative">
            {timeline.map((item, index) => (
              <div
                key={index}
                className="relative flex gap-6 pb-8 last:pb-0"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {/* Vertical Connector Line */}
                {index < timeline.length - 1 && (
                  <div className="absolute left-[27px] top-12 bottom-0 w-[2px] bg-border" />
                )}
                {/* Dot */}
                <div className="flex-shrink-0 w-14 h-14 rounded-full bg-primary flex items-center justify-center text-accent font-bold text-sm shadow-sm border border-white/5">
                  {item.year}
                </div>
                {/* Content */}
                <div className="pt-2">
                  <h3
                    className="font-bold text-primary text-lg leading-snug mb-1"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-ink-light text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Meet the Team ──────────────────────────────────────────── */}
      <section className="py-20 bg-surface">
        <div className="section-container">
          <SectionHeading
            badge="Team Members"
            title="Advisors & Instructors"
            subtitle="Experienced professionals dedicated to helping you achieve your academic goals abroad."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {team.map((member, index) => (
              <div
                key={index}
                className="text-center group bg-surface-raised border border-border-faint rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow"
                style={{ fontFamily: "var(--font-body)" }}
              >
                <div className="w-24 h-24 rounded-full bg-primary mx-auto mb-5 flex items-center justify-center text-white font-bold text-2xl group-hover:bg-primary/95 transition-colors border border-white/5 shadow-sm">
                  {getInitials(member.name)}
                </div>
                <h3
                  className="font-bold text-primary text-lg leading-tight mb-1"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {member.name}
                </h3>
                <span className="text-accent-dark text-xs font-bold uppercase tracking-wider block mb-4">
                  {member.role}
                </span>
                <p className="text-ink-muted text-xs leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Accreditations & Certifications ────────────────────────── */}
      <section className="py-16 bg-surface-sunken border-t border-border-faint text-center">
        <div className="section-container" style={{ fontFamily: "var(--font-body)" }}>
          <span className="text-ink-faint text-[10px] font-bold uppercase tracking-widest block mb-8">
            Registrations & Certifications
          </span>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {[
              "Govt. Regd. 319208/080/081",
              "MoEST Approved Office",
              "IELTS Test Centre Partner",
              "JLPT Affiliated Courses",
              "British Council Certified Advisors",
            ].map((name, idx) => (
              <div
                key={idx}
                className="text-ink-light font-bold text-sm bg-surface-raised px-4 py-2 rounded-xl border border-border-faint shadow-xs flex items-center gap-2"
              >
                <CheckCircle2 size={14} className="text-accent" />
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
