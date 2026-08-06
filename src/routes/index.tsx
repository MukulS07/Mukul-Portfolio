import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/portfolio/Hero";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mukul Sharma — Cyber Security · Cloud Architect · AI/IoT Engineer" },
      {
        name: "description",
        content:
          "Official Portfolio of Mukul Sharma — B.Tech CSE Cyber Security at LPU. Published researcher (DASGRI 2026), AWS cloud architect, builder of EcoGeoGuard & INVENTROX.",
      },
      { property: "og:title", content: "Mukul Sharma — Cyber Security · Cloud Architect · AI/IoT Engineer" },
      {
        property: "og:description",
        content:
          "Builder of secure cloud-native systems. EcoGeoGuard, INVENTROX, DASGRI 2026 publication.",
      },
      { property: "og:url", content: "https://mukulsharmaworks.online/" },
      { property: "og:image", content: "https://mukulsharmaworks.online/portrait.jpg" },
      { name: "twitter:title", content: "Mukul Sharma — Cyber Security · Cloud Architect" },
      {
        name: "twitter:description",
        content: "AWS cloud architect, cybersecurity researcher, and AI/IoT builder.",
      },
      { name: "twitter:image", content: "https://mukulsharmaworks.online/portrait.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://mukulsharmaworks.online/" }],
  }),
  component: Index,
});

function Index() {
  return <Hero />;
}
