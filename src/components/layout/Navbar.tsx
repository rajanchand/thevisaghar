"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { Menu, X, ChevronDown, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavChild {
  href: string;
  label: string;
}

interface NavLink {
  href: string;
  label: string;
  children?: NavChild[];
}

const navLinks: NavLink[] = [
  { href: "/", label: "Home" },
  {
    href: "/services",
    label: "Services",
    children: [
      { href: "/services/student-visa", label: "Student Visa" },
      { href: "/services/ielts-class", label: "IELTS Preparation" },
      { href: "/services/pte-class", label: "PTE Preparation" },
      { href: "/services/japanese-language", label: "Japanese Language" },
      { href: "/services/computer-class", label: "Computer Class" },
    ],
  },
  {
    href: "/countries",
    label: "Study Abroad",
    children: [
      { href: "/countries/uk", label: "United Kingdom" },
      { href: "/countries/australia", label: "Australia" },
      { href: "/countries/usa", label: "USA" },
      { href: "/countries/canada", label: "Canada" },
      { href: "/countries/japan", label: "Japan" },
      { href: "/countries", label: "All destinations →" },
    ],
  },
  { href: "/courses", label: "Test Prep" },
  { href: "/tools", label: "Tools" },
  { href: "/success-stories", label: "Success Stories" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  }

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  const handleEnter = (label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDropdown(label);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpenDropdown(null), 120);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all border-b ${
          isScrolled
            ? "bg-surface/95 backdrop-blur-md border-border shadow-xs"
            : "bg-surface border-border-faint"
        }`}
        style={{ transitionDuration: "var(--duration-normal)" }}
      >
        <nav
          className="section-container flex items-center justify-between h-[72px]"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link href="/" className="flex-shrink-0" aria-label="Go to homepage">
            <Logo variant="dark" size="md" />
          </Link>

          {/* Desktop Links */}
          <div className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              const hasDropdown = !!link.children;

              return (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => hasDropdown && handleEnter(link.label)}
                  onMouseLeave={() => hasDropdown && handleLeave()}
                >
                  <Link
                    href={link.href}
                    className={`group flex items-center gap-1 px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors ${
                      isActive
                        ? "text-primary"
                        : "text-ink-light hover:text-ink hover:bg-surface-overlay"
                    }`}
                    style={{ transitionDuration: "var(--duration-fast)" }}
                  >
                    {link.label}
                    {hasDropdown && (
                      <ChevronDown
                        size={12}
                        className={`text-ink-faint transition-transform ${
                          openDropdown === link.label ? "rotate-180" : ""
                        }`}
                        style={{ transitionDuration: "var(--duration-fast)" }}
                      />
                    )}
                    {/* Active underline */}
                    <span
                      className={`absolute bottom-0 left-3.5 right-3.5 h-[2px] rounded-full transition-transform origin-left ${
                        isActive
                          ? "bg-accent scale-x-100"
                          : "bg-accent scale-x-0 group-hover:scale-x-100"
                      }`}
                      style={{ transitionDuration: "var(--duration-normal)" }}
                    />
                  </Link>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {hasDropdown && openDropdown === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.12 }}
                        className="absolute top-full left-0 pt-1 z-50"
                        onMouseEnter={() => handleEnter(link.label)}
                        onMouseLeave={handleLeave}
                      >
                        <div className="w-56 bg-surface-raised rounded-xl shadow-lg border border-border-faint overflow-hidden py-1.5">
                          {link.children?.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-ink-light hover:text-primary hover:bg-surface-overlay transition-colors"
                              style={{ transitionDuration: "var(--duration-fast)" }}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Desktop CTA */}
          <div className="hidden xl:flex items-center gap-5">
            <a
              href="tel:+97714913776"
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink-muted hover:text-primary transition-colors whitespace-nowrap"
              style={{ transitionDuration: "var(--duration-fast)" }}
            >
              <Phone size={12} className="text-accent" />
              <span className="whitespace-nowrap">01-4913776</span>
            </a>
            <Link
              href="/book"
              className="bg-accent hover:bg-accent-dark text-primary font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg transition-all hover:shadow-accent transform hover:-translate-y-px whitespace-nowrap"
              style={{ transitionDuration: "var(--duration-normal)" }}
            >
              Book Consultation
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg text-ink-light hover:bg-surface-overlay transition-colors"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </header>

      {/* ─── Mobile Menu ─── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[500] xl:hidden"
          >
            <div
              className="absolute inset-0 bg-ink/30 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="absolute right-0 top-0 bottom-0 w-[300px] bg-surface-raised shadow-xl flex flex-col border-l border-border-faint"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-border-faint bg-surface">
                <Logo variant="dark" size="sm" />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-ink-muted hover:bg-surface-overlay"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Links */}
              <nav className="flex-1 overflow-y-auto p-5 space-y-0.5" aria-label="Mobile navigation">
                {navLinks.map((link, i) => {
                  const isActive =
                    link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                  const hasChildren = !!link.children;
                  const isExpanded = mobileExpanded === link.label;

                  return (
                    <motion.div
                      key={link.label}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <div className="flex items-center">
                        <Link
                          href={link.href}
                          className={`flex-1 px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                            isActive
                              ? "text-primary bg-accent-muted/30"
                              : "text-ink-light hover:text-ink hover:bg-surface-overlay"
                          }`}
                        >
                          {link.label}
                        </Link>
                        {hasChildren && (
                          <button
                            onClick={() =>
                              setMobileExpanded(isExpanded ? null : link.label)
                            }
                            className="p-2 rounded-lg text-ink-faint hover:text-ink-muted"
                            aria-label={`Expand ${link.label}`}
                          >
                            <ChevronDown
                              size={14}
                              className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
                            />
                          </button>
                        )}
                      </div>

                      {/* Sub-links */}
                      <AnimatePresence>
                        {hasChildren && isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="pl-4 py-1 space-y-0.5">
                              {link.children?.map((child) => (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  className="block px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-ink-muted hover:text-primary rounded-lg hover:bg-surface-overlay transition-colors"
                                >
                                  {child.label}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Mobile footer */}
              <div className="p-5 space-y-3 border-t border-border-faint bg-surface">
                <a
                  href="tel:+97714913776"
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink-muted hover:text-primary"
                >
                  <Phone size={14} className="text-accent" />
                  01-4913776 / 9851338645
                </a>
                <Link
                  href="/book"
                  className="block w-full text-center bg-accent hover:bg-accent-dark text-primary font-bold text-xs uppercase tracking-wider py-3.5 rounded-lg transition-all"
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
