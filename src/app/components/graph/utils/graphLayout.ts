// src/app/components/graph/utils/graphLayout.ts

import type { Position } from "../types/graph";

// ─── Constants ────────────────────────────────────────────────────────────────

export const NODE_R = 22;
export const CELL   = 72;

// ─── Grid dimensions ──────────────────────────────────────────────────────────
// Determines SVG canvas size based on vertex count.

export function gridDims(n: number): { cols: number; rows: number; W: number; H: number } {
  let cols: number, rows: number;

  if (n <= 3)       { cols = 4; rows = 4; }
  else if (n <= 4)  { cols = 5; rows = 5; }
  else if (n <= 8)  { cols = 6; rows = 6; }
  else if (n <= 12) { cols = 8; rows = 7; }
  else {
    cols = Math.ceil(Math.sqrt(n)) + 3;
    rows = Math.max(cols - 1, cols);
  }

  return { cols, rows, W: cols * CELL, H: rows * CELL };
}

// ─── Static circular layout ───────────────────────────────────────────────────
// Places n vertices evenly around a circle centered in the SVG canvas.

export function staticLayout(
  vids: string[],
  W: number,
  H: number
): Map<string, Position> {
  const positions = new Map<string, Position>();
  const n = vids.length;
  if (n === 0) return positions;

  const margin = NODE_R + 20;

  if (n === 1) {
    positions.set(vids[0], { x: W / 2, y: H / 2 });
    return positions;
  }

  const radius = Math.min(W, H) / 2 - margin - 10;

  vids.forEach((id, i) => {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    positions.set(id, {
      x: W / 2 + radius * Math.cos(angle),
      y: H / 2 + radius * Math.sin(angle),
    });
  });

  return positions;
}

// ─── Static edge routing ──────────────────────────────────────────────────────
// Computes an SVG path (straight or quadratic bezier) between two node centers,
// offset for parallel/bidirectional edges, and returns the path string plus
// the midpoint for weight label placement.

export function staticRouteEdge(
  from: Position,
  to: Position,
  directed: boolean,
  hasBoth: boolean,
  isSmaller: boolean,
  laneIndex: number = 0
): { d: string; midX: number; midY: number } {
  const dx = to.x - from.x, dy = to.y - from.y;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  const ux = dx / dist, uy = dy / dist;
  const px = -uy,       py =  ux;
  const arrPad = directed ? 9 : 0;

  const sx = from.x + ux * NODE_R,          sy = from.y + uy * NODE_R;
  const ex = to.x   - ux * (NODE_R + arrPad), ey = to.y - uy * (NODE_R + arrPad);
  const mx = (sx + ex) / 2,                 my = (sy + ey) / 2;

  const baseOffset = hasBoth ? 38 : 18;
  const laneOffset = laneIndex === 0 ? 0 : baseOffset * laneIndex;
  const sign       = isSmaller ? 1 : -1;

  if (hasBoth || laneIndex !== 0) {
    const cpx = mx + px * laneOffset * sign;
    const cpy = my + py * laneOffset * sign;
    return {
      d: `M ${sx.toFixed(1)} ${sy.toFixed(1)} Q ${cpx.toFixed(1)} ${cpy.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`,
      midX: cpx,
      midY: cpy,
    };
  }

  return {
    d: `M ${sx.toFixed(1)} ${sy.toFixed(1)} L ${ex.toFixed(1)} ${ey.toFixed(1)}`,
    midX: mx,
    midY: my - 8,
  };
}
