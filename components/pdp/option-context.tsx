// components/pdp/option-context.tsx
"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

import type { ProductBundle, ProductOption, ProductSlug } from "@/lib/catalog/types";
import { trackViewItem } from "@/lib/analytics";
import { sendMetaEvent } from "@/lib/meta/client";
import { viewContent } from "@/lib/meta/events";

type Price = { price: number; originalPrice: number | null };

type OptionContext = {
  slug: ProductSlug;
  name: string;
  option: ProductOption;
  select: (key: string) => void;
  bundle: ProductBundle | null;
  selectBundle: (key: string) => void;
  /** True once the shopper has picked a pack themselves (the default doesn't count). */
  bundlePicked: boolean;
  /** What the shopper pays for the current choice: the bundle price when there are bundles. */
  price: Price;
};

const Context = createContext<OptionContext | null>(null);

type ProductRef = { slug: ProductSlug; name: string; options: ProductOption[]; bundles: ProductBundle[] };

function pick(options: ProductOption[], key: string | null): ProductOption {
  return options.find((o) => o.key === key) ?? options[0];
}

/**
 * Shares the selected option between the buy box and the sticky bar.
 * Honors ?option= after mount (keeps the page static) and records a
 * ViewContent for the first resolved option and each later change.
 */
export function OptionProvider({ product, children }: { product: ProductRef; children: ReactNode }) {
  const [key, setKey] = useState<string | null>(null);
  const [bundleKey, setBundleKey] = useState<string | null>(null);
  const [bundlePicked, setBundlePicked] = useState(false);
  const option = pick(product.options, key);
  const bundle = product.bundles.find((b) => b.key === bundleKey) ?? product.bundles[0] ?? null;
  const price: Price = bundle ?? option;

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("option");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads ?option after mount to keep the page static
    setKey(pick(product.options, requested).key);
  }, [product.options]);

  useEffect(() => {
    if (key === null) return;
    const current = pick(product.options, key);
    const value = (product.bundles.find((b) => b.key === bundleKey) ?? product.bundles[0] ?? current).price;
    try {
      sendMetaEvent(viewContent({ slug: product.slug, optionKey: current.key, value }));
    } catch {
      // Tracking never interrupts the page.
    }
    try {
      trackViewItem({ slug: product.slug, optionKey: current.key, value });
    } catch {
      // Tracking never interrupts the page.
    }
  }, [key, bundleKey, product.slug, product.options, product.bundles]);

  const select = useCallback((next: string) => setKey(pick(product.options, next).key), [product.options]);
  const selectBundle = useCallback((next: string) => {
    setBundleKey(next);
    setBundlePicked(true);
  }, []);

  return (
    <Context.Provider value={{ slug: product.slug, name: product.name, option, select, bundle, selectBundle, bundlePicked, price }}>
      {children}
    </Context.Provider>
  );
}

export function useSelectedOption(): OptionContext {
  const value = useContext(Context);
  if (!value) throw new Error("useSelectedOption must be used inside <OptionProvider>");
  return value;
}
