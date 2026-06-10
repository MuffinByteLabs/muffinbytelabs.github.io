"use client";

import { useState } from "react";
import ScrambleText from "../ScrambleText";
import { PCB, SKILLS, type Skill } from "./pcbData";

export default function CapabilityMatrix() {
  const [sel, setSel] = useState<Skill>(SKILLS[0]);
  const [checked, setChecked] = useState<Set<string>>(new Set());

  function probe(s: Skill) {
    setSel(s);
    setChecked((prev) => {
      if (prev.has(s.refdes + s.skill)) return prev;
      const next = new Set(prev);
      next.add(s.refdes + s.skill);
      return next;
    });
  }

  const tier1 = SKILLS.filter((s) => s.tier === "1");
  const tier2 = SKILLS.filter((s) => s.tier === "2");

  return (
    <section id="skills" className="relative py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs text-[#a855f7] tracking-widest uppercase mb-3">// capability matrix</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#f0f0f0]" style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}>
              <ScrambleText text="Populated board: every skill, placed." />
            </h2>
          </div>
          <div className="font-mono text-[11px] px-3 py-2 rounded border" style={{ color: PCB.green, borderColor: `${PCB.green}40` }}>
            DFM PASS · {checked.size}/{SKILLS.length} checks
          </div>
        </div>

        {/* probe readout */}
        <div className="border rounded-md p-4 mb-6" style={{ borderColor: `${PCB.green}26`, background: "rgba(0,255,65,0.02)" }}>
          <div className="font-mono text-xs flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span style={{ color: sel.tier === "1" ? PCB.copperBright : PCB.enig }}>{sel.refdes}</span>
            <span className="text-[#f0f0f0]">{sel.skill}</span>
            <span className="text-[#e0e0e0]/40">[{sel.value}]</span>
            <span style={{ color: PCB.green }}>✓ check passed</span>
          </div>
          <p className="font-mono text-[11px] leading-5 text-[#e0e0e0]/60 mt-2">{sel.description}</p>
        </div>

        <SkillGrid title="TIER 1 — FOUNDATION · 80%+ of jobs" hint="solid copper" skills={tier1}
          tone="copper" sel={sel} checked={checked} onProbe={probe} />
        <div className="h-6" />
        <SkillGrid title="TIER 2 — DIFFERENTIATORS · 50%+ of jobs" hint="ENIG gold" skills={tier2}
          tone="gold" sel={sel} checked={checked} onProbe={probe} />
      </div>
    </section>
  );
}

function SkillGrid({
  title, hint, skills, tone, sel, checked, onProbe,
}: {
  title: string; hint: string; skills: Skill[]; tone: "copper" | "gold";
  sel: Skill; checked: Set<string>; onProbe: (s: Skill) => void;
}) {
  const base = tone === "copper" ? PCB.copper : PCB.enig;
  const bright = tone === "copper" ? PCB.copperBright : PCB.enigBright;
  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <span className="font-mono text-[10px] tracking-widest" style={{ color: base }}>{title}</span>
        <span className="font-mono text-[9px] text-[#e0e0e0]/30">// {hint}</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {skills.map((s) => {
          const active = sel.refdes === s.refdes && sel.skill === s.skill;
          const isChecked = checked.has(s.refdes + s.skill);
          return (
            <button
              key={s.refdes + s.skill}
              onMouseEnter={() => onProbe(s)}
              onFocus={() => onProbe(s)}
              onClick={() => onProbe(s)}
              className="group text-left rounded-md p-2.5 border transition-all duration-200"
              style={{
                borderColor: active ? bright : `${base}33`,
                background: active ? `${base}14` : "rgba(255,255,255,0.015)",
                boxShadow: active ? `0 0 14px ${base}22` : "none",
              }}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px]" style={{ color: bright }}>{s.refdes}</span>
                <span className="font-mono text-[10px]" style={{ color: isChecked ? PCB.green : "transparent" }}>✓</span>
              </div>
              <div className="font-mono text-[10px] leading-4 mt-1 text-[#e0e0e0]/70 group-hover:text-[#e0e0e0]">{s.skill}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
