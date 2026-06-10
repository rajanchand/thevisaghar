"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
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
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-navy">
        <div className="section-container text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-gold text-sm font-medium mb-4 border border-white/15">
              Get In Touch
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Contact Us</h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Have questions about your visa application? We&apos;re here to help. Reach out and we&apos;ll respond within 24 hours.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm"
              >
                <h2 className="text-2xl font-bold text-navy mb-6">Send Us a Message</h2>

                {submitStatus === "success" ? (
                  <div className="text-center py-12">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-navy mb-2">Message Sent!</h3>
                    <p className="text-gray-500">We&apos;ll get back to you within 24 hours.</p>
                    <button
                      onClick={() => setSubmitStatus("idle")}
                      className="mt-6 text-gold font-semibold hover:underline"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-1.5">
                          Full Name *
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          {...register("name")}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all text-sm"
                          placeholder="Your full name"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                      </div>
                      <div>
                        <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-1.5">
                          Email Address *
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          {...register("email")}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all text-sm"
                          placeholder="your@email.com"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                          Phone Number
                        </label>
                        <input
                          id="contact-phone"
                          type="tel"
                          {...register("phone")}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all text-sm"
                          placeholder="+977-"
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-visa-type" className="block text-sm font-medium text-gray-700 mb-1.5">
                          Visa Type *
                        </label>
                        <select
                          id="contact-visa-type"
                          {...register("visaType")}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all text-sm bg-white"
                        >
                          <option value="">Select visa type</option>
                          {VISA_TYPES.map((type) => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                        {errors.visaType && <p className="text-red-500 text-xs mt-1">{errors.visaType.message}</p>}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Message *
                      </label>
                      <textarea
                        id="contact-message"
                        {...register("message")}
                        rows={5}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all text-sm resize-none"
                        placeholder="Tell us about your visa needs..."
                      />
                      {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                    </div>

                    {submitStatus === "error" && (
                      <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                        <AlertCircle size={16} />
                        {errorMessage}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submitStatus === "loading"}
                      className="w-full bg-navy hover:bg-navy-light text-white font-semibold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitStatus === "loading" ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={18} />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </motion.div>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <div className="bg-navy rounded-2xl p-8 text-white">
                  <h3 className="font-bold text-xl mb-6">Contact Information</h3>
                  <div className="space-y-5">
                    <div className="flex items-start gap-4">
                      <MapPin className="text-gold mt-0.5 flex-shrink-0" size={20} />
                      <div>
                        <p className="font-medium">Office Address</p>
                        <p className="text-gray-300 text-sm mt-0.5">Boudha-6, Pipalbot, Kathmandu, Nepal</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Phone className="text-gold mt-0.5 flex-shrink-0" size={20} />
                      <div>
                        <p className="font-medium">Phone</p>
                        <a href="tel:+97714913776" className="text-gray-300 text-sm mt-0.5 hover:text-gold transition-colors block">
                          01-4913776
                        </a>
                        <a href="tel:+9779851338645" className="text-gray-300 text-sm mt-0.5 hover:text-gold transition-colors block">
                          +977-9851338645
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Mail className="text-gold mt-0.5 flex-shrink-0" size={20} />
                      <div>
                        <p className="font-medium">Email</p>
                        <a href="mailto:info@thevisaghar.com" className="text-gray-300 text-sm mt-0.5 hover:text-gold transition-colors block">
                          info@thevisaghar.com
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Clock className="text-gold mt-0.5 flex-shrink-0" size={20} />
                      <div>
                        <p className="font-medium">Business Hours</p>
                        <p className="text-gray-300 text-sm mt-0.5">Sun – Fri: 10:00 AM – 6:00 PM</p>
                        <p className="text-gray-400 text-xs">Saturday: Closed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Map */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <div className="rounded-2xl overflow-hidden border border-gray-200 h-[300px]">
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
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
