import { createFileRoute, ClientOnly, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { listMapPoints } from "@/lib/api";

const MonasteryMap = lazy(() => import("@/components/MonasteryMap"));

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Interactive Monastery Map — Monastery360 Sikkim" },
      {
        name: "description",
        content:
          "Geo-tagged map of Sikkim's monasteries with the heritage circuit route, altitudes, lineages and nearby attractions.",
      },
      { property: "og:title", content: "Interactive Monastery Map — Monastery360 Sikkim" },
      {
        property: "og:description",
        content: "Plan a monastery circuit across East, West, North and South Sikkim.",
      },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  const navigate = useNavigate();
  const { data: points = [] } = useQuery({
    queryKey: ["map-points"],
    queryFn: () => listMapPoints(),
  });

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <p className="text-eyebrow text-muted-foreground">Geospatial</p>
      <h1 className="mt-3 font-display text-4xl">The heritage circuit</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Every monastery is geo-tagged with altitude and lineage. The dashed line traces a
        suggested circuit linking the sites; tap any marker to open its record.
      </p>

      <div className="mt-8 overflow-hidden rounded-lg border border-border">
        <ClientOnly
          fallback={<div className="grid h-[560px] place-items-center bg-muted text-sm text-muted-foreground">Loading map…</div>}
        >
          <Suspense
            fallback={<div className="grid h-[560px] place-items-center bg-muted text-sm text-muted-foreground">Loading map…</div>}
          >
            <MonasteryMap
              className="h-[560px] w-full"
              points={points}
              onSelect={(slug) => navigate({ to: "/monasteries/$slug", params: { slug } })}
            />
          </Suspense>
        </ClientOnly>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {points.map((p) => (
          <button
            key={p.slug}
            type="button"
            onClick={() => navigate({ to: "/monasteries/$slug", params: { slug: p.slug } })}
            className="rounded-lg border border-border bg-card p-4 text-left transition-colors hover:border-primary/60"
          >
            <p className="font-display text-lg">{p.name}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {p.district} · {p.sect} · {p.altitude} m
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {p.lat.toFixed(4)}, {p.lng.toFixed(4)}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
