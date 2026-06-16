"use client";

import React, { useState } from "react";
import { countries } from "../../../../data/countries";
import {
  CheckCircle2,
  Calculator,
  Compass,
  FileText,
  ArrowRight,
  ShieldCheck,
  Scale,
  BookOpen
} from "lucide-react";
import Link from "next/link";

// Static exchange rates to NPR
const EXCHANGE_RATES: Record<string, number> = {
  UK: 172,       // GBP
  Australia: 91,  // AUD
  USA: 133,       // USD
  Canada: 98,     // CAD
  Japan: 0.86,    // JPY
  Finland: 144,   // EUR
};

const CURRENCY_SYMBOLS: Record<string, string> = {
  UK: "£",
  Australia: "A$",
  USA: "$",
  Canada: "C$",
  Japan: "¥",
  Finland: "€",
};

// Document requirements by country (supplemental checkpoints)
const BASIC_CHECKLIST = [
  "Valid Passport (at least 6 months validity remaining)",
  "All Academic Transcripts & Character Certificates (+2, Bachelor's)",
  "English Proficiency Test Report (IELTS / PTE) or JLPT N5",
  "No Objection Certificate (NOC) from Ministry of Education (MoEST), Nepal",
  "Relationship Verification Certificate from Local Ward",
  "Sponsorship Letter & Income Source Documents of Sponsors",
  "Bank Balance Certificate & 6-Month Statement of Sponsor Account",
];

const COUNTRY_SPECIFIC_CHECKLIST: Record<string, string[]> = {
  UK: [
    "TB (Tuberculosis) Test Certificate from IOM Kathmandu",
    "Confirmation of Acceptance for Studies (CAS) from UK University",
    "SOP (Statement of Purpose) tailored for UKVI",
  ],
  Australia: [
    "Confirmation of Enrolment (CoE) from Australian Provider",
    "Genuine Student (GS) Statement & Proof of Assets",
    "Overseas Student Health Cover (OSHC) Insurance Receipt",
  ],
  USA: [
    "Official SEVIS I-20 Form from US Institution",
    "SEVIS Fee Receipt ($350)",
    "DS-160 Confirmation Page & Visa Interview Schedule Page",
  ],
  Canada: [
    "Guaranteed Investment Certificate (GIC) receipt ($20,635 CAD)",
    "Letter of Acceptance (LOA) & Provincial Attestation Letter (PAL)",
    "CAQ (for institutions located in Quebec province)",
  ],
  Japan: [
    "Certificate of Eligibility (CoE) from Japanese Immigration Office",
    "150+ Hours of Japanese Language Study Certificate",
    "Sponsor Relationship & Educational Funding Source validation",
  ],
  Finland: [
    "Official Acceptance Letter from Finnish University",
    "Student Health Insurance Cover certificate (e.g., Swisscare)",
    "Proof of Funds in Student's Personal Bank Account (€560/month minimum)",
  ],
};

export default function ToolsDashboard() {
  const [activeTab, setActiveTab] = useState<"eligibility" | "cost" | "compare" | "checklist" | "score">("eligibility");

  // 1. Eligibility Check State
  const [degree, setDegree] = useState("Undergraduate (+2)");
  const [scoreType, setScoreType] = useState("Percentage");
  const [academicScore, setAcademicScore] = useState(70);
  const [englishScore, setEnglishScore] = useState(6.0);
  const [gapYears, setGapYears] = useState(0);
  const [targetCountry, setTargetCountry] = useState("UK");
  const [eligibilityResult, setEligibilityResult] = useState<{
    status: "Highly Eligible" | "Moderate Eligibility" | "Action Required";
    message: string;
    details: string[];
  } | null>(null);

  // 2. Cost Calculator State
  const [calcCountry, setCalcCountry] = useState("UK");
  const [calcLevel, setCalcLevel] = useState("Postgraduate");
  const [calcMonths, setCalcMonths] = useState(12);
  const [includeDependent, setIncludeDependent] = useState(false);

  // 3. Compare State
  const [compareA, setCompareA] = useState("UK");
  const [compareB, setCompareB] = useState("Australia");

  // 4. Checklist State
  const [checklistCountry, setChecklistCountry] = useState("UK");
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  // 5. Score Converter State
  const [ieltsVal, setIeltsVal] = useState<number>(6.5);

  // Handlers
  const handleCalculateEligibility = (e: React.FormEvent) => {
    e.preventDefault();
    const details: string[] = [];
    let warningCount = 0;

    // Academic threshold checks
    if (degree === "Postgraduate (Bachelor's)") {
      if (academicScore < 60 && scoreType === "Percentage") {
        details.push("Academic marks are slightly low for direct Master's admission (under 60%). You might need a Pre-Master's path.");
        warningCount++;
      } else if (academicScore < 2.5 && scoreType === "GPA") {
        details.push("GPA is below 2.5. Focus on universities that accept low GPA with work experience.");
        warningCount++;
      }
    } else {
      if (academicScore < 60 && scoreType === "Percentage") {
        details.push("High School marks are below 60%. Some universities might require a Foundation year.");
        warningCount++;
      } else if (academicScore < 2.4 && scoreType === "GPA") {
        details.push("GPA is below 2.4. A foundation or diploma entry pathway is recommended.");
        warningCount++;
      }
    }

    // English threshold checks
    if (englishScore < 6.0) {
      details.push("Your English proficiency score is below standard direct entry (6.0 IELTS / 50 PTE). Prepare for a pre-sessional English program or retake the test.");
      warningCount++;
    }

    // Gap checks
    if (gapYears > 2) {
      details.push(`You have a gap of ${gapYears} years. Ensure you have official salary certificates, CV records, or experience letters to justify this gap to visa officers.`);
      warningCount++;
    }

    // Specific country checks
    if (targetCountry === "Australia" && gapYears > 1) {
      details.push("Australia has a strict Genuine Student (GS) assessment regarding study gaps. A gap above 1 year requires thorough work and tax documentation.");
    }
    if (targetCountry === "Finland" && englishScore < 6.0) {
      details.push("Finland universities typically do not offer pre-sessional English courses. A minimum IELTS 6.0 (or equivalent PTE 54) is strictly mandatory.");
    }

    let status: "Highly Eligible" | "Moderate Eligibility" | "Action Required" = "Highly Eligible";
    let message = "Excellent profile! You meet the standard criteria for direct admission to top universities in your chosen country.";

    if (warningCount >= 2) {
      status = "Action Required";
      message = "Some profile factors need attention before submission. We recommend retaking the language test or preparing documentation for gaps.";
    } else if (warningCount === 1 || details.length > 0) {
      status = "Moderate Eligibility";
      message = "Profile is eligible, but has minor constraints. Focus on writing a strong Statement of Purpose (SOP) and selecting the right universities.";
    }

    if (details.length === 0) {
      details.push("Academic records align with standard entry requirements.");
      details.push("Language test score meets direct enrollment thresholds.");
      details.push("Study gap is within standard limits.");
    }

    setEligibilityResult({ status, message, details });
  };

  const getPteEquivalent = (ielts: number): number => {
    if (ielts <= 5.0) return 36;
    if (ielts <= 5.5) return 42;
    if (ielts <= 6.0) return 50;
    if (ielts <= 6.5) return 58;
    if (ielts <= 7.0) return 65;
    if (ielts <= 7.5) return 73;
    if (ielts <= 8.0) return 79;
    return 86;
  };

  const getToeflEquivalent = (ielts: number): number => {
    if (ielts <= 5.0) return 45;
    if (ielts <= 5.5) return 60;
    if (ielts <= 6.0) return 75;
    if (ielts <= 6.5) return 85;
    if (ielts <= 7.0) return 98;
    if (ielts <= 7.5) return 105;
    if (ielts <= 8.0) return 114;
    return 120;
  };

  const handleToggleChecklist = (item: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  // Compile calculations
  const calculateCosts = () => {
    const rate = EXCHANGE_RATES[calcCountry] || 1;
    const sym = CURRENCY_SYMBOLS[calcCountry] || "$";
    
    // Estimates based on country
    let baseTuition = 15000;
    let baseLivingMonthly = 1000;
    let visaFee = 500;
    let ancillary = 1000; // insurance, tb test, registration

    if (calcCountry === "UK") {
      baseTuition = calcLevel === "Undergraduate" ? 16000 : 18500;
      baseLivingMonthly = 1100; // outside London average
      visaFee = 490;
      ancillary = 776; // IHS surcharge per year
    } else if (calcCountry === "Australia") {
      baseTuition = calcLevel === "Undergraduate" ? 34000 : 38000;
      baseLivingMonthly = 2100;
      visaFee = 1600;
      ancillary = 650; // OSHC insurance
    } else if (calcCountry === "USA") {
      baseTuition = calcLevel === "Undergraduate" ? 28000 : 32000;
      baseLivingMonthly = 1500;
      visaFee = 185;
      ancillary = 1200; // health insurance
    } else if (calcCountry === "Finland") {
      baseTuition = calcLevel === "Undergraduate" ? 9000 : 12000;
      baseLivingMonthly = 670;
      visaFee = 350;
      ancillary = 300; // health insurance
    } else if (calcCountry === "Japan") {
      baseTuition = calcLevel === "Undergraduate" ? 800000 : 900000;
      baseLivingMonthly = 80000;
      visaFee = 30000;
      ancillary = 20000;
    } else if (calcCountry === "Canada") {
      baseTuition = calcLevel === "Undergraduate" ? 26000 : 28000;
      baseLivingMonthly = 1720;
      visaFee = 150;
      ancillary = 850;
    }

    const livingTotal = baseLivingMonthly * calcMonths;
    let tuitionTotal = baseTuition;
    let immigrationTotal = visaFee + ancillary;

    if (includeDependent) {
      tuitionTotal = tuitionTotal * 1.1; // estimate dependent tuition adjustments or extra fees
      immigrationTotal = immigrationTotal * 2;
    }

    const totalFCY = tuitionTotal + livingTotal + immigrationTotal;
    const totalNPR = totalFCY * rate;

    return {
      tuition: `${sym}${tuitionTotal.toLocaleString()}`,
      living: `${sym}${livingTotal.toLocaleString()}`,
      visa: `${sym}${immigrationTotal.toLocaleString()}`,
      totalFCY: `${sym}${totalFCY.toLocaleString()}`,
      totalNPR: `Rs. ${Math.round(totalNPR).toLocaleString()}`,
    };
  };

  const calcDetails = calculateCosts();

  // Find country entries for comparison
  const countryAData = countries.find((c) => c.name === compareA);
  const countryBData = countries.find((c) => c.name === compareB);

  return (
    <>
      {/* ─── Hero Section ───────────────────────────────────────────── */}
      <section className="pt-32 pb-16 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-[0.02]" />
        <div className="section-container relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-accent text-sm font-semibold uppercase tracking-wider mb-4 border border-white/15">
            Student Toolkit
          </span>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Study Abroad Interactive Tools
          </h1>
          <p
            className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Calculate realistic costs, compare global study destinations, convert test scores, and evaluate your visa eligibility.
          </p>
        </div>
      </section>

      {/* ─── Tools Tab Bar ──────────────────────────────────────────── */}
      <section className="py-6 border-b border-border-faint sticky top-[72px] bg-surface/95 backdrop-blur-md z-40">
        <div className="section-container">
          <div className="flex flex-wrap items-center justify-center gap-2" style={{ fontFamily: "var(--font-body)" }}>
            {(
              [
                { id: "eligibility", label: "Eligibility Check", icon: Compass },
                { id: "cost", label: "Cost Calculator", icon: Calculator },
                { id: "compare", label: "Compare Countries", icon: Scale },
                { id: "checklist", label: "Checklist Generator", icon: FileText },
                { id: "score", label: "Score Converter", icon: BookOpen },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "bg-primary text-accent shadow-xs"
                    : "bg-surface-sunken text-ink-light hover:bg-border/40 border border-border-faint"
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Active Tool Layout ─────────────────────────────────────── */}
      <section className="py-16 bg-surface min-h-[500px]">
        <div className="section-container max-w-4xl">
          
          {/* TAB 1: ELIGIBILITY CHECKER */}
          {activeTab === "eligibility" && (
            <div className="bg-surface-raised border border-border rounded-3xl p-8 shadow-sm space-y-8" style={{ fontFamily: "var(--font-body)" }}>
              <div>
                <h2
                  className="text-2xl font-bold text-primary mb-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Visa Eligibility Profiler
                </h2>
                <p className="text-ink-muted text-sm leading-relaxed">
                  Enter your current academic percentages and language grades to run a basic feasibility check for your target destination.
                </p>
              </div>

              <form onSubmit={handleCalculateEligibility} className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-border-faint pt-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-light mb-2">Highest Completed Degree</label>
                  <select
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-surface-sunken focus:bg-surface-raised focus:border-accent focus:ring-2 focus:ring-accent/25 outline-none text-sm font-semibold text-ink-light"
                  >
                    <option>Undergraduate (+2)</option>
                    <option>Postgraduate (Bachelor&apos;s)</option>
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink-light mb-2">Unit</label>
                    <select
                      value={scoreType}
                      onChange={(e) => {
                        setScoreType(e.target.value);
                        setAcademicScore(e.target.value === "GPA" ? 3.0 : 70);
                      }}
                      className="w-full px-3 py-3 rounded-xl border border-border bg-surface-sunken focus:bg-surface-raised focus:border-accent focus:ring-2 focus:ring-accent/25 outline-none text-sm font-semibold text-ink-light"
                    >
                      <option>Percentage</option>
                      <option>GPA</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink-light mb-2">Academic Score</label>
                    <input
                      type="number"
                      step={scoreType === "GPA" ? 0.05 : 1}
                      min={0}
                      max={scoreType === "GPA" ? 4.0 : 100}
                      value={academicScore}
                      onChange={(e) => setAcademicScore(parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-surface-sunken focus:bg-surface-raised focus:border-accent focus:ring-2 focus:ring-accent/25 outline-none text-sm font-semibold text-ink-light"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-light mb-2">Language Test Grade (IELTS Band Equivalent)</label>
                  <input
                    type="number"
                    step={0.5}
                    min={4.0}
                    max={9.0}
                    value={englishScore}
                    onChange={(e) => setEnglishScore(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-surface-sunken focus:bg-surface-raised focus:border-accent focus:ring-2 focus:ring-accent/25 outline-none text-sm font-semibold text-ink-light"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-light mb-2">Total Study Gap (Years)</label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={gapYears}
                    onChange={(e) => setGapYears(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-surface-sunken focus:bg-surface-raised focus:border-accent focus:ring-2 focus:ring-accent/25 outline-none text-sm font-semibold text-ink-light"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-light mb-2">Target Study Destination</label>
                  <select
                    value={targetCountry}
                    onChange={(e) => setTargetCountry(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-surface-sunken focus:bg-surface-raised focus:border-accent focus:ring-2 focus:ring-accent/25 outline-none text-sm font-semibold text-ink-light"
                  >
                    {countries.map((c) => (
                      <option key={c.slug} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2 pt-4">
                  <button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/95 text-white font-bold py-3.5 rounded-xl transition-all text-xs uppercase tracking-wider shadow-sm"
                  >
                    Evaluate Visa Feasibility
                  </button>
                </div>
              </form>

              {/* Assessment Output */}
              {eligibilityResult && (
                <div className="mt-8 border-t border-border pt-8 animate-fadeIn">
                  <div className="p-6 rounded-3xl bg-surface-sunken border border-border space-y-4">
                    <div className="flex items-center gap-3">
                      <span className={`w-3.5 h-3.5 rounded-full ${
                        eligibilityResult.status === "Highly Eligible"
                          ? "bg-success"
                          : eligibilityResult.status === "Moderate Eligibility"
                          ? "bg-accent"
                          : "bg-red-500"
                      }`} />
                      <h3
                        className="text-lg font-bold text-primary"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        Status: {eligibilityResult.status}
                      </h3>
                    </div>

                    <p className="text-sm text-ink-light font-medium leading-relaxed bg-surface-raised p-4 border border-border-faint rounded-xl">
                      {eligibilityResult.message}
                    </p>

                    <div className="space-y-2.5">
                      <span className="text-[10px] text-ink-faint font-bold uppercase tracking-wider block">Advisor Notes & Checks</span>
                      {eligibilityResult.details.map((detail, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm text-ink-muted leading-relaxed">
                          <CheckCircle2 size={16} className="text-accent mt-0.5 flex-shrink-0" />
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: COST CALCULATOR */}
          {activeTab === "cost" && (
            <div className="bg-surface-raised border border-border rounded-3xl p-8 shadow-sm space-y-8" style={{ fontFamily: "var(--font-body)" }}>
              <div>
                <h2
                  className="text-2xl font-bold text-primary mb-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Realistic Cost Estimator
                </h2>
                <p className="text-ink-muted text-sm leading-relaxed">
                  Compile tuition ranges, immigration charges, and standard living estimates converted to Nepali Rupees based on current market averages.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-border-faint pt-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-light mb-2">Destination Country</label>
                  <select
                    value={calcCountry}
                    onChange={(e) => setCalcCountry(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-surface-sunken focus:bg-surface-raised focus:border-accent focus:ring-2 focus:ring-accent/25 outline-none text-sm font-semibold text-ink-light"
                  >
                    {countries.map((c) => (
                      <option key={c.slug} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-light mb-2">Study Level</label>
                  <select
                    value={calcLevel}
                    onChange={(e) => setCalcLevel(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-surface-sunken focus:bg-surface-raised focus:border-accent focus:ring-2 focus:ring-accent/25 outline-none text-sm font-semibold text-ink-light"
                  >
                    <option>Undergraduate</option>
                    <option>Postgraduate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-light mb-2">Living Duration (Months)</label>
                  <input
                    type="number"
                    min={1}
                    max={24}
                    value={calcMonths}
                    onChange={(e) => setCalcMonths(parseInt(e.target.value) || 12)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-surface-sunken focus:bg-surface-raised focus:border-accent focus:ring-2 focus:ring-accent/25 outline-none text-sm font-semibold text-ink-light"
                  />
                </div>

                <div className="flex items-center pt-8">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeDependent}
                      onChange={(e) => setIncludeDependent(e.target.checked)}
                      className="w-4.5 h-4.5 rounded border-border text-accent focus:ring-accent"
                    />
                    <span className="text-sm font-semibold text-ink-light">Include Spouse / Dependent</span>
                  </label>
                </div>
              </div>

              {/* Outputs table */}
              <div className="border-t border-border pt-8 space-y-4">
                <h3
                  className="text-lg font-bold text-primary flex items-center gap-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <Calculator size={18} className="text-accent" /> Estimated Cost Breakdown
                </h3>

                <div className="bg-surface-sunken rounded-2xl border border-border overflow-hidden">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="bg-primary text-white text-[10px] font-bold uppercase tracking-wider border-b border-border">
                        <th className="px-5 py-3">Expense Item</th>
                        <th className="px-5 py-3">Estimated Cost (Foreign Currency)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-faint text-ink-light">
                      <tr>
                        <td className="px-5 py-4 font-semibold">1-Year Tuition Fee</td>
                        <td className="px-5 py-4 font-bold text-primary">{calcDetails.tuition}</td>
                      </tr>
                      <tr>
                        <td className="px-5 py-4 font-semibold">{calcMonths} Months Living Cost</td>
                        <td className="px-5 py-4 font-bold text-primary">{calcDetails.living}</td>
                      </tr>
                      <tr>
                        <td className="px-5 py-4 font-semibold">Visa & Medical Surcharges</td>
                        <td className="px-5 py-4 font-bold text-primary">{calcDetails.visa}</td>
                      </tr>
                      <tr className="bg-accent-muted/10">
                        <td className="px-5 py-4 font-bold text-primary uppercase">Grand Total (FCY)</td>
                        <td className="px-5 py-4 font-extrabold text-accent-dark">{calcDetails.totalFCY}</td>
                      </tr>
                      <tr className="bg-accent-muted/30">
                        <td className="px-5 py-5 font-bold text-primary uppercase text-base">Grand Total (NPR)</td>
                        <td className="px-5 py-5 font-extrabold text-primary text-lg">{calcDetails.totalNPR}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <span className="text-[10px] text-ink-faint block italic">
                  Note: Conversions are based on current indicative exchange rates (1 {CURRENCY_SYMBOLS[calcCountry]} = NPR {EXCHANGE_RATES[calcCountry]}). Actual university fees depend on course selection.
                </span>
              </div>
            </div>
          )}

          {/* TAB 3: COMPARE COUNTRIES */}
          {activeTab === "compare" && (
            <div className="bg-surface-raised border border-border rounded-3xl p-8 shadow-sm space-y-8" style={{ fontFamily: "var(--font-body)" }}>
              <div>
                <h2
                  className="text-2xl font-bold text-primary mb-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Side-by-Side Country Comparison
                </h2>
                <p className="text-ink-muted text-sm leading-relaxed">
                  Compare intakes, STAY-back visa years, tuition bands, and work rights between two student destinations side-by-side.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 border-t border-border-faint pt-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-light mb-2">Compare Destination A</label>
                  <select
                    value={compareA}
                    onChange={(e) => setCompareA(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-surface-sunken focus:bg-surface-raised focus:border-accent focus:ring-2 focus:ring-accent/25 outline-none text-sm font-semibold text-ink-light"
                  >
                    {countries.map((c) => (
                      <option key={c.slug} value={c.name} disabled={c.name === compareB}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-light mb-2">Compare Destination B</label>
                  <select
                    value={compareB}
                    onChange={(e) => setCompareB(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-surface-sunken focus:bg-surface-raised focus:border-accent focus:ring-2 focus:ring-accent/25 outline-none text-sm font-semibold text-ink-light"
                  >
                    {countries.map((c) => (
                      <option key={c.slug} value={c.name} disabled={c.name === compareA}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Comparison Output Table */}
              <div className="border-t border-border pt-8">
                <div className="bg-surface-sunken rounded-2xl border border-border overflow-hidden">
                  <table className="w-full border-collapse text-left text-sm text-ink-light">
                    <thead>
                      <tr className="bg-primary text-white text-[10px] font-bold uppercase tracking-wider border-b border-border">
                        <th className="px-5 py-3 w-1/3">Feature</th>
                        <th className="px-5 py-3 w-1/3">{compareA}</th>
                        <th className="px-5 py-3 w-1/3">{compareB}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-faint">
                      <tr>
                        <td className="px-5 py-4 font-bold bg-surface-raised">Language Requirements</td>
                        <td className="px-5 py-4">{countryAData?.englishRequirements || "—"}</td>
                        <td className="px-5 py-4">{countryBData?.englishRequirements || "—"}</td>
                      </tr>
                      <tr>
                        <td className="px-5 py-4 font-bold bg-surface-raised">Part-Time Work Allowance</td>
                        <td className="px-5 py-4">{countryAData?.workRights || "—"}</td>
                        <td className="px-5 py-4">{countryBData?.workRights || "—"}</td>
                      </tr>
                      <tr>
                        <td className="px-5 py-4 font-bold bg-surface-raised">Post-Study Work Stay-back</td>
                        <td className="px-5 py-4">{countryAData?.postStudyWork || "—"}</td>
                        <td className="px-5 py-4">{countryBData?.postStudyWork || "—"}</td>
                      </tr>
                      <tr>
                        <td className="px-5 py-4 font-bold bg-surface-raised">Intakes Available</td>
                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-1">
                            {countryAData?.intakes.map((i, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-accent-muted text-accent-dark rounded text-[10px] font-semibold">{i.name}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-1">
                            {countryBData?.intakes.map((i, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-accent-muted text-accent-dark rounded text-[10px] font-semibold">{i.name}</span>
                            ))}
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-5 py-4 font-bold bg-surface-raised">Estimated Yearly Cost</td>
                        <td className="px-5 py-4 font-semibold text-accent-dark">
                          {countryAData?.costs[0].range || "—"}
                        </td>
                        <td className="px-5 py-4 font-semibold text-accent-dark">
                          {countryBData?.costs[0].range || "—"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CHECKLIST GENERATOR */}
          {activeTab === "checklist" && (
            <div className="bg-surface-raised border border-border rounded-3xl p-8 shadow-sm space-y-8" style={{ fontFamily: "var(--font-body)" }}>
              <div>
                <h2
                  className="text-2xl font-bold text-primary mb-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Document Checklist Builder
                </h2>
                <p className="text-ink-muted text-sm leading-relaxed">
                  Generate the exact listing of forms, financial logs, and test transcripts needed for your university admission and student visa filings.
                </p>
              </div>

              <div className="border-t border-border-faint pt-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-light mb-2">Destination Country</label>
                <select
                  value={checklistCountry}
                  onChange={(e) => {
                    setChecklistCountry(e.target.value);
                    setCheckedItems({}); // resetchecked list on country swap
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-surface-sunken focus:bg-surface-raised focus:border-accent focus:ring-2 focus:ring-accent/25 outline-none text-sm font-semibold text-ink-light"
                >
                  {countries.map((c) => (
                    <option key={c.slug} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Checklist list */}
              <div className="space-y-4 border-t border-border pt-8">
                <h3
                  className="text-lg font-bold text-primary flex items-center gap-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <ShieldCheck className="text-accent" /> Custom Checklist for {checklistCountry}
                </h3>

                <div className="space-y-3">
                  {[...BASIC_CHECKLIST, ...(COUNTRY_SPECIFIC_CHECKLIST[checklistCountry] || [])].map((item, idx) => {
                    const isChecked = !!checkedItems[item];
                    return (
                      <div
                        key={idx}
                        onClick={() => handleToggleChecklist(item)}
                        className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                          isChecked
                            ? "bg-accent-muted/20 border-accent/70 opacity-70 line-through"
                            : "bg-surface-raised border-border hover:border-accent/30"
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          isChecked ? "border-accent bg-accent" : "border-border"
                        }`}>
                          {isChecked && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                        </div>
                        <span className="text-sm font-semibold text-ink-light">{item}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SCORE CONVERTER */}
          {activeTab === "score" && (
            <div className="bg-surface-raised border border-border rounded-3xl p-8 shadow-sm space-y-8" style={{ fontFamily: "var(--font-body)" }}>
              <div>
                <h2
                  className="text-2xl font-bold text-primary mb-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  IELTS / PTE Score Converter
                </h2>
                <p className="text-ink-muted text-sm leading-relaxed">
                  Compare academic bands between the Pearson Test of English (PTE) and IELTS Academic requirements instantly.
                </p>
              </div>

              <div className="border-t border-border-faint pt-6 space-y-6">
                <div>
                  <div className="flex justify-between font-bold text-sm text-primary mb-2">
                    <span>IELTS Band:</span>
                    <span className="text-accent-dark">{ieltsVal.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="5.0"
                    max="9.0"
                    step="0.5"
                    value={ieltsVal}
                    onChange={(e) => setIeltsVal(parseFloat(e.target.value))}
                    className="w-full h-2 bg-surface-sunken rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                  <div className="flex justify-between text-[10px] text-ink-faint font-bold mt-1">
                    <span>5.0 (Basic)</span>
                    <span>6.5 (Standard Competency)</span>
                    <span>9.0 (Expert)</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border-faint">
                  <div className="bg-surface-sunken rounded-2xl p-5 border border-border text-center">
                    <span className="text-[10px] uppercase tracking-wider text-ink-faint font-bold block mb-1">Equivalent PTE Academic</span>
                    <span className="text-3xl font-extrabold text-primary">{getPteEquivalent(ieltsVal)}</span>
                  </div>
                  <div className="bg-surface-sunken rounded-2xl p-5 border border-border text-center">
                    <span className="text-[10px] uppercase tracking-wider text-ink-faint font-bold block mb-1">Equivalent TOEFL iBT</span>
                    <span className="text-3xl font-extrabold text-primary">{getToeflEquivalent(ieltsVal)}</span>
                  </div>
                </div>

                <div className="p-4 bg-accent-muted/10 border border-accent/10 rounded-2xl text-xs text-ink-muted leading-relaxed font-semibold">
                  Note: PTE and IELTS equivalents align with official concordances mapped by Pearson and the British Council. Standard universities in Australia require a minimum of PTE 58, whereas USA/UK programs standardly require IELTS 6.5.
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* ─── Consulting CTA ─────────────────────────────────────────── */}
      <section className="py-16 bg-surface-sunken border-t border-border-faint text-center">
        <div className="section-container max-w-xl mx-auto space-y-6" style={{ fontFamily: "var(--font-body)" }}>
          <h2
            className="text-2xl md:text-3xl font-bold text-primary"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Need a Professional Document Review?
          </h2>
          <p className="text-ink-muted text-sm md:text-base leading-relaxed">
            Submit your transcripts, work letters, and relationship certificates to our Kathmandu office for a detailed authenticity review. One-on-one assessments are always free.
          </p>
          <div className="pt-2">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-primary font-bold px-8 py-4 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 shadow-accent text-sm uppercase tracking-wider"
            >
              Book Advisory Session <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
