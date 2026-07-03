import { createFileRoute } from "@tanstack/react-router";
import { Projects } from "@/components/portfolio/Sections";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Mukul Sharma" },
      {
        name: "description",
        content:
          "Shipped & in-production projects: EcoGeoGuard, INVENTROX, Space Galactus, AYUSH VR Garden.",
      },
      { property: "og:title", content: "Projects — Mukul Sharma" },
      {
        property: "og:description",
        content: "EcoGeoGuard, INVENTROX, Space Galactus, AYUSH VR Garden.",
      },
    ],
  }),
  component: () => <Projects />,
});
