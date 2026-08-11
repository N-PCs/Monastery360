import { useMemo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import PanoramaViewer from "@/components/PanoramaViewer";
import type { TourScene } from "@/data/monasteries";

const desktopPhotoBySlug: Record<string, string> = {
  dubdi: "/dubdi.jpeg",
  enchey: "/enchey.jpeg",
  pemayangtse: "/pemayangtse.jpeg",
  phodong: "/phodong.jpeg",
  rumtek: "/rumtek.jpeg",
  tashiding: "/tashiding.jpeg",
};

interface Props {
  slug: string;
  monasteryName: string;
  scenes: TourScene[];
  activeSceneId: string;
  onSceneChange: (id: string) => void;
  className?: string;
}

export default function ResponsivePanorama({
  slug,
  monasteryName,
  scenes,
  activeSceneId,
  onSceneChange,
  className,
}: Props) {
  const isMobile = useIsMobile();
  const activeScene = useMemo(
    () => scenes.find((scene) => scene.id === activeSceneId) ?? scenes[0],
    [activeSceneId, scenes],
  );
  const desktopPhoto = desktopPhotoBySlug[slug];

  if (!isMobile && desktopPhoto) {
    return (
      <div className={className}>
        <div className="relative h-full w-full overflow-hidden bg-black">
          <img
            src={desktopPhoto}
            alt={`${monasteryName} — ${activeScene?.title}`}
            className="h-full w-full object-contain"
          />
          <div className="absolute inset-x-0 bottom-0 px-4 pb-4">
            <div className="inline-flex rounded-full bg-black/70 px-3 py-1 text-xs text-white">
              {activeScene?.title}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PanoramaViewer
      scenes={scenes}
      activeSceneId={activeSceneId}
      onSceneChange={onSceneChange}
      className={className}
    />
  );
}
