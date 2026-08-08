import { useEffect, useRef } from "react";
import type { Map as MapLibreMap } from "maplibre-gl";
import type { MapPoint } from "@/lib/api";

interface Props {
  points: MapPoint[];
  onSelect?: (slug: string) => void;
  showRoute?: boolean;
  className?: string;
}

export default function MonasteryMap({ points, onSelect, showRoute = true, className }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  useEffect(() => {
    let cancelled = false;
    const el = containerRef.current;
    if (!el) return;

    (async () => {
      const maplibregl = await import("maplibre-gl");
      await import("maplibre-gl/dist/maplibre-gl.css");
      if (cancelled) return;

      const map = new maplibregl.Map({
        container: el,
        style: {
          version: 8,
          sources: {
            osm: {
              type: "raster",
              tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
              tileSize: 256,
              maxzoom: 19,
              attribution: "© OpenStreetMap contributors",
            },
          },
          layers: [{ id: "osm", type: "raster", source: "osm" }],
        },
        center: [88.45, 27.35],
        zoom: 8.4,
        attributionControl: { compact: true },
      });
      mapRef.current = map;
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
      map.addControl(new maplibregl.ScaleControl({ unit: "metric" }), "bottom-left");

      map.on("load", () => {
        if (showRoute && points.length > 1) {
          map.addSource("heritage-circuit", {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: points.map((p) => [p.lng, p.lat]),
              },
            },
          });
          map.addLayer({
            id: "heritage-circuit-line",
            type: "line",
            source: "heritage-circuit",
            paint: {
              "line-color": "#b4442a",
              "line-width": 2,
              "line-dasharray": [2, 2],
              "line-opacity": 0.8,
            },
          });
        }

        points.forEach((p) => {
          const node = document.createElement("button");
          node.type = "button";
          node.setAttribute("aria-label", p.name);
          node.style.cssText =
            "width:18px;height:18px;border-radius:9999px;background:#b4442a;border:2px solid #f2d38a;box-shadow:0 1px 6px rgba(0,0,0,.4);cursor:pointer";
          node.addEventListener("click", () => onSelectRef.current?.(p.slug));

          new maplibregl.Marker({ element: node })
            .setLngLat([p.lng, p.lat])
            .setPopup(
              new maplibregl.Popup({ offset: 16, closeButton: false }).setHTML(
                `<div style="font-family:Karla,sans-serif;min-width:170px">
                   <div style="font-weight:700;margin-bottom:2px">${p.name}</div>
                   <div style="font-size:12px;color:#6b5a4c">${p.sect} · ${p.district}</div>
                   <div style="font-size:12px;color:#6b5a4c">${p.altitude} m</div>
                 </div>`,
              ),
            )
            .addTo(map);
        });
      });
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [points, showRoute]);

  return <div ref={containerRef} className={className} />;
}
