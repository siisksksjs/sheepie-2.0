import Image from "next/image";
import Link from "next/link";

import { buttonClass } from "@/components/site/button";
import site from "@/components/site/site.module.css";
import type { Locale } from "@/i18n/config";
import { getProduct, productPath } from "@/lib/catalog";
import { homeCopy } from "@/lib/site/home-copy";

import styles from "./home.module.css";
import { LightsOutController } from "./lights-out-controller";

/** LumiCloud's night band: the page dims around it as it scrolls in. */
export function LightsOutBand({ locale }: { locale: Locale }) {
  const t = homeCopy[locale].lumi;
  const swatches = getProduct("lumicloud", locale).options.flatMap((o) => (o.swatch ? [o.swatch] : []));

  return (
    <section id="lights" className={styles.lights} data-section="lumicloud">
      <div className={styles.stick}>
        <div className={styles.sky} data-lights="sky" />
        <div className={`${styles.layer} ${styles.layerFar}`} data-lights="far" aria-hidden="true" />
        <div className={styles.layer} data-lights="near" aria-hidden="true" />
        <div className={`${site.shell} ${styles.lightsIn}`} data-lights="content">
          <div className={styles.feature}>
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
          </div>
          <div className={styles.lightsPh}>
            <Image src="/images/edited/DSC01058.JPG" alt="" fill sizes="(max-width: 760px) 90vw, 600px" className={styles.cover} />
          </div>
        </div>
      </div>
      <LightsOutController />
    </section>
  );
}
