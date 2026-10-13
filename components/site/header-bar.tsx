// components/site/header-bar.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import type { Locale } from "@/i18n/config";
import type { ProductSlug } from "@/lib/catalog/types";
import { localeHref, siteCopy } from "@/lib/site/copy";

import { buttonClass } from "./button";
import styles from "./header.module.css";
import { LambMark } from "./lamb-mark";
import { LanguageSwitch } from "./language-switch";
import { MarketplaceLink } from "./marketplace-link";

export type ShopItem = {
  slug: ProductSlug;
  name: string;
  image: string;
  price: string;
  optionKey: string;
  value: number;
  shopeeUrl: string;
  tokopediaUrl: string;
};

type Panel = "menu" | "shop" | null;

export function HeaderBar({ locale, shopItems }: { locale: Locale; shopItems: ShopItem[] }) {
  const t = siteCopy[locale];
  const [panel, setPanel] = useState<Panel>(null);

  useEffect(() => {
    if (!panel) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPanel(null);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [panel]);

  const links = [
    { href: localeHref(locale, "/products/cervicloud"), label: t.nav.pillow },
    { href: localeHref(locale, "/products/lumicloud"), label: t.nav.mask },
    { href: localeHref(locale, "/products/calmicloud"), label: t.nav.earplug },
  ];
  const secondary = [
    { href: localeHref(locale, "/about"), label: t.nav.story },
    { href: localeHref(locale, "/blog"), label: t.nav.journal },
  ];

  return (
    <>
      <div className={styles.bar}>
        <button type="button" className={styles.menuBtn} aria-label={t.nav.menu} data-panel-trigger="menu" onClick={() => setPanel("menu")}>
          <span />
        </button>
        <nav className={`${styles.nav} ${styles.navLeft}`}>
          {links.map((link) => (
            <Link key={link.href} href={link.href}>{link.label}</Link>
          ))}
        </nav>
        <Link href={localeHref(locale, "/")} className={styles.brand} aria-label="Sheepie">
          <LambMark size={46} breathe />
          <span>Sheepie.</span>
        </Link>
        <nav className={`${styles.nav} ${styles.navRight}`}>
          {secondary.map((link) => (
            <Link key={link.href} href={link.href}>{link.label}</Link>
          ))}
          <button type="button" className={styles.shopBtn} data-panel-trigger="shop" onClick={() => setPanel("shop")}>
            {t.nav.shop}
          </button>
        </nav>
      </div>

      {panel && (
        <>
          <div className={styles.scrim} onClick={() => setPanel(null)} />
          <div className={styles.sheet} role="dialog" aria-modal="true" aria-label={panel === "shop" ? t.shopPanel.title : t.nav.menu}>
            <div className={styles.sheetHead}>
              <h2>{panel === "shop" ? t.shopPanel.title : t.nav.menu}</h2>
              <button type="button" className={styles.close} onClick={() => setPanel(null)}>{t.nav.close}</button>
            </div>

            {panel === "shop" ? (
              <>
                <p className={styles.sheetNote}>{t.shopPanel.note}</p>
                {shopItems.map((item) => (
                  <div key={item.slug} className={styles.shopRow}>
                    <div className={styles.shopThumb}>
                      <Image src={item.image} alt="" fill sizes="72px" style={{ objectFit: "cover" }} />
                    </div>
                    <div>
                      <h3>{item.name}</h3>
                      <div>{item.price}</div>
                    </div>
                    <div className={styles.shopActions}>
                      <MarketplaceLink slug={item.slug} optionKey={item.optionKey} value={item.value} marketplace="shopee" href={item.shopeeUrl} placement="shop-panel" className={buttonClass("ink")}>
                        Shopee
                      </MarketplaceLink>
                      <MarketplaceLink slug={item.slug} optionKey={item.optionKey} value={item.value} marketplace="tokopedia" href={item.tokopediaUrl} placement="shop-panel" className={buttonClass("line")}>
                        Tokopedia
                      </MarketplaceLink>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <>
                <nav className={styles.menuLinks}>
                  {[...links, ...secondary, { href: localeHref(locale, "/faq"), label: t.nav.faq }, { href: localeHref(locale, "/contact"), label: t.nav.contact }].map((link) => (
                    <Link key={link.href} href={link.href} onClick={() => setPanel(null)}>{link.label}</Link>
                  ))}
                </nav>
                <LanguageSwitch locale={locale} className={styles.lang} />
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}
