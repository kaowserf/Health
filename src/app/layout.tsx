import type { Metadata, Viewport } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import { SITE_URL, SESSIONS, LOCATION, BRAND, HERO } from "@/lib/seminar";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const description =
  "Join Health & Wealth Legacy for a FREE educational Estate Planning Seminar on Wills & Living Trusts. Three sessions Sept 10 & 12, 2026 in Gladstone, MO. Reserve your seat today.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Free Estate Planning Seminar — Wills & Living Trusts | Gladstone, MO",
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: BRAND.name,
    title: "Free Estate Planning Seminar — Wills & Living Trusts | Gladstone, MO",
    description,
    images: [{ url: "/images/speaker.png", width: 1200, height: 630, alt: HERO.headline }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Estate Planning Seminar — Wills & Living Trusts | Gladstone, MO",
    description,
    images: ["/images/speaker.png"],
  },
  robots: { index: true, follow: true },
};

// Correct mobile scaling + branded browser UI. Zoom left enabled for a11y.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f2a47",
};

// schema.org Event JSON-LD — one Event per session for rich results (PRD §7.9).
function eventJsonLd() {
  return SESSIONS.map((s) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Complimentary Estate Planning Seminar: Wills & Living Trusts",
    description,
    startDate: s.date,
    endDate: s.endDate,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: LOCATION.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: LOCATION.street,
        addressLocality: LOCATION.city,
        addressRegion: LOCATION.state,
        postalCode: LOCATION.zip,
        addressCountry: "US",
      },
    },
    organizer: {
      "@type": "Organization",
      name: BRAND.name,
      url: BRAND.websiteUrl,
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: SITE_URL,
    },
    isAccessibleForFree: true,
  }));
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${poppins.variable} ${inter.variable} h-full`}
    >
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd()) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-charcoal">
        {children}
      </body>
    </html>
  );
}
