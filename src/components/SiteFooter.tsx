import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-lg text-primary">
            Monastery<span className="text-accent">360</span>
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
            A digital heritage platform documenting over two hundred monasteries across
            Sikkim through immersive tours, archives and living calendars.
          </p>
        </div>
        <div>
          <p className="text-eyebrow text-muted-foreground">Explore</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/monasteries" className="hover:text-primary">
                Monastery directory
              </Link>
            </li>
            <li>
              <Link to="/map" className="hover:text-primary">
                Interactive map
              </Link>
            </li>
            <li>
              <Link to="/archives" className="hover:text-primary">
                Digital archives
              </Link>
            </li>
            <li>
              <Link to="/calendar" className="hover:text-primary">
                Cultural calendar
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-eyebrow text-muted-foreground">Preservation</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>Participatory archiving</li>
            <li>Mural conservation records</li>
            <li>Manuscript digitisation</li>
            <li>Community oral histories</li>
          </ul>
        </div>
        <div>
          <p className="text-eyebrow text-muted-foreground">Partners</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>Department of Higher &amp; Technical Education</li>
            <li>Monastic institutions of Sikkim</li>
            <li>Local transport &amp; homestay networks</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/70">
        <div className="mx-auto max-w-6xl px-5 py-5 text-xs text-muted-foreground">
          Monastery360 — built for cultural preservation and responsible tourism in Sikkim.
        </div>
      </div>
    </footer>
  );
}
