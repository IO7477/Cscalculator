import type { AngleMode } from './types';

export function toAngle(val: number, mode: AngleMode): number {
  return mode === 'DEG' ? (val * Math.PI) / 180 : val;
}

export function fromAngle(val: number, mode: AngleMode): number {
  return mode === 'DEG' ? (val * 180) / Math.PI : val;
}

export function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  if (n > 170) return Infinity;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

export function formatDisplay(val: string): string {
  if (val.length <= 14) return val;
  const n = parseFloat(val);
  if (isNaN(n)) return val.slice(0, 14);
  return n.toExponential(6);
}
