import { useEffect, useMemo, useRef } from "react";

type LightParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  a: number;
  color: string;
  life: number;
  maxLife: number;
  bornAt: number;
};

const PALETTE = ["#CB8CC2", "#3794CF", "#077BC6", "#CBBACE", "#A6CEE8"] as const;

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

interface InviteLightShowProps {
  active: boolean;
}

export function InviteLightShow({ active }: InviteLightShowProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const particlesRef = useRef<LightParticle[]>([]);
  const t0Ref = useRef<number>(0);
  const lastRef = useRef<number>(0);
  const reduced = useMemo(() => prefersReducedMotion(), []);

  useEffect(() => {
    if (!active) return;
    if (reduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = clamp(window.devicePixelRatio || 1, 1, 2);
      const { innerWidth: w, innerHeight: h } = window;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    particlesRef.current = [];
    t0Ref.current = performance.now();
    lastRef.current = t0Ref.current;

    const spawnWander = (now: number, count: number) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      for (let i = 0; i < count; i++) {
        const r = rand(3.5, 7.5); // pontos maiores
        const sp = rand(8, 18); // movimento suave
        const ang = rand(0, Math.PI * 2);
        particlesRef.current.push({
          x: rand(0, w),
          y: rand(0, h),
          vx: Math.cos(ang) * sp,
          vy: Math.sin(ang) * sp,
          r,
          a: rand(0.12, 0.28), // mais "de fundo"
          color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
          life: 0,
          maxLife: rand(10, 22),
          bornAt: now,
        });
      }
    };

    // pre-seed
    spawnWander(t0Ref.current, 34);

    const tick = (now: number) => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      const dt = clamp((now - lastRef.current) / 1000, 0, 0.05);
      lastRef.current = now;

      // surgindo continuamente
      if (particlesRef.current.length < 70 && Math.random() < 0.16) spawnWander(now, 1);

      // trails
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(0,0,0,0.10)";
      ctx.fillRect(0, 0, w, h);

      // glow layer
      ctx.globalCompositeOperation = "lighter";

      // campo de fluxo suave (para "passear" sem concentrar no centro)
      const t = (now - t0Ref.current) / 1000;
      const freq = 0.0016;
      const curl = 18;

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        p.life += dt;
        const age = p.life / p.maxLife;
        const fadeIn = clamp(age * 6, 0, 1);
        const fadeOut = clamp((1 - age) * 2.2, 0, 1);
        const alpha = p.a * fadeIn * fadeOut;

        const ang =
          Math.sin((p.x + t * 120) * freq) +
          Math.cos((p.y - t * 110) * freq * 1.2) +
          Math.sin((p.x + p.y + t * 60) * freq * 0.8);
        const ax = Math.cos(ang) * curl;
        const ay = Math.sin(ang) * curl;

        p.vx += ax * dt;
        p.vy += ay * dt;
        p.vx *= 0.988;
        p.vy *= 0.988;
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        // wrap
        if (p.x < -30) p.x = w + 30;
        if (p.x > w + 30) p.x = -30;
        if (p.y < -30) p.y = h + 30;
        if (p.y > h + 30) p.y = -30;

        // draw (two-pass soft glow)
        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha * 0.18;
        ctx.arc(p.x, p.y, p.r * 2.9, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.globalAlpha = alpha;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        // recycle
        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
        }
      }

      ctx.globalAlpha = 1;
      rafRef.current = window.requestAnimationFrame(tick);
    };

    rafRef.current = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [active, reduced]);

  if (!active) return null;

  if (reduced) {
    return (
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 30% 40%, rgba(203,140,194,0.24), transparent 55%), radial-gradient(circle at 70% 60%, rgba(55,148,207,0.22), transparent 52%), radial-gradient(circle at 50% 20%, rgba(7,123,198,0.18), transparent 55%)",
          mixBlendMode: "screen",
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
      style={{
        mixBlendMode: "screen",
        filter: "blur(0.2px)",
      }}
    />
  );
}

