// app/api/meta-events/route.ts
import { isMetaEvent } from "@/lib/meta/events";
import { buildServerEvent, forwardToMeta, readMetaEnv } from "@/lib/meta/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY = 4096;

export async function POST(request: Request) {
  const declared = Number(request.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > MAX_BODY) return Response.json({ ok: false }, { status: 400 });

  const text = await request.text();
  if (text.length > MAX_BODY) return Response.json({ ok: false }, { status: 400 });

  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
  if (!isMetaEvent(body)) return Response.json({ ok: false }, { status: 400 });

  const env = readMetaEnv();
  if (!env) return Response.json({ ok: true, forwarded: false }, { status: 202 });

  const serverEvent = buildServerEvent(body, request, body.event_source_url ?? null, Date.now());
  const forwarded = await forwardToMeta(serverEvent, env);
  return Response.json({ ok: true, forwarded }, { status: 202 });
}
