import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: () => null,
    h2: ({ children }) => (
      <h2
        className="text-xl font-semibold mt-12 mb-4 text-[#e0e0e0]"
        style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3
        className="text-lg font-semibold mt-8 mb-3 text-[#e0e0e0]/80"
        style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
      >
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="text-[#e0e0e0]/60 leading-relaxed mb-6 font-mono text-sm">
        {children}
      </p>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-[#f0d488] hover:text-[#f0d488]/80 underline underline-offset-4 decoration-[#d4af37]/30 transition-colors"
      >
        {children}
      </a>
    ),
    code: ({ children }) => (
      <code className="bg-[#15121c] text-[#e8a85c] px-1.5 py-0.5 rounded text-sm font-mono border border-[#eae6da]/10">
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre className="bg-[#100d16] border border-[#eae6da]/10 rounded-sm p-5 overflow-x-auto mb-6 font-mono text-sm">
        {children}
      </pre>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-inside text-[#e0e0e0]/60 space-y-2 mb-6 marker:text-[#d4af37]/50 font-mono text-sm">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside text-[#e0e0e0]/60 space-y-2 mb-6 marker:text-[#d4af37]/50 font-mono text-sm">
        {children}
      </ol>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-[#d4af37]/30 pl-5 italic text-[#e0e0e0]/40 my-8 font-mono text-sm">
        {children}
      </blockquote>
    ),
    strong: ({ children }) => (
      <strong className="text-[#e0e0e0] font-semibold">{children}</strong>
    ),
    ...components,
  };
}
