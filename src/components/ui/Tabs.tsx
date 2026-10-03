"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import Icon, { type IconName } from "./Icon";

export type TabItem = {
  key: string;
  label: string;
  icon?: IconName;
  content: ReactNode;
};

/* ════════════════════════════════════════════════════════════════════════
   Tabs, done to the WAI-ARIA pattern: one tab stop for the whole list,
   arrow keys / Home / End move between tabs, and selection follows focus.

   A panel renders the first time its tab is opened, not before — the
   hidden ones used to put a full board drawing into the page that most
   visitors never looked at. Once opened, a panel stays mounted and is only
   hidden, so a 3D model that has been loaded, or a net that has been lit,
   is still there when the visitor comes back to its tab.
   ════════════════════════════════════════════════════════════════════════ */
export default function Tabs({
  items,
  label,
  mobileFirst,
  className = "",
  panelClassName = "",
}: {
  items: TabItem[];
  /** names the tab list for a screen reader — "PCB 1 views" */
  label: string;
  /** key of the tab to open first on a phone, when the default is too wide for one */
  mobileFirst?: string;
  className?: string;
  panelClassName?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const [active, setActive] = useState(0);
  const [opened, setOpened] = useState<ReadonlySet<number>>(() => new Set([0]));
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function select(i: number) {
    setActive(i);
    setOpened((prev) => (prev.has(i) ? prev : new Set(prev).add(i)));
  }

  /* the server renders the desktop default; a phone swaps to its own first
     tab right after hydration, while the card is still far down the page */
  const mobileIndex = mobileFirst ? items.findIndex((t) => t.key === mobileFirst) : -1;
  useEffect(() => {
    if (mobileIndex < 0 || !window.matchMedia("(max-width: 639px)").matches) return;
    const raf = requestAnimationFrame(() => {
      setActive(mobileIndex);
      setOpened((prev) => new Set(prev).add(mobileIndex));
    });
    return () => cancelAnimationFrame(raf);
  }, [mobileIndex]);

  function onKey(e: KeyboardEvent<HTMLDivElement>) {
    const n = items.length;
    let next = -1;
    if (e.key === "ArrowRight") next = (active + 1) % n;
    else if (e.key === "ArrowLeft") next = (active - 1 + n) % n;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    if (next < 0) return;
    e.preventDefault();
    select(next);
    refs.current[next]?.focus();
  }

  return (
    <div className={className}>
      <div role="tablist" aria-label={label} className="tablist" onKeyDown={onKey}>
        {items.map((t, i) => (
          <button
            key={t.key}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="tab"
            type="button"
            id={`${uid}-tab-${t.key}`}
            aria-selected={active === i}
            aria-controls={`${uid}-panel-${t.key}`}
            tabIndex={active === i ? 0 : -1}
            onClick={() => select(i)}
            className="tab"
          >
            {t.icon && <Icon name={t.icon} size={15} />}
            {t.label}
          </button>
        ))}
      </div>

      {items.map((t, i) => (
        <div
          key={t.key}
          role="tabpanel"
          id={`${uid}-panel-${t.key}`}
          aria-labelledby={`${uid}-tab-${t.key}`}
          hidden={active !== i}
          tabIndex={0}
          className={`mt-5 focus-visible:outline-offset-4 ${panelClassName}`}
        >
          {opened.has(i) ? t.content : null}
        </div>
      ))}
    </div>
  );
}
