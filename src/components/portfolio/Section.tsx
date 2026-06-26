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
    <section id={id} className="px-4 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-cyan-accent">
              <span className="text-muted-foreground">$</span> cat {label}
            </div>
            <h2 className="mt-3 font-sans text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
              {title}
            </h2>
          </div>
          <div className="font-mono text-xs text-dim hidden sm:block">
            // section · {id}
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
    <div className="glass-panel overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-black/30 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-warn/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-live/70" />
          <span className="ml-3 text-muted-foreground">{title}</span>
        </div>
        {status && (
          <span className="text-[10px] uppercase tracking-[0.2em] text-cyan-accent">
            {status}
          </span>
        )}
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </div>
  );
}