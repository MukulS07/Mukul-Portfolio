import * as React from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  FileText,
  Code2,
  ExternalLink,
  Terminal,
  Sparkles,
  Github,
  Linkedin,
  Mail,
  Home,
  Bot,
  Layers,
  Flame,
  Download,
  Copy,
  Check,
} from "lucide-react";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate();
  const [copiedEmail, setCopiedEmail] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName))) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  const runCommand = (command: () => void) => {
    onOpenChange(false);
    command();
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("Mukulsharmams007@gmail.com");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <div className="font-mono bg-background border border-border text-foreground shadow-2xl overflow-hidden rounded-lg">
        <div className="border-b border-border/80 bg-black/40 px-3 py-2 flex items-center justify-between text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
          <span className="flex items-center gap-1.5 text-accent font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            ›_ HUD_SYS: COMMAND_PALETTE
          </span>
          <span className="text-dim">ESC TO CLOSE</span>
        </div>

        <CommandInput
          placeholder="Type a command, project, or destination..."
          className="font-mono text-xs placeholder:text-muted-foreground/60 border-none bg-transparent"
        />

        <CommandList className="max-h-[380px] font-mono text-xs p-2">
          <CommandEmpty className="py-6 text-center text-xs text-muted-foreground">
            No matching system directive found.
          </CommandEmpty>

          {/* Navigation */}
          <CommandGroup heading="TELEPORT / NAVIGATION">
            <CommandItem
              onSelect={() => runCommand(() => navigate({ to: "/" }))}
              className="flex items-center gap-2 cursor-pointer hover:bg-white/[0.04] p-2 rounded text-xs"
            >
              <Home className="h-3.5 w-3.5 text-accent" />
              <span>Identity Overview (Home)</span>
              <CommandShortcut>G H</CommandShortcut>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => {
                  navigate({ to: "/projects" });
                })
              }
              className="flex items-center gap-2 cursor-pointer hover:bg-white/[0.04] p-2 rounded text-xs"
            >
              <Code2 className="h-3.5 w-3.5 text-cyan-400" />
              <span>Full Engineering Projects</span>
              <CommandShortcut>G P</CommandShortcut>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => navigate({ to: "/research" }))}
              className="flex items-center gap-2 cursor-pointer hover:bg-white/[0.04] p-2 rounded text-xs"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Published Research (DASGRI 2026)</span>
              <CommandShortcut>G R</CommandShortcut>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => navigate({ to: "/resume" }))}
              className="flex items-center gap-2 cursor-pointer hover:bg-white/[0.04] p-2 rounded text-xs"
            >
              <FileText className="h-3.5 w-3.5 text-emerald-400" />
              <span>Verified Dossier & Resume</span>
              <CommandShortcut>G V</CommandShortcut>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => navigate({ to: "/about" }))}
              className="flex items-center gap-2 cursor-pointer hover:bg-white/[0.04] p-2 rounded text-xs"
            >
              <Layers className="h-3.5 w-3.5 text-indigo-400" />
              <span>About & System Philosophy</span>
              <CommandShortcut>G A</CommandShortcut>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator className="my-1 border-border/40" />

          {/* Featured Systems */}
          <CommandGroup heading="DEPLOYED PLATFORMS & REPOSITORIES">
            <CommandItem
              onSelect={() =>
                runCommand(() => window.open("https://apex-f1-eosin.vercel.app", "_blank"))
              }
              className="flex items-center justify-between cursor-pointer hover:bg-white/[0.04] p-2 rounded text-xs"
            >
              <div className="flex items-center gap-2">
                <Flame className="h-3.5 w-3.5 text-red-500" />
                <span>ApexF1 — F1 2026 3D Telemetry Platform</span>
              </div>
              <ExternalLink className="h-3 w-3 text-muted-foreground" />
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => window.open("https://github.com/MukulS07/maison-harive", "_blank"))
              }
              className="flex items-center justify-between cursor-pointer hover:bg-white/[0.04] p-2 rounded text-xs"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-yellow-400" />
                <span>Maison Harivē — Luxury Men's Haute Joaillerie</span>
              </div>
              <ExternalLink className="h-3 w-3 text-muted-foreground" />
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => window.open("https://ecogeoguard.vercel.app/", "_blank"))
              }
              className="flex items-center justify-between cursor-pointer hover:bg-white/[0.04] p-2 rounded text-xs"
            >
              <div className="flex items-center gap-2">
                <Terminal className="h-3.5 w-3.5 text-emerald-400" />
                <span>EcoGeoGuard — AI-IoT Landslide Early Warning</span>
              </div>
              <ExternalLink className="h-3 w-3 text-muted-foreground" />
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => window.open("https://inventrox.vercel.app/", "_blank"))
              }
              className="flex items-center justify-between cursor-pointer hover:bg-white/[0.04] p-2 rounded text-xs"
            >
              <div className="flex items-center gap-2">
                <Layers className="h-3.5 w-3.5 text-cyan-400" />
                <span>INVENTROX — SME AI Business Operating System</span>
              </div>
              <ExternalLink className="h-3 w-3 text-muted-foreground" />
            </CommandItem>
          </CommandGroup>

          <CommandSeparator className="my-1 border-border/40" />

          {/* Quick Actions */}
          <CommandGroup heading="ACTIONS & TOOLS">
            <CommandItem
              onSelect={() =>
                runCommand(() => {
                  const link = document.createElement("a");
                  link.href = "/cv.pdf";
                  link.download = "Mukul_Sharma_Resume.pdf";
                  link.click();
                })
              }
              className="flex items-center gap-2 cursor-pointer hover:bg-white/[0.04] p-2 rounded text-xs"
            >
              <Download className="h-3.5 w-3.5 text-accent" />
              <span>Download Official Resume (PDF)</span>
            </CommandItem>

            <CommandItem
              onSelect={handleCopyEmail}
              className="flex items-center justify-between cursor-pointer hover:bg-white/[0.04] p-2 rounded text-xs"
            >
              <div className="flex items-center gap-2">
                {copiedEmail ? (
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5 text-accent" />
                )}
                <span>
                  {copiedEmail ? "Copied Email Address!" : "Copy Email: Mukulsharmams007@gmail.com"}
                </span>
              </div>
              <CommandShortcut>COPY</CommandShortcut>
            </CommandItem>

            <CommandItem
              onSelect={() =>
                runCommand(() => {
                  const btn = document.querySelector<HTMLButtonElement>(
                    "button[aria-label*='assistant'], button[aria-label*='Voice']"
                  );
                  if (btn) btn.click();
                })
              }
              className="flex items-center gap-2 cursor-pointer hover:bg-white/[0.04] p-2 rounded text-xs"
            >
              <Bot className="h-3.5 w-3.5 text-accent" />
              <span>Activate AI Voice Telemetry Agent</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator className="my-1 border-border/40" />

          {/* Network Uplinks */}
          <CommandGroup heading="NETWORK CHANNELS">
            <CommandItem
              onSelect={() =>
                runCommand(() => window.open("https://github.com/MukulS07", "_blank"))
              }
              className="flex items-center justify-between cursor-pointer hover:bg-white/[0.04] p-2 rounded text-xs"
            >
              <div className="flex items-center gap-2">
                <Github className="h-3.5 w-3.5 text-foreground" />
                <span>GitHub · @MukulS07</span>
              </div>
              <ExternalLink className="h-3 w-3 text-muted-foreground" />
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() =>
                  window.open("https://www.linkedin.com/in/mukul-sharma-07m", "_blank")
                )
              }
              className="flex items-center justify-between cursor-pointer hover:bg-white/[0.04] p-2 rounded text-xs"
            >
              <div className="flex items-center gap-2">
                <Linkedin className="h-3.5 w-3.5 text-cyan-400" />
                <span>LinkedIn · Mukul Sharma</span>
              </div>
              <ExternalLink className="h-3 w-3 text-muted-foreground" />
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => window.open("mailto:Mukulsharmams007@gmail.com"))
              }
              className="flex items-center justify-between cursor-pointer hover:bg-white/[0.04] p-2 rounded text-xs"
            >
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-accent" />
                <span>Direct Mail Transmission</span>
              </div>
              <ExternalLink className="h-3 w-3 text-muted-foreground" />
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </div>
    </CommandDialog>
  );
}
