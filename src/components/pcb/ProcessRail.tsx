"use client";

import ScrambleText from "../ScrambleText";
import { PCB, POWER_RAIL } from "./pcbData";
import { useReducedMotion } from "./useReducedMotion";

export default function ProcessRail() {
  const reduced = useReducedMotion();

  return (
    <section id="process" className="relative py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <p className="font-mono text-xs text-[#a855f7] tracking-widest uppercase mb-3">// how I work</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#f0f0f0]" style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}>
            <ScrambleText text="Embedded-minded decisions, made visible." />
          </h2>
          <p className="mt-4 font-mono text-sm leading-7 text-[#e0e0e0]/60 max-w-3xl">
            Follow the input power rail through the board. Every part is a deliberate choice driven by
            what the firmware actually does — not a layout bolted on after the fact.
          </p>
        </div>

        {/* the energized power rail */}
        <div className="relative h-1 mb-8 rounded" style={{ background: PCB.copper, opacity: 0.7 }}>
          {!reduced && [0, 0.8, 1.6].map((d, i) => (
            <span key={i} className="pcb-flow-dot w-2 h-2 rounded-full"
              style={{ background: PCB.green, boxShadow: `0 0 6px ${PCB.green}`, animationDelay: `${d}s` }} />
          ))}
        </div>

        {/* rail stages */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {POWER_RAIL.map((s, i) => (
            <div key={s.refdes} className="relative">
              <div className="pcb-substrate rounded-md p-3 h-full border" style={{ borderColor: "rgba(232,234,213,0.12)" }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[10px]" style={{ color: PCB.enig }}>{s.refdes}</span>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: PCB.green, boxShadow: `0 0 5px ${PCB.green}` }} />
                </div>
                <div className="font-mono text-[11px] mb-2" style={{ color: PCB.silk }}>{s.label}</div>
                <p className="font-mono text-[10px] leading-4 text-[#e0e0e0]/55">{s.note}</p>
              </div>
              {i < POWER_RAIL.length - 1 && (
                <span className="hidden lg:block absolute top-1/2 -right-2 z-10 font-mono text-xs" style={{ color: PCB.copper }}>→</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
