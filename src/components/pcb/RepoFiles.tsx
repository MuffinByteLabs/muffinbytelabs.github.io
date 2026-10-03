import GitHubMark from "./GitHubMark";
import Icon from "@/components/ui/Icon";
import { REPO, REPO_TREE, REPO_READS } from "./pcbData";

/* ════════════════════════════════════════════════════════════════════════
   PCB 1's "Files" tab — the public repository, without leaving the card.

   Left: what is in it, folder by folder. Right: the documents worth opening
   first, each a deep link that opens in the browser — "it's in there
   somewhere" persuades nobody.

   Server-rendered: static prose and outbound links.
   ════════════════════════════════════════════════════════════════════════ */
export default function RepoFiles() {
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
      {/* ── the repo bar ───────────────────────────────────────────────── */}
      <div
        className="px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3"
        style={{ borderBottom: "1px solid var(--border-soft)", background: "var(--surface-2)" }}
      >
        <span className="flex items-center gap-3 min-w-0">
          <span style={{ color: "var(--text)" }}>
            <GitHubMark size={20} />
          </span>
          <span className="font-mono text-[13.5px] truncate" style={{ color: "var(--text)" }}>
            <span style={{ color: "var(--text-3)" }}>{REPO.owner}/</span>
            {REPO.name}
          </span>
        </span>
        <a href={REPO.url} target="_blank" rel="noopener noreferrer" className="btn btn-light btn-sm">
          View on GitHub
          <Icon name="arrowUpRight" size={14} className="nudge-diag" />
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* ── what is in it ─────────────────────────────────────────────── */}
        <div className="px-4 sm:px-6 py-5" style={{ background: "var(--bg-alt)" }}>
          <h4 className="eyebrow m-0">In the repository</h4>
          <ul className="mt-3 m-0 p-0 list-none">
            {REPO_TREE.map((d, i) => (
              <li key={d.path} style={i > 0 ? { borderTop: "1px solid var(--border-soft)" } : undefined}>
                <a
                  href={`${REPO.url}/tree/main/${d.path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group grid grid-cols-[20px_minmax(0,1fr)] gap-3 py-3"
                >
                  <span className="mt-0.5" style={{ color: "var(--accent)" }}>
                    <Icon name="folder" size={17} />
                  </span>
                  <span className="min-w-0">
                    <span
                      className="font-mono text-[13px] group-hover:underline underline-offset-4"
                      style={{ color: "var(--text)" }}
                    >
                      {d.name}
                    </span>
                    <span className="block mt-0.5 text-[12.5px] leading-[1.6]" style={{ color: "var(--text-2)" }}>
                      {d.note}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* ── open it in the browser ────────────────────────────────────── */}
        <div
          className="px-4 sm:px-6 py-5 border-t lg:border-t-0 lg:border-l"
          style={{ borderColor: "var(--border-soft)", background: "var(--surface)" }}
        >
          <h4 className="eyebrow m-0">Open in the browser &middot; nothing to install</h4>
          <ul className="mt-3 m-0 p-0 list-none space-y-1.5">
            {REPO_READS.map((r) => (
              <li key={r.path}>
                <a
                  href={`${REPO.url}/${r.path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-[color:var(--surface-2)]"
                >
                  <span style={{ color: "var(--text-3)" }}>
                    <Icon name="file" size={16} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13.5px] font-medium leading-5 link-gold">{r.label}</span>
                    <span className="block text-[12px] leading-5 truncate" style={{ color: "var(--text-3)" }}>
                      {r.note}
                    </span>
                  </span>
                  <span
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    style={{ color: "var(--text-3)" }}
                  >
                    <Icon name="arrowUpRight" size={14} />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
