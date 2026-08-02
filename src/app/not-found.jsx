"use client";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#FFF7F3] px-6 text-center">
      {/* Decorative background pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Floating tile illustration */}
      <div className="relative mb-8 animate-float-slow">
        <svg
          viewBox="0 0 120 120"
          className="h-28 w-28 drop-shadow-2xl sm:h-36 sm:w-36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="15"
            y="15"
            width="90"
            height="90"
            rx="20"
            className="fill-white"
            stroke="url(#tileGradient)"
            strokeWidth="3"
          />
          <line x1="45" y1="15" x2="45" y2="105" stroke="#FF6A2E" strokeOpacity="0.15" strokeWidth="2" />
          <line x1="75" y1="15" x2="75" y2="105" stroke="#FF6A2E" strokeOpacity="0.15" strokeWidth="2" />
          <line x1="15" y1="45" x2="105" y2="45" stroke="#FF6A2E" strokeOpacity="0.15" strokeWidth="2" />
          <line x1="15" y1="75" x2="105" y2="75" stroke="#FF6A2E" strokeOpacity="0.15" strokeWidth="2" />
          <path
            d="M60 20 L55 35 L65 50 L52 65 L58 80 L48 100"
            stroke="#FF3131"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            className="opacity-80"
          />
          <defs>
            <linearGradient id="tileGradient" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#FF3131" />
              <stop offset="1" stopColor="#FF6A2B" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <h1 className="bg-gradient-to-r from-[#FF3131] to-[#FF6A2B] bg-clip-text text-[7rem] font-extrabold leading-none text-transparent sm:text-[9rem]">
        404
      </h1>

      <h2 className="mt-2 text-2xl font-semibold text-[#1F1F1F] sm:text-3xl">
        Oops! This tile got lost.
      </h2>
      <p className="mt-3 max-w-md text-[#666666] sm:text-lg">
        The page you're looking for doesn't exist or may have been moved.  
        Let's get you back to our beautiful collection.
      </p>

      <a
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-black px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#1F1F1F] hover:shadow-lg"
      >
        ← Back to Home
      </a>

      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .animate-float-slow {
          animation: float-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}