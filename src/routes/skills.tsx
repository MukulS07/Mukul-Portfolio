import { createFileRoute } from "@tanstack/react-router";
import { Skills } from "@/components/portfolio/Sections";

export const Route = createFileRoute("/skills")({
  head: () => ({
    meta: [
      { title: "Skills & Technical Stack — Mukul Sharma | Cyber Security, Cloud, AI/ML" },
      {
        name: "description",
        content:
          "Comprehensive technical skills of Mukul Sharma: Cyber Security, AWS Cloud Architecture, DevOps, Python, C++, React, AI/ML & IoT engineering.",
      },
      { property: "og:title", content: "Skills & Technical Stack — Mukul Sharma" },
      {
        property: "og:description",
        content: "Cyber Security, AWS Cloud Architecture, DevOps, AI/ML & Full-Stack Development.",
      },
      { property: "og:url", content: "https://mukulsharmaworks.online/skills" },
      { property: "og:image", content: "https://mukulsharmaworks.online/portrait.jpg" },
      { name: "twitter:title", content: "Skills — Mukul Sharma" },
      { name: "twitter:image", content: "https://mukulsharmaworks.online/portrait.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://mukulsharmaworks.online/skills" }],
  }),
  component: () => <Skills />,
});
