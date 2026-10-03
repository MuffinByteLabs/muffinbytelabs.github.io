"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import Icon from "@/components/ui/Icon";
import type { BoardImage } from "./pcbData";

/* ════════════════════════════════════════════════════════════════════════
   The assembled board as one photograph you can turn over.

   Front and back are the two faces of a card that rotates about its
   vertical axis — the same motion as picking the board up and flipping it,
   which is why the USB-C port swaps sides. Under a mouse the card also
   leans a few degrees toward the pointer.

   Two boxes, two jobs: the outer one tilts (fast, follows the pointer),
   the inner one flips (slow, eased) — on one box the long flip transition
   would make the tilt lag. The tilt writes CSS variables straight to the
   element, so following the pointer never re-renders React.
   ════════════════════════════════════════════════════════════════════════ */
export default function FlipPhoto({ front, back }: { front: BoardImage; back: BoardImage }) {
  const [flipped, setFlipped] = useState(false);
  const tiltRef = useRef<HTMLDivElement>(null);
  const shown = flipped ? back : front;

  function lean(e: React.PointerEvent<HTMLButtonElement>) {
    const el = tiltRef.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--tx", `${(-y * 5).toFixed(2)}deg`);
    el.style.setProperty("--ty", `${(x * 7).toFixed(2)}deg`);
  }

  function settle() {
    tiltRef.current?.style.setProperty("--tx", "0deg");
    tiltRef.current?.style.setProperty("--ty", "0deg");
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] gap-6 lg:gap-10 items-center">
      <button
        type="button"
        className="flip"
        data-flipped={flipped ? "" : undefined}
        onClick={() => setFlipped((v) => !v)}
        onPointerMove={lean}
        onPointerLeave={settle}
        aria-label={`Turn the board over — showing the ${flipped ? "back" : "front"}`}
      >
        <div ref={tiltRef} className="flip-tilt">
          <div className="flip-card">
            {[front, back].map((im, i) => (
              <div key={im.src} className={`flip-face ${i === 1 ? "flip-back" : ""}`}>
                <Image
                  src={im.src}
                  alt={im.alt}
                  width={im.width}
                  height={im.height}
                  sizes="(max-width: 1024px) 100vw, 640px"
                  className="block w-full h-auto"
                />
              </div>
            ))}
          </div>
        </div>
      </button>

      <div className="min-w-0">
        <span className="eyebrow">{shown.tag}</span>
        <p className="mt-3 mb-0 text-[15px] leading-7" style={{ color: "var(--text)" }} aria-live="polite">
          {shown.caption}
        </p>
        <button
          type="button"
          onClick={() => setFlipped((v) => !v)}
          className="btn btn-ghost btn-sm mt-6"
        >
          <Icon name="flip" size={15} />
          {flipped ? "Show the front" : "Turn it over"}
        </button>
        <p className="mt-3 mb-0 text-[12px]" style={{ color: "var(--text-3)" }}>
          Or click the photo.
        </p>
      </div>
    </div>
  );
}
