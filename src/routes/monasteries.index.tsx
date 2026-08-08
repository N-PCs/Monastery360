import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { MonasteryCard } from "@/components/MonasteryCard";
import { Input } from "@/components/ui/input";
import { districts, sects } from "@/data/monasteries";
import { listMonasteries } from "@/lib/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/monasteries/")({
  head: () => ({
    meta: [
      { title: "Monastery Directory — Monastery360 Sikkim" },
      {
        name: "description",
        content:
          "Browse the monasteries of Sikkim by district, lineage and era, with histories, architecture notes and 360° tours.",
      },
      { property: "og:title", content: "Monastery Directory — Monastery360 Sikkim" },
      {
        property: "og:description",
        content: "Search Sikkim's gompas by district, Buddhist lineage and century of foundation.",
      },
    ],
  }),
  component: MonasteriesPage,
});

const eras = ["17th century", "18th century", "19th century", "20th century"];

function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-xs transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border text-muted-foreground hover:border-primary/50",
      )}
    >
      {children}
    </button>
  );
}

function MonasteriesPage() {
  const [q, setQ] = useState("");
  const [district, setDistrict] = useState("");
  const [sect, setSect] = useState("");
  const [era, setEra] = useState("");

  const { data = [] } = useQuery({
    queryKey: ["monasteries", { q, district, sect, era }],
    queryFn: () => listMonasteries({ q, district, sect, era }),
  });

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <p className="text-eyebrow text-muted-foreground">Directory</p>
      <h1 className="mt-3 font-display text-4xl">Monasteries of Sikkim</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Each entry carries a documented history, architectural notes, conservation status and
        an immersive tour. Filter by district, lineage or century.
      </p>

      <div className="mt-8 space-y-4">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, place or description…"
          className="max-w-md"
        />
        <div className="flex flex-wrap gap-2">
          <Chip active={!district && !sect && !era} onClick={() => { setDistrict(""); setSect(""); setEra(""); }}>
            All
          </Chip>
          {districts.map((d) => (
            <Chip key={d} active={district === d} onClick={() => setDistrict(district === d ? "" : d)}>
              {d}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {sects.map((s) => (
            <Chip key={s} active={sect === s} onClick={() => setSect(sect === s ? "" : s)}>
              {s}
            </Chip>
          ))}
          {eras.map((e) => (
            <Chip key={e} active={era === e} onClick={() => setEra(era === e ? "" : e)}>
              {e}
            </Chip>
          ))}
        </div>
      </div>

      <p className="mt-8 text-xs text-muted-foreground">
        {data.length} {data.length === 1 ? "monastery" : "monasteries"}
      </p>

      <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((m) => (
          <MonasteryCard key={m.slug} monastery={m} />
        ))}
      </div>

      {data.length === 0 && (
        <p className="mt-16 text-center text-sm text-muted-foreground">
          No monastery matches those filters yet.
        </p>
      )}
    </div>
  );
}
