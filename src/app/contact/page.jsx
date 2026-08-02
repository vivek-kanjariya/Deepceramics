// src/app/contact/page.jsx
import { Suspense } from "react";
import Script from "next/script";
import ContactPageClient from "./ContactPageClient";

// ─── SCHEMAS (SEO) ─────────────────────────────────────────────
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Deep Ceramics.",
  image: "https://deepceramics.in/logo.png",
  telephone: "+91 98989 54803",
  email: "deepceramics@gmail.com",
  priceRange: "₹₹",
  address: {
    "@type": "PostalAddress",
    streetAddress: "19/8 Mahalaxmi Ind Estate, SG Highway, Gota",
    addressLocality: "Ahmedabad",
    addressRegion: "Gujarat",
    postalCode: "382481",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 23.09053,
    longitude: 72.52305,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "09:00",
      closes: "20:00",
    },
  ],
  sameAs: [
    "https://www.facebook.com/deeptradingnco",
    "https://www.instagram.com/deeptradingnco",
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://deepceramics.in",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Contact",
      item: "https://deepceramics.in/contact",
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Where is Deep Ceramics. located?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Deep Ceramics. is located at 19/8 Mahalaxmi Ind Estate, SG Highway, Gota, Ahmedabad, Gujarat.",
      },
    },
    {
      "@type": "Question",
      name: "What are your showroom timings?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our showroom is open from 9:00 AM to 8:00 PM every day.",
      },
    },
    {
      "@type": "Question",
      name: "What products do you offer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We offer tiles, sanitaryware, bathroom fittings, kitchen solutions and complete home construction products.",
      },
    },
  ],
};

export const metadata = {
  title: "Contact Us | Deep Ceramics.",
  description:
    "Get in touch with Deep Ceramics. for premium tiles, sanitaryware, fittings, and complete home construction solutions in Ahmedabad.",
  alternates: {
    canonical: "https://deepceramics.in/contact",
  },
  openGraph: {
    title: "Contact Us | Deep Ceramics.",
    description:
      "Visit our Ahmedabad showroom or contact our team for tiles, sanitaryware, and construction solutions.",
    url: "https://deepceramics.in/contact",
    siteName: "Deep Ceramics.",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Deep Ceramics.",
    description:
      "Visit our Ahmedabad showroom or contact our team for tiles, sanitaryware, and construction solutions.",
  },
};

export default function ContactPage() {
  return (
    <>
      <Script
        id="local-business-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>}>
        <ContactPageClient />
      </Suspense>
    </>
  );
}