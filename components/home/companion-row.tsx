import Image from "next/image";
import Link from "next/link";

import { FadeIn } from "@/components/site/fade-in";
import type { Locale } from "@/i18n/config";
import { findOption, getProduct, productPath } from "@/lib/catalog";
import { formatIdr } from "@/lib/catalog/price";
import { homeCopy } from "@/lib/site/home-copy";

import styles from "./home.module.css";

export function CompanionRow({ locale }: { locale: Locale }) {
  const t = homeCopy[locale].products;
  const calmi = getProduct("calmicloud", locale);
  const cover = findOption(getProduct("cervicloud", locale), "case");

  const tiles = [
    { key: "calmicloud", href: productPath(locale, "calmicloud"), image: calmi.card.image, name: calmi.name, line: calmi.card.line, price: formatIdr(calmi.options[0].price) },
    { key: "cervicloud-case", href: productPath(locale, "cervicloud", "case"), image: cover.image, name: t.coverName, line: t.coverLine, price: formatIdr(cover.price) },
  ];

  return (
    <div className={styles.companions}>
      {tiles.map((tile, i) => (
        <FadeIn key={tile.key} index={i + 2}>
          <Link href={tile.href} className={styles.mini} data-companion={tile.key}>
            <div className={styles.miniImg}>
              <Image src={tile.image} alt="" fill sizes="96px" className={styles.cover} />
            </div>
            <div>
              <div className={styles.miniTag}>{t.companion}</div>
              <h3>{tile.name}</h3>
              <p>{tile.line}</p>
            </div>
            <div className={styles.miniPrice}>{tile.price}</div>
          </Link>
        </FadeIn>
      ))}
    </div>
  );
}
