import { createFileRoute } from "@tanstack/react-router";
import { Research } from "@/components/portfolio/Sections";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "Research — Mukul Sharma" },
      { name: "description", content: "Published research: EcoGeoGuard at DASGRI Congress 2026." },
      { property: "og:title", content: "Research — Mukul Sharma" },
      { property: "og:description", content: "DASGRI Congress 2026 — AI-IoT landslide prediction." },
    ],
  }),
  component: () => <Research />,
});