import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/pcb/Reveal";
import ContactCTA from "@/components/pcb/ContactCTA";
import Icon, { type IconName } from "@/components/ui/Icon";
import SectionHead from "@/components/ui/SectionHead";
import { SERVICES } from "@/components/pcb/pcbData";

/* ════════════════════════════════════════════════════════════════════════
   Services — the five ways a job actually starts, ordered by how cheap
   they are to try. The review leads because it is the door most clients
   come through: no fab spend, a fixed document at the end, and a real one
   already published to read first.

   Server-rendered prose; the only client JavaScript is the shared Reveal
   scroll-in that every section on the site uses.
   ════════════════════════════════════════════════════════════════════════ */

const SVC_TITLE = "Services | Ray Malik — PCB Design Engineer";
const SVC_DESCRIPTION =
  "PCB design services: pre-fab design reviews, conversion of PDF, DXF and legacy designs into clean editable projects, board debug and bring-up, new boards from idea to fab, and Rev-B revisions.";

/* openGraph/twitter spelled out in full — Next does not merge them
   field-by-field with the layout, so leaving them off would share this
   page with the homepage's card (the same trap the blog posts had). */
export const metadata: Metadata = {
  title: SVC_TITLE,
  description: SVC_DESCRIPTION,
  alternates: { canonical: "/services" },
  openGraph: {
    title: SVC_TITLE,
    description: SVC_DESCRIPTION,
    url: "/services",
    siteName: "Ray Malik · MuffinByteLabs",
    type: "website",
    locale: "en_US",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "MuffinByteLabs — PCB design" }],
  },
  twitter: {
    card: "summary_large_image",
    title: SVC_TITLE,
    description: SVC_DESCRIPTION,
    images: ["/og.png"],
  },
};

const ICON: Record<string, IconName> = {
  "SVC-01": "eye",
  "SVC-02": "schematic",
  "SVC-03": "wrench",
  "SVC-04": "board",
  "SVC-05": "layers",
};

function ServiceLink({ sample }: { sample: NonNullable<(typeof SERVICES)[number]["sample"]> }) {
  const cls = "link-gold inline-flex items-center gap-2 text-[13.5px] font-medium";
  return sample.external ? (
    <a href={sample.href} target="_blank" rel="noopener noreferrer" className={cls}>
      {sample.label}
      <Icon name="arrowUpRight" size={14} />
    </a>
  ) : (
    <Link href={sample.href} className={cls}>
      {sample.label}
      <Icon name="arrowRight" size={14} />
    </Link>
  );
}

function ServiceCard({ s, featured = false }: { s: (typeof SERVICES)[number]; featured?: boolean }) {
  return (
    <article className={`card h-full p-6 sm:p-8 flex flex-col ${featured ? "edge-glow" : ""}`}>
      <div className="flex items-start justify-between gap-4">
        <span className="icon-tile">
          <Icon name={ICON[s.id] ?? "spark"} size={20} />
        </span>
        <span className="eyebrow pt-1">{s.id}</span>
      </div>

      <div className={featured ? "mt-6 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-x-12 gap-y-5" : "mt-6"}>
        <div>
          <h2 className="display text-[1.85rem] sm:text-[2.1rem]" style={{ color: "var(--text)" }}>
            {s.title}
          </h2>
          <span className="chip mt-3">
            <Icon name="clock" size={13} />
            {s.turnaround}
          </span>
          <p className="mt-4 mb-0 text-[14.5px] leading-7" style={{ color: "var(--text-2)" }}>
            {s.desc}
          </p>
        </div>

        <div className={featured ? "lg:pt-2" : "mt-5"}>
          <ul className="m-0 p-0 list-none space-y-2.5">
            {s.bullets.map((b) => (
              <li key={b} className="flex gap-3 text-[13.5px] leading-6" style={{ color: "var(--text-2)" }}>
                <span className="mt-1" style={{ color: "var(--accent)" }}>
                  <Icon name="check" size={15} />
                </span>
                {b}
              </li>
            ))}
          </ul>
          {s.sample && (
            <p className="mt-5 mb-0">
              <ServiceLink sample={s.sample} />
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

export default function ServicesPage() {
  const [first, ...rest] = SERVICES;
  return (
    <>
      <section className="relative overflow-hidden px-6 pt-32 sm:pt-36 pb-20 sm:pb-24">
        <div aria-hidden className="grid-bg absolute inset-0 -z-10" />
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <SectionHead
              as="h1"
              label="Services"
              title={
                <>
                  Five ways a job <em>starts</em>
                </>
              }
              lede={
                <>
                  Ordered by how little it costs to try me. Every one ends in writing &mdash; a
                  findings document, or a full manufacturing package &mdash; and any design files
                  delivered are native to the EDA tool you use, and yours outright. Where a claim can be checked against
                  something public, the link is right on the card.
                </>
              }
            />
          </Reveal>

          {/* ── the services, review first ───────────────────────────────── */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            <div className="md:col-span-2">
              <Reveal>
                <ServiceCard s={first} featured />
              </Reveal>
            </div>
            {rest.map((s, i) => (
              <Reveal key={s.id} delay={(i % 2) * 80} className="h-full">
                <ServiceCard s={s} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ContactCTA
        title={
          <>
            Ready when <em>you are</em>
          </>
        }
        lede="The email opens with the four questions a quote needs already in it — what the board does, target fab and quantity, files you have, and the deadline."
      />
    </>
  );
}
