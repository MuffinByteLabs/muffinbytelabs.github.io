"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/ui/Icon";

/* ════════════════════════════════════════════════════════════════════════
   The address, one click to copy. A mailto link does nothing for anyone
   whose mail lives in a browser tab with no mail app registered — which
   is a lot of the people who would hire a freelancer. If the clipboard is
   unavailable (an old browser, an insecure context), it falls back to the
   mailto, so the button is never a dead end.
   ════════════════════════════════════════════════════════════════════════ */
export default function CopyEmail({ email, className = "" }: { email: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2200);
    return () => clearTimeout(t);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  return (
    <button type="button" onClick={copy} className={className} title="Copy the address">
      <Icon name={copied ? "check" : "copy"} size={15} />
      <span aria-live="polite">{copied ? "Copied to clipboard" : email}</span>
    </button>
  );
}
