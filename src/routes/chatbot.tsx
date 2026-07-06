import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { VoiceChatbot } from "@/components/portfolio/VoiceChatbot";

function LocalhostOnlyGuard({ children }: { children: React.ReactNode }) {
  const [isLocal, setIsLocal] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLocal(
        window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1"
      );
    }
  }, []);

  if (isLocal === null) {
    return null;
  }

  if (!isLocal) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-background px-4 py-20 font-mono">
        <div className="max-w-md w-full border border-destructive/40 bg-black/40 p-6 rounded-md shadow-[0_0_20px_rgba(239,68,68,0.15)]">
          <div className="flex items-center gap-2 text-destructive border-b border-destructive/20 pb-2 mb-4 font-bold select-none text-xs tracking-widest">
            <span>⚠️ SECURE PROTOCOL BLOCK</span>
            <span className="ml-auto text-[10px] opacity-60">ACCESS_DENIED // 403</span>
          </div>
          <div className="text-sm leading-relaxed space-y-3">
            <p>
              <span className="text-destructive font-bold">$</span> telemetry-core --auth
            </p>
            <p className="text-red-400">
              [CRITICAL] Authorization failure. Voice Telemetry Core has been locked down and is restricted to local development environments only.
            </p>
            <p className="text-muted-foreground text-xs leading-normal">
              If you are the administrator, run the application locally on <span className="text-accent">localhost:8080</span> to access vocal chatbot telemetry.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-border flex justify-between items-center text-xs">
            <Link
              to="/"
              className="text-accent hover:underline underline-offset-4"
            >
              [Return Home]
            </Link>
            <span className="text-dim">MUKUL_SYS_UPLINK</span>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export const Route = createFileRoute("/chatbot")({
  head: () => ({
    meta: [
      { title: "AI Assistant — Mukul Sharma" },
      {
        name: "description",
        content:
          "Interact with F.R.I.D.A.Y. / M.U.K.U.L. A.I. — Mukul's voice-enabled cybernetic assistant representing his portfolio telemetry, published research, and developer skills.",
      },
      { property: "og:title", content: "AI Assistant — Mukul Sharma" },
      {
        property: "og:description",
        content: "Voice-enabled portfolio chatbot assistant. Supports offline expert mode & Gemini AI.",
      },
    ],
  }),
  component: () => (
    <LocalhostOnlyGuard>
      <VoiceChatbot />
    </LocalhostOnlyGuard>
  ),
});

