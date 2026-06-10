"use client";

import { useEffect, useState } from "react";

/**
 * Honors the OS-level "reduce motion" setting. Components use this to render
 * the final, lit/powered board state and skip ramps, trace-draws, and pulses.
 */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}
