import { createFileRoute } from "@tanstack/react-router";
import { Nav, StatusBar } from "@/components/portfolio/Nav";
import { Hero } from "@/components/portfolio/Hero";
import { About, Skills, Projects, Research, Experience, Contact, Footer } from "@/components/portfolio/Sections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mukul Sharma — Cyber Security · Cloud · AI/IoT Builder" },
      { name: "description", content: "Portfolio of Mukul Sharma — B.Tech CSE (Cyber Security) at LPU. AWS cloud architect, published researcher (DASGRI 2026), builder of EcoGeoGuard & INVENTROX." },
      { property: "og:title", content: "Mukul Sharma — Cyber Security · Cloud · AI/IoT" },
      { property: "og:description", content: "Builder of secure cloud-native systems. EcoGeoGuard, INVENTROX, DASGRI 2026 publication." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen">
      <Nav />
      <StatusBar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Research />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
