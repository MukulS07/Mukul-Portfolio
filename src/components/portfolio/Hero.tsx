import { useEffect, useState } from "react";
import portrait from "@/assets/portrait.jpg";

const roles = [
  "Security Engineer",
  "Cloud Architect",
  "AI/IoT Builder",
  "Full-Stack Developer",
];

const stats = [
  { label: "GitHub Repos", value: 24, suffix: "" },
  { label: "Research Papers", value: 1, suffix: "" },
  { label: "AWS Services", value: 10, suffix: "+" },
  { label: "Projects Shipped", value: 4, suffix: "" },
];

const ticker = [
  "Python", "AWS Lambda", "DynamoDB", "Next.js", "Node.js", "React",
  "Flutter", "Unity 6", "C#", "IAM", "CI/CD", "MongoDB", "Figma",
  "Salesforce", "IoT", "LoRa", "TypeScript", "Express", "MySQL", "Blender",
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

function StatTile({ label, value, suffix }: { label: string; value: number; suffix: string }) {
  const n = useCountUp(value);
  return (
    <div className="border border-border rounded-lg p-3 bg-black/20">
      <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-mono">
        {label}
      </div>
      <div className="mt-1 font-mono text-2xl text-foreground tabular-nums">
        {n}
        <span className="text-cyan-accent">{suffix}</span>
      </div>
    </div>
  );
}

export function Hero() {
  const [roleIdx, setRoleIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setRoleIdx((i) => (i + 1) % roles.length), 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="home" className="relative pt-28 pb-16 px-4 grid-bg">
      <div className="mx-auto max-w-6xl grid lg:grid-cols-12 gap-6">
        {/* Identity panel */}
        <div className="glass-panel lg:col-span-7 p-6 sm:p-8 relative overflow-hidden">
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            <span>Identity · 01</span>
            <span className="text-cyan-accent">~/home</span>
          </div>

          <h1 className="mt-6 font-sans font-bold leading-[0.88] tracking-tight text-foreground text-6xl sm:text-7xl lg:text-8xl">
            MUKUL
            <br />
            <span className="text-glow-cyan">SHARMA</span>
          </h1>

          <div className="mt-6 font-mono text-sm text-muted-foreground">
            <span className="text-cyan-accent">$</span> Currently:{" "}
            <span className="text-foreground">
              {roles[roleIdx]}
              <span className="text-cyan-accent animate-cursor">▌</span>
            </span>
          </div>

          <p className="mt-6 max-w-lg text-sm leading-relaxed text-muted-foreground">
            Final-year B.Tech CSE (Cyber Security) at LPU. I build secure,
            cloud-native systems — from AI-IoT landslide platforms to AI business OS.
          </p>

          <div className="mt-7 flex flex-wrap gap-3 font-mono text-xs">
            <a
              href="#projects"
              className="px-4 py-2.5 rounded-md bg-cyan-accent text-primary-foreground hover:opacity-90 transition flex items-center gap-2"
            >
              <span>[view work]</span>
              <span>→</span>
            </a>
            <a
              href="/cv.pdf"
              className="px-4 py-2.5 rounded-md border border-border hover:border-cyan-accent hover:text-cyan-accent transition"
            >
              [download cv]
            </a>
            <a
              href="#contact"
              className="px-4 py-2.5 rounded-md border border-border hover:border-cyan-accent hover:text-cyan-accent transition"
            >
              [contact]
            </a>
          </div>
        </div>

        {/* Portrait + stats */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel scanlines p-4 relative">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground flex items-center justify-between mb-3">
              <span>operator · live</span>
              <span className="flex items-center gap-1.5 text-green-live">
                <span className="h-1.5 w-1.5 rounded-full bg-green-live animate-pulse" />
                online
              </span>
            </div>
            <div className="aspect-[4/5] w-full rounded-md overflow-hidden border border-border relative">
              <img
                src={portrait}
                alt="Mukul Sharma portrait"
                width={768}
                height={896}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 font-mono text-[10px] text-foreground/80">
                MS · 2026
              </div>
            </div>
          </div>

          <div className="glass-panel p-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
              live · stats
            </div>
            <div className="grid grid-cols-2 gap-3">
              {stats.map((s) => (
                <StatTile key={s.label} {...s} />
              ))}
            </div>
          </div>
        </div>

        {/* Currently building */}
        <div className="glass-panel lg:col-span-7 p-5 font-mono text-sm">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-warn animate-pulse" />
            <span>commit · main · building</span>
          </div>
          <div className="mt-3 text-cyan-accent">~/projects/ecogeoguard-v2</div>
          <div className="mt-1 text-foreground">EcoGeoGuard — AI-IoT Landslide System</div>
          <div className="mt-2 text-muted-foreground text-xs">
            Python · AWS Lambda · IoT · LoRa
          </div>
        </div>

        <div className="glass-panel lg:col-span-5 p-5 font-mono text-xs">
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
            now · playing
          </div>
          <div className="text-foreground">deep work · 02:14:00</div>
          <div className="mt-2 text-muted-foreground">
            <span className="text-cyan-accent">›</span> shipping landslide ML pipeline
          </div>
        </div>
      </div>

      {/* Ticker */}
      <div className="mt-10 border-y border-border bg-black/30 overflow-hidden py-3">
        <div className="flex animate-marquee whitespace-nowrap font-mono text-sm text-muted-foreground">
          {[...Array(2)].map((_, dup) => (
            <div key={dup} className="flex shrink-0">
              {ticker.map((t, i) => (
                <span key={`${dup}-${i}`} className="px-6 flex items-center gap-6">
                  <span className="text-cyan-accent">·</span>
                  <span>{t}</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}