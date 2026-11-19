import type { Metadata } from "next";

/* A page's metadata with openGraph and twitter spelled out in full: Next
   does not merge them field by field with the layout's, so a page that
   omits them is shared as the homepage's card with the homepage's URL. */
export function pageMetadata({ title, description, path, image = "/og.png" }: { title: string; description: string; path: string; image?: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: "Ray Malik · MuffinByteLabs",
      type: "website",
      locale: "en_US",
      images: [{ url: image, width: 1200, height: 630, alt: "MuffinByteLabs — PCB design" }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}
