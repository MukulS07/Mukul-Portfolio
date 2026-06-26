export function BackgroundFX() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background">
      {/* Animated grid */}
      <div className="absolute inset-0 grid-bg-animated opacity-70" />

      {/* Drifting accent orbs */}
      <div
        className="absolute -top-1/4 -left-1/4 h-[70vh] w-[70vh] rounded-full blur-3xl animate-orb-a"
        style={{
          background:
            "radial-gradient(circle at center, color-mix(in oklab, var(--accent) 22%, transparent), transparent 65%)",
        }}
      />
      <div
        className="absolute top-1/3 -right-1/4 h-[80vh] w-[80vh] rounded-full blur-3xl animate-orb-b"
        style={{
          background:
            "radial-gradient(circle at center, color-mix(in oklab, var(--accent) 12%, transparent), transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-[-20%] left-1/3 h-[60vh] w-[60vh] rounded-full blur-3xl animate-orb-a"
        style={{
          animationDelay: "-9s",
          background:
            "radial-gradient(circle at center, color-mix(in oklab, var(--foreground) 6%, transparent), transparent 70%)",
        }}
      />

      {/* Slow scan sweep */}
      <div
        className="absolute inset-x-0 h-[2px] animate-scan-sweep"
        style={{
          background:
            "linear-gradient(90deg, transparent, color-mix(in oklab, var(--accent) 55%, transparent), transparent)",
          boxShadow: "0 0 24px color-mix(in oklab, var(--accent) 50%, transparent)",
        }}
      />

      {/* Vignette to keep contrast */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, color-mix(in oklab, var(--background) 85%, transparent) 100%)",
        }}
      />
    </div>
  );
}