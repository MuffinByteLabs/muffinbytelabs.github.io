"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
import { formatDate } from "@/lib/dates";
import Icon from "@/components/ui/Icon";

/* ════════════════════════════════════════════════════════════════════════
   The Field Notes index: the newest note as a feature, then the rest as a
   grid of cards, filterable by tag. Choosing a tag folds the feature back
   into the grid, so the filter never hides a matching note.
   ════════════════════════════════════════════════════════════════════════ */
export default function BlogIndex({
  posts,
  tags,
}: {
  posts: PostMeta[];
  tags: { tag: string; count: number }[];
}) {
  const [active, setActive] = useState<string | null>(null);
  const shown = useMemo(() => (active ? posts.filter((p) => p.tag === active) : posts), [posts, active]);
  const featured = active ? null : shown[0];
  const grid = active ? shown : shown.slice(1);

  return (
    <>
      {featured && (
        <Link
          href={`/blog/${featured.slug}`}
          className="card card-link edge-glow group relative block overflow-hidden p-7 sm:p-10"
        >

          <div className="relative max-w-[640px]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="chip chip-mono" style={{ color: "var(--accent)", borderColor: "var(--accent-line)" }}>
                Latest
              </span>
              <span className="chip">{featured.tag}</span>
              <span className="text-[12.5px] ml-1" style={{ color: "var(--text-3)" }}>
                {formatDate(featured.date)} &middot; {featured.readTime}
              </span>
            </div>
            <h2 className="display mt-5 text-[2.1rem] sm:text-[2.8rem]" style={{ color: "var(--text)" }}>
              {featured.title}
            </h2>
            <p className="mt-4 mb-0 text-[15.5px] leading-8" style={{ color: "var(--text-2)" }}>
              {featured.excerpt}
            </p>
            <span className="mt-6 inline-flex items-center gap-2 text-[14px] font-medium link-gold">
              Read the note
              <span className="transition-transform group-hover:translate-x-1">
                <Icon name="arrowRight" size={15} />
              </span>
            </span>
          </div>
        </Link>
      )}

      <div className="mt-10 flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter by topic">
        <button
          type="button"
          onClick={() => setActive(null)}
          aria-pressed={active === null}
          className="seg text-[12.5px] px-3 py-1.5"
        >
          All <span className="mono text-[10.5px] opacity-60 ml-1">{posts.length}</span>
        </button>
        {tags.map((t) => (
          <button
            key={t.tag}
            type="button"
            onClick={() => setActive(active === t.tag ? null : t.tag)}
            aria-pressed={active === t.tag}
            className="seg text-[12.5px] px-3 py-1.5"
          >
            {t.tag} <span className="mono text-[10.5px] opacity-60 ml-1">{t.count}</span>
          </button>
        ))}
      </div>

      <ul className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 m-0 p-0 list-none" aria-live="polite">
        {grid.map((p) => (
          <li key={p.slug}>
            <Link href={`/blog/${p.slug}`} className="card card-link group flex h-full flex-col p-6">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px]" style={{ color: "var(--text-3)" }}>
                <span className="mono text-[10.5px] tracking-[0.12em] uppercase" style={{ color: "var(--accent)" }}>
                  {p.tag}
                </span>
                <span>{formatDate(p.date)}</span>
                <span>{p.readTime}</span>
              </div>
              <h2
                className="mt-3 text-[1.12rem] sm:text-[1.2rem] font-semibold leading-snug tracking-[-0.016em]"
                style={{ color: "var(--text)" }}
              >
                {p.title}
              </h2>
              <p className="mt-2 mb-0 text-[13.5px] leading-6 flex-1" style={{ color: "var(--text-2)" }}>
                {p.excerpt}
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-[13px]" style={{ color: "var(--text-3)" }}>
                Read
                <span className="transition-transform group-hover:translate-x-1" style={{ color: "var(--accent)" }}>
                  <Icon name="arrowRight" size={14} />
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {shown.length === 0 && (
        <p className="py-10 text-[14px]" style={{ color: "var(--text-3)" }}>
          Nothing filed under that yet.
        </p>
      )}
    </>
  );
}
