import { createFileRoute } from "@tanstack/react-router";
import { Projects } from "@/components/portfolio/Sections";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Mukul Sharma | ApexF1, Maison Harivē, EcoGeoGuard, INVENTROX" },
      {
        name: "description",
        content:
          "Explore innovative projects by Mukul Sharma: ApexF1 (F1 2026 Dashboard), Maison Harivē (Luxury Jewellery House), EcoGeoGuard, and INVENTROX.",
      },
      { property: "og:title", content: "Projects — Mukul Sharma | ApexF1, Maison Harivē & EcoGeoGuard" },
      {
        property: "og:description",
        content: "Featured projects: ApexF1, Maison Harivē, EcoGeoGuard, INVENTROX, and Space Galactus.",
      },
      { property: "og:url", content: "https://mukulsharmaworks.online/projects" },
      { property: "og:image", content: "https://mukulsharmaworks.online/portrait.jpg" },
      { name: "twitter:title", content: "Featured Engineering Projects — Mukul Sharma" },
      { name: "twitter:image", content: "https://mukulsharmaworks.online/portrait.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://mukulsharmaworks.online/projects" }],
  }),
  component: () => <Projects />,
});
