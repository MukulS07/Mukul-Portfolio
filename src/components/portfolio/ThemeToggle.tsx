import { useEffect, useState } from "react";

const KEY = "theme-mode";
type Mode = "starwars" | "ironman";

function applyMode(m: Mode) {
  const b = document.body;
  b.classList.toggle("theme-ironman", m === "ironman");
  b.classList.toggle("theme-starwars", m === "starwars");
}

/** Plays a one-shot HUD "boot" overlay during a mode swap. */
function playTransform() {
  const el = document.createElement("div");
  el.className = "mk-transform";
  el.innerHTML = `
    <div class="mk-reactor"></div>
    <div class="mk-rings">
      <span></span><span></span><span></span>
    </div>
    <div class="mk-readout">
      <div>SUIT BOOT · SEQUENCE INITIATED</div>
      <div>ARC REACTOR · ONLINE</div>
      <div>J.A.R.V.I.S · STANDING BY</div>
    </div>
  `;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1800);
}

export function ThemeToggle() {
  const [mode, setMode] = useState<Mode>("starwars");

  useEffect(() => {
    const stored = (localStorage.getItem(KEY) as Mode) || "starwars";
    setMode(stored);
    applyMode(stored);
  }, []);

  const swap = (next: Mode) => {
    if (next === mode) return;
    setMode(next);
    localStorage.setItem(KEY, next);
    playTransform();
    // apply mid-flight so the overlay covers the swap
    setTimeout(() => applyMode(next), 350);
  };

  return (
    <div
      role="tablist"
      aria-label="Theme mode"
      className="hidden md:flex items-center border border-border font-mono text-[10px] tracking-[0.2em]"
    >
      <button
        role="tab"
        aria-selected={mode === "starwars"}
        onClick={() => swap("starwars")}
        className={`px-3 py-1.5 transition ${
          mode === "starwars"
            ? "bg-accent/15 text-accent"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        SW
      </button>
      <span className="h-5 w-px bg-border" />
      <button
        role="tab"
        aria-selected={mode === "ironman"}
        onClick={() => swap("ironman")}
        className={`px-3 py-1.5 transition flex items-center gap-1.5 ${
          mode === "ironman"
            ? "bg-[oklch(0.68_0.22_30/0.18)] text-[oklch(0.85_0.18_75)]"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-[oklch(0.78_0.2_220)] shadow-[0_0_6px_oklch(0.78_0.2_220)]" />
        MK-VII
      </button>
    </div>
  );
}