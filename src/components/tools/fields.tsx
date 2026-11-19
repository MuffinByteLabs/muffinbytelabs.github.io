"use client";

import { useId } from "react";

/* ════════════════════════════════════════════════════════════════════════
   The tools' form pieces: one look for every input on every tool. Values
   stay strings while the visitor types (so "0." and "" are allowed mid-
   edit); each calculator parses them with num() from ./format.
   ════════════════════════════════════════════════════════════════════════ */

export function NumField({
  label,
  value,
  onChange,
  unit,
  hint,
  invalid,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  unit?: string;
  hint?: string;
  invalid?: boolean;
}) {
  const id = useId();
  return (
    <div className="tl-field">
      <label className="tl-label" htmlFor={id}>
        {label}
      </label>
      <div className="tl-num">
        <input
          id={id}
          className="tl-input mono"
          type="text"
          inputMode="decimal"
          autoComplete="off"
          spellCheck={false}
          value={value}
          aria-invalid={invalid || undefined}
          aria-describedby={hint ? `${id}-hint` : undefined}
          onChange={(e) => onChange(e.target.value)}
        />
        {unit && (
          <span className="tl-unit" aria-hidden>
            {unit}
          </span>
        )}
      </div>
      {hint && (
        <p id={`${id}-hint`} className="tl-hint">
          {hint}
        </p>
      )}
    </div>
  );
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  multiline,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  hint?: string;
}) {
  const id = useId();
  return (
    <div className="tl-field">
      <label className="tl-label" htmlFor={id}>
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          className="tl-input tl-textarea"
          rows={3}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input id={id} className="tl-input" type="text" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      )}
      {hint && <p className="tl-hint">{hint}</p>}
    </div>
  );
}

/** one choice out of a few, as a row of toggle buttons */
export function Seg<T extends string | number>({
  label,
  value,
  options,
  onChange,
  wrap,
}: {
  label: string;
  value: T;
  options: { id: T; label: string }[];
  onChange: (v: T) => void;
  wrap?: boolean;
}) {
  const id = useId();
  return (
    <div className="tl-field">
      <span className="tl-label" id={id}>
        {label}
      </span>
      <div className={`tl-seg ${wrap ? "tl-seg-wrap" : ""}`} role="group" aria-labelledby={id}>
        {options.map((o) => (
          <button key={String(o.id)} type="button" className="seg tl-seg-btn" aria-pressed={o.id === value} onClick={() => onChange(o.id)}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/** any number of choices, as chips; `single` makes it pick-one (and lets the
    picked chip be cleared) */
export function Chips({
  label,
  values,
  options,
  onChange,
  single,
}: {
  label: string;
  values: readonly string[];
  options: readonly string[];
  onChange: (v: string[]) => void;
  single?: boolean;
}) {
  const id = useId();
  return (
    <div className="tl-field">
      <span className="tl-label" id={id}>
        {label}
      </span>
      <div className="tl-chips" role="group" aria-labelledby={id}>
        {options.map((o) => {
          const on = values.includes(o);
          return (
            <button
              key={o}
              type="button"
              className="tl-chip"
              aria-pressed={on}
              onClick={() => onChange(single ? (on ? [] : [o]) : on ? values.filter((v) => v !== o) : [...values, o])}
            >
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** a headline number */
export function Stat({ label, value, unit, note, accent }: { label: string; value: string; unit?: string; note?: string; accent?: boolean }) {
  return (
    <div className={`tl-stat ${accent ? "tl-stat-accent" : ""}`}>
      <span className="tl-stat-label">{label}</span>
      <span className="tl-stat-value">
        <span className="display">{value}</span>
        {unit && <span className="tl-stat-unit">{unit}</span>}
      </span>
      {note && <span className="tl-stat-note">{note}</span>}
    </div>
  );
}

/** a label and a value, on one row */
export function Row({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="tl-row">
      <span className="tl-row-label">
        {label}
        {sub && <span className="tl-row-sub">{sub}</span>}
      </span>
      <span className="tl-row-value mono">{value}</span>
    </div>
  );
}

export function Warnings({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <ul className="tl-warn" role="status">
      {items.map((w) => (
        <li key={w}>{w}</li>
      ))}
    </ul>
  );
}
