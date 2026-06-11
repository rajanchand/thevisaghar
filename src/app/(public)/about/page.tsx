"use client";

import React from "react";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Award, Shield, Users, Clock } from "lucide-react";
import { getInitials } from "@/lib/utils";

const teamMembers = [
  { name: "Counseling Team", role: "Student Visa Experts", bio: "Our dedicated counseling team specializes in student visa applications for the UK, USA, Australia, Canada, Finland, Denmark, Korea, and Japan with a 98% success rate." },
  { name: "Language Faculty", role: "Japanese & English Test Prep", bio: "Certified IELTS, PTE, and Japanese language instructors providing intensive coaching to help students score high and meet admission requirements." },
  { name: "Documentation Team", role: "Application & Visa Processing", bio: "Expert documentation officers ensuring error-free visa applications, SOP preparation, and financial document verification." },
];

const timeline = [
  { year: "2016", title: "Founded in Kathmandu", description: "Established at Boudha, Pipalbot, Kathmandu with a vision to guide Nepali students towards global academic excellence." },
  { year: "2018", title: "500+ Clients Served", description: "Reached our first major milestone of 500 successful student visa applications across multiple destinations." },
  { year: "2020", title: "Expanded Course Offerings", description: "Launched Japanese Language, IELTS, PTE, and Computer classes alongside visa consultancy services." },
  { year: "2022", title: "Government Registered", description: "Received official Government Registration (Regd. No: 319208/080/081) and MoEST approval for educational consultancy." },
  { year: "2024", title: "2000+ Happy Clients", description: "Achieved 98% success rate with over 2000 clients served across 15+ countries worldwide." },
  { year: "2025", title: "Digital Platform Launch", description: "Launched modern digital platform with AI-powered guidance for instant student support and online consultations." },
];

const values = [
  { icon: <Shield className="w-7 h-7" />, title: "Trust & Transparency", description: "Honest guidance with clear communication at every step." },
  { icon: <Award className="w-7 h-7" />, title: "Expert Knowledge", description: "Certified consultants staying updated with latest immigration laws." },
  { icon: <Users className="w-7 h-7" />, title: "Client First", description: "Personalized attention to every client's unique situation." },
  { icon: <Clock className="w-7 h-7" />, title: "Timely Processing", description: "Efficient handling ensuring no delays in your application." },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-navy relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-5" />
        <div className="section-container relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-gold text-sm font-medium mb-4 border border-white/15">
              About Us
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Your Trusted Immigration Partner
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Since 2014, we&apos;ve been helping Nepali clients achieve their dreams of living, working, and studying abroad.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="section-container">
          <SectionHeading
            badge="Our Values"
            title="What Drives Us"
            subtitle="The principles that guide our work and define our commitment to you."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-2xl bg-off-white hover:bg-white hover:shadow-lg transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center mx-auto mb-4 text-gold">
                  {value.icon}
                </div>
                <h3 className="font-bold text-navy mb-2">{value.title}</h3>
                <p className="text-gray-500 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-off-white">
        <div className="section-container">
          <SectionHeading
            badge="Our Journey"
            title="A Decade of Excellence"
            subtitle="From a small office in Kathmandu to Nepal's most trusted immigration consultancy."
          />
          <div className="max-w-3xl mx-auto">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative flex gap-6 pb-10 last:pb-0"
              >
                {/* Line */}
                {index < timeline.length - 1 && (
                  <div className="absolute left-[27px] top-12 bottom-0 w-[2px] bg-gold/20" />
                )}
                {/* Year dot */}
                <div className="flex-shrink-0 w-14 h-14 rounded-full bg-navy flex items-center justify-center">
                  <span className="text-gold font-bold text-xs">{item.year}</span>
                </div>
                {/* Content */}
                <div className="pt-2">
                  <h3 className="font-bold text-navy text-lg">{item.title}</h3>
                  <p className="text-gray-500 text-sm mt-1">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="section-container">
          <SectionHeading
            badge="Our Team"
            title="Meet the Experts"
            subtitle="Experienced immigration professionals dedicated to your success."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="text-center group"
              >
                <div className="w-32 h-32 rounded-full bg-navy mx-auto mb-6 flex items-center justify-center group-hover:bg-navy-light transition-colors overflow-hidden">
                  <span className="text-gold text-3xl font-bold">{getInitials(member.name)}</span>
                </div>
                <h3 className="font-bold text-navy text-lg">{member.name}</h3>
                <p className="text-gold text-sm font-medium mb-3">{member.role}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Accreditations */}
      <section className="py-16 bg-off-white">
        <div className="section-container text-center">
          <p className="text-gray-400 text-sm uppercase tracking-wider mb-8">Registrations & Affiliations</p>
          <div className="flex flex-wrap items-center justify-center gap-12 opacity-50">
            {["Govt. Regd. 319208/080/081", "MoEST Approved", "IELTS Test Centre Partner", "JLPT Affiliated", "British Council Certified"].map((name) => (
              <div key={name} className="text-gray-400 font-semibold text-sm">{name}</div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
