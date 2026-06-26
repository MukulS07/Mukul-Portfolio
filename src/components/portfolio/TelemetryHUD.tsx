import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";

/**
 * Futuristic telemetry HUD — fixed bottom-right.
 * Live FPS, cursor coords, scroll %, route, and a scrolling system log.
 * Plus a left-edge audio-spectrum bar driven by sine noise.
 */
export function TelemetryHUD() {
  const [fps, setFps] = useState(60);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [scroll, setScroll] = useState(0);
  const [logs, setLogs] = useState<string[]>([
    "boot::ok",
    "vfx::wireframe online",
    "spring::stiffness=40 damping=9",
  ]);
  const route = useRouterState({ select: (s) => s.location.pathname });
  const barsRef = useRef<HTMLDivElement | null>(null);

  // FPS + spectrum
  useEffect(() => {
    let raf = 0, frames = 0, last = performance.now();
    const tick = (now: number) => {
      frames++;
      if (now - last >= 1000) {
        setFps(Math.round((frames * 1000) / (now - last)));
        frames = 0; last = now;
      }
      const el = barsRef.current;
      if (el) {
        const t = now / 1000;
        const children = el.children;
        for (let i = 0; i < children.length; i++) {
          const v = (Math.sin(t * 2.1 + i * 0.55) + Math.sin(t * 3.7 + i * 0.31)) * 0.25 + 0.5;
          (children[i] as HTMLElement).style.transform = `scaleY(${0.15 + v * 0.85})`;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // mouse + scroll
  useEffect(() => {
    const onMove = (e: MouseEvent) => setCoords({ x: e.clientX, y: e.clientY });
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setScroll(h > 0 ? Math.min(100, Math.round((window.scrollY / h) * 100)) : 0);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // route change → log
  useEffect(() => {
    setLogs((l) => [`nav::${route}`, ...l].slice(0, 5));
  }, [route]);

  // periodic heartbeat log
  useEffect(() => {
    const id = setInterval(() => {
      const msgs = [
        "telemetry::heartbeat",
        "vfx::spring stable",
        "render::frame ok",
        "stream::sync",
        "uplink::nominal",
      ];
      setLogs((l) => [msgs[Math.floor(Math.random() * msgs.length)], ...l].slice(0, 5));
    }, 3200);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {/* Left-edge spectrum */}
      <div
        aria-hidden
        className="hidden md:flex pointer-events-none fixed left-2 top-1/2 -translate-y-1/2 z-40 flex-col gap-1.5 origin-center"
      >
        <div ref={barsRef} className="flex flex-col gap-[3px] items-center">
          {Array.from({ length: 22 }).map((_, i) => (
            <span
              key={i}
              className="block w-[3px] h-3 bg-foreground/60 origin-center"
              style={{ transformOrigin: "center" }}
            />
          ))}
        </div>
      </div>

      {/* Bottom-right telemetry */}
      <div
        aria-hidden
        className="hidden md:block pointer-events-none fixed bottom-3 right-3 z-40 font-mono text-[10px] tracking-[0.14em] text-foreground/80"
      >
        <div className="glass-panel px-3 py-2 backdrop-blur-md bg-background/60 min-w-[240px]">
          <div className="flex items-center justify-between gap-3 border-b border-border pb-1.5 mb-1.5">
            <span className="flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 rounded-full bg-accent animate-ping opacity-60" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              SYS.TELEMETRY
            </span>
            <span className="tabular-nums">{fps}fps</span>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 tabular-nums text-muted-foreground">
            <span>CUR</span><span className="text-foreground text-right">{coords.x.toString().padStart(4, "0")},{coords.y.toString().padStart(4, "0")}</span>
            <span>SCR</span><span className="text-foreground text-right">{scroll.toString().padStart(3, "0")}%</span>
            <span>RTE</span><span className="text-foreground text-right truncate">{route}</span>
          </div>
          <div className="mt-1.5 pt-1.5 border-t border-border space-y-0.5">
            {logs.map((l, i) => (
              <div
                key={l + i}
                className="text-muted-foreground truncate"
                style={{ opacity: 1 - i * 0.18 }}
              >
                <span className="text-accent">›</span> {l}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}