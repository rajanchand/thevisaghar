import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read the Terms of Service for The Visa Ghar immigration consultancy. Understand your rights, our obligations, and the scope of our services.",
};

export default function TermsOfServicePage() {
  return (
    <div className="pt-32 pb-20">
      <div className="section-container max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-navy/10 text-navy text-sm font-semibold mb-4">
            Legal
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy mb-4">
            Terms of Service
          </h1>
          <p className="text-gray-500 text-sm">Last updated: June 2025</p>
        </div>

        {/* Content */}
        <div className="prose prose-navy max-w-none space-y-10 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-navy mb-3">1. Agreement to Terms</h2>
            <p>
              By accessing our website at{" "}
              <span className="font-medium text-navy">thevisaghar.com</span> or by booking a
              consultation, submitting a contact form, or otherwise engaging with The Visa Ghar
              (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;), you agree to be bound
              by these Terms of Service. If you do not agree to these terms, please do not use our
              services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-navy mb-3">2. Nature of Services</h2>
            <p>
              The Visa Ghar provides <strong>immigration consultancy services</strong>, not legal
              services. Our consultants are experienced immigration professionals who provide
              guidance, document preparation assistance, and application support for UK, Schengen,
              and Australia visas.
            </p>
            <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200">
              <p className="font-semibold text-amber-800">Important Disclaimer</p>
              <p className="text-amber-700 mt-1 text-sm">
                We are not a law firm and do not provide legal advice. Our services do not
                constitute legal representation. For complex immigration matters requiring legal
                interpretation, we recommend consulting a licensed immigration lawyer.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-navy mb-3">3. No Guarantee of Visa Approval</h2>
            <p>
              Visa decisions are made solely by the respective embassy, high commission, or
              immigration authority of the destination country. <strong>The Visa Ghar does not
              and cannot guarantee visa approval</strong> for any application. Our quoted
              &ldquo;success rate&rdquo; reflects historical outcomes across all client applications
              and is not a guarantee of any individual result.
            </p>
            <p className="mt-3">
              Factors outside our control — including changes in immigration policy, personal
              circumstances, incomplete or fraudulent documentation, or interviewing officer
              discretion — may affect the outcome of any application.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-navy mb-3">4. Client Obligations</h2>
            <p>When using our services, you agree to:</p>
            <ul className="list-disc list-inside mt-3 space-y-1.5 ml-2">
              <li>Provide accurate, complete, and truthful information at all times.</li>
              <li>Disclose any prior visa refusals, immigration violations, or criminal history.</li>
              <li>Submit all required documents in a timely manner as requested by your consultant.</li>
              <li>Notify us immediately of any changes in your personal circumstances that may affect your application.</li>
            </ul>
            <p className="mt-3">
              Providing false or misleading information may result in visa refusal, ban, or legal
              consequences. The Visa Ghar accepts no liability for outcomes resulting from
              inaccurate client-provided information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-navy mb-3">5. Fees and Payments</h2>
            <p>
              Initial consultations offered through our website are <strong>free of charge</strong>.
              Fees for full consultancy services (document preparation, application filing,
              follow-up support) are agreed upon separately before work commences and are set out
              in a written service agreement.
            </p>
            <p className="mt-3">
              Government visa fees, courier charges, translation fees, and other third-party
              disbursements are not included in our consultancy fees and are the sole
              responsibility of the client.
            </p>
            <p className="mt-3">
              Refund terms are specified in the individual service agreement. Generally, our
              consultancy fees are non-refundable once work has commenced, regardless of visa
              outcome.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-navy mb-3">6. Intellectual Property</h2>
            <p>
              All content on this website — including text, images, logos, blog articles, and
              service descriptions — is the intellectual property of The Visa Ghar and is
              protected by applicable copyright laws. You may not reproduce, distribute, or use
              our content for commercial purposes without prior written consent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-navy mb-3">7. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, The Visa Ghar shall not be liable for:
            </p>
            <ul className="list-disc list-inside mt-3 space-y-1.5 ml-2">
              <li>Any visa refusal or delay caused by embassy or government decisions.</li>
              <li>Loss of income, travel costs, or other indirect losses arising from an unsuccessful visa application.</li>
              <li>Errors or omissions in information provided on this website (which is provided &ldquo;as is&rdquo; for general information purposes).</li>
              <li>Service interruptions, data loss, or technical issues beyond our reasonable control.</li>
            </ul>
            <p className="mt-3">
              Our total liability for any claim arising from our consultancy services shall not
              exceed the consultancy fee paid by the client for the specific service in question.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-navy mb-3">8. Privacy</h2>
            <p>
              Your use of our services is also governed by our{" "}
              <Link href="/privacy" className="text-gold hover:underline font-medium">
                Privacy Policy
              </Link>
              , which is incorporated into these Terms of Service by reference.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-navy mb-3">9. Changes to Services and Terms</h2>
            <p>
              We reserve the right to modify these Terms of Service at any time. Changes take
              effect immediately upon posting to this page. Continued use of our services after
              any changes constitutes your acceptance of the updated terms.
            </p>
            <p className="mt-3">
              We may also change, suspend, or discontinue any aspect of our services at any time
              without prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-navy mb-3">10. Governing Law and Disputes</h2>
            <p>
              These Terms of Service shall be governed by and construed in accordance with the
              laws of <strong>Nepal</strong>. Any disputes arising from these terms or our services
              shall be subject to the exclusive jurisdiction of the courts of Kathmandu, Nepal.
            </p>
            <p className="mt-3">
              We encourage clients to first contact us at{" "}
              <a href="mailto:info@thevisaghar.com" className="text-gold hover:underline font-medium">
                info@thevisaghar.com
              </a>{" "}
              to resolve any concerns before pursuing formal legal remedies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-navy mb-3">11. Contact</h2>
            <p>
              For questions about these Terms of Service, please contact us:
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
