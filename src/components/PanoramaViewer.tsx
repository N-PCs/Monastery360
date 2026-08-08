import { useEffect, useRef, useState } from "react";
import type { TourScene } from "@/data/monasteries";

interface Props {
  scenes: TourScene[];
  activeSceneId: string;
  onSceneChange: (id: string) => void;
  className?: string;
}

type PannellumViewer = { destroy: () => void };
type PannellumApi = {
  viewer: (el: HTMLElement, config: Record<string, unknown>) => PannellumViewer;
};

export default function PanoramaViewer({
  scenes,
  activeSceneId,
  onSceneChange,
  className,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<PannellumViewer | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const scene = scenes.find((s) => s.id === activeSceneId) ?? scenes[0];

  useEffect(() => {
    let cancelled = false;
    const el = containerRef.current;
    if (!el || !scene) return;

    (async () => {
      try {
        await import("pannellum/build/pannellum.css");
        await import("pannellum/build/pannellum.js");
        const api = (window as unknown as { pannellum?: PannellumApi }).pannellum;
        if (cancelled || !api) {
          if (!api) setError("Panorama engine unavailable.");
          return;
        }
        viewerRef.current?.destroy();
        viewerRef.current = api.viewer(el, {
          type: "equirectangular",
          panorama: scene.image,
          autoLoad: true,
          autoRotate: -1.5,
          showZoomCtrl: true,
          showFullscreenCtrl: true,
          compass: false,
          hfov: 100,
          hotSpots: scene.hotspots.map((h) => ({
            pitch: h.pitch,
            yaw: h.yaw,
            type: "info",
            text: h.label,
            clickHandlerFunc: () => {
              if (h.sceneId) onSceneChange(h.sceneId);
            },
          })),
        });
        setReady(true);
      } catch (err) {
        console.error(err);
        setError("The 360° view could not be loaded in this browser.");
      }
    })();

    return () => {
      cancelled = true;
      viewerRef.current?.destroy();
      viewerRef.current = null;
    };
  }, [scene, onSceneChange]);

  return (
    <div className={className}>
      <div className="relative h-full w-full overflow-hidden bg-black">
        <div ref={containerRef} className="h-full w-full" />
        {!ready && !error && (
          <div className="absolute inset-0 grid place-items-center text-sm text-white/70">
            Loading 360° view…
          </div>
        )}
        {error && (
          <div className="absolute inset-0 grid place-items-center px-6 text-center text-sm text-white/80">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
