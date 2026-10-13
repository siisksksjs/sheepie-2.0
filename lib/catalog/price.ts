export function parseIdr(value: string): number {
  const digits = value.replace(/[^\d]/g, "");
  if (!digits) {
    throw new Error(`Not an IDR amount: "${value}"`);
  }
  return Number(digits);
}

export function formatIdr(amount: number): string {
  return `Rp${Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}

/** Whole-percent saving, or null when the original price is missing or not higher. */
export function discountPercent(price: number, originalPrice: number | null): number | null {
  if (originalPrice === null || originalPrice <= price) {
    return null;
  }
  return Math.round((1 - price / originalPrice) * 100);
}
