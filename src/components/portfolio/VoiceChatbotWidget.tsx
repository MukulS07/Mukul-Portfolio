import { useEffect, useRef, useState } from "react";
import { queryChatbot } from "@/lib/chatbot-service";
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
  Key,
  MessageSquare,
  X,
  Minus,
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


export function VoiceChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "Vocal systems active. I am Friday, your cybernetic assistant. Say 'hello' or click the mic to begin transmission.",
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
  const [hotwordEnabled, setHotwordEnabled] = useState<boolean>(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const miniCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Audio Context for User Mic feedback
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);

  // Refs for tracking state inside event handlers to avoid stale closures
  const continuousModeRef = useRef(false);
  const isOpenRef = useRef(false);
  const recognitionActiveRef = useRef(false);

  useEffect(() => {
    continuousModeRef.current = continuousVoiceMode;
  }, [continuousVoiceMode]);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

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

  // Read Avenger Mode from document body class
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

  // Background hotword listener ("Hey Friday" activation)
  useEffect(() => {
    if (typeof window === "undefined" || isOpen || !hotwordEnabled) return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    let bgRecognition: any = null;
    let shouldRestart = true;

    const startBgRecognition = () => {
      try {
        bgRecognition = new SpeechRecognition();
        bgRecognition.continuous = false;
        bgRecognition.interimResults = false;
        bgRecognition.lang = "en-US";

        bgRecognition.onresult = (event: any) => {
          const text = event.results[0][0].transcript.toLowerCase();
          console.log("Friday background telemetry heard:", text);
          if (text.includes("hey friday") || text.includes("friday")) {
            console.log("Hotword 'Friday' activation detected.");
            shouldRestart = false;
            bgRecognition.stop();
            
            // Expand chatbot widget
            setIsOpen(true);
            setContinuousVoiceMode(true);
            setBotState("speaking");
            setStatusLog("FRIDAY_AUDIO::ACTIVE");
            
            // Speak confirmation
            setTimeout(() => {
              const phrase = isAvengersRef.current 
                ? "Yes, Boss. Friday is online." 
                : "Yes, Friday is here. Listening.";
              speakOutput(phrase);
            }, 300);
          }
        };

        bgRecognition.onend = () => {
          if (shouldRestart) {
            setTimeout(startBgRecognition, 1000);
          }
        };

        bgRecognition.onerror = (e: any) => {
          console.warn("Background hotword listener error:", e.error);
          if (e.error === "not-allowed") {
            shouldRestart = false;
          }
        };

        bgRecognition.start();
      } catch (err) {
        console.error("Failed to start background recognition:", err);
      }
    };

    startBgRecognition();

    return () => {
      shouldRestart = false;
      if (bgRecognition) {
        try {
          bgRecognition.abort();
        } catch (e) {}
      }
    };
  }, [isOpen, hotwordEnabled]);

  function getFormattedTime() {
    return new Date().toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  // Scroll terminal
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 80);
    }
  }, [messages, isOpen]);

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
          initMicrophone();
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
            addSystemMessage("Microphone permission denied. Please enable mic access or type.");
          }
        };

        rec.onend = () => {
          setRecognitionActive(false);
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

  // Draw Expanded Canvas Loop
  useEffect(() => {
    if (!isOpen) return;

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

      // Rotation speeds based on state
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
    return () => cancelAnimationFrame(animationFrameId);
  }, [isOpen, botState, isAvengers]);

  // Draw Collapsed Small Floating Orb Canvas Loop (Arc Reactor)
  useEffect(() => {
    if (isOpen) return;

    const canvas = miniCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let rotation = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const r = 26; // base reactor radius

      const primaryColor = isAvengers ? "239, 68, 68" : "56, 189, 248"; // red vs cyan
      const energyColor = isAvengers ? "254, 240, 138" : "224, 242, 254"; // gold/yellow vs bright light-blue
      const coilColor = isAvengers ? "234, 179, 8" : "14, 165, 233"; // copper gold vs neon blue

      rotation += 0.01;
      const pulse = 0.85 + Math.sin(Date.now() / 280) * 0.15; // breathing pulse

      // 1. Outer metallic casing ring
      ctx.strokeStyle = `rgba(${primaryColor}, 0.25)`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, r + 4, 0, Math.PI * 2);
      ctx.stroke();

      // 2. Outer glowing ring
      ctx.shadowBlur = 8;
      ctx.shadowColor = `rgb(${primaryColor})`;
      ctx.strokeStyle = `rgba(${primaryColor}, ${0.45 + pulse * 0.25})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, r + 2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0; // reset shadow

      // 3. Central ring guide
      ctx.strokeStyle = `rgba(${primaryColor}, 0.2)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, r - 5, 0, Math.PI * 2);
      ctx.stroke();

      // 4. Draw the 10 Arc Reactor coils/segments
      const numCoils = 10;
      const coilRadius = r - 6;
      for (let i = 0; i < numCoils; i++) {
        const angle = (i * Math.PI * 2) / numCoils + rotation;
        // Coil copper background
        ctx.strokeStyle = `rgba(${coilColor}, 0.35)`;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(cx, cy, coilRadius, angle - 0.2, angle + 0.2);
        ctx.stroke();

        // Glowing core of the coil
        ctx.strokeStyle = `rgba(${energyColor}, ${0.75 + pulse * 0.25})`;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(cx, cy, coilRadius, angle - 0.16, angle + 0.16);
        ctx.stroke();
      }

      // 5. Spindle lines radiating from center
      ctx.strokeStyle = `rgba(${primaryColor}, 0.25)`;
      ctx.lineWidth = 1;
      for (let i = 0; i < numCoils; i++) {
        const angle = (i * Math.PI * 2) / numCoils + rotation;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(angle) * 7, cy + Math.sin(angle) * 7);
        ctx.lineTo(cx + Math.cos(angle) * (r - 9), cy + Math.sin(angle) * (r - 9));
        ctx.stroke();
      }

      // 6. Central Energy Core
      ctx.shadowBlur = 10;
      ctx.shadowColor = `rgb(${primaryColor})`;
      
      if (isAvengers) {
        // Triangular Core (Iron Man Mark VI)
        ctx.fillStyle = `rgba(${energyColor}, ${0.85 + pulse * 0.15})`;
        ctx.beginPath();
        const triRadius = 7.5;
        const triRotation = rotation * 0.5;
        for (let i = 0; i < 3; i++) {
          const angle = (i * Math.PI * 2) / 3 - Math.PI / 2 + triRotation;
          const x = cx + Math.cos(angle) * triRadius;
          const y = cy + Math.sin(angle) * triRadius;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();

        // Copper core border
        ctx.strokeStyle = `rgba(${coilColor}, 0.8)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        const borderRad = 10.5;
        for (let i = 0; i < 3; i++) {
          const angle = (i * Math.PI * 2) / 3 - Math.PI / 2 + triRotation;
          const x = cx + Math.cos(angle) * borderRad;
          const y = cy + Math.sin(angle) * borderRad;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
      } else {
        // Circular Core (Classic Blue Reactor)
        ctx.fillStyle = `rgba(${energyColor}, ${0.85 + pulse * 0.15})`;
        ctx.beginPath();
        ctx.arc(cx, cy, 6.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = `rgba(${primaryColor}, 0.85)`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(cx, cy, 9.5, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.shadowBlur = 0; // reset

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [isOpen, isAvengers]);

  function addSystemMessage(text: string) {
    setMessages((prev) => [
      ...prev,
      { role: "bot", text: `[SYS_ALERT] ${text}`, timestamp: getFormattedTime() },
    ]);
  }



  const toggleMic = () => {
    if (!recognitionRef.current) {
      addSystemMessage("Speech API unsupported in this browser.");
      return;
    }
    if (recognitionActive) {
      setContinuousVoiceMode(false);
      recognitionRef.current.stop();
    } else {
      setContinuousVoiceMode(true);
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const speakOutput = (text: string) => {
    if (voiceMutedRef.current || typeof window === "undefined" || !window.speechSynthesis) {
      setBotState("idle");
      if (continuousModeRef.current && isOpenRef.current) {
        startSpeechRecognitionDelayed();
      }
      return;
    }

    window.speechSynthesis.cancel();
    const cleanSpeech = text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/https?:\/\/\S+/gi, "link")
      .replace(/[`*#_]/g, "")
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

    if (selectedVoice) utterance.voice = selectedVoice;

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

    utterance.onerror = () => {
      setBotState("idle");
      setStatusLog("AUDIO_OUTPUT::FAILED");
      if (continuousModeRef.current && isOpenRef.current) {
        startSpeechRecognitionDelayed();
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (text: string) => {
    if (!text || !text.trim()) return;

    if (inputText.trim()) {
      setContinuousVoiceMode(false);
    }

    const userMessage: Message = {
      role: "user",
      text,
      timestamp: getFormattedTime(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setBotState("thinking");
    setStatusLog("UPLINK_TRANSMITTING::WAIT_RESP");

    const chatHistory = messages
      .filter((m) => !m.text.startsWith("[SYS_ALERT]"))
      .slice(-6)
      .map((m) => ({
        role: m.role === "user" ? ("user" as const) : ("model" as const),
        parts: [{ text: m.text }],
      }));

    const res = await queryChatbot({
      data: {
        prompt: text,
        avengersMode: isAvengers,
        history: chatHistory,
      },
    });

    if (res.success && res.text) {
      const botMsg: Message = {
        role: "bot",
        text: res.text,
        timestamp: getFormattedTime(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setStatusLog("DOWNLINK_RECEIVED::DECODED");
      speakOutput(res.text);
    } else {
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

  // Base style settings
  const accentColor = isAvengers ? "border-[#ef4444]/40" : "border-[#38bdf8]/30";
  const glowShadow = isAvengers 
    ? "shadow-[0_0_15px_rgba(239,68,68,0.2)]" 
    : "shadow-[0_0_15px_rgba(56,189,248,0.15)]";

  return (
    <div className="fixed bottom-4 left-4 z-50 font-mono text-xs select-none">
      
      {/* Collapsed floating orb button */}
      {!isOpen && (
        <div className="flex flex-col items-center gap-2">
          {/* Hey Friday Toggle Badge */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setHotwordEnabled(!hotwordEnabled);
            }}
            className={`px-2.5 py-1 rounded-full border text-[9px] font-bold font-mono tracking-wider flex items-center gap-1.5 transition-all duration-300 shadow-md cursor-pointer ${
              hotwordEnabled
                ? isAvengers
                  ? "bg-red-950/80 border-red-500/50 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.25)] hover:bg-red-900/80"
                  : "bg-cyan-950/80 border-accent/50 text-accent shadow-[0_0_10px_rgba(56,189,248,0.25)] hover:bg-cyan-900/80"
                : "bg-black/85 border-border/60 text-muted-foreground hover:bg-black/95 hover:text-foreground"
            }`}
            title={hotwordEnabled ? "Click to disable background hotword listening" : "Click to enable background hotword listening"}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${
              hotwordEnabled
                ? "bg-green-400 animate-pulse"
                : "bg-muted-foreground/50"
            }`} />
            <span>{hotwordEnabled ? "SAY 'HEY FRIDAY'" : "HOTWORD: OFF"}</span>
          </button>

          {/* Floating Orb Button */}
          <button
            onClick={() => {
              setIsOpen(true);
              // Cancel voice on open
              if (typeof window !== "undefined" && window.speechSynthesis) {
                window.speechSynthesis.cancel();
              }
            }}
            className={`h-[72px] w-[72px] rounded-full border bg-background/90 backdrop-blur-md cursor-pointer transition flex items-center justify-center hover:scale-110 active:scale-95 duration-300 ${accentColor} ${glowShadow}`}
            title="Open Friday Assistant"
          >
            <canvas
              ref={miniCanvasRef}
              width={72}
              height={72}
              className="absolute inset-0 rounded-full"
            />
          </button>
        </div>
      )}

      {/* Expanded Floating AI Widget Panel */}
      {isOpen && (
        <div
          className={`w-[calc(100vw-32px)] sm:w-[360px] h-[260px] bg-background/90 backdrop-blur-lg border rounded-lg flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-300 ${accentColor} ${glowShadow}`}
        >
          {/* Scanline overlay */}
          <div className="absolute inset-0 pointer-events-none bg-scanlines opacity-[0.02] z-0" />

          {/* Top Panel Title Header */}
          <header className="relative z-10 flex items-center justify-between px-3.5 py-2 border-b border-border bg-black/40 text-[10px] tracking-wider text-muted-foreground">
            <span className="flex items-center gap-1.5 font-bold">
              <span className={`h-1.5 w-1.5 rounded-full ${
                botState === "listening" ? "bg-red-500 animate-pulse" :
                botState === "thinking" ? "bg-yellow-500 animate-spin" :
                botState === "speaking" ? "bg-green-500 animate-pulse" : "bg-accent"
              }`} />
              {isAvengers ? "🛰️ FRIDAY ASSISTANT" : "⚙️ FRIDAY AI"}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-muted-foreground hover:text-foreground transition cursor-pointer"
                title="Minimize Panel"
              >
                <Minus size={12} />
              </button>
            </div>
          </header>

          {/* 3D Visualizer Hologram Canvas */}
          <div className="relative z-10 h-[180px] bg-black/35 flex items-center justify-center px-4">
            <canvas
              ref={canvasRef}
              width={340}
              height={180}
              className="w-full h-full filter drop-shadow-[0_0_15px_rgba(56,189,248,0.2)]"
            />
            {/* Absolute status log indicator */}
            <span className="absolute right-3 top-2 text-[8px] opacity-40 font-mono tracking-widest uppercase">
              {statusLog}
            </span>
          </div>

          {/* Voice controls footer */}
          <footer className="relative z-10 p-2 border-t border-border bg-black/50 flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              {/* Toggle mic */}
              <button
                onClick={toggleMic}
                className={`h-9 w-9 rounded border flex items-center justify-center transition cursor-pointer shrink-0 ${
                  recognitionActive
                    ? isAvengers
                      ? "bg-red-500/20 border-red-500 text-red-400 animate-pulse"
                      : "bg-accent/20 border-accent text-accent animate-pulse"
                    : isAvengers
                      ? "bg-black/50 border-border text-muted-foreground hover:text-red-400 hover:border-red-500/30"
                      : "bg-black/50 border-border text-muted-foreground hover:text-accent hover:border-accent/30"
                }`}
                title={recognitionActive ? "Mute Microphone" : "Activate Microphone"}
              >
                {recognitionActive ? <Mic size={14} /> : <MicOff size={14} />}
              </button>

              {/* Mute output */}
              <button
                onClick={() => {
                  setVoiceMuted(!voiceMuted);
                  if (!voiceMuted && typeof window !== "undefined") {
                    window.speechSynthesis.cancel();
                  }
                }}
                className={`h-9 w-9 rounded border flex items-center justify-center transition cursor-pointer shrink-0 ${
                  voiceMuted ? "bg-black/50 border-red-500/20 text-red-400" : "bg-black/50 border-border text-muted-foreground hover:text-foreground"
                }`}
                title="Mute Bot TTS Voice"
              >
                {voiceMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
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
                className={`h-9 px-2.5 rounded border flex items-center gap-1.5 transition cursor-pointer shrink-0 text-[9px] font-bold ${
                  continuousVoiceMode
                    ? isAvengers
                      ? "bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_8px_rgba(239,68,68,0.3)]"
                      : "bg-accent/20 border-accent text-accent shadow-[0_0_8px_rgba(56,189,248,0.3)]"
                    : "bg-black/50 border-border text-muted-foreground hover:text-foreground"
                }`}
                title="Continuous Hands-Free Conversation Mode"
              >
                <Activity size={10} className={continuousVoiceMode ? "animate-pulse" : ""} />
                <span>{continuousVoiceMode ? "LIVE ON" : "LIVE OFF"}</span>
              </button>
            </div>

            {/* Voice Dropdown Accent Selector */}
            {availableVoices.length > 0 && (
              <select
                value={selectedVoiceName}
                onChange={(e) => setSelectedVoiceName(e.target.value)}
                className="bg-black/70 border border-border/80 rounded px-1.5 h-9 text-[9px] text-foreground focus:outline-none focus:border-accent font-mono max-w-[125px] shrink-0 cursor-pointer"
                title="Select Friday Voice Accent"
              >
                {availableVoices.map((v) => (
                  <option key={v.name} value={v.name} className="bg-black text-foreground">
                    {v.name.replace("Microsoft", "MS").replace("English", "EN").replace("Desktop", "")}
                  </option>
                ))}
              </select>
            )}
          </footer>
        </div>
      )}
    </div>
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

  if (q.includes("hello") || q.includes("hi ") || q.includes("hey") || q.includes("greet") || q.includes("who are you") || q.includes("introduce") || q.includes("your name")) {
    return greetingResponse;
  }
  if (q.includes("paper") || q.includes("research") || q.includes("publication") || q.includes("dasgri") || q.includes("landslide")) {
    return avengersMode
      ? "Mukul's paper is: 'EcoGeoGuard: AI-IoT Based Landslide Prediction and Smart Agriculture' accepted at DASGRI Congress 2026. AWS pipeline achieves sub-3-minute alert latency."
      : "Mukul Sharma published the paper: 'EcoGeoGuard: AI-IoT Based Landslide Prediction and Smart Agriculture System' accepted at DASGRI Congress 2026. ML risk scoring achieves F1 score of 0.94.";
  }
  if (q.includes("ecogeoguard") || q.includes("landslide prediction") || q.includes("iot")) {
    return avengersMode
      ? "EcoGeoGuard active. Measures soil hydration, vibration, tilt, and rain. AWS ML models parse data every 30s. Alerts triggered under 3 minutes for 187 edge nodes, Boss."
      : "EcoGeoGuard landslide warning platform. Multi-sensor LoRa WAN nodes send telemetry to AWS cloud. Validated F1 accuracy score is 0.94.";
  }
  if (q.includes("inventrox") || q.includes("business") || q.includes("sme") || q.includes("pos")) {
    return avengersMode
      ? "INVENTROX records loaded. An AI Business Operating System assisting Indian SMEs. POS billing, inventory, CRM, and GST invoicing. Stacks NextJS, Express, and MongoDB."
      : "INVENTROX is a commercial AI Business OS for small businesses. Replaces fragmented billing and inventory software. Developed with React, Node.js, and MongoDB.";
  }
  if (q.includes("project") || q.includes("portfolio") || q.includes("shipped") || q.includes("make") || q.includes("build") || q.includes("game") || q.includes("galactus")) {
    return avengersMode
      ? "Projects include: EcoGeoGuard (AI-IoT warning), INVENTROX (SME OS), Space Galactus (C# Unity 6 game), and VR Herbal Garden. Ask for telemetry on any of these, Boss."
      : "Mukul completed: EcoGeoGuard (landslide prediction), INVENTROX (business CRM/billing OS), Space Galactus (Unity C# shooter), and VR Herbal Garden (SIH Hackathon).";
  }
  if (q.includes("skill") || q.includes("stack") || q.includes("languages") || q.includes("python") || q.includes("aws") || q.includes("java") || q.includes("security") || q.includes("cyber")) {
    return avengersMode
      ? "Telemetry lists: Cyber Security (IAM, Networks), AWS Cloud, AI-IoT. Code skills: Python, Java, C++, C#, AWS Lambda, DynamoDB. Fully calibrated, Boss."
      : "Stack details: Cyber Security (Network & Cloud IAM), AWS (Lambda, DynamoDB, API Gateway, Step Functions), Web (Next.js, Node, MongoDB), and Python/Java/C#.";
  }
  if (q.includes("experience") || q.includes("work") || q.includes("job") || q.includes("trailblazer") || q.includes("salesforce") || q.includes("sapphire") || q.includes("training")) {
    return avengersMode
      ? "Service records: Cloud DevOps at Programming Pathsala, Salesforce Trailblazer Connect. Served as CEO of Student Org SAPPHIRE at LPU managing 20+ members."
      : "History: CEO of Student Organisation SAPPHIRE at LPU. DevOps & AWS Cloud training from Programming Pathsala. Salesforce Catalyst Trailblazer (Apex/LWC).";
  }
  if (q.includes("contact") || q.includes("email") || q.includes("phone") || q.includes("github") || q.includes("linkedin") || q.includes("hire") || q.includes("reach") || q.includes("number")) {
    return avengersMode
      ? "Comms up. Email: mukulsharmaworks@gmail.com. Mobile: +91 77373 60788. GitHub: mukulsharmams007. LinkedIn active, Boss."
      : "Contact info: Email: mukulsharmaworks@gmail.com. Mobile: +91-7737360788. GitHub: mukulsharmams007. LinkedIn: mukul-sharma-514634214.";
  }
  if (q.includes("friday") || q.includes("stark") || q.includes("suit") || q.includes("jarvis") || q.includes("avenger")) {
    return "Mark 85 armor diagnostics clear, Boss. Systems normal. Arc reactor capacity at 100%. Ask me anything.";
  }

  return avengersMode
    ? "Boss, offline telemetry buffer reached. For general answers, please enter your Gemini API Key in the settings drawer at the top right of this widget."
    : "Chatbot running offline. To request open-domain knowledge answers, please connect your Gemini API Key in the settings drawer.";
}
