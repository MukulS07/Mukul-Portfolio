import type { ReactNode, PointerEvent as RPointerEvent } from "react";
import { useReveal } from "@/hooks/useReveal";
import { CrawlBanner } from "./CrawlBanner";

function handleCardMove(e: RPointerEvent<HTMLDivElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--gx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--gy", `${e.clientY - r.top}px`);
}

export function Section({
  id,
  label,
  title,
  children,
  crawl,
}: {
  id: string;
  label: string;
  title: string;
  children: ReactNode;
  crawl?: string;
}) {
  const ref = useReveal<HTMLElement>();
  return (
    <section
      ref={ref}
      id={id}
      className="reveal section-aura px-5 lg:px-8 py-16 sm:py-24 border-t border-border"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
          <div>
            <div className="font-mono text-[10px] tracking-[0.28em] text-muted-foreground">
              // {label}
            </div>
            <h2
              data-text={title}
              className="glitch chroma mt-3 font-serif-display text-foreground text-4xl sm:text-5xl leading-[0.95]"
            >
              {title}
            </h2>
          </div>
          <div className="font-mono text-[10px] tracking-[0.28em] text-dim hidden sm:block">
            SECTION · {id.toUpperCase()}
          </div>
        </div>
        <CrawlBanner
          text={
            crawl ??
            `INCOMING TRANSMISSION · ${label.toUpperCase()} · ${title.toUpperCase()} · STATUS NOMINAL · STAND BY`
          }
        />
        {children}
      </div>
    </section>
  );
}

export function TerminalCard({
  title,
  children,
  status,
}: {
  title: string;
  status?: string;
  children: ReactNode;
}) {
  return (
    <div
      onPointerMove={handleCardMove}
      className="hover-glow border border-border bg-background overflow-hidden"
    >
      <div className="flex items-center justify-between px-5 py-3 border-b border-border font-mono text-[10px] tracking-[0.22em] text-muted-foreground">
        <span>{title}</span>
        {status && <span className="text-accent">{status.toUpperCase()}</span>}
      </div>
      <div className="p-6 sm:p-8">{children}</div>
    </div>
  );
}
