// components/pdp/option-context.tsx
"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

import type { ProductOption, ProductSlug } from "@/lib/catalog/types";
import { sendMetaEvent } from "@/lib/meta/client";
import { viewContent } from "@/lib/meta/events";

type OptionContext = { slug: ProductSlug; name: string; option: ProductOption; select: (key: string) => void };

const Context = createContext<OptionContext | null>(null);

type ProductRef = { slug: ProductSlug; name: string; options: ProductOption[] };

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
  const option = pick(product.options, key);

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("option");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads ?option after mount to keep the page static
    setKey(pick(product.options, requested).key);
  }, [product.options]);

  useEffect(() => {
    if (key === null) return;
    const current = pick(product.options, key);
    sendMetaEvent(viewContent({ slug: product.slug, optionKey: current.key, value: current.price }));
  }, [key, product.slug, product.options]);

  const select = useCallback((next: string) => setKey(pick(product.options, next).key), [product.options]);

  return <Context.Provider value={{ slug: product.slug, name: product.name, option, select }}>{children}</Context.Provider>;
}

export function useSelectedOption(): OptionContext {
  const value = useContext(Context);
  if (!value) throw new Error("useSelectedOption must be used inside <OptionProvider>");
  return value;
}
