import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Compass, Landmark, ScrollText, CalendarDays } from "lucide-react";
import heroImage from "@/assets/hero-monastery.jpg";
import { MonasteryCard } from "@/components/MonasteryCard";
import { Button } from "@/components/ui/button";
import { listMonasteries } from "@/lib/api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Monastery360 — Sikkim's Monasteries in 360°" },
      {
        name: "description",
        content:
          "Explore over 200 monasteries of Sikkim through 360° virtual tours, geo-tagged maps, digital archives and multilingual audio guides.",
      },
      { property: "og:title", content: "Monastery360 — Sikkim's Monasteries in 360°" },
      {
        property: "og:description",
        content:
          "Immersive virtual tours, digital archives and a living cultural calendar for the monasteries of Sikkim.",
      },
    ],
  }),
  component: Home,
});

const pillars = [
  {
    icon: Compass,
    title: "Virtual tours",
    body: "Step inside courtyards and prayer halls in 360°, with narrated hotspots guiding your walk.",
    to: "/monasteries" as const,
    cta: "Start a tour",
  },
  {
    icon: Landmark,
    title: "Interactive map",
    body: "Every monastery geo-tagged with routes, altitudes and nearby attractions across four districts.",
    to: "/map" as const,
    cta: "Open the map",
  },
  {
    icon: ScrollText,
    title: "Digital archives",
    body: "Manuscripts, murals and royal documents, searchable by meaning rather than keyword alone.",
    to: "/archives" as const,
    cta: "Browse archives",
  },
  {
    icon: CalendarDays,
    title: "Cultural calendar",
    body: "Losar, Bumchu, Pang Lhabsol and the cham dances — with participation details for visitors.",
    to: "/calendar" as const,
    cta: "See what's on",
  },
];

function Home() {
  const { data: featured = [] } = useQuery({
    queryKey: ["monasteries", "featured"],
    queryFn: () => listMonasteries(),
  });

  return (
    <>
      <section className="relative isolate overflow-hidden">
        <img
          src={heroImage}
          alt="A Sikkimese monastery at dawn above a valley of cloud with the Himalaya beyond"
          width={1920}
          height={1088}
          className="absolute inset-0 -z-10 size-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/55 to-black/30" />
        <div className="mx-auto max-w-6xl px-5 pb-24 pt-28 sm:pb-32 sm:pt-40">
          <p className="text-eyebrow text-gold">Government of Sikkim · Heritage initiative</p>
          <h1 className="mt-5 max-w-3xl font-display text-4xl leading-[1.1] text-white sm:text-6xl">
            Two hundred monasteries. Three centuries of practice. One doorway.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80">
            Monastery360 documents the gompas of Sikkim in immersive 360°, alongside the
            manuscripts, murals and rituals that keep them alive — for travellers,
            researchers and the communities who tend them.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/monasteries">
                Explore monasteries
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white"
            >
              <Link to="/map">View the map</Link>
            </Button>
          </div>
        </div>
        <div className="prayer-flags h-1 w-full" aria-hidden />
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p) => (
            <div key={p.title} className="rounded-lg border border-border bg-card p-6">
              <p.icon className="size-5 text-primary" />
              <h2 className="mt-4 font-display text-xl">{p.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              <Link
                to={p.to}
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2"
              >
                {p.cta}
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-8">
        <div className="rule-gold mb-10" aria-hidden />
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-eyebrow text-muted-foreground">Featured</p>
            <h2 className="mt-2 font-display text-3xl">Begin with these</h2>
          </div>
          <Link to="/monasteries" className="text-sm font-semibold text-primary">
            All monasteries
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.slice(0, 3).map((m) => (
            <MonasteryCard key={m.slug} monastery={m} />
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-5">
        <div className="grid gap-8 rounded-lg border border-border bg-secondary/40 p-10 sm:grid-cols-3">
          {[
            { figure: "200+", label: "monasteries across four districts" },
            { figure: "1641", label: "earliest foundation still standing" },
            { figure: "5", label: "narration languages in the audio guide" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-4xl text-primary">{stat.figure}</p>
              <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
