import { useEffect, useState } from "react";

const links = [
  { label: "home", href: "#home" },
  { label: "about", href: "#about" },
  { label: "skills", href: "#skills" },
  { label: "projects", href: "#projects" },
  { label: "research", href: "#research" },
  { label: "experience", href: "#experience" },
  { label: "contact", href: "#contact" },
];

export function Nav() {
  const [time, setTime] = useState("--:--:--");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const fmt = new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "Asia/Kolkata",
      });
      setTime(fmt.format(d));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] max-w-6xl">
      <nav className="glass-panel font-mono text-xs px-4 py-2.5 flex items-center justify-between gap-4">
        <a href="#home" className="flex items-center gap-2 group">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border text-cyan-accent font-semibold tracking-tight">
            MS
          </span>
          <span className="hidden sm:inline text-muted-foreground group-hover:text-foreground transition">
            mukul.sharma
            <span className="text-cyan-accent">_</span>
          </span>
        </a>

        <ul className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="px-2.5 py-1.5 rounded-md text-muted-foreground hover:text-cyan-accent hover:bg-white/5 transition"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 rounded-full bg-green-live animate-pulse-ring" />
              <span className="relative h-2 w-2 rounded-full bg-green-live" />
            </span>
            <span>Available</span>
            <span className="text-dim">·</span>
            <span>Jaipur, IN</span>
            <span className="text-dim">·</span>
            <span className="text-foreground tabular-nums">{time}</span>
            <span className="text-dim">IST</span>
          </div>
          <button
            className="md:hidden text-foreground"
            aria-label="Toggle menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? "×" : "≡"}
          </button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden glass-panel mt-2 font-mono text-sm p-3 space-y-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block px-3 py-2 rounded-md text-muted-foreground hover:text-cyan-accent hover:bg-white/5"
            >
              · {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}