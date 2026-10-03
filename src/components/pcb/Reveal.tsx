"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fades a block in the first time it scrolls into view.
 *
 * The hidden state lives in CSS and is scoped to html[data-js], so a
 * crawler or a reader with scripts off gets the content rather than a page
 * of invisible divs. `delay` staggers siblings — a row of cards arrives as
 * a sequence instead of all at once.
 */
export default function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  /** milliseconds; for staggering a row of siblings */
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // no observer (very old browsers) — just show it on the next frame
    if (typeof IntersectionObserver === "undefined") {
      const raf = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(raf);
    }

    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          obs.unobserve(el);
        }
      },
      /* a tall block (a whole board card) can be taller than the viewport,
         where any ratio threshold above ~0.2 would never be met — so the
         trigger is "a sliver is on screen", nudged up from the bottom edge */
      { threshold: 0, rootMargin: "0px 0px -8% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${shown ? "shown" : ""} ${className}`}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}
