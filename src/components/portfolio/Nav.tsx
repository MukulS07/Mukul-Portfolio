import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

const links: { label: string; to: string }[] = [
  { label: "HOME", to: "/" },
  { label: "ABOUT", to: "/about" },
  { label: "EXPERIENCE", to: "/experience" },
  { label: "PROJECTS", to: "/projects" },
  { label: "RESEARCH", to: "/research" },
  { label: "SKILLS", to: "/skills" },
  { label: "CONTACT", to: "/contact" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur border-b border-border">
      <div className="mx-auto max-w-7xl px-5 lg:px-8 h-14 flex items-center justify-between gap-4 font-mono text-[11px] tracking-[0.18em]">
        <Link to="/" className="font-serif-display text-2xl text-foreground leading-none">
          MS<span className="text-accent">.</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-muted-foreground">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: true }}
              activeProps={{ className: "text-foreground" }}
              className="hover:text-foreground transition"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 border border-border text-muted-foreground">
            <span>RECRUITER MODE</span>
            <span className="inline-block h-4 w-7 rounded-full border border-border relative">
              <span className="absolute left-0.5 top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-muted-foreground" />
            </span>
          </div>
          <a
            href="/cv.pdf"
            className="px-3 py-1.5 border border-foreground text-foreground hover:bg-foreground hover:text-background transition"
          >
            RESUME
          </a>
        </div>

        <button
          className="md:hidden text-foreground text-xl"
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "×" : "≡"}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background font-mono text-xs tracking-[0.18em]">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block px-5 py-3 border-b border-border text-muted-foreground hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

export function StatusBar() {
  const [time, setTime] = useState("--:--:--");
  useEffect(() => {
    const tick = () => {
      const fmt = new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit", minute: "2-digit", second: "2-digit",
        hour12: false, timeZone: "Asia/Kolkata",
      });
      setTime(fmt.format(new Date()));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="border-b border-border">
      <div className="mx-auto max-w-7xl px-5 lg:px-8 h-10 flex items-center justify-between font-mono text-[11px] tracking-[0.18em] text-muted-foreground">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 rounded-full bg-accent animate-ping opacity-60" />
              <span className="relative h-2 w-2 rounded-full bg-accent" />
            </span>
            <span className="text-foreground">AVAILABLE</span>
          </span>
          <span className="hidden sm:inline">◉ JAIPUR, IN</span>
          <span className="hidden md:inline">⌁ 32°C · CLEAR</span>
        </div>
        <div className="tabular-nums text-foreground">{time} <span className="text-muted-foreground">IST</span></div>
      </div>
    </div>
  );
}