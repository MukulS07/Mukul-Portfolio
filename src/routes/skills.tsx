import { createFileRoute } from "@tanstack/react-router";
import { Skills } from "@/components/portfolio/Sections";

export const Route = createFileRoute("/skills")({
  head: () => ({
    meta: [
      { title: "Skills — Mukul Sharma" },
      { name: "description", content: "Technical arsenal — Cyber Security, AI/ML, Cloud, DevOps, Web, Mobile." },
      { property: "og:title", content: "Skills — Mukul Sharma" },
      { property: "og:description", content: "Stack & arsenal across security, cloud, AI/ML and full-stack." },
    ],
  }),
  component: () => <Skills />,
});