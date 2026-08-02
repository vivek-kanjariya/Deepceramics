import HomePage from "./HomePage";

export const metadata = {
  title: "Deep Ceramics. | Premium Tiles, Sanitaryware & Home Solutions",
  description:
    "Deep Ceramics. offers premium tiles, sanitaryware, bathroom fittings, and complete home construction solutions in Ahmedabad. Explore leading brands and modern designs for homes and commercial projects.",
  keywords: [
    "Tiles Ahmedabad",
    "Floor Tiles Ahmedabad",
    "Wall Tiles Ahmedabad",
    "Sanitaryware Ahmedabad",
    "Bathroom Fittings Ahmedabad",
    "Kajaria Tiles",
    "Somany Tiles",
    "CERA",
    "Jaquar",
    "Simpolo",
    "Varmora",
    "Home Construction Solutions",
    "Tile Showroom Ahmedabad",
    "Deep Ceramics",
  ],
  alternates: {
    canonical: "https://deepceramics.in",
  },
  openGraph: {
    title: "Deep Ceramics. | Premium Tiles & Sanitaryware",
    description:
      "Premium tiles, sanitaryware, fittings, and complete home solutions for residential and commercial projects.",
    url: "https://deepceramics.in",
    siteName: "Deep Ceramics.",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Deep Ceramics. | Premium Tiles & Sanitaryware",
    description:
      "Premium tiles, sanitaryware, fittings, and complete home solutions for residential and commercial projects.",
  },
};

export default function Page() {
  return <HomePage />;
}