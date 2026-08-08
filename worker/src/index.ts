/**
 * Monastery360 API — Cloudflare Worker
 *
 * Bindings (see wrangler.toml):
 *   DB     D1 database, schema in ./schema.sql
 *   MEDIA  R2 bucket holding panoramas, covers, archive scans and cached narration
 *   AI     Workers AI, used for semantic archive search and text-to-speech
 *
 * Responses match the shapes consumed by src/lib/api.ts in the frontend.
 */

export interface Env {
  DB: D1Database;
  MEDIA: R2Bucket;
  AI: Ai;
  MEDIA_BASE_URL: string;
  ALLOWED_ORIGINS: string;
  /** Secret: wrangler secret put ADMIN_TOKEN */
  ADMIN_TOKEN?: string;
}

/* ------------------------------------------------------------------ utils */

function cors(env: Env, origin: string | null): Record<string, string> {
  const allowed = env.ALLOWED_ORIGINS.split(",").map((o) => o.trim());
  const allow = origin && allowed.includes(origin) ? origin : allowed[0] ?? "*";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function json(data: unknown, headers: Record<string, string>, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...headers, "Content-Type": "application/json; charset=utf-8" },
  });
}

const media = (env: Env, key: string | null) =>
  key ? `${env.MEDIA_BASE_URL.replace(/\/$/, "")}/${key}` : "";

const parseList = (raw: string | null): string[] => {
  if (!raw) return [];
  try {
    const v: unknown = JSON.parse(raw);
    return Array.isArray(v) ? (v as string[]) : [];
  } catch {
    return [];
  }
};

/* ------------------------------------------------------------------ types */

interface MonasteryRow {
  slug: string;
  name: string;
  local_name: string | null;
  district: string;
  sect: string;
  founded: number;
  era: string;
  altitude: number;
  lat: number;
  lng: number;
  cover_key: string | null;
  summary: string;
  history: string;
  architecture: string;
  visiting: string;
  nearby: string | null;
  beacon_id: string | null;
}

interface SceneRow {
  id: string;
  monastery_slug: string;
  title: string;
  panorama_key: string;
  narration: string;
}

interface HotspotRow {
  scene_id: string;
  pitch: number;
  yaw: number;
  label: string;
  target_scene_id: string | null;
}

interface ArchiveRow {
  id: string;
  title: string;
  kind: string;
  monastery_slug: string | null;
  era: string | null;
  language: string | null;
  material: string | null;
  image_key: string | null;
  description: string | null;
  tags: string | null;
  embedding: string | null;
}

interface EventRow {
  id: string;
  name: string;
  monastery_slug: string | null;
  start_date: string;
  end_date: string | null;
  category: string;
  description: string | null;
  open_to_visitors: number;
}

function toMonastery(env: Env, r: MonasteryRow) {
  return {
    slug: r.slug,
    name: r.name,
    localName: r.local_name ?? "",
    district: r.district,
    sect: r.sect,
    founded: r.founded,
    era: r.era,
    altitude: r.altitude,
    lat: r.lat,
    lng: r.lng,
    cover: media(env, r.cover_key),
    summary: r.summary,
    history: r.history,
    architecture: r.architecture,
    visiting: r.visiting,
    nearby: parseList(r.nearby),
    beaconId: r.beacon_id ?? "",
    scenes: [] as unknown[],
  };
}

function toArchive(env: Env, r: ArchiveRow) {
  return {
    id: r.id,
    title: r.title,
    kind: r.kind,
    monasterySlug: r.monastery_slug ?? "",
    era: r.era ?? "",
    language: r.language ?? "",
    material: r.material ?? "",
    image: media(env, r.image_key),
    description: r.description ?? "",
    tags: parseList(r.tags),
  };
}

function toEvent(r: EventRow) {
  return {
    id: r.id,
    name: r.name,
    monasterySlug: r.monastery_slug ?? "",
    date: r.start_date,
    endDate: r.end_date ?? undefined,
    category: r.category,
    description: r.description ?? "",
    openToVisitors: Boolean(r.open_to_visitors),
  };
}

/* -------------------------------------------------------------- AI search */

async function embed(env: Env, text: string): Promise<number[] | null> {
  try {
    const out = (await env.AI.run("@cf/baai/bge-base-en-v1.5", {
      text: [text],
    })) as { data: number[][] };
    return out.data[0] ?? null;
  } catch {
    return null;
  }
}

function cosine(a: number[], b: number[]): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i += 1) {
    dot += (a[i] ?? 0) * (b[i] ?? 0);
    na += (a[i] ?? 0) ** 2;
    nb += (b[i] ?? 0) ** 2;
  }
  return na && nb ? dot / (Math.sqrt(na) * Math.sqrt(nb)) : 0;
}

const archiveText = (r: ArchiveRow) =>
  [r.title, r.kind, r.era, r.language, r.material, r.description, parseList(r.tags).join(" ")]
    .filter(Boolean)
    .join(". ");

/* --------------------------------------------------------------- handlers */

async function handle(request: Request, env: Env, h: Record<string, string>): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/$/, "") || "/";

  if (path === "/" || path === "/api/health") {
    return json({ ok: true, service: "monastery360-api" }, h);
  }

  /* Monasteries ---------------------------------------------------------- */
  if (path === "/api/monasteries" && request.method === "GET") {
    const where: string[] = [];
    const binds: unknown[] = [];
    for (const [param, column] of [
      ["district", "district"],
      ["sect", "sect"],
      ["era", "era"],
    ] as const) {
      const value = url.searchParams.get(param);
      if (value) {
        where.push(`${column} = ?`);
        binds.push(value);
      }
    }
    const q = url.searchParams.get("q");
    if (q) {
      where.push(
        "(lower(name) LIKE ? OR lower(local_name) LIKE ? OR lower(summary) LIKE ?)",
      );
      const like = `%${q.toLowerCase()}%`;
      binds.push(like, like, like);
    }
    const sql = `SELECT * FROM monasteries ${where.length ? `WHERE ${where.join(" AND ")}` : ""} ORDER BY name`;
    const { results } = await env.DB.prepare(sql).bind(...binds).all<MonasteryRow>();
    return json(results.map((r) => toMonastery(env, r)), h);
  }

  const detail = /^\/api\/monasteries\/([a-z0-9-]+)$/.exec(path);
  if (detail && request.method === "GET") {
    const slug = detail[1]!;
    const row = await env.DB.prepare("SELECT * FROM monasteries WHERE slug = ?")
      .bind(slug)
      .first<MonasteryRow>();
    if (!row) return json({ error: "Not found" }, h, 404);

    const [{ results: scenes }, { results: hotspots }] = await Promise.all([
      env.DB.prepare(
        "SELECT * FROM tour_scenes WHERE monastery_slug = ? ORDER BY sort_order",
      )
        .bind(slug)
        .all<SceneRow>(),
      env.DB.prepare(
        "SELECT hs.* FROM tour_hotspots hs JOIN tour_scenes s ON s.id = hs.scene_id WHERE s.monastery_slug = ?",
      )
        .bind(slug)
        .all<HotspotRow>(),
    ]);

    return json(
      {
        ...toMonastery(env, row),
        scenes: scenes.map((s) => ({
          id: s.id,
          title: s.title,
          image: media(env, s.panorama_key),
          narration: s.narration,
          hotspots: hotspots
            .filter((hs) => hs.scene_id === s.id)
            .map((hs) => ({
              pitch: hs.pitch,
              yaw: hs.yaw,
              label: hs.label,
              sceneId: hs.target_scene_id ?? undefined,
            })),
        })),
      },
      h,
    );
  }

  /* Map ------------------------------------------------------------------ */
  if (path === "/api/map/points" && request.method === "GET") {
    const { results } = await env.DB.prepare(
      "SELECT slug, name, district, sect, lat, lng, altitude FROM monasteries ORDER BY name",
    ).all();
    return json(results, h);
  }

  /* Archives — semantic search with keyword fallback ---------------------- */
  if (path === "/api/archives" && request.method === "GET") {
    const q = url.searchParams.get("q")?.trim() ?? "";
    const kind = url.searchParams.get("kind");
    const sql = kind
      ? "SELECT * FROM archive_items WHERE kind = ? ORDER BY title"
      : "SELECT * FROM archive_items ORDER BY title";
    const { results } = await env.DB.prepare(sql)
      .bind(...(kind ? [kind] : []))
      .all<ArchiveRow>();

    if (!q) return json(results.map((r) => toArchive(env, r)), h);

    const queryVector = await embed(env, q);
    if (queryVector) {
      const scored = results
        .map((r) => {
          const stored = r.embedding ? (JSON.parse(r.embedding) as number[]) : null;
          return { r, score: stored ? cosine(queryVector, stored) : 0 };
        })
        .filter((x) => x.score > 0.35)
        .sort((a, b) => b.score - a.score);
      if (scored.length) {
        return json(
          scored.map(({ r, score }) => ({
            ...toArchive(env, r),
            score: Number(score.toFixed(3)),
            reason: "Semantic match on catalogue description",
          })),
          h,
        );
      }
    }

    const needle = q.toLowerCase();
    return json(
      results
        .filter((r) => archiveText(r).toLowerCase().includes(needle))
        .map((r) => toArchive(env, r)),
      h,
    );
  }

  /* Events --------------------------------------------------------------- */
  if (path === "/api/events" && request.method === "GET") {
    const month = url.searchParams.get("month");
    const { results } = month
      ? await env.DB.prepare(
          "SELECT * FROM events WHERE start_date LIKE ? ORDER BY start_date",
        )
          .bind(`${month}%`)
          .all<EventRow>()
      : await env.DB.prepare("SELECT * FROM events ORDER BY start_date").all<EventRow>();
    return json(results.map(toEvent), h);
  }

  /* Bookings ------------------------------------------------------------- */
  if (path === "/api/bookings" && request.method === "POST") {
    const body = (await request.json().catch(() => null)) as
      | { eventId?: string; name?: string; email?: string; people?: number; note?: string }
      | null;
    const eventId = body?.eventId?.trim();
    const name = body?.name?.trim();
    const email = body?.email?.trim();
    const people = Number(body?.people ?? 1);
    if (
      !eventId ||
      !name ||
      name.length > 120 ||
      !email ||
      !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) ||
      email.length > 200 ||
      !Number.isFinite(people) ||
      people < 1 ||
      people > 20
    ) {
      return json({ error: "Invalid booking payload" }, h, 400);
    }
    const exists = await env.DB.prepare("SELECT id FROM events WHERE id = ?")
      .bind(eventId)
      .first();
    if (!exists) return json({ error: "Unknown event" }, h, 404);

    const id = crypto.randomUUID();
    await env.DB.prepare(
      "INSERT INTO bookings (id, event_id, name, email, people, note, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
    )
      .bind(id, eventId, name, email, people, (body?.note ?? "").slice(0, 500), new Date().toISOString())
      .run();
    return json({ ok: true, id }, h);
  }

  /* Text to speech — generated once, then served from R2 ------------------ */
  if (path === "/api/tts" && request.method === "POST") {
    const body = (await request.json().catch(() => null)) as
      | { text?: string; language?: string; cacheKey?: string }
      | null;
    const text = body?.text?.slice(0, 1200);
    const language = (body?.language ?? "en").replace(/[^a-z]/g, "");
    const cacheKey = body?.cacheKey?.replace(/[^a-zA-Z0-9-_]/g, "");
    if (!text || !cacheKey) return json({ error: "Invalid narration request" }, h, 400);

    const key = `narration/${cacheKey}-${language}.mp3`;
    const existing = await env.MEDIA.head(key);
    if (!existing) {
      const audio = (await env.AI.run("@cf/myshell-ai/melotts", {
        prompt: text,
        lang: language === "hi" ? "hi" : "en",
      })) as { audio?: string } | ReadableStream;
      const bytes =
        audio instanceof ReadableStream
          ? await new Response(audio).arrayBuffer()
          : Uint8Array.from(atob(audio.audio ?? ""), (c) => c.charCodeAt(0));
      await env.MEDIA.put(key, bytes, {
        httpMetadata: { contentType: "audio/mpeg", cacheControl: "public, max-age=31536000" },
      });
    }
    return json({ url: media(env, key) }, h);
  }

  /* Rebuild archive embeddings ------------------------------------------- */
  if (path === "/api/admin/reindex" && request.method === "POST") {
    // Protected: set with `wrangler secret put ADMIN_TOKEN`
    const token = request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
    if (!env.ADMIN_TOKEN || token !== env.ADMIN_TOKEN) {
      return json({ error: "Unauthorized" }, h, 401);
    }
    const { results } = await env.DB.prepare("SELECT * FROM archive_items").all<ArchiveRow>();
    let updated = 0;
    for (const row of results) {
      const vector = await embed(env, archiveText(row));
      if (!vector) continue;
      await env.DB.prepare("UPDATE archive_items SET embedding = ? WHERE id = ?")
        .bind(JSON.stringify(vector), row.id)
        .run();
      updated += 1;
    }
    return json({ ok: true, updated }, h);
  }

  return json({ error: "Not found" }, h, 404);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const h = cors(env, request.headers.get("Origin"));
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: h });
    try {
      return await handle(request, env, h);
    } catch (err) {
      console.error("Unhandled API error", err);
      return json({ error: "Internal error" }, h, 500);
    }
  },
} satisfies ExportedHandler<Env>;
