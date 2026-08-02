import Script from "next/script";
import HomePageClient from "./HomePageClient";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Deep Ceramics & Co.",
  url: "https://deepceramics.in",
  logo: "https://deepceramics.in/logo.png",
  description:
    "Premium tiles, sanitaryware, and home solutions provider in Ahmedabad.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "19/8 Mahalaxmi Ind Estate, SG Highway, Gota",
    addressLocality: "Ahmedabad",
    addressRegion: "Gujarat",
    postalCode: "382481",
    addressCountry: "IN",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91 98989 54803",
    contactType: "sales",
    availableLanguage: ["English", "Hindi"],
  },
  sameAs: [
    "https://www.facebook.com/deeptradingnco",
    "https://www.instagram.com/deeptradingnco",
  ],
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Deep Ceramics & Co.",
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
  ],
};

export const metadata = {
  title: "Deep Ceramics & Co. – Tiles, Sanitaryware & Home Solutions",
  description:
    "Premium tiles, sanitaryware, and home solutions provider in Ahmedabad. Trusted by 500+ homeowners. Explore our collections.",
};

export default function HomePage() {
  return (
    <>
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
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
      <HomePageClient />
    </>
  );
}