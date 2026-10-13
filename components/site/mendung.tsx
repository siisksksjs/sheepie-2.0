import styles from "./site.module.css";

const toneClass = { white: styles.mendungWhite, sky: styles.mendungSky, ink: styles.mendungInk } as const;

/** The traced Mega Mendung tile as a decorative layer. Parent must be position: relative. */
export function Mendung({ tone }: { tone: keyof typeof toneClass }) {
  return <div aria-hidden="true" className={`${styles.mendung} ${toneClass[tone]}`} />;
}
