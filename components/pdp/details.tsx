// components/pdp/details.tsx
import Image from "next/image";

import { FadeIn } from "@/components/site/fade-in";
import { Mendung } from "@/components/site/mendung";
import type { Locale } from "@/i18n/config";
import type { Product } from "@/lib/catalog/types";
import { pdpCopy } from "@/lib/site/pdp-copy";

import styles from "./pdp.module.css";

export function AnatomyPanel({ product }: { product: Product; locale: Locale }) {
  const { anatomy } = product;
  const left = anatomy.points.slice(0, 2);
  const right = anatomy.points.slice(2);

  return (
    <section className={styles.block} data-section="anatomy">
      <FadeIn>
        <h2>{anatomy.title}</h2>
        <p className={styles.intro}>{anatomy.intro}</p>
      </FadeIn>
      <FadeIn index={1} className={styles.anatomy}>
        <Mendung tone="white" />
        <div className={styles.anatIn}>
          <ol className={styles.call}>
            {left.map((point, i) => (
              <li key={point.title}><b><i>{i + 1}</i>{point.title}</b>{point.body}</li>
            ))}
          </ol>
          <div className={styles.stage} data-cutout={anatomy.cutout || undefined}>
            <Image src={anatomy.image} alt={product.name} fill sizes="(max-width: 760px) 90vw, 460px" className={styles.cover} />
            {anatomy.points.map((point, i) => (
              <span key={point.title} className={styles.pin} style={{ left: `${point.x}%`, top: `${point.y}%` }} aria-hidden="true">{i + 1}</span>
            ))}
          </div>
          <ol className={styles.call} start={3}>
            {right.map((point, i) => (
              <li key={point.title}><b><i>{i + 3}</i>{point.title}</b>{point.body}</li>
            ))}
          </ol>
        </div>
      </FadeIn>
    </section>
  );
}

export function FitGrid({ product, locale }: { product: Product; locale: Locale }) {
  const t = pdpCopy[locale];

  return (
    <section className={styles.block} data-section="fit">
      <FadeIn><h2>{product.fit.title}</h2></FadeIn>
      <div className={styles.fit}>
        {product.fit.items.map((item, i) => (
          <FadeIn key={item.title} index={i}>
            <div className={styles.fitCard} data-fits={String(item.fits)}>
              <span className={styles.fitMark}>{item.fits ? `✓ ${t.fits}` : `— ${t.notFit}`}</span>
              <div>
                <b>{item.title}</b>
                <p>{item.body}</p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

export function CompareTable({ product }: { product: Product; locale: Locale }) {
  return (
    <section className={styles.block} data-section="compare">
      <FadeIn><h2>{product.compare.title}</h2></FadeIn>
      <FadeIn index={1}>
        <table className={styles.compare}>
          <thead>
            <tr><th scope="col"><span hidden>—</span></th><th scope="col">{product.name}</th><th scope="col">{product.compare.theirs}</th></tr>
          </thead>
          <tbody>
            {product.compare.rows.map((row) => (
              <tr key={row.label}><th scope="row">{row.label}</th><td>{row.ours}</td><td>{row.theirs}</td></tr>
            ))}
          </tbody>
        </table>
      </FadeIn>
    </section>
  );
}
