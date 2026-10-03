import MemoryMapExplorer from "@/components/stm32f407_memory_map";
import SectionHead from "@/components/ui/SectionHead";
import Icon from "@/components/ui/Icon";

const TITLE = "STM32F407 Memory Map Explorer | MuffinByteLabs";
const DESCRIPTION =
  "An interactive explorer for the STM32F407VGT6 memory map — the full 4 GB Cortex-M4 address space as one expandable tree, with peripheral registers, clock-enable bits, and address, bit-band and baud-rate calculators.";

/* openGraph/twitter in full — Next does not merge them field-by-field with
   the layout, so omitting them here shares this page as the homepage's card
   with the homepage's URL. */
export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/memory-map" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/memory-map",
    siteName: "Ray Malik · MuffinByteLabs",
    type: "website",
    locale: "en_US",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "MuffinByteLabs — PCB design" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og.png"],
  },
};

/* What the tool actually does, listed so a visitor knows before they click. */
const FEATURES: { name: string; note: string }[] = [
  { name: "Address calculator", note: "paste any hex address, get region, bus, peripheral and register" },
  { name: "Bit-band calculators", note: "SRAM and peripheral aliases, both directions" },
  { name: "Baud-rate calculator", note: "USART BRR mantissa / fraction, with the error percentage" },
  { name: "Register views", note: "offsets and one-line meanings, per peripheral" },
  { name: "Clock paths", note: "HSI → PLL → SYSCLK → bus, and the RCC enable bit each block needs" },
  { name: "Search, bookmarks, minimap", note: "for finding your way back to the block you were on" },
];

export default function MemoryMapPage() {
  return (
    <section className="relative overflow-hidden px-6 pt-32 pb-20 sm:pt-36">
      <div aria-hidden className="grid-bg absolute inset-0 -z-10" />
      <div className="max-w-6xl mx-auto">
        {/* ── why this exists ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] gap-x-14 gap-y-10 items-end">
          <div>
            <SectionHead
              as="h1"
              label="Side project · a tool, not a product"
              title={
                <>
                  STM32F407 <em>Memory&nbsp;Map</em> Explorer
                </>
              }
            />
            <div className="mt-6 max-w-[64ch] flex flex-col gap-5">
              <p className="m-0 text-[16px] leading-8" style={{ color: "var(--text-2)" }}>
                This is a personal tool. I build my own firmware for the boards I design, and
                bare-metal STM32 work means living inside a reference manual where the memory map,
                the register tables and the clock-enable bits are hundreds of pages apart. So I
                built the version I wanted: the whole 4&nbsp;GB Cortex-M4 address space as one
                expandable tree, with the registers, the bus each peripheral sits on, and the
                calculators I kept re-doing on paper.
              </p>

              <p className="m-0 text-[15px] leading-7" style={{ color: "var(--text-3)" }}>
                It lives on this site because firmware-aware layout is a large part of what I
                actually sell. Knowing which pin can be an ADC input, which peripherals share a bus,
                and what the chip reads at boot is what decides where parts go on the board &mdash;
                and the difference between a schematic that routes cleanly and one that fights you.
              </p>
            </div>
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 m-0 p-0 list-none">
            {FEATURES.map((f) => (
              <li key={f.name} className="rounded-xl px-4 py-3.5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <span className="flex items-center gap-2 text-[13.5px] font-medium leading-6" style={{ color: "var(--text)" }}>
                  <span style={{ color: "var(--accent)" }}>
                    <Icon name="check" size={14} />
                  </span>
                  {f.name}
                </span>
                <span className="block mt-1 text-[12.5px] leading-5" style={{ color: "var(--text-3)" }}>
                  {f.note}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-8 text-[13px] leading-6 max-w-[80ch]" style={{ color: "var(--text-3)" }}>
          Targets the STM32F407VGT6 as fitted to the Discovery board; addresses and register
          offsets are taken from ST&rsquo;s RM0090 reference manual. Blocks tagged{" "}
          <span style={{ color: "#44cc66", fontWeight: 600 }}>DISC</span> are the ones actually
          wired on that board. The colour coding is functional &mdash; each bus family keeps its own
          hue &mdash; so it does not follow the rest of the site&rsquo;s palette, only its
          background.
        </p>

        {/* ── the tool ─────────────────────────────────────────────────── */}
        <div
          className="mt-8 sm:mt-10 overflow-hidden rounded-2xl"
          style={{
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-lift)",
            height: "min(820px, max(560px, 76vh))",
          }}
        >
          <MemoryMapExplorer />
        </div>

        <p className="mt-4 text-[12.5px] leading-6" style={{ color: "var(--text-3)" }}>
          Best on a wide screen &mdash; it is a memory map, and memory maps are wide.
        </p>
      </div>
    </section>
  );
}
