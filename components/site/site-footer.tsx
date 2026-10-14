import Link from "next/link";

import type { Locale } from "@/i18n/config";
import { productPath } from "@/lib/catalog";
import { localeHref, siteCopy, storeLinks } from "@/lib/site/copy";

import styles from "./footer.module.css";
import { LambMark } from "./lamb-mark";
import { LanguageSwitch } from "./language-switch";
import { Mendung } from "./mendung";
import { SocialIcon, type Social } from "./social-icon";
import site from "./site.module.css";

const SOCIALS: [Social, string][] = [
  ["shopee", "Shopee"],
  ["tokopedia", "Tokopedia"],
  ["instagram", "Instagram"],
  ["tiktok", "TikTok"],
];

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
            <li><span className={styles.soldOut}>{t.footer.cover}<small>{t.footer.soldOut}</small></span></li>
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
          <ul className={styles.socials}>
            {SOCIALS.map(([name, label]) => (
              <li key={name}>
                <a href={storeLinks[name]} target="_blank" rel="noopener noreferrer" aria-label={label} title={label} data-social={name}>
                  <SocialIcon name={name} />
                </a>
              </li>
            ))}
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
