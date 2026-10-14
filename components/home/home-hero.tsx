import Image from "next/image";
import Link from "next/link";

import { ButtonLink } from "@/components/site/button";
import site from "@/components/site/site.module.css";
import type { Locale } from "@/i18n/config";
import { localeHref } from "@/lib/site/copy";
import { homeCopy } from "@/lib/site/home-copy";

import styles from "./home.module.css";

/**
 * Editorial hero, one screen tall: type centred on the left, the portrait photo
 * filling the right half to the screen edge. In the voice of the original
 * sheepiesleep.com hero.
 */
export function HomeHero({ locale }: { locale: Locale }) {
  const t = homeCopy[locale].hero;
  // One short word is repeated so each half of the loop is wider than the marquee box.
  const phrase = `${Array(4).fill(t.marquee).join("\u00a0")}\u00a0`;

  return (
    <section id="hero" className={styles.hero} data-section="hero">
      <div className={styles.heroMedia}>
        <Image src="/images/hero/sleep-mask-pillow.webp" alt={t.alt} fill preload fetchPriority="high" sizes="(max-width: 760px) 100vw, 50vw" className={styles.heroImg} />
      </div>
      <div className={`${site.shell} ${styles.heroIn}`}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>{t.eyebrow}</p>
          <div className={styles.title}>
            <div className={styles.marquee} aria-hidden="true">
              <div className={styles.marqueeTrack}>
                <span>{phrase}</span>
                <span>{phrase}</span>
              </div>
            </div>
            <h1>
              {t.title[0]}
              <em>{t.title[1]}</em>
            </h1>
          </div>
          <p className={styles.heroSub}>
            {t.sub} <b>{t.subStrong}</b>
          </p>
          <div className={styles.ctas}>
            <ButtonLink href="#products" variant="ink">{t.explore}</ButtonLink>
            <Link className={styles.textLink} href={localeHref(locale, "/about")}>{t.story}</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
