import { createFileRoute, ClientOnly, Link, notFound } from "@tanstack/react-router";
import { lazy, Suspense, useState } from "react";
import { X } from "lucide-react";
import { getMonastery } from "@/data/monasteries";

const ResponsivePanorama = lazy(() => import("@/components/ResponsivePanorama"));

export const Route = createFileRoute("/tour/$slug")({
  loader: ({ params }) => {
    const monastery = getMonastery(params.slug);
    if (!monastery) throw notFound();
    return { name: monastery.name };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Tour not found — Monastery360" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `360° Tour of ${loaderData.name} — Monastery360`;
    const description = `Walk through ${loaderData.name} in immersive 360°, with narrated hotspots in five languages.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: TourPage,
});

function TourPage() {
  const { slug } = Route.useParams();
  const monastery = getMonastery(slug);
  const [sceneId, setSceneId] = useState(monastery?.scenes[0]?.id ?? "");

  if (!monastery) return null;
  const activeScene = monastery.scenes.find((s) => s.id === sceneId) ?? monastery.scenes[0];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      <div className="flex items-center justify-between px-5 py-3 text-white">
        <div>
          <p className="font-display text-lg">{monastery.name}</p>
          <p className="text-xs text-white/60">{activeScene?.title}</p>
        </div>
        <Link
          to="/monasteries/$slug"
          params={{ slug: monastery.slug }}
          className="rounded-full border border-white/30 p-2 hover:bg-white/10"
          aria-label="Exit tour"
        >
          <X className="size-4" />
        </Link>
      </div>

      <div className="relative flex-1">
        <ClientOnly fallback={<div className="grid size-full place-items-center text-sm text-white/60">Preparing 360° view…</div>}>
          <Suspense fallback={<div className="grid size-full place-items-center text-sm text-white/60">Loading…</div>}>
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

      <div className="flex gap-2 overflow-x-auto px-5 py-4">
        {monastery.scenes.map((scene) => (
          <button
            key={scene.id}
            type="button"
            onClick={() => setSceneId(scene.id)}
            className={
              scene.id === activeScene?.id
                ? "whitespace-nowrap rounded-full bg-white px-4 py-1.5 text-xs text-black"
                : "whitespace-nowrap rounded-full border border-white/30 px-4 py-1.5 text-xs text-white/80"
            }
          >
            {scene.title}
          </button>
        ))}
      </div>
    </div>
  );
}
