import React from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Mail, Phone, MapPin, Plane } from "lucide-react";
import { Facebook, Instagram, Linkedin, WhatsApp } from "@/components/ui/BrandIcons";

const footerLinks = {
  services: [
    { href: "/services/student-visa", label: "Student Visa" },
    { href: "/services/japanese-language", label: "Japanese Language" },
    { href: "/services/ielts-class", label: "IELTS Class" },
    { href: "/services/pte-class", label: "PTE Class" },
    { href: "/services/computer-class", label: "Computer Class" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
    { href: "/book", label: "Book Consultation" },
  ],
};

const socialLinks = [
  { href: "https://facebook.com/thevisaghar", icon: Facebook, label: "Facebook" },
  { href: "https://instagram.com/thevisaghar", icon: Instagram, label: "Instagram" },
  { href: "https://linkedin.com/company/thevisaghar", icon: Linkedin, label: "LinkedIn" },
  { href: "https://wa.me/9779851338645", icon: WhatsApp, label: "WhatsApp" },
];

export function Footer() {
  return (
    <footer className="bg-navy text-white relative overflow-hidden" role="contentinfo">
      {/* Main Footer */}
      <div className="section-container py-20 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <Logo variant="white" size="md" />
            <p className="text-gray-300 text-sm leading-relaxed">
              Your trusted educational and immigration partner in Kathmandu. Enabling students from Nepal to achieve their dreams at world-class global academic institutions.
            </p>
            
            {/* Accreditation details */}
            <p className="text-xs text-gray-400 font-semibold leading-relaxed border-t border-white/5 pt-4">
              Govt. Regd. No: 319208/080/081 <br />
              Approved by MoEST (Ministry of Education, Science & Technology), Nepal.
            </p>

            {/* Social Icons */}
            <div className="flex gap-3 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-gold hover:bg-gold/20 flex items-center justify-center transition-all duration-300 hover:-translate-y-1 shadow-sm"
                  aria-label={`Visit our ${social.label}`}
                >
                  <social.icon size={18} className="text-gray-300 hover:text-gold transition-colors duration-300" />
                </a>
              ))}
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h3 className="text-gold font-bold text-xs uppercase tracking-widest mb-6">
              Our Services
            </h3>
            <ul className="space-y-3.5">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-gold hover:translate-x-1.5 text-sm transition-all duration-250 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-gold font-bold text-xs uppercase tracking-widest mb-6">
              Company
            </h3>
            <ul className="space-y-3.5">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-gold hover:translate-x-1.5 text-sm transition-all duration-250 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-gold font-bold text-xs uppercase tracking-widest mb-6">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="https://maps.google.com/?q=Boudha-6,+Pipalbot,+Kathmandu,+Nepal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-gray-300 hover:text-gold transition-colors duration-200 group/item"
                >
                  <MapPin size={18} className="text-gold mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-transform" />
                  <span className="text-sm">Boudha-6, Pipalbot, Kathmandu, Nepal</span>
                </a>
              </li>
              <li>
                <div className="space-y-2">
                  <a
                    href="tel:+97714913776"
                    className="flex items-center gap-3 text-gray-300 hover:text-gold transition-colors duration-200 group/item"
                  >
                    <Phone size={18} className="text-gold flex-shrink-0 group-hover/item:scale-110 transition-transform" />
                    <span className="text-sm">01-4913776</span>
                  </a>
                  <a
                    href="tel:+9779851338645"
                    className="flex items-center gap-3 text-gray-300 hover:text-gold transition-colors duration-200 group/item pl-[30px]"
                  >
                    <span className="text-sm">9851338645</span>
                  </a>
                </div>
              </li>
              <li>
                <a
                  href="mailto:info@thevisaghar.com"
                  className="flex items-center gap-3 text-gray-300 hover:text-gold transition-colors duration-200 group/item"
                >
                  <Mail size={18} className="text-gold flex-shrink-0 group-hover/item:scale-110 transition-transform" />
                  <span className="text-sm">info@thevisaghar.com</span>
                </a>
              </li>
            </ul>

            {/* Business Hours Box */}
            <div className="mt-6 p-5 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden group">
              <p className="text-gold text-xs font-bold uppercase tracking-wider">Business Hours</p>
              <p className="text-gray-300 text-sm mt-1.5 font-medium">Sun – Fri: 10:00 AM – 6:00 PM</p>
              <p className="text-gray-400 text-xs mt-0.5">Saturday: Closed</p>
              {/* Decorative plane icon on bottom right */}
              <Plane className="absolute right-4 bottom-4 w-10 h-10 text-gold/15 rotate-45 transform transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 bg-navy-dark/30 py-6">
        <div className="section-container flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p className="order-2 md:order-1 text-center md:text-left">
            © {new Date().getFullYear()} The Visa Ghar. All rights reserved.
          </p>
          <div className="order-1 md:order-2 flex items-center gap-6">
            <Link href="/privacy" className="hover:text-gold transition-colors duration-200">
              Privacy Policy
            </Link>
            <span className="text-white/10">|</span>
            <Link href="/terms" className="hover:text-gold transition-colors duration-200">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
