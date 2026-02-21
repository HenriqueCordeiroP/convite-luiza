import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";

import Preloader from "@/components/Preloader";
import RetroDesktop from "@/components/RetroDesktop";
import GlitchTransition from "@/components/GlitchTransition";
import ModernSection from "@/components/ModernSection";
import LearnMore from "@/components/LearnMore";

type Phase = "loading" | "retro" | "learnMore" | "transition" | "modern";

const Index = () => {
  const [phase, setPhase] = useState<Phase>("transition");

  useEffect(() => {
    if (phase === "modern") {
      document.documentElement.classList.add("dark");
      document.body.style.background = "#050d18";
      return () => {
        document.documentElement.classList.remove("dark");
        document.body.style.background = "";
      };
    }
  }, [phase]);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <AnimatePresence mode="wait">
        {phase === "loading" && (
          <Preloader key="preloader" onComplete={() => setPhase("retro")} />
        )}

        {phase === "retro" && (
          <RetroDesktop
            key="retro"
            onEvolve={() => setPhase("transition")}
            onBackToLoader={() => setPhase("loading")}
            onLearnMore={() => setPhase("learnMore")}
            learnMoreHref="/convite" // opcional (se você tiver rota)
          />
        )}

        {phase === "learnMore" && (
          <LearnMore
            key="learnMore"
            onBack={() => setPhase("retro")}
            // opcional: se quiser permitir evoluir direto daqui também
            // onEvolve={() => setPhase('transition')}
          />
        )}

        {phase === "transition" && (
          <GlitchTransition
            key="transition"
            onComplete={() => setPhase("modern")}
          />
        )}

        {phase === "modern" && (
          <ModernSection
            key="modern"
            onBackToRetro={() => setPhase("loading")}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
