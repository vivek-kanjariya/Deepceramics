"use client";

export default function WhatsAppFloat() {
  const phoneNumber = "919974165307";

  const message = encodeURIComponent(
    "Hi, I'm interested in your tiles and sanitary solutions."
  );

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-full bg-[#5ded40] px-4 py-3 shadow-lg transition hover:scale-110 active:scale-95"
      aria-label="Chat on WhatsApp"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        className="h-6 w-6 fill-white"
      >
        <path d="M16.001 2.999c-7.18 0-13.002 5.822-13.002 13.002 0 2.29.6 4.52 1.74 6.5L2.9 29.002l6.66-1.75a12.94 12.94 0 006.44 1.74c7.18 0 13.002-5.82 13.002-13.002S23.18 2.999 16.001 2.999zm0 23.004c-2.03 0-4.02-.55-5.76-1.6l-.41-.24-3.95 1.04 1.05-3.85-.27-.42a10.9 10.9 0 01-1.66-5.78c0-6.03 4.9-10.93 10.93-10.93 6.03 0 10.93 4.9 10.93 10.93 0 6.03-4.9 10.93-10.93 10.93z" />
      </svg>

      <span className="hidden sm:block text-sm font-medium text-white">
        Chat on WhatsApp
      </span>
    </a>
  );
}