import { createFileRoute } from "@tanstack/react-router";
import { About } from "@/components/portfolio/Sections";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Mukul Sharma" },
      {
        name: "description",
        content:
          "About Mukul Sharma — final-year B.Tech CSE (Cyber Security) at LPU; builder of EcoGeoGuard & INVENTROX.",
      },
      { property: "og:title", content: "About — Mukul Sharma" },
      {
        property: "og:description",
        content: "Cyber Security · Cloud · AI/IoT. Published researcher and full-stack builder.",
      },
    ],
  }),
  component: () => <About />,
});
