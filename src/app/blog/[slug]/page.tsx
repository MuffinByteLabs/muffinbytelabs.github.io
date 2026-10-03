import type { Metadata } from "next";
import Link from "next/link";
import ReadingProgress from "@/components/blog/ReadingProgress";
import { getAllPosts, formatDate, postOgImage } from "@/lib/posts";
import { jsonLd, postSchema } from "@/lib/schema";
import Icon from "@/components/ui/Icon";
import { CONTACT_MAILTO } from "@/components/pcb/pcbData";
import { POSTS } from "@/content";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getAllPosts().find((p) => p.slug === slug);
  if (!post) return { title: "Post not found | Ray Malik" };
  /* Next does not merge openGraph field-by-field with the root layout: a page
     that declares `openGraph` and omits `images` ships a card with no image at
     all, and one that omits `twitter` inherits the SITE's title, so every
     shared Field Note used to preview as the homepage. Both blocks are
     therefore spelled out in full. The image is the post's own generated
     card, so a shared Field Note previews as itself rather than the homepage. */
  const url = `/blog/${post.slug}`;
  const og = postOgImage(post.slug);
  return {
    title: `${post.title} | Field Notes`,
    description: post.excerpt,
    authors: [{ name: "Ray Malik" }],
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      siteName: "Ray Malik · MuffinByteLabs",
      type: "article",
      publishedTime: post.date,
      authors: ["Ray Malik"],
      locale: "en_US",
      images: [{ url: og, width: 1200, height: 630, alt: `${post.title} — Field Notes` }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [og],
    },
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const posts = getAllPosts();
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="display text-3xl mb-4" style={{ color: "var(--text)" }}>
            Post not found
          </h1>
          <Link href="/blog" className="text-sm" style={{ color: "var(--accent)" }}>
            Back to Field Notes
          </Link>
        </div>
      </div>
    );
  }

  const related = posts.filter((p) => p.tag === post.tag && p.slug !== post.slug).slice(0, 3);
  const more = related.length > 0 ? related : posts.filter((p) => p.slug !== post.slug).slice(0, 3);
  /* one lazy import per post (src/content/index.ts, generated before every
     dev and build run), so opening a post compiles that post alone */
  const load = POSTS[slug];
  if (!load) throw new Error(`No entry for "${slug}" in src/content/index.ts — run: node scripts/gen-post-index.cjs`);
  const MDXContent = (await load()).default;

  return (
    <div className="relative px-6 pt-28 sm:pt-32 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(postSchema(post, postOgImage(post.slug)))}
      />
      <ReadingProgress />
      <article className="max-w-[44rem] mx-auto">
        <Link href="/blog" className="link-quiet inline-flex items-center gap-2 text-[13px] mb-10">
          <Icon name="arrowLeft" size={14} /> Field Notes
        </Link>

        <div className="flex flex-wrap items-center gap-2 mb-5">
          <span className="chip chip-mono" style={{ color: "var(--accent)", borderColor: "var(--accent-line)" }}>
            {post.tag}
          </span>
          <span className="text-[12.5px] ml-1" style={{ color: "var(--text-3)" }}>
            {formatDate(post.date)} &middot; {post.readTime}
          </span>
        </div>

        <h1 className="display text-[2.4rem] sm:text-[3.1rem]" style={{ color: "var(--text)" }}>
          {post.title}
        </h1>

        <p className="lede mt-6 mb-0 text-[17.5px]">{post.excerpt}</p>

        <div className="mt-8 flex items-center gap-3 pb-10" style={{ borderBottom: "1px solid var(--border-soft)" }}>
          <span
            className="inline-flex items-center justify-center w-10 h-10 rounded-full"
            style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)" }}
          >
            <span className="logo" aria-hidden style={{ width: 20, height: 20 }} />
          </span>
          <span className="text-[13px] leading-5">
            <span className="block font-medium" style={{ color: "var(--text)" }}>
              Ray Malik
            </span>
            <span className="block" style={{ color: "var(--text-3)" }}>
              PCB design engineer &middot; MuffinByteLabs
            </span>
          </span>
        </div>

        <div className="pt-10 prose-notes">
          <MDXContent />
        </div>

        {/* ── who wrote it, and what to do next ─────────────────────────── */}
        <aside
          className="mt-16 rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center gap-5 justify-between"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div>
            <span className="eyebrow">Written at the bench</span>
            <p className="mt-2 mb-0 text-[14px] leading-7 max-w-[46ch]" style={{ color: "var(--text-2)" }}>
              Notes like this come out of real boards. If yours is the next one, a fixed quote
              takes a day.
            </p>
          </div>
          <a href={CONTACT_MAILTO} className="btn btn-primary btn-sm shrink-0">
            Start a board
            <Icon name="arrowRight" size={14} className="nudge" />
          </a>
        </aside>
      </article>

      {more.length > 0 && (
        <div className="max-w-6xl mx-auto mt-20">
          <h2 className="eyebrow m-0">{related.length > 0 ? `More on ${post.tag}` : "More Field Notes"}</h2>
          <ul className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4 m-0 p-0 list-none">
            {more.map((r) => (
              <li key={r.slug}>
                <Link href={`/blog/${r.slug}`} className="card card-link group flex h-full flex-col p-6">
                  <span className="text-[12px]" style={{ color: "var(--text-3)" }}>
                    {formatDate(r.date)} &middot; {r.readTime}
                  </span>
                  <span className="mt-2.5 text-[16px] font-semibold leading-snug tracking-[-0.014em]" style={{ color: "var(--text)" }}>
                    {r.title}
                  </span>
                  <span className="mt-auto pt-5 inline-flex items-center gap-1.5 text-[13px]" style={{ color: "var(--text-3)" }}>
                    Read
                    <span className="transition-transform group-hover:translate-x-1" style={{ color: "var(--accent)" }}>
                      <Icon name="arrowRight" size={14} />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
