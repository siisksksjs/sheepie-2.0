import type { Locale } from "@/i18n/config";
import { whatsappGreeting, whatsappUrl } from "@/lib/site/whatsapp";

import styles from "./site.module.css";
import { WhatsAppIcon } from "./whatsapp-icon";

/** Floating customer-service button, bottom right on every page. */
export function WhatsAppButton({ locale }: { locale: Locale }) {
  const label = locale === "id" ? "Chat Sheepie di WhatsApp" : "Chat with Sheepie on WhatsApp";
  return (
    <a className={styles.waFloat} href={whatsappUrl(whatsappGreeting(locale))} target="_blank" rel="noopener noreferrer" aria-label={label} title={label} data-whatsapp="float">
      <WhatsAppIcon size={28} />
    </a>
  );
}
