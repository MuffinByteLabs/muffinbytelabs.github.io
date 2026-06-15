"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useReducedMotion } from "./pcb/useReducedMotion";

const CHARS = "0123456789ABCDEFmilmmVIAGERBERDRCERC0402GND3V3CuENIG·";

export default function ScrambleText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(text);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const scramble = useCallback(() => {
    let iteration = 0;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplay(
        text
          .split("")
          .map((char, i) => {
            if (i < iteration) return text[i];
            if (char === " ") return " ";
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      iteration += 1;

      if (iteration > text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplay(text);
      }
    }, 45);
  }, [text]);

  const reset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDisplay(text);
  }, [text]);

  // An invisible twin reserves the real (wrapped) size; the scrambling glyphs
  // overlay it absolutely so they never shift layout or overflow on mobile.
  return (
    <span
      className={`relative inline-block max-w-full ${className}`}
      aria-label={text}
      onMouseEnter={reduced ? undefined : scramble}
      onMouseLeave={reduced ? undefined : reset}
    >
      <span aria-hidden className="invisible">{text}</span>
      <span aria-hidden className="absolute inset-0">{display}</span>
    </span>
  );
}
