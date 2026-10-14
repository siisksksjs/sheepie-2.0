// Extra SERP checks for product-adjacent keywords. Run: node --env-file=.env.local scripts/seo/serp-extra.mjs
import { writeFile } from "node:fs/promises";
const AUTH = "Basic " + Buffer.from(`${process.env.DATAFORSEO_LOGIN}:${process.env.DATAFORSEO_PASSWORD}`).toString("base64");
const KEYWORDS = [
  "penutup mata tidur", "penutup mata untuk tidur", "tidur dengan lampu menyala", "tidur siang", "jam tidur siang yang baik",
  "bantal memory foam adalah", "bantal ergonomis", "leher sakit setelah bangun tidur", "posisi tidur miring yang benar",
  "lebih bagus tidur pakai bantal atau tidak", "bantal yang bagus untuk kesehatan", "merk bantal hotel yang bagus",
  "bantal tidur yang bagus", "white noise untuk tidur", "cara tidur tidak ngorok", "perlengkapan tidur",
  "cara meningkatkan kualitas tidur", "tidur tapi seperti tidak tidur", "hadiah untuk lansia", "bantal untuk sakit leher",
];
const out = [];
for (const keyword of KEYWORDS) {
  const res = await fetch("https://api.dataforseo.com/v3/serp/google/organic/live/advanced", {
    method: "POST", headers: { Authorization: AUTH, "Content-Type": "application/json" },
    body: JSON.stringify([{ keyword, location_code: 2360, language_code: "id", depth: 10, device: "mobile" }]),
  });
  const items = (await res.json()).tasks?.[0]?.result?.[0]?.items ?? [];
  out.push({
    keyword,
    organic: items.filter((i) => i.type === "organic").map((i) => ({ rank: i.rank_group, domain: i.domain, title: i.title })),
    paa: items.filter((i) => i.type === "people_also_ask").flatMap((i) => i.items?.map((q) => q.title) ?? []),
    features: [...new Set(items.map((i) => i.type))],
  });
}
await writeFile(new URL("./out/serps-extra.json", import.meta.url), JSON.stringify(out, null, 2));
console.log("done", out.length);
