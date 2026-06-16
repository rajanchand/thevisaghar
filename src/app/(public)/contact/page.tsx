"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactFormData, VISA_TYPES } from "@/lib/validations";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, AlertCircle } from "lucide-react";

export default function ContactPage() {
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setSubmitStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Failed to send message");
      }

      setSubmitStatus("success");
      reset();
    } catch (err) {
      setSubmitStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <>
      {/* ─── Hero Section ───────────────────────────────────────────── */}
      <section className="pt-32 pb-16 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-[0.02]" />
        <div className="section-container relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-accent text-sm font-semibold uppercase tracking-wider mb-4 border border-white/15">
            Get In Touch
          </span>
          <h1
            className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Contact Our Kathmandu Office
          </h1>
          <p
            className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Have inquiries about admissions, visa requirements, or preparation classes? Write to us or call our advisors directly.
          </p>
        </div>
      </section>

      {/* ─── Content Grid ───────────────────────────────────────────── */}
      <section className="py-20 bg-surface">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left: Contact Form (7 cols) */}
            <div className="lg:col-span-7">
              <div
                className="bg-surface-raised rounded-3xl p-8 border border-border-faint shadow-sm"
                style={{ fontFamily: "var(--font-body)" }}
              >
                <h2
                  className="text-2xl font-bold text-primary mb-6"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Send Us a Message
                </h2>

                {submitStatus === "success" ? (
                  <div className="text-center py-12">
                    <CheckCircle2 className="w-16 h-16 text-accent mx-auto mb-4" />
                    <h3
                      className="text-xl font-bold text-primary mb-2"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      Message Received!
                    </h3>
                    <p className="text-ink-muted text-sm">
                      Thank you for reaching out. A consultant will review your query and respond within 24 hours.
                    </p>
                    <button
                      onClick={() => setSubmitStatus("idle")}
                      className="mt-6 text-accent-dark font-bold hover:underline text-sm uppercase tracking-wider"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="contact-name" className="block text-xs font-bold uppercase tracking-wider text-ink-light mb-1.5">
                          Full Name *
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          {...register("name")}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface-sunken focus:bg-surface-raised focus:border-accent focus:ring-2 focus:ring-accent/25 outline-none transition-all text-sm font-semibold text-ink-light"
                          placeholder="Your full name"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.name.message}</p>}
                      </div>
                      <div>
                        <label htmlFor="contact-email" className="block text-xs font-bold uppercase tracking-wider text-ink-light mb-1.5">
                          Email Address *
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          {...register("email")}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface-sunken focus:bg-surface-raised focus:border-accent focus:ring-2 focus:ring-accent/25 outline-none transition-all text-sm font-semibold text-ink-light"
                          placeholder="your@email.com"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.email.message}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="contact-phone" className="block text-xs font-bold uppercase tracking-wider text-ink-light mb-1.5">
                          Phone Number
                        </label>
                        <input
                          id="contact-phone"
                          type="tel"
                          {...register("phone")}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface-sunken focus:bg-surface-raised focus:border-accent focus:ring-2 focus:ring-accent/25 outline-none transition-all text-sm font-semibold text-ink-light"
                          placeholder="+977-"
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-visa-type" className="block text-xs font-bold uppercase tracking-wider text-ink-light mb-1.5">
                          Visa / Program Type *
                        </label>
                        <select
                          id="contact-visa-type"
                          {...register("visaType")}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface-sunken focus:bg-surface-raised focus:border-accent focus:ring-2 focus:ring-accent/25 outline-none transition-all text-sm font-semibold text-ink-light"
                        >
                          <option value="">Select program interest</option>
                          {VISA_TYPES.map((type) => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                        {errors.visaType && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.visaType.message}</p>}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="contact-message" className="block text-xs font-bold uppercase tracking-wider text-ink-light mb-1.5">
                        Message *
                      </label>
                      <textarea
                        id="contact-message"
                        {...register("message")}
                        rows={5}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-surface-sunken focus:bg-surface-raised focus:border-accent focus:ring-2 focus:ring-accent/25 outline-none transition-all text-sm font-semibold text-ink-light resize-none"
                        placeholder="Tell us about your background, grades, and language test scores..."
                      />
                      {errors.message && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.message.message}</p>}
                    </div>

                    {submitStatus === "error" && (
                      <div className="flex items-center gap-2 p-3.5 bg-red-50 text-red-600 rounded-xl text-sm font-semibold border border-red-150">
                        <AlertCircle size={16} />
                        {errorMessage}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submitStatus === "loading"}
                      className="w-full bg-primary hover:bg-primary/95 text-white font-bold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-xs uppercase tracking-wider"
                    >
                      {submitStatus === "loading" ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <Send size={14} />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Right: Contact Info & Map (5 cols) */}
            <div className="lg:col-span-5 space-y-6" style={{ fontFamily: "var(--font-body)" }}>
              {/* Info Card */}
              <div className="bg-primary text-white rounded-3xl p-8 border border-white/5 shadow-md relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-[0.015]" />
                <div className="relative z-10 space-y-6">
                  <h3
                    className="font-bold text-xl text-white"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Office Information
                  </h3>
                  <div className="space-y-5">
                    <div className="flex items-start gap-4">
                      <MapPin className="text-accent mt-0.5 flex-shrink-0" size={20} />
                      <div>
                        <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider block">Office Location</span>
                        <p className="text-sm font-semibold mt-0.5">Boudha-6, Pipalbot, Kathmandu, Nepal</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Phone className="text-accent mt-0.5 flex-shrink-0" size={20} />
                      <div>
                        <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider block">Contact Numbers</span>
                        <a href="tel:+97714913776" className="text-sm font-semibold hover:text-accent transition-colors block mt-0.5">
                          01-4913776
                        </a>
                        <a href="tel:+9779851338645" className="text-sm font-semibold hover:text-accent transition-colors block mt-0.5">
                          +977-9851338645
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Mail className="text-accent mt-0.5 flex-shrink-0" size={20} />
                      <div>
                        <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider block">Email Inquiries</span>
                        <a href="mailto:info@thevisaghar.com" className="text-sm font-semibold hover:text-accent transition-colors block mt-0.5">
                          info@thevisaghar.com
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Clock className="text-accent mt-0.5 flex-shrink-0" size={20} />
                      <div>
                        <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider block">Business Hours</span>
                        <p className="text-sm font-semibold mt-0.5">Sunday – Friday: 10:00 AM – 6:00 PM</p>
                        <span className="text-white/40 text-[10px] block mt-0.5">Saturday: Closed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Google Map */}
              <div className="rounded-3xl overflow-hidden border border-border h-[280px] shadow-sm">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3531.905655389658!2d85.3582457!3d27.7196025!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb196238b18db9%3A0xa5970c6792376ef7!2sBoudha%20Pipalbot!5e0!3m2!1sen!2snp!4v1717900000000"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="The Visa Ghar Office Location"
                />
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
