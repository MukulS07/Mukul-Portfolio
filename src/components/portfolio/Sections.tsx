import { Section, TerminalCard } from "./Section";
import { ProjectVideo } from "./ProjectVideo";
import { Github, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export function About() {
  return (
    <Section id="about" label="about.md" title="> whoami">
      <div className="grid lg:grid-cols-5 gap-6">
        <TerminalCard title="~/bio.txt" status="readme">
          <div className="font-mono text-sm space-y-3 leading-relaxed">
            <p>
              <span className="text-accent">$</span> whoami
            </p>
            <p className="text-foreground">Final-year B.Tech CSE (Cyber Security) @ LPU, Punjab.</p>
            <p className="text-muted-foreground">
              Published researcher — DASGRI Congress 2026. Built
              <span className="text-accent"> EcoGeoGuard</span> (AI-IoT landslide platform) and{" "}
              <span className="text-accent">INVENTROX</span> (AI business OS for SMEs). Obsessed
              with secure, cloud-native systems.
            </p>
            <p className="text-muted-foreground">
              <span className="text-accent">$</span> focus
              <br />
              <span className="text-foreground">
                → cyber security · cloud architecture · AI / IoT systems
              </span>
            </p>
          </div>
        </TerminalCard>

        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
              education · stack
            </div>
            <div className="font-mono text-sm">
              <div className="text-foreground">B.Tech · CSE (Cyber Security)</div>
              <div className="text-muted-foreground">Lovely Professional University</div>
              <div className="text-dim text-xs mt-1">2022 – 2026</div>
            </div>
          </div>
          <div className="glass-panel p-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
              status · interests
            </div>
            <div className="flex flex-wrap gap-2 font-mono text-xs">
              {["secure-arch", "cloud", "ai/iot", "game-dev", "research", "open-source"].map(
                (t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded border border-border text-muted-foreground hover:text-accent hover:border-accent transition"
                  >
                    #{t}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

const skillGroups = [
  {
    name: "Cyber Security",
    items: [
      ["Network Security", 4],
      ["IAM", 4],
      ["Cloud Security (AWS)", 4],
      ["Secure Architecture", 3],
      ["Ethical Hacking", 3],
    ],
  },
  {
    name: "AI & ML",
    items: [
      ["ML Algorithms", 4],
      ["AI-IoT", 4],
      ["LLM / GenAI APIs", 4],
      ["Prompt Engineering", 4],
    ],
  },
  {
    name: "Cloud & DevOps",
    items: [
      ["AWS Lambda", 5],
      ["DynamoDB", 4],
      ["API Gateway", 4],
      ["Amplify · SNS · SQS", 4],
      ["Step Functions · CodePipeline", 3],
      ["CI/CD · NGINX", 3],
    ],
  },
  {
    name: "Web / Backend",
    items: [
      ["Node.js · Express", 5],
      ["React · Next.js", 5],
      ["MongoDB Atlas", 4],
      ["MySQL", 3],
    ],
  },
  {
    name: "Mobile & UX",
    items: [
      ["Flutter", 4],
      ["UI/UX · Figma", 4],
    ],
  },
  {
    name: "Languages",
    items: [
      ["Python", 5],
      ["Java", 4],
      ["C / C++", 4],
      ["C#", 3],
    ],
  },
] as const;

function Bars({ level }: { level: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={"h-1.5 w-3 rounded-sm " + (i < level ? "bg-accent" : "bg-white/10")}
        />
      ))}
    </div>
  );
}

export function Skills() {
  const ticker = [
    "Git",
    "GitHub",
    "VS Code",
    "IntelliJ",
    "Salesforce CLI",
    "Unity 3D",
    "Blender",
    "Docker",
    "Linux",
    "Bash",
    "Postman",
  ];
  return (
    <Section id="skills" label="skills.json" title="// stack & arsenal">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {skillGroups.map((g) => (
          <div key={g.name} className="glass-panel p-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-4">
              ── {g.name} ──
            </div>
            <ul className="space-y-3 font-mono text-sm">
              {g.items.map(([name, lvl]) => (
                <li key={name as string} className="flex items-center justify-between gap-3">
                  <span className="text-foreground">{name}</span>
                  <Bars level={lvl as number} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-8 border-y border-border bg-black/30 overflow-hidden py-2.5">
        <div className="flex animate-marquee-slow whitespace-nowrap font-mono text-xs text-dim">
          {[...Array(2)].map((_, dup) => (
            <div key={dup} className="flex shrink-0">
              {ticker.map((t, i) => (
                <span key={`${dup}-${i}`} className="px-5">
                  <span className="text-accent">·</span> {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

type Project = {
  num: string;
  title: string;
  type: string;
  period: string;
  description: string;
  stack: string[];
  stats?: { k: string; v: string }[];
  links: { label: string; href: string }[];
  status: "live" | "shipped" | "research";
  video?: string;
};

const projects: Project[] = [
  {
    num: "01",
    title: "EcoGeoGuard — AI-IoT Landslide Prediction",
    type: "Personal Research Project",
    period: "Dec 2025 – May 2026",
    status: "live",
    video: "/videooutput/My Video.mp4",
    description:
      "End-to-end AI-IoT system for real-time landslide prediction and smart agriculture. Multi-sensor fusion (soil moisture, tilt, vibration, rainfall) feeds an ML pipeline outputting a 0–1 risk score every 30s. Three role dashboards: Farmer, Gov, Admin. Alerts via SMS, app, alarms.",
    stats: [
      { k: "ML F1 Score", v: "0.94" },
      { k: "Alert Latency", v: "< 3 min" },
      { k: "Active Nodes", v: "187" },
    ],
    stack: ["Python", "ML", "AWS Lambda", "DynamoDB", "API Gateway", "IoT", "LoRa", "Next.js"],
    links: [
      { label: "live →", href: "https://ecogeoguard.vercel.app/" },
      { label: "paper", href: "#research" },
    ],
  },
  {
    num: "02",
    title: "INVENTROX — AI Business Operating System",
    type: "Personal Product",
    period: "2026",
    status: "live",
    video: "/videooutput/My Video-1.mp4",
    description:
      "AI-powered Business OS for Indian SMEs — replaces 4–6 fragmented tools with one platform. Smart inventory, lightning POS, GST invoicing, built-in CRM, live analytics, and an AI assistant for plain-language business queries.",
    stats: [
      { k: "Uptime", v: "99.98%" },
      { k: "AI Insights", v: "8K+" },
      { k: "Pricing", v: "₹999/mo" },
    ],
    stack: ["Next.js", "Node.js", "React", "MongoDB", "AI APIs", "Vercel"],
    links: [{ label: "live →", href: "https://inventrox.vercel.app/" }],
  },
  {
    num: "03",
    title: "Space Galactus",
    type: "LPU Academic · Team of 3",
    period: "Jan – Apr 2026",
    status: "shipped",
    description:
      "2D top-down space shooter built in Unity 6. Architected the player controller, wave spawner with escalating difficulty, multi-phase boss encounters, and a ScriptableObject-driven weapon/power-up inventory system.",
    stack: ["Unity 6", "C#", "2D Physics", "New Input System", "ScriptableObjects"],
    links: [{ label: "github →", href: "https://github.com/mukulsharmams007" }],
  },
  {
    num: "04",
    title: "SIH — AYUSH VR Herbal Garden",
    type: "Smart India Hackathon",
    period: "Sep 2024",
    status: "shipped",
    description:
      "Immersive VR experience for learning Ayurvedic medicinal plants. Full Node/Express/Mongo backend deployed on Vercel. Built Unity 3D + Oculus SDK integration under hackathon time pressure.",
    stack: ["Next.js", "Express", "MongoDB", "Unity 3D", "Blender", "Oculus SDK"],
    links: [],
  },
];

const statusColor: Record<Project["status"], string> = {
  live: "text-accent border-accent/40",
  shipped: "text-accent border-accent/40",
  research: "text-amber-warn border-amber-warn/40",
};

export function Projects() {
  return (
    <Section id="projects" label="projects/" title="// shipped & in production">
      <div className="grid lg:grid-cols-2 gap-6">
        {projects.map((p) => (
          <article
            key={p.num}
            className="border border-border bg-background group hover:border-accent/50 transition"
          >
            <header className="flex items-center justify-between px-5 py-3 border-b border-border font-mono text-[10px] tracking-[0.22em] text-muted-foreground">
              <span>PROJECT · {p.num}</span>
              <span
                className={
                  "px-2 py-0.5 border text-[10px] tracking-[0.22em] " + statusColor[p.status]
                }
              >
                {p.status}
              </span>
            </header>

            <div className="p-5 sm:p-6">
              <h3 className="font-sans text-xl font-semibold text-foreground">{p.title}</h3>
              <div className="mt-1 font-mono text-xs text-muted-foreground">
                {p.type} <span className="text-dim">·</span> {p.period}
              </div>

              <ProjectVideo src={p.video} title={p.title} />

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{p.description}</p>

              {p.stats && (
                <div className="mt-5 grid grid-cols-3 gap-2 font-mono text-[9px] sm:text-xs">
                  {p.stats.map((s) => (
                    <div key={s.k} className="border border-border rounded-md p-1.5 sm:p-2.5 bg-black/20">
                      <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.18em] text-muted-foreground truncate" title={s.k}>
                        {s.k}
                      </div>
                      <div className="mt-1 text-foreground font-semibold sm:font-normal">{s.v}</div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-5 flex flex-wrap gap-1.5 font-mono text-[11px]">
                {p.stack.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded border border-border text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {p.links.length > 0 && (
                <div className="mt-5 flex gap-3 font-mono text-xs">
                  {p.links.map((l) => (
                    <a
                      key={l.label}
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-accent hover:underline underline-offset-4"
                    >
                      [{l.label}]
                    </a>
                  ))}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

export function Research() {
  return (
    <Section id="research" label="research/" title="// published">
      <div className="glass-panel overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-black/30 font-mono text-xs">
          <span className="text-muted-foreground">research · published</span>
          <span className="text-accent">accepted</span>
        </div>
        <div className="p-6 sm:p-10 grid md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
              DASGRI Congress 2026 · April 2026
            </div>
            <h3 className="mt-3 font-sans text-2xl sm:text-3xl font-semibold text-foreground leading-tight">
              EcoGeoGuard: AI-IoT Based Landslide Prediction and Smart Agriculture System
            </h3>
            <p className="mt-3 font-mono text-sm text-muted-foreground">Mukul Sharma et al.</p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground max-w-xl">
              A multi-sensor fusion approach combining LoRa-based IoT nodes with an ML risk-scoring
              pipeline on AWS, delivering sub-3-minute landslide alerts and dual-use smart
              agriculture telemetry.
            </p>
          </div>
          <div className="font-mono text-xs space-y-3">
            <div className="border border-border rounded-md p-3 bg-black/20">
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                venue
              </div>
              <div className="mt-1 text-foreground">DASGRI Congress 2026</div>
            </div>
            <div className="border border-border rounded-md p-3 bg-black/20">
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                status
              </div>
              <div className="mt-1 text-accent">accepted · oral</div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

const timeline = [
  {
    when: "Jun – Jul 2025",
    title: "Salesforce Developer Catalyst Plus",
    org: "Trailblazer Connect",
    bullets: [
      "Rank: Mountaineer · 29 badges · 25,225 pts",
      "Apex, LWC, SOQL, Flow Builder, REST API",
    ],
  },
  {
    when: "Jan – Feb 2025",
    title: "DevOps with Cloud Computing — AWS",
    org: "Programming Pathsala",
    bullets: [
      "Built serverless site with 10+ AWS services",
      "Lambda triggers, SQS, Step Functions shaped EcoGeoGuard backend",
    ],
  },
  {
    when: "Dec 2022 – Nov 2023",
    title: "CEO · Student Organisation SAPPHIRE",
    org: "Lovely Professional University",
    bullets: [
      "Led 20+ member org under LPU Dept of Student Organisations",
      "Event planning, member management, inter-department coordination",
    ],
  },
];

interface Certificate {
  name: string;
  issuer: string;
  date: string;
  fileUrl: string | null;
  thumbnailUrl: string | null;
}

const certs: Certificate[] = [
  {
    name: "Google UX Design Specialization",
    issuer: "Google · Coursera",
    date: "Apr 2026",
    fileUrl: "/certificates/google_ux_specialization.pdf",
    thumbnailUrl: "/certificates/google_ux_specialization_thumb.png",
  },
  {
    name: "Salesforce Developer Training",
    issuer: "Salesforce · Programming Pathsala",
    date: "Jun – Jul 2025",
    fileUrl: "/certificates/salesforce_training.pdf",
    thumbnailUrl: "/certificates/salesforce_training_thumb.png",
  },
  {
    name: "Game Design & Development Capstone",
    issuer: "Michigan State University · Coursera",
    date: "Nov 2025",
    fileUrl: "/certificates/game_design_capstone.pdf",
    thumbnailUrl: "/certificates/game_design_capstone_thumb.png",
  },
  {
    name: "Cloud Computing",
    issuer: "NPTEL (IIT)",
    date: "Jul – Oct 2024",
    fileUrl: "/certificates/cloud_computing_nptel.pdf",
    thumbnailUrl: "/certificates/cloud_computing_nptel_thumb.png",
  },
  {
    name: "Google UI/UX: Build Dynamic User Interfaces",
    issuer: "Google · Coursera",
    date: "Apr 2026",
    fileUrl: "/certificates/google_ux_dynamic_ui.pdf",
    thumbnailUrl: "/certificates/google_ux_dynamic_ui_thumb.png",
  },
  {
    name: "Java Capstone Project",
    issuer: "Programming Pathsala",
    date: "Jun – Aug 2024",
    fileUrl: "/certificates/java_capstone.jpg",
    thumbnailUrl: "/certificates/java_capstone_thumb.jpg",
  },
  {
    name: "DSA using C/C++",
    issuer: "Udemy",
    date: "Feb – Mar 2024",
    fileUrl: null,
    thumbnailUrl: null,
  },
  {
    name: "Design & Analysis of Algorithms",
    issuer: "Coursera",
    date: "Jan – May 2024",
    fileUrl: null,
    thumbnailUrl: null,
  },
];

export function Experience() {
  return (
    <Section id="experience" label="experience.log" title="// training · leadership">
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Experience Timeline */}
        <div className="lg:col-span-5 relative">
          <div className="absolute left-3 top-2 bottom-2 w-px bg-border" />
          <ul className="space-y-6">
            {timeline.map((t) => (
              <li key={t.title} className="pl-10 relative">
                <span className="absolute left-2 top-1.5 h-2.5 w-2.5 rounded-full bg-accent ring-4 ring-background" />
                <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                  {t.when}
                </div>
                <div className="mt-1 font-sans text-lg font-semibold text-foreground">
                  {t.title}
                </div>
                <div className="font-mono text-xs text-muted-foreground">{t.org}</div>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {t.bullets.map((b) => (
                    <li key={b}>
                      <span className="text-accent font-mono">→</span> {b}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Certifications full-width grid */}
      <div className="mt-12 pt-8 border-t border-border/40">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
          certifications · telemetry
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {certs.map((c) => (
            <a
              key={c.name}
              href={c.fileUrl || undefined}
              target="_blank"
              rel="noopener noreferrer"
              className={`glass-panel overflow-hidden flex flex-col group transition-all duration-300 ${
                c.fileUrl 
                  ? "hover:border-accent hover:shadow-[0_0_15px_rgba(56,189,248,0.15)] cursor-pointer" 
                  : "opacity-85"
              }`}
            >
              {/* Thumbnail area */}
              <div className="aspect-video w-full bg-black/45 relative overflow-hidden border-b border-border/20">
                {c.thumbnailUrl ? (
                  <img
                    src={c.thumbnailUrl}
                    alt={c.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 font-mono text-[9px] text-muted-foreground bg-gradient-to-br from-black to-accent/5">
                    <span className="text-accent/40 font-bold mb-1">⚡ [NO_PREVIEW]</span>
                    <span className="text-[7px] text-dim">{c.issuer}</span>
                  </div>
                )}
                
                {/* View overlay */}
                {c.fileUrl && (
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center font-mono text-[9px] tracking-widest text-accent font-bold uppercase">
                    [ VIEW CREDENTIAL ]
                  </div>
                )}
              </div>

              {/* Detail area */}
              <div className="p-3 flex-1 flex flex-col justify-between gap-1.5 bg-black/25">
                <div>
                  <div className="font-mono text-[11px] leading-tight text-foreground group-hover:text-accent transition-colors font-semibold">
                    {c.name}
                  </div>
                  <div className="font-mono text-[9px] text-muted-foreground mt-1">
                    {c.issuer}
                  </div>
                </div>
                <div className="font-mono text-[8px] text-dim text-right">
                  {c.date}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </Section>
  );
}

export function Contact() {
  return (
    <Section id="contact" label="contact" title="> contact --mukul">
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <TerminalCard title="~/contact.sh" status="open to roles">
            <div className="font-mono text-sm space-y-1">
              <Row
                k="email"
                v="mukulsharmaworks@gmail.com"
                href="mailto:mukulsharmaworks@gmail.com"
              />
              <Row
                k="github"
                v="github.com/mukulsharmams007"
                href="https://github.com/mukulsharmams007"
              />
              <Row
                k="linkedin"
                v="linkedin.com/in/mukul-sharma-514634214"
                href="https://www.linkedin.com/in/mukul-sharma-514634214/"
              />
              <Row k="mobile" v="+91-7737360788" href="tel:+917737360788" />
              <Row k="location" v="Jaipur, IN · IST" />
            </div>
            <div className="mt-6 font-mono text-xs text-muted-foreground border-t border-border pt-4">
              <span className="text-accent">$</span> echo "Available for full-time roles in Cyber
              Security, Cloud, Full-Stack & AI/ML"
              <span className="text-accent animate-cursor">▌</span>
            </div>
          </TerminalCard>
        </div>

        <div className="lg:col-span-2">
          <form
            className="glass-panel p-5 space-y-4 font-mono text-sm"
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const data = new FormData(form);
              const subject = encodeURIComponent(`Portfolio · ${data.get("name") ?? "Hello"}`);
              const body = encodeURIComponent(String(data.get("message") ?? ""));
              window.location.href = `mailto:mukulsharmaworks@gmail.com?subject=${subject}&body=${body}`;
            }}
          >
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              send · message
            </div>
            <Field name="name" label="name" placeholder="ada lovelace" />
            <Field name="email" label="email" placeholder="you@domain.com" type="email" />
            <div>
              <label className="block text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-1.5">
                message
              </label>
              <textarea
                name="message"
                rows={4}
                required
                className="w-full bg-black/40 border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-dim focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent resize-none"
                placeholder="// tell me what you're building..."
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2.5 rounded-md bg-accent text-primary-foreground hover:opacity-90 transition"
            >
              [transmit →]
            </button>
          </form>
        </div>
      </div>
    </Section>
  );
}

function Row({ k, v, href }: { k: string; v: string; href?: string }) {
  const Icon = {
    email: Mail,
    github: Github,
    linkedin: Linkedin,
    mobile: Phone,
    location: MapPin,
  }[k];

  const inner = (
    <div className="grid grid-cols-[90px_1fr] sm:grid-cols-[115px_1fr] gap-4 py-2 px-3 -mx-3 rounded hover:bg-white/[0.03] transition-colors items-center group cursor-pointer">
      <span className="text-muted-foreground flex items-center gap-2 select-none">
        {Icon && (
          <Icon
            size={14}
            className="text-muted-foreground group-hover:text-accent transition-colors"
          />
        )}
        <span>{k}</span>
      </span>
      <span className="text-foreground group-hover:text-accent transition-colors break-all font-mono">
        {v}
      </span>
    </div>
  );

  return href ? (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
      className="block"
    >
      {inner}
    </a>
  ) : (
    <div>{inner}</div>
  );
}

function Field({
  name,
  label,
  placeholder,
  type = "text",
}: {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-1.5">
        {label}
      </label>
      <input
        name={name}
        type={type}
        required
        placeholder={placeholder}
        className="w-full bg-black/40 border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-dim focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
      />
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border mt-10">
      <div className="mx-auto max-w-6xl px-4 py-8 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-muted-foreground">
        <div>
          <span className="text-accent">$</span> echo "© {new Date().getFullYear()} Mukul Sharma ·
          built from a terminal"
        </div>
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          system · operational
        </div>
      </div>
    </footer>
  );
}
