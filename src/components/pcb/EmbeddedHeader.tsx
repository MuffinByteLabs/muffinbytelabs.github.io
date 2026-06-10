"use client";

import { PCB } from "./pcbData";

/**
 * J2 — a board-edge expansion header. Embedded systems is positioned as a real
 * but SECONDARY skill: an un-powered stub routes OFF this board to a separate
 * daughterboard at /embedded.
 */
export default function EmbeddedHeader() {
  return (
    <section id="embedded-link" className="relative py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <p className="font-mono text-xs text-[#a855f7] tracking-widest uppercase mb-3">// J2 — expansion header</p>
        <a
          href="/embedded"
          className="group block pcb-substrate rounded-lg p-6 border transition-all duration-300"
          style={{ borderColor: "rgba(232,234,213,0.14)" }}
        >
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* header footprint */}
            <svg viewBox="0 0 220 80" width="220" className="shrink-0" role="img" aria-label="expansion header J2">
              <defs>
                <radialGradient id="j2-enig" cx="38%" cy="32%" r="75%">
                  <stop offset="0%" stopColor={PCB.enigBright} />
                  <stop offset="60%" stopColor={PCB.enig} />
                  <stop offset="100%" stopColor="#a07d1f" />
                </radialGradient>
              </defs>
              {/* un-powered copper stub routing off-board (energizes on hover) */}
              <path d="M150 40 H210" fill="none" strokeWidth="3" strokeLinecap="round"
                className="transition-all duration-300"
                style={{ stroke: PCB.copper }} />
              <path d="M150 40 H210" fill="none" strokeWidth="1.6" strokeLinecap="round"
                strokeDasharray="3 10" opacity="0"
                className="group-hover:opacity-100 transition-opacity duration-300"
                style={{ stroke: PCB.green }} />
              {/* castellated edge connector */}
              {[0, 1, 2, 3].map((i) => (
                <rect key={i} x="206" y={20 + i * 12} width="10" height="8" rx="1" fill="url(#j2-enig)" opacity="0.7" />
              ))}
              {/* 2xN header pads */}
              {Array.from({ length: 6 }).map((_, c) =>
                [0, 1].map((r) => (
                  <g key={`${c}-${r}`}>
                    <rect x={20 + c * 18} y={26 + r * 18} width="9" height="9" rx="1.5" fill="url(#j2-enig)" />
                    <circle cx={24.5 + c * 18} cy={30.5 + r * 18} r="1.4" fill={PCB.drill} />
                  </g>
                ))
              )}
              <rect x="14" y="20" width="120" height="44" rx="2" fill="none" stroke={PCB.silk} strokeWidth="0.7" opacity="0.5" />
              <text x="74" y="14" fontSize="8" fill={PCB.silk} textAnchor="middle" opacity="0.8"
                fontFamily="var(--font-geist-mono), monospace">J2 · EMBEDDED</text>
            </svg>

            <div className="flex-1">
              <h3 className="font-mono text-base" style={{ color: PCB.silk }}>Firmware on the side</h3>
              <p className="font-mono text-[11px] leading-6 text-[#e0e0e0]/60 mt-2 max-w-xl">
                The boards above mostly run off-the-shelf firmware — ESPHome, WLED, Tasmota. But the bench
                behind them is real embedded systems: C, bare-metal, RTOS, STM32. That work lives on its own
                daughterboard.
              </p>
              <div className="mt-4 font-mono text-[11px] tracking-wider">
                <span className="text-[#e0e0e0]/40 group-hover:hidden">stub un-powered · </span>
                <span className="hidden group-hover:inline" style={{ color: PCB.green }}>connecting daughterboard… </span>
                <span style={{ color: PCB.green }}>→ ./embedded</span>
              </div>
            </div>
          </div>
        </a>
      </div>
    </section>
  );
}
