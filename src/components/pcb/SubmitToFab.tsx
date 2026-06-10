"use client";

import { useEffect, useRef, useState } from "react";
import ScrambleText from "../ScrambleText";
import { PCB } from "./pcbData";
import { useReducedMotion } from "./useReducedMotion";

const CHECKS = ["Gerbers ✓", "Drill ✓", "BOM w/ MPN ✓", "CPL ✓", "DRC ✓", "ERC ✓"];

export default function SubmitToFab() {
  const reduced = useReducedMotion();
  const [stage, setStage] = useState<"idle" | "running" | "done">("idle");
  const [shown, setShown] = useState<string[]>([]);
  const [order, setOrder] = useState("");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function submit() {
    if (stage === "running") return;
    setOrder("MML-" + String(Math.floor(Date.now() % 100000)).padStart(5, "0"));
    if (reduced) { setShown(CHECKS); setStage("done"); return; }
    setStage("running");
    setShown([]);
    CHECKS.forEach((_, i) => {
      timers.current.push(setTimeout(() => setShown(CHECKS.slice(0, i + 1)), 220 * (i + 1)));
    });
    timers.current.push(setTimeout(() => setStage("done"), 220 * (CHECKS.length + 1)));
  }

  return (
    <section id="contact" className="relative py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <p className="font-mono text-xs text-[#a855f7] tracking-widest uppercase mb-3">// submit to fab</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#f0f0f0]" style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}>
            <ScrambleText text="Got a board to build? Send it to fab." />
          </h2>
        </div>

        <div className="border rounded-lg overflow-hidden" style={{ borderColor: `${PCB.enig}33` }}>
          {/* order form header */}
          <div className="flex items-center gap-2 px-4 py-2 border-b" style={{ borderColor: "rgba(232,234,213,0.1)", background: "rgba(212,175,55,0.05)" }}>
            <span className="w-2 h-2 rounded-full bg-[#ff5f57]/60" />
            <span className="w-2 h-2 rounded-full bg-[#febc2e]/60" />
            <span className="w-2 h-2 rounded-full bg-[#28c840]/60" />
            <span className="font-mono text-[10px] ml-2" style={{ color: PCB.enig }}>jlcpcb-order · new-board.zip</span>
          </div>

          <div className="p-6">
            {/* decorative spec fields */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
              {[
                ["LAYERS", "2"],
                ["SURFACE", "ENIG"],
                ["THICKNESS", "1.6mm"],
                ["LEAD TIME", "days"],
              ].map(([k, v]) => (
                <div key={k} className="border border-white/5 rounded px-2 py-1.5 font-mono text-[10px]">
                  <div className="opacity-60" style={{ color: PCB.enig }}>{k}</div>
                  <div className="text-[#e0e0e0]/70 mt-0.5">{v}</div>
                </div>
              ))}
            </div>

            {stage !== "done" && (
              <button
                onClick={submit}
                className="w-full font-mono text-sm tracking-widest py-3 rounded-md transition-all duration-300"
                style={{ background: `linear-gradient(180deg, ${PCB.enigBright}, ${PCB.enig})`, color: "#1a1405", boxShadow: "0 6px 18px rgba(212,175,55,0.25)" }}
              >
                {stage === "running" ? "RUNNING PRE-CHECK…" : "▶ SUBMIT TO FAB / GENERATE GERBERS"}
              </button>
            )}

            {/* pre-check console */}
            {shown.length > 0 && stage !== "done" && (
              <div className="mt-4 rounded p-3 font-mono text-[11px] leading-6" style={{ background: "rgba(4,8,4,0.6)" }}>
                {shown.map((c) => <div key={c} style={{ color: PCB.green }}>{c}</div>)}
              </div>
            )}

            {/* order confirmation */}
            {stage === "done" && (
              <div className="text-center">
                <div className="inline-flex items-center gap-2 font-mono text-xs px-3 py-1.5 rounded-full mb-4"
                  style={{ color: PCB.green, border: `1px solid ${PCB.green}40`, boxShadow: `0 0 14px ${PCB.green}22` }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: PCB.green, boxShadow: `0 0 8px ${PCB.green}` }} />
                  PRODUCTION READY · ORDER {order}
                </div>
                <p className="font-mono text-[11px] text-[#e0e0e0]/60 mb-5">
                  Files would pass clean. Let&apos;s talk about your board:
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 font-mono text-sm">
                  <a href="https://github.com/muffinmanlabs" target="_blank" rel="noopener noreferrer"
                    className="px-4 py-2 rounded border transition-colors" style={{ color: PCB.green, borderColor: `${PCB.green}40` }}>
                    &gt; github.com/muffinmanlabs
                  </a>
                </div>
                <p className="font-mono text-[10px] text-[#e0e0e0]/30 mt-4">
                  available for KiCad / ESP32 PCB design — schematic capture, layout, and full JLCPCB packages
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
