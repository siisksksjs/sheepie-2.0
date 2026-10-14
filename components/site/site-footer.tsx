import Link from "next/link";

import type { Locale } from "@/i18n/config";
import { productPath } from "@/lib/catalog";
import { localeHref, siteCopy, storeLinks } from "@/lib/site/copy";

import styles from "./footer.module.css";
import { LambMark } from "./lamb-mark";
import { LanguageSwitch } from "./language-switch";
import { Mendung } from "./mendung";
import site from "./site.module.css";

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = siteCopy[locale];

  return (
    <footer className={styles.footer} data-section="footer">
      <Mendung tone="sky" />
      <div className={`${site.shell} ${styles.grid}`}>
        <div>
          <LambMark size={84} className={styles.white} />
          <div className={styles.say}>{t.footer.goodnight}</div>
        </div>
        <div>
          <h4>{t.footer.shop}</h4>
          <ul>
            <li><Link href={productPath(locale, "cervicloud")}>CerviCloud Pillow</Link></li>
            <li><Link href={productPath(locale, "lumicloud")}>LumiCloud Eye Mask</Link></li>
            <li><Link href={productPath(locale, "calmicloud")}>CalmiCloud Earplugs</Link></li>
            <li><Link href={productPath(locale, "cervicloud", "case")}>{t.footer.cover}</Link></li>
          </ul>
        </div>
        <div>
          <h4>{t.footer.brand}</h4>
          <ul>
            <li><Link href={localeHref(locale, "/about")}>{t.nav.story}</Link></li>
            <li><Link href={localeHref(locale, "/blog")}>{t.nav.journal}</Link></li>
            <li><Link href={localeHref(locale, "/faq")}>{t.nav.faq}</Link></li>
            <li><Link href={localeHref(locale, "/contact")}>{t.nav.contact}</Link></li>
          </ul>
        </div>
        <div>
          <h4>{t.footer.find}</h4>
          <ul>
            <li><a href={storeLinks.shopee} target="_blank" rel="noopener noreferrer">Shopee</a></li>
            <li><a href={storeLinks.tokopedia} target="_blank" rel="noopener noreferrer">Tokopedia</a></li>
            <li><a href={storeLinks.instagram} target="_blank" rel="noopener noreferrer">Instagram</a></li>
            <li><a href={storeLinks.tiktok} target="_blank" rel="noopener noreferrer">TikTok</a></li>
          </ul>
        </div>
      </div>
      <div className={`${site.shell} ${styles.legal}`}>
        <span>{t.footer.rights}</span>
        <LanguageSwitch locale={locale} />
      </div>
    </footer>
  );
}
