import Image from "next/image";

import { ButtonLink } from "@/components/site/button";
import { FadeIn } from "@/components/site/fade-in";
import { Mendung } from "@/components/site/mendung";
import site from "@/components/site/site.module.css";
import type { Locale } from "@/i18n/config";
import { productPath } from "@/lib/catalog";
import { homeCopy } from "@/lib/site/home-copy";

import styles from "./home.module.css";

/** CerviCloud's daylight band. */
export function FeatureBand({ locale }: { locale: Locale }) {
  const t = homeCopy[locale].cervi;

  return (
    <section className={styles.cervi} data-section="cervicloud">
      <Mendung tone="white" />
      <div className={`${site.shell} ${styles.bandIn}`}>
        <FadeIn className={styles.stack}>
          <div className={styles.stackBig}>
            <Image src="/images/edited/DSC01139.JPG" alt="" fill sizes="(max-width: 760px) 90vw, 560px" className={styles.cover} />
          </div>
          <div className={styles.stackSmall}>
            <Image src="/brand/icesilk.jpg" alt="" fill sizes="(max-width: 760px) 42vw, 280px" className={styles.cover} />
          </div>
        </FadeIn>
        <FadeIn index={1} className={styles.feature}>
          <h2>{t.title}</h2>
          <p className={styles.lead}>{t.lead}</p>
          <div className={styles.feat}>
            {t.features.map(([title, body]) => (
              <div key={title}><b>{title}</b>{body}</div>
            ))}
          </div>
          <ButtonLink href={productPath(locale, "cervicloud")} variant="ink">{t.cta}</ButtonLink>
        </FadeIn>
      </div>
    </section>
  );
}
