import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how The Visa Ghar collects, uses, and protects your personal information when you use our immigration consultancy services.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-32 pb-20">
      <div className="section-container max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-navy/10 text-navy text-sm font-semibold mb-4">
            Legal
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-500 text-sm">Last updated: June 2025</p>
        </div>

        {/* Content */}
        <div className="prose prose-navy max-w-none space-y-10 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-navy mb-3">1. Introduction</h2>
            <p>
              The Visa Ghar (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is committed to protecting your
              personal information. This Privacy Policy explains what data we collect, why we
              collect it, how we use it, and your rights regarding that data. By submitting any
              form on our website or booking a consultation, you agree to the practices described
              in this policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-navy mb-3">2. Information We Collect</h2>
            <p>We collect personal information you voluntarily provide through our website forms, including:</p>
            <ul className="list-disc list-inside mt-3 space-y-1.5 ml-2">
              <li><strong>Contact inquiries:</strong> full name, email address, phone number (optional), visa type of interest, and your message.</li>
              <li><strong>Consultation bookings:</strong> full name, email address, phone number, visa type, preferred consultation date, and any additional notes.</li>
              <li><strong>Technical data:</strong> IP address (for fraud prevention and rate-limiting), browser type, and pages visited — collected automatically via server logs.</li>
            </ul>
            <p className="mt-3">
              We do not collect payment card details, government-issued ID numbers, or passport
              information through this website. Such documents are only shared directly with your
              assigned consultant during the consultation process.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-navy mb-3">3. How We Use Your Information</h2>
            <p>Your information is used solely to:</p>
            <ul className="list-disc list-inside mt-3 space-y-1.5 ml-2">
              <li>Respond to your contact inquiry within 24 business hours.</li>
              <li>Confirm and manage your consultation booking.</li>
              <li>Send relevant email notifications related to your inquiry or booking (via Resend).</li>
              <li>Improve our services and website experience.</li>
              <li>Comply with applicable legal obligations in Nepal.</li>
            </ul>
            <p className="mt-3">
              We do <strong>not</strong> sell, rent, or share your personal data with third parties
              for marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-navy mb-3">4. Data Retention</h2>
            <p>
              Inquiry and booking records are retained for <strong>2 years</strong> from the date
              of submission to allow us to follow up and maintain service quality records. After
              this period, records are deleted from our systems.
            </p>
            <p className="mt-3">
              Server log data (IP addresses, request metadata) is retained for up to 90 days and
              then automatically purged.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-navy mb-3">5. Cookies</h2>
            <p>
              Our public website does not use tracking or advertising cookies. The only cookies
              set are:
            </p>
            <ul className="list-disc list-inside mt-3 space-y-1.5 ml-2">
              <li>
                <strong>Session cookies:</strong> used exclusively by our admin panel
                (<code>/admin/*</code>) to maintain secure login sessions for our staff. These
                cookies are HttpOnly, SameSite=Strict, and are never accessible to public visitors.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-navy mb-3">6. Third-Party Services</h2>
            <p>We use the following trusted third-party services to operate our website:</p>
            <ul className="list-disc list-inside mt-3 space-y-1.5 ml-2">
              <li><strong>Supabase / PostgreSQL</strong> — secure cloud database for storing inquiries and bookings.</li>
              <li><strong>Resend</strong> — transactional email delivery for confirmation emails.</li>
              <li><strong>Anthropic (Claude AI)</strong> — powers the AI chat assistant on our website. Chat messages are processed by Anthropic&apos;s API and are subject to their privacy policy. Do not share sensitive personal documents in the chat.</li>
              <li><strong>Cloudinary</strong> — image hosting for blog and service page images.</li>
              <li><strong>Vercel</strong> — website hosting and deployment platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-navy mb-3">7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc list-inside mt-3 space-y-1.5 ml-2">
              <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
              <li><strong>Correction:</strong> Ask us to correct inaccurate or incomplete information.</li>
              <li><strong>Deletion:</strong> Request that we delete your personal data from our records.</li>
              <li><strong>Objection:</strong> Object to our processing of your data in certain circumstances.</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, email us at{" "}
              <a href="mailto:info@thevisaghar.com" className="text-gold hover:underline font-medium">
                info@thevisaghar.com
              </a>{" "}
              with the subject &ldquo;Privacy Request&rdquo;. We will respond within 14 business days.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-navy mb-3">8. Data Security</h2>
            <p>
              We implement appropriate technical and organisational measures to protect your
              personal information against unauthorised access, loss, or misuse. These include
              HTTPS encryption, password hashing, access-controlled admin systems, and rate
              limiting on all public form submissions.
            </p>
            <p className="mt-3">
              No method of transmission over the internet is 100% secure. While we strive to
              protect your data, we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-navy mb-3">9. Children&apos;s Privacy</h2>
            <p>
              Our services are not directed at children under the age of 16. We do not knowingly
              collect personal information from minors. If you believe we have inadvertently
              collected data from a child, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-navy mb-3">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes will be reflected
              on this page with an updated &ldquo;Last updated&rdquo; date. Continued use of our
              website after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-navy mb-3">11. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or how we handle your data,
              please contact:
            </p>
            <div className="mt-3 p-5 rounded-xl bg-off-white border border-gray-200">
              <p className="font-semibold text-navy">The Visa Ghar</p>
              <p>Boudha-6, Pipalbot, Kathmandu, Nepal</p>
              <p>
                Email:{" "}
                <a href="mailto:info@thevisaghar.com" className="text-gold hover:underline">
                  info@thevisaghar.com
                </a>
              </p>
              <p>Phone: 01-4913776, 9851338645</p>
            </div>
          </section>
        </div>

        {/* Back link */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-navy font-semibold hover:text-gold transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
