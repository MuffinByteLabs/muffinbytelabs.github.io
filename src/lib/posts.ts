import fs from "fs";
import path from "path";
import { cache } from "react";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "src/content");

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  readTime: string;
  tag: string;
  excerpt: string;
  /** the <title> for search results, worded the way people search; the
      page itself keeps `title` */
  seoTitle?: string;
  draft?: boolean;
};

/**
 * Every published post, newest first. Build-time only (static export).
 * Posts with `draft: true` in their frontmatter are excluded from the site
 * but kept on disk — flip the flag to publish one.
 */
export const getAllPosts = cache((): PostMeta[] => {
  if (!fs.existsSync(contentDir)) return [];

  return fs
    .readdirSync(contentDir)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const { data } = matter(fs.readFileSync(path.join(contentDir, file), "utf-8"));
      return {
        slug,
        title: String(data.title ?? slug),
        date: String(data.date ?? ""),
        readTime: String(data.readTime ?? ""),
        tag: String(data.tag ?? "General"),
        excerpt: String(data.excerpt ?? ""),
        seoTitle: data.seoTitle ? String(data.seoTitle) : undefined,
        draft: data.draft === true,
      };
    })
    .filter((p) => !p.draft)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
});

export function getPostSlugs(): string[] {
  return getAllPosts().map((p) => p.slug);
}

/** A post's Markdown body with the frontmatter removed, for /llms-full.txt.
    Build-time only, like everything else here. MDX-only lines mean nothing
    as Markdown, so they are dropped: the `import` lines, and a component
    standing on a line of its own (a drawing; the text around it already
    says what it shows). Lines inside code fences are kept as written. */
export function getPostBody(slug: string): string {
  const file = path.join(contentDir, `${slug}.mdx`);
  if (!fs.existsSync(file)) return "";
  let fenced = false;
  return matter(fs.readFileSync(file, "utf-8"))
    .content.split("\n")
    .filter((line) => {
      if (/^\s*(```|~~~)/.test(line)) {
        fenced = !fenced;
        return true;
      }
      if (fenced) return true;
      return !/^(import|export)\s/.test(line) && !/^<[A-Z][\w.]*(\s[^>]*)?\/>$/.test(line.trim());
    })
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * The post's own OG card if `scripts/gen-post-og.cjs` has generated one,
 * else the shared site card. Build-time only, like everything else here —
 * the fallback means a new post is never blocked on running the script,
 * it just previews as the homepage until someone does.
 */
export function postOgImage(slug: string): string {
  const p = path.join(process.cwd(), "public", "og", `${slug}.png`);
  return fs.existsSync(p) ? `/og/${slug}.png` : "/og.png";
}

/** Tags present in the corpus, ordered by post count (desc). */
export function getAllTags(posts: PostMeta[]): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const p of posts) counts.set(p.tag, (counts.get(p.tag) ?? 0) + 1);
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export { formatDate } from "./dates";
