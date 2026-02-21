import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { preloadAll } from "@/lib/preloadAssets";
import { InviteLightShow } from "@/components/transition/InviteLightShow";

interface Props {
  onComplete: () => void;
  /** Extra time to keep this screen visible (ms) */
  holdMs?: number;
}

const MIN_TRANSITION_MS = 8000;
/** Tempos fixos originais de cada fase (ms) – agora com "Preparados?" indo de 6s até 8s */
const PHASE_BOUNDS = [0, 1200, 2400, 4300, 7200, 8000] as const;
const TICK_MS = 200;
const PREPARADOS_START_MS = PHASE_BOUNDS[4];
const PREPARADOS_LIGHTS_DELAY_MS = 4000;
const FONT_GLITCH_DURATION_MS = 800;

function getPhase(elapsed: number): number {
  if (elapsed < MIN_TRANSITION_MS) {
    for (let i = PHASE_BOUNDS.length - 2; i >= 0; i--) {
      if (elapsed >= PHASE_BOUNDS[i]) return i;
    }
    return 0;
  }
  // Depois dos 8s, mantemos em "Preparados?" e deixamos a animação visual fazer o trabalho
  return 4;
}

export default function GlitchTransition({ onComplete, holdMs = 0 }: Props) {
  const [elapsed, setElapsed] = useState(0);
  const [preloadDone, setPreloadDone] = useState(false);
  const [fontGlitchClass, setFontGlitchClass] = useState<string | null>(null);
  const fontGlitchRaf = useRef(0);
  const fontGlitchTriggered = useRef(false);

  useEffect(() => {
    const id = setInterval(() => setElapsed((e) => e + TICK_MS), TICK_MS);
    return () => clearInterval(id);
  }, []);

  const phase = getPhase(elapsed);
  const minTimeReached = elapsed >= MIN_TRANSITION_MS + holdMs;
  const readyToComplete = preloadDone && minTimeReached;
  const lightsActive =
    phase === 4 &&
    elapsed >= PREPARADOS_START_MS + PREPARADOS_LIGHTS_DELAY_MS &&
    !preloadDone;

  // Font glitch: rapidly toggle between font-pixel and font-modern when entering phase 3
  useEffect(() => {
    if (phase === 3 && !fontGlitchTriggered.current) {
      fontGlitchTriggered.current = true;
      const start = performance.now();

      const tick = () => {
        const dt = performance.now() - start;
        if (dt >= FONT_GLITCH_DURATION_MS) {
          setFontGlitchClass(null);
          return;
        }
        const bias = dt / FONT_GLITCH_DURATION_MS;
        setFontGlitchClass(Math.random() < bias ? "font-modern" : "font-pixel");
        fontGlitchRaf.current = requestAnimationFrame(tick);
      };

      fontGlitchRaf.current = requestAnimationFrame(tick);
    }
    return () => cancelAnimationFrame(fontGlitchRaf.current);
  }, [phase]);

  // Preload de imagens e mapa durante a transição
  useEffect(() => {
    preloadAll().then(() => setPreloadDone(true));
  }, []);

  // Só chama onComplete quando o tempo mínimo passou E o preload terminou
  useEffect(() => {
    if (readyToComplete) onComplete();
  }, [readyToComplete, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-hidden"
      style={{ background: "#0C0C0C" }}
    >
      {phase < 2 && (
        <>
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, #0668BC 0%, #3794CF 30%, #077BC6 100%)",
              animation: "glitch-1 0.55s infinite steps(1)",
              opacity: phase === 0 ? 0.6 : 0.35,
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, #0668BC 0%, #3794CF 30%, #077BC6 100%)",
              animation: "glitch-1 0.5s 0.1s infinite steps(1) reverse",
              mixBlendMode: "difference",
              opacity: 0.15,
            }}
          />
        </>
      )}

      {/* Scanline */}
      <div
        className="absolute left-0 right-0 h-1 pointer-events-none"
        style={{
          background: "rgba(255,255,255,0.15)",
          animation: "scanline 1.5s linear infinite",
          boxShadow: "0 0 20px 5px rgba(255,255,255,0.05)",
        }}
      />

      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <motion.div
          className="text-center"
          animate={{
            opacity: [0, 1, 0.9, 1],
            scale: phase >= 2 ? [1, 1.05, 1] : 1,
          }}
          transition={{ duration: 0.5 }}
        >
          {phase === 0 && (
            <p
              className="font-pixel text-2xl sm:text-4xl drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]"
              style={{ color: "#A6CEE8", textShadow: "0 0 12px rgba(0,0,0,0.9), 0 2px 4px rgba(0,0,0,0.5)" }}
            >
              {"> Buscando detalhes da festa..."}
            </p>
          )}
          {phase === 1 && (
            <p
              className="font-pixel text-2xl sm:text-4xl drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]"
              style={{ color: "#A6CEE8", textShadow: "0 0 12px rgba(0,0,0,0.9), 0 2px 4px rgba(0,0,0,0.5)" }}
            >
              {"> Carregando endereço e horário..."}
            </p>
          )}

          {phase === 2 && (
            <motion.p
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="font-pixel text-2xl sm:text-4xl"
              style={{ color: "#CB8CC2" }}
            >
              {"> Preparando a página do convite..."}
            </motion.p>
          )}
          {phase === 3 && (
            <motion.div
              initial={{ opacity: 0.2, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={fontGlitchClass ?? "font-modern"}
            >
              <p
                className="text-3xl sm:text-5xl font-bold bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(to right, #CB8CC2, #CBBACE)',
                  ...(fontGlitchClass !== null
                    ? {
                        textShadow: `${Math.random() > 0.5 ? 2 : -2}px 0 rgba(55,148,207,0.6), ${Math.random() > 0.5 ? -2 : 2}px 0 rgba(203,140,194,0.6)`,
                      }
                    : {}),
                }}
              >
                Lembrem de confirmar a presença!
              </p>
            </motion.div>
          )}
          {phase === 4 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-modern"
            >
              <p className="text-3xl sm:text-5xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to right, #CB8CC2, #CBBACE)' }}>
                Preparados?
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Pontos de luz mágicos (só depois de 4s em "Preparados?" e se ainda não carregou) */}
      <InviteLightShow active={lightsActive} />
    </motion.div>
  );
}
