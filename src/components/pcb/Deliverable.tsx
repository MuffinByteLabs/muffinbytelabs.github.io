"use client";

import { useEffect, useRef, useState } from "react";
import ScrambleText from "../ScrambleText";
import { PCB, PACKAGE_TREE, CLEAN_BADGES, type TreeNode } from "./pcbData";

type Row = { glyph: string; name: string; note?: string; isDir: boolean };

function flatten(node: TreeNode, prefix: string, isLast: boolean, depth: number, out: Row[]) {
  const isDir = !!node.children || node.name.endsWith("/");
  if (depth === 0) {
    out.push({ glyph: node.name, name: node.name, note: node.note, isDir });
  } else {
    out.push({ glyph: prefix + (isLast ? "└── " : "├── ") + node.name, name: node.name, note: node.note, isDir });
  }
  const kids = node.children ?? [];
  kids.forEach((k, i) => {
    const childPrefix = depth === 0 ? "" : prefix + (isLast ? "    " : "│   ");
    flatten(k, childPrefix, i === kids.length - 1, depth + 1, out);
  });
}

export default function Deliverable() {
  const rows: Row[] = [];
  flatten(PACKAGE_TREE, "", true, 0, rows);
  const [active, setActive] = useState<Row | null>(rows.find((r) => r.note) ?? null);

  return (
    <section id="deliverable" className="relative py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <p className="font-mono text-xs text-[#a855f7] tracking-widest uppercase mb-3">// the deliverable</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#f0f0f0]" style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}>
            <ScrambleText text="The board isn't the product. The package is." />
          </h2>
          <p className="mt-4 font-mono text-sm leading-7 text-[#e0e0e0]/60 max-w-3xl">
            A gorgeous board with a messy hand-off says hobbyist. Every project ships as the same tidy,
            factory-ready folder — hover any file to see what the fab does with it.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-start">
          {/* file tree terminal */}
          <div className="border border-[#00ff41]/10 rounded-md overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-[#00ff41]/10 bg-[#00ff41]/[0.02]">
              <span className="w-2 h-2 rounded-full bg-[#ff5f57]/60" />
              <span className="w-2 h-2 rounded-full bg-[#febc2e]/60" />
              <span className="w-2 h-2 rounded-full bg-[#28c840]/60" />
              <span className="font-mono text-[10px] text-[#00ff41]/40 ml-2">tree ~/MML-0X-board</span>
            </div>
            <div className="p-4">
              {rows.map((r, i) => (
                <button
                  key={i}
                  onMouseEnter={() => r.note && setActive(r)}
                  onFocus={() => r.note && setActive(r)}
                  onClick={() => r.note && setActive(r)}
                  className="block w-full text-left font-mono text-[11px] sm:text-xs leading-6 transition-colors duration-200 hover:bg-[#00ff41]/[0.04]"
                  style={{ color: active?.glyph === r.glyph ? PCB.green : r.isDir ? PCB.enig : "rgba(224,224,224,0.6)" }}
                >
                  <span style={{ whiteSpace: "pre" }}>{r.glyph}</span>
                  {r.note && <span className="pcb-testpoint inline-block ml-2 align-middle rounded-full"
                    style={{ width: 7, height: 7, background: `radial-gradient(circle at 38% 32%, ${PCB.enigBright}, ${PCB.enig} 60%, #8c6a18)` }} />}
                </button>
              ))}
            </div>
          </div>

          {/* probe readout + clean badges */}
          <div className="space-y-6">
            <div className="border border-[#00ff41]/15 rounded-md p-5 min-h-[120px]" style={{ background: "rgba(0,255,65,0.02)" }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full" style={{ background: PCB.green, boxShadow: `0 0 8px ${PCB.green}` }} />
                <span className="font-mono text-[10px] tracking-widest" style={{ color: PCB.green }}>PROBE · CONTINUITY OK</span>
              </div>
              <p className="font-mono text-xs leading-6 text-[#e0e0e0]/80">
                <span style={{ color: PCB.enig }}>{active?.name ?? "—"}</span>
                <br />
                {active?.note ?? "Hover a test point in the tree to probe it."}
              </p>
            </div>

            <Badges />
          </div>
        </div>
      </div>
    </section>
  );
}

function Badges() {
  const ref = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setLit(true); obs.unobserve(el); }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {CLEAN_BADGES.map((b, i) => (
        <div
          key={b.label}
          title={b.note}
          className="font-mono text-[10px] tracking-wider px-3 py-2 rounded border text-center transition-all duration-500"
          style={{
            transitionDelay: `${i * 80}ms`,
            color: lit ? PCB.green : "#3a3a3a",
            borderColor: lit ? "rgba(0,255,65,0.35)" : "rgba(120,120,120,0.2)",
            boxShadow: lit ? "0 0 12px rgba(0,255,65,0.15)" : "none",
            background: lit ? "rgba(0,255,65,0.04)" : "transparent",
          }}
        >
          {b.label}
        </div>
      ))}
    </div>
  );
}
