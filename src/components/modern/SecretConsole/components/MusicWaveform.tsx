"use client";

import { useEffect, useState } from "react";

interface MusicWaveformProps {
  isPlaying: boolean;
  barCount?: number;
  trackTitle?: string;
}

const DANCER_FRAMES = [
  [" o ", "/|\\", " | ", "/ \\"],
  [" o ", "\\|/", " | ", "/ \\"],
  [" o ", "<|>", " | ", "/ \\"],
  [" o ", "/|\\", "/ \\", "   "],
];

const MUSIC_SYMBOLS = [
  [" ♪ ", "   "],
  [" ♫ ", "   "],
  [" ♬ ", "   "],
  ["♪ ♫ ", "   "],
  [" ♫♪", "   "],
];

const SWITCH_VARIANT_MS = 3500;
const DANCER_FRAME_MS = 200;
const MUSIC_FRAME_MS = 400;
const CENTER_WIDTH = 72;
const CENTER_HEIGHT = 64;

export function MusicWaveform({
  isPlaying,
  barCount = 21,
  trackTitle,
}: MusicWaveformProps) {
  const [centerVariant, setCenterVariant] = useState<"dancer" | "music">("dancer");
  const [dancerFrame, setDancerFrame] = useState(0);
  const [musicFrame, setMusicFrame] = useState(0);

  const showCenter = isPlaying;

  useEffect(() => {
    if (!isPlaying) return;
    setCenterVariant("dancer");
    setDancerFrame(0);
    setMusicFrame(0);
    const id = window.setInterval(() => {
      setCenterVariant((v) => (v === "dancer" ? "music" : "dancer"));
      setDancerFrame(0);
      setMusicFrame(0);
    }, SWITCH_VARIANT_MS);
    return () => clearInterval(id);
  }, [isPlaying]);

  useEffect(() => {
    if (!showCenter) return;
    if (centerVariant === "dancer") {
      const t = setInterval(
        () => setDancerFrame((f) => (f + 1) % DANCER_FRAMES.length),
        DANCER_FRAME_MS
      );
      return () => clearInterval(t);
    }
    const t = setInterval(
      () => setMusicFrame((f) => (f + 1) % MUSIC_SYMBOLS.length),
      MUSIC_FRAME_MS
    );
    return () => clearInterval(t);
  }, [showCenter, centerVariant]);

  const leftCount = Math.floor(barCount / 2);
  const rightCount = barCount - leftCount;

  const barStyle = (i: number, side: "left" | "right") => {
    const idx = side === "left" ? i : leftCount + i;
    const duration = 0.75 + (idx % 7) * 0.18;
    const delay = idx * 0.06;
    const anim =
      idx % 3 === 0 ? "waveform-pulse-a" : idx % 3 === 1 ? "waveform-pulse-b" : "waveform-pulse-c";
    return {
      opacity: isPlaying ? 0.85 : 0.4,
      animationDelay: `${delay}s`,
      animationDuration: `${duration}s`,
      animationName: anim,
    };
  };

  return (
    <div
      className="flex flex-col gap-2 py-3 px-4 rounded-lg border border-[#3794CF]/25 bg-black/40 font-mono"
      aria-hidden
    >
      {trackTitle && (
        <div className="text-[11px] text-[#7BB1D9] opacity-90 truncate">
          <span className="text-[#3794CF]">&gt;</span> {trackTitle}
        </div>
      )}

      <div className="flex items-center justify-center gap-3 min-h-[70px]">
        <div
          className={`waveform-bars flex items-end gap-0.5 ${isPlaying ? "playing" : ""}`}
          data-side="left"
        >
          {Array.from({ length: leftCount }, (_, i) => (
            <div
              key={i}
              className="waveform-bar w-2 rounded-sm bg-[#3794CF] min-h-[12px]"
              style={barStyle(i, "left")}
            />
          ))}
        </div>

        <div
          className="relative flex items-center justify-center rounded-md border overflow-hidden"
          style={{
            width: CENTER_WIDTH,
            height: CENTER_HEIGHT,
            borderColor: "rgba(166,206,232,0.25)",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(0,0,0,0.05))",
          }}
        >
          <div
            className="center-content dancer-content flex flex-col items-center justify-center text-[11px] leading-tight whitespace-pre absolute inset-0 pointer-events-none"
            style={{
              opacity: showCenter && centerVariant === "dancer" ? 1 : 0,
              transition: "opacity 0.2s",
              zIndex: centerVariant === "dancer" ? 1 : 0,
            }}
          >
            {DANCER_FRAMES[dancerFrame].map((line, i) => (
              <span key={i}>{line}</span>
            ))}
          </div>
          <div
            className="center-content music-content flex flex-col items-center justify-center text-[11px] leading-tight whitespace-pre absolute inset-0 pointer-events-none"
            style={{
              opacity: showCenter && centerVariant === "music" ? 1 : 0,
              transition: "opacity 0.2s",
              color: "#A6CEE8",
              zIndex: centerVariant === "music" ? 1 : 0,
            }}
          >
            {MUSIC_SYMBOLS[musicFrame].map((line, i) => (
              <span key={i}>{line}</span>
            ))}
          </div>
        </div>

        <div
          className={`waveform-bars flex items-end gap-0.5 ${isPlaying ? "playing" : ""}`}
          data-side="right"
        >
          {Array.from({ length: rightCount }, (_, i) => (
            <div
              key={i}
              className="waveform-bar w-2 rounded-sm bg-[#CB8CC2] min-h-[12px]"
              style={barStyle(i, "right")}
            />
          ))}
        </div>
      </div>

      <style>{`
        .dancer-content {
          color: #CB8CC2;
          animation: dancer-color-pulse 2s ease-in-out infinite;
        }
        @keyframes dancer-color-pulse {
          0%, 100% { color: #CB8CC2; }
          50% { color: #3794CF; }
        }
        .waveform-bar {
          height: 48px;
          transform-origin: bottom;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
        .waveform-bars:not(.playing) .waveform-bar {
          animation-play-state: paused;
          transform: scaleY(0.35);
        }
        @keyframes waveform-pulse-a {
          0%, 100% { transform: scaleY(0.35); }
          50% { transform: scaleY(0.95); }
        }
        @keyframes waveform-pulse-b {
          0% { transform: scaleY(0.5); }
          25% { transform: scaleY(0.9); }
          50% { transform: scaleY(0.4); }
          75% { transform: scaleY(0.85); }
          100% { transform: scaleY(0.5); }
        }
        @keyframes waveform-pulse-c {
          0%, 100% { transform: scaleY(0.9); }
          50% { transform: scaleY(0.35); }
        }
      `}</style>
    </div>
  );
}
