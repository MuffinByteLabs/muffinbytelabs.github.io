"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/Icon";
import CopyEmail from "@/components/CopyEmail";
import { CONTACT_MAILTO, CONTACT_EMAIL } from "@/components/pcb/pcbData";

/* Four links and one action — what a client needs in their first half
   minute. (The STM32 memory map lives in the footer.) Work and Deliverables
   are sections of the home page, so "here" for them comes from a scroll-spy
   rather than the route; Work also stays lit on a case-study page. */
const links = [
  { href: "/#work", label: "Work", section: "work" },
  { href: "/#deliverables", label: "Deliverables", section: "deliverables" },
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Notes" },
] as const;

export default function Header() {
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<string | null>(null);
  const sentinel = useRef<HTMLDivElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);

  /* A sentinel plus one IntersectionObserver, rather than a scroll listener:
     this fires twice — once on the way down, once on the way back. */
  useEffect(() => {
    const el = sentinel.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(([e]) => setScrolled(!e.isIntersecting));
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* scroll-spy for the two home-page sections that have nav links */
  useEffect(() => {
    if (path !== "/" || typeof IntersectionObserver === "undefined") return;
    const ids = ["work", "deliverables", "contact"];
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const seen = new Map<string, boolean>();
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => seen.set(e.target.id, e.isIntersecting));
        /* contact belongs to no nav link */
        const first = ids.find((id) => seen.get(id));
        setSection(first === "contact" ? null : (first ?? null));
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [path]);

  /* the menu closes on navigation — adjusted during render, the pattern
     React recommends over an effect — and on Escape, handing focus back */
  const [menuPath, setMenuPath] = useState(path);
  if (menuPath !== path) {
    setMenuPath(path);
    setOpen(false);
  }
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuBtn.current?.focus();
      }
    };
    /* the sheet covers the page, so the page underneath stops scrolling */
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isHere = (l: (typeof links)[number]) => {
    if ("section" in l) {
      if (l.section === "work" && path.startsWith("/work")) return true;
      return path === "/" && section === l.section;
    }
    return path === l.href || path.startsWith(l.href + "/");
  };

  const solid = scrolled || open;

  return (
    <>
      <div
        ref={sentinel}
        aria-hidden
        style={{ position: "absolute", top: 12, left: 0, width: 1, height: 1, pointerEvents: "none" }}
      />
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-[background,border-color] duration-300"
        style={{
          background: solid ? "var(--header-bg)" : "transparent",
          backdropFilter: solid ? "saturate(150%) blur(16px)" : undefined,
          WebkitBackdropFilter: solid ? "saturate(150%) blur(16px)" : undefined,
          borderBottom: `1px solid ${solid ? "var(--border-soft)" : "transparent"}`,
        }}
      >
        <nav className="max-w-6xl mx-auto px-5 sm:px-6 h-16 flex items-center justify-between gap-4" aria-label="Main">
          <Link
            href="/"
            className="flex items-center gap-2.5 shrink-0"
            style={{ color: "var(--text)" }}
            aria-label="MuffinByteLabs — home"
          >
            <span className="logo" aria-hidden style={{ width: 30, height: 30 }} />
            <span className="text-[16px] font-medium tracking-[-0.012em]">MuffinByteLabs</span>
          </Link>

          {/* desktop: the links in a quiet pill, then the one action */}
          <div className="hidden lg:flex items-center gap-3">
            <ul
              className="flex items-center gap-0.5 m-0 p-1 list-none rounded-full"
              style={{ border: "1px solid var(--border-soft)", background: "rgba(22,21,19,0.55)" }}
            >
              {links.map((l) => {
                const here = isHere(l);
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      aria-current={here ? "page" : undefined}
                      className="block px-3.5 py-1.5 rounded-full text-[13.5px] transition-colors"
                      style={{
                        color: here ? "var(--text)" : "var(--text-2)",
                        background: here ? "var(--surface-3)" : "transparent",
                        boxShadow: here ? "inset 0 1px 0 rgba(255,255,255,0.06)" : undefined,
                      }}
                    >
                      {l.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <a href={CONTACT_MAILTO} className="btn btn-primary btn-sm">
              Start a board
              <Icon name="arrowRight" size={14} className="nudge" />
            </a>
          </div>

          {/* phone: one button that opens the sheet */}
          <button
            ref={menuBtn}
            type="button"
            className="lg:hidden inline-flex items-center gap-2 rounded-full px-3.5 h-10 text-[13px]"
            style={{ border: "1px solid var(--border-strong)", color: "var(--text)", background: "rgba(22,21,19,0.6)" }}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name={open ? "close" : "menu"} size={16} />
            {open ? "Close" : "Menu"}
          </button>
        </nav>

        {/* the sheet */}
        <div
          id="mobile-menu"
          hidden={!open}
          className="lg:hidden px-5 pb-8 overflow-y-auto"
          style={{
            borderTop: "1px solid var(--border-soft)",
            height: "calc(100dvh - 4rem)",
            background: "rgba(13,12,11,0.96)",
          }}
        >
          <ul className="m-0 p-0 list-none pt-2">
            {links.map((l) => {
              const here = isHere(l);
              return (
                <li key={l.href} style={{ borderBottom: "1px solid var(--border-soft)" }}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    aria-current={here ? "page" : undefined}
                    className="flex items-center justify-between py-4 text-[17px]"
                    style={{ color: here ? "var(--text)" : "var(--text-2)" }}
                  >
                    <span className="display text-[1.6rem]">{l.label}</span>
                    <Icon name="arrowRight" size={16} className="opacity-50" />
                  </Link>
                </li>
              );
            })}
          </ul>
          <a href={CONTACT_MAILTO} className="btn btn-primary w-full mt-6">
            Start a board
            <Icon name="arrowRight" size={16} />
          </a>
          <CopyEmail
            email={CONTACT_EMAIL}
            className="link-quiet mt-4 mx-auto flex items-center justify-center gap-2 text-[13px]"
          />
        </div>
      </header>
    </>
  );
}
