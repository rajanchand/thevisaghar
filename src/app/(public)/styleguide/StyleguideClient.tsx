"use client";

import React, { useState } from "react";
import { ArrowRight, Check, AlertCircle, Mail, ChevronDown } from "lucide-react";

/* ─── Color Swatch ─── */
function Swatch({ name, variable, hex }: { name: string; variable: string; hex: string }) {
  return (
    <div className="flex flex-col">
      <div
        className="w-full aspect-[4/3] rounded-xl border border-border-faint shadow-sm"
        style={{ backgroundColor: hex }}
      />
      <p className="mt-2 text-sm font-semibold text-ink">{name}</p>
      <p className="text-xs text-ink-muted font-mono">{variable}</p>
      <p className="text-xs text-ink-faint font-mono">{hex}</p>
    </div>
  );
}

/* ─── Section wrapper ─── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-20">
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-2xl font-bold text-ink" style={{ fontFamily: "var(--font-display)" }}>
          {title}
        </h2>
        <div className="flex-1 h-px bg-border" />
      </div>
      {children}
    </section>
  );
}

export function StyleguideClient() {
  const [formState, setFormState] = useState({ name: "", email: "", select: "", agree: false });
  const [formSubmitted, setFormSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-surface pt-[72px]">
      {/* Header */}
      <div className="bg-primary text-white py-16">
        <div className="section-container">
          <p className="text-accent text-sm font-semibold uppercase tracking-[0.15em] mb-3">
            The Visa Ghar
          </p>
          <h1
            className="text-4xl md:text-5xl font-extrabold text-white leading-[1.1] mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Design System
          </h1>
          <p className="text-white/70 max-w-xl text-lg leading-relaxed">
            Colours, typography, components, and spacing — the foundation of every page
            on thevisaghar.com. This page is an internal reference.
          </p>
        </div>
      </div>

      <div className="section-container py-16">
        {/* ─── COLOURS ─── */}
        <Section title="Colours">
          <h3 className="text-lg font-semibold text-ink mb-4">Brand</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5 mb-10">
            <Swatch name="Primary" variable="--color-primary" hex="#0E3B2E" />
            <Swatch name="Primary Light" variable="--color-primary-light" hex="#1A5C47" />
            <Swatch name="Primary Dark" variable="--color-primary-dark" hex="#082920" />
            <Swatch name="Accent" variable="--color-accent" hex="#E1A106" />
            <Swatch name="Accent Light" variable="--color-accent-light" hex="#F0BD3E" />
          </div>

          <h3 className="text-lg font-semibold text-ink mb-4">Surfaces</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5 mb-10">
            <Swatch name="Surface" variable="--color-surface" hex="#FBF8F3" />
            <Swatch name="Surface Raised" variable="--color-surface-raised" hex="#FFFFFF" />
            <Swatch name="Surface Sunken" variable="--color-surface-sunken" hex="#F3EDE3" />
          </div>

          <h3 className="text-lg font-semibold text-ink mb-4">Text</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5 mb-10">
            <Swatch name="Ink" variable="--color-ink" hex="#1A1A17" />
            <Swatch name="Ink Light" variable="--color-ink-light" hex="#3D3D37" />
            <Swatch name="Ink Muted" variable="--color-ink-muted" hex="#6B6B63" />
            <Swatch name="Ink Faint" variable="--color-ink-faint" hex="#9C9C91" />
          </div>

          <h3 className="text-lg font-semibold text-ink mb-4">Semantic</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            <Swatch name="Success" variable="--color-success" hex="#1B7A4E" />
            <Swatch name="Warning" variable="--color-warning" hex="#C08D05" />
            <Swatch name="Error" variable="--color-error" hex="#C0392B" />
            <Swatch name="Info" variable="--color-info" hex="#2874A6" />
          </div>
        </Section>

        {/* ─── TYPOGRAPHY ─── */}
        <Section title="Typography">
          <div className="space-y-8">
            <div className="p-6 bg-surface-raised rounded-xl border border-border-faint">
              <p className="text-xs uppercase tracking-[0.15em] text-ink-faint font-semibold mb-4">
                Display / Headings — Fraunces
              </p>
              <div className="space-y-4">
                {[
                  { tag: "h1", size: "text-5xl (3.052rem)", weight: "800" },
                  { tag: "h2", size: "text-4xl (2.441rem)", weight: "700" },
                  { tag: "h3", size: "text-3xl (1.953rem)", weight: "700" },
                  { tag: "h4", size: "text-2xl (1.563rem)", weight: "700" },
                  { tag: "h5", size: "text-xl (1.25rem)", weight: "600" },
                  { tag: "h6", size: "text-lg (1.125rem)", weight: "600" },
                ].map((item) => (
                  <div key={item.tag} className="flex items-baseline gap-4 border-b border-border-faint pb-3 last:border-0 last:pb-0">
                    <span className="text-xs font-mono text-ink-faint w-8">{item.tag}</span>
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: `var(--text-${item.tag.replace("h", "") === "1" ? "5xl" : item.tag.replace("h", "") === "2" ? "4xl" : item.tag.replace("h", "") === "3" ? "3xl" : item.tag.replace("h", "") === "4" ? "2xl" : item.tag.replace("h", "") === "5" ? "xl" : "lg"})`,
                        fontWeight: item.weight,
                        lineHeight: 1.15,
                      }}
                      className="text-ink"
                    >
                      Study Abroad Consultancy
                    </span>
                    <span className="text-xs text-ink-faint ml-auto font-mono hidden sm:inline">
                      {item.size}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-surface-raised rounded-xl border border-border-faint">
              <p className="text-xs uppercase tracking-[0.15em] text-ink-faint font-semibold mb-4">
                Body / UI — Hanken Grotesk
              </p>
              <div className="space-y-4">
                {[
                  { name: "text-lg", size: "1.125rem", sample: "Large body text for introductions and callouts." },
                  { name: "text-base", size: "1rem", sample: "Default body text. The Visa Ghar helps Nepali students achieve their study abroad goals through expert counselling, test preparation, and visa guidance." },
                  { name: "text-sm", size: "0.875rem", sample: "Small text for secondary information, captions, and metadata." },
                  { name: "text-xs", size: "0.75rem", sample: "EXTRA SMALL — LABELS, BADGES, TAGS" },
                ].map((item) => (
                  <div key={item.name} className="border-b border-border-faint pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-mono text-ink-faint">{item.name}</span>
                      <span className="text-xs font-mono text-ink-faint">({item.size})</span>
                    </div>
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: item.size,
                        lineHeight: 1.65,
                      }}
                      className="text-ink-light max-w-prose"
                    >
                      {item.sample}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* ─── BUTTONS ─── */}
        <Section title="Buttons">
          <div className="space-y-8">
            <div className="flex flex-wrap gap-4 items-center">
              <button className="bg-accent hover:bg-accent-dark text-ink font-semibold text-sm px-6 py-2.5 rounded-lg transition-all hover:shadow-accent transform hover:-translate-y-px">
                Primary action
              </button>
              <button className="bg-primary hover:bg-primary-light text-white font-semibold text-sm px-6 py-2.5 rounded-lg transition-all hover:shadow-lg transform hover:-translate-y-px">
                Secondary action
              </button>
              <button className="border border-border-strong text-ink-light hover:text-ink hover:border-ink-muted font-medium text-sm px-6 py-2.5 rounded-lg transition-all">
                Outlined
              </button>
              <button className="text-primary hover:text-primary-light font-medium text-sm px-4 py-2.5 rounded-lg hover:bg-primary-muted transition-all">
                Ghost
              </button>
              <button
                disabled
                className="bg-border text-ink-faint font-medium text-sm px-6 py-2.5 rounded-lg cursor-not-allowed"
              >
                Disabled
              </button>
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              <button className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-ink font-semibold text-sm px-6 py-3 rounded-lg transition-all hover:shadow-accent">
                Book Free Counselling
                <ArrowRight size={16} />
              </button>
              <button className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-white font-semibold text-sm px-6 py-3 rounded-lg transition-all">
                Explore Destinations
                <ArrowRight size={16} />
              </button>
            </div>

            <div>
              <p className="text-sm text-ink-muted mb-3">Small / compact</p>
              <div className="flex flex-wrap gap-3 items-center">
                <button className="bg-accent text-ink font-semibold text-xs px-4 py-1.5 rounded-md">
                  Small primary
                </button>
                <button className="border border-border-strong text-ink-light text-xs font-medium px-4 py-1.5 rounded-md">
                  Small outlined
                </button>
              </div>
            </div>
          </div>
        </Section>

        {/* ─── FORM FIELDS ─── */}
        <Section title="Form Fields">
          <div className="max-w-lg space-y-6">
            {/* Text input */}
            <div>
              <label htmlFor="sg-name" className="block text-sm font-medium text-ink mb-1.5">
                Full name
              </label>
              <input
                id="sg-name"
                type="text"
                placeholder="e.g. Sachita Lamichhane"
                value={formState.name}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface-raised text-ink text-sm placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
              />
            </div>

            {/* Email with validation hint */}
            <div>
              <label htmlFor="sg-email" className="block text-sm font-medium text-ink mb-1.5">
                Email address
              </label>
              <input
                id="sg-email"
                type="email"
                placeholder="you@example.com"
                value={formState.email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface-raised text-ink text-sm placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
              />
              <p className="mt-1.5 text-xs text-ink-faint flex items-center gap-1">
                <Mail size={12} />
                We will never share your email.
              </p>
            </div>

            {/* Select */}
            <div>
              <label htmlFor="sg-country" className="block text-sm font-medium text-ink mb-1.5">
                Preferred country
              </label>
              <div className="relative">
                <select
                  id="sg-country"
                  value={formState.select}
                  onChange={(e) => setFormState({ ...formState, select: e.target.value })}
                  className="w-full appearance-none px-4 py-2.5 pr-10 rounded-lg border border-border bg-surface-raised text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                >
                  <option value="">Select a country</option>
                  <option value="uk">United Kingdom</option>
                  <option value="au">Australia</option>
                  <option value="us">USA</option>
                  <option value="ca">Canada</option>
                  <option value="jp">Japan</option>
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint pointer-events-none"
                />
              </div>
            </div>

            {/* Textarea */}
            <div>
              <label htmlFor="sg-message" className="block text-sm font-medium text-ink mb-1.5">
                Message
              </label>
              <textarea
                id="sg-message"
                rows={3}
                placeholder="Tell us about your study abroad plans..."
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface-raised text-ink text-sm placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all resize-y"
              />
            </div>

            {/* Checkbox */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="sg-agree"
                checked={formState.agree}
                onChange={(e) => setFormState({ ...formState, agree: e.target.checked })}
                className="mt-0.5 w-4 h-4 rounded border-border text-accent focus:ring-accent"
              />
              <label htmlFor="sg-agree" className="text-sm text-ink-light">
                I agree to the privacy policy and consent to being contacted about study abroad services.
              </label>
            </div>

            {/* Error state example */}
            <div>
              <label className="block text-sm font-medium text-error mb-1.5">
                Phone (error state)
              </label>
              <input
                type="tel"
                placeholder="98XXXXXXXX"
                className="w-full px-4 py-2.5 rounded-lg border-2 border-error bg-error-light text-ink text-sm placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-error"
                defaultValue="abc"
              />
              <p className="mt-1.5 text-xs text-error flex items-center gap-1">
                <AlertCircle size={12} />
                Please enter a valid Nepali phone number.
              </p>
            </div>

            {/* Success state */}
            <div>
              <label className="block text-sm font-medium text-success mb-1.5">
                Passport number (success state)
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 rounded-lg border-2 border-success bg-success-light text-ink text-sm focus:outline-none focus:ring-2 focus:ring-success"
                defaultValue="12345678"
              />
              <p className="mt-1.5 text-xs text-success flex items-center gap-1">
                <Check size={12} />
                Valid passport number format.
              </p>
            </div>

            {/* Submit button */}
            <div className="pt-2">
              <button
                onClick={() => setFormSubmitted(true)}
                className="bg-accent hover:bg-accent-dark text-ink font-semibold text-sm px-8 py-3 rounded-lg transition-all hover:shadow-accent inline-flex items-center gap-2"
              >
                {formSubmitted ? (
                  <>
                    <Check size={16} />
                    Submitted
                  </>
                ) : (
                  "Submit Enquiry"
                )}
              </button>
              {formSubmitted && (
                <p className="mt-2 text-sm text-success">
                  Thank you! Our team will be in touch within 24 hours.
                </p>
              )}
            </div>
          </div>
        </Section>

        {/* ─── CARDS ─── */}
        <Section title="Cards">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Basic card */}
            <div className="bg-surface-raised rounded-2xl border border-border-faint p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-primary-muted flex items-center justify-center mb-4">
                <span className="text-primary text-lg">🎓</span>
              </div>
              <h4 className="text-lg font-bold text-ink mb-2" style={{ fontFamily: "var(--font-display)" }}>
                Student Visa
              </h4>
              <p className="text-sm text-ink-muted leading-relaxed">
                End-to-end guidance from university selection through visa approval.
              </p>
            </div>

            {/* Accent card */}
            <div className="bg-primary rounded-2xl p-6 text-white">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-4">
                <span className="text-accent text-lg">📊</span>
              </div>
              <h4
                className="text-lg font-bold text-white mb-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Cost Calculator
              </h4>
              <p className="text-sm text-white/70 leading-relaxed">
                Estimate your tuition, living costs, and visa fees for any destination.
              </p>
            </div>

            {/* Bordered card with hover lift */}
            <div className="bg-surface-raised rounded-2xl border border-border p-6 hover:border-accent hover:-translate-y-1 transition-all cursor-pointer group">
              <div className="w-10 h-10 rounded-lg bg-accent-muted flex items-center justify-center mb-4">
                <span className="text-lg">🇬🇧</span>
              </div>
              <h4
                className="text-lg font-bold text-ink mb-2 group-hover:text-primary transition-colors"
                style={{ fontFamily: "var(--font-display)" }}
              >
                United Kingdom
              </h4>
              <p className="text-sm text-ink-muted leading-relaxed mb-4">
                Fast-track degrees and a 2-year post-study work visa.
              </p>
              <span className="text-sm font-semibold text-primary group-hover:text-accent transition-colors inline-flex items-center gap-1">
                Learn more <ArrowRight size={14} />
              </span>
            </div>
          </div>
        </Section>

        {/* ─── SPACING ─── */}
        <Section title="Spacing Scale">
          <div className="space-y-3">
            {[
              { name: "--space-1", px: "4px", rem: "0.25rem" },
              { name: "--space-2", px: "8px", rem: "0.5rem" },
              { name: "--space-3", px: "12px", rem: "0.75rem" },
              { name: "--space-4", px: "16px", rem: "1rem" },
              { name: "--space-6", px: "24px", rem: "1.5rem" },
              { name: "--space-8", px: "32px", rem: "2rem" },
              { name: "--space-12", px: "48px", rem: "3rem" },
              { name: "--space-16", px: "64px", rem: "4rem" },
              { name: "--space-24", px: "96px", rem: "6rem" },
            ].map((s) => (
              <div key={s.name} className="flex items-center gap-4">
                <span className="text-xs font-mono text-ink-faint w-28">{s.name}</span>
                <div
                  className="h-5 bg-accent/30 rounded-sm border border-accent/40"
                  style={{ width: s.rem }}
                />
                <span className="text-xs text-ink-muted">
                  {s.px} / {s.rem}
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/* ─── BORDERS ─── */}
        <Section title="Borders & Radius">
          <div className="flex flex-wrap gap-6">
            {[
              { name: "radius-sm", val: "0.25rem" },
              { name: "radius-md", val: "0.5rem" },
              { name: "radius-lg", val: "0.75rem" },
              { name: "radius-xl", val: "1rem" },
              { name: "radius-2xl", val: "1.5rem" },
              { name: "radius-full", val: "9999px" },
            ].map((r) => (
              <div key={r.name} className="text-center">
                <div
                  className="w-16 h-16 bg-primary-muted border border-primary/20"
                  style={{ borderRadius: r.val }}
                />
                <p className="text-xs text-ink-faint mt-2 font-mono">{r.name}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ─── SHADOWS ─── */}
        <Section title="Shadows">
          <div className="flex flex-wrap gap-8">
            {[
              { name: "shadow-sm", val: "0 1px 2px 0 rgba(26,26,23,0.04)" },
              { name: "shadow-md", val: "0 4px 12px -2px rgba(26,26,23,0.06), 0 2px 4px -2px rgba(26,26,23,0.04)" },
              { name: "shadow-lg", val: "0 12px 24px -4px rgba(26,26,23,0.08), 0 4px 8px -4px rgba(26,26,23,0.04)" },
              { name: "shadow-xl", val: "0 20px 40px -8px rgba(26,26,23,0.1), 0 8px 16px -6px rgba(26,26,23,0.05)" },
              { name: "shadow-accent", val: "0 4px 14px 0 rgba(225,161,6,0.2)" },
            ].map((s) => (
              <div key={s.name} className="text-center">
                <div
                  className="w-24 h-24 bg-surface-raised rounded-xl"
                  style={{ boxShadow: s.val }}
                />
                <p className="text-xs text-ink-faint mt-3 font-mono">{s.name}</p>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}
