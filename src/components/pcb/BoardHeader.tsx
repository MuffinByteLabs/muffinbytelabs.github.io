import Link from "next/link";
import GitHubMark from "./GitHubMark";
import Icon from "@/components/ui/Icon";
import Unbroken from "@/components/ui/Unbroken";
import type { Board } from "./pcbData";

/* ════════════════════════════════════════════════════════════════════════
   The top of a board panel: what it is, its key numbers, and where to
   read more. `BoardTitle` is the left half on its own, for a panel that
   lays out the rest differently.
   ════════════════════════════════════════════════════════════════════════ */
export function BoardTitle({ board }: { board: Board }) {
  return (
    <>
      <span className="eyebrow" style={{ color: "var(--accent)" }}>
        {board.id}
      </span>
      <h3 className="display mt-3 text-[2.15rem] sm:text-[2.7rem]" style={{ color: "var(--text)" }}>
        <Unbroken>{board.name}</Unbroken>
      </h3>
      <p className="mt-3 mb-0 text-[15.5px] leading-7 max-w-[60ch]" style={{ color: "var(--text-2)" }}>
        {board.summary}
      </p>
    </>
  );
}

export default function BoardHeader({ board }: { board: Board }) {
  return (
    <header className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] gap-x-12 gap-y-6">
      <div className="min-w-0">
        <BoardTitle board={board} />
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
