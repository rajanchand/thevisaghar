/**
 * Services — structured content layer
 * Edit this file to update service offerings on the public site.
 */

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Service {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  icon: string;
  price: string;
  processingTime: string;
  documentsRequired: string[];
  eligibility: string;
  faq: FAQItem[];
}

export const services: Service[] = [
  {
    title: "Student Visa",
    slug: "student-visa",
    shortDescription:
      "End-to-end guidance for student visa applications to the UK, USA, Australia, Canada, and more.",
    icon: "graduation-cap",
    price: "Contact Us",
    processingTime: "4–12 weeks",
    description:
      "We handle every step of your student visa application — from university shortlisting and offer-letter tracking to financial documentation, SOP writing, and interview preparation. Our counsellors have direct experience with the visa systems of each destination country.",
    documentsRequired: [
      "Valid passport (at least 6 months remaining)",
      "Unconditional/Conditional offer letter (CAS, I-20, COE, etc.)",
      "Financial evidence (bank statements covering tuition and living costs)",
      "English proficiency results (IELTS / PTE) or JLPT certificate",
      "Academic transcripts and certificates",
      "No Objection Letter (NOC) from MoEST",
      "TB test certificate (UK applications)",
    ],
    eligibility:
      "You need an offer from a recognised institution, proof of funds for tuition and living costs, and the language score required by your destination country.",
    faq: [
      {
        question: "Can I work while studying?",
        answer:
          "Most countries allow part-time work during term (typically 20 hours/week) and full-time during breaks. Exact rules vary by country.",
      },
      {
        question: "Do you help with university admission too?",
        answer:
          "Yes. We help with university selection, application, SOP and personal statement writing, and offer-letter follow-up.",
      },
    ],
  },
  {
    title: "IELTS Preparation",
    slug: "ielts-class",
    shortDescription:
      "Structured coaching for IELTS Academic and General with weekly mock tests and one-on-one feedback.",
    icon: "book-open",
    price: "Contact Us",
    processingTime: "4–8 weeks (course duration)",
    description:
      "Our IELTS programme covers Listening, Reading, Writing, and Speaking with experienced instructors. We run full-length mock tests every weekend and provide individual feedback on writing and speaking performance.",
    documentsRequired: ["Passport copy (needed for test booking)", "Enrolment form"],
    eligibility: "Intermediate English level recommended.",
    faq: [
      {
        question: "How long is an IELTS score valid?",
        answer: "Two years from the test date.",
      },
      {
        question: "Academic vs. General — which do I need?",
        answer:
          "Academic is for university study. General is for work or migration. We'll help you decide during your first session.",
      },
    ],
  },
  {
    title: "PTE Preparation",
    slug: "pte-class",
    shortDescription:
      "Computer-based PTE Academic training with lab practice and scored mock tests.",
    icon: "file-text",
    price: "Contact Us",
    processingTime: "4–8 weeks (course duration)",
    description:
      "Our PTE programme focuses on the computer-based format with dedicated lab time, template strategies for high-scoring tasks, and regular scored mock tests. Results typically arrive within 48 hours of the real test.",
    documentsRequired: ["Passport copy (needed for test booking)", "Enrolment form"],
    eligibility: "Intermediate English level recommended.",
    faq: [
      {
        question: "Is PTE accepted in Australia and the UK?",
        answer:
          "Yes. PTE Academic is accepted for study and migration visas in Australia, New Zealand, the UK, and Canada.",
      },
    ],
  },
  {
    title: "Japanese Language",
    slug: "japanese-language",
    shortDescription:
      "JLPT N5 and N4 courses covering grammar, vocabulary, kanji, and conversational skills.",
    icon: "languages",
    price: "Contact Us",
    processingTime: "8–12 weeks (course duration)",
    description:
      "Learn Japanese from certified instructors. Our courses cover JLPT N5 and N4 levels — hiragana, katakana, essential kanji, grammar, and practical conversation. Completing N5 is typically required (or strongly recommended) for Japan student visa applications.",
    documentsRequired: [
      "Citizenship certificate or passport copy",
      "Academic transcripts (minimum +2 level for study abroad)",
      "Two passport-size photos",
    ],
    eligibility:
      "Open to all students and professionals aiming to study, work, or travel in Japan.",
    faq: [
      {
        question: "Do I need JLPT for a Japan student visa?",
        answer:
          "A minimum of 150 hours of Japanese study or a JLPT N5 certificate is strongly recommended and often mandatory.",
      },
    ],
  },
  {
    title: "Computer & Digital Literacy",
    slug: "computer-class",
    shortDescription:
      "Practical training in MS Office, email, internet, and digital skills for academic and career readiness.",
    icon: "monitor",
    price: "Contact Us",
    processingTime: "4–6 weeks (course duration)",
    description:
      "Our hands-on course covers basic computer operations, MS Office (Word, Excel, PowerPoint), email, internet research, and digital literacy — skills essential for academic life abroad and modern careers.",
    documentsRequired: ["Enrolment form"],
    eligibility: "Open to beginners of all ages.",
    faq: [
      {
        question: "Will I get hands-on practice?",
        answer: "Yes. Classes are held in our computer lab with individual PC access.",
      },
    ],
  },
];
