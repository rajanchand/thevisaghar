import type { Metadata } from "next";
import { Fraunces, Hanken_Grotesk } from "next/font/google";
import { Providers } from "@/components/Providers";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "The Visa Ghar — Study Abroad Consultancy, Kathmandu",
    template: "%s | The Visa Ghar",
  },
  description:
    "Expert study abroad counselling from Kathmandu. University selection, visa guidance, IELTS & PTE prep, and end-to-end application support for the UK, USA, Australia, Canada, and more.",
  keywords: [
    "study abroad Nepal",
    "visa consultancy Kathmandu",
    "UK student visa Nepal",
    "IELTS preparation Kathmandu",
    "PTE class Nepal",
    "Australia student visa",
    "Canada study visa Nepal",
    "The Visa Ghar",
  ],
  authors: [{ name: "The Visa Ghar" }],
  creator: "The Visa Ghar",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "The Visa Ghar",
    title: "The Visa Ghar — Study Abroad Consultancy, Kathmandu",
    description:
      "Expert study abroad counselling from Kathmandu. University selection, visa guidance, and test preparation.",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Visa Ghar — Study Abroad Consultancy, Kathmandu",
    description:
      "Expert study abroad counselling from Kathmandu. University selection, visa guidance, and test preparation.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "The Visa Ghar",
  url: "https://thevisaghar.com",
  logo: "https://thevisaghar.com/images/logo.png",
  description:
    "Education and visa consultancy based in Kathmandu, Nepal, helping Nepali students study abroad.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Boudha-6, Pipalbot",
    addressLocality: "Kathmandu",
    addressCountry: "NP",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+977-1-4913776",
    contactType: "customer service",
    availableLanguage: ["English", "Nepali"],
  },
  sameAs: [
    "https://facebook.com/thevisaghar",
    "https://instagram.com/thevisaghar",
    "https://linkedin.com/company/thevisaghar",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${hankenGrotesk.variable}`}
      data-scroll-behavior="smooth"
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0E3B2E" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:bg-accent focus:text-ink focus:px-4 focus:py-2 focus:rounded-lg focus:font-semibold"
        >
          Skip to main content
        </a>
        <Providers>
          {children}
          <WhatsAppButton />
        </Providers>
      </body>
    </html>
  );
}
