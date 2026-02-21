import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const BALLOON_SRC = "/assets/22_balloon.png";
const MUSIC_SRC = "/assets/aba_music.png";
const AUDIO_SRC = "/audio/jb-beauty.mp3";
const CUPCAKE_SRC = "/assets/cupcake.png";
const LETRINHAS_SRC = "/assets/letrinhas.png";
const CONFIRME_SRC = "/assets/aba_confirme.png";
const EXPORTANDO_SRC = "/assets/exportando.png";
const DIPLOMA_SRC = "/assets/diploma.png";
const START_AT_SECONDS = 50;

export function Hero() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

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
    } catch (err) {
      console.error("Audio play() failed:", err);
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
    <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Background decorativos — só desktop; mobile: apenas conteúdo central */}
      <div className="hidden sm:block absolute inset-0 pointer-events-none" aria-hidden>
        {/* BALÃO — só desktop (topo esquerdo); no mobile fica vazio para o botão de música */}
        <img
          src={BALLOON_SRC}
          alt=""
          className="hidden sm:block absolute w-16 md:w-24 lg:w-28 top-[6%] left-[7%] md:left-[8%] opacity-40 pointer-events-auto hover:opacity-80 hover:drop-shadow-[0_0_12px_rgba(55,148,207,0.4)] transition-all duration-300"
        />

        {/* CUPCAKE — topo direito (longe do botão de música no mobile) */}
        <img
          src={CUPCAKE_SRC}
          alt=""
          className="absolute w-12 sm:w-16 md:w-20 lg:w-28 top-[6%] right-[5%] sm:right-[7%] md:right-[8%] opacity-45 sm:opacity-40 rotate-12 pointer-events-auto hover:opacity-80 hover:drop-shadow-[0_0_12px_rgba(203,140,194,0.4)] transition-all duration-300"
        />

        {/* LETRINHAS — desktop: entre a música (canto inferior direito) e o cupcake (topo direito) */}
        <img
          src={LETRINHAS_SRC}
          alt=""
          className="hidden sm:block absolute w-32 md:w-40 lg:w-64 right-[6%] md:right-[8%] top-[45%] -translate-y-1/2 opacity-40 rotate-12 pointer-events-auto hover:opacity-80 hover:drop-shadow-[0_0_12px_rgba(55,148,207,0.4)] transition-all duration-300"
        />

        {/* EXPORTANDO — inferior esquerdo */}
        <img
          src={EXPORTANDO_SRC}
          alt=""
          className="absolute w-28 sm:w-36 md:w-44 lg:w-60 bottom-[10%] sm:bottom-[15%] left-[4%] sm:left-[7%] md:left-[8%] opacity-45 sm:opacity-45 -rotate-6 pointer-events-auto hover:opacity-80 hover:drop-shadow-[0_0_12px_rgba(7,123,198,0.4)] transition-all duration-300"
        />

        {/* 22 (BALÃO) — mobile: inferior direito (isolado, sem sobreposição) */}
        <img
          src={BALLOON_SRC}
          alt=""
          className="sm:hidden absolute w-14 bottom-[6%] right-[5%] opacity-45 pointer-events-auto hover:opacity-80 hover:drop-shadow-[0_0_12px_rgba(55,148,207,0.4)] transition-all duration-300"
        />

        {/* DIPLOMA — só desktop: coluna esquerda */}
        <img
          src={DIPLOMA_SRC}
          alt=""
          className="hidden md:block absolute w-14 lg:w-20 left-[7%] top-[36%] opacity-40 -rotate-[70deg] pointer-events-auto hover:opacity-80 hover:drop-shadow-[0_0_12px_rgba(203,140,194,0.4)] transition-all duration-300"
        />
      </div>

      {/* MUSIC BUTTON — só desktop; mobile: vai pro bloco de ícones abaixo */}
      <motion.img
        src={MUSIC_SRC}
        alt={isPlaying ? "Parar música" : "Tocar música"}
        role="button"
        tabIndex={0}
        onClick={toggleAudio}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") toggleAudio();
        }}
        animate={isPlaying ? { y: [0, -6, 0] } : {}}
        transition={{
          duration: 1.2,
          repeat: isPlaying ? Infinity : 0,
          ease: "easeInOut",
        }}
        className="
          hidden sm:block
          absolute z-30 pointer-events-auto cursor-pointer
          opacity-[0.75] hover:opacity-100
          w-40 md:w-64 h-auto
          transition-all hover:scale-105 active:scale-95
          rotate-[2deg]
          top-auto left-auto bottom-[12%] right-[8%]
        "
        style={{
          filter: isPlaying
            ? "drop-shadow(0 0 16px rgba(55,148,207,0.4))"
            : "none",
        }}
      />

      <audio ref={audioRef} src={AUDIO_SRC} preload="auto" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative z-10 text-center max-w-3xl mx-auto"
      >
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-6">
          <motion.img
            src="/assets/chapeu_festa.png"
            alt="Chapéu de festa"
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-16 h-16 sm:w-24 sm:h-24 object-contain hover:drop-shadow-[0_0_16px_rgba(203,140,194,0.5)] transition-all duration-300 hover:scale-110"
          />

          <motion.img
            src="/assets/chapeu_formatura.png"
            alt="Chapéu de formatura"
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.4,
            }}
            className="w-16 h-16 sm:w-24 sm:h-24 object-contain mt-8 sm:mt-16 hover:drop-shadow-[0_0_16px_rgba(55,148,207,0.5)] transition-all duration-300 hover:scale-110"
          />
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-modern mb-4 leading-tight">
          <span
            className="bg-clip-text text-transparent hero-title-glow"
            style={{
              backgroundImage:
                "linear-gradient(to right, #CB8CC2, #3794CF, #077BC6)",
              textShadow: `
                0 0 6px rgba(255,255,255,0.25),
                0 0 28px rgba(55,148,207,0.18)
              `,
            }}
          >
            Luiza Omena
          </span>
        </h1>

        <div className="mt-6 flex justify-center">
          <motion.img
            src="/assets/info_festa.png"
            alt="14 de março de 2026, início às 16h. Rua Antônio Virtruvio, 49. Formatura + Aniversário."
            className="max-w-[340px] sm:max-w-[500px] w-full h-auto object-contain drop-shadow-lg ml-2 sm:ml-4 hover:drop-shadow-[0_0_20px_rgba(55,148,207,0.4)] transition-all duration-300 hover:scale-[1.02]"
          />
        </div>

        <motion.div
          className="mt-16 opacity-40"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <p className="font-modern text-xs mb-2">Confirma aqui embaixo!</p>
          <span className="text-2xl">↓</span>
        </motion.div>
      </motion.div>
    </section>
  );
}

