import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import ClientLayout from "@/components/ClientLayout";
import { HOME_DESCRIPTION, HOME_TITLE, SITE } from "@/lib/schema";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/* one display face, used only for the name and section headings — with its
   italic, which carries the one emphasised phrase in a heading */
const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

/* the homepage's title and description live with the structured data,
   which repeats them */
const TITLE = HOME_TITLE;
const DESCRIPTION = HOME_DESCRIPTION;
/* a shared link already shows the site's name beside the title */
const SHARE_TITLE = "Ray Malik — Freelance PCB Design Engineer";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: TITLE,
  description: DESCRIPTION,
  applicationName: "MuffinByteLabs",
  authors: [{ name: "Ray Malik", url: SITE }],
  creator: "Ray Malik",
  publisher: "MuffinByteLabs",
  /* proves ownership to Google Search Console (property https://muffinbytelabs.com/);
     removing this tag un-verifies the site there */
  verification: { google: "cXvxRu0L69sxh9nRR7rGnrDv9L3cL7iYSz3gzpLnIYc" },
  /* every page may be indexed, quoted at any length and shown with a large
     image, in search results and in the AI answers built from them; a page
     inherits this unless it says otherwise */
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large", "max-video-preview": -1 },
  },
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": [{ url: "/feed.xml", title: "Field Notes" }] },
  },
  keywords: [
    "freelance PCB designer",
    "PCB design services",
    "PCB design freelancer",
    "hire a PCB designer",
    "PCB layout",
    "PCB design review",
    "schematic capture",
    "ESP32 PCB design",
    "STM32 PCB design",
    "4-layer PCB design",
    "USB-C PCB design",
    "JLCPCB",
    "PCBWay",
    "Gerber, BOM and CPL files",
    "isolated industrial I/O",
    "RS-485",
    "CAN FD",
  ],
  openGraph: {
    title: SHARE_TITLE,
    description: DESCRIPTION,
    url: SITE,
    siteName: "Ray Malik · MuffinByteLabs",
    type: "website",
    locale: "en_US",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "MuffinByteLabs — PCB design" }],
  },
  twitter: {
    card: "summary_large_image",
    title: SHARE_TITLE,
    description: DESCRIPTION,
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0d0c0b",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    /* suppressHydrationWarning: the inline script below stamps data-js on
       <html> before React hydrates, and React should not fight it */
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${instrument.variable} antialiased`}
      >
        {/* The .reveal sections hide themselves and wait for JavaScript to
            scroll them in. This stamp is the proof JS actually runs: the
            hidden state in globals.css is scoped to html[data-js], so a
            blocked bundle (ad-blocker, proxy, old browser) degrades to a
            fully visible page instead of blank space below the hero. */}
        <script dangerouslySetInnerHTML={{ __html: 'document.documentElement.dataset.js="1"' }} />
        <div
          dangerouslySetInnerHTML={{
            __html:
              "<!-- You found the debug port. Nice. -->",
          }}
        />
        <ClientLayout>{children}</ClientLayout>
        {/* Cloudflare Web Analytics: visit and page-view counts, with no
            cookies and no tracking of individual visitors. The numbers are
            in the Cloudflare dashboard under Analytics → Web analytics. The
            token only says which site a page view belongs to; it is public
            by design. Cloudflare's own snippet uses type="module"; defer
            runs this script at the same point (once the page is parsed) and
            keeps Next's sync-script lint rule quiet. Page changes inside the
            site count too: the beacon follows history.pushState by default.
            Production builds only, so browsing the local dev server never
            counts as a visit. */}
        {process.env.NODE_ENV === "production" && (
          <script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon='{"token": "cd0e864fa7c04980abfb9fe8abbeb1b8"}'
          />
        )}
      </body>
    </html>
  );
}
