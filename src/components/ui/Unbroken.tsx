/* ════════════════════════════════════════════════════════════════════════
   Heading text in which a hyphenated word never breaks at its hyphen.

   Browsers treat a hyphen as a legal line break, so a narrow card turns
   "Wi-Fi" into "Wi-" / "Fi" and "power-path" into "power-" / "path". Each
   hyphenated word is wrapped so it moves to the next line whole.
   ════════════════════════════════════════════════════════════════════════ */
export default function Unbroken({ children }: { children: string }) {
  return (
    <>
      {children.split(" ").map((word, i) => (
        <span key={i}>
          {i > 0 && " "}
          {word.includes("-") ? <span className="whitespace-nowrap">{word}</span> : word}
        </span>
      ))}
    </>
  );
}
