/**
 * Fixed viewport HUD frame: corner brackets, top scanning beam,
 * crosshair ticks, and a thin chromatic edge — pure presentation.
 */
export function HUDFrame() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-30">
      {/* corner brackets */}
      {[
        "top-3 left-3 border-l border-t",
        "top-3 right-3 border-r border-t",
        "bottom-3 left-3 border-l border-b",
        "bottom-3 right-3 border-r border-b",
      ].map((c) => (
        <span
          key={c}
          className={`absolute h-4 w-4 border-foreground/40 ${c}`}
        />
      ))}

      {/* top + bottom crosshair ticks */}
      <span className="absolute top-3 left-1/2 -translate-x-1/2 h-2 w-px bg-foreground/40" />
      <span className="absolute bottom-3 left-1/2 -translate-x-1/2 h-2 w-px bg-foreground/40" />
      <span className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-px bg-foreground/40" />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-px bg-foreground/40" />

      {/* center crosshair tick label */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 translate-y-3 font-mono text-[9px] tracking-[0.3em] text-foreground/35">
        N · 0°
      </div>

      {/* horizon scanning beam */}
      <div className="absolute inset-x-0 top-0 h-px overflow-hidden">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-foreground/60 to-transparent animate-scan-x" />
      </div>

      {/* vertical scan line */}
      <div className="absolute inset-y-0 left-0 w-px overflow-hidden">
        <div className="w-px h-full bg-gradient-to-b from-transparent via-foreground/40 to-transparent animate-scan-y" />
      </div>

      {/* vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,oklch(0_0_0/0.6)_100%)]" />
    </div>
  );
}