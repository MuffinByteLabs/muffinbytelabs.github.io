/* ════════════════════════════════════════════════════════════════════════
   Content dates for the pages that are not blog posts. The sitemap and the
   structured data both read them here, so the two can never disagree.

   Hand-maintained on purpose. `new Date()` would stamp every page as
   modified-now on every rebuild — a lastmod signal search engines learn to
   distrust, which then also devalues the accurate per-post dates. Bump a
   date when that page's content actually changes.
   ════════════════════════════════════════════════════════════════════════ */
export const PAGE_DATES = {
  home: "2026-11-19",
  services: "2026-11-15",
  pcb2: { published: "2026-10-03", modified: "2026-11-15" },
  memoryMap: "2026-10-03",
} as const;

/** "2026-11-16" → midnight UTC that day, or undefined when the string is
    malformed. An Invalid Date would otherwise reach Next's serializer and
    kill the build with an opaque RangeError far from the actual typo. */
export function isoDate(iso: string): Date | undefined {
  const d = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? undefined : d;
}
