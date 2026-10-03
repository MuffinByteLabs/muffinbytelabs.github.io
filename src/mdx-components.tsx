import type { MDXComponents } from "mdx/types";

/* Article typography: one family for the reading, the serif for section
   heads, a generous measure, and quiet rules. */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: () => null,
    h2: ({ children }) => (
      <h2
        className="display text-[1.75rem] sm:text-[2.05rem] mt-16 mb-5 flex items-baseline gap-3"
        style={{ color: "var(--text)" }}
      >
        <span aria-hidden className="inline-block w-5 h-px translate-y-[-0.35em] shrink-0" style={{ background: "var(--accent)" }} />
        <span>{children}</span>
      </h2>
    ),
    h3: ({ children }) => (
      <h3
        className="text-lg sm:text-xl font-semibold mt-11 mb-3 leading-snug tracking-[-0.014em]"
        style={{ color: "var(--text)" }}
      >
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="text-[16.5px] leading-[1.85] mb-6" style={{ color: "var(--text-2)" }}>
        {children}
      </p>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        className="underline underline-offset-4 decoration-1 transition-colors hover:decoration-2"
        style={{ color: "var(--accent-bright)", textDecorationColor: "rgba(219,166,75,0.45)" }}
      >
        {children}
      </a>
    ),
    code: ({ children }) => (
      <code
        className="px-1.5 py-0.5 rounded-md text-[13.5px] font-mono"
        style={{ background: "var(--surface-2)", color: "var(--text)", border: "1px solid var(--border)" }}
      >
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre
        className="rounded-2xl p-5 sm:p-6 overflow-x-auto mb-8 font-mono text-[13px] leading-6 [&_code]:border-0 [&_code]:bg-transparent [&_code]:p-0"
        style={{ background: "#0a0908", color: "#e4ddd0", border: "1px solid var(--border)", boxShadow: "var(--shadow)" }}
      >
        {children}
      </pre>
    ),
    ul: ({ children }) => (
      <ul
        className="list-disc pl-6 text-[16.5px] leading-[1.85] space-y-2 mb-6 marker:text-[color:var(--accent)]"
        style={{ color: "var(--text-2)" }}
      >
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol
        className="list-decimal pl-6 text-[16.5px] leading-[1.85] space-y-2 mb-6 marker:text-[color:var(--accent)] marker:font-mono marker:text-[13px]"
        style={{ color: "var(--text-2)" }}
      >
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="pl-1.5">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote
        className="my-9 pl-6 py-1 text-[17px] leading-8 [&_p]:text-[17px] [&_p]:text-[color:var(--text)]"
        style={{ borderLeft: "2px solid var(--accent)", color: "var(--text)" }}
      >
        {children}
      </blockquote>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold" style={{ color: "var(--text)" }}>
        {children}
      </strong>
    ),
    hr: () => <hr className="my-14 border-0 h-px" style={{ background: "var(--border)" }} />,
    ...components,
  };
}
