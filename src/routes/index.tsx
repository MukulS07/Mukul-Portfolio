import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/portfolio/Hero";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mukul Sharma — Cyber Security · Cloud · AI/IoT Builder" },
      {
        name: "description",
        content:
          "Portfolio of Mukul Sharma — B.Tech CSE (Cyber Security) at LPU. AWS cloud architect, published researcher (DASGRI 2026), builder of EcoGeoGuard & INVENTROX.",
      },
      { property: "og:title", content: "Mukul Sharma — Cyber Security · Cloud · AI/IoT" },
      {
        property: "og:description",
        content:
          "Builder of secure cloud-native systems. EcoGeoGuard, INVENTROX, DASGRI 2026 publication.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return <Hero />;
}
