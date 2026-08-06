import { createFileRoute } from "@tanstack/react-router";
import { Projects } from "@/components/portfolio/Sections";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Mukul Sharma | EcoGeoGuard, INVENTROX, Space Galactus" },
      {
        name: "description",
        content:
          "Explore innovative projects by Mukul Sharma: EcoGeoGuard (AI Landslide Prediction), INVENTROX (Inventory AI System), Space Galactus, and AYUSH VR Garden.",
      },
      { property: "og:title", content: "Projects — Mukul Sharma | EcoGeoGuard & INVENTROX" },
      {
        property: "og:description",
        content: "Featured projects: EcoGeoGuard, INVENTROX, Space Galactus, AYUSH VR Garden.",
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
