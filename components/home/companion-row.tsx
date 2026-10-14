import Image from "next/image";
import Link from "next/link";

import { FadeIn } from "@/components/site/fade-in";
import type { Locale } from "@/i18n/config";
import { cerviCover, getProduct, productPath } from "@/lib/catalog";
import { formatIdr } from "@/lib/catalog/price";
import { siteCopy } from "@/lib/site/copy";
import { homeCopy } from "@/lib/site/home-copy";

import styles from "./home.module.css";

export function CompanionRow({ locale }: { locale: Locale }) {
  const t = homeCopy[locale].products;
  const calmi = getProduct("calmicloud", locale);
  const cover = cerviCover();
  const soldOut = siteCopy[locale].footer.soldOut;

  const tiles = [
    { key: "calmicloud", soldOut: false, href: productPath(locale, "calmicloud"), image: calmi.card.image, name: calmi.name, line: calmi.card.line, price: formatIdr(calmi.options[0].price) },
    { key: "cervicloud-case", soldOut: cover.soldOut, href: productPath(locale, "cervicloud"), image: cover.image, name: t.coverName, line: t.coverLine, price: formatIdr(cover.price) },
  ];

  return (
    <div className={styles.companions}>
      {tiles.map((tile, i) => {
        const body = (
          <>
            <div className={styles.miniImg}>
              <Image src={tile.image} alt="" fill sizes="96px" className={styles.cover} />
            </div>
            <div>
              <div className={styles.miniTag}>{t.companion}</div>
              <h3>{tile.name}</h3>
              <p>{tile.line}</p>
            </div>
            {tile.soldOut ? <div className={styles.miniSoldOut}>{soldOut}</div> : <div className={styles.miniPrice}>{tile.price}</div>}
          </>
        );
        return (
          <FadeIn key={tile.key} index={i + 2}>
            {tile.soldOut ? (
              <div className={`${styles.mini} ${styles.miniOff}`} data-companion={tile.key} data-sold-out="true">{body}</div>
            ) : (
              <Link href={tile.href} className={styles.mini} data-companion={tile.key}>{body}</Link>
            )}
          </FadeIn>
        );
      })}
    </div>
  );
}
