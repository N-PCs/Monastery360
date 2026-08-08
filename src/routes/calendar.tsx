import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CalendarDays, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getMonastery } from "@/data/monasteries";
import { createBooking, listEvents } from "@/lib/api";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Cultural Calendar — Monastery360 Sikkim" },
      {
        name: "description",
        content:
          "Festivals, rituals and cham dances at Sikkim's monasteries — Losar, Bumchu, Saga Dawa, Pang Lhabsol — with visitor participation details.",
      },
      { property: "og:title", content: "Cultural Calendar — Monastery360 Sikkim" },
      {
        property: "og:description",
        content: "Plan a visit around Sikkim's monastic festivals and ritual calendar.",
      },
    ],
  }),
  component: CalendarPage,
});

function formatDate(date: string, endDate?: string) {
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
  const start = new Date(`${date}T00:00:00Z`).toLocaleDateString("en-IN", { ...opts, timeZone: "UTC" });
  if (!endDate) return start;
  const end = new Date(`${endDate}T00:00:00Z`).toLocaleDateString("en-IN", { ...opts, timeZone: "UTC" });
  return `${start} – ${end}`;
}

function CalendarPage() {
  const { data: events = [] } = useQuery({ queryKey: ["events"], queryFn: () => listEvents() });
  const [selected, setSelected] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", people: 1, note: "" });

  const booking = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      toast.success("Interest registered — the monastery office will confirm by email.");
      setSelected(null);
      setForm({ name: "", email: "", people: 1, note: "" });
    },
    onError: () => toast.error("Could not register interest. Please try again."),
  });

  return (
    <div className="mx-auto max-w-5xl px-5 py-14">
      <p className="text-eyebrow text-muted-foreground">Living heritage</p>
      <h1 className="mt-3 font-display text-4xl">Cultural calendar</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        The monastic year is measured in ritual. Festivals move with the Tibetan lunar calendar,
        so dates shift each year — register interest and the monastery office confirms the exact
        timing closer to the day.
      </p>

      <ol className="mt-10 space-y-4">
        {events.map((event) => {
          const monastery = getMonastery(event.monasterySlug);
          return (
            <li key={event.id} className="rounded-lg border border-border bg-card p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-eyebrow text-muted-foreground">
                    <CalendarDays className="size-3.5 text-primary" />
                    {formatDate(event.date, event.endDate)}
                    <span>·</span>
                    <span className="text-primary">{event.category}</span>
                  </div>
                  <h2 className="mt-2 font-display text-2xl">{event.name}</h2>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="size-3.5" />
                    {monastery?.name} · {monastery?.district}
                  </p>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    {event.description}
                  </p>
                </div>
                {event.openToVisitors ? (
                  <Button
                    size="sm"
                    variant={selected === event.id ? "secondary" : "default"}
                    onClick={() => setSelected(selected === event.id ? null : event.id)}
                  >
                    {selected === event.id ? "Close" : "Register interest"}
                  </Button>
                ) : (
                  <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                    Closed retreat
                  </span>
                )}
              </div>

              {selected === event.id && (
                <form
                  className="mt-6 grid gap-3 border-t border-border pt-6 sm:grid-cols-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    booking.mutate({ eventId: event.id, ...form });
                  }}
                >
                  <Input
                    required
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  <Input
                    required
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                  <Input
                    required
                    type="number"
                    min={1}
                    max={20}
                    value={form.people}
                    onChange={(e) => setForm({ ...form, people: Number(e.target.value) })}
                  />
                  <Textarea
                    className="sm:col-span-2"
                    placeholder="Anything the monastery office should know (accessibility, language, transport)"
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                  />
                  <Button type="submit" className="sm:col-span-2" disabled={booking.isPending}>
                    {booking.isPending ? "Sending…" : "Send request"}
                  </Button>
                </form>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
