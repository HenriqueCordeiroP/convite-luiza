export type Track = {
  id: string;
  title: string;
  src: string;
  tagline: string;
  /** Começar a partir deste segundo (ex: 8 = 0:08). Opcional. */
  startAt?: number;
};

export type ConfettiParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  size: number;
  life: number;
  maxLife: number;
  shape: "rect" | "circle";
  color: string;
};

export type CommandContext = {
  addLine: (html: string) => void;
  setLines: (fn: (prev: string[]) => string[]) => void;
  escapeHtml: (text: string) => string;
  onBackToRetro: () => void;
};
