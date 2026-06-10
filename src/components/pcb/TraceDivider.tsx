"use client";

import { useEffect, useRef, useState } from "react";

/** Copper hairline that draws itself outward on scroll-in; a gold via lands at center. */
export default function TraceDivider() {
  const ref = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setLit(true);
          obs.unobserve(el);
        }
      },
      { rootMargin: "-10% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6">
      <div ref={ref} className="relative flex items-center justify-center h-px">
        <div className={`trace-divider-line ${lit ? "lit" : ""}`} />
        <span aria-hidden className={`trace-divider-via absolute ${lit ? "lit" : ""}`} />
      </div>
    </div>
  );
}
