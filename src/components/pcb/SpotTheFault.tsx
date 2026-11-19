"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/Icon";
import Reveal from "./Reveal";

/* ════════════════════════════════════════════════════════════════════════
   Spot the fault: the homepage's mini game, and the button that loads it.

   The game (board drawing, clock, scoring) is a separate JavaScript file,
   fetched only when a visitor presses Play. Until then this card is a
   heading, two lines and a button, so the homepage pays nothing for a game
   most readers never open. Like the 3D viewer, the download starts the
   moment the pointer reaches the button, so the click itself feels
   instant.
   ════════════════════════════════════════════════════════════════════════ */

type GameModule = typeof import("./faultGame/FaultGame");
type State = "idle" | "loading" | "error" | "open";

/* a corner of a board under a magnifier, drawn inline (no request): a
   chip, a signal pair, a decoupling cap, the ground pour cut around them,
   and the pinched power trace the lens is hunting */
const ART_TRACES: { d: string; w: number }[] = [
  { d: "M28 50 H112", w: 10 },
  { d: "M112 50 H146", w: 3 },
  { d: "M146 50 H252", w: 10 },
  { d: "M198 92 H130 L116 106 H24", w: 3.5 },
  { d: "M198 100 H134 L120 114 H24", w: 3.5 },
  { d: "M238 92 H276", w: 3.5 },
  { d: "M238 100 H258 L272 114 H276", w: 3.5 },
  { d: "M222 116 V136 H186", w: 3 },
];
const ART_PADS: [number, number, number, number][] = [
  [28, 50, 14, 20],
  [252, 50, 14, 20],
  [170, 136, 8, 10],
  [186, 136, 8, 10],
  ...[84, 92, 100, 108].flatMap((y) => [[198, y, 8, 3.5], [238, y, 8, 3.5]] as [number, number, number, number][]),
  ...[206, 214, 222, 230].flatMap((x) => [[x, 76, 3.5, 8], [x, 116, 3.5, 8]] as [number, number, number, number][]),
  [218, 96, 18, 18],
];
const ART_VIAS: [number, number][] = [
  ...[30, 60, 90, 180, 210, 240, 270].map((x) => [x, 22] as [number, number]),
  ...[60, 90, 120, 150, 210, 240, 270].map((x) => [x, 158] as [number, number]),
  [158, 136],
  [270, 72],
];

function TeaserArt() {
  return (
    <svg viewBox="0 0 300 180" width={300} height={180} className="hidden md:block shrink-0" aria-hidden>
      <defs>
        <linearGradient id="ftt-mask" x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0%" stopColor="#2b1c42" />
          <stop offset="52%" stopColor="#1f1430" />
          <stop offset="100%" stopColor="#100a1c" />
        </linearGradient>
        <radialGradient id="ftt-enig" cx="36%" cy="30%" r="78%">
          <stop offset="0%" stopColor="#f0d488" />
          <stop offset="58%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#9c7a1e" />
        </radialGradient>
        <mask id="ftt-pour" maskUnits="userSpaceOnUse" x="0" y="0" width="300" height="180">
          <rect x={12} y={12} width={276} height={156} rx={11} fill="#fff" />
          <g stroke="#000" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {ART_TRACES.map((t) => (
              <path key={t.d} d={t.d} strokeWidth={t.w + 6} />
            ))}
          </g>
          {ART_PADS.map(([x, y, w, h]) => (
            <rect key={`m${x}-${y}`} x={x - w / 2 - 3} y={y - h / 2 - 3} width={w + 6} height={h + 6} rx={3} fill="#000" />
          ))}
          <rect x={192} y={70} width={52} height={52} rx={4} fill="#000" />
        </mask>
      </defs>
      <rect x={6} y={6} width={288} height={168} rx={16} fill="url(#ftt-mask)" stroke="#47355f" strokeWidth={1.4} />
      <rect x={12} y={12} width={276} height={156} rx={11} fill="rgba(200,129,76,0.17)" mask="url(#ftt-pour)" />
      <g fill="none" stroke="#c27c4b" strokeLinecap="round" strokeLinejoin="round">
        {ART_TRACES.map((t) => (
          <path key={t.d} d={t.d} strokeWidth={t.w} />
        ))}
      </g>
      <g fill="url(#ftt-enig)">
        {ART_PADS.map(([x, y, w, h]) => (
          <rect key={`p${x}-${y}`} x={x - w / 2} y={y - h / 2} width={w} height={h} rx={0.8} />
        ))}
        {ART_VIAS.map(([x, y]) => (
          <circle key={`v${x}-${y}`} cx={x} cy={y} r={2.8} />
        ))}
      </g>
      <g fill="#0b0714">
        {ART_VIAS.map(([x, y]) => (
          <circle key={`d${x}-${y}`} cx={x} cy={y} r={1.2} />
        ))}
      </g>
      <g stroke="#eae6da" strokeOpacity={0.6} strokeWidth={1} fill="none">
        <path d="M194 80 V72 H202 M234 72 H242 V80 M242 112 V120 H234 M202 120 H194 V112" />
        <rect x={164} y={130} width={28} height={12} rx={2} strokeOpacity={0.4} />
      </g>
      <circle cx={190} cy={68} r={1.6} fill="#eae6da" fillOpacity={0.75} />
      <g fill="#eae6da" fillOpacity={0.85} fontSize={7.5} letterSpacing={0.4} style={{ fontFamily: "var(--font-geist-mono), ui-monospace, monospace" }}>
        <text x={250} y={84}>U1</text>
        <text x={178} y={126} textAnchor="middle">C3</text>
      </g>
      {/* the magnifier, over the pinched trace */}
      <circle cx={129} cy={50} r={29} fill="rgba(241,201,120,0.08)" stroke="#f4efe6" strokeWidth={3} />
      <path d="M150 71 L166 87" stroke="#f4efe6" strokeWidth={7} strokeLinecap="round" />
      <circle cx={152} cy={26} r={10.5} fill="#f1c978" stroke="#0d0c0b" strokeWidth={2} />
      <text x={152} y={30.5} textAnchor="middle" fontSize={13} fontWeight={700} fill="#1b1407">
        ?
      </text>
    </svg>
  );
}

export default function SpotTheFault() {
  const [state, setState] = useState<State>("idle");
  const [Game, setGame] = useState<GameModule["default"] | null>(null);
  const pending = useRef<Promise<GameModule> | null>(null);
  const playRef = useRef<HTMLButtonElement>(null);
  const returning = useRef(false);

  const prefetch = useCallback(() => {
    if (!pending.current) {
      const p = import("./faultGame/FaultGame");
      // a failed early fetch is retried by play(); don't leave it unhandled
      p.catch(() => {
        if (pending.current === p) pending.current = null;
      });
      pending.current = p;
    }
    return pending.current;
  }, []);

  async function play() {
    if (state === "loading") return;
    setState("loading");
    try {
      const mod = await prefetch();
      setGame(() => mod.default);
      setState("open");
    } catch {
      setState("error");
    }
  }

  function close() {
    returning.current = true;
    setState("idle");
  }

  /* closing the game hands focus back to the button that opened it */
  useEffect(() => {
    if (state === "idle" && returning.current) {
      returning.current = false;
      playRef.current?.focus({ preventScroll: true });
    }
  }, [state]);

  return (
    <section id="spot-the-fault" className="px-6 pb-24 sm:pb-32">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="card card-static edge-glow overflow-hidden">
            {state === "open" && Game ? (
              <Game onClose={close} />
            ) : (
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 p-6 sm:p-9">
                <div className="min-w-0">
                  <span className="eyebrow">Mini game · a new board every Monday</span>
                  <h2 className="display mt-3 text-[2.4rem] leading-[1.02] sm:text-[3rem]" style={{ color: "var(--text)" }}>
                    Spot the <em>fault</em>
                  </h2>
                  <p className="lede mt-4 max-w-[52ch]">
                    This practice board hides five layout mistakes, the kind that cost a second batch of boards.
                    How many can you find before the clock runs out?
                  </p>
                  <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
                    <button
                      ref={playRef}
                      type="button"
                      onClick={play}
                      onPointerEnter={prefetch}
                      onFocus={prefetch}
                      disabled={state === "loading"}
                      className="btn btn-primary"
                    >
                      <Icon name="play" size={16} />
                      {state === "loading" ? "Loading…" : "Play"}
                    </button>
                    <span className="text-[12.5px]" style={{ color: "var(--text-3)" }}>
                      Mouse, touch or keyboard
                    </span>
                  </div>
                  {state === "error" && (
                    <p role="alert" className="mt-4 text-[13px]" style={{ color: "var(--danger)" }}>
                      The game didn&rsquo;t load. Check your connection and press Play again.
                    </p>
                  )}
                </div>
                <TeaserArt />
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
