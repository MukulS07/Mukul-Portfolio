import { createFileRoute } from "@tanstack/react-router";
import { Contact } from "@/components/portfolio/Sections";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Mukul Sharma — Hire Cyber Security & Cloud Engineer" },
      {
        name: "description",
        content:
          "Get in touch with Mukul Sharma — open for full-time roles, security consulting, cloud architecture & AI-IoT engineering projects.",
      },
      { property: "og:title", content: "Contact Mukul Sharma — Hire Cyber Security & Cloud Engineer" },
      {
        property: "og:description",
        content: "Open for full-time engineering roles in Cyber Security, Cloud, Full-Stack & AI/ML.",
      },
      { property: "og:url", content: "https://mukulsharmaworks.online/contact" },
      { property: "og:image", content: "https://mukulsharmaworks.online/portrait.jpg" },
      { name: "twitter:title", content: "Contact Mukul Sharma" },
      { name: "twitter:image", content: "https://mukulsharmaworks.online/portrait.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://mukulsharmaworks.online/contact" }],
  }),
  component: () => <Contact />,
});
