// src/app/layout.jsx
import "./globals.css";
import { Inter } from "next/font/google";
import Script from "next/script";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatsAppFloat from "../components/WhatsAppFloat";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://deepceramics.in"),
  title: {
    default: "Deep Ceramics.",
    template: "%s | Deep Ceramics.",
  },
  description:
    "Premium tiles, sanitaryware, bathroom fittings and complete home construction solutions in Ahmedabad.",
  keywords: [
    "Tiles Ahmedabad",
    "Sanitaryware Ahmedabad",
    "Bathroom Fittings Ahmedabad",
    "Tile Showroom Ahmedabad",
    "Kajaria Tiles",
    "Somany Tiles",
    "CERA",
    "Jaquar",
    "Deep Ceramics",
  ],
  authors: [{ name: "Deep Ceramics." }],
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Deep Ceramics.",
    description:
      "Premium tiles, sanitaryware, bathroom fittings and complete home construction solutions in Ahmedabad.",
    url: "https://deepceramics.in",
    siteName: "Deep Ceramics.",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Deep Ceramics.",
    description:
      "Premium tiles, sanitaryware, bathroom fittings and complete home construction solutions in Ahmedabad.",
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

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Deep Ceramics.",
  url: "https://deepceramics.in",
  logo: "https://deepceramics.in/logo.png",
  description:
    "Premium tiles, sanitaryware, bathroom fittings and complete home construction solutions in Ahmedabad.",
  sameAs: [
    "https://www.instagram.com/deeptradingnco",
    "https://www.facebook.com/deeptradingnco",
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Ahmedabad",
    addressRegion: "Gujarat",
    addressCountry: "IN",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Deep Ceramics.",
  url: "https://deepceramics.in",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://deepceramics.in/search?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-[#FFF7F3] text-[#1F1F1F] antialiased`}
      >
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />

        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />

        <Navbar />

        <main className="min-h-screen">
          {children}
        </main>

        <Footer />

        <WhatsAppFloat />
      </body>
    </html>
  );
}
