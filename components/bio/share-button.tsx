"use client";

import { Share2 } from "lucide-react";
import { useState } from "react";

import styles from "./bio-page.module.css";

export type ShareOutcome = "shared" | "copied" | "cancelled" | "unsupported" | "failed";

export type ShareCapabilities = {
  share?: (data: ShareData) => Promise<void>;
  writeClipboard?: (value: string) => Promise<void>;
  copyWithDocument?: (value: string) => boolean;
};

const shareStatus: Record<ShareOutcome, string> = {
  shared: "Berhasil dibagikan.",
  copied: "Tautan berhasil disalin.",
  cancelled: "Berbagi dibatalkan.",
  unsupported: "Perangkat ini tidak mendukung berbagi otomatis.",
  failed: "Tautan belum dapat dibagikan. Silakan salin alamat halaman secara manual.",
};

export async function executeShare(
  url: string,
  capabilities: ShareCapabilities,
): Promise<ShareOutcome> {
  const data = {
    title: "Sheepie — Temukan Sistem Tidurmu",
    text: "Tiga lapisan istirahat untuk malam yang lebih utuh.",
    url,
  };
  let attempted = false;

  if (capabilities.share) {
    attempted = true;
    try {
      await capabilities.share(data);
      return "shared";
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return "cancelled";
    }
  }

  if (capabilities.writeClipboard) {
    attempted = true;
    try {
      await capabilities.writeClipboard(url);
      return "copied";
    } catch {
      // Continue to the DOM fallback when clipboard permissions are unavailable.
    }
  }

  if (capabilities.copyWithDocument) {
    attempted = true;
    try {
      if (capabilities.copyWithDocument(url)) return "copied";
    } catch {
      // Return an explicit failure message below.
    }
  }

  return attempted ? "failed" : "unsupported";
}

function copyWithHiddenTextarea(value: string): boolean {
  if (typeof document.execCommand !== "function") return false;

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.inset = "0 auto auto -9999px";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  try {
    return document.execCommand("copy");
  } finally {
    textarea.remove();
  }
}

export function ShareButton() {
  const [label, setLabel] = useState("Bagikan");
  const [status, setStatus] = useState("");

  async function sharePage() {
    const outcome = await executeShare(window.location.href, {
      share: navigator.share?.bind(navigator),
      writeClipboard: navigator.clipboard?.writeText.bind(navigator.clipboard),
      copyWithDocument: copyWithHiddenTextarea,
    });
    setStatus(shareStatus[outcome]);
    setLabel(outcome === "shared" ? "Dibagikan" : outcome === "copied" ? "Disalin" : "Bagikan");
  }

  return (
    <>
      <button
        type="button"
        className={styles.shareButton}
        onClick={sharePage}
        aria-label={status ? `Bagikan halaman bio Sheepie. ${status}` : "Bagikan halaman bio Sheepie"}
        title="Bagikan halaman"
        data-bio-cta="header_share"
        data-bio-destination="share"
        data-bio-section="bio-header"
        data-bio-position="header"
      >
        <Share2 size={17} aria-hidden="true" />
        <span>{label}</span>
      </button>
      <span className={styles.visuallyHidden} role="status" aria-live="polite">
        {status}
      </span>
    </>
  );
}
