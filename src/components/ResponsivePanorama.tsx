import PanoramaViewer from "@/components/PanoramaViewer";
import type { TourScene } from "@/data/monasteries";
import { getMonastery } from "@/data/monasteries";

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
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
  const monastery = getMonastery(slug);

  // If a Google Maps API Key is provided and the monastery has a custom street view URL, use Google Maps Embed
  if (apiKey && monastery?.streetViewUrl) {
    const embedUrl = monastery.streetViewUrl.includes("panoid=")
      ? `https://www.google.com/maps/embed/v1/streetview?key=${apiKey}&pano=${new URL(monastery.streetViewUrl).searchParams.get("panoid")}`
      : `https://www.google.com/maps/embed/v1/streetview?key=${apiKey}&location=${monastery.lat},${monastery.lng}`;

    return (
      <div className={className}>
        <div className="relative h-full w-full overflow-hidden bg-black">
          <iframe
            title={`${monasteryName} Street View`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="eager"
            src={embedUrl}
          ></iframe>
        </div>
      </div>
    );
  }

  // Otherwise, use the built-in 360° Pannellum viewer (works offline, no API key needed, zero errors)
  return (
    <PanoramaViewer
      scenes={scenes}
      activeSceneId={activeSceneId}
      onSceneChange={onSceneChange}
      className={className}
    />
  );
}
