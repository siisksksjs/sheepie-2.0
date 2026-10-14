import site from "@/components/site/site.module.css";

import styles from "./pages.module.css";

/** The shared opening of the content pages: eyebrow, two-line headline (second line italic), intro. Above the fold, so no fade-in. */
export function PageIntro({ eyebrow, title, intro }: { eyebrow: string; title: [string, string]; intro: string }) {
  return (
    <section className={`${site.shell} ${styles.intro}`} data-section="intro">
      <div>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h1 className={styles.title}>
          {title[0]}
          <em>{title[1]}</em>
        </h1>
        <p className={styles.lede}>{intro}</p>
      </div>
    </section>
  );
}
