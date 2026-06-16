import React from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Mail, Phone, MapPin } from "lucide-react";
import { Facebook, Instagram, Linkedin, WhatsApp } from "@/components/ui/BrandIcons";

const serviceLinks = [
  { href: "/services/student-visa", label: "Student Visa" },
  { href: "/services/ielts-class", label: "IELTS Preparation" },
  { href: "/services/pte-class", label: "PTE Preparation" },
  { href: "/services/japanese-language", label: "Japanese Language" },
  { href: "/services/computer-class", label: "Computer Class" },
];

const destinationLinks = [
  { href: "/countries/uk", label: "United Kingdom" },
  { href: "/countries/australia", label: "Australia" },
  { href: "/countries/usa", label: "USA" },
  { href: "/countries/canada", label: "Canada" },
  { href: "/countries/japan", label: "Japan" },
  { href: "/countries", label: "All destinations" },
];

const companyLinks = [
  { href: "/about", label: "About Us" },
  { href: "/success-stories", label: "Success Stories" },
  { href: "/tools", label: "Student Tools" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
  { href: "/book", label: "Book Consultation" },
];

const socialLinks = [
  { href: "https://facebook.com/thevisaghar", icon: Facebook, label: "Facebook" },
  { href: "https://instagram.com/thevisaghar", icon: Instagram, label: "Instagram" },
  { href: "https://linkedin.com/company/thevisaghar", icon: Linkedin, label: "LinkedIn" },
  { href: "https://wa.me/9779851338645", icon: WhatsApp, label: "WhatsApp" },
];

export function Footer() {
  return (
    <footer className="bg-primary text-white relative overflow-hidden" role="contentinfo">
      {/* Main Footer */}
      <div className="section-container py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand — wider column */}
          <div className="lg:col-span-4 space-y-5">
            <Logo variant="white" size="md" />
            <p className="text-white/70 text-sm leading-relaxed max-w-xs">
              Your trusted study abroad partner in Kathmandu. We guide Nepali
              students from course selection through visa approval and
              pre-departure — every step, one to one.
            </p>

            <p className="text-xs text-white/40 leading-relaxed border-t border-white/8 pt-4">
              Govt. Regd. No: 319208/080/081
              <br />
              Approved by MoEST, Nepal.
            </p>

            <div className="flex gap-2.5 pt-1">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/6 border border-white/10 hover:border-accent hover:bg-accent/15 flex items-center justify-center transition-all hover:-translate-y-0.5"
                  style={{ transitionDuration: "var(--duration-normal)" }}
                  aria-label={`Visit our ${social.label}`}
                >
                  <social.icon size={16} className="text-white/70" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="lg:col-span-2">
            <h3 className="text-accent font-semibold text-xs uppercase tracking-[0.15em] mb-5">
              Services
            </h3>
            <ul className="space-y-2.5">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/65 hover:text-white text-sm transition-colors inline-block"
                    style={{ transitionDuration: "var(--duration-fast)" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Study Destinations */}
          <div className="lg:col-span-2">
            <h3 className="text-accent font-semibold text-xs uppercase tracking-[0.15em] mb-5">
              Destinations
            </h3>
            <ul className="space-y-2.5">
              {destinationLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/65 hover:text-white text-sm transition-colors inline-block"
                    style={{ transitionDuration: "var(--duration-fast)" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company + Contact */}
          <div className="lg:col-span-4">
            <h3 className="text-accent font-semibold text-xs uppercase tracking-[0.15em] mb-5">
              Company
            </h3>
            <div className="grid grid-cols-2 gap-x-6">
              <ul className="space-y-2.5">
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/65 hover:text-white text-sm transition-colors inline-block"
                      style={{ transitionDuration: "var(--duration-fast)" }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="space-y-3">
                <a
                  href="https://maps.google.com/?q=Boudha-6,+Pipalbot,+Kathmandu,+Nepal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 text-white/65 hover:text-white transition-colors text-sm"
                >
                  <MapPin size={14} className="text-accent mt-0.5 flex-shrink-0" />
                  <span>Boudha-6, Pipalbot, Kathmandu</span>
                </a>
                <a
                  href="tel:+97714913776"
                  className="flex items-center gap-2 text-white/65 hover:text-white transition-colors text-sm"
                >
                  <Phone size={14} className="text-accent flex-shrink-0" />
                  <span>01-4913776</span>
                </a>
                <a
                  href="tel:+9779851338645"
                  className="flex items-center gap-2 text-white/65 hover:text-white transition-colors text-sm pl-[22px]"
                >
                  <span>9851338645</span>
                </a>
                <a
                  href="mailto:info@thevisaghar.com"
                  className="flex items-center gap-2 text-white/65 hover:text-white transition-colors text-sm"
                >
                  <Mail size={14} className="text-accent flex-shrink-0" />
                  <span>info@thevisaghar.com</span>
                </a>

                <div className="mt-4 p-3.5 rounded-xl bg-white/5 border border-white/8">
                  <p className="text-accent text-xs font-semibold uppercase tracking-wider">
                    Office hours
                  </p>
                  <p className="text-white/70 text-sm mt-1">Sun – Fri: 10 AM – 6 PM</p>
                  <p className="text-white/40 text-xs mt-0.5">Saturday: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8 py-5">
        <div className="section-container flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p className="order-2 md:order-1 text-center md:text-left">
            © {new Date().getFullYear()} The Visa Ghar. All rights reserved.
          </p>
          <div className="order-1 md:order-2 flex items-center gap-5">
            <Link href="/privacy" className="hover:text-white/70 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white/70 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
