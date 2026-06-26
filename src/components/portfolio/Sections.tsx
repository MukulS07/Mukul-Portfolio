import { Section, TerminalCard } from "./Section";

export function About() {
  return (
    <Section id="about" label="about.md" title="> whoami">
      <div className="grid lg:grid-cols-5 gap-6">
        <TerminalCard title="~/bio.txt" status="readme">
          <div className="font-mono text-sm space-y-3 leading-relaxed">
            <p>
              <span className="text-cyan-accent">$</span> whoami
            </p>
            <p className="text-foreground">
              Final-year B.Tech CSE (Cyber Security) @ LPU, Punjab.
            </p>
            <p className="text-muted-foreground">
              Published researcher — DASGRI Congress 2026. Built
              <span className="text-cyan-accent"> EcoGeoGuard</span> (AI-IoT landslide
              platform) and <span className="text-cyan-accent">INVENTROX</span> (AI
              business OS for SMEs). Obsessed with secure, cloud-native systems.
            </p>
            <p className="text-muted-foreground">
              <span className="text-cyan-accent">$</span> focus
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
                    className="px-2.5 py-1 rounded border border-border text-muted-foreground hover:text-cyan-accent hover:border-cyan-accent transition"
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
          className={
            "h-1.5 w-3 rounded-sm " +
            (i < level ? "bg-cyan-accent" : "bg-white/10")
          }
        />
      ))}
    </div>
  );
}

export function Skills() {
  const ticker = [
    "Git", "GitHub", "VS Code", "IntelliJ", "Salesforce CLI", "Unity 3D",
    "Blender", "Docker", "Linux", "Bash", "Postman",
  ];
  return (
    <Section id="skills" label="skills.json" title="// stack & arsenal">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {skillGroups.map((g) => (
          <div key={g.name} className="glass-panel p-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-accent mb-4">
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
                  <span className="text-cyan-accent">·</span> {t}
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
};

const projects: Project[] = [
  {
    num: "01",
    title: "EcoGeoGuard — AI-IoT Landslide Prediction",
    type: "Personal Research Project",
    period: "Dec 2025 – May 2026",
    status: "live",
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
  live: "text-green-live border-green-live/40",
  shipped: "text-cyan-accent border-cyan-accent/40",
  research: "text-amber-warn border-amber-warn/40",
};

export function Projects() {
  return (
    <Section id="projects" label="projects/" title="// shipped & in production">
      <div className="grid lg:grid-cols-2 gap-6">
        {projects.map((p) => (
          <article key={p.num} className="glass-panel overflow-hidden group hover:border-cyan-accent/40 transition">
            <header className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-black/30 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-warn/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-live/70" />
                <span className="ml-3 text-muted-foreground">project · {p.num}</span>
              </div>
              <span className={"px-2 py-0.5 border rounded text-[10px] uppercase tracking-[0.18em] " + statusColor[p.status]}>
                {p.status}
              </span>
            </header>

            <div className="p-5 sm:p-6">
              <h3 className="font-sans text-xl font-semibold text-foreground">
                {p.title}
              </h3>
              <div className="mt-1 font-mono text-xs text-muted-foreground">
                {p.type} <span className="text-dim">·</span> {p.period}
              </div>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {p.description}
              </p>

              {p.stats && (
                <div className="mt-5 grid grid-cols-3 gap-2 font-mono text-xs">
                  {p.stats.map((s) => (
                    <div key={s.k} className="border border-border rounded-md p-2.5 bg-black/20">
                      <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                        {s.k}
                      </div>
                      <div className="mt-1 text-foreground">{s.v}</div>
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
                      className="text-cyan-accent hover:underline underline-offset-4"
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
          <span className="text-green-live">accepted</span>
        </div>
        <div className="p-6 sm:p-10 grid md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-cyan-accent">
              DASGRI Congress 2026 · April 2026
            </div>
            <h3 className="mt-3 font-sans text-2xl sm:text-3xl font-semibold text-foreground leading-tight">
              EcoGeoGuard: AI-IoT Based Landslide Prediction and Smart Agriculture System
            </h3>
            <p className="mt-3 font-mono text-sm text-muted-foreground">
              Mukul Sharma et al.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground max-w-xl">
              A multi-sensor fusion approach combining LoRa-based IoT nodes with an
              ML risk-scoring pipeline on AWS, delivering sub-3-minute landslide alerts
              and dual-use smart agriculture telemetry.
            </p>
          </div>
          <div className="font-mono text-xs space-y-3">
            <div className="border border-border rounded-md p-3 bg-black/20">
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">venue</div>
              <div className="mt-1 text-foreground">DASGRI Congress 2026</div>
            </div>
            <div className="border border-border rounded-md p-3 bg-black/20">
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">status</div>
              <div className="mt-1 text-green-live">accepted · oral</div>
            </div>
            <a
              href="#contact"
              className="block text-center px-3 py-2.5 rounded-md bg-cyan-accent text-primary-foreground hover:opacity-90"
            >
              [paper →]
            </a>
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

const certs = [
  ["Google UX Design", "Coursera · Google", "Apr 2026"],
  ["Cloud Computing", "NPTEL", "Jul – Oct 2025"],
  ["Core & Advanced Java", "Programming Pathsala", "Jun – Aug 2024"],
  ["DSA using C/C++", "Udemy", "Feb – Mar 2024"],
  ["Design & Analysis of Algorithms", "Coursera", "Jan – May 2024"],
];

export function Experience() {
  return (
    <Section id="experience" label="experience.log" title="// training · leadership">
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 relative">
          <div className="absolute left-3 top-2 bottom-2 w-px bg-border" />
          <ul className="space-y-6">
            {timeline.map((t) => (
              <li key={t.title} className="pl-10 relative">
                <span className="absolute left-2 top-1.5 h-2.5 w-2.5 rounded-full bg-cyan-accent ring-4 ring-background" />
                <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-accent">
                  {t.when}
                </div>
                <div className="mt-1 font-sans text-lg font-semibold text-foreground">
                  {t.title}
                </div>
                <div className="font-mono text-xs text-muted-foreground">{t.org}</div>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {t.bullets.map((b) => (
                    <li key={b}>
                      <span className="text-cyan-accent font-mono">→</span> {b}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
            certifications · grid
          </div>
          <ul className="space-y-2.5">
            {certs.map(([n, i, d]) => (
              <li
                key={n}
                className="glass-panel p-3.5 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="font-mono text-sm text-foreground">{n}</div>
                  <div className="font-mono text-[11px] text-muted-foreground">{i}</div>
                </div>
                <div className="font-mono text-[10px] text-dim whitespace-nowrap">{d}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

export function Contact() {
  return (
    <Section id="contact" label="contact" title="> contact --mukul">
      <div className="grid lg:grid-cols-5 gap-6">
        <TerminalCard title="~/contact.sh" status="open to roles">
          <div className="font-mono text-sm space-y-2.5">
            <Row k="email" v="mukulsharmaworks@gmail.com" href="mailto:mukulsharmaworks@gmail.com" />
            <Row k="github" v="github.com/mukulsharmams007" href="https://github.com/mukulsharmams007" />
            <Row k="linkedin" v="linkedin.com/in/mukul-sharma-514634214" href="https://linkedin.com/in/mukul-sharma-514634214" />
            <Row k="mobile" v="+91-7737360788" href="tel:+917737360788" />
            <Row k="location" v="Jaipur, IN · IST" />
          </div>
          <div className="mt-6 font-mono text-xs text-muted-foreground border-t border-border pt-4">
            <span className="text-cyan-accent">$</span> echo "Available for full-time
            roles in Cyber Security, Cloud, Full-Stack & AI/ML"
            <span className="text-cyan-accent animate-cursor">▌</span>
          </div>
        </TerminalCard>

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
                className="w-full bg-black/40 border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-dim focus:outline-none focus:border-cyan-accent focus:ring-1 focus:ring-cyan-accent resize-none"
                placeholder="// tell me what you're building..."
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2.5 rounded-md bg-cyan-accent text-primary-foreground hover:opacity-90 transition"
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
  const inner = (
    <>
      <span className="text-muted-foreground w-20 inline-block">{k}</span>
      <span className="text-foreground hover:text-cyan-accent transition">{v}</span>
    </>
  );
  return href ? (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="block">
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
        className="w-full bg-black/40 border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-dim focus:outline-none focus:border-cyan-accent focus:ring-1 focus:ring-cyan-accent"
      />
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border mt-10">
      <div className="mx-auto max-w-6xl px-4 py-8 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-muted-foreground">
        <div>
          <span className="text-cyan-accent">$</span> echo "© {new Date().getFullYear()} Mukul Sharma · built from a terminal"
        </div>
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-green-live animate-pulse" />
          system · operational
        </div>
      </div>
    </footer>
  );
}