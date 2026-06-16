/**
 * Blog posts — structured content layer
 * These are summary references. Actual rich content will be managed via MDX or dynamic pages.
 */

export interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string | null;
  category: string;
  publishedAt: string; // ISO string date
  contentHtml: string;
}

export const blogPosts: BlogPost[] = [
  {
    title: "How to Prepare for the Japanese Language N5/N4 Test",
    slug: "prepare-japanese-language-n5-n4-test",
    excerpt: "Comprehensive preparation guide for JLPT N5 and N4 Japanese language levels for students in Kathmandu.",
    featuredImage: null,
    category: "Japanese Language",
    publishedAt: "2026-05-15",
    contentHtml: `
      <h2>Mastering the Basics: Hiragana, Katakana, and Kanji</h2>
      <p>Passing the JLPT N5 or N4 exam is the primary academic milestone for students planning to study in Japan. The foundation of Japanese language proficiency lies in mastering the three writing systems: Hiragana, Katakana, and Kanji.</p>
      <p>For the N5 exam, you must be fully fluent in reading and writing Hiragana and Katakana. Additionally, you need to recognize around 100 basic Kanji characters (such as numbers, days of the week, and common verbs) and understand approximately 800 vocabulary words.</p>
      <p>Moving up to N4 requires a significant jump: you will need to know about 300 Kanji characters and 1,500 vocabulary words. Dedicating at least 1–2 hours daily to writing practice and using flashcard applications like Anki is highly recommended for building memory retention.</p>

      <h2>Grammar Patterns and Textbooks</h2>
      <p>We recommend using the standard <em>Minna no Nihongo</em> textbooks (Volume I for N5, and Volume II for N4). Focus heavily on particles (like は, が, に, で, and を), which form the structural skeleton of Japanese sentences.</p>
      <p>Understand verb conjugations early. For N5, master the polite dictionary forms (-masu forms) and basic past/negative tenses. For N4, you must master casual forms, potential forms (expressing ability), passive verbs, and conditional sentence structures.</p>

      <h2>Listening Comprehension and Mock Tests</h2>
      <p>Many students struggle with the listening section because spoken Japanese can feel fast. To train your ear, practice shadowing audio files from your textbooks. Listen and repeat sentences aloud immediately after hearing them.</p>
      <p>In Kathmandu, register for weekly mock tests at our Boudha center. Simulating the real test environment—with strict section timers and strict audio rules—helps manage exam anxiety and improves time allocations on the real test day.</p>
    `,
  },
  {
    title: "Top 10 Tips for a Successful Student Visa Application",
    slug: "top-10-tips-successful-student-visa",
    excerpt: "Expert tips from The Visa Ghar counseling team to help Nepali students get their student visa approved on the first attempt.",
    featuredImage: null,
    category: "Study Abroad",
    publishedAt: "2026-06-01",
    contentHtml: `
      <h2>1. Shortlist Accredited Institutions</h2>
      <p>Ensure the university or college you select is officially recognized by the destination country's government (e.g., licensed sponsors in the UK, SEVP-certified schools in the USA, CRICOS registered providers in Australia). Applying to unaccredited institutions leads to automatic visa rejections.</p>

      <h2>2. Understand CAS & I-20 Timelines</h2>
      <p>Do not wait until the last minute to pay your tuition deposits. Official admission confirmation documents (CAS for the UK, I-20 for the US, CoE for Australia) are required before you can schedule a visa appointment. These documents can take 2–6 weeks to process after deposit receipt.</p>

      <h2>3. Consolidate Financial Evidence Early</h2>
      <p>Immigration authorities require solid proof that you can cover tuition and living expenses. Ensure your bank balance certificates are issued by accepted financial institutions and that the funds have been held for the required duration (e.g., 28 consecutive days for the UK, or historical funds for Australia).</p>

      <h2>4. Document Sources of Income Clearly</h2>
      <p>A large bank balance is not enough; you must prove where the money came from. Compile land tax receipts, official business registration papers, salary slips of sponsors, rental agreements, and tax clearance certificates to establish a transparent paper trail.</p>

      <h2>5. Write an Authentic Statement of Purpose (SOP)</h2>
      <p>Avoid copy-pasting internet templates. Visa officers inspect hundreds of SOPs weekly and easily identify boilerplate content. Write in your own words, explaining why you chose this specific course, why you selected that particular country, and detailing your clear post-study return plans to Nepal.</p>

      <h2>6. Prepare for Credibility & Embassy Interviews</h2>
      <p>Practice speaking confidently about your course modules, tuition costs, university location, and career paths. Mock interviews are critical. Participate in the scheduled evaluation prep sessions at The Visa Ghar to refine your answers.</p>

      <h2>7. Keep Documents Organized in Checklist Order</h2>
      <p>Arrange your transcripts, certificates, passport copies, financial papers, and relationship certificates in the exact order recommended by the visa checklist. Neatness and structure show professionalism.</p>
    `,
  },
  {
    title: "IELTS vs. PTE: Which Test Should You Take?",
    slug: "ielts-vs-pte-which-test-should-you-take",
    excerpt: "Compare IELTS and PTE test structures, scoring, difficulty, and acceptance to decide the best path for your study abroad dreams.",
    featuredImage: null,
    category: "Test Preparation",
    publishedAt: "2026-06-05",
    contentHtml: `
      <h2>Introduction: The Two Giants of English Proficiency</h2>
      <p>When planning to study abroad, proving your English proficiency is mandatory. The International English Language Testing System (IELTS) and the Pearson Test of English (PTE) Academic are the two most popular examinations taken by Nepali students.</p>

      <h2>Test Format and Administration</h2>
      <p>The primary difference lies in how the tests are administered and graded:</p>
      <ul>
        <li><strong>IELTS:</strong> Can be taken on paper or computer. The speaking section is always an in-person, face-to-face interview with a human examiner. Writing and speaking sections are graded by certified examiners.</li>
        <li><strong>PTE Academic:</strong> Fully computer-based. The speaking section involves talking into a headset microphone, and the entire test is graded by an artificial intelligence algorithm, eliminating human bias.</li>
      </ul>

      <h2>Scoring Comparisons</h2>
      <p>IELTS scores range from Band 0 to 9.0, whereas PTE scores are reported on a scale of 10 to 90 points. A score of 58 in PTE is roughly equivalent to an IELTS Band 6.5, which is the standard entry requirement for most undergraduate and postgraduate programs worldwide.</p>

      <h2>Country Acceptance Guidelines</h2>
      <p>Both tests are widely accepted, but there are regional preferences:</p>
      <ul>
        <li><strong>Australia & New Zealand:</strong> PTE is extremely popular and accepted unconditionally by all universities and immigration departments.</li>
        <li><strong>United Kingdom:</strong> Both are accepted, but if you are applying for a pre-sessional course, you may need a specific "IELTS for UKVI" test.</li>
        <li><strong>Canada & USA:</strong> IELTS is universally accepted. PTE is accepted by a vast majority of universities, but check the specific admissions criteria of your target university first.</li>
      </ul>
    `,
  },
];
