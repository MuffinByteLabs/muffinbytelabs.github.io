import ScrollFadeIn from "../ScrollFadeIn";
import SectionHeading from "./SectionHeading";
import { PCB, STANDARD_PILLARS, STANDARD_STATS } from "./pcbData";

export default function Standard() {
  return (
    <section id="standard" className="relative py-24 sm:py-32 px-6">
      <ScrollFadeIn>
        <div className="max-w-5xl mx-auto">
          <SectionHeading eyebrow="The Standard" title="Built to a standard. Delivered on schedule." gold>
            The difference between a hobbyist and a professional isn&apos;t the board — it&apos;s
            everything that arrives with it.
          </SectionHeading>

          {/* stats band — one editorial row, copper dividers */}
          <div
            className="grid grid-cols-2 md:grid-cols-4 rounded-xl overflow-hidden mb-12"
            style={{ border: "1px solid rgba(212,175,55,0.25)", background: "rgba(212,175,55,0.04)" }}
          >
            {STANDARD_STATS.map((s, i) => (
              <div
                key={s.label}
                className="px-4 py-7 text-center"
                style={{
                  borderLeft: i % 2 !== 0 ? "1px solid rgba(184,115,51,0.2)" : undefined,
                  borderTop: i >= 2 ? "1px solid rgba(184,115,51,0.2)" : undefined,
                }}
              >
                <div
                  className="text-5xl sm:text-6xl font-bold leading-none gold-text"
                  style={{ fontFamily: "var(--font-fraunces), serif" }}
                >
                  {s.value}
                </div>
                <div className="font-mono text-[11px] mt-3 tracking-[0.12em] uppercase text-[#d6d3cd]/60">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* pillars */}
          <div className="grid md:grid-cols-2 gap-5 items-stretch">
            {STANDARD_PILLARS.map((p) => (
              <div key={p.num} className="fab-card relative overflow-hidden p-6 sm:p-7">
                {/* ghost numeral watermark */}
                <span
                  aria-hidden
                  className="absolute top-2 right-4 font-bold leading-none select-none"
                  style={{
                    fontFamily: "var(--font-fraunces), serif",
                    fontSize: "5rem",
                    color: "rgba(212,175,55,0.08)",
                  }}
                >
                  {p.num}
                </span>
                <div className="font-mono text-xs mb-2" style={{ color: PCB.copperBright }}>{p.num}</div>
                <h3
                  className="text-xl font-semibold mb-2 relative"
                  style={{ color: PCB.silk, fontFamily: "var(--font-fraunces), serif" }}
                >
                  {p.title}
                </h3>
                <p className="text-sm leading-7 text-[#d6d3cd]/70 relative">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </ScrollFadeIn>
    </section>
  );
}
