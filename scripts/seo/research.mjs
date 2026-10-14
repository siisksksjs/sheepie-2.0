// Keyword research for the Sheepie blog plan (Google Indonesia, Bahasa Indonesia).
// Run: node --env-file=.env.local scripts/seo/research.mjs
// Needs DATAFORSEO_LOGIN and DATAFORSEO_PASSWORD. Writes raw JSON to scripts/seo/out/.
// Rough cost: about US$1–2 per full run.
import { mkdir, writeFile } from "node:fs/promises";

const { DATAFORSEO_LOGIN, DATAFORSEO_PASSWORD } = process.env;
if (!DATAFORSEO_LOGIN || !DATAFORSEO_PASSWORD) {
  console.error("Set DATAFORSEO_LOGIN and DATAFORSEO_PASSWORD in .env.local");
  process.exit(1);
}

const AUTH = "Basic " + Buffer.from(`${DATAFORSEO_LOGIN}:${DATAFORSEO_PASSWORD}`).toString("base64");
const LOCATION = 2360; // Indonesia
const LANGUAGE = "id";
const OUT = new URL("./out/", import.meta.url);

const SEEDS = {
  pillow: [
    "bantal ergonomis", "bantal leher", "bantal memory foam", "bantal cervical", "bantal kesehatan",
    "bantal untuk sakit leher", "bantal tidur miring", "bantal yang bagus untuk tidur", "leher kaku bangun tidur",
    "posisi tidur yang benar", "bantal kepala", "sakit leher setelah bangun tidur",
  ],
  mask: [
    "penutup mata tidur", "sleep mask", "masker tidur", "tidur siang", "tidur dengan lampu menyala",
    "cara cepat tidur", "susah tidur malam", "tidur di pesawat", "eye mask tidur",
  ],
  earplug: [
    "earplug tidur", "penutup telinga tidur", "earplug silikon", "tidur di tempat bising", "pasangan mendengkur",
    "suara bising saat tidur", "white noise untuk tidur", "earplug aman untuk tidur",
  ],
  general: [
    "cara tidur nyenyak", "tips tidur nyenyak", "sleep hygiene", "jam tidur ideal", "kualitas tidur",
    "insomnia", "kado untuk orang tua", "perlengkapan tidur", "tidur di kos",
  ],
};

async function post(path, body) {
  const res = await fetch(`https://api.dataforseo.com/v3/${path}`, {
    method: "POST",
    headers: { Authorization: AUTH, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (json.status_code !== 20000) throw new Error(`${path}: ${json.status_code} ${json.status_message}`);
  for (const task of json.tasks) {
    if (task.status_code !== 20000) console.warn(`  task warning ${path}: ${task.status_code} ${task.status_message}`);
  }
  console.log(`  ${path}: $${json.cost}`);
  return json;
}

await mkdir(OUT, { recursive: true });

// 1. Keyword ideas + volume per cluster (Google Ads data).
console.log("1/3 keyword ideas");
const ideas = {};
for (const [cluster, keywords] of Object.entries(SEEDS)) {
  const json = await post("keywords_data/google_ads/keywords_for_keywords/live", [
    { keywords, location_code: LOCATION, language_code: LANGUAGE, sort_by: "search_volume" },
  ]);
  ideas[cluster] = json.tasks[0].result ?? [];
}
await writeFile(new URL("ideas.json", OUT), JSON.stringify(ideas, null, 2));

// Merge and keep the keywords worth looking at.
const merged = new Map();
for (const [cluster, rows] of Object.entries(ideas)) {
  for (const r of rows) {
    if (!r.search_volume || r.search_volume < 50) continue;
    if (!merged.has(r.keyword)) merged.set(r.keyword, { keyword: r.keyword, cluster, volume: r.search_volume, cpc: r.cpc, competition: r.competition, trend: r.monthly_searches?.slice(0, 12).map((m) => m.search_volume) });
  }
}
const top = [...merged.values()].sort((a, b) => b.volume - a.volume).slice(0, 600);

// 2. Keyword difficulty.
console.log("2/3 keyword difficulty");
const kd = await post("dataforseo_labs/google/bulk_keyword_difficulty/live", [
  { keywords: top.map((k) => k.keyword).slice(0, 1000), location_code: LOCATION, language_code: LANGUAGE },
]);
const kdMap = new Map((kd.tasks[0].result?.[0]?.items ?? []).map((i) => [i.keyword, i.keyword_difficulty]));
for (const k of top) k.kd = kdMap.get(k.keyword) ?? null;
await writeFile(new URL("keywords.json", OUT), JSON.stringify(top, null, 2));

// 3. SERPs for the 40 strongest candidates per cluster mix: who ranks, People Also Ask.
console.log("3/3 SERPs");
const candidates = [];
for (const cluster of Object.keys(SEEDS)) {
  candidates.push(...top.filter((k) => k.cluster === cluster).slice(0, 10));
}
const serps = [];
for (const k of candidates) {
  const json = await post("serp/google/organic/live/advanced", [
    { keyword: k.keyword, location_code: LOCATION, language_code: LANGUAGE, depth: 10, device: "mobile" },
  ]);
  const items = json.tasks[0].result?.[0]?.items ?? [];
  serps.push({
    keyword: k.keyword,
    organic: items.filter((i) => i.type === "organic").map((i) => ({ rank: i.rank_group, domain: i.domain, title: i.title, url: i.url })),
    paa: items.filter((i) => i.type === "people_also_ask").flatMap((i) => i.items?.map((q) => q.title) ?? []),
    features: [...new Set(items.map((i) => i.type))],
  });
}
await writeFile(new URL("serps.json", OUT), JSON.stringify(serps, null, 2));
console.log(`done: ${top.length} keywords, ${serps.length} SERPs -> scripts/seo/out/`);
