import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Providers } from "@/components/Providers";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "The Visa Ghar — Your Trusted Immigration Partner",
    template: "%s | The Visa Ghar",
  },
  description:
    "Expert visa consultancy for UK, Schengen, and Australia from Nepal. 98% success rate with personalized guidance. Book a free consultation today.",
  keywords: [
    "visa consultancy Nepal",
    "UK visa from Nepal",
    "student visa Nepal",
    "immigration consultant Kathmandu",
    "Schengen visa Nepal",
    "Australia PR Nepal",
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
    title: "The Visa Ghar — Your Trusted Immigration Partner",
    description:
      "Expert visa consultancy for UK, Schengen, and Australia from Nepal. 98% success rate.",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Visa Ghar — Your Trusted Immigration Partner",
    description:
      "Expert visa consultancy for UK, Schengen, and Australia from Nepal.",
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
  "@type": "Organization",
  name: "The Visa Ghar",
  url: "https://thevisaghar.com",
  logo: "https://thevisaghar.com/images/logo.png",
  description: "Expert visa and immigration consultancy based in Kathmandu, Nepal.",
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
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable} scroll-smooth`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0B1F4B" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:bg-gold focus:text-navy focus:px-4 focus:py-2 focus:rounded-lg focus:font-semibold"
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
