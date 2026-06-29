import { useEffect, useRef, useState } from "react";

type Msg = { who: "jarvis" | "user"; text: string };

const GREETINGS = [
  "Welcome back, sir. All systems nominal.",
  "Arc reactor at 100%. Ready when you are.",
  "Diagnostics clean. Suit telemetry green.",
];

function respond(input: string): string {
  const q = input.toLowerCase().trim();
  if (!q) return "Awaiting input, sir.";
  if (/(hello|hi|hey|jarvis)/.test(q)) return "At your service, sir.";
  if (/(who|about|mukul|owner)/.test(q))
    return "Mr. Sharma — final-year CSE (Cyber Security) at LPU. Builder of EcoGeoGuard and INVENTROX. Published in DASGRI 2026.";
  if (/(project|build|work)/.test(q))
    return "Two flagship builds on record: EcoGeoGuard (AI-IoT landslide platform) and INVENTROX (AI business OS). Routing you to /projects.";
  if (/(resume|cv)/.test(q)) return "CV dossier located at /cv.pdf. Shall I dispatch it?";
  if (/(contact|email|reach)/.test(q))
    return "Direct line: /contact. Encrypted channel available on request.";
  if (/(skill|stack|tech)/.test(q))
    return "Primary stack: AWS, React, Python, IoT, Cyber Security. Full inventory at /skills.";
  if (/(power|reactor|status)/.test(q))
    return "Reactor output stable. Palladium-free, sir.";
  if (/(suit|mark|mk)/.test(q)) return "MK-VII engaged. Repulsors armed for diagnostics only.";
  if (/\?$/.test(q)) return "Cross-referencing… I have no clean match. Try: projects, contact, skills.";
  return "Acknowledged. Standing by for next directive.";
}

/** JARVIS HUD — only visible while body.theme-ironman is active. */
export function Jarvis() {
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sync = () => setActive(document.body.classList.contains("theme-ironman"));
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);

  useEffect(() => {
    if (open && msgs.length === 0) {
      const g = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
      setMsgs([{ who: "jarvis", text: g }]);
    }
  }, [open, msgs.length]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 99999, behavior: "smooth" });
  }, [msgs, typing]);

  if (!active) return null;

  const send = () => {
    const v = input.trim();
    if (!v) return;
    setMsgs((m) => [...m, { who: "user", text: v }]);
    setInput("");
    setTyping(true);
    const reply = respond(v);
    setTimeout(() => {
      setMsgs((m) => [...m, { who: "jarvis", text: reply }]);
      setTyping(false);
    }, 650 + Math.min(reply.length * 12, 900));
  };

  return (
    <>
      {/* Floating reactor button */}
      <button
        aria-label="Open J.A.R.V.I.S"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-[60] h-14 w-14 rounded-full grid place-items-center jarvis-orb"
      >
        <span className="text-[10px] font-mono tracking-[0.18em] text-[oklch(0.95_0.04_220)]">
          {open ? "×" : "J.A.R.V.I.S"}
        </span>
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-[60] w-[340px] max-w-[92vw] jarvis-panel font-mono text-[12px]">
          <div className="flex items-center justify-between px-4 py-2 border-b border-[oklch(0.78_0.2_220/0.35)]">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[oklch(0.78_0.2_220)] shadow-[0_0_8px_oklch(0.78_0.2_220)] animate-pulse" />
              <span className="tracking-[0.22em] text-[oklch(0.9_0.05_220)]">J.A.R.V.I.S</span>
            </div>
            <span className="text-[9px] tracking-[0.22em] text-[oklch(0.7_0.05_220)]">v.MK-VII</span>
          </div>
          <div ref={scrollRef} className="px-4 py-3 max-h-72 overflow-y-auto space-y-2.5">
            {msgs.map((m, i) =>
              m.who === "jarvis" ? (
                <div key={i} className="text-[oklch(0.92_0.05_220)]">
                  <span className="text-[oklch(0.78_0.2_220)]">› </span>
                  {m.text}
                </div>
              ) : (
                <div key={i} className="text-right text-[oklch(0.88_0.15_75)]">
                  {m.text} <span className="text-[oklch(0.7_0.1_75)]">‹</span>
                </div>
              )
            )}
            {typing && (
              <div className="text-[oklch(0.78_0.2_220)] tracking-[0.3em]">
                ▮▮▮
              </div>
            )}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex items-center gap-2 px-3 py-2 border-t border-[oklch(0.78_0.2_220/0.35)]"
          >
            <span className="text-[oklch(0.78_0.2_220)]">›</span>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="speak, sir…"
              className="flex-1 bg-transparent outline-none text-[oklch(0.95_0.04_220)] placeholder:text-[oklch(0.55_0.05_220)]"
            />
            <button
              type="submit"
              className="text-[10px] tracking-[0.2em] px-2 py-1 border border-[oklch(0.78_0.2_220/0.5)] text-[oklch(0.85_0.18_75)] hover:bg-[oklch(0.78_0.2_220/0.12)]"
            >
              SEND
            </button>
          </form>
        </div>
      )}
    </>
  );
}