export default function Footer() {
  return (
    <footer className="py-12 px-6 font-mono">
      <div className="max-w-5xl mx-auto terminal-divider mb-8" />
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-[#eae6da]/60 tracking-wider">
          &copy; {new Date().getFullYear()} MuffinManLabs
        </p>
        <a
          href="/memory-map"
          className="text-[11px] text-[#eae6da]/60 hover:text-[#f0d488] tracking-[0.2em] transition-colors duration-300"
        >
          STM32 MEMORY MAP EXPLORER
        </a>
        <p className="text-[11px] text-[#d4af37]/70 tracking-[0.2em]">
          DESIGNED FOR FAB · KICAD NATIVE · ENIG
        </p>
      </div>
    </footer>
  );
}
