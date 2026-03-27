// src/app/components/graph/GridBg.tsx

import React from "react";

const CELL = 72;

interface GridBgProps {
  W: number;
  H: number;
  isDark: boolean;
}

export function GridBg({ W, H, isDark }: GridBgProps) {
  const lineClr = isDark ? "rgba(255,255,255,0.045)" : "rgba(30,50,120,0.065)";
  const dotClr  = isDark ? "rgba(255,255,255,0.16)"  : "rgba(30,50,120,0.18)";

  const els: React.ReactNode[] = [];

  // Vertical lines
  for (let x = 0; x <= W; x += CELL) {
    els.push(
      <line
        key={`v${x}`}
        x1={x} y1={0}
        x2={x} y2={H}
        stroke={lineClr}
        strokeWidth={0.6}
      />
    );
  }

  // Horizontal lines
  for (let y = 0; y <= H; y += CELL) {
    els.push(
      <line
        key={`h${y}`}
        x1={0} y1={y}
        x2={W} y2={y}
        stroke={lineClr}
        strokeWidth={0.6}
      />
    );
  }

  // Intersection dots
  for (let x = 0; x <= W; x += CELL) {
    for (let y = 0; y <= H; y += CELL) {
      els.push(
        <circle
          key={`d${x},${y}`}
          cx={x} cy={y}
          r={1.5}
          fill={dotClr}
        />
      );
    }
  }

  return <g>{els}</g>;
}
