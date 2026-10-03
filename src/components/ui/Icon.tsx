/* ════════════════════════════════════════════════════════════════════════
   One small inline icon set, drawn on a 24-unit grid with a 1.6 stroke so
   every glyph on the site has the same weight. Inlined rather than pulled
   from a package: the site loads no third-party assets, and this is less
   code than the import would be.
   ════════════════════════════════════════════════════════════════════════ */

const PATHS = {
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  arrowLeft: <path d="M19 12H5M11 18l-6-6 6-6" />,
  arrowDown: <path d="M12 5v14M6 13l6 6 6-6" />,
  arrowUpRight: <path d="M7 17 17 7M8.5 7H17v8.5" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  menu: <path d="M4 7.5h16M4 12h16M4 16.5h16" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </>
  ),
  cpu: (
    <>
      <rect x="6.5" y="6.5" width="11" height="11" rx="1.8" />
      <rect x="10" y="10" width="4" height="4" rx="0.6" />
      <path d="M9.5 2.5v4M14.5 2.5v4M9.5 17.5v4M14.5 17.5v4M2.5 9.5h4M2.5 14.5h4M17.5 9.5h4M17.5 14.5h4" />
    </>
  ),
  bolt: <path d="M13 2.5 4.5 13.5H11l-1 8 8.5-11.5H12l1-7.5Z" />,
  shield: (
    <>
      <path d="M12 3l7.5 3v5.5c0 4.5-3.2 8.3-7.5 9.5-4.3-1.2-7.5-5-7.5-9.5V6L12 3Z" />
      <path d="m9 12 2 2 4-4.2" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 12.5 9 5 9-5M3 16.5l9 5 9-5" />
    </>
  ),
  package: (
    <>
      <path d="m21 7.5-9-5-9 5v9l9 5 9-5v-9Z" />
      <path d="m3 7.5 9 5 9-5M12 12.5v9M7.5 5l9 5" />
    </>
  ),
  schematic: <path d="M2.5 12h3.5l1.6-3.6 3 7.2 3-7.2 3 7.2 1.4-3.6h3.5" />,
  isolation: (
    <>
      <path d="M10.5 3v18M13.5 3v18" strokeDasharray="2.2 2.2" />
      <path d="M3 7.5h4.5M3 12h4.5M3 16.5h4.5M16.5 7.5H21M16.5 12H21M16.5 16.5H21" />
    </>
  ),
  cube: (
    <>
      <path d="m12 2.5 8.5 4.75v9.5L12 21.5l-8.5-4.75v-9.5L12 2.5Z" />
      <path d="M12 21.5V12M20.5 7.25 12 12 3.5 7.25" />
    </>
  ),
  map: (
    <>
      <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z" />
      <path d="M9 4v14M15 6v14" />
    </>
  ),
  pulse: <path d="M2.5 12h4l2.5-6 4.5 12 2.5-6h5.5" />,
  gauge: (
    <>
      <path d="M4.6 18.5a9 9 0 1 1 14.8 0" />
      <path d="m12 14 4.2-4.2" />
      <circle cx="12" cy="14" r="1.2" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.2 2" />
    </>
  ),
  file: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
      <path d="M14 3v5h5M8.5 13h7M8.5 16.5h5" />
    </>
  ),
  folder: <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />,
  plug: <path d="M9 2.5v5M15 2.5v5M6 7.5h12v3a6 6 0 0 1-12 0v-3ZM12 16.5v5" />,
  bus: (
    <>
      <path d="M3 9h18M3 15h18" />
      <path d="M7 9v6M12 9v6M17 9v6" />
    </>
  ),
  gate: (
    <>
      <path d="M5 5.5h6.5a6.5 6.5 0 0 1 0 13H5v-13Z" />
      <path d="M18 12h3.5M1.5 9H5M1.5 15H5" />
    </>
  ),
  thermo: <path d="M14 14.6V5a2 2 0 0 0-4 0v9.6a4 4 0 1 0 4 0Z" />,
  wrench: <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4 2.6-2.6Z" />,
  eye: (
    <>
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  board: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <path d="M7 9h4l2 2h4M7 15h3l2-2h5" />
      <circle cx="7" cy="9" r="0.9" />
      <circle cx="7" cy="15" r="0.9" />
    </>
  ),
  relay: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M7 15v-3.5h3M14 9.5l3-1.5M14 9.5v5h3" />
    </>
  ),
  rss: (
    <>
      <path d="M5 11a8 8 0 0 1 8 8M5 5a14 14 0 0 1 14 14" />
      <circle cx="6" cy="18" r="1.4" />
    </>
  ),
  external: <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />,
  spark: <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" />,
  terminal: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
      <path d="m7 10 3 2.5L7 15M12.5 15H17" />
    </>
  ),
  flag: <path d="M5 21V4M5 4.5h11l-2 3.5 2 3.5H5" />,
  download: <path d="M12 4v11M7 10.5l5 5 5-5M4.5 19.5h15" />,
  copy: (
    <>
      <rect x="8.5" y="8.5" width="12" height="12" rx="2.2" />
      <path d="M15.5 8.5V5.7a2.2 2.2 0 0 0-2.2-2.2H5.7a2.2 2.2 0 0 0-2.2 2.2v7.6a2.2 2.2 0 0 0 2.2 2.2h2.8" />
    </>
  ),
  flip: <path d="M4 9.5a8 8 0 0 1 14.5-3.2M20 14.5a8 8 0 0 1-14.5 3.2M18.8 2.8v3.7h-3.7M5.2 21.2v-3.7h3.7" />,
} as const;

export type IconName = keyof typeof PATHS;

export default function Icon({
  name,
  size = 18,
  className,
  strokeWidth = 1.6,
  title,
}: {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
  /** only when the icon carries meaning on its own; otherwise it is decoration */
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ flexShrink: 0, display: "block" }}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      focusable="false"
    >
      {title && <title>{title}</title>}
      {PATHS[name]}
    </svg>
  );
}
