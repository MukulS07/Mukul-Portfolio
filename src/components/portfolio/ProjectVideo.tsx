import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize2, X } from "lucide-react";

interface ProjectVideoProps {
  src?: string;
  title: string;
}

export function ProjectVideo({ src, title }: ProjectVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.loop = true; // Enforce native looping property

    if (!isModalOpen) {
      video
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.log("Autoplay pending interaction:", err);
        });
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, [isModalOpen]);

  // Sync mute state
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const handleEnded = () => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      video
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.log("Loop play failed:", err);
        });
    }
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().then(() => {
        setIsPlaying(true);
      });
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsMuted(!isMuted);
  };

  const openModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsModalOpen(true);
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Sync modal video loop
  useEffect(() => {
    if (isModalOpen && modalVideoRef.current) {
      modalVideoRef.current.loop = true;
    }
  }, [isModalOpen]);

  const handleModalEnded = () => {
    const video = modalVideoRef.current;
    if (video) {
      video.currentTime = 0;
      video.play().catch((err) => {
        console.log("Modal loop play failed:", err);
      });
    }
  };

  if (!src) return null;

  return (
    <>
      <div
        className="mt-4 relative aspect-video border border-border bg-black/40 overflow-hidden group/video rounded-sm cursor-pointer hover:border-accent/40 transition-colors duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={openModal}
      >
        {/* Retro scanline effect (uses custom CSS class) */}
        <div className="absolute inset-0 pointer-events-none bg-scanlines opacity-15 mix-blend-overlay z-10" />

        {/* Glow vignette */}
        <div className="absolute inset-0 pointer-events-none bg-radial-vignette opacity-20 z-10" />

        <video
          ref={videoRef}
          src={src}
          autoPlay
          loop
          onEnded={handleEnded}
          muted={isMuted}
          playsInline
          className="w-full h-full object-cover filter contrast-[1.02]"
        />

        {/* HUD top bar */}
        <div className="absolute top-0 inset-x-0 bg-black/75 px-3 py-1.5 flex justify-between items-center font-mono text-[9px] tracking-wider text-muted-foreground border-b border-border/40 z-20 transition-opacity duration-300 group-hover/video:opacity-100 opacity-80">
          <span className="flex items-center gap-1.5">
            <span
              className={`h-1.5 w-1.5 rounded-full ${isPlaying ? "bg-accent animate-pulse" : "bg-amber-warn"}`}
            />
            FEED // {isPlaying ? "STREAMING" : "STANDBY"}
          </span>
          <span className="text-dim">REC.01 // {title.toUpperCase()}</span>
        </div>

        {/* Hover play/pause overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover/video:opacity-100 transition-opacity duration-300 z-20">
          <div className="flex gap-3">
            <button
              onClick={togglePlay}
              className="p-2.5 rounded-full border border-border bg-black/90 text-foreground hover:text-accent hover:border-accent hover:scale-105 active:scale-95 transition-all duration-200"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
            </button>
            <button
              onClick={toggleMute}
              className="p-2.5 rounded-full border border-border bg-black/90 text-foreground hover:text-accent hover:border-accent hover:scale-105 active:scale-95 transition-all duration-200"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
            <button
              onClick={openModal}
              className="p-2.5 rounded-full border border-border bg-black/90 text-foreground hover:text-accent hover:border-accent hover:scale-105 active:scale-95 transition-all duration-200"
              title="Expand View"
            >
              <Maximize2 size={14} />
            </button>
          </div>
        </div>

        {/* Unmute/interaction tip */}
        <div className="absolute bottom-2.5 right-2.5 bg-black/75 border border-border/40 px-2 py-1 rounded font-mono text-[9px] text-muted-foreground z-20 pointer-events-none uppercase tracking-wider opacity-60 group-hover/video:opacity-100 transition-opacity duration-300">
          {isMuted ? "Click to expand / Hover for audio" : "Audio active"}
        </div>
      </div>

      {/* Cyberpunk Modal Player */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-4xl border border-accent/30 bg-background shadow-[0_0_50px_rgba(var(--accent),0.1)] flex flex-col"
            onClick={(e) => e.stopPropagation()} // Prevent close on clicking inner content
          >
            {/* Modal HUD Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-black/50 font-mono text-xs">
              <span className="flex items-center gap-2 text-accent">
                <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                SYSTEM_FEED // {title.toUpperCase()} // RESOLUTION_1080P
              </span>
              <button
                onClick={closeModal}
                className="text-muted-foreground hover:text-accent border border-border hover:border-accent/40 p-1 transition-colors"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            </div>

            {/* Video container */}
            <div className="relative aspect-video bg-black flex items-center justify-center">
              <video
                ref={modalVideoRef}
                src={src}
                controls
                autoPlay
                loop
                onEnded={handleModalEnded}
                className="w-full h-full"
              />
            </div>

            {/* Modal HUD Footer */}
            <div className="px-5 py-2.5 border-t border-border bg-black/30 font-mono text-[10px] text-dim flex justify-between">
              <span>DEMO MODE: ACTIVE // SOURCE: LOCAL_STORAGE</span>
              <span>CLICK OUTSIDE OR PRESS ESC TO CLOSE</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
