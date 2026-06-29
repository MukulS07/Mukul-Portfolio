import { useEffect, useState } from "react";

/**
 * MK-VII helmet HUD overlay — corner reticles, targeting brackets,
 * telemetry strips, and a sweeping radar arc. Only renders while
 * body.theme-ironman is active.
 */
export function IronManHUD() {
  const [active, setActive] = useState(false);
  const [now, setNow] = useState("--:--:--");

  useEffect(() => {
    const sync = () => setActive(document.body.classList.contains("theme-ironman"));
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const f = (n: number) => String(n).padStart(2, "0");
      setNow(`${f(d.getHours())}:${f(d.getMinutes())}:${f(d.getSeconds())}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!active) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-40 ironman-hud">
      {/* Corner gold reticles */}
      {(["tl", "tr", "bl", "br"] as const).map((p) => (
        <div key={p} className={`mk-reticle mk-reticle-${p}`}>
          <svg viewBox="0 0 80 80" className="h-20 w-20">
            <path d="M2 30 V2 H30" />
            <path d="M50 2 H78 V30" />
            <path d="M78 50 V78 H50" />
            <path d="M30 78 H2 V50" />
            <circle cx="40" cy="40" r="3" />
            <circle cx="40" cy="40" r="14" strokeDasharray="2 4" />
          </svg>
        </div>
      ))}

      {/* Top telemetry strip */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-6 font-mono text-[10px] tracking-[0.28em] text-[oklch(0.85_0.18_75)]">
        <span>MK-VII</span>
        <span className="text-[oklch(0.78_0.2_220)]">◉ REACTOR 100%</span>
        <span>{now}</span>
        <span className="text-[oklch(0.78_0.2_220)]">⌁ REPULSOR ARMED</span>
      </div>

      {/* Side ladder ticks (altitude) */}
      <div className="absolute left-2 top-1/4 bottom-1/4 flex flex-col justify-between">
        {Array.from({ length: 9 }).map((_, i) => (
          <span
            key={i}
            className={`block h-px ${i % 2 ? "w-2" : "w-4"} bg-[oklch(0.85_0.18_75/0.7)]`}
          />
        ))}
      </div>
      <div className="absolute right-2 top-1/4 bottom-1/4 flex flex-col justify-between items-end">
        {Array.from({ length: 9 }).map((_, i) => (
          <span
            key={i}
            className={`block h-px ${i % 2 ? "w-2" : "w-4"} bg-[oklch(0.85_0.18_75/0.7)]`}
          />
        ))}
      </div>

      {/* Radar sweep bottom-left */}
      <div className="absolute bottom-6 left-6 h-28 w-28 rounded-full border border-[oklch(0.78_0.2_220/0.5)] mk-radar">
        <span className="absolute inset-3 rounded-full border border-[oklch(0.78_0.2_220/0.3)]" />
        <span className="absolute inset-6 rounded-full border border-[oklch(0.78_0.2_220/0.2)]" />
        <span className="absolute top-1/2 left-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[oklch(0.95_0.05_220)] shadow-[0_0_8px_oklch(0.78_0.2_220)]" />
        <span className="mk-radar-sweep" />
      </div>

      {/* Bottom right targeting readout */}
      <div className="absolute bottom-6 right-24 font-mono text-[10px] tracking-[0.22em] text-[oklch(0.85_0.18_75)] text-right space-y-1">
        <div>TGT · LOCKED</div>
        <div className="text-[oklch(0.78_0.2_220)]">ALT 12,400 FT</div>
        <div className="text-[oklch(0.78_0.2_220)]">MACH 1.4</div>
      </div>
    </div>
  );
}