import ScrambleText from "../ScrambleText";
import ScrollFadeIn from "../ScrollFadeIn";
import { PCB, SERVICES, TRUST } from "./pcbData";

export default function Services() {
  return (
    <section id="services" className="relative py-20 px-6">
      <ScrollFadeIn>
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <p className="font-mono text-xs tracking-[0.25em] uppercase mb-3" style={{ color: PCB.enig }}>
              Services
            </p>
            <h2
              className="text-3xl sm:text-4xl font-semibold"
              style={{ color: PCB.silk, fontFamily: "var(--font-fraunces), serif" }}
            >
              <ScrambleText text="Three ways I can help." />
            </h2>
            <p className="mt-4 text-base leading-8 text-[#d6d3cd]/70 max-w-3xl">
              I work in <span style={{ color: PCB.enigBright }}>KiCad, and only KiCad</span> — you get
              clean native source files you fully own, never a conversion from another tool. Pick the
              lane that matches where your project is today.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {SERVICES.map((svc) => (
              <div
                key={svc.id}
                className="flex flex-col rounded-lg border p-6 transition-colors duration-300 hover:border-[#d4af37]/40"
                style={{ borderColor: "rgba(234,230,218,0.12)", background: "rgba(234,230,218,0.02)" }}
              >
                <div className="font-mono text-xs mb-3" style={{ color: PCB.enig }}>{svc.id}</div>
                <h3
                  className="text-xl font-semibold mb-2"
                  style={{ color: PCB.silk, fontFamily: "var(--font-fraunces), serif" }}
                >
                  {svc.title}
                </h3>
                <p className="text-sm leading-7 text-[#d6d3cd]/70 mb-4">{svc.desc}</p>
                <ul className="space-y-2 mb-5">
                  {svc.bullets.map((b) => (
                    <li key={b} className="flex gap-2 text-[13px] leading-6 text-[#d6d3cd]/75">
                      <span aria-hidden style={{ color: PCB.copperBright }}>▸</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-3 border-t font-mono text-xs" style={{ borderColor: "rgba(234,230,218,0.08)", color: PCB.copperBright }}>
                  {svc.turnaround}
                </div>
              </div>
            ))}
          </div>

          {/* client-comfort strip */}
          <div className="mt-8 flex flex-wrap gap-2.5">
            {TRUST.map((t, i) => (
              <span
                key={t}
                className="font-mono text-xs px-3 py-1.5 rounded-full border"
                style={
                  i === 0
                    ? { color: PCB.enigBright, borderColor: "rgba(212,175,55,0.45)", background: "rgba(212,175,55,0.06)" }
                    : { color: "rgba(234,230,218,0.65)", borderColor: "rgba(234,230,218,0.12)" }
                }
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </ScrollFadeIn>
    </section>
  );
}
