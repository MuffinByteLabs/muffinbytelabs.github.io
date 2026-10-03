import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/pcb/Reveal";
import ContactCTA from "@/components/pcb/ContactCTA";
import Icon from "@/components/ui/Icon";
import ArchitectureDiagram from "@/components/pcb2/ArchitectureDiagram";
import DomainMap from "@/components/pcb2/DomainMap";
import PermissionGate from "@/components/pcb2/PermissionGate";
import { PCB2, PCB2_SLUG, PCB2_STATS, PCB2_IO, DOMAIN_COLOR, FAULT_TARGETS } from "@/components/pcb2/data";
import { CONTACT_EMAIL } from "@/components/pcb/pcbData";

/* ════════════════════════════════════════════════════════════════════════
   PCB 2 — the case study, cut to what a client reads in half a minute:
   what it connects to, how it is put together, and what it survives. The
   power tree and stack-up are one click away on the homepage card.
   ════════════════════════════════════════════════════════════════════════ */

const TITLE = "STM32 Industrial I/O Controller — PCB 2 case study | Ray Malik";
const DESCRIPTION =
  "A four-layer STM32G474 controller for 12/24 V DC equipment: group-isolated digital inputs, protected 0–10 V and 4–20 mA sensing, high-side outputs, relays, a 0–10 V output and isolated RS-485 and CAN FD.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PCB2_SLUG },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PCB2_SLUG,
    siteName: "Ray Malik · MuffinByteLabs",
    type: "article",
    locale: "en_US",
    images: [{ url: "/og/pcb-2.png", width: 1200, height: 630, alt: "PCB 2 — STM32 Industrial I/O Controller" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og/pcb-2.png"],
  },
};

const MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("A board like PCB 2")}`;

function Section({
  id,
  n,
  label,
  title,
  lede,
  children,
}: {
  id: string;
  n: string;
  label: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="pt-16 sm:pt-20">
      <Reveal>
        <span className="kicker">
          <b>{n}</b>
          <span className="rule" aria-hidden />
          {label}
        </span>
        <h2 className="display mt-3 text-[2.1rem] sm:text-[2.65rem]" style={{ color: "var(--text)" }}>
          {title}
        </h2>
        {lede && <p className="lede mt-3 mb-0 max-w-[62ch] text-[15.5px]">{lede}</p>}
      </Reveal>
      <div className="mt-8">{children}</div>
    </section>
  );
}

export default function Pcb2CaseStudy() {
  return (
    <article>
      {/* ── hero ──────────────────────────────────────────────────────── */}
      <header className="relative overflow-hidden px-6 pt-28 sm:pt-32 pb-4">
        <div aria-hidden className="grid-bg absolute inset-0 -z-10" />
        <div className="max-w-6xl mx-auto">
          <nav aria-label="Breadcrumb" className="text-[12.5px]">
            <ol className="flex items-center gap-2 m-0 p-0 list-none" style={{ color: "var(--text-3)" }}>
              <li>
                <Link href="/#work" className="link-quiet">
                  Work
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" style={{ color: "var(--text-2)" }}>
                {PCB2.id}
              </li>
            </ol>
          </nav>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] gap-12 lg:gap-14 items-center">
            <div className="min-w-0">
              <span className="eyebrow">
                {PCB2.id} &middot; {PCB2.rev}
              </span>
              <h1 className="display text-gradient mt-4 text-[3rem] sm:text-[4.1rem] leading-[0.98]">{PCB2.name}</h1>
              <p className="lede mt-5 mb-0 max-w-[54ch]">{PCB2.summary}</p>

              <ul className="mt-6 flex flex-wrap gap-2 m-0 p-0 list-none">
                {PCB2.specs.map((s) => (
                  <li key={s} className="chip chip-mono">
                    {s}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a href={MAILTO} className="btn btn-primary">
                  Discuss a board like this
                  <Icon name="arrowRight" size={16} className="nudge" />
                </a>
                <a href="#architecture" className="btn btn-ghost">
                  See the architecture
                  <Icon name="arrowDown" size={16} className="nudge-down" />
                </a>
              </div>
            </div>

            <figure className="m-0 min-w-0">
              <div className="card card-static edge-glow p-3 sm:p-4">
                <DomainMap id="dmap-hero" fit />
              </div>
              <figcaption className="mt-3 text-[12px] leading-5" style={{ color: "var(--text-3)" }}>
                Main ground, and five islands that only an isolator, an isolated supply or a relay may
                cross.
              </figcaption>
            </figure>
          </div>

          {/* headline numbers */}
          <ul
            className="mt-14 grid grid-cols-2 lg:grid-cols-4 m-0 p-0 list-none rounded-2xl overflow-hidden"
            style={{ border: "1px solid var(--border)", background: "rgba(22,21,19,0.6)" }}
          >
            {PCB2_STATS.map((s, i) => (
              <li
                key={s.label}
                className={`px-5 sm:px-7 py-6 border-[color:var(--border-soft)] ${
                  ["", "border-l", "border-t lg:border-t-0 lg:border-l", "border-l border-t lg:border-t-0"][i]
                }`}
              >
                <span className="display block text-[2.1rem] sm:text-[2.5rem] leading-none" style={{ color: "var(--text)" }}>
                  {s.value}
                </span>
                <span className="block mt-2.5 text-[12.5px] leading-5" style={{ color: "var(--text-3)" }}>
                  {s.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </header>

      {/* ── body ──────────────────────────────────────────────────────── */}
      <div className="px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          {/* 01 ─ I/O */}
          <Section
            id="io"
            n="01"
            label="I/O"
            title={
              <>
                What it <em>connects to</em>
              </>
            }
          >
            <ul
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px m-0 p-0 list-none rounded-2xl overflow-hidden"
              style={{ background: "var(--border-soft)", border: "1px solid var(--border-soft)" }}
            >
              {PCB2_IO.map((io) => (
                <li key={io.name} className="px-5 py-5 flex gap-4" style={{ background: "var(--surface)" }}>
                  <span
                    className="display text-[1.8rem] leading-none tabular-nums w-10 shrink-0"
                    style={{ color: DOMAIN_COLOR[io.domain] }}
                  >
                    {io.count}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[14px] font-medium" style={{ color: "var(--text)" }}>
                      {io.name}
                    </span>
                    <span className="block mt-1 text-[12.5px] leading-[1.6]" style={{ color: "var(--text-2)" }}>
                      {io.detail}
                    </span>
                    <span className="block mt-1.5 mono text-[11px]" style={{ color: "var(--text-3)" }}>
                      {io.part}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </Section>

          {/* 02 ─ architecture */}
          <Section
            id="architecture"
            n="02"
            label="Architecture"
            title="One MCU, five islands, one gate"
            lede="Field wiring left and right, the STM32 in the middle, power across the top and the hardware permission along the bottom. Trace any path to see what it passes through."
          >
            <ArchitectureDiagram />
          </Section>

          {/* 03 ─ protection */}
          <Section
            id="protection"
            n="03"
            label="Protection"
            title={
              <>
                No permission, <em>no energy</em>
              </>
            }
            lede="Every terminal is designed for the day it is miswired. And firmware only decides what the outputs should do — hardware decides whether they may do anything at all, so a hung program or a debugger halt cannot drive a load."
          >
            <ul className="grid grid-cols-2 lg:grid-cols-4 gap-3 m-0 p-0 list-none">
              {FAULT_TARGETS.map((f) => (
                <li
                  key={f.value}
                  className="rounded-2xl p-5"
                  style={{ background: "rgba(240,113,103,0.05)", border: "1px solid rgba(240,113,103,0.22)" }}
                >
                  <span className="display block text-[2rem] leading-none" style={{ color: "var(--text)" }}>
                    {f.value}
                  </span>
                  <span className="block mt-2.5 text-[12.5px] leading-5" style={{ color: "var(--text-2)" }}>
                    {f.label}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <PermissionGate />
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-3">
              <Link href="/#pcb-2" className="btn btn-ghost">
                <Icon name="arrowLeft" size={16} />
                Back to the work
              </Link>
              <Link href="/#pcb-1" className="link-quiet text-[13.5px] px-2">
                See PCB 1, the ESP32-S3 plant monitor &rarr;
              </Link>
            </div>
          </Section>

        </div>
      </div>

      <ContactCTA
        title={
          <>
            Need a controller <em>like this one</em>?
          </>
        }
        lede="Protected 24 V power, isolated buses, analog that survives a miswire — send a paragraph about yours and get a fixed quote, in writing, within a day."
      />
    </article>
  );
}
