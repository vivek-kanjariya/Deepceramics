export default function Footer() {
  return (
    <footer className="border-t border-[#EDEDED] bg-[#F7F7F7]">
      <div className="mx-auto max-w-6xl px-4 py-6">

        <div className="flex flex-col gap-2 text-xs text-[#6F6F6F] md:flex-row md:items-center md:justify-between">

          <span>
            © {new Date().getFullYear()} Deep Ceramics. All Rights Reserved.
          </span>

          <span className="md:text-right">
            Ahmedabad • Premium Tiles • Sanitaryware • Bathroom Fittings
          </span>

        </div>
      </div>
    </footer>
  );
}