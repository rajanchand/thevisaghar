import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ─── Admin User ──────────────────────────────────────────────────────────
  const adminPassword = process.env.ADMIN_SEED_PASSWORD || "Admin123!";
  if (!process.env.ADMIN_SEED_PASSWORD) {
    console.warn("⚠️  ADMIN_SEED_PASSWORD not set — using default. Change this in production!");
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@thevisaghar.com" },
    update: {},
    create: {
      email: "admin@thevisaghar.com",
      passwordHash,
      name: "Admin",
      role: "ADMIN",
    },
  });
  console.log("✅ Admin user created:", admin.email);

  // ─── Services ────────────────────────────────────────────────────────────
  const services = [
    {
      title: "Student Visa",
      slug: "student-visa",
      description: "Study abroad with confidence. The Visa Ghar offers complete assistance for securing student visas to top destinations worldwide, including the UK, USA, Australia, Canada, Finland, Denmark, Korea, and Japan. Our counselors guide you from course selection to enrollment and visa success.",
      shortDescription: "Study at top universities globally with our expert student visa guidance.",
      icon: "graduation-cap",
      price: "Contact Us",
      documentsRequired: ["Valid passport", "Offer letter / CAS / I-20", "Financial evidence", "Language proficiency test (IELTS/PTE)", "Academic transcripts", "TB test results (if applicable)"],
      processingTime: "4-12 weeks",
      eligibility: "An unconditional/conditional offer letter from a recognized educational institution. Proof of financial capability to pay tuition fees and cover living costs. Meet language requirements of the destination.",
      faq: [
        { question: "Can I work on a student visa?", answer: "Yes, most countries allow international students to work part-time (usually up to 20 hours per week) during terms and full-time during breaks." },
        { question: "Do you help with university admission?", answer: "Yes, we provide end-to-end guidance including university selection, admission application, SOP writing, and visa documentation." },
      ],
      order: 1,
    },
    {
      title: "Japanese Language",
      slug: "japanese-language",
      description: "Learn Japanese from certified experts. Our comprehensive courses cover JLPT N5 and N4 levels, equipping you with essential grammar, vocabulary, Kanji, and communication skills required for study, work, or travel in Japan.",
      shortDescription: "Comprehensive Japanese language preparation classes for JLPT N5 & N4 levels.",
      icon: "languages",
      price: "Contact Us",
      documentsRequired: ["Identification proof", "JLPT exam form (if registering)"],
      processingTime: "8-12 weeks",
      eligibility: "Open to all students and professionals aiming to study or work in Japan.",
      faq: [
        { question: "What do N5 and N4 levels cover?", answer: "N5 is basic (hiragana, katakana, essential kanji, basic grammar). N4 covers more advanced grammar and vocabulary for everyday conversations." },
        { question: "Does this course help with Japan Student Visa?", answer: "Yes, a minimum of 150 hours of Japanese language study or JLPT N5 certificate is highly recommended for Japan visa applicants." },
      ],
      order: 2,
    },
    {
      title: "IELTS Class",
      slug: "ielts-class",
      description: "Score high in your IELTS exam. Our expert-led IELTS preparation classes focus on developing all four key language skills: Listening, Reading, Writing, and Speaking, with regular mock tests and personalized feedback.",
      shortDescription: "Expert IELTS coaching with regular mock tests and mock speaking practice.",
      icon: "book-open",
      price: "Contact Us",
      documentsRequired: ["Valid Passport", "Enrollment Form"],
      processingTime: "4-8 weeks",
      eligibility: "Intermediate English level recommended.",
      faq: [
        { question: "How long is the IELTS score valid?", answer: "IELTS scores are valid for 2 years from the test date." },
        { question: "Do you conduct weekend mock tests?", answer: "Yes, we conduct full-length mock tests every week with complete assessment and feedback." },
      ],
      order: 3,
    },
    {
      title: "PTE Class",
      slug: "pte-class",
      description: "Excel in the Pearson Test of English (PTE) Academic. Our interactive preparation program provides comprehensive strategies, software practice templates, and mock tests designed to help you secure a top score.",
      shortDescription: "Interactive PTE Academic coaching with computer lab simulations.",
      icon: "file-text",
      price: "Contact Us",
      documentsRequired: ["Valid Passport", "Enrollment Form"],
      processingTime: "4-8 weeks",
      eligibility: "Intermediate English level recommended.",
      faq: [
        { question: "How fast do I get my PTE results?", answer: "PTE Academic results are typically available within 48 hours of taking the test." },
        { question: "Is PTE accepted for Australia and UK?", answer: "Yes, PTE Academic is widely accepted for study and migration visas in Australia, New Zealand, the UK, and Canada." },
      ],
      order: 4,
    },
    {
      title: "Computer Class",
      slug: "computer-class",
      description: "Build your digital foundation. Our practical computer course covers basic computer operations, MS Office suite (Word, Excel, PowerPoint), email, internet navigation, and basic digital literacy essential for modern academic and career growth.",
      shortDescription: "Essential digital literacy and MS Office training for students and adults.",
      icon: "monitor",
      price: "Contact Us",
      documentsRequired: ["Enrollment Form"],
      processingTime: "4-6 weeks",
      eligibility: "Open to beginners of all ages.",
      faq: [
        { question: "Will I get hands-on computer practice?", answer: "Yes, our classes are conducted in a dedicated computer lab with one-to-one PC access." },
        { question: "Is this class helpful for abroad study?", answer: "Yes, basic computer skills are essential for writing assignments, researching online, and academic presentations abroad." },
      ],
      order: 5,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
    });
  }
  console.log(`✅ ${services.length} services created`);

  // ─── Team Members ────────────────────────────────────────────────────────
  const teamMembers = [
    {
      name: "Counseling Team",
      role: "Student Visa Experts",
      bio: "Our dedicated counseling team specializes in student visa applications with a 98% success rate.",
      order: 1,
    },
    {
      name: "Language Faculty",
      role: "Japanese Language & Test Prep",
      bio: "Experienced instructors for Japanese Language (JLPT N5/N4), IELTS, and PTE preparation classes.",
      order: 2,
    },
  ];

  await prisma.teamMember.deleteMany({});
  for (const member of teamMembers) {
    await prisma.teamMember.create({ data: member });
  }
  console.log(`✅ ${teamMembers.length} team members created`);

  // ─── Testimonials ────────────────────────────────────────────────────────
  const testimonials = [
    {
      clientName: "Sachita Lamichhane",
      visaType: "Finland Dependent Visa",
      rating: 5,
      content: "Getting my Finland Dependent Visa was hassle-free with The Visa Ghar. Their counseling was extremely transparent, and they guided me perfectly on the financial and documentation requirements.",
      isApproved: true,
    },
    {
      clientName: "Bunu Rijal",
      visaType: "Finland Dependent Visa",
      rating: 5,
      content: "Highly recommend The Visa Ghar for study abroad and family dependent applications. Very professional staff and always responsive to our inquiries!",
      isApproved: true,
    },
    {
      clientName: "Bishal Upadhyay",
      visaType: "UK Visa",
      rating: 5,
      content: "The Visa Ghar made my UK student visa application look so simple. From CAS tracking to interview prep, they supported me all the way. Got my visa within 3 weeks!",
      isApproved: true,
    },
    {
      clientName: "Chadani Gautam",
      visaType: "UK Visa",
      rating: 5,
      content: "The instructors for IELTS/PTE classes and the counseling team are top-notch. I scored a 7.5 band in IELTS and got my UK visa approved on the first attempt.",
      isApproved: true,
    },
  ];

  await prisma.testimonial.deleteMany({});
  for (const testimonial of testimonials) {
    await prisma.testimonial.create({ data: testimonial });
  }
  console.log(`✅ ${testimonials.length} testimonials created`);

  // ─── Blog Posts ──────────────────────────────────────────────────────────
  const blogPosts = [
    {
      title: "How to Prepare for the Japanese Language N5/N4 Test",
      slug: "prepare-japanese-language-n5-n4-test",
      content: {
        type: "doc",
        content: [
          { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Master Japanese Language Proficiency" }] },
          { type: "paragraph", content: [{ type: "text", text: "To study or work in Japan, passing the JLPT N5 or N4 levels is a crucial first step. Our classes at The Visa Ghar are designed to equip you with the essential Hiragana, Katakana, Kanji, and grammar skills required." }] },
        ],
      },
      excerpt: "Comprehensive preparation guide for JLPT N5 and N4 Japanese language levels for students in Kathmandu.",
      category: "Japanese Language",
      tags: ["Japan", "N5", "N4", "JLPT", "Guide"],
      seoTitle: "How to Prepare for the Japanese Language N5/N4 Test | The Visa Ghar",
      seoDescription: "Preparation strategies for Japanese language N5 and N4 tests. Get tips from Kathmandu's best instructors.",
      published: true,
      publishedAt: new Date("2024-01-15"),
      authorId: admin.id,
    },
    {
      title: "Top 10 Tips for a Successful Student Visa Application",
      slug: "top-10-tips-successful-student-visa",
      content: {
        type: "doc",
        content: [
          { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Maximize Your Chances of Approval" }] },
          { type: "paragraph", content: [{ type: "text", text: "Getting your student visa requires careful planning and precise document curation. Here are the top 10 tips based on years of successful applications at The Visa Ghar." }] },
        ],
      },
      excerpt: "Expert tips from The Visa Ghar counseling team to help Nepali students get their student visa approved on the first attempt.",
      category: "Study Abroad",
      tags: ["Student Visa", "Tips", "Study Abroad", "Kathmandu"],
      seoTitle: "10 Tips for Student Visa Success | The Visa Ghar",
      seoDescription: "Learn key strategies and documentation checklists for getting your student visa approved from Nepal.",
      published: true,
      publishedAt: new Date("2024-02-01"),
      authorId: admin.id,
    },
    {
      title: "IELTS vs. PTE: Which Test Should You Take?",
      slug: "ielts-vs-pte-which-test-should-you-take",
      content: {
        type: "doc",
        content: [
          { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Choosing the Right English Test" }] },
          { type: "paragraph", content: [{ type: "text", text: "Both IELTS and PTE are widely accepted for admissions and student visas globally. However, their formats and testing styles differ significantly." }] },
        ],
      },
      excerpt: "Compare IELTS and PTE test structures, scoring, difficulty, and acceptance to decide the best path for your study abroad dreams.",
      category: "Test Preparation",
      tags: ["IELTS", "PTE", "English Test", "Coaching"],
      seoTitle: "IELTS vs. PTE: Which Test Should You Take? | The Visa Ghar",
      seoDescription: "Detailed comparison of IELTS and PTE Academic tests. Learn about formats, scoring, and acceptance.",
      published: true,
      publishedAt: new Date("2024-02-15"),
      authorId: admin.id,
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
  }
  console.log(`✅ ${blogPosts.length} blog posts created`);

  // ─── Site Settings ───────────────────────────────────────────────────────
  const settings = [
    { key: "site_title", value: "The Visa Ghar" },
    { key: "site_description", value: "Your Trusted Immigration Partner — Study Abroad & Language Classes Consultancy in Kathmandu, Nepal." },
    { key: "contact_email", value: "info@thevisaghar.com" },
    { key: "contact_phone", value: "01-4913776, 9851338645" },
    { key: "contact_address", value: "Boudha-6, Pipalbot, Kathmandu, Nepal" },
    { key: "business_hours", value: "Sunday–Friday: 10:00 AM – 6:00 PM" },
    { key: "social_facebook", value: "https://facebook.com/thevisaghar" },
    { key: "social_instagram", value: "https://instagram.com/thevisaghar" },
    { key: "social_linkedin", value: "https://linkedin.com/company/thevisaghar" },
    { key: "social_whatsapp", value: "https://wa.me/9779851338645" },
    { key: "google_maps_embed", value: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3531.905655389658!2d85.3582457!3d27.7196025!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb196238b18db9%3A0xa5970c6792376ef7!2sBoudha%20Pipalbot!5e0!3m2!1sen!2snp!4v1717900000000" },
  ];

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }
  console.log(`✅ ${settings.length} site settings created`);

  console.log("🎉 Seeding complete!");
  console.log("");
  console.log("📌 Admin Login Credentials:");
  console.log("   Email:    admin@thevisaghar.com");
  console.log("   Password: (set via ADMIN_SEED_PASSWORD env var)");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
