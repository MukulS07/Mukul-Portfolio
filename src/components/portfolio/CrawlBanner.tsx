/**
 * Hologram crawl banner — horizontal marquee styled with scanlines
 * and accent glow. Respects the FX toggle (fades scanlines + slows
 * motion under body.fx-off). In Iron Man mode the glow shifts to
 * arc-reactor cyan/gold via theme tokens.
 */
export function CrawlBanner({ text }: { text: string }) {
  const stream = Array.from({ length: 6 }).map((_, i) => (
    <span key={i} className="inline-flex items-center gap-4 px-6">
      <span className="text-accent">◈</span>
      <span>{text}</span>
    </span>
  ));
  return (
    <div className="crawl-banner holo mb-8 border-y border-border bg-[color-mix(in_oklab,var(--accent)_6%,var(--background))] overflow-hidden">
      <div className="relative">
        <div className="flex w-max animate-marquee font-mono text-[11px] tracking-[0.32em] uppercase text-foreground/85 py-2 will-change-transform">
          {stream}
          {stream}
        </div>
        {/* edge fades */}
        <span className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent" />
        <span className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent" />
      </div>
    </div>
  );
}
