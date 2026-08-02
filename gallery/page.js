export const metadata = {
  title: "Project Gallery | Deep Ceramics.",
  description:
    "Explore our project gallery showcasing premium tiles, sanitaryware, bathroom spaces, kitchens, living rooms, and commercial installations completed across Ahmedabad.",
  alternates: {
    canonical: "https://deepceramics.in/gallery",
  },
  openGraph: {
    title: "Project Gallery | Deep Ceramics.",
    description:
      "View completed residential and commercial projects featuring premium tiles, sanitaryware, and fittings.",
    url: "https://deepceramics.in/gallery",
    siteName: "Deep Ceramics.",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Project Gallery | Deep Ceramics.",
    description:
      "View completed residential and commercial projects featuring premium tiles, sanitaryware, and fittings.",
  },
};

export default function Gallery() {
  // static array → defined outside render work
  const items = [1, 2, 3, 4, 5, 6];

  return (
    <div className="min-h-screen bg-[#F7F7F7] text-[#121212]">
      <section className="mx-auto max-w-7xl px-4 py-16">
        {/* HEADER */}
        <header className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6F6F6F]">
            Deep Ceramics.
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#FF6A2E]">
            Project Gallery
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-[#6F6F6F]">
            A glimpse of bathrooms, living rooms, kitchens and commercial spaces
            styled with our tiles, sanitaryware and fittings.
          </p>
        </header>

        {/* GRID */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
          {items.map((item) => (
            <button
              key={item}
              type="button"
              className="group relative h-64 w-full overflow-hidden rounded-2xl
                         bg-[#EDEDED] shadow-sm
                         transition-transform duration-200
                         hover:-translate-y-0.5 hover:shadow-md
                         active:scale-[0.98]"
            >
              {/* IMAGE PLACEHOLDER */}
              <div className="absolute inset-0 bg-[#EDEDED]" />

              {/* OVERLAY */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

              {/* CONTENT */}
              <div className="relative flex h-full flex-col justify-end p-4 text-left">
                <span className="inline-flex w-fit rounded-full bg-[#FF6A2E]/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#FF6A2E]">
                  Deep · Project
                </span>

                <h2 className="mt-2 text-sm font-semibold text-white">
                  Residence #{item}
                </h2>

                <p className="mt-1 text-xs text-[#EDEDED]">
                  Wall & floor tiles with coordinated fittings.
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
