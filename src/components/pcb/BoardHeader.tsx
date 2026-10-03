import Link from "next/link";
import GitHubMark from "./GitHubMark";
import Icon from "@/components/ui/Icon";
import type { Board } from "./pcbData";

/* ════════════════════════════════════════════════════════════════════════
   The top of a board panel: what it is, its key numbers, and where to
   read more. Shared by both boards so the two panels read as a pair.
   ════════════════════════════════════════════════════════════════════════ */
export default function BoardHeader({ board, index }: { board: Board; index: string }) {
  return (
    <header className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] gap-x-12 gap-y-6">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="mono text-[11px] tracking-[0.16em]" style={{ color: "var(--accent)" }}>
            {index}
          </span>
          <span className="eyebrow">{board.id}</span>
        </div>
        <h3 className="display mt-3 text-[2.15rem] sm:text-[2.7rem]" style={{ color: "var(--text)" }}>
          {/* a hyphenated word ("Wi-Fi", "ESP32-S3") never breaks at its hyphen */}
          {board.name.split(" ").map((word, i) => (
            <span key={i}>
              {i > 0 && " "}
              {word.includes("-") ? <span className="whitespace-nowrap">{word}</span> : word}
            </span>
          ))}
        </h3>
        <p className="mt-3 mb-0 text-[15.5px] leading-7 max-w-[60ch]" style={{ color: "var(--text-2)" }}>
          {board.summary}
        </p>
      </div>

      <div className="min-w-0 lg:pt-9 flex flex-col gap-5 lg:items-end">
        <ul className="flex flex-wrap lg:justify-end gap-2 m-0 p-0 list-none">
          {board.specs.map((sp) => (
            <li key={sp} className="chip chip-mono">
              {sp}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap lg:justify-end items-center gap-3">
          {board.caseStudy && (
            <Link href={board.caseStudy} className="btn btn-primary btn-sm">
              Read the case study
              <Icon name="arrowRight" size={15} className="nudge" />
            </Link>
          )}
          {board.repo && (
            <a
              href={board.repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-sm max-w-full"
            >
              <GitHubMark size={14} />
              {/* the owner segment is the first thing to go on a narrow phone */}
              <span className="font-mono min-w-0 truncate text-[12.5px]">
                <span className="hidden sm:inline" style={{ color: "var(--text-3)" }}>
                  {board.repo.owner}/
                </span>
                {board.repo.name}
              </span>
              <Icon name="arrowUpRight" size={14} className="nudge-diag" />
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
