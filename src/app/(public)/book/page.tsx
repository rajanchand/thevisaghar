"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema, type BookingFormData, VISA_TYPES } from "@/lib/validations";
import { ArrowRight, ArrowLeft, Calendar, CheckCircle2, AlertCircle, Plane } from "lucide-react";

const steps = ["Visa Type", "Personal Info", "Preferred Date", "Confirm"];

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
      <section className="pt-32 pb-20">
        <div className="section-container max-w-lg mx-auto text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-navy mb-4">Booking Confirmed!</h1>
            <p className="text-gray-500 mb-2">
              Thank you, <strong>{watchedValues.name}</strong>. Your consultation for{" "}
              <strong>{watchedValues.visaType}</strong> has been booked.
            </p>
            <p className="text-gray-500 mb-8">
              We&apos;ll contact you at <strong>{watchedValues.email}</strong> to confirm the exact time.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-navy text-white font-semibold px-8 py-3 rounded-xl hover:bg-navy-light transition-colors"
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
      {/* Hero */}
      <section className="pt-32 pb-12 bg-gradient-navy">
        <div className="section-container text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Plane className="w-10 h-10 text-gold mx-auto mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Book Free Consultation</h1>
            <p className="text-gray-300 max-w-xl mx-auto">
              Schedule a free consultation with our visa experts. We&apos;ll assess your eligibility and guide you through the process.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Multi-Step Form */}
      <section className="py-16">
        <div className="section-container max-w-2xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-12">
            {steps.map((step, index) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    index <= currentStep
                      ? "bg-navy text-white"
                      : "bg-gray-100 text-gray-400"
                  }`}>
                    {index < currentStep ? (
                      <CheckCircle2 size={18} />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${
                    index <= currentStep ? "text-navy" : "text-gray-400"
                  }`}>
                    {step}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-[2px] mx-2 ${
                    index < currentStep ? "bg-navy" : "bg-gray-200"
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm min-h-[300px]">
              <AnimatePresence mode="wait">
                {/* Step 1: Visa Type */}
                {currentStep === 0 && (
                  <motion.div
                    key="step-0"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h2 className="text-xl font-bold text-navy mb-2">What visa are you interested in?</h2>
                    <p className="text-gray-500 text-sm mb-6">Select the type of visa you&apos;d like to discuss.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {VISA_TYPES.map((type) => (
                        <label
                          key={type}
                          className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            watchedValues.visaType === type
                              ? "border-gold bg-gold/5"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <input
                            type="radio"
                            value={type}
                            {...register("visaType")}
                            className="sr-only"
                          />
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            watchedValues.visaType === type ? "border-gold" : "border-gray-300"
                          }`}>
                            {watchedValues.visaType === type && (
                              <div className="w-2.5 h-2.5 rounded-full bg-gold" />
                            )}
                          </div>
                          <span className="text-sm font-medium text-gray-700">{type}</span>
                        </label>
                      ))}
                    </div>
                    {errors.visaType && <p className="text-red-500 text-xs mt-3">{errors.visaType.message}</p>}
                  </motion.div>
                )}

                {/* Step 2: Personal Info */}
                {currentStep === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    <div>
                      <h2 className="text-xl font-bold text-navy mb-2">Tell us about yourself</h2>
                      <p className="text-gray-500 text-sm mb-6">We need your details to schedule the consultation.</p>
                    </div>
                    <div>
                      <label htmlFor="book-name" className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                      <input id="book-name" type="text" {...register("name")} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none text-sm" placeholder="Your full name" />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="book-email" className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
                      <input id="book-email" type="email" {...register("email")} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none text-sm" placeholder="your@email.com" />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="book-phone" className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number *</label>
                      <input id="book-phone" type="tel" {...register("phone")} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none text-sm" placeholder="+977-" />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Preferred Date */}
                {currentStep === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    <div>
                      <h2 className="text-xl font-bold text-navy mb-2">Choose your preferred date</h2>
                      <p className="text-gray-500 text-sm mb-6">Select a date for your free consultation.</p>
                    </div>
                    <div>
                      <label htmlFor="book-date" className="block text-sm font-medium text-gray-700 mb-1.5">Preferred Date *</label>
                      <div className="relative">
                        <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          id="book-date"
                          type="date"
                          {...register("preferredDate")}
                          min={new Date().toISOString().split("T")[0]}
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none text-sm"
                        />
                      </div>
                      {errors.preferredDate && <p className="text-red-500 text-xs mt-1">{errors.preferredDate.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="book-message" className="block text-sm font-medium text-gray-700 mb-1.5">Additional Notes (optional)</label>
                      <textarea
                        id="book-message"
                        {...register("message")}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none text-sm resize-none"
                        placeholder="Any specific questions or requirements?"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Confirm */}
                {currentStep === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h2 className="text-xl font-bold text-navy mb-2">Review & Confirm</h2>
                    <p className="text-gray-500 text-sm mb-6">Please verify your booking details below.</p>

                    <div className="space-y-4 bg-off-white rounded-xl p-6">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Visa Type</span>
                        <span className="text-sm font-semibold text-navy">{watchedValues.visaType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Name</span>
                        <span className="text-sm font-semibold text-navy">{watchedValues.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Email</span>
                        <span className="text-sm font-semibold text-navy">{watchedValues.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Phone</span>
                        <span className="text-sm font-semibold text-navy">{watchedValues.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Preferred Date</span>
                        <span className="text-sm font-semibold text-navy">{watchedValues.preferredDate}</span>
                      </div>
                    </div>

                    {submitStatus === "error" && (
                      <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg text-sm mt-4">
                        <AlertCircle size={16} />
                        {errorMessage}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              {currentStep > 0 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-navy font-medium transition-colors"
                >
                  <ArrowLeft size={16} /> Back
                </button>
              ) : <div />}

              {currentStep < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-2 bg-navy hover:bg-navy-light text-white font-semibold px-8 py-3 rounded-xl transition-all"
                >
                  Next <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitStatus === "loading"}
                  className="flex items-center gap-2 bg-gold hover:bg-gold-dark text-navy font-bold px-8 py-3 rounded-xl transition-all disabled:opacity-50"
                >
                  {submitStatus === "loading" ? (
                    <>
                      <div className="w-5 h-5 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
                      Booking...
                    </>
                  ) : (
                    <>Confirm Booking <CheckCircle2 size={16} /></>
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
