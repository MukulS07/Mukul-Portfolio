import { useEffect, useState, useRef } from "react";

// S.H.I.E.L.D. loading logs for Avengers Mode
const avengersLogs = [
  "SECURE_LINK: Connecting to S.H.I.E.L.D. Mainframe...",
  "SYS_AUTH: Verifying Level 10 Security Clearance...",
  "INIT: Booting J.A.R.V.I.S. HUD Interface...",
  "STATUS: Stark Arc Reactor power levels: 100% (NOMINAL)...",
  "DECRYPT: Retrieving Avengers Initiative archives...",
  "DB_ACCESS: Pulling Agent Mukul Sharma's database...",
  "LOG: Syncing local sensor grid and cloud nodes...",
  "ACCESS_GRANTED: Welcome back, Director Sharma.",
];

export function LoadingScreen() {
  const [percent, setPercent] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [visible, setVisible] = useState(true);
  const [isAvengers, setIsAvengers] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [sysTime, setSysTime] = useState("");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsAvengers(localStorage.getItem("avengers-mode") === "1");
      setIsMounted(true);
    }
  }, []);

  // System Time clock
  useEffect(() => {
    const tick = () => {
      const date = new Date();
      const fmt = new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "Asia/Kolkata",
      });
      setSysTime(`${fmt.format(date)} IST`);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  // progress logic
  useEffect(() => {
    const interval = setInterval(() => {
      setPercent((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        const step = Math.floor(Math.random() * 5) + 3;
        return Math.min(100, p + step);
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isAvengers) {
      const logIdx = Math.min(
        avengersLogs.length - 1,
        Math.floor((percent / 100) * avengersLogs.length),
      );
      setLogs(avengersLogs.slice(0, logIdx + 1));
    }
  }, [percent, isAvengers]);

  useEffect(() => {
    if (percent === 100) {
      const timeout = setTimeout(() => {
        setVisible(false);
      }, 700);
      return () => clearTimeout(timeout);
    }
  }, [percent]);

  // 3D Canvas Rotating Hologram Globe for Normal Mode
  useEffect(() => {
    if (isAvengers || !visible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0,
      h = 0,
      dpr = 1;

    // Build latitude/longitude sphere grid vertices
    const verts: [number, number, number][] = [];
    const edges: [number, number][] = [];
    const latBands = 10;
    const lonBands = 16;

    for (let lat = 0; lat <= latBands; lat++) {
      const theta = (lat * Math.PI) / latBands;
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);

      for (let lon = 0; lon <= lonBands; lon++) {
        const phi = (lon * 2 * Math.PI) / lonBands;
        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);

        const x = cosPhi * sinTheta;
        const y = cosTheta;
        const z = sinPhi * sinTheta;
        verts.push([x, y, z]);
      }
    }

    // Connect latitudes & longitudes
    for (let lat = 0; lat < latBands; lat++) {
      for (let lon = 0; lon < lonBands; lon++) {
        const first = lat * (lonBands + 1) + lon;
        const second = first + 1;
        const third = first + (lonBands + 1);
        linesPush(first, second);
        linesPush(first, third);
      }
    }

    function linesPush(a: number, b: number) {
      edges.push([a, b]);
    }

    // Space dust background particles
    const particles: { x: number; y: number; r: number; speed: number }[] = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 1.2 + 0.4,
        speed: Math.random() * 0.02 + 0.005,
      });
    }

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const start = performance.now();

    const draw = (now: number) => {
      const elapsed = (now - start) / 1000;
      ctx.clearRect(0, 0, w, h);

      // 1. Draw subtle grid backdrop
      ctx.strokeStyle = "rgba(0, 221, 255, 0.03)";
      ctx.lineWidth = 1;
      const gridSize = 50;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // 2. Draw space dust particles
      ctx.fillStyle = "rgba(0, 221, 255, 0.3)";
      particles.forEach((p) => {
        p.x -= p.speed * 0.1;
        if (p.x < 0) p.x = 1;
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Draw rotating hologram globe centered at Earth scanning position
      const cx = w * 0.378;
      const cy = h * 0.465;
      const R = Math.min(w, h) * 0.22; // Responsive radius
      const persp = R * 2.5;

      const ay = elapsed * 0.15;
      const ax = elapsed * 0.04;
      const cosY = Math.cos(ay),
        sinY = Math.sin(ay);
      const cosX = Math.cos(ax),
        sinX = Math.sin(ax);

      // Project vertices
      const proj = verts.map(([x, y, z]) => {
        const rx = x * cosY + z * sinY;
        let rz = -x * sinY + z * cosY;
        const ry = y * cosX - rz * sinX;
        rz = y * sinX + rz * cosX;
        const scale = persp / (persp - rz * R);
        return {
          x: cx + rx * R * scale,
          y: cy + ry * R * scale,
          z: rz,
          s: scale,
        };
      });

      // Get accent color
      const accent = "rgba(0, 221, 255, 0.7)";
      ctx.strokeStyle = accent;

      // Draw wireframe edges
      for (const [a, b] of edges) {
        const pa = proj[a],
          pb = proj[b];
        const zAvg = (pa.z + pb.z) / 2;
        const front = (zAvg + 1) / 2; // 0..1
        ctx.globalAlpha = 0.08 + front * 0.45;
        ctx.lineWidth = 0.5 + front * 0.8;
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.stroke();
      }

      // Draw vertex dots
      ctx.fillStyle = accent;
      for (const p of proj) {
        const front = (p.z + 1) / 2;
        ctx.globalAlpha = 0.12 + front * 0.65;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.2 + front * 0.8, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1.0;
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [isAvengers, visible]);

  if (!visible) return null;
  if (!isMounted) return <div className="fixed inset-0 bg-black z-[9999]" />;

  // Segmented steps percent calculation for Satellite Scan
  const step1Percent = Math.min(100, Math.floor((percent / 25) * 100));
  const step2Percent = percent < 25 ? 0 : Math.min(100, Math.floor(((percent - 25) / 25) * 100));
  const step3Percent = percent < 50 ? 0 : Math.min(100, Math.floor(((percent - 50) / 25) * 100));
  const step4Percent = percent < 75 ? 0 : Math.min(100, Math.floor(((percent - 75) / 25) * 100));

  // RENDER 1: Avengers Mode (J.A.R.V.I.S. HUD logs)
  if (isAvengers) {
    return (
      <div
        className={`fixed inset-0 bg-background z-[9999] flex flex-col items-center justify-center p-6 font-mono transition-opacity duration-500 ease-out ${
          percent === 100 ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="absolute inset-0 pointer-events-none bg-scanlines opacity-10 mix-blend-overlay" />
        <div className="absolute inset-0 pointer-events-none bg-radial-vignette opacity-35" />

        <div className="w-full max-w-lg border border-border bg-black/60 p-6 rounded-sm shadow-[0_0_40px_rgba(var(--accent),0.07)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/15 to-transparent" />

          <div className="flex items-center justify-between border-b border-border/40 pb-3 mb-4 text-[9px] tracking-[0.2em] text-muted-foreground select-none">
            <span className="flex items-center gap-1.5 text-accent font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-ping" />
              S.H.I.E.L.D. SECURE HUD // J.A.R.V.I.S.
            </span>
            <span>INITIATIVE_VER_3.0</span>
          </div>

          <div className="flex justify-center my-6 select-none animate-pulse">
            <div className="relative flex items-center justify-center h-16 w-16 rounded-full border border-accent/40 bg-accent/5">
              <div className="absolute inset-0 rounded-full border-t border-accent animate-spin" />
              <span className="font-sans text-2xl font-bold text-accent tracking-[0.05em] pl-[2px]">
                MS
              </span>
            </div>
          </div>

          <div className="space-y-2 min-h-[160px] text-[11px] text-muted-foreground leading-relaxed select-none">
            {logs.map((log, idx) => (
              <div key={idx} className={idx === logs.length - 1 ? "text-accent" : ""}>
                <span className="text-dim mr-1.5">›</span> {log}
              </div>
            ))}
          </div>

          <div className="mt-6 border border-border/20 p-0.5 bg-black/40 rounded-xs">
            <div
              className="h-1.5 bg-accent transition-all duration-150 rounded-xs"
              style={{ width: `${percent}%` }}
            />
          </div>

          <div className="mt-4 flex justify-between items-center text-[9px] text-dim select-none">
            <span>SYSTEM_LINK_ACTIVE: {percent}%</span>
            <span>EST_REMAINING: {(1.5 * (1 - percent / 100)).toFixed(1)}s</span>
          </div>
        </div>
      </div>
    );
  }

  // RENDER 2: Normal Mode (Concept 5: Satellite Scan with Razor-Sharp Canvas globe)
  return (
    <div
      className={`fixed inset-0 bg-black z-[9999] flex flex-col justify-between p-6 sm:p-8 font-mono text-[10px] sm:text-xs text-accent transition-opacity duration-500 ease-out select-none ${
        percent === 100 ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Dynamic, Infinite Resolution Interactive Globe Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0 bg-black"
      />

      {/* Floating Vector Satellite icon at top-right */}
      <div
        className="absolute pointer-events-none z-10"
        style={{
          left: "74%",
          top: "18.5%",
          transform: "translate(-50%, -50%) rotate(-15deg)",
          animation: "float 6s ease-in-out infinite",
        }}
      >
        <svg width="80" height="60" viewBox="-40 -30 80 60" className="text-accent">
          {/* Satellite Body */}
          <rect
            x="-6"
            y="-10"
            width="12"
            height="20"
            rx="2"
            fill="rgba(0, 221, 255, 0.1)"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <circle cx="0" cy="0" r="3.5" fill="none" stroke="currentColor" strokeWidth="0.8" />
          {/* Left panel */}
          <line x1="-22" y1="0" x2="-6" y2="0" stroke="currentColor" strokeWidth="1.5" />
          <rect
            x="-35"
            y="-8"
            width="13"
            height="16"
            fill="rgba(0, 221, 255, 0.05)"
            stroke="currentColor"
            strokeWidth="1"
          />
          <line x1="-28" y1="-8" x2="-28" y2="8" stroke="currentColor" strokeWidth="0.5" />
          {/* Right panel */}
          <line x1="6" y1="0" x2="22" y2="0" stroke="currentColor" strokeWidth="1.5" />
          <rect
            x="22"
            y="-8"
            width="13"
            height="16"
            fill="rgba(0, 221, 255, 0.05)"
            stroke="currentColor"
            strokeWidth="1"
          />
          <line x1="28" y1="-8" x2="28" y2="8" stroke="currentColor" strokeWidth="0.5" />
          {/* Dish */}
          <path d="M-4,13 Q0,18 4,13" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <line x1="0" y1="10" x2="0" y2="16" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      {/* SVG Animation Vectors (Laser Beam + Radar Scanner Grid) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        {percent > 2 && percent < 98 && (
          <g>
            {/* Laser Line */}
            <line
              x1="74%"
              y1="18.5%"
              x2="37.8%"
              y2="46.5%"
              stroke="var(--accent)"
              strokeWidth="1.2"
              strokeDasharray="4,4"
              className="opacity-70 animate-pulse"
            />
            {/* Inner Core beam */}
            <line
              x1="74%"
              y1="18.5%"
              x2="37.8%"
              y2="46.5%"
              stroke="#ffffff"
              strokeWidth="0.5"
              className="opacity-90"
            />

            {/* Radar scanner animations targeting Jaipur/India */}
            <circle
              cx="37.8%"
              cy="46.5%"
              r="22"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="1"
              className="opacity-60 animate-ping"
              style={{ animationDuration: "2.4s" }}
            />
            <circle
              cx="37.8%"
              cy="46.5%"
              r="48"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="0.5"
              className="opacity-30 animate-ping"
              style={{ animationDuration: "3.6s" }}
            />
            {/* Center target cursor */}
            <circle
              cx="37.8%"
              cy="46.5%"
              r="4"
              fill="var(--accent)"
              className="opacity-100 animate-pulse"
            />
            {/* Rotating target reticle */}
            <circle
              cx="37.8%"
              cy="46.5%"
              r="12"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="0.8"
              strokeDasharray="3,3"
              className="opacity-75 animate-spin"
              style={{ animationDuration: "8s" }}
            />
          </g>
        )}
      </svg>

      {/* TOP HEADER SECTION */}
      <header className="relative z-20 flex justify-between items-center border-b border-border/25 pb-3 bg-black/60 backdrop-blur-xs">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-white tracking-[0.1em]">
            MS<span className="text-accent">.</span>
          </span>
          <span className="text-muted-foreground border-l border-border/30 pl-3 tracking-[0.18em]">
            SYSTEM BOOT: INITIALIZING...
          </span>
        </div>
        <div className="flex items-center gap-4 text-[9px] tracking-[0.25em] text-muted-foreground">
          <span>SATELLITE SCAN MODE</span>
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((idx) => (
              <span
                key={idx}
                className={`h-1.5 w-3 rounded-xs ${
                  percent >= idx * 20 ? "bg-accent" : "bg-white/10"
                }`}
              />
            ))}
          </div>
        </div>
        <div className="text-[9px] tracking-[0.22em] text-muted-foreground flex items-center gap-1.5">
          <span>SECURE SYSTEM</span>
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
        </div>
      </header>

      {/* MID PANEL SECTION: Sidebars & Dashboard */}
      <div className="relative z-20 grid grid-cols-12 gap-6 items-stretch my-auto">
        {/* Left column: SYSTEM STATUS */}
        <div className="col-span-12 md:col-span-3 border border-border/25 bg-black/75 backdrop-blur-xs p-4 rounded-sm flex flex-col justify-between max-w-[250px]">
          <div>
            <h3 className="text-white tracking-[0.2em] font-semibold border-b border-border/25 pb-2 mb-3">
              SYSTEM STATUS
            </h3>
            <ul className="space-y-2 text-[10px] tracking-wide text-muted-foreground">
              {[
                { name: "CORE SYSTEMS", active: true },
                { name: "NETWORK", active: true },
                { name: "AI MODULE", active: true },
                { name: "DATABASE", active: true },
                { name: "AWS SERVICES", active: true },
                { name: "SECURITY PROTOCOLS", active: true },
                { name: "INTERFACE", active: percent < 90, loading: percent < 95 },
              ].map((sys) => (
                <li key={sys.name} className="flex justify-between items-center">
                  <span>• {sys.name}</span>
                  <span className="flex items-center gap-1.5">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        sys.loading
                          ? "bg-amber-warn animate-pulse"
                          : sys.active
                            ? "bg-accent"
                            : "bg-white/10"
                      }`}
                    />
                    <span
                      className={`text-[9px] ${
                        sys.loading ? "text-amber-warn" : sys.active ? "text-accent" : "text-dim"
                      }`}
                    >
                      {sys.loading ? "LOADING" : "ONLINE"}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Center spacing: Empty space for Earth scan graphic */}
        <div className="col-span-12 md:col-span-5 h-[200px] md:h-auto pointer-events-none" />

        {/* Right column: SEARCH AND IDENTIFY PROGRESS */}
        <div className="col-span-12 md:col-span-4 border border-border/25 bg-black/75 backdrop-blur-xs p-4 sm:p-5 rounded-sm flex flex-col gap-3 justify-center min-w-[280px]">
          {/* Step 1 */}
          <div
            className={`transition-opacity duration-300 ${percent < 0 ? "opacity-30" : "opacity-100"}`}
          >
            <div className="flex justify-between items-center text-[10px] tracking-wider mb-1">
              <span className="text-white font-semibold flex items-center gap-1.5">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${step1Percent === 100 ? "bg-accent" : "bg-accent animate-ping"}`}
                />
                SEARCHING...
              </span>
              <span className="text-accent text-[9px]">{step1Percent}%</span>
            </div>
            <p className="text-[9px] text-muted-foreground mb-1.5">Scanning Global Database</p>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-150"
                style={{ width: `${step1Percent}%` }}
              />
            </div>
          </div>

          <div className="text-center text-muted-foreground text-[8px] tracking-[0.2em]">↓</div>

          {/* Step 2 */}
          <div
            className={`transition-opacity duration-300 ${percent < 25 ? "opacity-30" : "opacity-100"}`}
          >
            <div className="flex justify-between items-center text-[10px] tracking-wider mb-1">
              <span className="text-white font-semibold flex items-center gap-1.5">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${step2Percent === 100 ? "bg-accent" : percent >= 25 ? "bg-accent animate-ping" : "bg-white/10"}`}
                />
                FINDING MUKUL SHARMA...
              </span>
              <span className="text-accent text-[9px]">{step2Percent}%</span>
            </div>
            <p className="text-[9px] text-muted-foreground mb-1.5">Location: Jaipur, India</p>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-150"
                style={{ width: `${step2Percent}%` }}
              />
            </div>
          </div>

          <div className="text-center text-muted-foreground text-[8px] tracking-[0.2em]">↓</div>

          {/* Step 3 */}
          <div
            className={`transition-opacity duration-300 ${percent < 50 ? "opacity-30" : "opacity-100"}`}
          >
            <div className="flex justify-between items-center text-[10px] tracking-wider mb-1">
              <span className="text-white font-semibold flex items-center gap-1.5">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${step3Percent === 100 ? "bg-accent" : percent >= 50 ? "bg-accent animate-ping" : "bg-white/10"}`}
                />
                IDENTITY VERIFIED
              </span>
              <span className="text-accent text-[9px]">{step3Percent}%</span>
            </div>
            <p className="text-[9px] text-muted-foreground mb-1.5">Access Level: Authorized</p>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-150"
                style={{ width: `${step3Percent}%` }}
              />
            </div>
          </div>

          <div className="text-center text-muted-foreground text-[8px] tracking-[0.2em]">↓</div>

          {/* Step 4 */}
          <div
            className={`transition-opacity duration-300 ${percent < 75 ? "opacity-30" : "opacity-100"}`}
          >
            <div className="flex justify-between items-center text-[10px] tracking-wider mb-1">
              <span className="text-white font-semibold flex items-center gap-1.5">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${step4Percent === 100 ? "bg-accent" : percent >= 75 ? "bg-accent animate-ping" : "bg-white/10"}`}
                />
                OPENING PORTFOLIO...
              </span>
              <span className="text-accent text-[9px]">{step4Percent}%</span>
            </div>
            <p className="text-[9px] text-muted-foreground mb-1.5">Loading Experience</p>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-150"
                style={{ width: `${step4Percent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM CONSOLE FOOTER */}
      <footer className="relative z-20 grid grid-cols-12 gap-4 items-center border-t border-border/25 pt-4 bg-black/60 backdrop-blur-xs">
        {/* Coordinates */}
        <div className="col-span-12 sm:col-span-3 text-[9px] sm:text-[10px] tracking-widest text-muted-foreground">
          <div className="text-white tracking-[0.15em] mb-0.5">COORDINATES</div>
          <div>26.9124° N, 75.7873° E</div>
          <div className="text-[9px] text-accent flex items-center gap-1">
            <span className="h-1 w-1 rounded-full bg-accent animate-ping" />
            JAIPUR, INDIA
          </div>
        </div>

        {/* Center Progress Bar */}
        <div className="col-span-12 sm:col-span-6 flex flex-col items-center">
          <div className="text-[11px] tracking-[0.25em] text-white font-semibold mb-1">
            {percent > 55 ? "WELCOME MUKUL SHARMA" : "PREPARING SECURE INTERFACE"}
          </div>
          <div className="w-full flex items-center gap-3">
            <div className="w-full flex-1 h-3 border border-border/30 p-0.5 bg-black/40 rounded-xs overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-150 rounded-xs select-none flex items-center overflow-hidden"
                style={{ width: `${percent}%` }}
              >
                <div className="w-full text-black font-extrabold text-[8px] leading-none text-center select-none tracking-[0.3em] pl-2 opacity-50 whitespace-nowrap">
                  ////////////////////////////////////////////////////////////
                </div>
              </div>
            </div>
            <span className="text-white text-xs font-semibold tabular-nums tracking-widest">
              {percent}%
            </span>
          </div>
          <div className="text-[8px] text-muted-foreground mt-1 tracking-widest select-none">
            LOADING PORTFOLIO INTERFACE
          </div>
        </div>

        {/* System Time and Status */}
        <div className="col-span-12 sm:col-span-3 text-right text-[9px] sm:text-[10px] tracking-widest text-muted-foreground">
          <div className="text-white tracking-[0.15em] mb-0.5">SYSTEM TIME</div>
          <div className="tabular-nums text-white">{sysTime}</div>
          <div className="text-[8px] text-accent mt-0.5 select-none">
            STATUS: ALL SYSTEMS OPERATIONAL
          </div>
        </div>
      </footer>
    </div>
  );
}
