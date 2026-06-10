import ScrambleText from "../ScrambleText";
import ScrollFadeIn from "../ScrollFadeIn";
import { PCB, STANDARD_PILLARS, STANDARD_STATS } from "./pcbData";

export default function Standard() {
  return (
    <section id="standard" className="relative py-20 px-6">
      <ScrollFadeIn>
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <p className="font-mono text-xs tracking-[0.25em] uppercase mb-3" style={{ color: PCB.enig }}>
              The Standard
            </p>
            <h2
              className="text-3xl sm:text-4xl font-semibold"
              style={{ color: PCB.silk, fontFamily: "var(--font-fraunces), serif" }}
            >
              <ScrambleText text="Built to a standard. Delivered on schedule." />
            </h2>
            <p className="mt-4 text-base leading-8 text-[#d6d3cd]/70 max-w-3xl">
              The difference between a hobbyist and a professional isn&apos;t the board — it&apos;s
              everything that arrives with it.
            </p>
          </div>

          {/* stats strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            {STANDARD_STATS.map((s) => (
              <div
                key={s.label}
                className="rounded-lg border px-4 py-5 text-center"
                style={{ borderColor: "rgba(212,175,55,0.25)", background: "rgba(212,175,55,0.04)" }}
              >
                <div
                  className="text-3xl sm:text-4xl font-semibold gold-text"
                  style={{ fontFamily: "var(--font-fraunces), serif" }}
                >
                  {s.value}
                </div>
                <div className="font-mono text-[11px] mt-2 text-[#d6d3cd]/65">{s.label}</div>
              </div>
            ))}
          </div>

          {/* pillars */}
          <div className="grid md:grid-cols-2 gap-5">
            {STANDARD_PILLARS.map((p) => (
              <div
                key={p.num}
                className="rounded-lg border p-6 transition-colors duration-300 hover:border-[#d4af37]/40"
                style={{ borderColor: "rgba(234,230,218,0.12)", background: "rgba(234,230,218,0.02)" }}
              >
                <div className="font-mono text-xs mb-2" style={{ color: PCB.copperBright }}>{p.num}</div>
                <h3
                  className="text-xl font-semibold mb-2"
                  style={{ color: PCB.silk, fontFamily: "var(--font-fraunces), serif" }}
                >
                  {p.title}
                </h3>
                <p className="text-sm leading-7 text-[#d6d3cd]/70">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </ScrollFadeIn>
    </section>
  );
}
