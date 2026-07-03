import { createFileRoute } from "@tanstack/react-router";
import { Experience } from "@/components/portfolio/Sections";

export const Route = createFileRoute("/experience")({
  head: () => ({
    meta: [
      { title: "Experience — Mukul Sharma" },
      {
        name: "description",
        content:
          "Training, leadership and certifications of Mukul Sharma — AWS, Salesforce, Java, DSA.",
      },
      { property: "og:title", content: "Experience — Mukul Sharma" },
      { property: "og:description", content: "Training, leadership and certifications timeline." },
    ],
  }),
  component: () => <Experience />,
});
