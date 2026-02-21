import { motion, AnimatePresence } from "framer-motion";
import Timeline from "./Timeline";
import MapSection from "./MapSection";
import { useEffect, useState, useRef, useCallback } from "react";
import { ConfettiOverlay } from "./modern/ConfettiOverlay";
import { RsvpSection } from "./modern/RsvpSection";
import { MarqueeStrip } from "./modern/MarqueeStrip";
import { SecretConsole } from "./modern/SecretConsole";
import { PixelArt } from "./modern/PixelArt";
import { Hero } from "./modern/Hero";
import { MobileDecorationsSection } from "./modern/MobileDecorationsSection";
import { Footer } from "./modern/Footer";
import { MessagesSection } from "./modern/MessagesSection";
import { PhotoCarousel } from "./modern/PhotoCarousel";
import { TOTAL_EGGS } from "./shared/constants";

interface ModernSectionProps {
  /** Go back to retro interface (through the loader) */
  onBackToRetro?: () => void;
}

export default function ModernSection({ onBackToRetro }: ModernSectionProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [rsvpVersion, setRsvpVersion] = useState(0);

  const launchConfetti = useCallback(() => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4500);
  }, []);

  const handleRsvpConfirm = useCallback(() => {
    launchConfetti();
    setRsvpVersion((v) => v + 1);
  }, [launchConfetti]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen relative dark modern-section-bg"
      style={{
        background:
          "linear-gradient(180deg, #050d18 0%, #06122A 20%, #071c35 50%, #06122A 80%, #050d18 100%)",
        color: "#f0f6fc",
        paddingTop: "env(safe-area-inset-top, 0px)",
      }}
    >
      {showConfetti && <ConfettiOverlay />}

      <Hero />

      <RsvpSection onConfirm={handleRsvpConfirm} />
      <MobileDecorationsSection placement="top" />

      <MapSection />

      <MessagesSection rsvpVersion={rsvpVersion} />

      <MarqueeStrip />

      <Timeline />

      <MobileDecorationsSection placement="bottom" />

      <SecretConsole onBackToRetro={onBackToRetro} />

      <MobileDecorationsSection placement="middle" />

      <PixelArt />

      <PhotoCarousel />

      <Footer />
    </motion.div>
  );
}
