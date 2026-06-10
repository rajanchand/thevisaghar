"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  DollarSign,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";

interface FAQItem {
  q: string;
  a: string;
}

interface Service {
  title: string;
  slug: string;
  description: string;
  price?: string;
  processingTime?: string;
  eligibility?: string;
  documentsRequired: string[];
  faq?: any; // FAQItem[] stored as JSON
}

function FAQAccordion({ faq }: { faq: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faq || faq.length === 0) return <p className="text-sm text-gray-400 italic">No FAQs configured.</p>;

  return (
    <div className="space-y-3">
      {faq.map((item, index) => (
        <div key={index} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
            aria-expanded={openIndex === index}
          >
            <span className="font-semibold text-navy text-sm pr-4">Q: {item.q}</span>
            {openIndex === index ? (
              <ChevronUp size={18} className="text-gold flex-shrink-0" />
            ) : (
              <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />
            )}
          </button>
          {openIndex === index && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-5 pb-5"
            >
              <p className="text-gray-500 text-sm leading-relaxed whitespace-pre-line">
                {item.a}
              </p>
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function ServiceDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/services/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setService(data);
        }
      } catch (error) {
        console.error("Failed to fetch public service detail:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchService();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-32 pb-20 section-container text-center space-y-4">
        <RefreshCw className="animate-spin mx-auto text-gold" size={32} />
        <p className="text-gray-400 text-sm">Loading service package details...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="pt-32 pb-20 section-container text-center">
        <h1 className="text-3xl font-bold text-navy mb-4">Service Not Found</h1>
        <p className="text-gray-500 mb-8">The service you are looking for does not exist or has been modified.</p>
        <Link href="/services" className="text-gold font-semibold hover:underline">
          ← Back to Services
        </Link>
      </div>
    );
  }

  // Safely parse FAQs
  let parsedFaqs: FAQItem[] = [];
  if (service.faq) {
    try {
      parsedFaqs = typeof service.faq === "string" ? JSON.parse(service.faq) : service.faq;
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-navy">
        <div className="section-container">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft size={16} /> All Services
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
          >
            {service.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-300 text-lg max-w-3xl leading-relaxed"
          >
            {service.description}
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Key Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-off-white rounded-xl p-5 text-center">
                  <DollarSign className="w-6 h-6 text-gold mx-auto mb-2" />
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Service Fee</p>
                  <p className="text-navy font-bold">{service.price || "Contact Us"}</p>
                </div>
                <div className="bg-off-white rounded-xl p-5 text-center">
                  <Clock className="w-6 h-6 text-gold mx-auto mb-2" />
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Processing Time</p>
                  <p className="text-navy font-bold">{service.processingTime || "N/A"}</p>
                </div>
                <div className="bg-off-white rounded-xl p-5 text-center">
                  <CheckCircle2 className="w-6 h-6 text-gold mx-auto mb-2" />
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Success Rate</p>
                  <p className="text-navy font-bold">98%</p>
                </div>
              </div>

              {/* Eligibility */}
              {service.eligibility && (
                <div>
                  <h2 className="text-2xl font-bold text-navy mb-4">Eligibility Requirements</h2>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line bg-gray-50/50 p-5 border border-gray-100 rounded-2xl">{service.eligibility}</p>
                </div>
              )}

              {/* Documents Required */}
              {service.documentsRequired && service.documentsRequired.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-navy mb-4">Documents Required</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {service.documentsRequired.map((doc, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-off-white rounded-lg">
                        <FileText size={18} className="text-gold mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600 text-sm font-semibold">{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQ */}
              <div>
                <h2 className="text-2xl font-bold text-navy mb-4">Frequently Asked Questions</h2>
                <FAQAccordion faq={parsedFaqs} />
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* CTA Card */}
                <div className="bg-navy rounded-2xl p-8 text-center shadow-lg border border-white/10">
                  <h3 className="text-white font-bold text-xl mb-3">Start Your Application</h3>
                  <p className="text-gray-300 text-sm mb-6">
                    Book a free consultation to discuss your eligibility and get started.
                  </p>
                  <Link
                    href="/book"
                    className="block w-full bg-gold hover:bg-gold-dark text-navy font-bold py-3 rounded-xl transition-all hover:shadow-gold"
                  >
                    Book Free Consultation
                  </Link>
                  <p className="text-gray-400 text-xs mt-4">No fees until we start your application</p>
                </div>

                {/* Contact Card */}
                <div className="bg-off-white rounded-2xl p-6 border border-gray-100">
                  <h4 className="font-semibold text-navy mb-3">Need Help?</h4>
                  <p className="text-gray-500 text-sm mb-4">Contact us for immediate assistance</p>
                  <a href="tel:+97714913776" className="block text-gold font-semibold text-sm hover:underline mb-2">
                    01-4913776, 9851338645
                  </a>
                  <a href="mailto:info@thevisaghar.com" className="block text-gold font-semibold text-sm hover:underline">
                    info@thevisaghar.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
