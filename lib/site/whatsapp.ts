import type { Locale } from "@/i18n/config";

/** Sheepie customer service (0895-1718-6188), in the international form wa.me needs. */
export const WHATSAPP_NUMBER = "6289517186188";

export function whatsappUrl(text: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

/** The pre-filled first message: about a product (and the shopper's choice) or a general hello. */
export function whatsappGreeting(locale: Locale, product?: { name: string; detail?: string | null }): string {
  if (!product) return locale === "id" ? "Halo Sheepie, saya mau tanya." : "Hi Sheepie, I have a question.";
  const about = product.detail ? `${product.name} (${product.detail})` : product.name;
  return locale === "id" ? `Halo Sheepie, saya mau tanya tentang ${about}.` : `Hi Sheepie, I have a question about ${about}.`;
}
