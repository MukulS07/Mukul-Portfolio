import { createFileRoute } from "@tanstack/react-router";

const DEFAULT_BASE_URL = "https://mukulsharmaworks.online";

const routes = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/about", changefreq: "monthly", priority: "0.8" },
  { path: "/projects", changefreq: "weekly", priority: "0.9" },
  { path: "/experience", changefreq: "monthly", priority: "0.8" },
  { path: "/skills", changefreq: "monthly", priority: "0.8" },
  { path: "/research", changefreq: "monthly", priority: "0.8" },
  { path: "/contact", changefreq: "monthly", priority: "0.8" },
  { path: "/resume", changefreq: "monthly", priority: "0.7" },
  { path: "/chatbot", changefreq: "monthly", priority: "0.7" },
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const baseUrl =
          process.env.SITE_URL ||
          (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : DEFAULT_BASE_URL);
        const lastmod = new Date().toISOString().split("T")[0];

        const urls = routes.map(
          (e) =>
            `  <url>\n    <loc>${baseUrl}${e.path}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
        );
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join(
          "\n",
        )}\n</urlset>`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});

