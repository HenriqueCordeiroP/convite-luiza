import { useState, useEffect, useRef, useCallback } from "react";

const PHOTOS = [
  "/photos/meninas/01.jpeg",
  "/photos/meninas/02.jpeg",
  "/photos/meninas/03.jpeg",
  "/photos/meninas/04.jpeg",
  "/photos/meninas/05.jpeg",
  "/photos/meninas/06.jpeg",
  "/photos/meninas/07.jpeg",
  "/photos/meninas/08.jpeg",
  "/photos/meninas/09.jpeg",
  "/photos/meninas/10.jpeg",
  "/photos/meninas/11.jpeg",
  "/photos/meninas/12.jpeg",
  "/photos/meninas/13.jpeg",
  "/photos/meninas/14.jpeg",
  "/photos/meninas/15.jpeg",
  "/photos/meninas/16.jpeg",
  "/photos/meninas/17.jpeg",
  "/photos/meninas/18.jpeg",
  "/photos/meninas/19.jpeg",
  "/photos/meninas/20.jpeg",
  "/photos/meninas/21.jpeg",
  "/photos/meninas/22.jpeg",
  "/photos/meninas/23.jpeg",
  "/photos/meninas/24.jpeg",
  "/photos/meninas/25.jpeg",
  "/photos/meninas/26.jpeg",
  "/photos/meninas/27.jpeg",
  "/photos/meninas/28.jpeg",
  "/photos/meninas/29.jpeg",
];

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

function FloatingPhoto({ src, onDone }) {
  const ref = useRef(null);
  const raf = useRef(null);
  const start = useRef(null);
  const loaded = useRef(false);

  const baseW = useRef(
    window.innerWidth < 640 ? randomBetween(90, 130) : randomBetween(140, 220),
  );

  const config = useRef({
    startX: randomBetween(2, 80),
    startY: randomBetween(-10, 90),
    driftX: randomBetween(-6, 6),
    driftY: randomBetween(12, 25),
    rotation: randomBetween(-5, 5),
    rotationDrift: randomBetween(-3, 3),
    lifetime: randomBetween(9000, 15000),
    fadeIn: 2500,
    fadeOut: 3000,
    scale: randomBetween(0.85, 1.1),
  });

  const animate = useCallback(
    (timestamp) => {
      if (!loaded.current) {
        raf.current = requestAnimationFrame(animate);
        return;
      }

      if (!start.current) start.current = timestamp;
      const elapsed = timestamp - start.current;
      const c = config.current;
      const progress = elapsed / c.lifetime;

      if (progress >= 1) {
        onDone();
        return;
      }

      let opacity;
      if (elapsed < c.fadeIn) {
        opacity = elapsed / c.fadeIn;
      } else if (elapsed > c.lifetime - c.fadeOut) {
        opacity = (c.lifetime - elapsed) / c.fadeOut;
      } else {
        opacity = 1;
      }
      opacity = Math.max(0, Math.min(1, opacity)) * 0.95;

      const x = c.startX + c.driftX * progress;
      const y = c.startY + c.driftY * progress;
      const rot = c.rotation + c.rotationDrift * progress;

      if (ref.current) {
        ref.current.style.opacity = opacity;
        ref.current.style.transform = `translate(${x}vw, ${y}vh) rotate(${rot}deg) scale(${c.scale})`;
      }

      raf.current = requestAnimationFrame(animate);
    },
    [onDone],
  );

  useEffect(() => {
    raf.current = requestAnimationFrame(animate);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [animate]);

  const handleLoad = useCallback(() => {
    loaded.current = true;
  }, []);

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        opacity: 0,
        willChange: "transform, opacity",
        pointerEvents: "none",
      }}
    >
      <img
        src={src}
        alt=""
        onLoad={handleLoad}
        style={{
          width: baseW.current,
          height: "auto",
          borderRadius: 5,
          display: "block",
          boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
        }}
      />
    </div>
  );
}

export default function MeninasGallery() {
  const [items, setItems] = useState([]);
  const nextId = useRef(0);
  const spawnIndex = useRef(0);

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }, []);

  useEffect(() => {
    const initialTimers = [];
    for (let i = 0; i < 8; i++) {
      initialTimers.push(
        setTimeout(() => {
          const src = PHOTOS[spawnIndex.current % PHOTOS.length];
          spawnIndex.current++;
          const id = nextId.current++;
          setItems((prev) => [...prev, { id, src }]);
        }, i * 150),
      );
    }

    const interval = setInterval(() => {
      const src = PHOTOS[spawnIndex.current % PHOTOS.length];
      spawnIndex.current++;
      const id = nextId.current++;
      setItems((prev) => {
        const trimmed = prev.length > 20 ? prev.slice(-16) : prev;
        return [...trimmed, { id, src }];
      });
    }, 700);

    return () => {
      initialTimers.forEach(clearTimeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background:
          "linear-gradient(180deg, hsl(230,25%,7%) 0%, hsl(250,30%,10%) 50%, hsl(230,25%,7%) 100%)",
        color: "hsl(210,40%,98%)",
        overflow: "hidden",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap"
        rel="stylesheet"
      />

      {/* Photos */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
        {items.map((item) => (
          <FloatingPhoto
            key={item.id}
            src={item.src}
            onDone={() => removeItem(item.id)}
          />
        ))}
      </div>

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at center, transparent 30%, #08080a 85%)",
        }}
      />

      {/* Bottom whisper */}
      <div
        style={{
          position: "absolute",
          bottom: 32,
          left: 0,
          right: 0,
          zIndex: 3,
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        <p
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 13,
            fontStyle: "italic",
            color: "rgba(255,255,255,0.1)",
            letterSpacing: 1,
          }}
        >
          momentos
        </p>
      </div>
    </div>
  );
}
