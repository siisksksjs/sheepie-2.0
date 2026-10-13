import Image from "next/image";

import { ButtonLink } from "@/components/site/button";
import site from "@/components/site/site.module.css";
import type { Locale } from "@/i18n/config";
import { productPath } from "@/lib/catalog";
import { homeCopy } from "@/lib/site/home-copy";

import styles from "./home.module.css";

export function HomeHero({ locale }: { locale: Locale }) {
  const t = homeCopy[locale].hero;

  return (
    <section id="hero" className={styles.hero} data-section="hero">
      <Image src="/images/edited/DSC01316.JPG" alt={t.alt} fill priority sizes="100vw" className={styles.heroImg} />
      <div className={styles.heroCopy}>
        <div className={site.shell}>
          <h1>{t.title}</h1>
          <p>{t.sub}</p>
          <div className={styles.ctas}>
            <ButtonLink href={productPath(locale, "cervicloud")} variant="cream">{t.cervi}</ButtonLink>
            <ButtonLink href={productPath(locale, "lumicloud")} variant="lineLight">{t.lumi}</ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
