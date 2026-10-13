/**
 * Private marketplace voucher shown only on this website (tracks site-driven orders).
 * Null when NEXT_PUBLIC_WEBSITE_VOUCHER_CODE is unset, so no placeholder code ever ships.
 */
export const WEBSITE_VOUCHER_CODE: string | null = process.env.NEXT_PUBLIC_WEBSITE_VOUCHER_CODE?.trim() || null;
