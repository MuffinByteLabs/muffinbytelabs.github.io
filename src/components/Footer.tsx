import Link from "next/link";
import GitHubMark from "@/components/pcb/GitHubMark";
import Icon from "@/components/ui/Icon";
import CopyEmail from "@/components/CopyEmail";
import { REPO, BOOKING_URL, CONTACT_EMAIL, CONTACT_MAILTO, UPWORK_URL } from "@/components/pcb/pcbData";
import { PCB2_SLUG } from "@/components/pcb2/data";

/* How to reach me, where the work lives, and nothing that tracks you.
   `me` marks a profile that is Ray's own (rel="me"), so anything reading
   the links can tell that the profiles and this site are one person. */
const COLUMNS: { title: string; links: { label: string; href: string; external?: boolean; me?: boolean }[] }[] = [
  {
    title: "Work",
    links: [
      { label: "Client projects", href: "/#work" },
      { label: "PCB 1 · ESP32-S3 Plant Monitor", href: "/#pcb-1" },
      { label: "PCB 2 · STM32 Industrial I/O", href: PCB2_SLUG },
      { label: "PCB 1 on GitHub", href: REPO.url, external: true },
    ],
  },
  {
    title: "Practice",
    links: [
      { label: "Services", href: "/services" },
      { label: "Deliverables", href: "/#deliverables" },
      { label: "Field Notes", href: "/blog" },
      { label: "RSS feed", href: "/feed.xml" },
      { label: "Book a 15-minute call", href: BOOKING_URL, external: true },
      { label: "Upwork profile", href: UPWORK_URL, external: true, me: true },
      { label: "GitHub", href: "https://github.com/MuffinByteLabs", external: true, me: true },
    ],
  },
  {
    title: "Free tools",
    links: [
      { label: "All tools", href: "/tools" },
      { label: "ESP32-S3 pin planner", href: "/tools/esp32-s3-pinout" },
      { label: "Buck converter calculator", href: "/tools/buck-converter-calculator" },
      { label: "Trace width calculator", href: "/tools/pcb-trace-width-calculator" },
      { label: "Design cost estimator", href: "/tools/pcb-design-cost-calculator" },
      { label: "Project brief builder", href: "/tools/pcb-design-brief" },
      { label: "PCB terms explained", href: "/tools/pcb-glossary" },
      { label: "STM32 memory map", href: "/memory-map" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative px-6 pt-6 pb-10">
      <div className="max-w-6xl mx-auto">
        <div className="hairline" />
        <div className="pt-12 grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_repeat(3,minmax(0,1fr))]">
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5" style={{ color: "var(--text)" }}>
              <span className="logo" aria-hidden style={{ width: 30, height: 30 }} />
              <span className="text-[16px] font-medium tracking-[-0.012em]">MuffinByteLabs</span>
            </Link>
            <p className="mt-4 mb-0 text-[13.5px] leading-6 max-w-[36ch]" style={{ color: "var(--text-3)" }}>
              Ray Malik &mdash; freelance PCB design, from schematic to a manufacturing
              package a fab accepts first time.
            </p>
            <span className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
              <a href={CONTACT_MAILTO} className="inline-flex items-center gap-2 text-[14px] link-gold">
                <Icon name="mail" size={16} />
                Email me
              </a>
              <CopyEmail email={CONTACT_EMAIL} className="link-quiet inline-flex items-center gap-2 text-[13px]" />
            </span>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="eyebrow m-0">{col.title}</h2>
              <ul className="mt-4 m-0 p-0 list-none space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.external ? (
                      <a
                        href={l.href}
                        target="_blank"
                        rel={l.me ? "me noopener noreferrer" : "noopener noreferrer"}
                        className="link-quiet inline-flex items-center gap-1.5 text-[13.5px]"
                      >
                        {l.label === "GitHub" && <GitHubMark size={13} />}
                        {l.label}
                        <Icon name="arrowUpRight" size={12} className="opacity-60" />
                      </a>
                    ) : (
                      <Link href={l.href} className="link-quiet text-[13.5px]">
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div
          className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px]"
          style={{ borderTop: "1px solid var(--border-soft)", color: "var(--text-3)" }}
        >
          <span>&copy; {new Date().getFullYear()} MuffinByteLabs &middot; Ray Malik</span>
          <span className="mono text-[11px] tracking-wide">
            Static site &middot; no cookies &middot; anonymous stats
          </span>
        </div>
      </div>
    </footer>
  );
}
