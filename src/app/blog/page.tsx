import BlogIndex from "@/components/blog/BlogIndex";
import SectionHead from "@/components/ui/SectionHead";
import Icon from "@/components/ui/Icon";
import { getAllPosts, getAllTags } from "@/lib/posts";

const TITLE = "Field Notes — PCB Design Journal | Ray Malik";
const DESCRIPTION =
  "Practical notes on PCB design: layout, power, manufacturing packages, signal integrity, and board bring-up.";

/* openGraph/twitter in full — Next does not merge them field-by-field with
   the layout, so omitting them here shares this page as the homepage's card
   with the homepage's URL. */
export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/blog" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/blog",
    siteName: "Ray Malik · MuffinByteLabs",
    type: "website",
    locale: "en_US",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "MuffinByteLabs — PCB design" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og.png"],
  },
};

export default function BlogPage() {
  const posts = getAllPosts();
  const tags = getAllTags(posts);

  return (
    <section className="relative overflow-hidden px-6 pt-32 sm:pt-36 pb-24">
      <div aria-hidden className="grid-bg absolute inset-0 -z-10" />
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <SectionHead
            as="h1"
            label="Field Notes"
            title={
              <>
                Notes from <em>the bench</em>
              </>
            }
            lede="Write-ups on the parts of PCB design that decide whether a board works the first time — layout, power, manufacturing packages, and bring-up."
          />
          <a href="/feed.xml" className="btn btn-ghost btn-sm mb-1">
            <Icon name="rss" size={15} />
            RSS feed
          </a>
        </div>
        <div className="mt-12">
          <BlogIndex posts={posts} tags={tags} />
        </div>
      </div>
    </section>
  );
}
