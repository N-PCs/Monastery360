# Monastery360

A digital heritage platform for the monasteries of Sikkim — built by [Neel Pandey (N-PCs)](https://github.com/N-PCs).

Features 360° virtual tours, an interactive heritage-circuit map, a searchable archive of manuscripts and murals, multilingual smart audio guides, and a living cultural calendar.

```
frontend  React 19 + TanStack Start + Tailwind      → Vercel
backend   Cloudflare Worker + D1 + R2 + Workers AI  → Cloudflare (see worker/)
```

## Running the frontend

```bash
npm install
npm run dev          # http://localhost:8080
```

With no `VITE_API_BASE_URL` set, the app runs entirely on bundled sample data,
so every page works without a backend. Set it to the deployed Worker URL to
switch all reads to live data:

```bash
cp .env.example .env.local   # then edit VITE_API_BASE_URL
```

## Deploying the frontend to Vercel

1. Import the repository in Vercel.
2. Build command `npm run build`, output directory `.output` (auto-detected for
   TanStack Start / Nitro).
3. Add the environment variable `VITE_API_BASE_URL` pointing at the Worker.
4. Add the resulting Vercel domain to `ALLOWED_ORIGINS` in `worker/wrangler.toml`
   and redeploy the Worker.

## Deploying the backend

See `worker/README.md` for D1 creation, schema loading, R2 media uploads and
the embedding reindex step.

## Feature map

| Area | Where |
| --- | --- |
| 360° tour viewer (Pannellum) | `src/components/PanoramaViewer.tsx`, `/tour/$slug` |
| Interactive map (MapLibre + OSM) | `src/components/MonasteryMap.tsx`, `/map` |
| Smart audio guide, 5 languages | `src/components/AudioGuide.tsx` |
| Archive search | `/archives` → Worker `/api/archives` (vector search) |
| Cultural calendar and bookings | `/calendar` → Worker `/api/events`, `/api/bookings` |
| Sample data / API switch | `src/data/*`, `src/lib/api.ts` |

Audio guides fall back to on-device speech synthesis when no backend is
configured, and cache narration text locally so downloaded guides keep working
in low-connectivity monastery locations.
