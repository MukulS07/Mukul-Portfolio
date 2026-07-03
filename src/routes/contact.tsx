import { createFileRoute } from "@tanstack/react-router";
import { Contact } from "@/components/portfolio/Sections";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Mukul Sharma" },
      {
        name: "description",
        content:
          "Get in touch with Mukul Sharma — open to full-time roles in Cyber Security, Cloud, Full-Stack & AI/ML.",
      },
      { property: "og:title", content: "Contact — Mukul Sharma" },
      {
        property: "og:description",
        content: "Open to full-time roles in Cyber Security, Cloud, Full-Stack & AI/ML.",
      },
    ],
  }),
  component: () => <Contact />,
});
