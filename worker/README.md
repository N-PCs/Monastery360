# Monastery360 API (Cloudflare Worker)

Backend for the Monastery360 platform: D1 for structured records, R2 for
panoramas / scans / cached narration, Workers AI for semantic archive search
and text-to-speech. The frontend runs separately on Vercel and talks to this
Worker over HTTPS.

## Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Liveness probe |
| GET | `/api/monasteries?q=&district=&sect=&era=` | Filtered directory |
| GET | `/api/monasteries/:slug` | Full record incl. tour scenes + hotspots |
| GET | `/api/map/points` | Lightweight geo payload for the map |
| GET | `/api/archives?q=&kind=` | Archive search (vector, keyword fallback) |
| GET | `/api/events?month=YYYY-MM` | Cultural calendar |
| POST | `/api/bookings` | Event booking request |
| POST | `/api/tts` | Narration audio, generated once and cached in R2 |
| POST | `/api/admin/reindex` | Rebuild archive embeddings (Bearer `ADMIN_TOKEN`) |

## First deploy

```bash
cd worker
npm install
npx wrangler login

# 1. Create resources
npx wrangler d1 create monastery360          # copy database_id into wrangler.toml
npx wrangler r2 bucket create monastery360-media

# 2. Load schema + seed rows
npx wrangler d1 execute monastery360 --file=./schema.sql --remote

# 3. Set the admin token used by the reindex endpoint
npx wrangler secret put ADMIN_TOKEN

# 4. Publish
npx wrangler deploy
```

Then set `MEDIA_BASE_URL` in `wrangler.toml` to the public URL of the R2
bucket (an `r2.dev` domain or a custom domain), and add your Vercel domain to
`ALLOWED_ORIGINS`.

## Uploading media

R2 object keys referenced by the seed rows:

```
covers/<slug>.jpg
panoramas/<scene-id>.jpg      # equirectangular 2:1, 4096x2048 or larger
archives/<item-id>.jpg
narration/<cacheKey>-<lang>.mp3   # written automatically by /api/tts
```

```bash
npx wrangler r2 object put monastery360-media/panoramas/rumtek-courtyard.jpg \
  --file ./media/rumtek-courtyard.jpg --content-type image/jpeg
```

After adding or editing archive rows, rebuild the search vectors:

```bash
curl -X POST https://<worker-domain>/api/admin/reindex \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

## Local development

```bash
npx wrangler dev --local
npx wrangler d1 execute monastery360 --file=./schema.sql --local
```

Point the frontend at it with `VITE_API_BASE_URL=http://127.0.0.1:8787`.
