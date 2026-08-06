import { createFileRoute } from "@tanstack/react-router";
import { Resume } from "@/components/portfolio/Resume";

export const Route = createFileRoute("/resume")({
  head: () => ({
    meta: [
      { title: "Resume & CV — Mukul Sharma | B.Tech Cyber Security at LPU" },
      {
        name: "description",
        content:
          "Download and view professional resume of Mukul Sharma — final-year B.Tech CSE (Cyber Security) at LPU. Published researcher, cloud architect, full-stack & AI/IoT builder.",
      },
      { property: "og:title", content: "Resume & CV — Mukul Sharma | B.Tech Cyber Security at LPU" },
      {
        property: "og:description",
        content: "Mukul Sharma's professional resume. View experience, certifications, and skills.",
      },
      { property: "og:url", content: "https://mukulsharmaworks.online/resume" },
      { property: "og:image", content: "https://mukulsharmaworks.online/portrait.jpg" },
      { name: "twitter:title", content: "Resume & CV — Mukul Sharma" },
      { name: "twitter:image", content: "https://mukulsharmaworks.online/portrait.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://mukulsharmaworks.online/resume" }],
  }),
  component: () => <Resume />,
});
