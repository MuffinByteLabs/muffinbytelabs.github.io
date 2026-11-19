"use client";

import { useMemo, useState } from "react";
import Icon from "@/components/ui/Icon";
import { GLOSSARY, TERM_COUNT } from "./terms";

/* ════════════════════════════════════════════════════════════════════════
   The glossary, with a filter. With the box empty (which is how the page
   is built and served) every term is in the HTML, so search engines and
   AI assistants read all of it; the filter only hides terms as you type.
   ════════════════════════════════════════════════════════════════════════ */

export default function Glossary() {
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();

  const groups = useMemo(() => {
    if (!query) return GLOSSARY;
    return GLOSSARY.map((g) => ({
      ...g,
      terms: g.terms.filter((t) => `${t.term} ${t.also ?? ""} ${t.def}`.toLowerCase().includes(query)),
    })).filter((g) => g.terms.length > 0);
  }, [query]);

  const shown = groups.reduce((n, g) => n + g.terms.length, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="card card-static tl-panel tl-gloss-bar">
        <label className="tl-search">
          <Icon name="search" size={16} />
          <span className="sr-only">Find a term</span>
          <input
            type="search"
            className="tl-input"
            placeholder={`Find a term, e.g. "Gerber" or "BOM"`}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
        <nav aria-label="Groups" className="tl-gloss-nav">
          {GLOSSARY.map((g) => (
            <a key={g.id} href={`#${g.id}`} className="chip">
              {g.title}
            </a>
          ))}
        </nav>
        <p className="tl-hint m-0" aria-live="polite">
          {query ? `${shown} of ${TERM_COUNT} terms match.` : `${TERM_COUNT} terms in ${GLOSSARY.length} groups.`}
        </p>
      </div>

      {groups.length === 0 && <p className="tl-empty">No term matches &ldquo;{q}&rdquo;. Try a shorter word.</p>}

      {groups.map((g) => (
        <section key={g.id} id={g.id} className="tl-gloss-group" aria-labelledby={`${g.id}-h`}>
          <div className="tl-gloss-head">
            <h2 id={`${g.id}-h`} className="display">
              {g.title}
            </h2>
            <p>{g.lede}</p>
          </div>
          <dl className="tl-gloss-list">
            {g.terms.map((t) => (
              <div key={t.id} id={t.id} className="tl-gloss-term">
                <dt>
                  <a href={`#${t.id}`} className="tl-gloss-anchor" aria-label={`Link to ${t.term}`}>
                    #
                  </a>
                  {t.term}
                  {t.also && <span className="tl-gloss-also">{t.also}</span>}
                </dt>
                <dd>{t.def}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}
