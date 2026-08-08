/**
 * Single data access layer for the frontend.
 *
 * When VITE_API_BASE_URL is set, every read goes to the Cloudflare Worker API.
 * Otherwise the bundled seed data is used, so the app runs standalone in
 * development and in demos with no backend deployed.
 */
import { archiveItems, type ArchiveItem } from "@/data/archives";
import { culturalEvents, type CulturalEvent } from "@/data/events";
import { getMonastery, monasteries, type Monastery } from "@/data/monasteries";

const API_BASE = import.meta.env["VITE_API_BASE_URL"] as string | undefined;

export const usingRemoteApi = Boolean(API_BASE);

async function get<T>(path: string, fallback: () => T): Promise<T> {
  if (!API_BASE) return fallback();
  try {
    const res = await fetch(`${API_BASE}${path}`);
    if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
    return (await res.json()) as T;
  } catch (err) {
    console.error(`API request failed for ${path}`, err);
    return fallback();
  }
}

export interface MonasteryFilters {
  q?: string;
  district?: string;
  sect?: string;
  era?: string;
}

function filterMonasteries(filters: MonasteryFilters): Monastery[] {
  const q = filters.q?.trim().toLowerCase() ?? "";
  return monasteries.filter((m) => {
    if (filters.district && m.district !== filters.district) return false;
    if (filters.sect && m.sect !== filters.sect) return false;
    if (filters.era && m.era !== filters.era) return false;
    if (
      q &&
      !`${m.name} ${m.localName} ${m.district} ${m.summary}`.toLowerCase().includes(q)
    )
      return false;
    return true;
  });
}

export function listMonasteries(filters: MonasteryFilters = {}) {
  const qs = new URLSearchParams(
    Object.entries(filters).filter(([, v]) => Boolean(v)) as [string, string][],
  ).toString();
  return get<Monastery[]>(`/api/monasteries${qs ? `?${qs}` : ""}`, () =>
    filterMonasteries(filters),
  );
}

export function fetchMonastery(slug: string) {
  return get<Monastery | undefined>(`/api/monasteries/${slug}`, () => getMonastery(slug));
}

export interface MapPoint {
  slug: string;
  name: string;
  district: string;
  sect: string;
  lat: number;
  lng: number;
  altitude: number;
}

export function listMapPoints() {
  return get<MapPoint[]>("/api/map/points", () =>
    monasteries.map(({ slug, name, district, sect, lat, lng, altitude }) => ({
      slug,
      name,
      district,
      sect,
      lat,
      lng,
      altitude,
    })),
  );
}

export interface ArchiveResult extends ArchiveItem {
  score?: number;
  reason?: string;
}

function localArchiveSearch(q: string, kind?: string): ArchiveResult[] {
  const needle = q.trim().toLowerCase();
  return archiveItems.filter((item) => {
    if (kind && item.kind !== kind) return false;
    if (!needle) return true;
    return `${item.title} ${item.description} ${item.tags.join(" ")} ${item.era} ${item.language} ${item.material}`
      .toLowerCase()
      .includes(needle);
  });
}

export function listArchives(q = "", kind?: string) {
  const qs = new URLSearchParams();
  if (q) qs.set("q", q);
  if (kind) qs.set("kind", kind);
  return get<ArchiveResult[]>(
    `/api/archives${qs.toString() ? `?${qs}` : ""}`,
    () => localArchiveSearch(q, kind),
  );
}

export function listEvents(month?: string) {
  return get<CulturalEvent[]>(`/api/events${month ? `?month=${month}` : ""}`, () =>
    month
      ? culturalEvents.filter((e) => e.date.startsWith(month))
      : [...culturalEvents].sort((a, b) => a.date.localeCompare(b.date)),
  );
}

export interface BookingInput {
  eventId: string;
  name: string;
  email: string;
  people: number;
  note?: string;
}

export async function createBooking(input: BookingInput): Promise<{ ok: boolean; id: string }> {
  if (!API_BASE) {
    const id = `local-${Date.now()}`;
    if (typeof window !== "undefined") {
      const key = "m360:bookings";
      const existing = JSON.parse(window.localStorage.getItem(key) ?? "[]") as unknown[];
      existing.push({ id, ...input, createdAt: new Date().toISOString() });
      window.localStorage.setItem(key, JSON.stringify(existing));
    }
    return { ok: true, id };
  }
  const res = await fetch(`${API_BASE}/api/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`Booking failed: ${res.status}`);
  return (await res.json()) as { ok: boolean; id: string };
}

export const audioLanguages = [
  { code: "en", label: "English" },
  { code: "ne", label: "Nepali" },
  { code: "hi", label: "Hindi" },
  { code: "sip", label: "Bhutia" },
  { code: "lep", label: "Lepcha" },
] as const;

export type AudioLanguage = (typeof audioLanguages)[number]["code"];

/** Requests narration audio from the Worker TTS endpoint (cached server-side in R2). */
export async function fetchNarrationUrl(
  text: string,
  language: AudioLanguage,
  cacheKey: string,
): Promise<string | null> {
  if (!API_BASE) return null;
  const res = await fetch(`${API_BASE}/api/tts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, language, cacheKey }),
  });
  if (!res.ok) throw new Error(`Narration failed: ${res.status}`);
  const data = (await res.json()) as { url: string };
  return data.url;
}
