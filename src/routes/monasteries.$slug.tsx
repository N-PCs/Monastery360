import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense, useState } from "react";
import { MapPin, MountainSnow, Radio, Clock, ArrowRight } from "lucide-react";
import { AudioGuide } from "@/components/AudioGuide";
import { Button } from "@/components/ui/button";
import { getMonastery } from "@/data/monasteries";
import { fetchMonastery } from "@/lib/api";

const ResponsivePanorama = lazy(() => import("@/components/ResponsivePanorama"));

export const Route = createFileRoute("/monasteries/$slug")({
  loader: ({ params }) => {
    const monastery = getMonastery(params.slug);
    if (!monastery) throw notFound();
    return { name: monastery.name, summary: monastery.summary };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Monastery not found — Monastery360" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${loaderData.name} — Monastery360 Sikkim`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.summary },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.summary },
      ],
    };
  },
  component: MonasteryDetail,
});

function MonasteryDetail() {
  const { slug } = Route.useParams();
  const { data: monastery } = useQuery({
    queryKey: ["monastery", slug],
    queryFn: () => fetchMonastery(slug),
    initialData: () => getMonastery(slug),
  });
  const [sceneId, setSceneId] = useState(monastery?.scenes[0]?.id ?? "");

  if (!monastery) return null;
  const activeScene =
    monastery.scenes.find((s) => s.id === sceneId) ?? monastery.scenes[0];

  return (
    <div>
      <div className="relative isolate">
        <img
          src={monastery.cover}
          alt={`${monastery.name} in ${monastery.district}`}
          className="absolute inset-0 -z-10 size-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 to-black/40" />
        <div className="mx-auto max-w-6xl px-5 pb-14 pt-24">
          <Link to="/monasteries" className="text-eyebrow text-gold">
            ← Directory
          </Link>
          <h1 className="mt-4 font-display text-4xl text-white sm:text-5xl">{monastery.name}</h1>
          <p className="mt-2 text-sm text-white/70">
            {monastery.localName} · {monastery.sect} lineage · founded {monastery.founded}
          </p>
          <div className="mt-6 flex flex-wrap gap-5 text-xs text-white/80">
            <span className="flex items-center gap-1.5">
              <MapPin className="size-3.5" /> {monastery.district}
            </span>
            <span className="flex items-center gap-1.5">
              <MountainSnow className="size-3.5" /> {monastery.altitude} m
            </span>
            <span className="flex items-center gap-1.5">
              <Radio className="size-3.5" /> Beacon {monastery.beaconId}
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <section>
            <p className="text-eyebrow text-muted-foreground">Virtual tour</p>
            <h2 className="mt-2 font-display text-2xl">{activeScene?.title}</h2>
            <div className="mt-4 aspect-video overflow-hidden rounded-lg border border-border">
              <ClientOnly
                fallback={<div className="grid size-full place-items-center bg-muted text-sm text-muted-foreground">Preparing 360° view…</div>}
              >
                <Suspense
                  fallback={<div className="grid size-full place-items-center bg-muted text-sm text-muted-foreground">Loading…</div>}
                >
                  <ResponsivePanorama
                    className="size-full"
                    slug={monastery.slug}
                    monasteryName={monastery.name}
                    scenes={monastery.scenes}
                    activeSceneId={activeScene?.id ?? ""}
                    onSceneChange={setSceneId}
                  />
                </Suspense>
              </ClientOnly>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {monastery.scenes.map((scene) => (
                <button
                  key={scene.id}
                  type="button"
                  onClick={() => setSceneId(scene.id)}
                  className={
                    scene.id === activeScene?.id
                      ? "rounded-full border border-primary bg-primary px-3 py-1 text-xs text-primary-foreground"
                      : "rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:border-primary/50"
                  }
                >
                  {scene.title}
                </button>
              ))}
              <Button asChild variant="ghost" size="sm" className="ml-auto">
                <Link to="/tour/$slug" params={{ slug: monastery.slug }}>
                  Full screen tour <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            </div>
          </section>

          <section className="mt-12 space-y-8">
            <div>
              <h2 className="font-display text-2xl">History</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{monastery.history}</p>
            </div>
            <div>
              <h2 className="font-display text-2xl">Architecture</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {monastery.architecture}
              </p>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          {activeScene && (
            <AudioGuide
              title={`${monastery.name} — ${activeScene.title}`}
              text={activeScene.narration}
              cacheKey={`${monastery.slug}:${activeScene.id}`}
            />
          )}

          <div className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-eyebrow text-muted-foreground">
              <Clock className="size-3.5" /> Visiting
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {monastery.visiting}
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-5">
            <p className="text-eyebrow text-muted-foreground">Nearby</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {monastery.nearby.map((n) => (
                <li key={n} className="border-l-2 border-gold/60 pl-3">
                  {n}
                </li>
              ))}
            </ul>
            <Button asChild variant="outline" size="sm" className="mt-4 w-full">
              <Link to="/map">See on the map</Link>
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
