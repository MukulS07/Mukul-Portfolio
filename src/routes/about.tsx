import { createFileRoute } from "@tanstack/react-router";
import { About } from "@/components/portfolio/Sections";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Mukul Sharma — Cyber Security & Cloud Architect" },
      {
        name: "description",
        content:
          "Learn about Mukul Sharma — final-year B.Tech CSE (Cyber Security) student at LPU, published researcher, and builder of EcoGeoGuard & INVENTROX.",
      },
      { property: "og:title", content: "About Mukul Sharma — Cyber Security & Cloud Architect" },
      {
        property: "og:description",
        content: "Cyber Security · Cloud · AI/IoT. Published researcher and full-stack builder.",
      },
      { property: "og:url", content: "https://mukulsharmaworks.online/about" },
      { property: "og:image", content: "https://mukulsharmaworks.online/portrait.jpg" },
      { name: "twitter:title", content: "About Mukul Sharma" },
      { name: "twitter:image", content: "https://mukulsharmaworks.online/portrait.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://mukulsharmaworks.online/about" }],
  }),
  component: () => <About />,
});
