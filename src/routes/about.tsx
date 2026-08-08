import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About the Project — Monastery360 Sikkim" },
      {
        name: "description",
        content:
          "Monastery360 digitises Sikkim's monasteries for tourism and cultural preservation: virtual tours, archives, geospatial data and community archiving.",
      },
      { property: "og:title", content: "About the Project — Monastery360 Sikkim" },
      {
        property: "og:description",
        content:
          "How Monastery360 documents, preserves and opens access to Sikkim's monastic heritage.",
      },
    ],
  }),
  component: AboutPage,
});

const impact = [
  {
    title: "Accessibility",
    body: "Monasteries at 2,000 metres on unpaved roads become reachable from anywhere, in five languages, with narration for visitors who cannot make the climb.",
  },
  {
    title: "Preservation",
    body: "Murals crack, manuscripts fade, and oral tradition thins with each generation. Digitisation creates a record that survives the object.",
  },
  {
    title: "Community",
    body: "Local custodians contribute photographs, recordings and provenance notes, so the archive is built with the communities rather than about them.",
  },
  {
    title: "Education",
    body: "Researchers and students get structured, citable access to material that previously required travel and permission letters.",
  },
];

function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14">
      <p className="text-eyebrow text-muted-foreground">The project</p>
      <h1 className="mt-3 font-display text-4xl">
        A unified record of Sikkim's monastic heritage
      </h1>
      <p className="mt-6 leading-relaxed text-muted-foreground">
        Sikkim holds more than two hundred monasteries, many founded in the seventeenth and
        eighteenth centuries. Individual efforts have preserved murals and digitised rare
        documents, but the material has been scattered across institutions and largely
        inaccessible to the public. Monastery360 brings it into one platform: immersive tours of
        the buildings, a searchable archive of what they hold, a geospatial layer for planning
        real visits, and a calendar of the rituals that keep the tradition living.
      </p>

      <div className="rule-gold my-12" aria-hidden />

      <h2 className="font-display text-2xl">Impact</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {impact.map((item) => (
          <div key={item.title} className="rounded-lg border border-border bg-card p-5">
            <h3 className="font-display text-lg">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
          </div>
        ))}
      </div>

      <div className="rule-gold my-12" aria-hidden />

      <h2 className="font-display text-2xl">How it is built</h2>
      <ul className="mt-6 space-y-3 text-sm leading-relaxed text-muted-foreground">
        <li className="border-l-2 border-gold/60 pl-4">
          <strong className="text-foreground">Virtual tours</strong> — equirectangular panoramas
          rendered in the browser with navigable hotspots between viewpoints.
        </li>
        <li className="border-l-2 border-gold/60 pl-4">
          <strong className="text-foreground">Geospatial layer</strong> — vector mapping with
          geo-tagged sites, altitude data and a suggested heritage circuit.
        </li>
        <li className="border-l-2 border-gold/60 pl-4">
          <strong className="text-foreground">Archives</strong> — catalogued scans with era,
          language, material and conservation notes, retrieved by semantic search.
        </li>
        <li className="border-l-2 border-gold/60 pl-4">
          <strong className="text-foreground">Audio guides</strong> — narration generated per
          language and cached, triggered on site by GPS or Bluetooth beacon, and downloadable for
          areas without signal.
        </li>
        <li className="border-l-2 border-gold/60 pl-4">
          <strong className="text-foreground">Stakeholders</strong> — the Department of Higher
          &amp; Technical Education, monastic institutions, local transport and homestay
          networks, and travellers.
        </li>
      </ul>
    </div>
  );
}
