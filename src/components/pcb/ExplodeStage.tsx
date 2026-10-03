"use client";

import { useEffect, useRef, useState } from "react";

/* ════════════════════════════════════════════════════════════════════════
   The switch behind the exploded layer stack. The stack itself is static
   server-rendered markup; this only sets `data-open` — once, when enough
   of it is on screen to see the layers come apart — and lets the visitor
   put the board back together and pull it apart again.

   Where the browser supports scroll timelines, CSS drives the separation
   from the scroll position instead, and `data-open` only matters once the
   visitor presses the button: that sets `data-manual`, which hands the
   stack back to this switch for the rest of the visit.
   ════════════════════════════════════════════════════════════════════════ */
export default function ExplodeStage({
  children,
  className = "",
  label,
}: {
  children: React.ReactNode;
  className?: string;
  /** names the drawing for a screen reader */
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [manual, setManual] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // no observer (very old browsers) — just open it on the next frame
    if (typeof IntersectionObserver === "undefined") {
      const raf = requestAnimationFrame(() => setOpen(true));
      return () => cancelAnimationFrame(raf);
    }
    /* well into view, not a sliver — the separation is the point */
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOpen(true);
          obs.disconnect();
        }
      },
      { threshold: 0.45 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} data-open={open ? "" : undefined} data-manual={manual ? "" : undefined}>
      <div role="img" aria-label={label}>
        {children}
      </div>
      <button
        type="button"
        onClick={() => {
          setManual(true);
          setOpen((v) => !v);
        }}
        className="seg lstack-toggle text-[11.5px] px-2.5 py-1"
      >
        {open ? "Assemble" : "Explode"}
      </button>
    </div>
  );
}
