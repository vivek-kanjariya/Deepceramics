import type { Metadata } from "next";
import Image from "next/image";

// ─────────────────────────────────────────────
// METADATA
// ─────────────────────────────────────────────
export const metadata: Metadata = {
  title: "About Deep Ceramics | Premium Tiles & Sanitaryware — Ahmedabad",
  description:
    "Deep Ceramics is Ahmedabad's trusted supplier of premium tiles, sanitaryware, bathroom fittings, and complete home construction solutions. 30+ years experience serving homeowners, architects, and builders across Gujarat.",
  keywords: [
    "tiles Ahmedabad",
    "sanitaryware Ahmedabad",
    "bathroom fittings Ahmedabad",
    "floor tiles Gujarat",
    "wall tiles Ahmedabad",
    "vitrified tiles Ahmedabad",
    "tile showroom Ahmedabad",
    "Deep Trading n Co",
    "Deep Ceramics Ahmedabad",
    "home construction solutions Gujarat",
    "kitchen tiles Ahmedabad",
    "premium tiles Gujarat",
  ],
  alternates: {
    canonical: "https://deepceramics.in/about",
  },
  openGraph: {
    title: "About Deep Ceramics | Premium Tiles & Sanitaryware — Ahmedabad",
    description:
      "Ahmedabad's trusted supplier of premium tiles, sanitaryware, and complete home construction solutions. Serving homeowners, architects, and builders across Gujarat for 30+ years.",
    url: "https://deepceramics.in/about",
    siteName: "Deep Ceramics",
    images: [
      {
        url: "https://deepceramics.in/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Deep Ceramics — Premium Tile & Sanitaryware Showroom, Ahmedabad",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Deep Ceramics | Premium Tiles & Sanitaryware — Ahmedabad",
    description:
      "Ahmedabad's trusted supplier of premium tiles, sanitaryware, and complete home construction solutions.",
    images: ["https://deepceramics.in/og-image.jpg"],
  },
};

// ─────────────────────────────────────────────
// JSON-LD SCHEMA — Organization + AboutPage + LocalBusiness
// AI engines (ChatGPT, Perplexity, Gemini) use this to
// understand who you are and cite you correctly.
// ─────────────────────────────────────────────
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    // 1. LocalBusiness — tells AI & Google exactly what you do, where, and how to contact you
    {
      "@type": ["LocalBusiness", "Store"],
      "@id": "https://deepceramics.in/#business",
      name: "Deep Ceramics",
      alternateName: ["Deep Ceramics", "Deep Trading and Co", "Deep Ceramics Ahmedabad"],
      description:
        "Deep Ceramics is a trusted supplier of premium tiles, sanitaryware, bathroom fittings, kitchen solutions, and complete home construction products based in Ahmedabad, Gujarat, India. Serving homeowners, architects, interior designers, builders, and contractors for 30+ years.",
      url: "https://deepceramics.in",
      logo: {
        "@type": "ImageObject",
        url: "https://deepceramics.in/og-image.jpg",
        width: 1200,
        height: 630,
      },
      image: "https://deepceramics.in/og-image.jpg",
      telephone: ["+919898954803", "+919974165307"],
      email: "deepceramics@gmail.com",
      // Replace XXAAAABBBBCXXXXZ with your actual GST number
      taxID: "24XXXXX0000X1ZX",
      address: {
        "@type": "PostalAddress",
        streetAddress: "19/8 Mahalaxmi Industrial Estate, SG Highway, Gota",
        addressLocality: "Ahmedabad",
        addressRegion: "Gujarat",
        postalCode: "382481",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        // SG Highway, Gota, Ahmedabad — update to exact coordinates if you have them
        latitude: 23.1136,
        longitude: 72.5274,
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday","Tuesday","Wednesday","Thursday",
            "Friday","Saturday","Sunday",
          ],
          opens: "09:00",
          closes: "20:00",
        },
      ],
      priceRange: "₹₹",
      currenciesAccepted: "INR",
      paymentAccepted: "Cash, Credit Card, Debit Card, UPI, Bank Transfer",
      areaServed: [
        {
          "@type": "City",
          name: "Ahmedabad",
        },
        {
          "@type": "State",
          name: "Gujarat",
        },
      ],
      // sameAs — links to all your profiles so AI can verify and cross-reference your identity
      sameAs: [
        "https://deepceramics.in",
        "https://www.google.com/maps/search/Deep+Trading+n+Co+Ahmedabad",
        // Add these once created:
        // "https://www.facebook.com/deepceramics",
        // "https://www.instagram.com/deepceramics",
        // "https://www.linkedin.com/company/deep-trading-n-co",
        // "https://www.justdial.com/Ahmedabad/Deep-Trading-n-Co/...",
        // "https://www.indiamart.com/deep-trading-n-co/",
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Tiles, Sanitaryware & Home Solutions",
        itemListElement: [
          {
            "@type": "OfferCatalog",
            name: "Tiles",
            description:
              "Wall tiles, floor tiles, vitrified tiles, ceramic tiles, large format tiles, bathroom tiles, kitchen tiles, outdoor tiles, parking tiles",
          },
          {
            "@type": "OfferCatalog",
            name: "Sanitaryware",
            description:
              "Wash basins, water closets (WC), toilets, bathroom accessories",
          },
          {
            "@type": "OfferCatalog",
            name: "Bathroom Fittings",
            description: "Faucets, taps, showers, shower panels, mixers",
          },
          {
            "@type": "OfferCatalog",
            name: "Kitchen Solutions",
            description: "Kitchen sinks, kitchen fittings, kitchen tiles",
          },
        ],
      },
      knowsAbout: [
        "Tiles",
        "Sanitaryware",
        "Bathroom Fittings",
        "Floor Tiles",
        "Wall Tiles",
        "Vitrified Tiles",
        "Ceramic Tiles",
        "Large Format Tiles",
        "Home Construction Materials",
        "Interior Finishing Materials",
        "Commercial Project Supplies",
      ],
    },

    // 2. AboutPage — structured page identity for AI answer engines
    {
      "@type": "AboutPage",
      "@id": "https://deepceramics.in/about#webpage",
      url: "https://deepceramics.in/about",
      name: "About Deep Ceramics | Ahmedabad Tile & Sanitaryware Supplier",
      description:
        "About page of Deep Ceramics, Ahmedabad's premier supplier of premium tiles, sanitaryware, bathroom fittings, and home construction solutions.",
      isPartOf: {
        "@type": "WebSite",
        "@id": "https://deepceramics.in/#website",
        url: "https://deepceramics.in",
        name: "Deep Ceramics",
        description:
          "Premium tiles, sanitaryware, and complete home construction solutions in Ahmedabad, Gujarat.",
        publisher: {
          "@id": "https://deepceramics.in/#business",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: "https://deepceramics.in/products?q={search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
      },
      about: {
        "@id": "https://deepceramics.in/#business",
      },
      breadcrumb: {
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
            name: "About",
            item: "https://deepceramics.in/about",
          },
        ],
      },
    },

    // 3. FAQPage — AI engines extract these as direct answers for "who is Deep Trading n Co" type queries
    {
      "@type": "FAQPage",
      "@id": "https://deepceramics.in/about#faq",
      mainEntity: [
        {
          "@type": "Question",
          name: "What does Deep Ceramics sell?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Deep Ceramics sells premium tiles (wall, floor, vitrified, ceramic, large format, outdoor, parking), sanitaryware (wash basins, WCs), bathroom fittings (faucets, taps, showers), and complete kitchen and home construction solutions.",
          },
        },
        {
          "@type": "Question",
          name: "Where is Deep Ceramics located?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Deep Ceramics is located at 19/8 Mahalaxmi Industrial Estate, SG Highway, Gota, Ahmedabad, Gujarat, India. The showroom is open Monday to Sunday, 9:00 AM to 8:00 PM.",
          },
        },
        {
          "@type": "Question",
          name: "How can I contact Deep Ceramics?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "You can contact Deep Ceramics by phone at +91 98989 54803 or +91 99741 65307, or by email at deepceramics@gmail.com. Visit the showroom at SG Highway, Gota, Ahmedabad.",
          },
        },
        {
          "@type": "Question",
          name: "Who are the customers of Deep Ceramics?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Deep Ceramics serves homeowners, architects, interior designers, builders, contractors, and commercial projects including apartments, villas, offices, hotels, restaurants, and real estate developments across Ahmedabad and Gujarat.",
          },
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────
// PAGE — UI IS EXACTLY THE SAME AS BEFORE
// ─────────────────────────────────────────────
export default function About() {
  return (
    <>
      {/* Inject JSON-LD into <head> */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-[#F7F7F7] text-[#121212]">
        {/* WRAPPER */}
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          {/* HERO */}
          <section className="py-20">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6F6F6F]">
              Deep Ceramics
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#FF6A2E]">
              About Deep Ceramics
            </h1>

            <p className="mt-3 max-w-2xl text-base text-[#6F6F6F]">
              Ahmedabad&apos;s trusted destination for{" "}
              <span className="font-semibold text-[#121212]">
                premium tiles, sanitaryware, and complete home construction
                solutions.
              </span>
            </p>
          </section>

          {/* CONTENT */}
          <section className="grid grid-cols-1 gap-14 pb-24 md:grid-cols-2">
            {/* TEXT */}
            <div className="space-y-6 text-base leading-relaxed text-[#4A4A4A]">
              <p>
                Deep Ceramics was built with a simple goal — to make
                high-quality, well-designed surfaces accessible to modern Indian
                homes and commercial spaces.
              </p>

              <p>
                With over{" "}
                <span className="font-semibold text-[#121212]">
                  30+ years of experience
                </span>
                , we curate ceramic, vitrified and designer tiles from trusted
                manufacturers, focusing on durability, aesthetics and long-term
                value.
              </p>

              <p>
                From compact apartments to large commercial projects, our team
                helps customers choose the right materials with clarity and
                confidence.
              </p>
            </div>

            {/* IMAGE BLOCK */}
            <div className="relative h-[420px] overflow-hidden rounded-2xl bg-[#EDEDED]">
              <Image
                src="https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1600&q=80"
                alt="Deep Ceramics tile showroom in Ahmedabad showing premium wall and floor tiles"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority={false}
              />

              <div className="absolute inset-0 bg-black/30" />

              <div className="absolute bottom-6 left-6">
                <p className="text-sm font-medium text-white">
                  Premium Tile &amp; Surface Showroom
                </p>
                <p className="text-xs text-white/80">
                  SG Highway, Gota · Ahmedabad, Gujarat
                </p>
              </div>
            </div>
          </section>

          {/* STATS */}
          <section className="pb-24">
            <div className="grid grid-cols-2 gap-6 rounded-2xl bg-white p-8 text-center shadow-sm sm:grid-cols-4">
              <div>
                <p className="text-3xl font-semibold text-[#FF6A2E]">30+</p>
                <p className="mt-1 text-sm text-[#6F6F6F]">Years Experience</p>
              </div>
              <div>
                <p className="text-3xl font-semibold text-[#FF6A2E]">1000+</p>
                <p className="mt-1 text-sm text-[#6F6F6F]">Tile Designs</p>
              </div>
              <div>
                <p className="text-3xl font-semibold text-[#FF6A2E]">500+</p>
                <p className="mt-1 text-sm text-[#6F6F6F]">Projects Completed</p>
              </div>
              <div>
                <p className="text-3xl font-semibold text-[#FF6A2E]">Trusted</p>
                <p className="mt-1 text-sm text-[#6F6F6F]">
                  By Architects, Builders &amp; Home Owners
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}