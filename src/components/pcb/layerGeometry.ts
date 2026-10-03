import type { BoardLayout, Part } from "./BoardSVG";

/* ════════════════════════════════════════════════════════════════════════
   Layer geometry — a board layout split into the files a fab receives.

   Plain functions, no React and no "use client", so the exploded layer
   stack can be drawn entirely on the server. The pad shapes follow the
   same rules as BoardSVG's, so the two drawings of PCB 1 agree; every
   shape is merged into a handful of path strings, because seven plates
   of one element per pad would be thousands of DOM nodes for a picture.

   Everything is in millimetres, in board coordinates.
   ════════════════════════════════════════════════════════════════════════ */

type Rect = { x: number; y: number; w: number; h: number };
type Ring = { x: number; y: number; r: number; drill: number };

export type LayerSet = {
  /** the board edge, as a rounded rectangle */
  outline: string;
  /** part bodies on the top silkscreen, drawn as strokes */
  silkBodies: string;
  silkText: { x: number; y: number; text: string; size: number; rot?: number; anchor?: "start" | "middle" | "end" }[];
  /** surface-mount pads and plated rings on the top copper */
  padsTop: string;
  /** plated through-hole rings, which exist on both outer layers */
  ringsTH: string;
  /** solder-mask openings — every pad, grown by a small expansion */
  maskOpenings: string;
  /** routed copper, one path per track width */
  tracesTop: { w: number; d: string }[];
  tracesBottom: { w: number; d: string }[];
  /** via annular rings */
  vias: string;
  /** every drilled hole: vias, through-hole pins, mounting holes */
  drills: string;
  /** the inner-plane cut-outs: antenna keep-out and via clearances */
  planeVoids: string;
};

const n = (v: number) => Math.round(v * 100) / 100;

function rotate(x: number, y: number, cx: number, cy: number, deg: number): [number, number] {
  if (!deg) return [x, y];
  const a = (deg * Math.PI) / 180;
  const c = Math.cos(a);
  const s = Math.sin(a);
  const dx = x - cx;
  const dy = y - cy;
  return [cx + dx * c - dy * s, cy + dx * s + dy * c];
}

function rectD(r: Rect, cx: number, cy: number, deg: number) {
  const corners: [number, number][] = [
    [r.x, r.y],
    [r.x + r.w, r.y],
    [r.x + r.w, r.y + r.h],
    [r.x, r.y + r.h],
  ];
  return "M" + corners.map(([x, y]) => rotate(x, y, cx, cy, deg).map(n).join(" ")).join("L") + "Z";
}

/** a circle as path data, so many of them can share one element */
function circleD(x: number, y: number, r: number) {
  return `M${n(x - r)} ${n(y)}a${n(r)} ${n(r)} 0 1 0 ${n(r * 2)} 0a${n(r)} ${n(r)} 0 1 0 ${n(-r * 2)} 0`;
}

function grow(r: Rect, by: number): Rect {
  return { x: r.x - by, y: r.y - by, w: r.w + by * 2, h: r.h + by * 2 };
}

export function roundedRectD(w: number, h: number, r: number) {
  return `M${r} 0H${w - r}A${r} ${r} 0 0 1 ${w} ${r}V${h - r}A${r} ${r} 0 0 1 ${w - r} ${h}H${r}A${r} ${r} 0 0 1 0 ${h - r}V${r}A${r} ${r} 0 0 1 ${r} 0Z`;
}

/* ── per-part geometry, before the part's own rotation ─────────────────── */

function bodyBox(p: Part): Rect | null {
  switch (p.kind) {
    case "module":
    case "ic":
    case "usbc":
    case "jst":
    case "button":
      return { x: p.x, y: p.y, w: p.w, h: p.h };
    case "passive": {
      const len = p.size ?? 1.0;
      return p.o === "v"
        ? { x: p.x - 0.32, y: p.y - len / 2, w: 0.64, h: len }
        : { x: p.x - len / 2, y: p.y - 0.32, w: len, h: 0.64 };
    }
    case "led":
      return { x: p.x - 0.8, y: p.y - 0.5, w: 1.6, h: 1.0 };
    default:
      return null;
  }
}

function partPads(p: Part): { rects: Rect[]; rings: Ring[] } {
  const rects: Rect[] = [];
  const rings: Ring[] = [];
  switch (p.kind) {
    /* castellated pads down both long sides and the end, plus the exposed
       ground pad under the body */
    case "module": {
      const side = 13;
      const end = 11;
      const top = p.y + p.ant;
      const usable = p.h - p.ant;
      for (let i = 0; i < side; i++) {
        const y = top + (usable / (side + 1)) * (i + 1) - 0.75;
        rects.push({ x: p.x - 0.85, y, w: 1.35, h: 1.5 }, { x: p.x + p.w - 0.5, y, w: 1.35, h: 1.5 });
      }
      for (let i = 0; i < end; i++) {
        rects.push({ x: p.x + (p.w / (end + 1)) * (i + 1) - 0.75, y: p.y + p.h - 0.5, w: 1.5, h: 1.35 });
      }
      if (p.pad !== false) rects.push({ x: p.x + 2.4, y: p.y + p.ant + 2.4, w: p.w - 4.8, h: usable - 5.2 });
      break;
    }
    case "ic": {
      const count = p.pins ?? 3;
      const nL = p.pinsL ?? count;
      const nR = p.pinsR ?? count;
      for (let i = 0; i < nL; i++) {
        rects.push({ x: p.x - 0.5, y: p.y + (p.h / (nL + 1)) * (i + 1) - 0.22, w: 0.85, h: 0.44 });
      }
      for (let i = 0; i < nR; i++) {
        rects.push({ x: p.x + p.w - 0.35, y: p.y + (p.h / (nR + 1)) * (i + 1) - 0.22, w: 0.85, h: 0.44 });
      }
      break;
    }
    case "passive":
    case "led": {
      const len = p.kind === "led" ? 1.6 : (p.size ?? 1.0);
      const pw = len * 0.42;
      const ph = p.kind === "led" ? 0.9 : len === 1.0 ? 0.55 : len * 0.55;
      if (p.o === "v") {
        rects.push(
          { x: p.x - ph / 2, y: p.y - len / 2 - pw * 0.35, w: ph, h: pw },
          { x: p.x - ph / 2, y: p.y + len / 2 - pw * 0.65, w: ph, h: pw }
        );
      } else {
        rects.push(
          { x: p.x - len / 2 - pw * 0.35, y: p.y - ph / 2, w: pw, h: ph },
          { x: p.x + len / 2 - pw * 0.65, y: p.y - ph / 2, w: pw, h: ph }
        );
      }
      break;
    }
    /* USB-C: the SMD contact row, and four through-hole shield legs */
    case "usbc": {
      rects.push({ x: p.x + 1.2, y: p.y + 1.2, w: p.w - 2.4, h: p.h - 2.4 });
      const legs =
        p.edge === "bottom"
          ? [
              { x: p.x + 0.9, y: p.y + p.h - 2.2 },
              { x: p.x + p.w - 0.9, y: p.y + p.h - 2.2 },
            ]
          : [
              { x: p.x + p.w - 2.2, y: p.y + 0.9 },
              { x: p.x + p.w - 2.2, y: p.y + p.h - 0.9 },
            ];
      legs.forEach((l) => rings.push({ x: l.x, y: l.y, r: 0.8, drill: 0.38 }));
      break;
    }
    case "jst":
      for (let i = 0; i < p.ways; i++) {
        rings.push({ x: p.x + p.w / 2 + (i - (p.ways - 1) / 2) * 2.0, y: p.y + p.h - 1.1, r: 0.75, drill: 0.35 });
      }
      break;
    case "button": {
      const pw = p.w * 0.22;
      const ph = p.h * 0.34;
      for (const [bx, by] of [
        [p.x - pw * 0.35, p.y + p.h * 0.16],
        [p.x + p.w - pw * 0.65, p.y + p.h * 0.16],
        [p.x - pw * 0.35, p.y + p.h * 0.5],
        [p.x + p.w - pw * 0.65, p.y + p.h * 0.5],
      ]) {
        rects.push({ x: bx, y: by, w: pw, h: ph });
      }
      break;
    }
  }
  return { rects, rings };
}

/* ── the whole board, split by layer ───────────────────────────────────── */

export function splitLayers(layout: BoardLayout): LayerSet {
  const { w, h } = layout;
  const radius = layout.radius ?? 1.6;

  const silkBodies: string[] = [];
  const padsTop: string[] = [];
  const maskOpenings: string[] = [];
  const ringsTH: string[] = [];
  const drills: string[] = [];

  for (const p of layout.parts ?? []) {
    if (p.dnp || p.kind === "logo") continue;
    const box = bodyBox(p);
    const cx = box ? box.x + box.w / 2 : p.x;
    const cy = box ? box.y + box.h / 2 : p.y;
    const deg = p.rot ?? 0;
    if (box) silkBodies.push(rectD(box, cx, cy, deg));

    const { rects, rings } = partPads(p);
    for (const r of rects) {
      padsTop.push(rectD(r, cx, cy, deg));
      maskOpenings.push(rectD(grow(r, 0.05), cx, cy, deg));
    }
    for (const r of rings) {
      const [x, y] = rotate(r.x, r.y, cx, cy, deg);
      ringsTH.push(circleD(x, y, r.r));
      maskOpenings.push(circleD(x, y, r.r + 0.05));
      drills.push(circleD(x, y, r.drill));
    }
  }

  /* test points: SMD pads on top, the UART trio plated through */
  const silkText: LayerSet["silkText"] = (layout.silk ?? [])
    .filter((t) => !t.back)
    .map((t) => ({ x: t.x, y: t.y, text: t.text, size: t.size ?? 1.15, rot: t.rot, anchor: t.anchor }));
  for (const tp of layout.testpoints ?? []) {
    if (tp.th) {
      ringsTH.push(circleD(tp.x, tp.y, 0.85));
      drills.push(circleD(tp.x, tp.y, 0.5));
    } else {
      padsTop.push(circleD(tp.x, tp.y, 0.75));
    }
    maskOpenings.push(circleD(tp.x, tp.y, 0.85));
    silkText.push({ x: tp.x, y: tp.y - 1.4, text: tp.ref, size: 0.95, anchor: "middle" });
  }

  /* M3 mounting holes: plated, with a wide annular ring */
  for (const hole of layout.holes ?? []) {
    ringsTH.push(circleD(hole.x, hole.y, 2.8));
    maskOpenings.push(circleD(hole.x, hole.y, 2.9));
    drills.push(circleD(hole.x, hole.y, 1.6));
  }

  const vias: string[] = [];
  const planeVoids: string[] = [];
  for (const v of layout.vias ?? []) {
    const d = v.d ?? 0.6;
    vias.push(circleD(v.x, v.y, d / 2));
    drills.push(circleD(v.x, v.y, (v.drill ?? 0.3) / 2));
    planeVoids.push(circleD(v.x, v.y, d / 2 + 0.2));
  }
  for (const z of layout.planeVoids ?? []) {
    planeVoids.push(rectD(z, 0, 0, 0));
  }

  /* routed copper, merged by width and side */
  const byWidth = (bottom: boolean) => {
    const runs = new Map<number, string>();
    for (const t of layout.traces ?? []) {
      if ((t.layer === "bottom") !== bottom) continue;
      const tw = t.w ?? 0.25;
      runs.set(tw, runs.has(tw) ? `${runs.get(tw)} ${t.d}` : t.d);
    }
    return [...runs.entries()].map(([tw, d]) => ({ w: tw, d }));
  };

  return {
    outline: roundedRectD(w, h, radius),
    silkBodies: silkBodies.join(""),
    silkText,
    padsTop: padsTop.join(""),
    ringsTH: ringsTH.join(""),
    maskOpenings: maskOpenings.join(""),
    tracesTop: byWidth(false),
    tracesBottom: byWidth(true),
    vias: vias.join(""),
    drills: drills.join(""),
    planeVoids: planeVoids.join(""),
  };
}
