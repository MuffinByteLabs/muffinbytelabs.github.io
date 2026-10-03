/* ════════════════════════════════════════════════════════════════════════
   The one section heading on the site: a numbered kicker, a serif title,
   and an optional lede. Every section uses it, so the rhythm down the page
   is set in one place rather than re-typed per section.
   ════════════════════════════════════════════════════════════════════════ */
export default function SectionHead({
  index,
  label,
  title,
  lede,
  as: Tag = "h2",
  align = "left",
  className = "",
}: {
  /** "01" — the section number in gold */
  index?: string;
  label: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  as?: "h1" | "h2" | "h3";
  align?: "left" | "center";
  className?: string;
}) {
  const centered = align === "center";
  return (
    <div className={`${centered ? "text-center mx-auto" : ""} ${className}`}>
      <span className={`kicker ${centered ? "justify-center" : ""}`}>
        {index && <b>{index}</b>}
        <span className="rule" aria-hidden />
        {label}
      </span>
      <Tag
        className="display mt-4 text-[2.5rem] leading-[1.02] sm:text-[3.4rem]"
        style={{ color: "var(--text)" }}
      >
        {title}
      </Tag>
      {lede && (
        <p className={`lede mt-5 max-w-[62ch] ${centered ? "mx-auto" : ""}`}>{lede}</p>
      )}
    </div>
  );
}
