import { createFileRoute } from "@tanstack/react-router";
import { VoiceChatbot } from "@/components/portfolio/VoiceChatbot";

export const Route = createFileRoute("/chatbot")({
  head: () => ({
    meta: [
      { title: "F.R.I.D.A.Y. Voice AI Assistant — Mukul Sharma Portfolio" },
      {
        name: "description",
        content:
          "Interact with F.R.I.D.A.Y. / M.U.K.U.L. A.I. — Mukul Sharma's voice-enabled AI assistant trained on his portfolio, cloud projects, security research, and telemetry.",
      },
      { property: "og:title", content: "F.R.I.D.A.Y. Voice AI Assistant — Mukul Sharma" },
      {
        property: "og:description",
        content:
          "Voice-enabled portfolio chatbot assistant powered by Gemini AI.",
      },
      { property: "og:url", content: "https://mukulsharmaworks.online/chatbot" },
      { property: "og:image", content: "https://mukulsharmaworks.online/portrait.jpg" },
      { name: "twitter:title", content: "F.R.I.D.A.Y. Voice AI Assistant — Mukul Sharma" },
      { name: "twitter:image", content: "https://mukulsharmaworks.online/portrait.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://mukulsharmaworks.online/chatbot" }],
  }),
  component: () => <VoiceChatbot />,
});
