import Image from "next/image";
import type { ReactNode } from "react";

import type { JournalBlock } from "@/lib/site/journal";
import { slugify } from "@/lib/site/journal";

import styles from "./pages.module.css";

/** Article copy is authored in this repo (data/blog.json), so inline HTML (links, bold) is trusted. */
const html = (text: string) => ({ __html: text });

type Labels = { answer: string; takeaways: string; faqTitle: string; toc: string };

/** The collapsible contents list; it sits right under the takeaways box, like a magazine's standfirst. */
function Toc({ items, label }: { items: { id: string; text: string }[]; label: string }) {
  return (
    <nav className={styles.toc} aria-label={label} data-block="toc">
      <details>
        <summary>{label}</summary>
        <ol>{items.map((h) => <li key={h.id}><a href={`#${h.id}`}>{h.text}</a></li>)}</ol>
      </details>
    </nav>
  );
}

function renderBlock(block: JournalBlock, i: number, labels: Labels): ReactNode {
  switch (block.type) {
    case "h2":
      return <h2 key={i} id={block.id ?? slugify(block.text)}>{block.text}</h2>;
    case "h3":
      return <h3 key={i}>{block.text}</h3>;
    case "ul":
      return <ul key={i}>{block.items.map((item, j) => <li key={j} dangerouslySetInnerHTML={html(item)} />)}</ul>;
    case "ol":
      return <ol key={i}>{block.items.map((item, j) => <li key={j} dangerouslySetInnerHTML={html(item)} />)}</ol>;
    case "answer":
      return (
        <aside key={i} className={styles.answer} data-block="answer">
          <b>{block.title ?? labels.answer}</b>
          <p dangerouslySetInnerHTML={html(block.text)} />
        </aside>
      );
    case "takeaways":
      return (
        <aside key={i} className={styles.takeaways} data-block="takeaways">
          <h2>{labels.takeaways}</h2>
          <ul>{block.items.map((item, j) => <li key={j} dangerouslySetInnerHTML={html(item)} />)}</ul>
        </aside>
      );
    case "figure":
      return (
        <figure key={i} className={styles.figure} data-block="figure">
          <Image src={block.src} alt={block.alt} width={block.width} height={block.height} sizes="(max-width: 760px) 100vw, 920px" />
          {block.caption && <figcaption>{block.caption}</figcaption>}
        </figure>
      );
    case "tip":
      return <p key={i} className={styles.tip} data-block="tip" dangerouslySetInnerHTML={html(block.text)} />;
    case "table":
      return (
        <div key={i} className={styles.tableWrap} data-block="table">
          <table>
            {block.caption && <caption>{block.caption}</caption>}
            <thead>
              <tr>{block.head.map((h, j) => <th key={j} scope="col">{h}</th>)}</tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) => (c === 0 ? <th key={c} scope="row" dangerouslySetInnerHTML={html(cell)} /> : <td key={c} data-label={block.head[c]} dangerouslySetInnerHTML={html(cell)} />))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "faq":
      return (
        <section key={i} className={styles.articleFaq} data-block="faq">
          <h2 id="faq">{labels.faqTitle}</h2>
          {block.items.map((item) => (
            <details key={item.q} className={styles.faqItem}>
              <summary>{item.q}</summary>
              <p dangerouslySetInnerHTML={html(item.a)} />
            </details>
          ))}
        </section>
      );
    default:
      return <p key={i} dangerouslySetInnerHTML={html(block.text)} />;
  }
}

export function ArticleBody({ blocks, labels, toc }: { blocks: JournalBlock[]; labels: Labels; toc: { id: string; text: string }[] }) {
  const showToc = toc.length >= 4;
  // The contents list follows the takeaways (or answer) box; without one it opens the article.
  const anchor = blocks.findIndex((b) => b.type === "takeaways" || b.type === "answer");

  return (
    <div className={styles.prose}>
      {showToc && anchor === -1 && <Toc items={toc} label={labels.toc} />}
      {blocks.map((block, i) => (
        <FragmentWithToc key={i} after={showToc && i === anchor ? <Toc items={toc} label={labels.toc} /> : null}>
          {renderBlock(block, i, labels)}
        </FragmentWithToc>
      ))}
    </div>
  );
}

function FragmentWithToc({ children, after }: { children: ReactNode; after: ReactNode }) {
  return (
    <>
      {children}
      {after}
    </>
  );
}
