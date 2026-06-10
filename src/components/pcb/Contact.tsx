import ScrambleText from "../ScrambleText";
import ScrollFadeIn from "../ScrollFadeIn";
import { PCB, CONTACT_STEPS } from "./pcbData";

export default function Contact() {
  return (
    <section id="contact" className="relative py-20 px-6">
      <ScrollFadeIn>
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <p className="font-mono text-xs tracking-[0.25em] uppercase mb-3" style={{ color: PCB.enig }}>
              Contact
            </p>
            <h2
              className="text-3xl sm:text-4xl font-semibold"
              style={{ color: PCB.silk, fontFamily: "var(--font-fraunces), serif" }}
            >
              <ScrambleText text="Let's put your board into production." />
            </h2>
            <p className="mt-4 text-base leading-8 text-[#d6d3cd]/70 max-w-3xl">
              Send a short brief and you&apos;ll have a fixed quote within 24 hours — no hourly
              meters, no surprises.
            </p>
          </div>

          {/* engagement steps */}
          <div className="grid md:grid-cols-3 gap-5 mb-8">
            {CONTACT_STEPS.map((s) => (
              <div
                key={s.num}
                className="rounded-lg border p-6"
                style={{ borderColor: "rgba(234,230,218,0.12)", background: "rgba(234,230,218,0.02)" }}
              >
                <div className="font-mono text-xs mb-2" style={{ color: PCB.copperBright }}>{s.num}</div>
                <h3
                  className="text-lg font-semibold mb-1.5"
                  style={{ color: PCB.silk, fontFamily: "var(--font-fraunces), serif" }}
                >
                  {s.title}
                </h3>
                <p className="text-[13px] leading-6 text-[#d6d3cd]/70">{s.body}</p>
              </div>
            ))}
          </div>

          {/* guarantee banner */}
          <div
            className="rounded-lg p-6 mb-10 flex flex-col sm:flex-row sm:items-center gap-4"
            style={{
              border: "1px solid rgba(212,175,55,0.35)",
              background: "linear-gradient(90deg, rgba(212,175,55,0.07), rgba(212,175,55,0.02))",
            }}
          >
            <div
              className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-mono text-sm"
              style={{
                background: `radial-gradient(circle at 38% 32%, ${PCB.enigBright}, ${PCB.enig} 60%, #8c6a18)`,
                color: "#1a1405",
              }}
            >
              100%
            </div>
            <div>
              <h3
                className="text-lg font-semibold"
                style={{ color: PCB.enigBright, fontFamily: "var(--font-fraunces), serif" }}
              >
                Money-back guarantee, in writing.
              </h3>
              <p className="text-sm leading-7 text-[#d6d3cd]/75 mt-1">
                Every engagement starts with a signed contract that puts the guarantee in writing —
                if the delivered work doesn&apos;t meet the agreed scope, you get your money back.
              </p>
            </div>
          </div>

          {/* contact channels */}
          <div className="text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:muffinbytelabs@gmail.com?subject=PCB%20project%20brief"
                className="inline-block font-mono text-sm px-7 py-3 rounded-md transition-all duration-300"
                style={{
                  background: `linear-gradient(180deg, ${PCB.enigBright}, ${PCB.enig})`,
                  color: "#1a1405",
                  boxShadow: "0 6px 18px rgba(212,175,55,0.25)",
                }}
              >
                SEND THE BRIEF →
              </a>
              <a
                href="https://github.com/muffinmanlabs"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block font-mono text-xs px-5 py-3 rounded-md border transition-colors hover:bg-[#d4af37]/10"
                style={{ color: PCB.enigBright, borderColor: "rgba(212,175,55,0.4)" }}
              >
                portfolio source — github.com/muffinmanlabs
              </a>
            </div>
            <p className="font-mono text-xs text-[#d6d3cd]/65 mt-4">
              KiCad-only PCB design — new boards, pre-fab design reviews, and revisions to existing projects
            </p>
          </div>
        </div>
      </ScrollFadeIn>
    </section>
  );
}
