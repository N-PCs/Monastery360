import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { archiveKinds } from "@/data/archives";
import { getMonastery } from "@/data/monasteries";
import { listArchives } from "@/lib/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/archives")({
  head: () => ({
    meta: [
      { title: "Digital Archives — Monastery360 Sikkim" },
      {
        name: "description",
        content:
          "Scanned manuscripts, murals, royal documents and ritual records from Sikkim's monasteries, searchable by meaning.",
      },
      { property: "og:title", content: "Digital Archives — Monastery360 Sikkim" },
      {
        property: "og:description",
        content:
          "Explore digitised manuscripts, murals and monastic records with AI-assisted semantic search.",
      },
    ],
  }),
  component: ArchivesPage,
});

function ArchivesPage() {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [kind, setKind] = useState("");

  const { data = [], isFetching } = useQuery({
    queryKey: ["archives", submitted, kind],
    queryFn: () => listArchives(submitted, kind || undefined),
  });

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <p className="text-eyebrow text-muted-foreground">Preservation</p>
      <h1 className="mt-3 font-display text-4xl">Digital archives</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Manuscripts, murals, land grants and ritual records, catalogued with era, language and
        material. Search describes what you are looking for — meaning is matched, not just words.
      </p>

      <form
        className="mt-8 flex max-w-xl gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(query);
        }}
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. medicinal plants, protector deities, land disputes"
            className="pl-9"
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground"
        >
          <Sparkles className="size-4" />
          Search
        </button>
      </form>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setKind("")}
          className={cn(
            "rounded-full border px-3.5 py-1.5 text-xs",
            !kind ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground",
          )}
        >
          All types
        </button>
        {archiveKinds.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setKind(kind === k ? "" : k)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs",
              kind === k
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:border-primary/50",
            )}
          >
            {k}
          </button>
        ))}
      </div>

      <p className="mt-8 text-xs text-muted-foreground">
        {isFetching ? "Searching…" : `${data.length} items`}
      </p>

      <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((item) => (
          <article key={item.id} className="overflow-hidden rounded-lg border border-border bg-card">
            <div className="aspect-4/3 overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className="size-full object-cover"
              />
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 text-eyebrow text-muted-foreground">
                <span className="text-primary">{item.kind}</span>
                <span>·</span>
                <span>{item.era}</span>
              </div>
              <h2 className="mt-2 font-display text-lg leading-snug">{item.title}</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {getMonastery(item.monasterySlug)?.name ?? item.monasterySlug} · {item.language}
              </p>
              <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {item.tags.map((t) => (
                  <span key={t} className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] text-secondary-foreground">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      {!isFetching && data.length === 0 && (
        <p className="mt-16 text-center text-sm text-muted-foreground">
          Nothing in the archive matches that search yet.
        </p>
      )}
    </div>
  );
}
