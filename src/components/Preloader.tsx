import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BevelBox } from "./shared/BevelBox";
import { GraduationCapIcon } from "./icons/GraduationCapIcon";
import { BalloonIcon } from "./icons/BalloonIcon";
import { PhotoRain } from "./preloader/PhotoRain";
import { ClassicTitleBarButton } from "./retro/ClassicTitleBarButton";
import { THEME } from "./shared/constants";
import type { RainItem } from "./shared/types";
import { assetUrl } from "@/lib/utils";

interface Props {
  onComplete: () => void;
}

const LOADER = {
  intervalMs: 180,
  completeDelayMs: 450,
};

const PHOTO_SOURCES = ["/photos/luiza/01.jpeg", "/photos/luiza/02.jpeg", "/photos/luiza/03.jpeg", "/photos/luiza/04.jpeg", "/photos/luiza/05.jpeg", "/photos/luiza/06.jpeg", "/photos/luiza/07.jpeg", "/photos/luiza/08.jpeg"].map(assetUrl);

const EASTER_EGG = {
  enabled: true,
  count: 28,
  durationMs: 1500,
};

function getStatusText(progress: number) {
  if (progress < 18) return "Conectando...";
  if (progress < 45) return "Buscando detalhes da festa...";
  if (progress < 72) return "Carregando endereço e horário...";
  if (progress < 92) return "Preparando a página do convite...";
  if (progress < 100) return "Finalizando...";
  return "Pronto!";
}

export default function Preloader({ onComplete }: Props) {
  const [progress, setProgress] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const [showRain, setShowRain] = useState(false);

  const statusText = useMemo(() => getStatusText(progress), [progress]);

  const rainItems = useMemo<RainItem[]>(() => {
    const safePhotos = PHOTO_SOURCES.length ? PHOTO_SOURCES : [assetUrl("/favicon.ico")];

    return Array.from({ length: EASTER_EGG.count }).map((_, i) => {
      const src = safePhotos[i % safePhotos.length];
      const leftVw = Math.random() * 100;
      const size = 54 + Math.random() * 56;
      const rotate = -18 + Math.random() * 36;
      const delay = Math.random() * 0.25;
      const duration = 0.9 + Math.random() * 0.9;
      const drift = -40 + Math.random() * 80;
      const blur = Math.random() * 0.6;
      const opacity = 0.85 + Math.random() * 0.15;

      return {
        id: `rain-${i}-${Math.random().toString(16).slice(2)}`,
        src,
        leftVw,
        size,
        rotate,
        delay,
        duration,
        drift,
        blur,
        opacity,
      };
    });
  }, []);

  useEffect(() => {
    let finished = false;

    if (isClosing) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (finished) return 100;

        let step: number;

        if (prev < 45) {
          step = Math.random() * 10 + 7;
        } else if (prev < 72) {
          step = Math.random() * 3 + 1;
        } else if (prev < 92) {
          step = Math.random() * 6 + 3;
        } else {
          step = Math.random() * 5 + 2;
        }

        const next = prev + step;

        if (next >= 100) {
          finished = true;
          clearInterval(interval);
          setTimeout(onComplete, LOADER.completeDelayMs);
          return 100;
        }

        return next;
      });
    }, LOADER.intervalMs);

    return () => clearInterval(interval);
  }, [onComplete, isClosing]);

  const safeProgress = Math.min(progress, 100);
  const progressLabel = `${Math.round(safeProgress)}%`;

  return (
    <motion.div
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{
        fontFamily: 'Tahoma, "MS Sans Serif", sans-serif',
        background: THEME.desktop,
      }}
    >
      <PhotoRain show={showRain} items={rainItems} />

      <motion.div
        initial={{ scale: 1, opacity: 1 }}
        animate={{
          scale: isClosing ? 0.96 : 1,
          opacity: isClosing ? 0.0 : 1,
          y: isClosing ? 6 : 0,
        }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        style={{ width: 520, maxWidth: "100%" }}
      >
        <BevelBox radius={8} style={{ width: "100%", maxWidth: "100%" }}>
          <div
            style={{
              background: THEME.titleBar,
              color: THEME.titleText,
              padding: "8px 10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 0.1,
              userSelect: "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 14,
                  height: 14,
                  background: THEME.winFace2,
                  borderTop: `1px solid ${THEME.winHighlight}`,
                  borderLeft: `1px solid ${THEME.winHighlight}`,
                  borderRight: `1px solid ${THEME.winShadow}`,
                  borderBottom: `1px solid ${THEME.winShadow}`,
                }}
              />
              Convite.exe
            </div>

            <div style={{ display: "flex", gap: 6 }}>
              {["_", "□"].map((label) => (
                <BevelBox
                  key={label}
                  radius={3}
                  style={{
                    width: 22,
                    height: 18,
                    display: "grid",
                    placeItems: "center",
                    background: THEME.winFace,
                    fontSize: 12,
                    lineHeight: 1,
                    padding: 0,
                    opacity: 0.9,
                  }}
                >
                  <span style={{ transform: "translateY(-1px)" }}>{label}</span>
                </BevelBox>
              ))}

              <button
                type="button"
                aria-label="Fechar"
                style={{
                  all: "unset",
                  cursor: "pointer",
                }}
              >
                <ClassicTitleBarButton label="✕" />
              </button>
            </div>
          </div>

          <div style={{ padding: 18 }}>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                >
                  <GraduationCapIcon />
                </motion.div>
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                >
                  <BalloonIcon />
                </motion.div>
              </div>

              <div style={{ flex: 1 }}>
                <div
                  style={{ fontSize: 13, fontWeight: 700, color: THEME.text }}
                >
                  Abrindo o convite…
                </div>
                <div
                  style={{ fontSize: 12, color: THEME.subText, marginTop: 4 }}
                >
                  {statusText}
                </div>

                <div style={{ marginTop: 12 }}>
                  <div
                    style={{
                      height: 18,
                      background: "#FFFFFF",
                      borderTop: `1px solid ${THEME.winShadow}`,
                      borderLeft: `1px solid ${THEME.winShadow}`,
                      borderRight: `1px solid ${THEME.winHighlight}`,
                      borderBottom: `1px solid ${THEME.winHighlight}`,
                      padding: 2,
                    }}
                  >
                    <div
                      style={{
                        width: `${safeProgress}%`,
                        height: "100%",
                        minWidth: safeProgress > 0 ? 6 : 0,
                        transition: "width 0.18s ease",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35)",
                        background: `
                          repeating-linear-gradient(
                            90deg,
                            rgba(255,255,255,0.00) 0px,
                            rgba(255,255,255,0.00) 10px,
                            rgba(255,255,255,0.18) 10px,
                            rgba(255,255,255,0.18) 12px
                          ),
                          linear-gradient(
                            180deg,
                            ${THEME.progress2} 0%,
                            ${THEME.progress1} 100%
                          )
                        `,
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: 6,
                      fontSize: 11,
                      color: THEME.subText,
                    }}
                  >
                    <span>Carregamento</span>
                    <span style={{ fontVariantNumeric: "tabular-nums" }}>
                      {progressLabel}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: 16,
                paddingTop: 10,
                borderTop: `1px solid ${THEME.winHighlight}`,
              }}
            >
              <div style={{ fontSize: 11, color: THEME.subText }}>
                Pode explorar a interface que tem algumas surpresas.
                <br />
                Só lembra de confirmar a presença, por favor. 🥹 🫶
              </div>
            </div>
          </div>
        </BevelBox>
      </motion.div>
    </motion.div>
  );
}
