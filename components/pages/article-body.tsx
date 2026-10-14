import type { JournalBlock } from "@/lib/site/journal";
import { slugify } from "@/lib/site/journal";

import styles from "./pages.module.css";

/** Article copy is authored in this repo (data/blog.json), so inline HTML (links, bold) is trusted. */
const html = (text: string) => ({ __html: text });

export function ArticleBody({ blocks, labels }: { blocks: JournalBlock[]; labels: { answer: string; faqTitle: string } }) {
  return (
    <div className={styles.prose}>
      {blocks.map((block, i) => {
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
                  <details key={item.q} className={styles.qa}>
                    <summary>{item.q}</summary>
                    <p dangerouslySetInnerHTML={html(item.a)} />
                  </details>
                ))}
              </section>
            );
          default:
            return <p key={i} dangerouslySetInnerHTML={html(block.text)} />;
        }
      })}
    </div>
  );
}
