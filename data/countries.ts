/**
 * Countries — structured content layer
 * Each country has summary data for the index page and
 * placeholder fields for the detail page template.
 */

export interface IntakePeriod {
  name: string;
  months: string;
  deadline: string;
}

export interface CostRow {
  item: string;
  range: string;
  note?: string;
}

export interface Country {
  name: string;
  slug: string;
  code: string;
  flag: string;
  tagline: string;
  description: string;
  whyStudy: string[];
  costs: CostRow[];
  costSummary: string;
  intakes: IntakePeriod[];
  englishRequirements: string;
  workRights: string;
  postStudyWork: string;
  scholarships: string;
  faq: { question: string; answer: string }[];
}

export const countries: Country[] = [
  {
    name: "United Kingdom",
    slug: "uk",
    code: "GB",
    flag: "🇬🇧",
    tagline: "Shorter degrees, strong graduate routes",
    description:
      "The UK offers intensive, shorter-duration degrees — a one-year Masters and three-year Bachelors — saving you time and living costs while studying at some of the world's most respected institutions.",
    whyStudy: [
      "Masters programmes typically complete in 12 months",
      "2-year Graduate Route visa after completing your degree",
      "Home to globally ranked universities (Russell Group, etc.)",
      "Vibrant, multicultural student cities",
    ],
    costs: [
      { item: "Tuition (undergraduate)", range: "£12,000 – £25,000/year", note: "Varies by university and course" },
      { item: "Tuition (postgraduate)", range: "£14,000 – £30,000/year" },
      { item: "Living costs (Home Office minimum)", range: "£1,334/month (London) or £1,023/month (outside London)" },
      { item: "IHS (visa health surcharge)", range: "£776/year" },
      { item: "Visa application fee", range: "£490" },
    ],
    costSummary: "GBP 12,000 – 25,000 per year (tuition)",
    intakes: [
      { name: "September/October", months: "Sep – Oct", deadline: "Apply by June for most universities" },
      { name: "January/February", months: "Jan – Feb", deadline: "Apply by October–November" },
    ],
    englishRequirements: "IELTS 6.0–7.0 (Academic) or equivalent PTE/TOEFL, depending on course and university.",
    workRights: "Up to 20 hours/week during term time; full-time during holidays.",
    postStudyWork: "2-year Graduate Route visa (no sponsor needed). 3 years for PhD graduates.",
    scholarships: "Chevening, Commonwealth, GREAT scholarships, and university-specific awards. We help identify and apply for scholarships you're eligible for.",
    faq: [
      { question: "How long does a UK student visa take?", answer: "Typically 3–6 weeks from the date of your visa appointment. Priority services can reduce this." },
      { question: "Can my family join me?", answer: "Dependants can apply if you're on a course longer than 6 months at postgraduate level." },
    ],
  },
  {
    name: "Australia",
    slug: "australia",
    code: "AU",
    flag: "🇦🇺",
    tagline: "Strong post-study work rights, high quality of life",
    description:
      "Australia combines world-class universities with generous post-study work visas and a high quality of life. Cities like Melbourne, Sydney, and Brisbane are consistently ranked among the best student cities globally.",
    whyStudy: [
      "Post-study work visa (subclass 485) for 2–4+ years",
      "Generous part-time work allowance during studies",
      "High quality of life and multicultural campuses",
      "Strong industry connections and practical learning",
    ],
    costs: [
      { item: "Tuition (undergraduate)", range: "AUD 22,000 – 45,000/year" },
      { item: "Tuition (postgraduate)", range: "AUD 25,000 – 50,000/year" },
      { item: "Living costs (immigration minimum)", range: "AUD 24,505/year" },
      { item: "OSHC (health insurance)", range: "AUD 500 – 700/year" },
      { item: "Visa application fee", range: "AUD 710" },
    ],
    costSummary: "AUD 22,000 – 40,000 per year (tuition)",
    intakes: [
      { name: "February/March", months: "Feb – Mar", deadline: "Apply by October–November" },
      { name: "July", months: "Jul", deadline: "Apply by March–April" },
    ],
    englishRequirements: "IELTS 6.0–6.5 (Academic) or equivalent PTE, depending on course.",
    workRights: "Up to 48 hours per fortnight during term; unlimited during breaks.",
    postStudyWork: "2–4+ years depending on qualification and location.",
    scholarships: "Australia Awards, Destination Australia, university merit scholarships.",
    faq: [
      { question: "Is Australia expensive for Nepali students?", answer: "Living costs are higher than some destinations, but part-time work earnings are strong (minimum wage ~AUD 23/hour) and help offset expenses." },
    ],
  },
  {
    name: "USA",
    slug: "usa",
    code: "US",
    flag: "🇺🇸",
    tagline: "Research excellence, flexible curricula",
    description:
      "The United States offers a diverse selection of higher education institutions, from Ivy League research universities to community colleges. The flexible credit system lets you explore subjects before declaring a major.",
    whyStudy: [
      "Home to many of the world's top-ranked universities",
      "OPT (Optional Practical Training) post-study work for up to 3 years (STEM)",
      "Flexible curriculum — explore before you specialise",
      "Generous scholarship and assistantship opportunities",
    ],
    costs: [
      { item: "Tuition (undergraduate)", range: "USD 20,000 – 55,000/year" },
      { item: "Tuition (postgraduate)", range: "USD 25,000 – 60,000/year" },
      { item: "Living costs", range: "USD 12,000 – 20,000/year" },
      { item: "SEVIS fee", range: "USD 350" },
      { item: "Visa application fee", range: "USD 185" },
    ],
    costSummary: "USD 20,000 – 45,000 per year (tuition)",
    intakes: [
      { name: "Fall (August/September)", months: "Aug – Sep", deadline: "Apply by January–March for most universities" },
      { name: "Spring (January)", months: "Jan", deadline: "Apply by September–October" },
    ],
    englishRequirements: "TOEFL 80–100 iBT or IELTS 6.5–7.0, depending on university.",
    workRights: "Up to 20 hours/week on campus during term.",
    postStudyWork: "12 months OPT; up to 36 months for STEM graduates.",
    scholarships: "Fulbright, university merit-based aid, assistantships. Many universities offer need-based aid for international students.",
    faq: [
      { question: "Is the F-1 visa interview difficult?", answer: "It's a short interview. We prepare you with mock sessions covering common questions, financial documentation, and how to demonstrate your intent to return." },
    ],
  },
  {
    name: "Canada",
    slug: "canada",
    code: "CA",
    flag: "🇨🇦",
    tagline: "Clear pathway from study to permanent residency",
    description:
      "Canada combines affordable tuition, a welcoming multicultural society, and one of the most straightforward post-study work and immigration pathways in the world.",
    whyStudy: [
      "PGWP (Post-Graduation Work Permit) for up to 3 years",
      "Clear pathway from PGWP to permanent residency",
      "Lower tuition than the US or UK for many programmes",
      "Safe, welcoming, and multicultural society",
    ],
    costs: [
      { item: "Tuition (undergraduate)", range: "CAD 15,000 – 35,000/year" },
      { item: "Tuition (postgraduate)", range: "CAD 15,000 – 40,000/year" },
      { item: "Living costs (IRCC minimum)", range: "CAD 13,757/year" },
      { item: "Visa application fee", range: "CAD 150" },
      { item: "Biometrics", range: "CAD 85" },
    ],
    costSummary: "CAD 15,000 – 30,000 per year (tuition)",
    intakes: [
      { name: "September", months: "Sep", deadline: "Apply by January–March" },
      { name: "January", months: "Jan", deadline: "Apply by June–August" },
      { name: "May (select programmes)", months: "May", deadline: "Apply by December–January" },
    ],
    englishRequirements: "IELTS 6.0–6.5 or equivalent PTE.",
    workRights: "Up to 20 hours/week during term; full-time during scheduled breaks.",
    postStudyWork: "PGWP for up to 3 years depending on programme length.",
    scholarships: "Vanier CGS, university entrance awards, province-specific scholarships.",
    faq: [
      { question: "Can I get PR after studying in Canada?", answer: "Yes. Canada's Express Entry and Provincial Nominee Programs give significant points for Canadian education and work experience." },
    ],
  },
  {
    name: "New Zealand",
    slug: "new-zealand",
    code: "NZ",
    flag: "🇳🇿",
    tagline: "Practical learning in a safe, scenic environment",
    description:
      "New Zealand combines academic quality with a practical, hands-on approach to education, all in one of the safest and most scenic countries in the world.",
    whyStudy: [
      "Practical, industry-connected learning",
      "Post-study work visa for up to 3 years",
      "High safety standards and friendly communities",
      "Beautiful natural environment",
    ],
    costs: [
      { item: "Tuition", range: "NZD 20,000 – 35,000/year" },
      { item: "Living costs", range: "NZD 20,000 – 25,000/year" },
    ],
    costSummary: "NZD 20,000 – 35,000 per year (tuition)",
    intakes: [
      { name: "February", months: "Feb", deadline: "Apply by October–November" },
      { name: "July", months: "Jul", deadline: "Apply by March–April" },
    ],
    englishRequirements: "IELTS 6.0–6.5 or equivalent.",
    workRights: "Up to 20 hours/week during term.",
    postStudyWork: "Post-study work visa available for up to 3 years.",
    scholarships: "New Zealand Excellence Awards and university-specific scholarships.",
    faq: [],
  },
  {
    name: "Japan",
    slug: "japan",
    code: "JP",
    flag: "🇯🇵",
    tagline: "Language study meets advanced innovation",
    description:
      "Japan offers rich educational routes — from language schools and vocational colleges to top universities. It's a popular choice for Nepali students interested in language study, technology, and Japanese culture.",
    whyStudy: [
      "Wide range of language schools and vocational pathways",
      "High safety, clean cities, and reliable infrastructure",
      "Strong demand for bilingual graduates in Japanese companies",
      "Affordable tuition compared to Western destinations",
    ],
    costs: [
      { item: "Language school tuition", range: "JPY 600,000 – 900,000/year" },
      { item: "University tuition", range: "JPY 800,000 – 1,500,000/year" },
      { item: "Living costs", range: "JPY 80,000 – 120,000/month" },
    ],
    costSummary: "JPY 600,000 – 1,200,000 per year (tuition)",
    intakes: [
      { name: "April", months: "Apr", deadline: "Apply 6–8 months in advance" },
      { name: "October", months: "Oct", deadline: "Apply 6–8 months in advance" },
    ],
    englishRequirements: "JLPT N5 (minimum) or 150+ hours of Japanese language study.",
    workRights: "Up to 28 hours/week with a work permit.",
    postStudyWork: "Job-seeking visa available; transition to work visa with employer sponsorship.",
    scholarships: "MEXT (Japanese government scholarship), JASSO, and university scholarships.",
    faq: [
      { question: "Do I need Japanese to study in Japan?", answer: "For language schools, yes — you'll learn it there. Some university programmes are taught in English, but basic Japanese ability is strongly recommended for daily life." },
    ],
  },
  {
    name: "Finland",
    slug: "finland",
    code: "FI",
    flag: "🇫🇮",
    tagline: "Innovation-driven education, family-friendly policies",
    description:
      "Finland is at the forefront of educational innovation and offers excellent dependent-visa and family-friendly policies — particularly attractive for students with families.",
    whyStudy: [
      "Free schooling for dependants' children",
      "Straightforward dependent visa processing",
      "High focus on innovation, sustainability, and work-life balance",
      "Two-year job-search residence permit after graduation",
    ],
    costs: [
      { item: "Tuition", range: "EUR 8,000 – 15,000/year" },
      { item: "Living costs", range: "EUR 700 – 1,000/month" },
    ],
    costSummary: "EUR 8,000 – 15,000 per year (tuition)",
    intakes: [
      { name: "Autumn (August/September)", months: "Aug – Sep", deadline: "Apply by January" },
    ],
    englishRequirements: "IELTS 6.0–6.5 or equivalent.",
    workRights: "Up to 30 hours/week during term.",
    postStudyWork: "2-year extended residence permit for job search after graduation.",
    scholarships: "Many Finnish universities offer tuition fee waivers and scholarships for non-EU students.",
    faq: [
      { question: "Can my family join me in Finland?", answer: "Yes. Finland has a straightforward dependent visa process. Children can attend Finnish schools for free." },
    ],
  },
  {
    name: "Denmark",
    slug: "denmark",
    code: "DK",
    flag: "🇩🇰",
    tagline: "Problem-based learning, high quality of life",
    description:
      "Denmark is known for its student-centred, collaborative approach to learning and a strong focus on sustainability. It's an excellent gateway to the European job market.",
    whyStudy: [
      "Interactive, problem-based learning systems",
      "High quality of life and happy student culture",
      "Post-study Establishment Card for job search",
      "Strong focus on sustainability and green technology",
    ],
    costs: [
      { item: "Tuition", range: "EUR 8,000 – 16,000/year" },
      { item: "Living costs", range: "EUR 800 – 1,100/month" },
    ],
    costSummary: "EUR 8,000 – 16,000 per year (tuition)",
    intakes: [
      { name: "September", months: "Sep", deadline: "Apply by March" },
      { name: "February (limited programmes)", months: "Feb", deadline: "Apply by September" },
    ],
    englishRequirements: "IELTS 6.5 or equivalent.",
    workRights: "Up to 20 hours/week during term.",
    postStudyWork: "6-month Establishment Card for job search.",
    scholarships: "Danish government scholarships for non-EU students.",
    faq: [],
  },
  {
    name: "South Korea",
    slug: "south-korea",
    code: "KR",
    flag: "🇰🇷",
    tagline: "Affordable tuition, dynamic culture",
    description:
      "South Korea offers affordable tuition, generous government scholarships, and a dynamic cultural experience. It's an increasingly popular choice for Nepali students, especially those interested in technology and Korean language.",
    whyStudy: [
      "Affordable tuition fees and generous KGSP scholarships",
      "Part-time work available on D-2 visa",
      "Leading technology and entertainment industry",
      "Rich cultural experience",
    ],
    costs: [
      { item: "Tuition", range: "KRW 4,000,000 – 8,000,000/year" },
      { item: "Living costs", range: "KRW 600,000 – 1,000,000/month" },
    ],
    costSummary: "KRW 4–8 million per year (tuition)",
    intakes: [
      { name: "March", months: "Mar", deadline: "Apply by September–November" },
      { name: "September", months: "Sep", deadline: "Apply by March–May" },
    ],
    englishRequirements: "TOPIK level 3+ (for Korean-taught) or IELTS 5.5–6.0 (for English-taught).",
    workRights: "Up to 20 hours/week after language registration on D-2 visa.",
    postStudyWork: "D-10 job-seeking visa available after graduation.",
    scholarships: "KGSP (Korean Government Scholarship Program) — fully funded.",
    faq: [],
  },
];
