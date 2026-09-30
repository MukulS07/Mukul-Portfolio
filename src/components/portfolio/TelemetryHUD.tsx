import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";

/**
 * Futuristic telemetry HUD — fixed bottom-right.
 * Live FPS, cursor coords, scroll %, route, and a scrolling system log.
 * Plus a left-edge audio-spectrum bar driven by sine noise.
 * High-performance: Direct DOM updates to prevent 120-240Hz React re-render churn!
 */
export function TelemetryHUD() {
  const [logs, setLogs] = useState<string[]>([
    "boot::ok",
    "vfx::wireframe online",
    "spring::stiffness=40 damping=9",
  ]);
  const route = useRouterState({ select: (s) => s.location.pathname });
  const barsRef = useRef<HTMLDivElement | null>(null);
  const fpsRef = useRef<HTMLSpanElement | null>(null);
  const coordsRef = useRef<HTMLSpanElement | null>(null);
  const scrollRef = useRef<HTMLSpanElement | null>(null);

  // FPS + spectrum using rAF without triggering React component re-renders
  useEffect(() => {
    let raf = 0,
      frames = 0,
      last = performance.now();
    const tick = (now: number) => {
      frames++;
      if (now - last >= 1000) {
        const measuredFps = Math.round((frames * 1000) / (now - last));
        if (fpsRef.current) {
          fpsRef.current.textContent = `${measuredFps}fps`;
        }
        frames = 0;
        last = now;
      }
      const el = barsRef.current;
      if (el && !document.hidden) {
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

  // mouse + scroll with zero React re-render cost
  useEffect(() => {
    let scheduled = false;
    let lastX = 0;
    let lastY = 0;

    const updateCoords = () => {
      scheduled = false;
      if (coordsRef.current) {
        coordsRef.current.textContent = `${lastX.toString().padStart(4, "0")},${lastY.toString().padStart(4, "0")}`;
      }
    };

    const onMove = (e: MouseEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
      if (!scheduled) {
        scheduled = true;
        requestAnimationFrame(updateCoords);
      }
    };

    const onScroll = () => {
      if (scrollRef.current) {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        const pct = h > 0 ? Math.min(100, Math.round((window.scrollY / h) * 100)) : 0;
        scrollRef.current.textContent = `${pct.toString().padStart(3, "0")}%`;
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
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
    }, 4500);
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
            <span ref={fpsRef} className="tabular-nums">60fps</span>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 tabular-nums text-muted-foreground">
            <span>CUR</span>
            <span ref={coordsRef} className="text-foreground text-right">
              0000,0000
            </span>
            <span>SCR</span>
            <span ref={scrollRef} className="text-foreground text-right">
              000%
            </span>
            <span>RTE</span>
            <span className="text-foreground text-right truncate">{route}</span>
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
