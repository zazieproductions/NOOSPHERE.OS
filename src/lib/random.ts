export const rand = (min: number, max: number) => Math.random() * (max - min) + min;
export const randInt = (min: number, max: number) => Math.floor(rand(min, max + 1));
export const choice = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
export const uid = () => Math.random().toString(36).slice(2, 10);

function hslToHex(h: number, s: number, l: number): string {
  const sN = s / 100;
  const lN = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = sN * Math.min(lN, 1 - lN);
  const f = (n: number) => lN - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = (x: number) => Math.round(255 * x).toString(16).padStart(2, '0');
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`.toUpperCase();
}

export function randomHueHex(sMin = 55, sMax = 92, lMin = 42, lMax = 66): string {
  return hslToHex(randInt(0, 360), randInt(sMin, sMax), randInt(lMin, lMax));
}

export function hexFromHue(h: number, s = 78, l = 55): string {
  return hslToHex(((h % 360) + 360) % 360, s, l);
}

export const NEON_PALETTE = [
  '#00FFF2', '#FF2BD6', '#FFB000', '#7CFF00', '#7C3AED',
  '#FF5252', '#00B8FF', '#F6FF00', '#FF7A00', '#3DFFC0',
];

export function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}
