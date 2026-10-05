import { useEffect, useState, useCallback } from "react";
import portrait from "@/assets/portrait.jpg";
import { ProjectVideo } from "./ProjectVideo";
import { Link } from "@tanstack/react-router";
import { checkDeployments } from "@/lib/chatbot-service";
import {
  fetchGitHubProfile,
  fetchUnifiedActivityFeed,
  fetchGitHubContributions,
  type FormattedActivity,
  type ContributionDay,
  type GitHubContributionsData,
} from "@/lib/github-service";
import {
  getLinkedInUpdates,
  addLinkedInUpdate,
  formatRelativeTime,
  type LinkedInUpdate,
} from "@/lib/linkedin-service";
import { RotateCw, Plus, X, Send } from "lucide-react";

const roles = [
  "Full-Stack Developer",
  "React 19 · Node.js · Next.js",
  "Cloud & AWS Architect",
  "AI & IoT Systems Builder",
  "Cyber Security Specialist",
];

const stats: { label: string; value: string }[] = [
  { label: "LINES OF CODE", value: "1.5K" },
  { label: "CGPA", value: "7.25" },
  { label: "GITHUB REPOS", value: "7" },
  { label: "AWS SERVICES", value: "10+" },
];

const ticker = [
  "Python",
  "AWS Lambda",
  "DynamoDB",
  "Next.js",
  "Node.js",
  "React",
  "Flutter",
  "Unity 6",
  "C#",
  "IAM",
  "CI/CD",
  "MongoDB",
  "Figma",
  "Salesforce",
  "IoT",
  "LoRa",
  "TypeScript",
  "Express",
  "MySQL",
  "Blender",
];

const mockEvents: {
  t: string;
  tag: string;
  tagColor: string;
  repo: string;
  msg: string;
  note: string;
  fullMsg?: string;
  link?: string;
}[] = [
  {
    t: "just now",
    tag: "PUSH",
    tagColor: "text-accent",
    repo: "maison-harive",
    msg: 'pushed: "feat: luxury jewellery chamber transitions & archive"',
    note: "main",
    fullMsg: "Maison Harivē luxury jewellery house website update",
    link: "https://github.com/MukulS07/maison-harive",
  },
  {
    t: "2h ago",
    tag: "PUSH",
    tagColor: "text-accent",
    repo: "Mukul-Portfolio",
    msg: 'pushed: "ci: GitHub Pages deployment & live sync"',
    note: "main",
    fullMsg: "pushed commits to main on MukulS07/Mukul-Portfolio",
    link: "https://github.com/MukulS07/Mukul-Portfolio",
  },
  {
    t: "1d ago",
    tag: "PUSH",
    tagColor: "text-accent",
    repo: "ApexF1",
    msg: 'pushed: "feat: F1 2026 telemetry dashboard"',
    note: "main",
    fullMsg: "ApexF1 Formula 1 telemetry dashboard update",
    link: "https://github.com/MukulS07/ApexF1",
  },
  {
    t: "6d ago",
    tag: "CREATE",
    tagColor: "text-amber-warn",
    repo: "MukulS07",
    msg: 'created repository "MukulS07"',
    note: "+repo",
    fullMsg: "Created new public profile repository MukulS07",
    link: "https://github.com/MukulS07/MukulS07",
  },
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
    <div className="border border-border p-4 sm:p-6 min-h-[95px] sm:min-h-[110px] flex flex-col justify-between">
      <div className="text-[9px] sm:text-[10px] tracking-[0.16em] sm:tracking-[0.22em] text-muted-foreground font-mono truncate">
        {label}
      </div>
      <div className="font-serif-display text-3xl sm:text-5xl text-foreground leading-none">
        {value}
      </div>
    </div>
  );
}

function GithubHeatmap({ days }: { days?: ContributionDay[] }) {
  const shade = [
    "bg-white/[0.04]",
    "bg-accent/25",
    "bg-accent/50",
    "bg-accent/75",
    "bg-accent",
  ];
  const items =
    days && days.length === 182
      ? days
      : Array.from({ length: 182 }, (_, i) => ({
          date: `2026-${String(Math.floor(i / 30) + 4).padStart(2, "0")}-${String((i % 30) + 1).padStart(2, "0")}`,
          count: 0,
          level: (i % 4 === 0 ? 1 : i % 7 === 0 ? 2 : 0) as 0 | 1 | 2 | 3 | 4,
        }));

  return (
    <div
      className="grid grid-rows-7 grid-flow-col gap-[3px]"
      style={{ gridAutoColumns: "10px" }}
    >
      {items.map((c, i) => (
        <span
          key={c.date || i}
          title={`${c.date}: ${c.count} contribution${c.count === 1 ? "" : "s"}`}
          className={`heatmap-cell h-[10px] w-[10px] rounded-[1px] transition-transform hover:scale-125 hover:z-10 cursor-pointer ${shade[c.level]}`}
          style={{ animationDelay: `${(i % 26) * 12}ms` }}
        />
      ))}
    </div>
  );
}

function Radar() {
  // Mock proficiency radar inspired by the reference
  const axes = [
    "PY",
    "AWS",
    "TS",
    "C#",
    "JAVA",
    "NEXT",
    "REACT",
    "DOCKER",
    "IOT",
    "ML",
    "MONGO",
    "FLUTTER",
  ];
  const vals = [0.95, 0.9, 0.8, 0.7, 0.65, 0.85, 0.8, 0.55, 0.7, 0.75, 0.7, 0.6];
  const cx = 110,
    cy = 110,
    R = 90;
  const pts = vals.map((v, i) => {
    const a = (i / axes.length) * Math.PI * 2 - Math.PI / 2;
    return [cx + Math.cos(a) * R * v, cy + Math.sin(a) * R * v] as const;
  });
  const path = pts.map(([x, y], i) => (i === 0 ? `M${x},${y}` : `L${x},${y}`)).join(" ") + "Z";
  return (
    <svg viewBox="0 0 220 220" className="w-full max-w-[260px]">
      {[0.25, 0.5, 0.75, 1].map((s) => (
        <circle
          key={s}
          cx={cx}
          cy={cy}
          r={R * s}
          fill="none"
          stroke="currentColor"
          className="text-white/10"
          strokeWidth={1}
        />
      ))}
      {axes.map((_, i) => {
        const a = (i / axes.length) * Math.PI * 2 - Math.PI / 2;
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={cx + Math.cos(a) * R}
            y2={cy + Math.sin(a) * R}
            stroke="currentColor"
            className="text-white/10"
            strokeWidth={1}
          />
        );
      })}
      <path
        d={path}
        fill="currentColor"
        className="text-accent/20"
        stroke="currentColor"
        strokeWidth={1.25}
      >
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
          <text
            key={label}
            x={lx}
            y={ly}
            fontSize={8}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-muted-foreground font-mono"
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
}

export function Hero() {
  const [roleIdx, setRoleIdx] = useState(0);
  const [repoCount, setRepoCount] = useState("9");
  const [eventsList, setEventsList] = useState<FormattedActivity[]>([]);
  const [linkedinList, setLinkedinList] = useState<LinkedInUpdate[]>([]);
  const [contribData, setContribData] = useState<GitHubContributionsData | null>(null);
  const [isSyncingGH, setIsSyncingGH] = useState(false);
  const [showAddLinkedIn, setShowAddLinkedIn] = useState(false);
  const [newPostText, setNewPostText] = useState("");
  const [newPostType, setNewPostType] = useState<LinkedInUpdate["type"]>("MILESTONE");
  const [newPostLink, setNewPostLink] = useState("https://www.linkedin.com/in/mukul-sharma-07m");

  const [deploymentStatuses, setDeploymentStatuses] = useState<
    Record<string, { online: boolean; latency: number | null; loading: boolean }>
  >({
    ApexF1: { online: true, latency: null, loading: true },
    "Maison Harivē": { online: true, latency: null, loading: true },
    EcoGeoGuard: { online: true, latency: null, loading: true },
    "INVENTROX OS": { online: true, latency: null, loading: true },
    "Mukul Portfolio": { online: true, latency: null, loading: true },
    "Space Galactus": { online: true, latency: null, loading: true },
    "AYUSH VR Herbal Garden": { online: true, latency: null, loading: true },
  });

  useEffect(() => {
    const sites = [
      { name: "ApexF1", url: "https://apex-f1-eosin.vercel.app" },
      { name: "Maison Harivē", url: "https://github.com/MukulS07/maison-harive" },
      { name: "EcoGeoGuard", url: "https://ecogeoguard.vercel.app/" },
      { name: "INVENTROX OS", url: "https://inventrox.vercel.app/" },
      { name: "Mukul Portfolio", url: "https://github.com/MukulS07/Mukul-Portfolio" },
      { name: "Space Galactus", url: "https://github.com/MukulS07" },
      { name: "AYUSH VR Herbal Garden", url: "https://github.com/MukulS07" },
    ];

    const pingAll = async () => {
      try {
        const portfolioUrl = window.location.origin;
        const urlsToPing = sites.map((s) => (s.name === "Mukul Portfolio" ? portfolioUrl : s.url));

        const results = await checkDeployments({ data: urlsToPing });

        const newStatuses: typeof deploymentStatuses = {};
        sites.forEach((site, index) => {
          const res = results[index];
          newStatuses[site.name] = {
            online: res.online,
            latency: res.latency,
            loading: false,
          };
        });
        setDeploymentStatuses(newStatuses);
      } catch (err) {
        console.error("Failed to ping deployments:", err);
        setDeploymentStatuses((prev) => {
          const updated = { ...prev };
          Object.keys(updated).forEach((k) => {
            updated[k].loading = false;
          });
          return updated;
        });
      }
    };

    pingAll();
    const interval = setInterval(pingAll, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setRoleIdx((i) => (i + 1) % roles.length), 2200);
    return () => clearInterval(id);
  }, []);

  const loadGitHubFeed = useCallback(async (force = false) => {
    setIsSyncingGH(true);
    try {
      const feed = await fetchUnifiedActivityFeed(force);
      if (feed && feed.length > 0) {
        setEventsList(feed);
      }
    } catch (e) {
      console.warn("GitHub sync error:", e);
    } finally {
      setIsSyncingGH(false);
    }
  }, []);

  const loadLinkedInFeed = useCallback(() => {
    const list = getLinkedInUpdates();
    setLinkedinList(list);
  }, []);

  const handleBroadcastLinkedIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;
    addLinkedInUpdate({
      text: newPostText.trim(),
      type: newPostType,
      link: newPostLink.trim() || "https://www.linkedin.com/in/mukul-sharma-07m",
      date: new Date().toISOString(),
    });
    setNewPostText("");
    setShowAddLinkedIn(false);
  };

  useEffect(() => {
    // 1. Fetch public profile stats
    fetchGitHubProfile().then((profile) => {
      if (profile && typeof profile.public_repos === "number") {
        setRepoCount(String(profile.public_repos));
      }
    });

    // 2. Load unified live GitHub activity feed
    loadGitHubFeed(false);

    // 3. Load LinkedIn feed
    loadLinkedInFeed();

    // 4. Load real GitHub contribution graph and streak
    fetchGitHubContributions().then((res) => {
      if (res) setContribData(res);
    });

    const onLinkedInUpdated = () => loadLinkedInFeed();
    window.addEventListener("ms_linkedin_updated", onLinkedInUpdated);
    return () => window.removeEventListener("ms_linkedin_updated", onLinkedInUpdated);
  }, [loadGitHubFeed, loadLinkedInFeed]);

  // Find the latest PUSH or CREATE event to showcase what the user is working on
  const activeEvent = eventsList.find((e) => e.tag === "PUSH" || e.tag === "CREATE");

  const linkedinEvents = linkedinList.map((item) => {
    const t = formatRelativeTime(item.date);

    let tagColor = "text-muted-foreground";
    switch (item.type) {
      case "RESEARCH":
        tagColor = "text-accent";
        break;
      case "MILESTONE":
        tagColor = "text-yellow-400";
        break;
      case "PRODUCT":
        tagColor = "text-amber-warn";
        break;
      case "ARTICLE":
        tagColor = "text-emerald-400";
        break;
      case "ENGINEERING":
        tagColor = "text-indigo-400";
        break;
      case "RELEASE":
        tagColor = "text-cyan-400";
        break;
    }

    return {
      t,
      tag: item.type,
      tagColor,
      repo: "linkedin.com",
      msg: item.text,
      note: "transmit →",
      link: item.link || "https://www.linkedin.com/in/mukul-sharma-07m",
    };
  });

  let activeProjName = "Mukul Portfolio";
  let activeProjSub = "Personal Developer System & AI Hub";
  let activeProjFolder = "~/github/Mukul-Portfolio";
  let activeProjVideo = "/videooutput/My Video.mp4";
  let activeProjStack = ["TanStack Start", "React", "TypeScript", "Tailwind CSS v4", "Vite"];
  let activeProjCommit = 'pushed: "feat: track video outputs with Git LFS, add portfolio sections and GitHub integration"';
  let activeProjTime = "JUST NOW";
  let activeProjStatus = "ACTIVE";
  let activeProjStatusColor = "text-accent";

  if (activeEvent) {
    const repoLower = activeEvent.repo.toLowerCase();
    activeProjCommit = activeEvent.msg;
    activeProjTime = activeEvent.t;
    activeProjStatus = "ACTIVE";
    activeProjStatusColor = "text-accent";

    if (repoLower.includes("inventrox")) {
      activeProjName = "INVENTROX";
      activeProjSub = "AI Business Operating System";
      activeProjFolder = `~/github/${activeEvent.repo}`;
      activeProjVideo = "/videooutput/My Video-1.mp4";
      activeProjStack = ["Next.js", "Node.js", "Express", "MongoDB", "AI APIs"];
    } else if (repoLower.includes("maison") || repoLower.includes("harive")) {
      activeProjName = "Maison Harivē";
      activeProjSub = "Luxury Men's Haute Joaillerie & Archive";
      activeProjFolder = `~/github/${activeEvent.repo}`;
      activeProjVideo = "/videooutput/MAISONHARIVE MAIN WEBSITE.mp4";
      activeProjStack = ["Next.js 16", "React 19", "Tailwind CSS v4", "Framer Motion", "Supabase"];
    } else if (repoLower.includes("ecogeoguard")) {
      activeProjName = "EcoGeoGuard";
      activeProjSub = "AI-IoT Landslide Prediction Platform";
      activeProjFolder = `~/github/${activeEvent.repo}`;
      activeProjVideo = "/videooutput/My Video.mp4";
      activeProjStack = ["Python", "AWS Lambda", "DynamoDB", "LoRa", "Next.js"];
    } else if (repoLower.includes("apexf1")) {
      activeProjName = "ApexF1";
      activeProjSub = "Formula 1 2026 Telemetry Dashboard";
      activeProjFolder = `~/github/${activeEvent.repo}`;
      activeProjVideo = "/videooutput/apexf1.mp4";
      activeProjStack = ["TanStack Start", "Three.js", "Tailwind CSS v4", "NVIDIA NIM"];
    } else if (repoLower.includes("healthtech")) {
      activeProjName = "HealthTech Web Layout";
      activeProjSub = "Telemedicine & AI Clinical Diagnostics";
      activeProjFolder = `~/github/${activeEvent.repo}`;
      activeProjVideo = "/videooutput/My Video.mp4";
      activeProjStack = ["React", "TypeScript", "Tailwind CSS", "Vite", "AI Triage"];
    } else if (repoLower.includes("mukul-portfolio") || repoLower.includes("mukuls07")) {
      activeProjName = "Mukul Portfolio";
      activeProjSub = "Personal Developer System & AI Hub";
      activeProjFolder = `~/github/${activeEvent.repo}`;
      activeProjVideo = "/videooutput/My Video.mp4";
      activeProjStack = ["TanStack Start", "React", "TypeScript", "Tailwind CSS v4", "Vite"];
    } else {
      activeProjName = activeEvent.repo;
      activeProjSub = "Active GitHub Repository";
      activeProjFolder = `~/github/${activeEvent.repo}`;
      activeProjVideo = "/videooutput/My Video.mp4";
      activeProjStack = ["React", "TypeScript", "Vite", "TanStack", "TailwindCSS"];
    }
  }

  const totalCommits = contribData?.total || 672;
  const streakDays = contribData?.streak || 3;
  const commits = useCountUp(totalCommits);

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
          <div className="lg:col-span-8 bg-background p-4 sm:p-10 grid sm:grid-cols-5 gap-6 sm:gap-10 items-start relative overflow-hidden group/shield-identity">
            <div className="sm:col-span-3 z-10">
              <div className="font-mono text-[10px] tracking-[0.28em] text-muted-foreground flex justify-between">
                <span>IDENTITY · 01</span>
                <span className="hidden avengers-shield-title text-accent font-semibold">
                  S.H.I.E.L.D. AGENT ACCESS
                </span>
              </div>
              <h1 className="mt-6 sm:mt-8 font-serif-display text-foreground leading-[0.92] text-4xl sm:text-7xl lg:text-[88px]">
                Mukul
                <br />
                <span className="pl-2 sm:pl-10">
                  Sharma<span className="text-accent">.</span>
                </span>
              </h1>
              <div className="font-mono text-[10px] tracking-[0.28em] text-muted-foreground mt-12 flex justify-between">
                <span>CURRENTLY</span>
                <span className="hidden avengers-clearance text-destructive font-bold">
                  CLEARANCE: LEVEL 10
                </span>
              </div>
              <div className="mt-2 font-mono text-sm text-foreground">
                {roles[roleIdx]}
                <span className="text-accent animate-cursor">▌</span>
              </div>

              {/* Bio & HUD Telemetry block to fill vertical empty space */}
              <p className="mt-8 font-mono text-[11px] leading-relaxed text-muted-foreground max-w-sm tracking-wide">
                Full-stack developer who has shipped 6+ platforms end-to-end (ApexF1, Inventrox, EcoGeoGuard). Experienced across React 19, Next.js, Node.js/Express, MongoDB Atlas, and AWS, with a Cyber Security specialization informing secure-by-design architecture.
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
                    alt="Mukul Sharma — Cyber Security Engineer & Cloud Architect"
                    width={768}
                    height={896}
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    className="h-full w-full object-cover grayscale contrast-[1.05]"
                  />
                </div>
                <div className="mt-2 font-mono text-[10px] tracking-[0.22em] text-muted-foreground text-right flex justify-between items-center">
                  <span className="hidden avengers-level-text text-accent font-bold">
                    CLASSIFIED
                  </span>
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
                  <span>›_ COMMIT · {activeProjTime ? activeProjTime.toUpperCase() : "MAIN"}</span>
                </span>
                <span className={`flex items-center gap-1.5 ${activeProjStatusColor}`}>
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${activeProjStatusColor} bg-current animate-pulse`}
                  />
                  {activeProjStatus}
                </span>
              </div>
              <div
                className="mt-4 font-mono text-xs text-muted-foreground truncate"
                title={activeProjFolder}
              >
                {activeProjFolder}
              </div>
              <div
                className="mt-2 font-serif-display text-2xl text-foreground truncate"
                title={activeProjName}
              >
                {activeProjName}
              </div>
              <div
                className="font-mono text-xs text-muted-foreground mt-1 truncate"
                title={activeProjSub}
              >
                {activeProjSub}
              </div>

              {activeProjCommit && (
                <div className="mt-3 border border-border/30 bg-white/[0.02] p-2.5 rounded font-mono text-[11px] leading-snug">
                  <span className="text-accent font-semibold">// LATEST WORK:</span>
                  <div className="text-foreground mt-1 select-all font-light">
                    {activeProjCommit}
                  </div>
                </div>
              )}

              <ProjectVideo src={activeProjVideo} title={activeProjName} />

              <div className="mt-4 flex flex-wrap gap-1.5 font-mono text-[11px]">
                {activeProjStack.map((t) => (
                  <span key={t} className="px-2 py-0.5 border border-border text-muted-foreground">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ROW 2: Latest Live Websites */}
        <div className="mt-px border border-border border-t-0 bg-background p-5 sm:p-6">
          <div className="font-mono text-[10px] tracking-[0.22em] text-muted-foreground uppercase mb-4 flex items-center gap-1.5 select-none">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            ›_ PORTAL: ACTIVE_LIVE_DEPLOYMENTS
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              {
                name: "ApexF1",
                sub: "Ultimate F1 2026 Dashboard",
                desc: "Three.js 3D car livery designer, simulated track telemetry, and NVIDIA NIM chatbot.",
                url: "https://apex-f1-eosin.vercel.app",
                port: "PORT_80",
              },
              {
                name: "Maison Harivē",
                sub: "Men's Haute Joaillerie & Archive",
                desc: "Cinematic jewellery house site with 3-panel chamber transitions, video-text shaders & Supabase.",
                url: "https://github.com/MukulS07/maison-harive",
                port: "PORT_443",
              },
              {
                name: "EcoGeoGuard",
                sub: "AI-IoT Landslide Predictor",
                desc: "Multi-sensor fusion pipeline on AWS returning sub-3-minute risk forecasts.",
                url: "https://ecogeoguard.vercel.app/",
                port: "PORT_443",
              },
              {
                name: "INVENTROX OS",
                sub: "AI Business Operating System",
                desc: "SME POS and GST billing engine with inventory telemetry and automation.",
                url: "https://inventrox.vercel.app/",
                port: "PORT_8080",
              },
              {
                name: "Mukul Portfolio",
                sub: "Cybersecurity Telemetry HUD",
                desc: "This site: serverless Edge-routed, voice chatbot proxy, active git feeds.",
                url: "https://github.com/MukulS07/Mukul-Portfolio",
                port: "PORT_3000",
              },
              {
                name: "Space Galactus",
                sub: "2D Top-Down Space Shooter",
                desc: "Unity 6 game with boss battles and ScriptableObject weapons system.",
                url: "https://github.com/MukulS07",
                port: "PORT_2026",
              },
              {
                name: "AYUSH VR Herbal Garden",
                sub: "VR Learning Experience",
                desc: "Oculus VR virtual garden with Node.js/Express/MongoDB cloud backend.",
                url: "https://github.com/MukulS07",
                port: "PORT_9000",
              },
            ].map((site) => {
              const status = deploymentStatuses[site.name];
              return (
                <div
                  key={site.name}
                  onClick={() => window.open(site.url, "_blank", "noopener,noreferrer")}
                  className="border border-border/60 hover:border-accent hover:bg-white/[0.02] p-4 rounded transition-all duration-300 cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between font-mono text-[9px] text-muted-foreground tracking-wider">
                      <span>{site.port}</span>
                      <span
                        className={`flex items-center gap-1 ${
                          status?.loading
                            ? "text-muted-foreground/60 animate-pulse"
                            : status?.online
                              ? "text-emerald-400"
                              : "text-red-400"
                        }`}
                      >
                        <span
                          className={`h-1 w-1 rounded-full bg-current ${status?.online && !status.loading ? "animate-ping" : ""}`}
                        />
                        {status?.loading
                          ? "PINGING"
                          : status?.online
                            ? `ONLINE${status.latency !== null ? ` (${status.latency}ms)` : ""}`
                            : "OFFLINE"}
                      </span>
                    </div>
                    <h4 className="mt-3 font-serif-display text-lg text-foreground group-hover:text-accent transition-colors">
                      {site.name}
                    </h4>
                    <p className="font-mono text-[10px] text-muted-foreground mt-0.5">{site.sub}</p>
                    <p className="mt-2.5 font-mono text-[11px] leading-relaxed text-muted-foreground/80 line-clamp-2">
                      {site.desc}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-border/30 flex justify-between items-center font-mono text-[10px] text-muted-foreground group-hover:text-accent transition-colors">
                    <span>LAUNCH PORTAL</span>
                    <span>→</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ROW 3: split-screen telemetry feed (GitHub + LinkedIn) */}
        <div className="mt-px grid lg:grid-cols-2 gap-px bg-border border border-border border-t-0">
          {/* Left Terminal: GITHUB TELEMETRY */}
          <div className="bg-background flex flex-col min-w-0">
            <div className="px-5 sm:px-6 py-2.5 flex items-center justify-between font-mono text-[10px] tracking-[0.22em] text-muted-foreground border-b border-border select-none bg-black/15">
              <span className="flex items-center gap-1.5 font-semibold text-accent">
                <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                ›_ UPLINK: GITHUB_LOGS
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => loadGitHubFeed(true)}
                  disabled={isSyncingGH}
                  className="hover:text-accent flex items-center gap-1.5 transition-colors px-2 py-0.5 border border-border hover:border-accent rounded text-[9px] disabled:opacity-50"
                  title="Re-sync latest commits & activity from GitHub"
                >
                  <RotateCw className={`w-2.5 h-2.5 ${isSyncingGH ? "animate-spin text-accent" : ""}`} />
                  <span>{isSyncingGH ? "SYNCING..." : "SYNC NOW"}</span>
                </button>
                <span className="tabular-nums text-muted-foreground/60">
                  {eventsList.length} / 30
                </span>
              </div>
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              <table className="w-full font-mono text-xs">
                <tbody>
                  {eventsList.map((e, i) => (
                    <tr
                      key={i}
                      onClick={
                        e.link
                          ? () => window.open(e.link, "_blank", "noopener,noreferrer")
                          : undefined
                      }
                      title={e.fullMsg || e.msg}
                      className={`border-b border-border/40 last:border-0 hover:bg-white/[0.03] transition-colors ${
                        e.link ? "cursor-pointer" : ""
                      }`}
                    >
                      <td className="hidden sm:table-cell px-5 sm:px-6 py-3 text-muted-foreground w-28 tabular-nums">
                        {e.t}
                      </td>
                      <td className="py-3 w-16 sm:w-20">
                        <span
                          className={`px-2 py-0.5 border text-[9px] tracking-wider uppercase font-semibold ${e.tagColor} border-current/20 bg-current/5`}
                        >
                          {e.tag}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-accent break-all sm:break-normal w-1/4">
                        {e.repo}
                      </td>
                      <td className="py-3 text-foreground break-all sm:break-normal pr-4">
                        {e.msg}
                      </td>
                      <td
                        className="hidden sm:table-cell px-5 sm:px-6 py-3 text-muted-foreground text-right font-light italic truncate max-w-[120px]"
                        title={e.note}
                      >
                        {e.note}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Terminal: LINKEDIN TELEMETRY */}
          <div className="bg-background flex flex-col min-w-0 border-t lg:border-t-0 lg:border-l border-border">
            <div className="px-5 sm:px-6 py-2.5 flex items-center justify-between font-mono text-[10px] tracking-[0.22em] text-muted-foreground border-b border-border select-none bg-black/15">
              <span className="flex items-center gap-1.5 font-semibold text-accent">
                <span className="h-1.5 w-1.5 rounded-full bg-accent animate-ping" />
                ›_ UPLINK: LINKEDIN_FEED
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddLinkedIn(true)}
                  className="hover:text-accent flex items-center gap-1 transition-colors px-2 py-0.5 border border-border hover:border-accent rounded text-[9px]"
                  title="Broadcast new update to live LinkedIn feed"
                >
                  <Plus className="w-2.5 h-2.5 text-accent" />
                  <span>BROADCAST POST</span>
                </button>
                <span className="tabular-nums text-muted-foreground/60">
                  {linkedinEvents.length} updates
                </span>
              </div>
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              <table className="w-full font-mono text-xs">
                <tbody>
                  {linkedinEvents.map((e, i) => (
                    <tr
                      key={i}
                      onClick={
                        e.link
                          ? () => window.open(e.link, "_blank", "noopener,noreferrer")
                          : undefined
                      }
                      title={e.msg}
                      className={`border-b border-border/40 last:border-0 hover:bg-white/[0.03] transition-colors ${
                        e.link ? "cursor-pointer" : ""
                      }`}
                    >
                      <td className="hidden sm:table-cell px-5 sm:px-6 py-3 text-muted-foreground w-28 tabular-nums">
                        {e.t}
                      </td>
                      <td className="py-3 w-16 sm:w-20">
                        <span
                          className={`px-2 py-0.5 border text-[9px] tracking-wider uppercase font-semibold ${e.tagColor} border-current/20 bg-current/5`}
                        >
                          {e.tag}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-accent break-all sm:break-normal w-1/4">
                        {e.repo}
                      </td>
                      <td className="py-3 text-foreground break-all sm:break-normal pr-4">
                        {e.msg}
                      </td>
                      <td
                        className="hidden sm:table-cell px-5 sm:px-6 py-3 text-muted-foreground text-right font-light italic truncate max-w-[120px]"
                        title={e.note}
                      >
                        {e.note}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal: Broadcast New LinkedIn Post */}
        {showAddLinkedIn && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-mono">
            <div className="border border-border bg-background max-w-lg w-full p-6 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
                <div className="flex items-center gap-2 text-accent text-xs">
                  <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                  <span className="tracking-[0.2em] uppercase font-semibold">
                    ›_ BROADCAST LINKEDIN POST
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddLinkedIn(false)}
                  className="text-muted-foreground hover:text-foreground p-1 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleBroadcastLinkedIn} className="space-y-4 text-xs">
                <div>
                  <label className="block text-muted-foreground mb-1 tracking-wider uppercase text-[10px]">
                    Update Content / Milestone Summary *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={newPostText}
                    onChange={(e) => setNewPostText(e.target.value)}
                    placeholder="e.g. Launched new version of ApexF1 with real-time telemetry and 3D car customizer..."
                    className="w-full bg-black/40 border border-border p-2.5 text-foreground placeholder:text-muted-foreground/50 focus:border-accent focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-muted-foreground mb-1 tracking-wider uppercase text-[10px]">
                      Post Category
                    </label>
                    <select
                      value={newPostType}
                      onChange={(e) => setNewPostType(e.target.value as LinkedInUpdate["type"])}
                      className="w-full bg-black/40 border border-border p-2 text-foreground focus:border-accent focus:outline-none"
                    >
                      <option value="MILESTONE">MILESTONE</option>
                      <option value="PRODUCT">PRODUCT</option>
                      <option value="RELEASE">RELEASE</option>
                      <option value="ENGINEERING">ENGINEERING</option>
                      <option value="RESEARCH">RESEARCH</option>
                      <option value="ARTICLE">ARTICLE</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-muted-foreground mb-1 tracking-wider uppercase text-[10px]">
                      Post / Profile URL
                    </label>
                    <input
                      type="url"
                      value={newPostLink}
                      onChange={(e) => setNewPostLink(e.target.value)}
                      placeholder="https://www.linkedin.com/in/mukul-sharma-07m"
                      className="w-full bg-black/40 border border-border p-2 text-foreground focus:border-accent focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setShowAddLinkedIn(false)}
                    className="px-3 py-1.5 border border-border text-muted-foreground hover:text-foreground transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 border border-accent bg-accent/10 text-accent font-semibold flex items-center gap-1.5 hover:bg-accent hover:text-background transition"
                  >
                    <Send className="w-3 h-3" />
                    <span>Transmit Broadcast</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
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
                <span className="flex items-center gap-1.5 text-accent font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                  ⌧ GITHUB · @MUKULS07
                </span>
                <span className="tabular-nums">26W CONTRIBUTION GRAPH</span>
              </div>
              <div className="mt-5 overflow-x-auto">
                <GithubHeatmap days={contribData?.recentDays} />
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-muted-foreground">
                <div>
                  <span className="text-foreground tabular-nums font-semibold">{commits}</span> COMMITS (LAST YEAR)
                  <span className="mx-2 text-dim">·</span>
                  <span className="text-foreground tabular-nums font-semibold">{streakDays}D</span> STREAK
                </div>
                <div className="flex items-center gap-1.5 text-[9px]">
                  LESS
                  <span className="h-2 w-2 rounded-[1px] bg-white/[0.04]" />
                  <span className="h-2 w-2 rounded-[1px] bg-accent/25" />
                  <span className="h-2 w-2 rounded-[1px] bg-accent/50" />
                  <span className="h-2 w-2 rounded-[1px] bg-accent/75" />
                  <span className="h-2 w-2 rounded-[1px] bg-accent" />
                  MORE
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-5">
              <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.22em] text-muted-foreground">
                <span>♪ NOW PLAYING</span>
                <span className="text-accent flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                  ⚡ LIVE REPO DEEP WORK
                </span>
              </div>
              <div className="mt-3 font-serif-display text-xl text-foreground italic flex items-center gap-2">
                <span>building {activeProjName}</span>
              </div>
              <div className="font-mono text-xs text-muted-foreground mt-1 flex items-center justify-between">
                <span>{activeProjStack.slice(0, 4).join(" · ").toLowerCase()}</span>
                <span className="text-[10px] text-accent font-semibold">{activeProjTime}</span>
              </div>
              <div className="mt-3 h-[3px] bg-white/10 overflow-hidden relative">
                <div className="h-full w-3/4 bg-accent animate-pulse" />
              </div>
            </div>
          </div>

          {/* Make a move */}
          <div className="lg:col-span-2 bg-background p-5 sm:p-6 flex flex-col">
            <div className="font-mono text-[10px] tracking-[0.22em] text-muted-foreground text-center">
              MAKE A MOVE
            </div>
            <a
              href="#projects"
              className="mt-5 border border-foreground bg-foreground text-background py-4 px-3 font-mono text-[11px] tracking-[0.22em] flex items-center justify-between hover:opacity-90"
            >
              <span>
                VIEW
                <br />
                WORK
              </span>
              <span>→</span>
            </a>
            <Link
              to="/resume"
              className="mt-2 border border-border py-4 px-3 font-mono text-[11px] tracking-[0.22em] text-foreground hover:border-foreground block text-left"
            >
              VIEW
              <br />
              RESUME
            </Link>
            <div className="mt-2 border border-border py-4 px-3 font-mono text-[11px] tracking-[0.22em] text-muted-foreground flex items-center justify-between">
              <span>
                ⌘ COMMAND
                <br />
                PALETTE
              </span>
              <span className="text-foreground">⌘K</span>
            </div>
            <div className="mt-auto pt-6 font-mono text-[10px] tracking-[0.22em] text-dim text-center">
              ↓ SCROLL FOR
              <br />
              THE LONG FORM
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
