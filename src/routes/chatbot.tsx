import { createFileRoute } from "@tanstack/react-router";
import { VoiceChatbot } from "@/components/portfolio/VoiceChatbot";

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
  component: () => <VoiceChatbot />,
});


