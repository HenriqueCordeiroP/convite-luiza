import type { ConfettiParticle } from "../types";

export function launchConfettiRain() {
  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.inset = "0";
  canvas.style.zIndex = "9999";
  canvas.style.pointerEvents = "none";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    return;
  }

  const DPR = Math.max(1, Math.floor(window.devicePixelRatio || 1));
  const resize = () => {
    canvas.width = Math.floor(window.innerWidth * DPR);
    canvas.height = Math.floor(window.innerHeight * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  };
  resize();
  window.addEventListener("resize", resize);

  const colors = ["#CB8CC2", "#A6CEE8", "#3794CF", "#7BB1D9", "#0668BC"];
  const rand = (a: number, b: number) => a + Math.random() * (b - a);
  const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

  const particles: ConfettiParticle[] = [];

  const start = performance.now();
  const DURATION_MS = 3200;
  const GRAVITY = 1350;
  const WIND = 55;

  const spawnBurst = (count: number) => {
    const w = window.innerWidth;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: rand(0, w),
        y: rand(-60, -10),
        vx: rand(-200, 200) + WIND,
        vy: rand(200, 600),
        rot: rand(0, Math.PI * 2),
        vr: rand(-15, 15),
        size: rand(5, 12),
        life: 0,
        maxLife: rand(1800, 2600),
        shape: Math.random() < 0.85 ? "rect" : "circle",
        color: pick(colors),
      });
    }
  };

  let last = performance.now();

  const tick = (now: number) => {
    const dt = Math.min(0.033, (now - last) / 1000);
    last = now;
    const elapsed = now - start;

    if (elapsed < DURATION_MS) {
      spawnBurst(Math.floor(450 * dt));
      if (Math.random() < 0.15) spawnBurst(40);
    }

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.life += dt * 1000;
      p.vy += GRAVITY * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot += p.vr * dt;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;

      if (p.shape === "rect") {
        ctx.fillRect(-p.size, -p.size * 0.6, p.size * 2, p.size * 1.2);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      if (p.life >= p.maxLife || p.y > window.innerHeight + 150) {
        particles.splice(i, 1);
      }
    }

    if (elapsed < DURATION_MS + 2000 || particles.length > 0) {
      requestAnimationFrame(tick);
    } else {
      window.removeEventListener("resize", resize);
      canvas.remove();
    }
  };

  requestAnimationFrame(tick);
}
