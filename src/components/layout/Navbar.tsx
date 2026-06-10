"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { Menu, X, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/countries", label: "Study Abroad" },
  { href: "/courses", label: "Test Prep" },
  { href: "/about", label: "About Us" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const isHome = pathname === "/";
  const showTransparent = isHome && !isScrolled;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          showTransparent
            ? "bg-transparent"
            : "bg-white/95 backdrop-blur-md shadow-md"
        }`}
      >
        <nav className="section-container flex items-center justify-between h-[72px]" aria-label="Main navigation">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0" aria-label="Go to homepage">
            <Logo variant={showTransparent ? "white" : "dark"} size="md" />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    showTransparent
                      ? isActive
                        ? "text-gold"
                        : "text-gray-300 hover:text-white hover:bg-white/10"
                      : isActive
                        ? "text-gold"
                        : "text-gray-700 hover:text-navy hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-4 right-4 h-0.5 bg-gold rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop CTA + Phone */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="tel:+97714913776"
              className={`flex items-center gap-2 text-sm font-medium ${
                showTransparent ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-navy"
              } transition-colors`}
            >
              <Phone size={16} />
              <span>01-4913776, 9851338645</span>
            </a>
            <Link
              href="/book"
              className="bg-gold hover:bg-gold-dark text-navy font-semibold text-sm px-6 py-2.5 rounded-lg transition-all duration-200 hover:shadow-gold transform hover:-translate-y-0.5"
            >
              Book Free Consultation
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              showTransparent ? "text-white hover:bg-white/10" : "text-gray-700 hover:bg-gray-100"
            }`}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[99] lg:hidden"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Mobile Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-[300px] bg-white shadow-xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <Logo variant="dark" size="sm" />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="p-6 space-y-1" aria-label="Mobile navigation">
                {navLinks.map((link, index) => {
                  const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                          isActive
                            ? "text-gold bg-navy/5"
                            : "text-gray-700 hover:text-navy hover:bg-gray-50"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <div className="p-6 space-y-4 border-t border-gray-100">
                <a
                  href="tel:+97714913776"
                  className="flex items-center gap-3 text-sm text-gray-600 hover:text-navy"
                >
                  <Phone size={16} />
                  01-4913776, 9851338645
                </a>
                <Link
                  href="/book"
                  className="block w-full text-center bg-gold hover:bg-gold-dark text-navy font-semibold text-sm px-6 py-3 rounded-lg transition-all duration-200"
                >
                  Book Free Consultation
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
