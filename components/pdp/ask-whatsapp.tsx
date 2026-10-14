// components/pdp/ask-whatsapp.tsx
"use client";

import { WhatsAppIcon } from "@/components/site/whatsapp-icon";
import type { Locale } from "@/i18n/config";
import { whatsappGreeting, whatsappUrl } from "@/lib/site/whatsapp";

import { useSelectedOption } from "./option-context";
import styles from "./pdp.module.css";

/** "Have a question?" link that opens WhatsApp with the product and the shopper's choice filled in. */
export function AskWhatsApp({ locale, showOption }: { locale: Locale; showOption: boolean }) {
  const { name, option, bundle, bundlePicked } = useSelectedOption();
  const detail = [showOption ? option.label : null, bundlePicked && bundle ? bundle.label : null].filter(Boolean).join(", ") || null;
  const href = whatsappUrl(whatsappGreeting(locale, { name, detail }));

  return (
    <a className={styles.ask} href={href} target="_blank" rel="noopener noreferrer" data-whatsapp="pdp">
      <WhatsAppIcon size={20} />
      <span>
        {locale === "id" ? "Ada pertanyaan?" : "Have a question?"} <b>{locale === "id" ? "Chat kami di WhatsApp" : "Chat us on WhatsApp"}</b>
      </span>
    </a>
  );
}
