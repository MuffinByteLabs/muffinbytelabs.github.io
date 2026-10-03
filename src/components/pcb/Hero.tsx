import Image from "next/image";
import { CONTACT_MAILTO, REPO } from "./pcbData";
import GitHubMark from "./GitHubMark";
import Icon from "@/components/ui/Icon";

/* ════════════════════════════════════════════════════════════════════════
   Hero — who I am, what I do, and the four things a client asks first.

   Two photographs: the person, and the person at the bench. Square to the
   page, no tags pinned to them — the work section below makes the case.

   Server-rendered; no JavaScript, no motion.
   ════════════════════════════════════════════════════════════════════════ */

const PROOF: { value: string; label: string; note: string }[] = [
  { value: "24 h", label: "to a fixed quote", note: "scope, price and timeline in writing" },
  { value: "100%", label: "money-back guarantee", note: "written into every signed contract" },
  { value: "0", label: "DRC / ERC errors at hand-off", note: "every package checked before it leaves" },
  { value: "Any", label: "EDA tool", note: "files delivered in the format your team uses" },
];

const PROOF_CELL = ["", "border-l", "border-t lg:border-t-0 lg:border-l", "border-l border-t lg:border-t-0"];

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pt-28 pb-14 sm:pt-36 lg:pt-40 lg:pb-20">
      <div aria-hidden className="grid-bg absolute inset-0 -z-10" />

      <div className="relative max-w-6xl mx-auto grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-14 lg:gap-10 items-center">
        {/* ── the words ───────────────────────────────────────────────── */}
        <div className="text-center lg:text-left">
          <span className="kicker justify-center lg:justify-start">
            <span className="rule" aria-hidden />
            Freelance PCB design
          </span>

          <h1 className="display text-gradient mt-6 text-[3.6rem] sm:text-[5rem] lg:text-[6.1rem] leading-[0.95]">
            Ray Malik
          </h1>

          <p className="mt-5 text-lg sm:text-[1.3rem]" style={{ color: "var(--text)", letterSpacing: "-0.012em" }}>
            PCB design engineer
          </p>

          <p className="lede mt-4 mx-auto lg:mx-0 max-w-[48ch] text-[16px] sm:text-[17px]">
            I turn circuit ideas and prototypes into boards a factory can build &mdash; schematic,
            layout and the complete manufacturing package. A computer-science degree underneath, so
            the layout is drawn knowing what the firmware will ask of it.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center lg:justify-start gap-3">
            <a href={CONTACT_MAILTO} className="btn btn-primary">
              Start a board
              <Icon name="arrowRight" size={16} className="nudge" />
            </a>
            <a href="#work" className="btn btn-ghost">
              See the work
              <Icon name="arrowDown" size={16} className="nudge-down" />
            </a>
            <a
              href={REPO.url}
              target="_blank"
              rel="noopener noreferrer"
              className="link-quiet inline-flex items-center gap-2 text-[13.5px] px-3 py-2"
            >
              <GitHubMark size={15} />
              GitHub
            </a>
          </div>
        </div>

        {/* ── the photographs ─────────────────────────────────────────── */}
        <div className="relative mx-auto w-full max-w-[520px]">
          <div
            aria-hidden
            className="absolute -inset-10 -z-10 rounded-full"
            style={{
              background: "radial-gradient(50% 50% at 50% 50%, rgba(219,166,75,0.13), rgba(219,166,75,0) 70%)",
            }}
          />
          {/* sized as fractions of the column, so the pair keeps its
              composition from a phone up to the widest layout */}
          <div className="flex items-start justify-center">
            <div className="hero-photo relative overflow-hidden rounded-2xl shrink-0" style={{ width: "46%", zIndex: 2 }}>
              <Image
                src="/face_shot.webp"
                alt="Ray Malik at his electronics bench — oscilloscope, finished boards and a board layout on the screen behind him"
                width={440}
                height={587}
                priority
                sizes="240px"
                className="block w-full h-auto"
              />
            </div>
            <div
              className="hero-photo relative overflow-hidden rounded-2xl shrink-0"
              style={{ width: "60%", marginLeft: "-6%", marginTop: "22%" }}
            >
              <Image
                src="/soldering.webp"
                alt="Ray Malik hand-soldering a circuit board held in a PCB holder at his bench"
                width={620}
                height={465}
                priority
                sizes="312px"
                className="block w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── the four things a client asks first ────────────────────────── */}
      <div className="relative max-w-6xl mx-auto mt-16 sm:mt-20">
        <ul
          className="grid grid-cols-2 lg:grid-cols-4 m-0 p-0 list-none rounded-2xl overflow-hidden"
          style={{ border: "1px solid var(--border)", background: "rgba(22,21,19,0.6)", backdropFilter: "blur(6px)" }}
        >
          {PROOF.map((p, i) => (
            <li
              key={p.label}
              /* two-up on a phone, one row of four from lg — so the
                 dividers move with the grid */
              className={`px-5 sm:px-7 py-6 border-[color:var(--border-soft)] ${PROOF_CELL[i]}`}
            >
              <span className="display block text-[2.2rem] sm:text-[2.6rem] leading-none" style={{ color: "var(--text)" }}>
                {p.value}
              </span>
              <span className="block mt-2.5 text-[13.5px] font-medium" style={{ color: "var(--text)" }}>
                {p.label}
              </span>
              <span className="block mt-0.5 text-[12px] leading-5" style={{ color: "var(--text-3)" }}>
                {p.note}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
