/**
 * Where this visit came from (an ad's UTM tags), remembered for the browser session
 * so a later Shopee/Tokopedia tap can pass it on. Nothing personal is stored.
 */
export type Attribution = { source: string; medium?: string; campaign?: string; content?: string; term?: string };

const KEY = "sheepie.attribution";
const MAX = 100;

const clean = (value: string | null) => value?.trim().slice(0, MAX) || undefined;

/** UTM tags from a landing URL's query string; a bare Facebook click id counts as Meta. */
export function attributionFromSearch(search: string): Attribution | null {
  const params = new URLSearchParams(search);
  const source = clean(params.get("utm_source"));
  if (source) {
    return {
      source,
      medium: clean(params.get("utm_medium")),
      campaign: clean(params.get("utm_campaign")),
      content: clean(params.get("utm_content")),
      term: clean(params.get("utm_term")),
    };
  }
  if (params.get("fbclid")) return { source: "meta", medium: "social" };
  return null;
}

/** Remember the latest tagged landing for this session (last click wins). */
export function captureAttribution(search: string): void {
  const found = attributionFromSearch(search);
  if (!found) return;
  try {
    sessionStorage.setItem(KEY, JSON.stringify(found));
  } catch {
    // Private mode or blocked storage: the visit just counts as "site".
  }
}

export function readAttribution(): Attribution | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const value = JSON.parse(raw) as Attribution;
    return typeof value?.source === "string" ? value : null;
  } catch {
    return null;
  }
}
