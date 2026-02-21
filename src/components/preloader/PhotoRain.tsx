import { motion, AnimatePresence } from 'framer-motion';
import type { RainItem } from '@/components/shared/types';

interface PhotoRainProps {
  show: boolean;
  items: RainItem[];
}

export function PhotoRain({ show, items }: PhotoRainProps) {
  const THEME = {
    winHighlight: '#FFFFFF',
    winShadow: '#808080',
    winFace2: '#ECE9D8',
  };

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          key="rain"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 60,
            pointerEvents: 'none',
          }}
        >
          {items.map(it => (
            <motion.img
              key={it.id}
              src={it.src}
              alt=""
              aria-hidden="true"
              initial={{
                y: -120,
                x: 0,
                rotate: it.rotate,
                opacity: 0,
              }}
              animate={{
                y: '110vh',
                x: it.drift,
                rotate: it.rotate + (Math.random() > 0.5 ? 40 : -40),
                opacity: it.opacity,
              }}
              transition={{
                duration: it.duration,
                delay: it.delay,
                ease: 'easeIn',
              }}
              style={{
                position: 'absolute',
                top: 0,
                left: `${it.leftVw}vw`,
                width: it.size,
                height: it.size,
                objectFit: 'cover',
                borderRadius: 10,
                filter: `blur(${it.blur}px)`,
                boxShadow:
                  '0 10px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.25)',
                borderTop: `2px solid ${THEME.winHighlight}`,
                borderLeft: `2px solid ${THEME.winHighlight}`,
                borderRight: `2px solid ${THEME.winShadow}`,
                borderBottom: `2px solid ${THEME.winShadow}`,
                background: THEME.winFace2,
              }}
            />
          ))}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
