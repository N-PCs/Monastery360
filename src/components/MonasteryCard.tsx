import { Link } from "@tanstack/react-router";
import { MountainSnow } from "lucide-react";
import type { Monastery } from "@/data/monasteries";

export function MonasteryCard({ monastery }: { monastery: Monastery }) {
  return (
    <Link
      to="/monasteries/$slug"
      params={{ slug: monastery.slug }}
      className="group block overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-4/3 overflow-hidden">
        <img
          src={monastery.cover}
          alt={`${monastery.name}, ${monastery.district}`}
          loading="lazy"
          className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-background/85 px-2.5 py-1 text-eyebrow text-primary">
          {monastery.sect}
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-display text-xl leading-snug">{monastery.name}</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          {monastery.localName} · founded {monastery.founded}
        </p>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {monastery.summary}
        </p>
        <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MountainSnow className="size-3.5" />
            {monastery.altitude} m
          </span>
          <span>{monastery.district}</span>
        </div>
      </div>
    </Link>
  );
}
