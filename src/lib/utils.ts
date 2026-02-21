import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const BASE = import.meta.env.BASE_URL;

/** Prepend Vite's base URL to a public-folder asset path. */
export function assetUrl(path: string): string {
  const clean = path.startsWith("/") ? path.slice(1) : path;
  return `${BASE}${clean}`;
}
