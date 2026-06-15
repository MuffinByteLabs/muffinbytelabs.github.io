import ScrambleText from "../ScrambleText";
import { PCB } from "./pcbData";

/** Shared section header: copper marker + mono eyebrow, Fraunces display h2, intro. */
export default function SectionHeading({
  eyebrow,
  title,
  gold = false,
  children,
}: {
  eyebrow: string;
  title: string;
  gold?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-12 sm:mb-14">
      <div className="flex items-center gap-3 mb-4">
        <span
          aria-hidden
          className="h-px w-7"
          style={{ background: `linear-gradient(90deg, ${PCB.copperBright}, transparent)` }}
        />
        <p className="font-mono text-xs tracking-[0.25em] uppercase" style={{ color: PCB.enig }}>
          {eyebrow}
        </p>
      </div>
      <h2
        className={`tracking-[-0.015em] leading-[1.05] ${
          gold ? "gold-text text-4xl sm:text-6xl font-bold" : "text-4xl sm:text-5xl font-semibold"
        }`}
        style={{ color: gold ? undefined : PCB.silk, fontFamily: "var(--font-fraunces), serif" }}
      >
        {gold ? title : <ScrambleText text={title} />}
      </h2>
      {children && (
        <p className="mt-5 text-base sm:text-lg leading-8 text-[#d6d3cd]/75 max-w-[60ch]">
          {children}
        </p>
      )}
    </div>
  );
}
