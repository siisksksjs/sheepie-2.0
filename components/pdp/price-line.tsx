// components/pdp/price-line.tsx
import { discountPercent, formatIdr } from "@/lib/catalog/price";
import type { ProductOption } from "@/lib/catalog/types";

import styles from "./pdp.module.css";

export function PriceLine({ option, saveLabel }: { option: ProductOption; saveLabel: string }) {
  const saving = discountPercent(option.price, option.originalPrice);

  return (
    <div className={styles.priceRow}>
      <b>{formatIdr(option.price)}</b>
      {saving !== null && option.originalPrice !== null && (
        <>
          <s>{formatIdr(option.originalPrice)}</s>
          <span className={styles.off}>{saveLabel.replace("{n}", String(saving))}</span>
        </>
      )}
    </div>
  );
}
