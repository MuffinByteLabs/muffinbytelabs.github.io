import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import ClientLayout from "@/components/ClientLayout";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MuffinManLabs — KiCad PCB Design",
  description:
    "Premium KiCad PCB design — five-plus years in the industry. Native KiCad 8–10 boards, pre-fab design reviews, and revisions, delivered as JLCPCB/PCBWay-ready packages with datasheet-grade documentation and a money-back guarantee.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} antialiased bg-[#0d0c11] text-[#d6d3cd]`}
      >
        <div
          dangerouslySetInnerHTML={{
            __html:
              "<!-- You found the debug port. Nice. -->",
          }}
        />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
