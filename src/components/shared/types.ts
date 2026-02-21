// Shared types used across multiple components

export interface BubbleData {
  id: number;
  emoji: string;
  msg: string;
  color: string;
  popped: boolean;
}

export interface ExplosionParticle {
  id: string;
  emoji: string;
  x: number;
  y: number;
  angle: number;
  distance: number;
}

export interface PlacedSticker {
  id: number;
  emoji: string;
  x: number;
  y: number;
  rotation: number;
}

export interface RainItem {
  id: string;
  src: string;
  leftVw: number;
  size: number;
  rotate: number;
  delay: number;
  duration: number;
  drift: number;
  blur: number;
  opacity: number;
}
