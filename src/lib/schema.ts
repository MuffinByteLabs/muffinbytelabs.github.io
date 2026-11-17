/* ════════════════════════════════════════════════════════════════════════
   JSON-LD — the machine-readable version of who this is and what he does.

   Search engines and AI assistants will not infer "freelance PCB designer,
   $30 an hour, hire him here" from prose alone, and for a one-person
   practice that inference is the whole point of being indexed at all.
   Everything below is a fact stated elsewhere on the site, and the text it
   repeats (services, answers) is read from the same data the pages render,
   so the two cannot drift apart.

   Deliberately absent: aggregateRating, postal address, telephone.
   Structured data is a claim made to a search engine in a format built for
   trust; inventing any of those is worse than omitting them. The price is
   the hourly rate the site itself states.

   Pages other than the homepage carry minimal inline author and publisher
   nodes rather than bare @id references: search engines parse each page's
   structured data on its own, so an @id that only exists in the homepage's
   @graph resolves to nothing there — and an article loses eligibility on a
   missing author.name.
   ════════════════════════════════════════════════════════════════════════ */

import { FAQ, HOURLY_RATE, HOURLY_RATE_USD, SERVICES, UPWORK_URL } from "@/components/pcb/pcbData";
import { PAGE_DATES } from "@/lib/pageDates";

export const SITE = "https://muffinbytelabs.com";
export const EMAIL = "muffinbytelabs@gmail.com";
export const GITHUB_ORG = "https://github.com/MuffinByteLabs";
export const BOARD_REPO = "https://github.com/MuffinByteLabs/esp32s3-plant-monitor";

/** The homepage's title and description, used by the layout's metadata and
    by the WebPage node below. The title leads with the name and the job, the
    two things people search for; the description fits in a results snippet. */
export const HOME_TITLE = "Ray Malik — Freelance PCB Design Engineer | MuffinByteLabs";
export const HOME_DESCRIPTION = `Freelance PCB design engineer for ESP32 and STM32 boards: schematic, 2- and 4-layer layout, fab-ready files and design reviews. ${HOURLY_RATE}/hour or a fixed quote in 24 h.`;

const PERSON_ID = `${SITE}/#ray`;
const SERVICE_ID = `${SITE}/#practice`;
const WEBSITE_ID = `${SITE}/#website`;

/** What Ray is known for — one list for the person and the practice. */
const KNOWS_ABOUT = [
  "PCB design",
  "PCB layout",
  "Schematic capture",
  "4-layer PCB design",
  "Design for manufacturing",
  "Pre-fabrication PCB design review",
  "Gerber, BOM and pick-and-place files",
  "JLCPCB and PCBWay manufacturing",
  "ESP32",
  "STM32",
  "USB-C power and protection",
  "Isolated industrial I/O",
  "RS-485 and CAN",
  "Power electronics",
  "Signal integrity",
  "Board bring-up",
  "Embedded firmware",
];

/* the inline nodes every page outside the homepage carries */
const AUTHOR = { "@type": "Person", "@id": PERSON_ID, name: "Ray Malik", url: SITE };
const PUBLISHER = {
  "@type": "Organization",
  "@id": SERVICE_ID,
  name: "MuffinByteLabs",
  url: SITE,
  logo: `${SITE}/logo-mark.png`,
};

/** Home › … › this page. */
function breadcrumbs(trail: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...trail].map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: `${SITE}${t.path}`,
    })),
  };
}

const person = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: "Ray Malik",
  url: SITE,
  email: `mailto:${EMAIL}`,
  image: `${SITE}/face_shot.webp`,
  jobTitle: "Freelance PCB Design Engineer",
  worksFor: { "@id": SERVICE_ID },
  sameAs: [GITHUB_ORG, UPWORK_URL],
  description:
    "Freelance PCB design engineer: schematic capture, 2- and 4-layer layout and the complete manufacturing package, plus pre-fab reviews of existing designs.",
  knowsAbout: KNOWS_ABOUT,
};

/** Home page: the page, the person, the practice and its offer, the two
    boards, the website, and the questions answered on the page. */
export const homeSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${SITE}/#webpage`,
      url: `${SITE}/`,
      name: HOME_TITLE,
      description: HOME_DESCRIPTION,
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": PERSON_ID },
      primaryImageOfPage: `${SITE}/og.png`,
      dateModified: PAGE_DATES.home,
      inLanguage: "en",
    },
    person,
    {
      "@type": "ProfessionalService",
      "@id": SERVICE_ID,
      name: "MuffinByteLabs",
      url: SITE,
      email: `mailto:${EMAIL}`,
      logo: `${SITE}/logo-mark.png`,
      image: `${SITE}/og.png`,
      founder: { "@id": PERSON_ID },
      sameAs: [GITHUB_ORG, UPWORK_URL],
      description:
        "Freelance PCB design: schematic capture, 2- and 4-layer layout, and a manufacturing package any fab can build from — Gerbers, drill, BOM with real part numbers, pick-and-place, and DRC/ERC-clean proof. Pre-fab design reviews of existing boards.",
      areaServed: "Worldwide",
      priceRange: `${HOURLY_RATE} per hour`,
      knowsAbout: KNOWS_ABOUT,
      serviceType: [
        "PCB design",
        "PCB layout",
        "Schematic capture",
        "Pre-fabrication PCB design review",
        "Schematic conversion and redraw",
        "PCB debug and bring-up",
        "Manufacturing package preparation",
      ],
      makesOffer: {
        "@type": "Offer",
        name: "PCB design engineering by the hour",
        description: "Open-ended work by the hour. A defined job gets a fixed price in writing within 24 hours.",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: HOURLY_RATE_USD,
          priceCurrency: "USD",
          unitCode: "HUR",
          unitText: "hour",
        },
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "PCB design services",
        itemListElement: SERVICES.map((s) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: s.title,
            description: s.desc,
            url: `${SITE}/services#${s.id.toLowerCase()}`,
          },
        })),
      },
    },
    {
      /* The board project itself, published in full. Claimed here because
         it is a real artifact at a real URL, not a description. Both types:
         it is source you can build from, and a design work. No
         `isPartOf`: the repository is not part of this website. */
      "@type": ["SoftwareSourceCode", "CreativeWork"],
      "@id": `${SITE}/#pcb1`,
      name: "PCB 1 — ESP32-S3 Wi-Fi Plant Monitor",
      description:
        "The complete project for a 4-layer ESP32-S3 Wi-Fi sensor board: schematic, layout, the frozen JLCPCB manufacturing package, firmware, design document, design reviews and bring-up guide.",
      codeRepository: BOARD_REPO,
      url: BOARD_REPO,
      author: { "@id": PERSON_ID },
    },
    {
      /* PCB 2 is claimed as what it is on this site: a case-study page at a
         real URL. No repository is linked until one is published. */
      "@type": "CreativeWork",
      "@id": `${SITE}/work/stm32-industrial-io#pcb2`,
      name: "PCB 2 — STM32 Industrial I/O Controller",
      description:
        "Case study of a four-layer STM32G474 sensor and actuator controller for 12/24 V DC equipment: isolated digital inputs, protected analog inputs, high-side and relay outputs, a 0–10 V output, and isolated RS-485 and CAN FD.",
      url: `${SITE}/work/stm32-industrial-io`,
      author: { "@id": PERSON_ID },
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: SITE,
      name: "MuffinByteLabs",
      alternateName: "Ray Malik · MuffinByteLabs",
      publisher: { "@id": SERVICE_ID },
      inLanguage: "en",
    },
    {
      /* the questions section on the homepage, word for word */
      "@type": "FAQPage",
      "@id": `${SITE}/#faq`,
      isPartOf: { "@id": `${SITE}/#webpage` },
      mainEntity: FAQ.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

/** The services page: each service as a Service, on its own anchor. */
export function servicesSchema(title: string, description: string) {
  const url = `${SITE}/services`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: title,
        description,
        about: PUBLISHER,
        dateModified: PAGE_DATES.services,
        inLanguage: "en",
      },
      breadcrumbs([{ name: "Services", path: "/services" }]),
      {
        "@type": "ItemList",
        name: "PCB design services",
        itemListElement: SERVICES.map((s, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Service",
            "@id": `${url}#${s.id.toLowerCase()}`,
            url: `${url}#${s.id.toLowerCase()}`,
            name: s.title,
            description: s.desc,
            provider: PUBLISHER,
            areaServed: "Worldwide",
          },
        })),
      },
    ],
  };
}

/** The PCB 2 case study, as a technical article about the board. */
export function pcb2Schema({ path, headline, description }: { path: string; headline: string; description: string }) {
  const url = `${SITE}${path}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        "@id": `${url}#article`,
        url,
        mainEntityOfPage: url,
        headline,
        description,
        image: `${SITE}/og/pcb-2.png`,
        datePublished: PAGE_DATES.pcb2.published,
        dateModified: PAGE_DATES.pcb2.modified,
        author: AUTHOR,
        publisher: PUBLISHER,
        about: { "@type": "CreativeWork", "@id": `${url}#pcb2`, name: "PCB 2 — STM32 Industrial I/O Controller" },
        inLanguage: "en",
      },
      breadcrumbs([{ name: "PCB 2 case study", path }]),
    ],
  };
}

/** The STM32F407 memory-map explorer: a free tool that runs in the browser. */
export function memoryMapSchema(description: string) {
  const url = `${SITE}/memory-map`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${url}#app`,
        name: "STM32F407 Memory Map Explorer",
        url,
        description,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Any (runs in a web browser)",
        browserRequirements: "Requires JavaScript",
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: 0, priceCurrency: "USD" },
        author: AUTHOR,
        publisher: PUBLISHER,
        dateModified: PAGE_DATES.memoryMap,
        inLanguage: "en",
      },
      breadcrumbs([{ name: "STM32F407 Memory Map", path: "/memory-map" }]),
    ],
  };
}

/** The Field Notes index: the blog and every post in it. */
export function blogSchema(posts: { slug: string; title: string; date: string }[], description: string) {
  const url = `${SITE}/blog`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": `${url}#blog`,
        url,
        name: "Field Notes",
        description,
        author: AUTHOR,
        publisher: PUBLISHER,
        inLanguage: "en",
        blogPost: posts.map((p) => ({
          "@type": "BlogPosting",
          "@id": `${SITE}/blog/${p.slug}`,
          url: `${SITE}/blog/${p.slug}`,
          headline: p.title,
          datePublished: p.date,
          author: AUTHOR,
        })),
      },
      breadcrumbs([{ name: "Field Notes", path: "/blog" }]),
    ],
  };
}

/** A Field Note. `image` is the post's own OG card when one was generated,
    site-relative (e.g. "/og/slug.png"); the shared card is the fallback. */
export function postSchema(
  post: {
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    tag: string;
  },
  image?: string
) {
  const url = `${SITE}/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": url,
        mainEntityOfPage: url,
        url,
        headline: post.title,
        description: post.excerpt,
        /* no separate dateModified: the post has one date and pretending it was
           revised later is exactly the kind of small lie this file avoids */
        datePublished: post.date,
        articleSection: post.tag,
        inLanguage: "en",
        image: `${SITE}${image ?? "/og.png"}`,
        author: AUTHOR,
        publisher: PUBLISHER,
        isPartOf: { "@type": "Blog", "@id": `${SITE}/blog#blog`, name: "Field Notes", url: `${SITE}/blog` },
      },
      breadcrumbs([
        { name: "Field Notes", path: "/blog" },
        { name: post.title, path: `/blog/${post.slug}` },
      ]),
    ],
  };
}

/** Renders as a <script type="application/ld+json"> payload. */
export function jsonLd(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
