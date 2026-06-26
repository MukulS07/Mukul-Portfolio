import type { ReactNode } from "react";

export function Section({
  id,
  label,
  title,
  children,
}: {
  id: string;
  label: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="px-5 lg:px-8 py-16 sm:py-24 border-t border-border">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
          <div>
            <div className="font-mono text-[10px] tracking-[0.28em] text-muted-foreground">
              // {label}
            </div>
            <h2 className="mt-3 font-serif-display text-foreground text-4xl sm:text-5xl leading-[0.95]">
              {title}
            </h2>
          </div>
          <div className="font-mono text-[10px] tracking-[0.28em] text-dim hidden sm:block">
            SECTION · {id.toUpperCase()}
          </div>
        </div>
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
    <div className="border border-border bg-background">
      <div className="flex items-center justify-between px-5 py-3 border-b border-border font-mono text-[10px] tracking-[0.22em] text-muted-foreground">
        <span>{title}</span>
        {status && <span className="text-accent">{status.toUpperCase()}</span>}
      </div>
      <div className="p-6 sm:p-8">{children}</div>
    </div>
  );
}