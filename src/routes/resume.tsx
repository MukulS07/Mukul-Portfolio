import { createFileRoute } from "@tanstack/react-router";
import { Resume } from "@/components/portfolio/Resume";

export const Route = createFileRoute("/resume")({
  head: () => ({
    meta: [
      { title: "Resume — Mukul Sharma" },
      { name: "description", content: "Professional resume of Mukul Sharma — final-year B.Tech CSE (Cyber Security) at LPU. Published researcher, cloud architect, full-stack & AI/IoT builder." },
      { property: "og:title", content: "Resume — Mukul Sharma" },
      { property: "og:description", content: "Mukul Sharma's professional resume. View experience, certifications, and skills." },
    ],
  }),
  component: () => <Resume />,
});
