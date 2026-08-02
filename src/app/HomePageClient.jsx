"use client";

import CountUp from "../components/CountUp";
import Image from "next/image";

export default function HomePageClient() {
  const brandLogos = [
    "ASIAN GRANITO.png",
    "BELL.png",
    "CERA.png",
    "DURAVIT.png",
    "GROHE.png",
    "HINDWARE.png",
    "JAQUAR.png",
    "JOHNSON.png",
    "KAJARIA.png",
    "KEROVIT.png",
    "NITCO.png",
    "ORIENTBELL.png",
    "PARRYWARE.png",
    "SIMPOLO.png",
    "SOMANY.png",
    "VERMORA.png",
    "WINMAX.png",
    "WINTOP.png",
  ];

  return (
    <>
      <main className="relative overflow-hidden bg-[#FFF7F3] text-[#1F1F1F]">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute -top-40 left-[-10%] h-[500px] w-[500px] rounded-full bg-[#FF3131]/10 blur-3xl" />
          <div className="absolute bottom-[-10%] right-[-5%] h-[400px] w-[400px] rounded-full bg-[#FF6A2B]/10 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `
                linear-gradient(to right, #000000 1px, transparent 1px),
                linear-gradient(to bottom, #000000 1px, transparent 1px)
              `,
              backgroundSize: "42px 42px",
            }}
          />
        </div>

        {/* HERO */}
        <section className="relative z-10">
          <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-center gap-16 px-6 py-20 lg:grid-cols-2 lg:px-10">
            {/* LEFT */}
            <div className="max-w-2xl animate-fade-up">
              <div className="mb-6 inline-flex items-center rounded-full border border-[#FF6A2B]/20 bg-white/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#FF6A2B] backdrop-blur-sm">
                Tiles • Sanitaryware • Hardware
              </div>

              <h1 className="text-5xl font-bold leading-[0.95] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
                Deep Ceramics
                <span className="block bg-gradient-to-r from-[#FF3131] to-[#FF6A2B] bg-clip-text text-transparent">
                  & Co.
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-lg leading-8 text-[#666666]">
                Quality tiles, sanitaryware, and practical interior solutions
                for homes, architects, and businesses across India.
              </p>

              {/* Search CTA */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search tiles, brands, categories..."
                    className="w-full rounded-full border border-[#EAEAEA] bg-white/80 px-5 py-3.5 text-sm outline-none transition focus:border-[#FF6A2B] focus:shadow-lg backdrop-blur-sm"
                  />
                </div>
                <a
                  href="/products"
                  className="inline-flex items-center justify-center rounded-full bg-black px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#1F1F1F] hover:shadow-lg"
                >
                  Browse Categories
                </a>
              </div>

              {/* Stats */}
              <div className="mt-12 flex flex-wrap items-center gap-8">
                <div>
                  <h3 className="text-3xl font-bold text-[#1F1F1F]">
                    <CountUp end={20} />
                  </h3>
                  <p className="mt-1 text-sm text-[#666666]">Years of Trust</p>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-[#1F1F1F]">
                    <CountUp end={500} />
                  </h3>
                  <p className="mt-1 text-sm text-[#666666]">Homeowners Served</p>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-[#1F1F1F]">
                    <CountUp end={50} />
                  </h3>
                  <p className="mt-1 text-sm text-[#666666]">Premium Brands</p>
                </div>
                <div className="hidden lg:block">
                  <div className="flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow-sm backdrop-blur-sm">
                    <span className="text-lg">📍</span>
                    <span className="text-sm font-medium">Ahmedabad</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT – Desktop visual */}
            <div className="relative hidden items-center justify-center lg:flex animate-float">
              <div className="relative h-[520px] w-[520px]">
                <div className="absolute left-10 top-0 h-[320px] w-[320px] rounded-[42px] bg-gradient-to-br from-[#FF3131] to-[#FF6A2B] shadow-[0_30px_60px_rgba(255,49,49,0.18)]" />
                <div className="absolute right-0 top-20 h-[280px] w-[280px] rounded-[36px] border border-black/5 bg-white/70 shadow-[0_20px_50px_rgba(0,0,0,0.06)] backdrop-blur-xl" />
                <div className="absolute bottom-0 left-0 h-[220px] w-[220px] rounded-[36px] bg-[#FFE9DF]" />
                <div className="absolute bottom-16 right-10 h-[120px] w-[120px] rounded-[30px] border border-[#FF6A2B]/10 bg-white/80 shadow-xl backdrop-blur-xl" />
                <div className="absolute right-20 top-0 flex h-20 w-20 items-center justify-center rounded-[28px] bg-[#FFF1EB] shadow-lg">
                  <div className="h-5 w-5 rounded-full bg-gradient-to-r from-[#FF3131] to-[#FF6A2B]" />
                </div>
                <div className="absolute left-[-20px] bottom-10 rounded-[28px] border border-black/5 bg-white px-6 py-5 shadow-xl">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#FF6A2B]">
                    Trusted Across Gujarat
                  </p>
                  <h3 className="mt-2 text-4xl font-bold text-[#FF3131]">
                    <CountUp end={500} />+
                  </h3>
                  <p className="mt-1 text-sm text-[#666666]">Happy Clients</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MOBILE PRODUCT COLLAGE */}
        <section className="relative z-10 block lg:hidden px-6 pb-12">
          <div className="grid grid-cols-3 gap-3">
            <div className="aspect-square rounded-xl bg-gradient-to-br from-[#FFE9DF] to-[#FFF1EB]" />
            <div className="aspect-square rounded-xl bg-gradient-to-br from-[#FFD4C4] to-[#FFE9DF]" />
            <div className="aspect-square rounded-xl bg-gradient-to-br from-[#FFC4B0] to-[#FFD4C4]" />
            <div className="aspect-square rounded-xl bg-gradient-to-br from-[#FFE9DF] to-[#FFF1EB]" />
            <div className="aspect-square rounded-xl bg-gradient-to-br from-[#FFD4C4] to-[#FFE9DF]" />
            <div className="aspect-square rounded-xl bg-gradient-to-br from-[#FFC4B0] to-[#FFD4C4]" />
          </div>
          <p className="mt-4 text-center text-sm text-[#666666]">
            Explore our premium tile collections
          </p>
        </section>

        {/* BRANDS – Floating Logo Scroller */}
<section className="relative z-10 overflow-hidden border-y border-black/5 bg-white/40 py-10 backdrop-blur-sm">
  <div className="mb-8 text-center">
    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#FF6A2B]">
      Premium Collection of Designs
    </p>
    <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">
      Trusted Brand Partners
    </h2>
  </div>

  <div className="relative">
    {/* Fade edges */}
    <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-[#FFF7F3] to-transparent" />
    <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-[#FFF7F3] to-transparent" />

    <div className="flex overflow-hidden">
      <div className="brand-scroll flex min-w-max items-center gap-5 pr-5">
        {/* First set */}
        {brandLogos.map((logo, index) => (
          <div
            key={index}
            className="flex h-24 w-[160px] items-center justify-center rounded-2xl bg-white/80 px-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
          >
            <Image
              src={`/Brands/${logo}`}
              alt={logo.replace(".png", "")}
              width={120}
              height={48}
              className="h-12 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
            />
          </div>
        ))}

        {/* Duplicate for seamless scroll */}
        {brandLogos.map((logo, index) => (
          <div
            key={`dup-${index}`}
            className="flex h-24 w-[160px] items-center justify-center rounded-2xl bg-white/80 px-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
          >
            <Image
              src={`/Brands/${logo}`}
              alt={logo.replace(".png", "")}
              width={120}
              height={48}
              className="h-12 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
            />
          </div>
        ))}
      </div>
    </div>
  </div>
</section>
      </main>

      <style jsx>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up {
          animation: fade-up 0.8s ease-out forwards;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .brand-scroll {
          animation: scroll 25s linear infinite;
        }
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (max-width: 640px) {
          .brand-scroll {
            animation-duration: 40s;
          }
        }
      `}</style>
    </>
  );
}