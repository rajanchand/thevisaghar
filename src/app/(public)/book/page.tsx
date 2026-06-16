"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema, type BookingFormData, VISA_TYPES } from "@/lib/validations";
import { ArrowRight, ArrowLeft, Calendar, CheckCircle2, AlertCircle, Plane } from "lucide-react";

const steps = ["Visa / Course Type", "Contact Info", "Preferred Date", "Confirm Details"];

export default function BookPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      visaType: "",
      name: "",
      email: "",
      phone: "",
      preferredDate: "",
      message: "",
    },
  });

  const watchedValues = watch();

  const nextStep = async () => {
    let fieldsToValidate: (keyof BookingFormData)[] = [];
    if (currentStep === 0) fieldsToValidate = ["visaType"];
    if (currentStep === 1) fieldsToValidate = ["name", "email", "phone"];
    if (currentStep === 2) fieldsToValidate = ["preferredDate"];

    const isValid = await trigger(fieldsToValidate);
    if (isValid) setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const onSubmit = async (data: BookingFormData) => {
    setSubmitStatus("loading");
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Failed to book consultation");
      }

      setSubmitStatus("success");
    } catch (err) {
      setSubmitStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  if (submitStatus === "success") {
    return (
      <section className="pt-32 pb-20 bg-surface">
        <div className="section-container max-w-lg mx-auto text-center" style={{ fontFamily: "var(--font-body)" }}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 180, damping: 20 }}
          >
            <div className="w-20 h-20 bg-accent-muted rounded-full flex items-center justify-center mx-auto mb-6 border border-accent/20">
              <CheckCircle2 className="w-10 h-10 text-accent-dark" />
            </div>
            <h1
              className="text-3xl font-bold text-primary mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Consultation Scheduled!
            </h1>
            <p className="text-ink-light mb-2">
              Thank you, <strong>{watchedValues.name}</strong>. Your appointment for{" "}
              <strong>{watchedValues.visaType}</strong> guidance has been requested.
            </p>
            <p className="text-ink-muted text-sm mb-8">
              An advisor will contact you at <strong>{watchedValues.phone}</strong> or <strong>{watchedValues.email}</strong> shortly to confirm the exact time slot.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/95 text-white font-bold px-8 py-3.5 rounded-xl transition-colors text-xs uppercase tracking-wider shadow-sm"
            >
              Return to Home
            </Link>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* ─── Hero Section ───────────────────────────────────────────── */}
      <section className="pt-32 pb-12 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-[0.02]" />
        <div className="section-container text-center relative z-10">
          <Plane className="w-10 h-10 text-accent mx-auto mb-4" />
          <h1
            className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Book a Free Consultation
          </h1>
          <p
            className="text-white/80 max-w-xl mx-auto text-sm md:text-base leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Select your program interest, fill in your details, and reserve an in-person or online slot with our lead advisor.
          </p>
        </div>
      </section>

      {/* ─── Multi-Step Funnel ──────────────────────────────────────── */}
      <section className="py-16 bg-surface">
        <div className="section-container max-w-2xl mx-auto">
          {/* Progress Indicators */}
          <div className="flex items-center justify-between mb-12" style={{ fontFamily: "var(--font-body)" }}>
            {steps.map((step, index) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                    index < currentStep
                      ? "bg-primary border-primary text-accent"
                      : index === currentStep
                      ? "bg-accent border-accent text-primary shadow-sm"
                      : "bg-surface-raised border-border text-ink-faint"
                  }`}>
                    {index < currentStep ? (
                      <CheckCircle2 size={16} />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider hidden sm:block ${
                    index <= currentStep ? "text-primary font-bold" : "text-ink-faint"
                  }`}>
                    {step}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-[2px] mx-2 rounded-full transition-colors ${
                    index < currentStep ? "bg-primary" : "bg-border"
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Form wrapper */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div
              className="bg-surface-raised rounded-3xl p-8 border border-border-faint shadow-sm min-h-[340px] flex flex-col justify-between"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <AnimatePresence mode="wait">
                {/* Step 1: Program Preference */}
                {currentStep === 0 && (
                  <motion.div
                    key="step-0"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    className="space-y-4"
                  >
                    <div>
                      <h2
                        className="text-xl font-bold text-primary mb-1.5"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        Which program are you applying for?
                      </h2>
                      <p className="text-ink-muted text-xs leading-relaxed mb-6">
                        Select the class or study abroad destination you would like to discuss.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {VISA_TYPES.map((type) => (
                        <label
                          key={type}
                          className={`flex items-center gap-3.5 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                            watchedValues.visaType === type
                              ? "border-accent bg-accent-muted/40"
                              : "border-border hover:border-accent/30 bg-surface-raised"
                          }`}
                        >
                          <input
                            type="radio"
                            value={type}
                            {...register("visaType")}
                            className="sr-only"
                          />
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            watchedValues.visaType === type ? "border-accent" : "border-border"
                          }`}>
                            {watchedValues.visaType === type && (
                              <div className="w-2.5 h-2.5 rounded-full bg-accent" />
                            )}
                          </div>
                          <span className="text-sm font-semibold text-ink-light">{type}</span>
                        </label>
                      ))}
                    </div>
                    {errors.visaType && <p className="text-red-500 text-xs mt-3 font-semibold">{errors.visaType.message}</p>}
                  </motion.div>
                )}

                {/* Step 2: Contact Information */}
                {currentStep === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    className="space-y-5"
                  >
                    <div>
                      <h2
                        className="text-xl font-bold text-primary mb-1.5"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        Tell us about yourself
                      </h2>
                      <p className="text-ink-muted text-xs leading-relaxed mb-6">
                        We need your primary details to reach you and register your booking slot.
                      </p>
                    </div>
                    <div>
                      <label htmlFor="book-name" className="block text-xs font-bold uppercase tracking-wider text-ink-light mb-1.5">
                        Full Name *
                      </label>
                      <input
                        id="book-name"
                        type="text"
                        {...register("name")}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-surface-sunken focus:bg-surface-raised focus:border-accent focus:ring-2 focus:ring-accent/25 outline-none text-sm font-semibold text-ink-light"
                        placeholder="Your full name"
                      />
                      {errors.name && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="book-email" className="block text-xs font-bold uppercase tracking-wider text-ink-light mb-1.5">
                        Email Address *
                      </label>
                      <input
                        id="book-email"
                        type="email"
                        {...register("email")}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-surface-sunken focus:bg-surface-raised focus:border-accent focus:ring-2 focus:ring-accent/25 outline-none text-sm font-semibold text-ink-light"
                        placeholder="your@email.com"
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.email.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="book-phone" className="block text-xs font-bold uppercase tracking-wider text-ink-light mb-1.5">
                        Phone Number *
                      </label>
                      <input
                        id="book-phone"
                        type="tel"
                        {...register("phone")}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-surface-sunken focus:bg-surface-raised focus:border-accent focus:ring-2 focus:ring-accent/25 outline-none text-sm font-semibold text-ink-light"
                        placeholder="+977-"
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.phone.message}</p>}
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Calendar Date */}
                {currentStep === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    className="space-y-5"
                  >
                    <div>
                      <h2
                        className="text-xl font-bold text-primary mb-1.5"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        Choose your preferred date
                      </h2>
                      <p className="text-ink-muted text-xs leading-relaxed mb-6">
                        Select a date for your session (Sunday through Friday).
                      </p>
                    </div>
                    <div>
                      <label htmlFor="book-date" className="block text-xs font-bold uppercase tracking-wider text-ink-light mb-1.5">
                        Preferred Date *
                      </label>
                      <div className="relative">
                        <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" />
                        <input
                          id="book-date"
                          type="date"
                          {...register("preferredDate")}
                          min={new Date().toISOString().split("T")[0]}
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-surface-sunken focus:bg-surface-raised focus:border-accent focus:ring-2 focus:ring-accent/25 outline-none text-sm font-semibold text-ink-light"
                        />
                      </div>
                      {errors.preferredDate && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.preferredDate.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="book-message" className="block text-xs font-bold uppercase tracking-wider text-ink-light mb-1.5">
                        Notes / Background (optional)
                      </label>
                      <textarea
                        id="book-message"
                        {...register("message")}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-surface-sunken focus:bg-surface-raised focus:border-accent focus:ring-2 focus:ring-accent/25 outline-none text-sm font-semibold text-ink-light resize-none"
                        placeholder="List your test scores (IELTS/PTE), plus-two academic marks, or specific questions..."
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Summary & Confirm */}
                {currentStep === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    className="space-y-4"
                  >
                    <div>
                      <h2
                        className="text-xl font-bold text-primary mb-1.5"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        Review & Confirm Details
                      </h2>
                      <p className="text-ink-muted text-xs leading-relaxed mb-6">
                        Please verify your consultation choices before submitting.
                      </p>
                    </div>

                    <div className="space-y-3.5 bg-surface-sunken border border-border rounded-2xl p-6 text-sm font-semibold text-ink-light">
                      <div className="flex justify-between border-b border-border-faint pb-2">
                        <span className="text-ink-faint">Visa / Class Category</span>
                        <span className="text-primary">{watchedValues.visaType}</span>
                      </div>
                      <div className="flex justify-between border-b border-border-faint pb-2">
                        <span className="text-ink-faint">Full Name</span>
                        <span className="text-primary">{watchedValues.name}</span>
                      </div>
                      <div className="flex justify-between border-b border-border-faint pb-2">
                        <span className="text-ink-faint">Email Address</span>
                        <span className="text-primary">{watchedValues.email}</span>
                      </div>
                      <div className="flex justify-between border-b border-border-faint pb-2">
                        <span className="text-ink-faint">Phone Number</span>
                        <span className="text-primary">{watchedValues.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ink-faint">Requested Date</span>
                        <span className="text-primary">{watchedValues.preferredDate}</span>
                      </div>
                    </div>

                    {submitStatus === "error" && (
                      <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl text-sm font-semibold border border-red-150">
                        <AlertCircle size={16} />
                        {errorMessage}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Navigation buttons block */}
            <div className="flex justify-between items-center mt-6" style={{ fontFamily: "var(--font-body)" }}>
              {currentStep > 0 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center gap-2 px-6 py-3 text-ink-muted hover:text-primary font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  <ArrowLeft size={14} /> Back
                </button>
              ) : (
                <div />
              )}

              {currentStep < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-2 bg-primary hover:bg-primary/95 text-white font-bold px-8 py-3 rounded-xl transition-all text-xs uppercase tracking-wider shadow-sm"
                >
                  Next <ArrowRight size={14} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitStatus === "loading"}
                  className="flex items-center gap-2 bg-accent hover:bg-accent-dark text-primary font-extrabold px-8 py-3.5 rounded-xl transition-all disabled:opacity-50 text-xs uppercase tracking-wider shadow-accent"
                >
                  {submitStatus === "loading" ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                      Scheduling...
                    </>
                  ) : (
                    <>
                      Confirm Booking <CheckCircle2 size={14} />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
