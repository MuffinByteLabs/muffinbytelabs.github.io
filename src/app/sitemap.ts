import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { PAGE_DATES, isoDate } from "@/lib/pageDates";
import { SITE } from "@/lib/schema";

/* The page dates are hand-maintained in src/lib/pageDates.ts (the
   structured data reads the same ones); each post carries its own date. */

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  /* newest post drives the blog index's lastModified */
  const newestPost = posts.length > 0 ? isoDate(posts[0].date) : undefined;

  return [
    { url: `${SITE}/`, lastModified: isoDate(PAGE_DATES.home), changeFrequency: "monthly", priority: 1 },
    {
      url: `${SITE}/work/stm32-industrial-io`,
      lastModified: isoDate(PAGE_DATES.pcb2.modified),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    { url: `${SITE}/services`, lastModified: isoDate(PAGE_DATES.services), changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/blog`, lastModified: newestPost, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/memory-map`, lastModified: isoDate(PAGE_DATES.memoryMap), changeFrequency: "yearly", priority: 0.4 },
    ...posts.map((p) => ({
      url: `${SITE}/blog/${p.slug}`,
      lastModified: isoDate(p.date),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
