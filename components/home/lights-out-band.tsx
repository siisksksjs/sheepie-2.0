import Image from "next/image";
import Link from "next/link";

import { buttonClass } from "@/components/site/button";
import { FadeIn } from "@/components/site/fade-in";
import site from "@/components/site/site.module.css";
import type { Locale } from "@/i18n/config";
import { getProduct, productPath } from "@/lib/catalog";
import { homeCopy } from "@/lib/site/home-copy";

import styles from "./home.module.css";

/** LumiCloud's night band: one screen, no scroll effect. */
export function LightsOutBand({ locale }: { locale: Locale }) {
  const t = homeCopy[locale].lumi;
  const swatches = getProduct("lumicloud", locale).options.flatMap((o) => (o.swatch ? [o.swatch] : []));

  return (
    <section id="lights" className={styles.lights} data-section="lumicloud">
      <div className={`${site.shell} ${styles.lightsIn}`}>
        <FadeIn className={styles.feature}>
          <h2>{t.title}</h2>
          <p className={styles.lead}>{t.lead}</p>
          <div className={styles.feat}>
            {t.features.map(([title, body]) => (
              <div key={title}><b>{title}</b>{body}</div>
            ))}
          </div>
          <div className={styles.swatches}>
            {swatches.map((swatch) => (
              <i key={swatch} aria-hidden="true" style={{ background: swatch }} />
            ))}
            {t.swatches}
          </div>
          <Link className={buttonClass("cream")} href={productPath(locale, "lumicloud")}>{t.cta}</Link>
        </FadeIn>
        <FadeIn index={1} className={styles.lightsPh}>
          <Image src="/images/edited/DSC01058.webp" alt="" fill sizes="(max-width: 760px) 90vw, 600px" className={styles.cover} />
        </FadeIn>
      </div>
    </section>
  );
}
