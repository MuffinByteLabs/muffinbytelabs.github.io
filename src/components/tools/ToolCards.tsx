import Link from "next/link";
import Icon from "@/components/ui/Icon";

/* A row of tool cards: an icon, the name, one line, and the way in. */
export default function ToolCards({
  tools,
  className = "",
}: {
  tools: { path: string; name: string; blurb: string; icon: Parameters<typeof Icon>[0]["name"] }[];
  className?: string;
}) {
  return (
    <ul className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 m-0 p-0 list-none ${className}`}>
      {tools.map((t) => (
        <li key={t.path}>
          <Link href={t.path} className="card card-link group flex h-full flex-col p-6">
            <span className="tl-card-icon" aria-hidden>
              <Icon name={t.icon} size={20} />
            </span>
            <span className="mt-4 text-[16px] font-semibold leading-snug tracking-[-0.014em]" style={{ color: "var(--text)" }}>
              {t.name}
            </span>
            <span className="mt-2 text-[13.5px] leading-6" style={{ color: "var(--text-2)" }}>
              {t.blurb}
            </span>
            <span className="mt-auto pt-5 inline-flex items-center gap-1.5 text-[13px]" style={{ color: "var(--text-3)" }}>
              Open
              <span className="transition-transform group-hover:translate-x-1" style={{ color: "var(--accent)" }}>
                <Icon name="arrowRight" size={14} />
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
