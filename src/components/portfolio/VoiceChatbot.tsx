import { useEffect, useRef, useState } from "react";
import { queryChatbot } from "@/lib/chatbot-service";
import { Section, TerminalCard } from "./Section";
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  Settings,
  Activity,
  Sparkles,
  Info,
  Shield,
  Key,
  RefreshCw,
  CornerDownLeft,
} from "lucide-react";

interface Message {
  role: "user" | "bot";
  text: string;
  timestamp: string;
}

// Precomputed subdivided icosahedron (42 vertices, 120 edges) for 3D visualizer
const generateSphereData = () => {
  const t = (1 + Math.sqrt(5)) / 2;
  const baseVerts: [number, number, number][] = [
    [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
    [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
    [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]
  ];
  const baseFaces: [number, number, number][] = [
    [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
    [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
    [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
    [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]
  ];

  const verts: [number, number, number][] = [];
  const vIndex = new Map<string, number>();
  const addVert = (v: [number, number, number]) => {
    const len = Math.hypot(v[0], v[1], v[2]);
    const n: [number, number, number] = [v[0] / len, v[1] / len, v[2] / len];
    const key = n.map(x => x.toFixed(5)).join(",");
    const existing = vIndex.get(key);
    if (existing !== undefined) return existing;
    const idx = verts.length;
    verts.push(n);
    vIndex.set(key, idx);
    return idx;
  };

  baseVerts.forEach(v => addVert(v));
  const edgeSet = new Set<string>();
  const edges: [number, number][] = [];
  const addEdge = (a: number, b: number) => {
    const k = a < b ? `${a}-${b}` : `${b}-${a}`;
    if (edgeSet.has(k)) return;
    edgeSet.add(k);
    edges.push([a, b]);
  };

  baseFaces.forEach(([a, b, c]) => {
    const va = baseVerts[a], vb = baseVerts[b], vc = baseVerts[c];
    const mid = (p: number[], q: number[]) => [(p[0]+q[0])/2, (p[1]+q[1])/2, (p[2]+q[2])/2] as [number, number, number];
    const ab = addVert(mid(va, vb));
    const bc = addVert(mid(vb, vc));
    const ca = addVert(mid(vc, va));
    const ia = addVert(va), ib = addVert(vb), ic = addVert(vc);
    [
      [ia, ab], [ab, ib], [ib, bc], [bc, ic], [ic, ca], [ca, ia],
      [ab, bc], [bc, ca], [ca, ab]
    ].forEach(([x, y]) => addEdge(x, y));
  });

  return { verts, edges };
};

const SPHERE_DATA = generateSphereData();


export function VoiceChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "Vocal interface online. I am Friday, your cybernetic assistant. Click [ACTIVATE MIC] or type below to begin telemetry transmission.",
      timestamp: getFormattedTime(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isAvengers, setIsAvengers] = useState(false);
  const [voiceMuted, setVoiceMuted] = useState(false);

  const [botState, setBotState] = useState<"idle" | "listening" | "thinking" | "speaking">("idle");
  const [recognitionActive, setRecognitionActive] = useState(false);
  const [statusLog, setStatusLog] = useState<string>("SYSTEM_IDLE::NOMINAL");
  const [continuousVoiceMode, setContinuousVoiceMode] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>("");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Refs for tracking state inside event handlers to avoid stale closures
  const continuousModeRef = useRef(false);
  const isOpenRef = useRef(true); // always open for full page
  const recognitionActiveRef = useRef(false);

  useEffect(() => {
    continuousModeRef.current = continuousVoiceMode;
  }, [continuousVoiceMode]);

  useEffect(() => {
    recognitionActiveRef.current = recognitionActive;
  }, [recognitionActive]);

  const voiceMutedRef = useRef(voiceMuted);
  const isAvengersRef = useRef(isAvengers);
  const selectedVoiceNameRef = useRef(selectedVoiceName);

  useEffect(() => {
    voiceMutedRef.current = voiceMuted;
  }, [voiceMuted]);

  useEffect(() => {
    isAvengersRef.current = isAvengers;
  }, [isAvengers]);

  useEffect(() => {
    selectedVoiceNameRef.current = selectedVoiceName;
  }, [selectedVoiceName]);

  const startSpeechRecognitionDelayed = () => {
    setTimeout(() => {
      if (
        recognitionRef.current &&
        isOpenRef.current &&
        continuousModeRef.current &&
        !recognitionActiveRef.current &&
        botState !== "thinking" &&
        botState !== "speaking"
      ) {
        try {
          recognitionRef.current.start();
        } catch (err) {
          console.warn("Failed to restart speech recognition automatically:", err);
        }
      }
    }, 600);
  };

  // Audio Context Ref for Real User Mic feedback
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number>(0);

  // Read Avenger Mode from document body class (reactive via MutationObserver)
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsAvengers(document.body.classList.contains("avengers"));
      
      const observer = new MutationObserver(() => {
        setIsAvengers(document.body.classList.contains("avengers"));
      });
      observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

      if (window.speechSynthesis) {
        const loadVoices = () => {
          const engVoices = window.speechSynthesis.getVoices().filter((v) => {
            const name = v.name.toLowerCase();
            return v.lang.startsWith("en") && 
                   !name.includes("david") && 
                   !name.includes("guy") && 
                   !name.includes("james") && 
                   !name.includes("george") && 
                   !name.includes("mark") && 
                   !name.includes("male") && 
                   !name.includes("ravi") && 
                   !name.includes("richard") && 
                   !name.includes("stefan") && 
                   !name.includes("patrick") && 
                   !name.includes("sean") && 
                   !name.includes("samuel") && 
                   !name.includes("harry");
          });
          setAvailableVoices(engVoices);

          // Pre-sort to pick Samantha, Aria, Cortana, Hazel, Zira, etc.
          const sorted = [...engVoices].sort((a, b) => {
            const aName = a.name.toLowerCase();
            const bName = b.name.toLowerCase();
            const getScore = (name: string) => {
              let score = 0;
              if (name.includes("natural")) score += 20;
              if (name.includes("online")) score += 15;
              if (name.includes("google")) score += 10;
              if (
                name.includes("samantha") ||
                name.includes("zira") ||
                name.includes("hazel") ||
                name.includes("aria") ||
                name.includes("natasha") ||
                name.includes("female")
              ) {
                score += 25;
              }
              return score;
            };
            return getScore(bName) - getScore(aName);
          });

          if (sorted.length > 0) {
            setSelectedVoiceName(sorted[0].name);
          }
        };

        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }

      return () => observer.disconnect();
    }
  }, []);

  // Format timestamp helper
  function getFormattedTime() {
    return new Date().toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  // Scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Setup Web Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = "en-US";

        rec.onstart = () => {
          setRecognitionActive(true);
          setBotState("listening");
          setStatusLog("MIC_STREAM::ACTIVE");
          initMicrophone(); // start Web Audio analysis
        };

        rec.onresult = (event: any) => {
          const resultText = event.results[0][0].transcript;
          if (resultText && resultText.trim()) {
            handleSend(resultText);
          }
        };

        rec.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          setStatusLog(`MIC_ERROR::${event.error.toUpperCase()}`);
          stopMicrophone();
          setBotState("idle");
          setRecognitionActive(false);
          
          if (event.error === "not-allowed") {
            addSystemMessage("Microphone permission denied. Please allow mic access or use text mode.");
          }
        };

        rec.onend = () => {
          setRecognitionActive(false);
          // If we didn't transition to thinking/speaking, return to idle
          setBotState((prev) => (prev === "listening" ? "idle" : prev));
          stopMicrophone();
        };

        recognitionRef.current = rec;
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      stopMicrophone();
    };
  }, [isAvengers]);

  // Microphone Audio Analyser setup
  async function initMicrophone() {
    try {
      if (!navigator.mediaDevices?.getUserMedia) return;
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      sourceNodeRef.current = source;
      source.connect(analyser);
    } catch (err) {
      console.warn("Failed to initialize user mic analyser node:", err);
    }
  }

  function stopMicrophone() {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (sourceNodeRef.current) {
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
    }
    if (audioContextRef.current) {
      if (audioContextRef.current.state !== "closed") {
        audioContextRef.current.close();
      }
      audioContextRef.current = null;
    }
    analyserRef.current = null;
  }

  // Draw Visualizer Canvas Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let rotation = 0;
    let waveOffset = 0;

    let rotationX = 0;
    let rotationY = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const size = Math.min(canvas.width, canvas.height);

      const primaryColor = isAvengers ? "239, 68, 68" : "56, 189, 248";
      const energyColor = isAvengers ? "254, 240, 138" : "224, 242, 254";

      // Rotate speed based on state
      if (botState === "idle") {
        rotationX += 0.006;
        rotationY += 0.009;
      } else if (botState === "listening") {
        rotationX += 0.015;
        rotationY += 0.025;
      } else if (botState === "thinking") {
        rotationX += 0.04;
        rotationY += 0.06;
      } else if (botState === "speaking") {
        rotationX += 0.008;
        rotationY += 0.012;
      }

      let voiceMultiplier = 1.0;
      let dataArray = new Uint8Array(0);

      if (botState === "listening") {
        if (analyserRef.current) {
          const bufferLength = analyserRef.current.frequencyBinCount;
          dataArray = new Uint8Array(bufferLength);
          analyserRef.current.getByteFrequencyData(dataArray);

          let sum = 0;
          for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
          }
          const avg = sum / bufferLength;
          voiceMultiplier = 1.0 + (avg / 40);
        } else {
          voiceMultiplier = 1.0 + Math.sin(Date.now() / 150) * 0.08;
        }
      }

      // Outer radial guides
      ctx.strokeStyle = `rgba(${primaryColor}, 0.05)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(0.1, (size * 0.44) * (botState === "listening" ? voiceMultiplier : 1.0)), 0, Math.PI * 2);
      ctx.stroke();

      // Project and draw 3D wireframe sphere
      const cosY = Math.cos(rotationY), sinY = Math.sin(rotationY);
      const cosX = Math.cos(rotationX), sinX = Math.sin(rotationX);

      const R = Math.max(0.1, (size * 0.36) * (botState === "listening" ? voiceMultiplier : 1.0 + Math.sin(Date.now() / 300) * 0.03));
      const persp = R * 2.5;

      const proj = SPHERE_DATA.verts.map(([x, y, z], index) => {
        const rx = x * cosY + z * sinY;
        let rz = -x * sinY + z * cosY;
        const ry = y * cosX - rz * sinX;
        rz = y * sinX + rz * cosX;

        let offset = 0;
        if (botState === "listening" && dataArray.length > 0) {
          const freqIndex = index % dataArray.length;
          offset = (dataArray[freqIndex] / 255) * 0.35;
        } else if (botState === "speaking") {
          offset = Math.sin(Date.now() * 0.015 + index) * 0.08;
        }

        const factor = 1 + offset;
        const scale = persp / (persp - rz * R * factor);

        return {
          x: cx + rx * R * factor * scale,
          y: cy + ry * R * factor * scale,
          z: rz,
          s: scale,
        };
      });

      // Draw Edges
      ctx.strokeStyle = `rgba(${primaryColor}, 0.35)`;
      ctx.lineWidth = 0.8;
      for (const [a, b] of SPHERE_DATA.edges) {
        const pa = proj[a], pb = proj[b];
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.stroke();
      }

      // Draw vertex glowing dots
      ctx.fillStyle = `rgb(${energyColor})`;
      for (const p of proj) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [botState, isAvengers]);

  // Helper: Append a system alert in the terminal log
  function addSystemMessage(text: string) {
    setMessages((prev) => [
      ...prev,
      { role: "bot", text: `[SYS_ALERT] ${text}`, timestamp: getFormattedTime() },
    ]);
  }



  // Toggle Mic Activation
  const toggleMic = () => {
    if (!recognitionRef.current) {
      addSystemMessage("Web Speech API is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    if (recognitionActive) {
      setContinuousVoiceMode(false);
      recognitionRef.current.stop();
    } else {
      setContinuousVoiceMode(true);
      // Cancel any ongoing speaking
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error("Failed to start speech recognition:", err);
      }
    }
  };

  // Speaks output text aloud
  const speakOutput = (text: string) => {
    if (voiceMutedRef.current || typeof window === "undefined" || !window.speechSynthesis) {
      setBotState("idle");
      if (continuousModeRef.current && isOpenRef.current) {
        startSpeechRecognitionDelayed();
      }
      return;
    }

    // Cancel active synthesis first
    window.speechSynthesis.cancel();

    // Remove code snippets, links, markdown headers from reading
    const cleanSpeech = text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // strip markdown links
      .replace(/https?:\/\/\S+/gi, "link") // replace urls with "link"
      .replace(/[`*#_]/g, "") // strip markdown symbols
      .replace(/→/g, "to")
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    const voices = window.speechSynthesis.getVoices();
    let selectedVoice = voices.find((v) => v.name === selectedVoiceNameRef.current);

    if (!selectedVoice) {
      selectedVoice = voices.find((v) => {
        const name = v.name.toLowerCase();
        return v.lang.startsWith("en") && 
               !name.includes("david") && 
               !name.includes("guy") && 
               !name.includes("james") && 
               !name.includes("george") && 
               !name.includes("mark") && 
               !name.includes("male") && 
               !name.includes("ravi") && 
               !name.includes("richard") && 
               !name.includes("stefan") && 
               !name.includes("patrick") && 
               !name.includes("sean") && 
               !name.includes("samuel") && 
               !name.includes("harry");
      });
    }

    if (!selectedVoice) {
      selectedVoice = voices.find((v) => v.lang.startsWith("en")) || voices[0];
    }

    if (isAvengersRef.current) {
      utterance.pitch = 1.1;
      utterance.rate = 1.05;
    } else {
      utterance.pitch = 1.0;
      utterance.rate = 0.95;
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onstart = () => {
      setBotState("speaking");
      setStatusLog(isAvengers ? "FRIDAY_AUDIO::TRANSMITTING" : "FRIDAY_AI_AUDIO::TRANSMITTING");
    };

    utterance.onend = () => {
      setBotState("idle");
      setStatusLog("SYSTEM_IDLE::NOMINAL");
      if (continuousModeRef.current && isOpenRef.current) {
        startSpeechRecognitionDelayed();
      }
    };

    utterance.onerror = (err) => {
      console.error("SpeechSynthesis error:", err);
      setBotState("idle");
      setStatusLog("AUDIO_OUTPUT::FAILED");
      if (continuousModeRef.current && isOpenRef.current) {
        startSpeechRecognitionDelayed();
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  // Main Submit Query Function
  const handleSend = async (text: string) => {
    if (!text || !text.trim()) return;

    if (inputText.trim()) {
      setContinuousVoiceMode(false);
    }

    // 1. Add User query to message box
    const userMessage: Message = {
      role: "user",
      text,
      timestamp: getFormattedTime(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setBotState("thinking");
    setStatusLog("UPLINK_TRANSMITTING::WAIT_RESP");

    // Format chat history for Gemini API
    const chatHistory = messages
      .filter((m) => !m.text.startsWith("[SYS_ALERT]"))
      .slice(-6) // Send last 6 messages as context
      .map((m) => ({
        role: m.role === "user" ? ("user" as const) : ("model" as const),
        parts: [{ text: m.text }],
      }));

    // 2. Call server query
    const res = await queryChatbot({
      data: {
        prompt: text,
        avengersMode: isAvengers,
        history: chatHistory,
      },
    });

    if (res.success && res.text) {
      // Successful AI Response
      const botMsg: Message = {
        role: "bot",
        text: res.text,
        timestamp: getFormattedTime(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setStatusLog("DOWNLINK_RECEIVED::DECODED");
      speakOutput(res.text);
    } else {
      // Handle fallback offline logic if no API key or server error
      const offlineAnswer = queryOfflineExpert(text, isAvengers);
      
      const botMsg: Message = {
        role: "bot",
        text: offlineAnswer,
        timestamp: getFormattedTime(),
      };
      
      setMessages((prev) => [...prev, botMsg]);
      setStatusLog("DOWNLINK_RECEIVED::LOCAL_FALLBACK");
      speakOutput(offlineAnswer);
    }
  };

  return (
    <Section id="chatbot" label="bot.sh" title="> AI TELEMETRY ENGINE">
      <div className="grid lg:grid-cols-5 gap-6">
        
        {/* Left Side: Visual Hologram Canvas + Controls */}
        <div className="lg:col-span-2 flex flex-col justify-between glass-panel p-5 items-center relative overflow-hidden min-h-[350px] lg:min-h-[420px]">
          
          {/* Scanning Line overlay */}
          <div className="absolute inset-0 pointer-events-none bg-scanlines opacity-[0.02]" />

          {/* Status HUD top banner */}
          <div className="w-full flex items-center justify-between border-b border-border pb-3 mb-2 font-mono text-[10px] tracking-[0.2em] text-muted-foreground select-none">
            <span className="flex items-center gap-1.5">
              <span className={`inline-block h-2 w-2 rounded-full ${
                botState === "listening" ? "bg-red-500 animate-pulse" : 
                botState === "thinking" ? "bg-yellow-500 animate-spin" : 
                botState === "speaking" ? "bg-green-500 animate-pulse" : "bg-accent"
              }`} />
              CORE STATUS: {botState.toUpperCase()}
            </span>
            <span className="text-dim">UPLINK_SYS_v2.5</span>
          </div>

          {/* Visualizer Area */}
          <div className="flex-1 flex items-center justify-center relative w-full h-[220px]">
            <canvas
              ref={canvasRef}
              width={260}
              height={260}
              className="max-w-[260px] max-h-[260px] drop-shadow-[0_0_20px_rgba(56,189,248,0.15)] filter"
            />
          </div>

          {/* Core Info Display */}
          <div className="w-full border-t border-border/80 pt-4 mt-3 flex flex-col items-center">
            
            {/* Live Status Telemetry Log */}
            <div className="font-mono text-[10px] tracking-[0.15em] text-accent mb-4 text-center select-none uppercase truncate max-w-full">
              {isAvengers ? "🛰️ FRIDAY ACTIVE ⌁ " : "💻 FRIDAY AI ⌁ "}
              <span className="text-foreground">{statusLog}</span>
            </div>

            {/* Main Interactive Mic Button */}
            <div className="flex items-center justify-center gap-4 w-full">
              
              {/* Mic toggle */}
              <button
                onClick={toggleMic}
                title={recognitionActive ? "Mute Microphone" : "Activate Speech Recognition"}
                className={`h-14 w-14 rounded-full border flex items-center justify-center transition-all cursor-pointer shadow-[0_0_15px_rgba(0,0,0,0.5)] ${
                  recognitionActive
                    ? isAvengers
                      ? "bg-red-500/20 border-red-500 text-red-400 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                      : "bg-accent/20 border-accent text-accent animate-pulse shadow-[0_0_20px_rgba(56,189,248,0.4)]"
                    : isAvengers
                      ? "bg-black/40 border-border text-muted-foreground hover:text-red-400 hover:border-red-500/50"
                      : "bg-black/40 border-border text-muted-foreground hover:text-accent hover:border-accent/50"
                }`}
              >
                {recognitionActive ? <Mic size={24} /> : <MicOff size={24} />}
              </button>

              {/* Mute Audio voice readout */}
              <button
                onClick={() => {
                  setVoiceMuted(!voiceMuted);
                  if (!voiceMuted && typeof window !== "undefined") {
                    window.speechSynthesis.cancel();
                  }
                }}
                title={voiceMuted ? "Unmute Bot Voice Readout" : "Mute Bot Voice Readout"}
                className={`h-11 w-11 rounded-full border flex items-center justify-center transition hover:scale-105 cursor-pointer ${
                  voiceMuted
                    ? "bg-black/50 border-red-500/20 text-red-500"
                    : "bg-black/30 border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {voiceMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>

              {/* Live Talk toggle */}
              <button
                type="button"
                onClick={() => {
                  const next = !continuousVoiceMode;
                  setContinuousVoiceMode(next);
                  if (next && !recognitionActive) {
                    toggleMic();
                  } else if (!next && recognitionActive) {
                    recognitionRef.current?.stop();
                  }
                }}
                className={`h-11 px-4 rounded-full border flex items-center gap-1.5 transition hover:scale-105 cursor-pointer text-[10px] font-bold ${
                  continuousVoiceMode
                    ? isAvengers
                      ? "bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.3)]"
                      : "bg-accent/20 border-accent text-accent shadow-[0_0_12px_rgba(56,189,248,0.3)]"
                    : "bg-black/30 border-border text-muted-foreground hover:text-foreground"
                }`}
                title="Continuous Hands-Free Conversation Mode"
              >
                <Activity size={12} className={continuousVoiceMode ? "animate-pulse" : ""} />
                <span>{continuousVoiceMode ? "LIVE ON" : "LIVE CHAT"}</span>
              </button>


              {/* Voice Dropdown Selector */}
              {availableVoices.length > 0 && (
                <select
                  value={selectedVoiceName}
                  onChange={(e) => setSelectedVoiceName(e.target.value)}
                  className="bg-black/60 border border-border rounded px-2 h-11 text-xs text-foreground focus:outline-none focus:border-accent font-mono max-w-[130px] cursor-pointer"
                  title="Select Friday Voice Accent"
                >
                  {availableVoices.map((v) => (
                    <option key={v.name} value={v.name} className="bg-black text-foreground">
                      {v.name.replace("Microsoft", "MS").replace("English", "EN").replace("Desktop", "")}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Chat Logger Terminal Console */}
        <div className="lg:col-span-3 flex flex-col justify-between glass-panel p-5 min-h-[380px] lg:min-h-[420px]">
          
          {/* Header information */}
          <div className="flex items-center justify-between border-b border-border pb-3 mb-3 font-mono text-[10px] tracking-[0.2em] text-muted-foreground select-none">
            <span>📡 DECODED COMMS LOG</span>
            <span className="text-dim">CONSOLE // TTY0</span>
          </div>

          {/* Terminal Messages Logger Area */}
          <div className="flex-1 overflow-y-auto max-h-[300px] mb-4 space-y-3.5 pr-2 custom-scrollbar font-mono text-xs leading-relaxed">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`border border-border/40 p-3 rounded-md relative ${
                  msg.role === "user"
                    ? "bg-accent/5 border-accent/20 text-foreground ml-8"
                    : "bg-black/30 text-muted-foreground mr-8"
                }`}
              >
                {/* Micro heading for system sender */}
                <div className="flex justify-between items-center text-[9px] tracking-wider text-dim border-b border-border/10 pb-1 mb-1.5 uppercase select-none">
                  <span>{msg.role === "user" ? "👤 VISITOR_INPUT" : isAvengers ? "🎙️ FRIDAY.AI" : "🤖 FRIDAY.AI"}</span>
                  <span>{msg.timestamp}</span>
                </div>

                <p className="whitespace-pre-wrap font-sans text-sm text-foreground">
                  {msg.text}
                </p>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>



          {/* Bottom Prompt input bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputText);
            }}
            className="flex items-center gap-2 border border-border rounded-md bg-black/30 p-1.5 focus-within:border-accent transition-colors"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                botState === "listening"
                  ? "🎙️ Transcribing mic..."
                  : isAvengers
                  ? "// Ask Friday a question, Boss..."
                  : "// Ask Friday a question..."
              }
              disabled={botState === "thinking"}
              className="flex-1 bg-transparent border-0 px-3 py-2 text-sm text-foreground focus:outline-none placeholder:text-dim font-mono focus:ring-0 disabled:opacity-50"
            />
            
            <button
              type="submit"
              disabled={!inputText.trim() || botState === "thinking"}
              className="p-2.5 rounded bg-accent text-primary-foreground hover:opacity-90 transition disabled:opacity-30 cursor-pointer flex items-center gap-1.5"
              title="Transmit query"
            >
              <Send size={14} />
              <span className="hidden sm:inline font-mono text-[10px] tracking-widest font-semibold uppercase">[SEND]</span>
            </button>
          </form>
        </div>
      </div>
    </Section>
  );
}

// ---------------------------------------------------------
// LOCAL DICTIONARY TELEMETRY EXPERT SYSTEM (OFFLINE MODE)
// ---------------------------------------------------------
function queryOfflineExpert(query: string, avengersMode: boolean): string {
  const q = query.toLowerCase();
  
  const greetingResponse = avengersMode
    ? "Hi, I am Friday. Ready for your command, Boss."
    : "Hi, I am Friday. How can I help you explore Mukul's portfolio?";

  // 1. GREETINGS
  if (q.includes("hello") || q.includes("hi ") || q.includes("hey") || q.includes("greet") || q.includes("who are you") || q.includes("introduce") || q.includes("your name")) {
    return greetingResponse;
  }

  // 2. RESEARCH PAPER
  if (q.includes("paper") || q.includes("research") || q.includes("publication") || q.includes("dasgri") || q.includes("landslide")) {
    return avengersMode
      ? "Analyzing publication archives. Mukul's primary research paper is titled: 'EcoGeoGuard: AI-IoT Based Landslide Prediction and Smart Agriculture System'. It was accepted at the DASGRI Congress 2026. The architecture feeds real-time multi-sensor telemetry into an AWS cloud pipeline, achieving sub-3-minute alert latency."
      : "Accessing research database. Mukul Sharma published a paper titled: 'EcoGeoGuard: AI-IoT Based Landslide Prediction and Smart Agriculture System' accepted at the DASGRI Congress 2026. It documents a LoRa IoT edge network and AWS serverless risk scoring pipeline with an F1 score of 0.94.";
  }

  // 3. ECOGEOGUARD DETAILS
  if (q.includes("ecogeoguard") || q.includes("landslide prediction") || q.includes("iot")) {
    return avengersMode
      ? "EcoGeoGuard telemetry loaded, Boss. It is an end-to-end landslide forecasting platform. The IoT array measures soil hydration, vibration, tilt, and rain. The AWS ML pipeline parses this every 30 seconds. Farmers and governments get instant SMS alerts in under 3 minutes. It supports 187 active edge nodes."
      : "Project detail retrieved: EcoGeoGuard. An AI-IoT system for real-time landslide warning and telemetry. Using LoRaWAN edge sensors and AWS cloud serverless triggers. Verified ML model F1-score is 0.94. Interface displays separate dashboards for farmers, admins, and agricultural ministries.";
  }

  // 4. INVENTROX DETAILS
  if (q.includes("inventrox") || q.includes("business") || q.includes("sme") || q.includes("pos")) {
    return avengersMode
      ? "Loading INVENTROX records. This is an AI-driven Business Operating System built to assist Indian SMEs. It consolidates CRM, smart inventory, lightning-fast point of sale billing, and GST invoicing into one interface. Mukul coded it using NextJS, Express, and MongoDB."
      : "Project detail retrieved: INVENTROX. A commercial AI Business OS for small and medium businesses in India. Replaces isolated invoicing and inventory trackers with a unified stack. Featuring real-time analytics and an AI dashboard helper. Built on Next.js, Node, and MongoDB Atlas.";
  }

  // 5. PROJECTS GENERAL
  if (q.includes("project") || q.includes("portfolio") || q.includes("shipped") || q.includes("make") || q.includes("build") || q.includes("game") || q.includes("galactus")) {
    return avengersMode
      ? "Mukul's projects directory includes: First, EcoGeoGuard, the AI-IoT landslide framework. Second, INVENTROX, the SME Business Operating System. Third, Space Galactus, a 2D shooter developed in Unity 6. And fourth, a Virtual Reality Herbal Garden for the Smart India Hackathon. Systems are ready to detail any of these, Boss."
      : "Mukul has completed four major engineering projects: EcoGeoGuard (AI-IoT warning node system), INVENTROX (AI POS and billing system for SMEs), Space Galactus (C# game in Unity 6), and the AYUSH VR Garden backend for the SIH Hackathon. Contact links contain live demos.";
  }

  // 6. SKILLS & STACK
  if (q.includes("skill") || q.includes("stack") || q.includes("languages") || q.includes("python") || q.includes("aws") || q.includes("java") || q.includes("security") || q.includes("cyber")) {
    return avengersMode
      ? "Checking core arsenal. Mukul specializes in Cyber Security, AWS Cloud Architecture, and AI-IoT integrations. His language telemetry lists Python, Java, C++, and C#. His cloud capabilities include Lambda, DynamoDB, API Gateway, SQS, and CodePipeline. He is highly proficient, Boss."
      : "Mukul's engineering stack consists of: Cyber Security (IAM, Network Security, Secure Cloud Design), Cloud Computing (AWS serverless microservices, Step Functions), AI and Machine Learning (AI-IoT models, GenAI APIs), and Web Development (React, Next, Node, Express, MongoDB).";
  }

  // 7. EXPERIENCE
  if (q.includes("experience") || q.includes("work") || q.includes("job") || q.includes("trailblazer") || q.includes("salesforce") || q.includes("sapphire") || q.includes("training")) {
    return avengersMode
      ? "Extracting service records. Mukul completed training in Cloud DevOps at Programming Pathsala and Salesforce Developer Catalyst Plus. He also served as the CEO of LPU Student Organisation SAPPHIRE, managing a unit of over 20 developers and coordinators."
      : "Mukul's professional history includes a role as CEO of LPU Student Organisation SAPPHIRE, where he led 20 team members. He also completed DevOps & AWS Training at Programming Pathsala, and Salesforce Apex/LWC development under Trailblazer Connect.";
  }

  // 8. CONTACTS
  if (q.includes("contact") || q.includes("email") || q.includes("phone") || q.includes("github") || q.includes("linkedin") || q.includes("hire") || q.includes("reach") || q.includes("number")) {
    return avengersMode
      ? "Comms uplink ready, Boss. You can email Mukul at mukulsharmaworks@gmail.com, or dial plus 91 77373 60788. You can also view his GitHub at mukulsharmams007 or message him on LinkedIn. Direct buttons are printed in the log panel."
      : "To contact Mukul Sharma, transmit an email to mukulsharmaworks@gmail.com or call plus 91 77373 60788. Social links are active on the terminal: GitHub at github.com/mukulsharmams007 and LinkedIn at mukul-sharma-514634214.";
  }

  // 9. FRIDAY / STARK REFERENCES
  if (q.includes("friday") || q.includes("stark") || q.includes("suit") || q.includes("jarvis") || q.includes("avenger")) {
    return "All systems are green, Boss. Mark 85 armor telemetry is normal. Holographic visualizers are calibrated. The Arc Reactor is stable at 100%. Ready for your next request.";
  }

  // Fallback for offline mode general questions
  return avengersMode
    ? "Boss, I am currently running on local telemetry buffers. For general knowledge reasoning and open-domain chats, please connect a Gemini API Key in the config drawer at the bottom left of the panel."
    : "The chatbot is operating in offline expert mode. To unlock general questions, please input a valid Google Gemini API Key in the settings drawer at the bottom of the interface.";
}
