export interface FAQItem {
  question: string;
  answer: string;
}

export interface ServiceSummary {
  title: string;
  slug: string;
  shortDescription: string;
  icon: string;
  price: string;
  processingTime: string;
}

export interface ServiceDetail extends ServiceSummary {
  description: string;
  documentsRequired: string[];
  eligibility: string;
  faq: FAQItem[];
}

export interface TestimonialSummary {
  clientName: string;
  clientPhoto: string | null;
  visaType: string;
  rating: number;
  content: string;
}

export interface BlogPostSummary {
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string | null;
  category: string;
  publishedAt: Date;
}

export interface CountryInfo {
  name: string;
  code: string;
  flagUrl: string;
  tagline: string;
  description: string;
  whyChoose: string[];
  costs: string;
  workPermit: string;
}

export const MOCK_SERVICES: ServiceDetail[] = [
  {
    title: "Student Visa",
    slug: "student-visa",
    shortDescription: "Study at top universities globally with our expert student visa guidance.",
    icon: "graduation-cap",
    price: "Contact Us",
    processingTime: "4-12 weeks",
    description: "Study abroad with confidence. The Visa Ghar offers complete assistance for securing student visas to top destinations worldwide, including the UK, USA, Australia, Canada, Finland, Denmark, Korea, and Japan. Our counselors guide you from course selection to enrollment and visa success.",
    documentsRequired: [
      "Valid Passport (at least 6 months validity)",
      "Unconditional/Conditional Offer Letter (CAS / I-20 / COE)",
      "Financial evidence (Bank statement proving tuition & living costs)",
      "English Proficiency results (IELTS/PTE) or JLPT certificate",
      "Academic Transcripts and Certificates",
      "No Objection Letter (NOC) from Ministry of Education",
      "Tuberculosis (TB) test certificate (for UK applications)"
    ],
    eligibility: "An unconditional/conditional offer letter from a recognized educational institution. Proof of financial capability to pay tuition fees and cover living costs. Meet language requirements of the destination country.",
    faq: [
      { question: "Can I work on a student visa?", answer: "Yes, most countries allow international students to work part-time (usually up to 20 hours per week) during terms and full-time during breaks." },
      { question: "Do you help with university admission?", answer: "Yes, we provide end-to-end guidance including university selection, admission application, SOP writing, and visa documentation." },
      { question: "Which countries are currently best for student intake?", answer: "The UK, USA, Australia, Canada, and European destinations like Finland and Denmark are highly popular. Each has distinct financial and intake timelines." }
    ]
  },
  {
    title: "Japanese Language",
    slug: "japanese-language",
    shortDescription: "Comprehensive Japanese language preparation classes for JLPT N5 & N4 levels.",
    icon: "languages",
    price: "Contact Us",
    processingTime: "8-12 weeks (Course duration)",
    description: "Learn Japanese from certified experts. Our comprehensive courses cover JLPT N5 and N4 levels, equipping you with essential grammar, vocabulary, Kanji, and communication skills required for study, work, or travel in Japan.",
    documentsRequired: [
      "Citizenship certificate / Passport copy",
      "Academic transcripts (minimum +2 level for study abroad)",
      "2 Passport size photos"
    ],
    eligibility: "Open to all students and professionals aiming to study, work, or travel in Japan.",
    faq: [
      { question: "What do JLPT N5 and N4 levels cover?", answer: "N5 is basic (hiragana, katakana, essential kanji, basic grammar). N4 covers more advanced grammar and vocabulary for everyday conversations." },
      { question: "Does this course help with Japan Student Visa?", answer: "Yes, a minimum of 150 hours of Japanese language study or a JLPT N5 certificate is highly recommended (often mandatory) for Japan visa applicants." }
    ]
  },
  {
    title: "IELTS Class",
    slug: "ielts-class",
    shortDescription: "Expert IELTS coaching with regular mock tests and mock speaking practice.",
    icon: "book-open",
    price: "Contact Us",
    processingTime: "4-8 weeks",
    description: "Score high in your IELTS exam. Our expert-led IELTS preparation classes focus on developing all four key language skills: Listening, Reading, Writing, and Speaking, with regular mock tests and personalized feedback.",
    documentsRequired: [
      "Valid Passport copy (required for booking test)",
      "Enrollment Form"
    ],
    eligibility: "Intermediate English level recommended.",
    faq: [
      { question: "How long is the IELTS score valid?", answer: "IELTS scores are valid for 2 years from the test date." },
      { question: "Do you conduct weekend mock tests?", answer: "Yes, we conduct full-length mock tests every weekend with complete assessment and feedback." },
      { question: "What is the difference between IELTS Academic and General?", answer: "IELTS Academic is for students wishing to study at tertiary levels. IELTS General is for migration or work purposes." }
    ]
  },
  {
    title: "PTE Class",
    slug: "pte-class",
    shortDescription: "Interactive PTE Academic coaching with computer lab simulations.",
    icon: "file-text",
    price: "Contact Us",
    processingTime: "4-8 weeks",
    description: "Excel in the Pearson Test of English (PTE) Academic. Our interactive preparation program provides comprehensive strategies, software practice templates, and mock tests designed to help you secure a top score.",
    documentsRequired: [
      "Valid Passport copy (required for booking test)",
      "Enrollment Form"
    ],
    eligibility: "Intermediate English level recommended.",
    faq: [
      { question: "How fast do I get my PTE results?", answer: "PTE Academic results are typically available within 48 hours of taking the test." },
      { question: "Is PTE accepted for Australia and UK?", answer: "Yes, PTE Academic is widely accepted for study and migration visas in Australia, New Zealand, the UK, and Canada." }
    ]
  },
  {
    title: "Computer Class",
    slug: "computer-class",
    shortDescription: "Essential digital literacy and MS Office training for students and adults.",
    icon: "monitor",
    price: "Contact Us",
    processingTime: "4-6 weeks",
    description: "Build your digital foundation. Our practical computer course covers basic computer operations, MS Office suite (Word, Excel, PowerPoint), email, internet navigation, and basic digital literacy essential for modern academic and career growth.",
    documentsRequired: [
      "Enrollment Form"
    ],
    eligibility: "Open to beginners of all ages.",
    faq: [
      { question: "Will I get hands-on computer practice?", answer: "Yes, our classes are conducted in a dedicated computer lab with one-to-one PC access." },
      { question: "Is this class helpful for abroad study?", answer: "Yes, basic computer skills are essential for writing assignments, researching online, and academic presentations abroad." }
    ]
  }
];

export const MOCK_TESTIMONIALS: TestimonialSummary[] = [
  {
    clientName: "Sachita Lamichhane",
    clientPhoto: null,
    visaType: "Finland Dependent Visa Granted",
    rating: 5,
    content: "Getting my Finland Dependent Visa was hassle-free with The Visa Ghar. Their counseling was extremely transparent, and they guided me perfectly on the financial and documentation requirements."
  },
  {
    clientName: "Bunu Rijal",
    clientPhoto: null,
    visaType: "Finland Dependent Visa Granted",
    rating: 5,
    content: "Highly recommend The Visa Ghar for study abroad and family dependent applications. Very professional staff and always responsive to our inquiries!"
  },
  {
    clientName: "Bishal Upadhyay",
    clientPhoto: null,
    visaType: "UK Visa Granted",
    rating: 5,
    content: "The Visa Ghar made my UK student visa application look so simple. From CAS tracking to interview prep, they supported me all the way. Got my visa within 3 weeks!"
  },
  {
    clientName: "Chadani Gautam",
    clientPhoto: null,
    visaType: "UK Visa Granted",
    rating: 5,
    content: "The instructors for IELTS/PTE classes and the counseling team are top-notch. I scored a 7.5 band in IELTS and got my UK visa approved on the first attempt."
  }
];

export const MOCK_BLOG_POSTS: BlogPostSummary[] = [
  {
    title: "How to Prepare for the Japanese Language N5/N4 Test",
    slug: "prepare-japanese-language-n5-n4-test",
    excerpt: "Comprehensive preparation guide for JLPT N5 and N4 Japanese language levels for students in Kathmandu.",
    featuredImage: null,
    category: "Japanese Language",
    publishedAt: new Date("2026-05-15")
  },
  {
    title: "Top 10 Tips for a Successful Student Visa Application",
    slug: "top-10-tips-successful-student-visa",
    excerpt: "Expert tips from The Visa Ghar counseling team to help Nepali students get their student visa approved on the first attempt.",
    featuredImage: null,
    category: "Study Abroad",
    publishedAt: new Date("2026-06-01")
  },
  {
    title: "IELTS vs. PTE: Which Test Should You Take?",
    slug: "ielts-vs-pte-which-test-should-you-take",
    excerpt: "Compare IELTS and PTE test structures, scoring, difficulty, and acceptance to decide the best path for your study abroad dreams.",
    featuredImage: null,
    category: "Test Preparation",
    publishedAt: new Date("2026-06-05")
  }
];

export const MOCK_COUNTRIES: CountryInfo[] = [
  {
    name: "USA",
    code: "US",
    flagUrl: "🇺🇸",
    tagline: "The Land of Opportunity & Ivy Leagues",
    description: "The United States offers a diverse selection of higher education institutions. Known for cutting-edge technology and global research excellence, it is a premier study destination for Nepali students.",
    whyChoose: [
      "Top-ranked global universities",
      "OPT (Optional Practical Training) opportunities post-study",
      "Generous scholarship schemes for meritorious students"
    ],
    costs: "USD 20,000 - 45,000 per year",
    workPermit: "Up to 20 hours/week during studies; up to 36 months OPT for STEM graduates."
  },
  {
    name: "Australia",
    code: "AU",
    flagUrl: "🇦🇺",
    tagline: "World-Class Education & Vibrant Lifestyle",
    description: "Australia is highly favored for its robust education system, post-study work streams, and high quality of life. Cities like Melbourne and Sydney are prime student hubs.",
    whyChoose: [
      "High quality of life and multicultural campuses",
      "Strong post-study work visa options (485 visa)",
      "Excellent part-time work availability"
    ],
    costs: "AUD 22,000 - 40,000 per year",
    workPermit: "Up to 48 hours per fortnight; up to 4+ years post-study work permit."
  },
  {
    name: "UK",
    code: "GB",
    flagUrl: "🇬🇧",
    tagline: "Rich Academic Heritage & Graduate Routes",
    description: "The United Kingdom provides intensive, shorter duration degree courses (1-year Masters, 3-year Bachelors) saving time and living expenses. Home to prestigious historic institutions.",
    whyChoose: [
      "Fast-track degrees (Masters in 12 months)",
      "2-year Graduate Route (post-study work visa)",
      "Vibrant cultural diversity"
    ],
    costs: "GBP 12,000 - 25,000 per year",
    workPermit: "Up to 20 hours/week during term; 2 years Post-Study Work Visa."
  },
  {
    name: "Canada",
    code: "CA",
    flagUrl: "🇨🇦",
    tagline: "Quality Education & Clear Permanent Routes",
    description: "Canada boasts affordable tuition rates, a welcoming environment, and one of the most straightforward post-graduation work and immigration pathways.",
    whyChoose: [
      "Straightforward PGWP (Post-Graduation Work Permit) route",
      "Safe, welcoming, and stable nation",
      "Lower cost of living compared to US/UK"
    ],
    costs: "CAD 15,000 - 30,000 per year",
    workPermit: "Up to 20 hours/week; PGWP up to 3 years."
  },
  {
    name: "New Zealand",
    code: "NZ",
    flagUrl: "🇳🇿",
    tagline: "Stunning Nature & Quality Industry Links",
    description: "New Zealand combines academic excellence with a practical, industry-focused approach to learning, all set in a scenic, peaceful environment.",
    whyChoose: [
      "High safety standards and friendly locals",
      "Practical, hands-on learning models",
      "Post-study work rights for up to 3 years"
    ],
    costs: "NZD 20,000 - 35,000 per year",
    workPermit: "Up to 20 hours/week; post-study work permit available."
  },
  {
    name: "Finland",
    code: "FI",
    flagUrl: "🇫🇮",
    tagline: "Happiest Nation & Innovative Classrooms",
    description: "Finland stands at the forefront of pedagogical innovation. It offers top-quality education with excellent dependent-visa and post-study opportunities in Europe.",
    whyChoose: [
      "Free schooling for children of students",
      "Easy dependent visa processing (family joins student)",
      "High focus on innovation and work-life balance"
    ],
    costs: "EUR 8,000 - 15,000 per year",
    workPermit: "Up to 30 hours/week; 2-year job search permit post-graduation."
  },
  {
    name: "Denmark",
    code: "DK",
    flagUrl: "🇩🇰",
    tagline: "Green Solutions & Collaborative Learning",
    description: "Denmark is famous for its student-centered instruction and focus on sustainability. Perfect for students seeking European integration and group-oriented studies.",
    whyChoose: [
      "High quality of life and happy student culture",
      "Interactive, problem-based learning systems",
      "Post-study establishment card"
    ],
    costs: "EUR 8,000 - 16,000 per year",
    workPermit: "Up to 20 hours/week; 6 months job search permit."
  },
  {
    name: "Korea",
    code: "KR",
    flagUrl: "🇰🇷",
    tagline: "High Technology & Dynamic Culture",
    description: "South Korea blends ancient heritage with futuristic tech. It provides affordable study options and is excellent for students interested in language learning and technology.",
    whyChoose: [
      "Very affordable tuition fees and scholarships",
      "Part-time work availability",
      "Leading tech and entertainment industry hubs"
    ],
    costs: "KRW 4,000,000 - 8,000,000 per year",
    workPermit: "Up to 20 hours/week (after D-2 language registration)."
  },
  {
    name: "Japan",
    code: "JP",
    flagUrl: "🇯🇵",
    tagline: "Ancient Culture & Advanced Innovation",
    description: "Japan is a highly industrialized and safe country, offering rich educational routes coupled with Japanese language study. Popular for both vocational and university paths.",
    whyChoose: [
      "Broad vocational and language school pathways",
      "High safety standards and clean environment",
      "Strong demand for bilingual international graduates"
    ],
    costs: "JPY 600,000 - 1,200,000 per year",
    workPermit: "Up to 28 hours/week with permit."
  }
];
