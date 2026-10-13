// components/pdp/voucher-line.tsx
"use client";

import { useState } from "react";

import styles from "./pdp.module.css";

export function VoucherLine({ code, label, copy, copied }: { code: string; label: string; copy: string; copied: string }) {
  const [done, setDone] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setDone(true);
      setTimeout(() => setDone(false), 2000);
    } catch {
      // Clipboard blocked: the code is visible to copy by hand.
    }
  };

  return (
    <div className={styles.voucher}>
      <span>{label} <code>{code}</code></span>
      <button type="button" onClick={onCopy} aria-live="polite">{done ? copied : copy}</button>
    </div>
  );
}
