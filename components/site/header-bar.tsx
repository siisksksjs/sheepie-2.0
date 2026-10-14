// components/site/header-bar.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type MouseEvent } from "react";

import type { Locale } from "@/i18n/config";
import type { ProductSlug } from "@/lib/catalog/types";
import { localeHref, siteCopy } from "@/lib/site/copy";

import { buttonClass } from "./button";
import styles from "./header.module.css";
import { LambMark } from "./lamb-mark";
import { LanguageToggle } from "./language-toggle";
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
  const triggerRef = useRef<HTMLElement | null>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const openPanel = (next: Exclude<Panel, null>) => (event: MouseEvent<HTMLButtonElement>) => {
    triggerRef.current = event.currentTarget;
    setPanel(next);
  };

  useEffect(() => {
    if (!panel) return;
    const trigger = triggerRef.current;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPanel(null);
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = sheetRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || !sheetRef.current?.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !sheetRef.current?.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
      trigger?.focus();
    };
  }, [panel]);

  const pages = [
    { href: localeHref(locale, "/about"), label: t.nav.story },
    { href: localeHref(locale, "/blog"), label: t.nav.journal },
    { href: localeHref(locale, "/faq"), label: t.nav.faq },
    { href: localeHref(locale, "/contact"), label: t.nav.contact },
  ];

  return (
    <>
      {/* Menu on the left, the logo centred, language and shop on the right, at every width. */}
      <div className={styles.bar}>
        <button type="button" className={styles.menuBtn} aria-label={t.nav.menu} data-panel-trigger="menu" aria-haspopup="dialog" aria-expanded={panel === "menu"} onClick={openPanel("menu")}>
          <span />
          <b>{t.nav.menu}</b>
        </button>
        <Link href={localeHref(locale, "/")} className={styles.brand} aria-label="Sheepie">
          <LambMark size={46} breathe />
          <span>Sheepie.</span>
        </Link>
        <div className={styles.actions}>
          <LanguageToggle locale={locale} className={styles.toggle} />
          <button type="button" className={styles.shopBtn} data-panel-trigger="shop" aria-haspopup="dialog" aria-expanded={panel === "shop"} onClick={openPanel("shop")}>
            {t.nav.shop}
          </button>
        </div>
      </div>

      {panel && (
        <>
          <div className={styles.scrim} onClick={() => setPanel(null)} />
          <div ref={sheetRef} className={styles.sheet} data-side={panel === "menu" ? "left" : "right"} role="dialog" aria-modal="true" aria-label={panel === "shop" ? t.shopPanel.title : t.nav.menu}>
            <div className={styles.sheetHead}>
              <h2>{panel === "shop" ? t.shopPanel.title : t.nav.menu}</h2>
              <button ref={closeRef} type="button" className={styles.close} onClick={() => setPanel(null)}>{t.nav.close}</button>
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
                <nav className={styles.menuProducts} aria-label={t.nav.allProducts}>
                  {shopItems.map((item) => (
                    <Link key={item.slug} href={localeHref(locale, `/products/${item.slug}`)} onClick={() => setPanel(null)}>
                      <span className={styles.menuThumb}>
                        <Image src={item.image} alt="" fill sizes="64px" style={{ objectFit: "cover" }} />
                      </span>
                      <span>
                        <b>{item.name}</b>
                        <small>{item.price}</small>
                      </span>
                    </Link>
                  ))}
                  <Link className={styles.menuAll} href={localeHref(locale, "/products")} onClick={() => setPanel(null)}>{t.nav.allProducts} →</Link>
                </nav>
                <nav className={styles.menuLinks}>
                  {pages.map((link) => (
                    <Link key={link.href} href={link.href} onClick={() => setPanel(null)}>{link.label}</Link>
                  ))}
                </nav>
                <LanguageToggle locale={locale} className={`${styles.toggle} ${styles.toggleLarge}`} />
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}
