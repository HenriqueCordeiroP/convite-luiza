import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { assetUrl } from "@/lib/utils";

const MUSIC_SRC = assetUrl("/assets/aba_music.png");
const AUDIO_SRC = assetUrl("/audio/jb-beauty.mp3");
const START_AT_SECONDS = 50;

type MobileDecorIcon = {
  src: string;
  /** Tailwind width class */
  size: string;
  /** Tailwind rotation class */
  rot: string;
  /** Grid placement + diagonal offset */
  pos: string;
};

/** Mobile: 3 itens por separação (diagonal leve, organizado) */
const TOP_DECOR: readonly MobileDecorIcon[] = [
  {
    src: assetUrl("/assets/22_balloon.png"),
    size: "w-12",
    rot: "rotate-6",
    pos: "col-start-1 justify-self-start -translate-y-4",
  },
  {
    src: assetUrl("/assets/cupcake.png"),
    size: "w-12",
    rot: "-rotate-12",
    pos: "col-start-3 justify-self-end translate-y-4",
  },
] as const;

const BOTTOM_DECOR: readonly MobileDecorIcon[] = [
  {
    src: assetUrl("/assets/disco.png"),
    size: "w-16",
    rot: "rotate-12",
    pos: "col-start-1 justify-self-start -translate-y-4",
  },
  {
    src: assetUrl("/assets/exportando.png"),
    size: "w-56",
    rot: "-rotate-6",
    pos: "col-start-2 justify-self-center translate-y-0 max-w-none",
  },
  {
    src: assetUrl("/assets/diploma.png"),
    size: "w-16",
    rot: "-rotate-[65deg]",
    pos: "col-start-3 justify-self-end translate-y-4",
  },
] as const;

interface MobileDecorationsSectionProps {
  placement: "top" | "middle" | "bottom";
}

/** Ícones soltos espalhados — só mobile, aparece ao rolar */
export function MobileDecorationsSection({ placement }: MobileDecorationsSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  const showMusic = placement === "top";
  const gridColsClass = showMusic || placement === "bottom"
    ? "grid-cols-[1fr_auto_1fr]"
    : placement === "middle"
      ? "grid-cols-[auto_auto] justify-center"
      : "grid-cols-3";
  const decorIcons: readonly MobileDecorIcon[] =
    placement === "top"
      ? TOP_DECOR
      : placement === "middle"
        ? ([
            {
              src: assetUrl("/assets/letrinhas.png"),
              size: "w-40",
              rot: "-rotate-12",
              pos: "col-start-1 justify-self-center -translate-y-3 -translate-x-4 max-w-none",
            },
            {
              src: assetUrl("/assets/aba_confirme.png"),
              size: "w-44",
              rot: "rotate-10",
              pos: "col-start-2 justify-self-center translate-y-3 translate-x-4 max-w-none",
            },
          ] as const)
        : BOTTOM_DECOR;

  const ensureStartAt = async (audio: HTMLAudioElement) => {
    if (audio.readyState < 1) {
      await new Promise<void>((resolve) => {
        const onLoaded = () => {
          audio.removeEventListener("loadedmetadata", onLoaded);
          resolve();
        };
        audio.addEventListener("loadedmetadata", onLoaded, { once: true });
      });
    }
    const safeStart =
      Number.isFinite(audio.duration) && audio.duration > START_AT_SECONDS
        ? START_AT_SECONDS
        : 0;
    try {
      audio.currentTime = safeStart;
    } catch {}
  };

  const toggleAudio = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      if (audio.paused) {
        audio.volume = 0.6;
        await ensureStartAt(audio);
        await audio.play();
        setIsPlaying(true);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    } catch {
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleEnded = () => setIsPlaying(false);
    const handlePause = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("play", handlePlay);
    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("play", handlePlay);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="sm:hidden relative py-12 px-6 overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full"
      >
        <div className="mx-auto w-full max-w-sm">
          <div
            className={`grid items-center gap-x-7 ${gridColsClass}`}
          >
            {showMusic ? (
              <>
                <motion.img
                  key={`${placement}-${decorIcons[0]?.src}-left`}
                  src={decorIcons[0]?.src}
                  alt=""
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 0.72, scale: 1 } : { opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
                  className={`h-auto pointer-events-none select-none ${decorIcons[0]?.size ?? "w-16"} ${
                    decorIcons[0]?.rot ?? ""
                  } ${decorIcons[0]?.pos ?? ""}`}
                />

                <motion.img
                  src={MUSIC_SRC}
                  alt={isPlaying ? "Parar música" : "Tocar música"}
                  aria-label={isPlaying ? "Parar música" : "Tocar música"}
                  role="button"
                  tabIndex={0}
                  onClick={toggleAudio}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") toggleAudio();
                  }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{
                    opacity: isInView ? 1 : 0,
                    scale: isInView ? 1 : 0.9,
                    y: isPlaying ? [0, -4, 0] : 0,
                  }}
                  transition={{
                    opacity: { duration: 0.4, delay: 0.24 },
                    scale: { duration: 0.4, delay: 0.24 },
                    y: {
                      duration: 1.2,
                      repeat: isPlaying ? Infinity : 0,
                      ease: "easeInOut",
                    },
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    filter: isPlaying
                      ? "drop-shadow(0 0 14px rgba(55,148,207,0.55))"
                      : "drop-shadow(0 0 10px rgba(55,148,207,0.25))",
                  }}
                  className="col-start-2 justify-self-center translate-y-0 w-48 max-w-none h-auto cursor-pointer pointer-events-auto select-none"
                />

                <motion.img
                  key={`${placement}-${decorIcons[1]?.src}-right`}
                  src={decorIcons[1]?.src}
                  alt=""
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 0.72, scale: 1 } : { opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: 0.32, ease: "easeOut" }}
                  className={`h-auto pointer-events-none select-none ${decorIcons[1]?.size ?? "w-16"} ${
                    decorIcons[1]?.rot ?? ""
                  } ${decorIcons[1]?.pos ?? ""}`}
                />
              </>
            ) : (
              decorIcons.map((item, i) => (
                <motion.img
                  key={`${placement}-${item.src}-${i}`}
                  src={item.src}
                  alt=""
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 0.72, scale: 1 } : { opacity: 0, scale: 0.9 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.1 + i * 0.12,
                    ease: "easeOut",
                  }}
                  className={`h-auto pointer-events-none select-none ${item.size} ${item.rot} ${item.pos}`}
                />
              ))
            )}
          </div>
        </div>
      </motion.div>

      {showMusic && <audio ref={audioRef} src={AUDIO_SRC} preload="auto" />}
    </div>
  );
}
