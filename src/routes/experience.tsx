import { createFileRoute } from "@tanstack/react-router";
import { Experience } from "@/components/portfolio/Sections";

export const Route = createFileRoute("/experience")({
  head: () => ({
    meta: [
      { title: "Experience & Certifications — Mukul Sharma | AWS & Cyber Security" },
      {
        name: "description",
        content:
          "Professional experience, certifications (AWS, Salesforce, Java, Cyber Security) and leadership roles of Mukul Sharma.",
      },
      { property: "og:title", content: "Experience & Certifications — Mukul Sharma" },
      { property: "og:description", content: "AWS Cloud Architect, Cybersecurity & Leadership Experience." },
      { property: "og:url", content: "https://mukulsharmaworks.online/experience" },
      { property: "og:image", content: "https://mukulsharmaworks.online/portrait.jpg" },
      { name: "twitter:title", content: "Experience — Mukul Sharma" },
      { name: "twitter:image", content: "https://mukulsharmaworks.online/portrait.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://mukulsharmaworks.online/experience" }],
  }),
  component: () => <Experience />,
});
