import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { FXToggle } from "./FXToggle";

const links: { label: string; to: string }[] = [
  { label: "HOME", to: "/" },
  { label: "ABOUT", to: "/about" },
  { label: "EXPERIENCE", to: "/experience" },
  { label: "PROJECTS", to: "/projects" },
  { label: "RESEARCH", to: "/research" },
  { label: "SKILLS", to: "/skills" },
  { label: "AI BOT", to: "/chatbot" },
  { label: "RESUME", to: "/resume" },
  { label: "CONTACT", to: "/contact" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [avengers, setAvengers] = useState(false);
  const [fxEnabled, setFxEnabled] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("avengers-mode") === "1";
    setAvengers(stored);
    document.body.classList.toggle("avengers", stored);

    const storedFx = localStorage.getItem("fx-enabled");
    const enabled = storedFx === null ? true : storedFx === "1";
    setFxEnabled(enabled);
    document.body.classList.toggle("fx-off", !enabled);
  }, []);

  const toggleAvengers = () => {
    const next = !avengers;
    setAvengers(next);
    localStorage.setItem("avengers-mode", next ? "1" : "");
    document.body.classList.toggle("avengers", next);
  };

  const toggleFX = () => {
    const next = !fxEnabled;
    setFxEnabled(next);
    localStorage.setItem("fx-enabled", next ? "1" : "0");
    document.body.classList.toggle("fx-off", !next);
  };

  const visibleLinks = links;

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur border-b border-border">
      <div className="mx-auto max-w-7xl px-5 lg:px-8 h-14 flex items-center justify-between gap-4 font-mono text-[11px] tracking-[0.18em]">
        <div className="flex items-center gap-3">
          <Link to="/" className="font-serif-display text-2xl text-foreground leading-none">
            MS<span className="text-accent">.</span>
          </Link>
          <div className={`hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded border font-mono text-[8px] tracking-[0.2em] select-none ${
            avengers 
              ? "border-[#ef4444]/30 bg-[#ef4444]/5 text-[#ef4444]/90" 
              : "border-accent/20 bg-accent/5 text-accent/85"
          }`}>
            <span className={`h-1 w-1 rounded-full animate-pulse ${
              avengers ? "bg-[#ef4444] shadow-[0_0_6px_#ef4444]" : "bg-accent shadow-[0_0_6px_var(--accent)]"
            }`} />
            <span>{avengers ? "PORTFOLIO // HUD" : "PORTFOLIO // SYSTEM"}</span>
          </div>
        </div>

        {!avengers && (
          <nav className="hidden md:flex items-center gap-7 text-muted-foreground">
            {visibleLinks.map((l) => (
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
        )}

        <div className="hidden md:flex items-center gap-3">
          <FXToggle on={fxEnabled} onToggle={toggleFX} />
          <button
            onClick={toggleAvengers}
            className="flex items-center gap-2 px-3 py-1.5 border border-border text-muted-foreground hover:text-foreground hover:border-accent transition font-mono text-[11px] tracking-[0.18em]"
            title="Toggle Avengers Theme"
          >
            <span>AVENGER MODE</span>
            <span
              className={`inline-block h-4 w-7 rounded-full border border-border relative transition-colors ${
                avengers ? "bg-accent/20 border-accent" : ""
              }`}
            >
              <span
                className={`absolute top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full transition-all ${
                  avengers
                    ? "left-3 bg-accent shadow-[0_0_8px_var(--accent)]"
                    : "left-0.5 bg-muted-foreground"
                }`}
              />
            </span>
            <span className={avengers ? "text-accent" : ""}>{avengers ? "ON" : "OFF"}</span>
          </button>
          <a
            href="/cv.pdf"
            target="_blank"
            rel="noreferrer"
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
          {!avengers &&
            visibleLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="block px-5 py-3 border-b border-border text-muted-foreground hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
          {/* Mobile Toggles Panel */}
          <div className="flex flex-col gap-3 px-5 py-4 border-b border-border bg-black/20">
            <div className="flex items-center justify-between text-muted-foreground">
              <span>SYSTEM FX</span>
              <FXToggle on={fxEnabled} onToggle={toggleFX} />
            </div>
            <div className="flex items-center justify-between text-muted-foreground">
              <span>AVENGER MODE</span>
              <button
                onClick={toggleAvengers}
                className="flex items-center gap-2 px-3 py-1.5 border border-border text-[11px]"
              >
                <span
                  className={`inline-block h-4 w-7 rounded-full border border-border relative transition-colors ${
                    avengers ? "bg-accent/20 border-accent" : ""
                  }`}
                >
                  <span
                    className={`absolute top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full transition-all ${
                      avengers ? "left-3 bg-accent" : "left-0.5 bg-muted-foreground"
                    }`}
                  />
                </span>
                <span className={avengers ? "text-accent font-semibold" : ""}>
                  {avengers ? "ON" : "OFF"}
                </span>
              </button>
            </div>
          </div>
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
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "Asia/Kolkata",
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
        <div className="tabular-nums text-foreground">
          {time} <span className="text-muted-foreground">IST</span>
        </div>
      </div>
    </div>
  );
}
