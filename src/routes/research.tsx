import { createFileRoute } from "@tanstack/react-router";
import { Research } from "@/components/portfolio/Sections";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "Research & Publications — Mukul Sharma | DASGRI Congress 2026" },
      {
        name: "description",
        content:
          "Published research paper by Mukul Sharma at DASGRI Congress 2026: AI-IoT landslide prediction & early warning disaster system (EcoGeoGuard).",
      },
      { property: "og:title", content: "Research & Publications — Mukul Sharma | DASGRI 2026" },
      {
        property: "og:description",
        content: "DASGRI Congress 2026 — AI-IoT landslide prediction and early warning framework.",
      },
      { property: "og:url", content: "https://mukulsharmaworks.online/research" },
      { property: "og:image", content: "https://mukulsharmaworks.online/portrait.jpg" },
      { name: "twitter:title", content: "Published Research — Mukul Sharma" },
      { name: "twitter:image", content: "https://mukulsharmaworks.online/portrait.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://mukulsharmaworks.online/research" }],
  }),
  component: () => <Research />,
});
