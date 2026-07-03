import { useEffect, useState } from "react";
import portrait from "@/assets/portrait.jpg";
import { ProjectVideo } from "./ProjectVideo";
import { Link } from "@tanstack/react-router";

const roles = [
  "Security Engineer",
  "Cloud Architect",
  "AI/IoT Builder",
  "Full-Stack Developer",
];

const stats: { label: string; value: string }[] = [
  { label: "LINES OF CODE", value: "1.5K" },
  { label: "CGPA", value: "7.25" },
  { label: "GITHUB REPOS", value: "24" },
  { label: "AWS SERVICES", value: "10+" },
];

const ticker = [
  "Python", "AWS Lambda", "DynamoDB", "Next.js", "Node.js", "React",
  "Flutter", "Unity 6", "C#", "IAM", "CI/CD", "MongoDB", "Figma",
  "Salesforce", "IoT", "LoRa", "TypeScript", "Express", "MySQL", "Blender",
];

const events: { t: string; tag: string; tagColor: string; msg: string; note: string }[] = [
  { t: "06:53:01", tag: "DESIGN", tagColor: "text-accent", msg: "iter  portfolio · v2", note: "+cockpit +grid" },
  { t: "06:52:59", tag: "CI",     tagColor: "text-amber-warn", msg: "pass  ecogeoguard#218", note: "12 checks ✓" },
  { t: "06:52:43", tag: "AWS",    tagColor: "text-foreground", msg: "deploy lambda · landslide-risk", note: "rt 0.18s" },
  { t: "06:51:10", tag: "AI",     tagColor: "text-muted-foreground", msg: "infer ml-pipeline-v3", note: "f1 0.94" },
  { t: "06:48:02", tag: "IOT",    tagColor: "text-accent", msg: "ingest node-187 telemetry", note: "ok" },
];

function useCountUp(target: number, duration = 1400) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return n;
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border p-5 sm:p-6 min-h-[110px] flex flex-col justify-between">
      <div className="text-[10px] tracking-[0.22em] text-muted-foreground font-mono">
        {label}
      </div>
      <div className="font-serif-display text-4xl sm:text-5xl text-foreground leading-none">
        {value}
      </div>
    </div>
  );
}

function GithubHeatmap() {
  // 26 cols x 7 rows ~ 6 months
  const cells = Array.from({ length: 26 * 7 }, (_, i) => {
    const r = (Math.sin(i * 1.13) + 1) / 2;
    const lvl = r < 0.55 ? 0 : r < 0.7 ? 1 : r < 0.83 ? 2 : r < 0.93 ? 3 : 4;
    return lvl;
  });
  const shade = ["bg-white/[0.04]", "bg-accent/25", "bg-accent/45", "bg-accent/70", "bg-accent"];
  return (
    <div className="grid grid-rows-7 grid-flow-col gap-[3px]" style={{ gridAutoColumns: "10px" }}>
      {cells.map((c, i) => (
        <span
          key={i}
          className={`heatmap-cell h-[10px] w-[10px] ${shade[c]}`}
          style={{ animationDelay: `${(i % 26) * 18 + Math.floor(i / 26) * 30}ms` }}
        />
      ))}
    </div>
  );
}

function Radar() {
  // Mock proficiency radar inspired by the reference
  const axes = ["PY", "AWS", "TS", "C#", "JAVA", "NEXT", "REACT", "DOCKER", "IOT", "ML", "MONGO", "FLUTTER"];
  const vals = [0.95, 0.9, 0.8, 0.7, 0.65, 0.85, 0.8, 0.55, 0.7, 0.75, 0.7, 0.6];
  const cx = 110, cy = 110, R = 90;
  const pts = vals.map((v, i) => {
    const a = (i / axes.length) * Math.PI * 2 - Math.PI / 2;
    return [cx + Math.cos(a) * R * v, cy + Math.sin(a) * R * v] as const;
  });
  const path = pts.map(([x, y], i) => (i === 0 ? `M${x},${y}` : `L${x},${y}`)).join(" ") + "Z";
  return (
    <svg viewBox="0 0 220 220" className="w-full max-w-[260px]">
      {[0.25, 0.5, 0.75, 1].map((s) => (
        <circle key={s} cx={cx} cy={cy} r={R * s} fill="none" stroke="currentColor" className="text-white/10" strokeWidth={1} />
      ))}
      {axes.map((_, i) => {
        const a = (i / axes.length) * Math.PI * 2 - Math.PI / 2;
        return (
          <line key={i} x1={cx} y1={cy} x2={cx + Math.cos(a) * R} y2={cy + Math.sin(a) * R}
            stroke="currentColor" className="text-white/10" strokeWidth={1} />
        );
      })}
      <path d={path} fill="currentColor" className="text-accent/20" stroke="currentColor" strokeWidth={1.25}>
        <animate attributeName="opacity" values="0.55;1;0.55" dur="4s" repeatCount="indefinite" />
      </path>
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={2} className="text-accent fill-current" />
      ))}
      {axes.map((label, i) => {
        const a = (i / axes.length) * Math.PI * 2 - Math.PI / 2;
        const lx = cx + Math.cos(a) * (R + 14);
        const ly = cy + Math.sin(a) * (R + 14);
        return (
          <text key={label} x={lx} y={ly} fontSize={8} textAnchor="middle" dominantBaseline="middle"
            className="fill-muted-foreground font-mono">
            {label}
          </text>
        );
      })}
    </svg>
  );
}

export function Hero() {
  const [roleIdx, setRoleIdx] = useState(0);
  const [repoCount, setRepoCount] = useState("24");

  useEffect(() => {
    const id = setInterval(() => setRoleIdx((i) => (i + 1) % roles.length), 2200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    fetch("https://api.github.com/users/mukulsharmams007")
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.public_repos === "number") {
          setRepoCount(String(data.public_repos));
        }
      })
      .catch((err) => {
        console.error("Failed to fetch GitHub repos count:", err);
      });
  }, []);

  const commits = useCountUp(412);

  const dynamicStats = [
    { label: "LINES OF CODE", value: "1.5K" },
    { label: "CGPA", value: "7.25" },
    { label: "GITHUB REPOS", value: repoCount },
    { label: "AWS SERVICES", value: "10+" },
  ];

  return (
    <section id="home" className="relative">
      <div className="mx-auto max-w-7xl px-5 lg:px-8 py-8 lg:py-10">
        {/* ROW 1: Identity + stats */}
        <div className="grid lg:grid-cols-12 gap-px bg-border border border-border">
          {/* Identity card */}
          <div className="lg:col-span-8 bg-background p-6 sm:p-10 grid sm:grid-cols-5 gap-6 sm:gap-10 items-start relative overflow-hidden group/shield-identity">


            <div className="sm:col-span-3 z-10">
              <div className="font-mono text-[10px] tracking-[0.28em] text-muted-foreground flex justify-between">
                <span>IDENTITY · 01</span>
                <span className="hidden avengers-shield-title text-accent font-semibold">S.H.I.E.L.D. AGENT ACCESS</span>
              </div>
              <h1 className="mt-8 font-serif-display text-foreground leading-[0.92] text-6xl sm:text-7xl lg:text-[88px]">
                Mukul
                <br />
                <span className="pl-10">Sharma<span className="text-accent">.</span></span>
              </h1>
              <div className="font-mono text-[10px] tracking-[0.28em] text-muted-foreground mt-12 flex justify-between">
                <span>CURRENTLY</span>
                <span className="hidden avengers-clearance text-destructive font-bold">CLEARANCE: LEVEL 10</span>
              </div>
              <div className="mt-2 font-mono text-sm text-foreground">
                {roles[roleIdx]}
                <span className="text-accent animate-cursor">▌</span>
              </div>

              {/* Bio & HUD Telemetry block to fill vertical empty space */}
              <p className="mt-8 font-mono text-[11px] leading-relaxed text-muted-foreground max-w-sm tracking-wide">
                Specializing in secure cloud infrastructure, threat modeling, and building intelligent IoT hardware. 
                Bridging the gap between cyber security protocols and embedded physical systems.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-y-4 gap-x-6 border-t border-border/40 pt-6 max-w-sm font-mono text-[10px] tracking-wider text-muted-foreground">
                <div>
                  <span className="text-accent">// LOCATION</span>
                  <div className="text-foreground mt-0.5">JAIPUR, INDIA</div>
                </div>
                <div>
                  <span className="text-accent">// SYSTEM_STATUS</span>
                  <div className="text-foreground mt-0.5 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent animate-ping" />
                    ONLINE
                  </div>
                </div>
                <div>
                  <span className="text-accent">// CORE_STACK</span>
                  <div className="text-foreground mt-0.5">PYTHON / AWS / TS</div>
                </div>
                <div>
                  <span className="text-accent">// DISCIPLINE</span>
                  <div className="text-foreground mt-0.5">DEVSECOPS / IOT</div>
                </div>
              </div>
            </div>

            {/* Portrait card */}
            <div className="sm:col-span-2 z-10 w-full">
              <div className="border border-border bg-background p-3 max-w-[260px] mx-auto sm:ml-auto relative group/shield-card overflow-hidden">
                {/* Red/Gold laser scanner sweep overlay */}
                <div className="absolute left-3 right-3 top-3 bottom-12 pointer-events-none overflow-hidden z-20 hidden avengers-scan-line">
                  <div className="w-full h-[3px] bg-accent shadow-[0_0_12px_var(--accent)] animate-scanner-sweep" />
                </div>

                <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.22em] text-muted-foreground mb-2">
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                    <span className="text-accent normal-live-text">LIVE</span>
                    <span className="text-accent hidden avengers-active-text">ACTIVE_ID</span>
                  </span>
                  <span className="normal-op-text">OP · 01</span>
                  <span className="hidden avengers-id-text">AGENT // SH-99182</span>
                </div>
                <div className="relative aspect-[4/5] overflow-hidden bg-surface">
                  <img
                    src={portrait}
                    alt="Mukul Sharma"
                    width={768}
                    height={896}
                    className="h-full w-full object-cover grayscale contrast-[1.05]"
                  />

                </div>
                <div className="mt-2 font-mono text-[10px] tracking-[0.22em] text-muted-foreground text-right flex justify-between items-center">
                  <span className="hidden avengers-level-text text-accent font-bold">CLASSIFIED</span>
                  <span className="normal-level-text w-full text-right">MS · 2026</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats column */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-px bg-border">
            {dynamicStats.map((s) => (
              <div key={s.label} className="bg-background">
                <StatTile {...s} />
              </div>
            ))}
            {/* Building card spanning 2 */}
            <div className="col-span-2 bg-background p-5 sm:p-6 border-t border-border">
              <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.22em] text-muted-foreground">
                <span className="flex items-center gap-2">
                  <span>›_ COMMIT · MAIN</span>
                </span>
                <span className="flex items-center gap-1.5 text-amber-warn">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-warn animate-pulse" />
                  BUILDING
                </span>
              </div>
              <div className="mt-4 font-mono text-xs text-muted-foreground">~/projects/ecogeoguard-v2</div>
              <div className="mt-2 font-serif-display text-2xl text-foreground">
                EcoGeoGuard
              </div>
              <div className="font-mono text-xs text-muted-foreground mt-1">
                AI-IoT Landslide Prediction Platform
              </div>
              
              <ProjectVideo src="/videooutput/My Video.mp4" title="EcoGeoGuard" />

              <div className="mt-4 flex flex-wrap gap-1.5 font-mono text-[11px]">
                {["Python", "AWS Lambda", "DynamoDB", "LoRa", "Next.js"].map((t) => (
                  <span key={t} className="px-2 py-0.5 border border-border text-muted-foreground">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ROW 2: events log */}
        <div className="mt-px border border-border border-t-0">
          <div className="px-5 sm:px-6 py-3 flex items-center justify-between font-mono text-[10px] tracking-[0.22em] text-muted-foreground border-b border-border">
            <span className="flex items-center gap-2">
              <span className="text-accent">((·))</span>
              <span className="text-foreground">LIVE</span>
              <span>· /EVENTS</span>
            </span>
            <span>5 / 28</span>
          </div>
          <table className="w-full font-mono text-xs">
            <tbody>
              {events.map((e, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  <td className="px-5 sm:px-6 py-2.5 text-muted-foreground w-28 tabular-nums">{e.t}</td>
                  <td className={`py-2.5 w-20 ${e.tagColor}`}>{e.tag}</td>
                  <td className="py-2.5 text-foreground">{e.msg}</td>
                  <td className="px-5 sm:px-6 py-2.5 text-muted-foreground text-right">{e.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tech ticker */}
      <div className="border-y border-border overflow-hidden py-3">
        <div className="flex animate-marquee whitespace-nowrap font-mono text-sm text-muted-foreground">
          {[...Array(2)].map((_, dup) => (
            <div key={dup} className="flex shrink-0">
              {ticker.map((t, i) => (
                <span key={`${dup}-${i}`} className="flex items-center gap-8 pr-8">
                  <span className="text-dim">·</span>
                  <span>{t}</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ROW 3: radar + heatmap + now playing + CTA stack */}
      <div className="mx-auto max-w-7xl px-5 lg:px-8 py-8 lg:py-10">
        <div className="grid lg:grid-cols-12 gap-px bg-border border border-border">
          {/* Radar */}
          <div className="lg:col-span-5 bg-background p-6 sm:p-8">
            <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.22em] text-muted-foreground">
              <span>// STACK.SURFACE</span>
              <span>12 AXES</span>
            </div>
            <div className="mt-6 flex items-center justify-center">
              <Radar />
            </div>
            <div className="mt-4 flex items-center gap-4 font-mono text-[10px] tracking-[0.22em] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 bg-accent" /> CODE
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 bg-white/15" /> STACK
              </span>
            </div>
          </div>

          {/* Heatmap + now playing stack */}
          <div className="lg:col-span-5 bg-background p-6 sm:p-8 flex flex-col gap-6">
            <div>
              <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.22em] text-muted-foreground">
                <span>⌧ GITHUB · @MUKULSHARMAMS007</span>
                <span>26W</span>
              </div>
              <div className="mt-5 overflow-x-auto">
                <GithubHeatmap />
              </div>
              <div className="mt-4 flex items-center justify-between font-mono text-[11px] text-muted-foreground">
                <div>
                  <span className="text-foreground tabular-nums">{commits}</span> COMMITS
                  <span className="mx-3 text-dim">·</span>
                  <span className="text-foreground">12D</span> STREAK
                </div>
                <div className="flex items-center gap-1.5">
                  LESS
                  <span className="h-2 w-2 bg-white/[0.04]" />
                  <span className="h-2 w-2 bg-accent/25" />
                  <span className="h-2 w-2 bg-accent/45" />
                  <span className="h-2 w-2 bg-accent/70" />
                  <span className="h-2 w-2 bg-accent" />
                  MORE
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-5">
              <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.22em] text-muted-foreground">
                <span>♪ NOW PLAYING</span>
                <span className="text-accent">⚡ DEEP WORK</span>
              </div>
              <div className="mt-3 font-serif-display text-xl text-foreground italic">
                building EcoGeoGuard v2
              </div>
              <div className="font-mono text-xs text-muted-foreground mt-1">
                python · aws · lora · next.js
              </div>
              <div className="mt-3 h-[3px] bg-white/10 overflow-hidden">
                <div className="h-full w-2/3 bg-accent" />
              </div>
            </div>
          </div>

          {/* Make a move */}
          <div className="lg:col-span-2 bg-background p-5 sm:p-6 flex flex-col">
            <div className="font-mono text-[10px] tracking-[0.22em] text-muted-foreground text-center">
              MAKE A MOVE
            </div>
            <a href="#projects" className="mt-5 border border-foreground bg-foreground text-background py-4 px-3 font-mono text-[11px] tracking-[0.22em] flex items-center justify-between hover:opacity-90">
              <span>VIEW<br />WORK</span><span>→</span>
            </a>
            <Link to="/resume" className="mt-2 border border-border py-4 px-3 font-mono text-[11px] tracking-[0.22em] text-foreground hover:border-foreground block text-left">
              VIEW<br />RESUME
            </Link>
            <div className="mt-2 border border-border py-4 px-3 font-mono text-[11px] tracking-[0.22em] text-muted-foreground flex items-center justify-between">
              <span>⌘ COMMAND<br />PALETTE</span><span className="text-foreground">⌘K</span>
            </div>
            <div className="mt-auto pt-6 font-mono text-[10px] tracking-[0.22em] text-dim text-center">
              ↓ SCROLL FOR<br/>THE LONG FORM
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}