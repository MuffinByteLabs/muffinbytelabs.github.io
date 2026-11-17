"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import Icon from "@/components/ui/Icon";
import FaultBoard, { BOARD_H, BOARD_W } from "./FaultBoard";
import {
  FAULT_BY_ID,
  MISS_PENALTY_MS,
  ROUND_MS,
  ROUND_SIZE,
  distanceToFault,
  pickRound,
  type FaultId,
} from "./faults";

/* ════════════════════════════════════════════════════════════════════════
   Spot the fault: the game itself. Only ever loaded by SpotTheFault, when
   a visitor presses Play.

   A round: 3-2-1, then 60 seconds to click the five mistakes on the board.
   A click that finds nothing costs two seconds, so clicking everywhere
   doesn't pay. The round ends when all five are found, the clock runs
   out, or the player gives up; then every mistake is shown and explained,
   found ones in gold and missed ones in red.

   Mouse, touch and keyboard all play: the board takes focus, the arrow
   keys move a probe, and Enter checks the spot under it.
   ════════════════════════════════════════════════════════════════════════ */

type Phase = "countdown" | "playing" | "done";
type Outcome = "all" | "time" | "quit";
type Mark = { key: number; x: number; y: number };
type Toast = { key: number; text: string; tone: "hit" | "miss" };

/* one shared empty list, so the memoised board doesn't redraw for nothing */
const NONE: FaultId[] = [];

const COUNT_FROM = 3;
const COUNT_STEP_MS = 650;
const PROBE_STEP = 10;

/** a countdown reading: rounds up, so the clock shows 0:01 until it is out */
function fmt(ms: number) {
  const s = Math.ceil(Math.max(0, ms) / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/** an elapsed reading: rounds down, like a stopwatch */
function fmtElapsed(ms: number) {
  const s = Math.floor(Math.max(0, ms) / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function verdict(n: number) {
  if (n === ROUND_SIZE) return "Sharp eyes. You'd make a good design reviewer.";
  if (n >= 3) return "The ones you missed are exactly what a review catches before the order goes in.";
  return "These slip past most people. That's why a second pair of eyes pays for itself.";
}

/* The clock runs its own animation loop, so only the bar and the digits
   re-render every frame, never the board. */
function Timer({
  deadline,
  running,
  onExpire,
}: {
  deadline: RefObject<number>;
  running: boolean;
  onExpire: () => void;
}) {
  const barRef = useRef<HTMLDivElement>(null);
  const expireRef = useRef(onExpire);
  const [text, setText] = useState(fmt(ROUND_MS));
  const [low, setLow] = useState(false);

  useEffect(() => {
    expireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    if (!running) return;
    let raf = 0;
    const tick = () => {
      const left = deadline.current - performance.now();
      if (barRef.current) barRef.current.style.transform = `scaleX(${Math.max(0, left) / ROUND_MS})`;
      setText(fmt(left));
      setLow(left < 10_000);
      if (left <= 0) {
        expireRef.current();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, deadline]);

  return (
    <div className={`ftg-timer ${low ? "is-low" : ""}`}>
      <span className="mono ftg-time" aria-label={`${text} left`}>
        {text}
      </span>
      <div className="ftg-bar">
        <div ref={barRef} className="ftg-bar-fill" />
      </div>
    </div>
  );
}

export default function FaultGame({ onClose }: { onClose: () => void }) {
  const [round, setRound] = useState(0);
  const [active, setActive] = useState<FaultId[]>(() => pickRound());
  const [phase, setPhase] = useState<Phase>("countdown");
  const [count, setCount] = useState(COUNT_FROM);
  const [found, setFound] = useState<FaultId[]>([]);
  /** when each fault was found, in ms of play (penalties not counted) */
  const [foundAt, setFoundAt] = useState<Partial<Record<FaultId, number>>>({});
  const [missCount, setMissCount] = useState(0);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [leftAtEnd, setLeftAtEnd] = useState(0);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [toast, setToast] = useState<Toast | null>(null);
  const [probe, setProbe] = useState<{ x: number; y: number } | null>(null);
  const [say, setSay] = useState("");
  const [portrait, setPortrait] = useState(() => typeof window !== "undefined" && window.innerWidth < 640);

  const deadline = useRef(0);
  const missRef = useRef(0);
  const pausedLeft = useRef<number | null>(null);
  const keys = useRef(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<SVGGElement>(null);

  const missed = phase === "done" ? active.filter((id) => !found.includes(id)) : NONE;

  function finish(how: Outcome) {
    setLeftAtEnd(Math.max(0, deadline.current - performance.now()));
    setOutcome(how);
    setPhase("done");
    setProbe(null);
  }

  /* 3 · 2 · 1, then the clock starts */
  useEffect(() => {
    if (phase !== "countdown") return;
    const t = setTimeout(() => {
      if (count > 1) {
        setCount(count - 1);
        return;
      }
      deadline.current = performance.now() + ROUND_MS;
      setPhase("playing");
      setSay(`Go. Find the ${ROUND_SIZE} faults.`);
    }, COUNT_STEP_MS);
    return () => clearTimeout(t);
  }, [phase, count]);

  /* the clock stops while the tab is in the background */
  useEffect(() => {
    if (phase !== "playing") return;
    const onVisibility = () => {
      if (document.hidden) {
        pausedLeft.current = deadline.current - performance.now();
      } else if (pausedLeft.current !== null) {
        deadline.current = performance.now() + pausedLeft.current;
        pausedLeft.current = null;
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [phase]);

  /* a narrow card turns the board a quarter-turn so it fills a phone */
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([entry]) => setPortrait(entry.contentRect.width < 560));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* on open: bring the game into view and hand it the keyboard */
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const box = el.getBoundingClientRect();
    if (box.top < 72 || box.top > window.innerHeight * 0.4) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }
    boardRef.current?.focus({ preventScroll: true });
  }, []);

  /* toasts clear themselves */
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(
      () => setToast((cur) => (cur?.key === toast.key ? null : cur)),
      toast.tone === "hit" ? 2200 : 1300
    );
    return () => clearTimeout(t);
  }, [toast]);

  /** how far from a fault a click may land and still count, in board units */
  function slack() {
    const box = boardRef.current?.getBoundingClientRect();
    if (!box) return 12;
    const unitsPerPx = BOARD_W / (portrait ? box.height : box.width);
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    return (coarse ? 14 : 9) * unitsPerPx;
  }

  function check(pt: { x: number; y: number }) {
    if (phase !== "playing") return;
    const tol = slack();

    let best: FaultId | null = null;
    let bestDist = Infinity;
    for (const id of active) {
      if (found.includes(id)) continue;
      const dist = distanceToFault(FAULT_BY_ID[id], pt);
      if (dist < bestDist) {
        bestDist = dist;
        best = id;
      }
    }

    if (best && bestDist <= tol) {
      const id = best;
      const next = [...found, id];
      const fault = FAULT_BY_ID[id];
      const played = ROUND_MS - (deadline.current - performance.now()) - missRef.current * MISS_PENALTY_MS;
      setFound(next);
      setFoundAt((at) => ({ ...at, [id]: played }));
      setToast({ key: ++keys.current, text: fault.title, tone: "hit" });
      setSay(`Found ${next.length} of ${ROUND_SIZE}: ${fault.title}.`);
      if (next.length === ROUND_SIZE) finish("all");
      return;
    }

    // a second click on something already found costs nothing
    if (found.some((id) => distanceToFault(FAULT_BY_ID[id], pt) <= tol)) return;

    deadline.current -= MISS_PENALTY_MS;
    missRef.current += 1;
    setMissCount(missRef.current);
    const key = ++keys.current;
    setMarks((m) => [...m, { key, x: pt.x, y: pt.y }]);
    setTimeout(() => setMarks((m) => m.filter((k) => k.key !== key)), 900);
    setToast({ key, text: `Nothing there · −${MISS_PENALTY_MS / 1000} s`, tone: "miss" });
    setSay(`Nothing wrong there. ${MISS_PENALTY_MS / 1000} seconds off.`);
  }

  function onBoardClick(e: React.MouseEvent) {
    const ctm = innerRef.current?.getScreenCTM();
    if (!ctm) return;
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
    setProbe(null);
    check({ x: p.x, y: p.y });
  }

  function onBoardKey(e: React.KeyboardEvent) {
    if (phase !== "playing") return;
    const step = e.shiftKey ? PROBE_STEP * 4 : PROBE_STEP;
    const at = probe ?? { x: BOARD_W / 2, y: BOARD_H / 2 };
    // arrows move on screen; in portrait the board is turned, so map them
    let mx = 0;
    let my = 0;
    switch (e.key) {
      case "ArrowLeft":
        if (portrait) my = step;
        else mx = -step;
        break;
      case "ArrowRight":
        if (portrait) my = -step;
        else mx = step;
        break;
      case "ArrowUp":
        if (portrait) mx = -step;
        else my = -step;
        break;
      case "ArrowDown":
        if (portrait) mx = step;
        else my = step;
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (probe) check(probe);
        else setProbe(at);
        return;
      default:
        return;
    }
    e.preventDefault();
    setProbe({
      x: Math.min(612, Math.max(28, at.x + mx)),
      y: Math.min(372, Math.max(28, at.y + my)),
    });
  }

  function again() {
    setActive((prev) => pickRound(prev));
    setFound([]);
    setFoundAt({});
    missRef.current = 0;
    setMissCount(0);
    setOutcome(null);
    setMarks([]);
    setToast(null);
    setProbe(null);
    setCount(COUNT_FROM);
    setPhase("countdown");
    setRound((r) => r + 1);
    setSay("New board. Get ready.");
    boardRef.current?.focus({ preventScroll: true });
  }

  const order = [...found, ...missed];
  const headline =
    outcome === "all"
      ? `All ${ROUND_SIZE} found, with ${fmt(leftAtEnd)} to spare`
      : outcome === "time"
        ? `Time's up: ${found.length} of ${ROUND_SIZE} found`
        : `${found.length} of ${ROUND_SIZE} found`;

  return (
    <div ref={rootRef} className="ftg" data-phase={phase}>
      <div className="ftg-head">
        <div>
          <span className="eyebrow">Mini game</span>
          <h2 className="display ftg-title">
            Spot the <em>fault</em>
          </h2>
        </div>
        <button type="button" className="ftg-close" onClick={onClose} aria-label="Close the game">
          <Icon name="close" size={17} />
        </button>
      </div>

      <div className="ftg-grid">
        <div className="ftg-main">
          {phase === "done" ? (
            <div className="ftg-result" role="status">
              <p className="ftg-result-title">{headline}</p>
              <p className="ftg-result-body">{verdict(found.length)}</p>
              <dl className="ftg-stats">
                <div>
                  <dt>Found</dt>
                  <dd>
                    {found.length}/{ROUND_SIZE}
                  </dd>
                </div>
                <div>
                  <dt>Misses</dt>
                  <dd>{missCount}</dd>
                </div>
                <div>
                  <dt>Time left</dt>
                  <dd>{fmt(leftAtEnd)}</dd>
                </div>
              </dl>
              <div className="ftg-result-actions">
                <button type="button" className="btn btn-primary btn-sm" onClick={again}>
                  <Icon name="flip" size={15} />
                  Play again
                </button>
                <a href="/services#svc-01" className="link-gold inline-flex items-center gap-1.5 text-[13.5px] font-medium">
                  Get your board reviewed
                  <Icon name="arrowRight" size={14} />
                </a>
              </div>
            </div>
          ) : (
            <div className="ftg-hud">
              {/* the score line doubles as the feedback line, so nothing
                  ever covers the board */}
              <div className="ftg-found">
                <span className="ftg-dots" aria-hidden>
                  {Array.from({ length: ROUND_SIZE }, (_, i) => (
                    <span key={i} className={`ftg-dot ${i < found.length ? "is-on" : ""}`} />
                  ))}
                </span>
                {toast ? (
                  <span key={toast.key} className={`ftg-status ftg-status-${toast.tone}`} aria-hidden>
                    {toast.tone === "hit" && <Icon name="check" size={13} strokeWidth={2.2} />}
                    <span className="ftg-status-text">{toast.text}</span>
                  </span>
                ) : (
                  <span className="ftg-status">
                    {found.length} of {ROUND_SIZE} found
                  </span>
                )}
              </div>
              <Timer key={round} deadline={deadline} running={phase === "playing"} onExpire={() => finish("time")} />
            </div>
          )}

          <div
            ref={boardRef}
            className="ftg-board"
            tabIndex={0}
            role="application"
            aria-label={`Practice board with ${ROUND_SIZE} hidden layout mistakes. Click or tap where you see one.`}
            aria-describedby="ftg-keyhint"
            onClick={onBoardClick}
            onKeyDown={onBoardKey}
            style={{
              aspectRatio: portrait ? `${BOARD_H} / ${BOARD_W}` : `${BOARD_W} / ${BOARD_H}`,
              width: portrait ? `min(100%, calc(70vh * ${BOARD_H / BOARD_W}))` : "100%",
            }}
          >
            <FaultBoard
              active={active}
              found={found}
              missed={missed}
              misses={marks}
              probe={probe}
              portrait={portrait}
              innerRef={innerRef}
            />
            {phase === "countdown" && (
              <div className="ftg-count" aria-hidden>
                <span key={count} className="display ftg-count-n">
                  {count}
                </span>
                <span className="ftg-count-cap">Find the {ROUND_SIZE} faults</span>
              </div>
            )}
          </div>
          <div className="ftg-below">
            <p id="ftg-keyhint" className="ftg-keyhint">
              Arrows move · Enter checks
            </p>
            {phase === "playing" && (
              <button type="button" className="ftg-reveal" onClick={() => finish("quit")}>
                Show answers
              </button>
            )}
          </div>
        </div>

        <div className="ftg-side">
          <span className="eyebrow">Findings</span>
          <ol className="ftg-list">
            {Array.from({ length: ROUND_SIZE }, (_, i) => {
              const id = order[i];
              const state = id ? (i < found.length ? "found" : "missed") : "waiting";
              const fault = id ? FAULT_BY_ID[id] : null;
              return (
                <li key={id ?? `wait${i}`} className="ftg-item" data-state={state}>
                  <span className="ftg-num">{i + 1}</span>
                  {fault && id ? (
                    <div>
                      <p className="ftg-item-meta">
                        <span>{fault.kind}</span>
                        {state === "found" && foundAt[id] !== undefined && (
                          <span className="ftg-item-when">found at {fmtElapsed(foundAt[id] ?? 0)}</span>
                        )}
                        {state === "missed" && <span className="ftg-tag">Missed</span>}
                      </p>
                      <p className="ftg-item-title">{fault.title}</p>
                      <p className="ftg-item-why">{fault.why}</p>
                    </div>
                  ) : (
                    <p className="ftg-item-wait">{phase === "countdown" ? "Get ready…" : "Still hiding"}</p>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {say}
      </p>
    </div>
  );
}
