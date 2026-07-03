interface FXToggleProps {
  on: boolean;
  onToggle: () => void;
}

export function FXToggle({ on, onToggle }: FXToggleProps) {
  return (
    <button
      onClick={onToggle}
      aria-pressed={on}
      title="Toggle glitch & chromatic aberration"
      className="flex items-center gap-2 px-3 py-1.5 border border-border text-muted-foreground hover:text-foreground hover:border-accent transition font-mono text-[11px] tracking-[0.18em]"
    >
      <span>FX</span>
      <span
        className={`inline-block h-4 w-7 rounded-full border border-border relative transition-colors ${
          on ? "bg-accent/20 border-accent" : ""
        }`}
      >
        <span
          className={`absolute top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full transition-all ${
            on ? "left-3 bg-accent shadow-[0_0_8px_var(--accent)]" : "left-0.5 bg-muted-foreground"
          }`}
        />
      </span>
      <span className={on ? "text-accent" : ""}>{on ? "ON" : "OFF"}</span>
    </button>
  );
}