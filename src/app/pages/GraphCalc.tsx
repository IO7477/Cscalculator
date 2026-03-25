// GraphCalc.tsx — Free-form physics + smart edge routing
// W3Schools References:
//   Graph Theory:        https://www.w3schools.com/dsa/dsa_theory_graphs.php
//   Implementation:      https://www.w3schools.com/dsa/dsa_data_graphs_implementation.php
//   Traversal (BFS/DFS): https://www.w3schools.com/dsa/dsa_algo_graphs_traversal.php
//   Cycle Detection:     https://www.w3schools.com/dsa/dsa_algo_graphs_cycledetection.php

import React, {
  useState, useRef, useEffect, useCallback, useMemo, useLayoutEffect,
} from "react";
import { useNavigate } from "react-router";
import {
  ChevronLeft, Moon, Sun, Plus, Trash2, Play, Pause,
  RotateCcw, Copy, Check, Share2, Table, List,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

// ─── Types ────────────────────────────────────────────────────────────────────

// SimNode lives in a ref — pixel coords, not grid cells
interface SimNode { x: number; y: number; vx: number; vy: number; pinned: boolean; }

interface Edge { from: string; to: string; weight: number; }

interface GraphConfig { directed: boolean; weighted: boolean; }

type AlgoType = "bfs" | "dfs" | "cycle";

interface AlgoResult {
  type: AlgoType;
  order?: string[];
  hasCycle?: boolean;
  cycleNodes?: string[];
  startVertex?: string;
}

// ─── Canvas / grid constants ──────────────────────────────────────────────────

const NODE_R = 22;
const CELL   = 72;   // grid cell size (visual reference only, no snapping)
const PAD    = NODE_R + 12;

// Grid grows with vertex count — purely visual, vertices float freely
function gridDims(n: number) {
  let cols: number, rows: number;
  if      (n <= 3)  { cols = 4; rows = 4; }
  else if (n <= 4)  { cols = 5; rows = 5; }
  else if (n <= 8)  { cols = 6; rows = 6; }
  else if (n <= 12) { cols = 8; rows = 7; }
  else              { cols = Math.ceil(Math.sqrt(n)) + 3; rows = Math.max(cols - 1, cols); }
  const W = cols * CELL, H = rows * CELL;
  return { cols, rows, W, H, cx: W / 2, cy: H / 2 };
}

// ─── Force simulation ─────────────────────────────────────────────────────────

const K_REP   = 9000;   // node-node repulsion
const K_SPR   = 0.042;  // spring attraction along edges
const K_GRAV  = 0.012;  // pull toward canvas center
const K_ISO   = 0.055;  // stronger pull for isolated (degree-0) nodes
const DAMP    = 0.76;
const MAX_V   = 8;
const REST_L  = 120;    // spring rest length (px)
const MIN_SEP = NODE_R * 2 + 8;

function tickSim(
  nodes: Map<string, SimNode>,
  edges: Edge[],
  W: number, H: number, cx: number, cy: number
): number {
  const verts = Array.from(nodes.values());
  // Degree map for isolated-node detection
  const deg = new Map<string, number>();
  for (const [id] of nodes) deg.set(id, 0);
  for (const e of edges) {
    if (e.from !== e.to) {
      deg.set(e.from, (deg.get(e.from) ?? 0) + 1);
      deg.set(e.to,   (deg.get(e.to)   ?? 0) + 1);
    }
  }

  // 1. Repulsion between all pairs
  for (let i = 0; i < verts.length; i++) {
    for (let j = i + 1; j < verts.length; j++) {
      const a = verts[i], b = verts[j];
      const dx = b.x - a.x, dy = b.y - a.y;
      const d2 = Math.max(dx * dx + dy * dy, 1);
      const d  = Math.sqrt(d2);
      const f  = K_REP / d2;
      const fx = (dx / d) * f, fy = (dy / d) * f;
      if (!a.pinned) { a.vx -= fx; a.vy -= fy; }
      if (!b.pinned) { b.vx += fx; b.vy += fy; }
    }
  }

  // 2. Spring along edges
  for (const e of edges) {
    if (e.from === e.to) continue;
    const a = nodes.get(e.from), b = nodes.get(e.to);
    if (!a || !b) continue;
    const dx = b.x - a.x, dy = b.y - a.y;
    const d  = Math.sqrt(dx * dx + dy * dy) || 1;
    const f  = K_SPR * (d - REST_L);
    const fx = (dx / d) * f, fy = (dy / d) * f;
    if (!a.pinned) { a.vx += fx; a.vy += fy; }
    if (!b.pinned) { b.vx -= fx; b.vy -= fy; }
  }

  // 3. Gravity + integrate + boundary
  let maxV = 0;
  for (const [id, v] of nodes) {
    if (v.pinned) continue;
    const g = (deg.get(id) ?? 0) === 0 ? K_ISO : K_GRAV;
    v.vx += g * (cx - v.x);
    v.vy += g * (cy - v.y);
    v.vx *= DAMP; v.vy *= DAMP;
    const spd = Math.sqrt(v.vx * v.vx + v.vy * v.vy);
    if (spd > MAX_V) { v.vx *= MAX_V / spd; v.vy *= MAX_V / spd; }
    v.x += v.vx; v.y += v.vy;
    v.x = Math.max(PAD, Math.min(W - PAD, v.x));
    v.y = Math.max(PAD, Math.min(H - PAD, v.y));
    maxV = Math.max(maxV, spd);
  }

  // 4. Hard separation — prevent overlap
  for (let i = 0; i < verts.length; i++) {
    for (let j = i + 1; j < verts.length; j++) {
      const a = verts[i], b = verts[j];
      const dx = b.x - a.x, dy = b.y - a.y;
      const d  = Math.sqrt(dx * dx + dy * dy) || 1;
      if (d < MIN_SEP) {
        const ov = (MIN_SEP - d) / 2;
        const ux = dx / d, uy = dy / d;
        if (!a.pinned) { a.x -= ux * ov; a.y -= uy * ov; }
        if (!b.pinned) { b.x += ux * ov; b.y += uy * ov; }
      }
    }
  }
  return maxV;
}

// ─── Edge routing ─────────────────────────────────────────────────────────────
// Each edge automatically decides: straight when clear, curved to avoid crossings.
// "from" and "to" are live pixel positions from the simulation.

interface RoutedEdge { edge: Edge; d: string; midX: number; midY: number; }

function segsCross(
  ax: number, ay: number, bx: number, by: number,
  cx: number, cy: number, dx: number, dy: number
): boolean {
  const det = (bx - ax) * (dy - cy) - (by - ay) * (dx - cx);
  if (Math.abs(det) < 1e-9) return false;
  const t = ((cx - ax) * (dy - cy) - (cy - ay) * (dx - cx)) / det;
  const u = ((cx - ax) * (by - ay) - (cy - ay) * (bx - ax)) / det;
  const ε = 0.05;
  return t > ε && t < 1 - ε && u > ε && u < 1 - ε;
}

// Sample quadratic bezier into N segments for intersection testing
function sampleQuad(
  sx: number, sy: number, cpx: number, cpy: number, ex: number, ey: number,
  n = 16
): Array<[number, number]> {
  const pts: Array<[number, number]> = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n, mt = 1 - t;
    pts.push([
      mt * mt * sx + 2 * mt * t * cpx + t * t * ex,
      mt * mt * sy + 2 * mt * t * cpy + t * t * ey,
    ]);
  }
  return pts;
}

function curvesCross(
  a: Array<[number, number]>,
  b: Array<[number, number]>
): boolean {
  for (let i = 0; i < a.length - 1; i++) {
    for (let j = 0; j < b.length - 1; j++) {
      if (segsCross(a[i][0], a[i][1], a[i+1][0], a[i+1][1],
                    b[j][0], b[j][1], b[j+1][0], b[j+1][1])) return true;
    }
  }
  return false;
}

// Build a stable hash for an edge key (consistent sign assignment)
function edgeHash(id1: string, id2: string): number {
  const key = [id1, id2].sort().join('\0');
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) & 0xffff;
  return h;
}

function routeEdges(
  edges: Edge[],
  nodes: Map<string, SimNode>,
  directed: boolean,
  W: number
): RoutedEdge[] {
  const routed: RoutedEdge[] = [];
  // Track sampled curves for intersection tests
  const sampledSoFar: Array<[string, string, Array<[number, number]>]> = [];

  for (const edge of edges) {
    const a = nodes.get(edge.from), b = nodes.get(edge.to);
    if (!a || !b) continue;

    // ── Self-loop ────────────────────────────────────────────────────────────
    if (edge.from === edge.to) {
      const lx = a.x, ly = a.y;
      routed.push({
        edge,
        d: `M ${lx - 10} ${ly - NODE_R} a 14 12 0 1 1 20 0`,
        midX: lx + 17,
        midY: ly - NODE_R - 14,
      });
      continue;
    }

    const dx = b.x - a.x, dy = b.y - a.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const ux = dx / dist, uy = dy / dist;
    const px = -uy, py = ux;   // perpendicular

    // Endpoint trim (node radius + arrow gap)
    const arrPad = directed ? 9 : 0;
    const sx = a.x + ux * NODE_R, sy = a.y + uy * NODE_R;
    const ex = b.x - ux * (NODE_R + arrPad), ey = b.y - uy * (NODE_R + arrPad);
    const mx = (sx + ex) / 2, my = (sy + ey) / 2;

    // Stable base sign so edges don't flip randomly each render
    const h = edgeHash(edge.from, edge.to);
    const baseSign = h & 1 ? 1 : -1;

    // Check if reverse edge exists (directed bidirectional — must separate)
    const hasReverse = directed && edges.some(e => e.from === edge.to && e.to === edge.from);

    // ── Attempt straight first (mag = 0), then increasingly curved ──────────
    // Curvature search: 0 means straight (used only if clear and no reverse)
    const mags = hasReverse
      ? [32, 50, 70, 95, 125, 160]        // always curve for bidirectional
      : [0, 22, 38, 56, 78, 104, 135, 170]; // try straight first

    let chosen: RoutedEdge | null = null;

    outer:
    for (const mag of mags) {
      for (const sign of [baseSign, -baseSign]) {
        const cpx = mx + px * mag * sign;
        const cpy = my + py * mag * sign;

        // For directed reverse pair, shift sign consistently
        const finalSign = hasReverse
          ? (edge.from < edge.to ? 1 : -1)
          : sign;
        const fcpx = mag === 0 ? mx : mx + px * mag * finalSign;
        const fcpy = mag === 0 ? my : my + py * mag * finalSign;

        // Build straight or quadratic path string
        const pathStr = mag === 0
          ? `M ${sx.toFixed(1)} ${sy.toFixed(1)} L ${ex.toFixed(1)} ${ey.toFixed(1)}`
          : `M ${sx.toFixed(1)} ${sy.toFixed(1)} Q ${fcpx.toFixed(1)} ${fcpy.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`;

        // Sample for intersection testing
        const sampled: Array<[number, number]> = mag === 0
          ? [[sx, sy], [ex, ey]]
          : sampleQuad(sx, sy, fcpx, fcpy, ex, ey);

        // Check against all previously routed edges
        let clear = true;
        for (const [prevFrom, prevTo, prevSampled] of sampledSoFar) {
          // Skip edges that share a vertex — they're always incident
          if (prevFrom === edge.from || prevFrom === edge.to ||
              prevTo   === edge.from || prevTo   === edge.to) continue;
          if (curvesCross(sampled, prevSampled)) { clear = false; break; }
        }

        if (clear) {
          const midX = mag === 0 ? mx : fcpx;
          const midY = mag === 0 ? my - 8 : fcpy - 5;
          chosen = { edge, d: pathStr, midX, midY };
          sampledSoFar.push([edge.from, edge.to, sampled]);
          break outer;
        }
        if (mag === 0) break; // only one try for straight (sign irrelevant)
      }
    }

    // Fallback: giant arc outside canvas
    if (!chosen) {
      const bigMag = W * 0.7;
      const fcpx = mx + px * bigMag * baseSign;
      const fcpy = my + py * bigMag * baseSign;
      const pathStr = `M ${sx.toFixed(1)} ${sy.toFixed(1)} Q ${fcpx.toFixed(1)} ${fcpy.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`;
      chosen = { edge, d: pathStr, midX: fcpx, midY: fcpy - 5 };
      sampledSoFar.push([edge.from, edge.to, sampleQuad(sx, sy, fcpx, fcpy, ex, ey)]);
    }

    routed.push(chosen);
  }
  return routed;
}

// ─── Graph algorithms (W3Schools) ─────────────────────────────────────────────

function buildAdj(vids: string[], edges: Edge[], directed: boolean) {
  const adj = new Map<string, string[]>();
  for (const v of vids) adj.set(v, []);
  for (const e of edges) {
    adj.get(e.from)?.push(e.to);
    if (!directed) adj.get(e.to)?.push(e.from);
  }
  return adj;
}

function bfs(adj: Map<string, string[]>, vids: string[], start: string) {
  const vis = new Set<string>(), order: string[] = [];
  for (const src of [start, ...vids.filter(v => v !== start)]) {
    if (vis.has(src)) continue;
    const q = [src]; vis.add(src);
    while (q.length) {
      const v = q.shift()!; order.push(v);
      for (const nb of adj.get(v) ?? []) if (!vis.has(nb)) { vis.add(nb); q.push(nb); }
    }
  }
  return order;
}

function dfs(adj: Map<string, string[]>, vids: string[], start: string) {
  const vis = new Set<string>(), order: string[] = [];
  const go = (v: string) => { vis.add(v); order.push(v); for (const nb of adj.get(v) ?? []) if (!vis.has(nb)) go(nb); };
  go(start);
  for (const v of vids) if (!vis.has(v)) go(v);
  return order;
}

function bfsCycleUndir(vids: string[], adj: Map<string, string[]>) {
  const vis = new Set<string>();
  for (const src of vids) {
    if (vis.has(src)) continue;
    const q: [string, string|null][] = [[src, null]]; vis.add(src);
    while (q.length) {
      const [v, par] = q.shift()!;
      for (const nb of adj.get(v) ?? []) {
        if (!vis.has(nb)) { vis.add(nb); q.push([nb, v]); }
        else if (nb !== par) return { hasCycle: true, cycleNodes: [v, nb] };
      }
    }
  }
  return { hasCycle: false, cycleNodes: [] as string[] };
}

function bfsCycleDir(vids: string[], adj: Map<string, string[]>) {
  const inDeg = new Map(vids.map(v => [v, 0]));
  for (const v of vids) for (const nb of adj.get(v) ?? []) inDeg.set(nb, (inDeg.get(nb) ?? 0) + 1);
  const q = vids.filter(v => inDeg.get(v) === 0); let proc = 0;
  while (q.length) {
    const v = q.shift()!; proc++;
    for (const nb of adj.get(v) ?? []) {
      const d = (inDeg.get(nb) ?? 1) - 1; inDeg.set(nb, d);
      if (d === 0) q.push(nb);
    }
  }
  return { hasCycle: proc < vids.length, cycleNodes: vids.filter(v => (inDeg.get(v) ?? 0) > 0) };
}

// ─── Grid background (graphing paper, no snap) ────────────────────────────────

function GridBg({ W, H, isDark }: { W: number; H: number; isDark: boolean }) {
  const lineClr = isDark ? "rgba(255,255,255,0.045)" : "rgba(30,50,120,0.065)";
  const dotClr  = isDark ? "rgba(255,255,255,0.16)"  : "rgba(30,50,120,0.18)";
  const els: React.ReactNode[] = [];
  for (let x = 0; x <= W; x += CELL) els.push(<line key={`v${x}`} x1={x} y1={0} x2={x} y2={H} stroke={lineClr} strokeWidth={0.6}/>);
  for (let y = 0; y <= H; y += CELL) els.push(<line key={`h${y}`} x1={0} y1={y} x2={W} y2={y} stroke={lineClr} strokeWidth={0.6}/>);
  for (let x = 0; x <= W; x += CELL)
    for (let y = 0; y <= H; y += CELL)
      els.push(<circle key={`d${x},${y}`} cx={x} cy={y} r={1.5} fill={dotClr}/>);
  return <g>{els}</g>;
}

// ─── Arrow defs ────────────────────────────────────────────────────────────────

function Defs({ ec }: { ec: string }) {
  return (
    <defs>
      <marker id="arr"      markerWidth="9" markerHeight="9" refX="7" refY="3.5" orient="auto"><path d="M0,0 L0,7 L9,3.5 z" fill={ec}/></marker>
      <marker id="arr-vis"  markerWidth="9" markerHeight="9" refX="7" refY="3.5" orient="auto"><path d="M0,0 L0,7 L9,3.5 z" fill="#facc15"/></marker>
      <marker id="arr-cyc"  markerWidth="9" markerHeight="9" refX="7" refY="3.5" orient="auto"><path d="M0,0 L0,7 L9,3.5 z" fill="#ef4444"/></marker>
    </defs>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function GraphCalculator() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  // ── Graph data (logical, no positions) ──────────────────────────────────────
  const [vertexIds, setVertexIds] = useState<string[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [config, setConfig] = useState<GraphConfig>({ directed: false, weighted: false });

  // ── UI state ─────────────────────────────────────────────────────────────────
  const [vInput,  setVInput]  = useState("");
  const [eFr,     setEFr]     = useState("");
  const [eTo,     setETo]     = useState("");
  const [eWt,     setEWt]     = useState("1");
  const [error,   setError]   = useState<string|null>(null);
  const [selV,    setSelV]    = useState("");
  const [showMat, setShowMat] = useState(false);
  const [copied,  setCopied]  = useState(false);

  // ── Algorithm state ───────────────────────────────────────────────────────────
  const [algo,    setAlgo]    = useState<AlgoResult|null>(null);
  const [step,    setStep]    = useState(-1);
  const [playing, setPlaying] = useState(false);
  const playTimer = useRef<ReturnType<typeof setInterval>|null>(null);

  // ── Physics simulation (lives entirely in refs — no React state) ─────────────
  const simRef = useRef<Map<string, SimNode>>(new Map());
  const [renderTick, setRenderTick] = useState(0);  // bumped to trigger re-render
  const rafRef  = useRef<number>(0);
  const dragRef = useRef<{ id: string; rect: DOMRect } | null>(null);
  const svgWrapRef = useRef<HTMLDivElement>(null);

  // Canvas dimensions (visual only — vertices are NOT constrained to grid)
  const { W, H, cx, cy, cols, rows } = useMemo(
    () => gridDims(vertexIds.length),
    [vertexIds.length]
  );

  // ── Init / sync sim when vertex list changes ──────────────────────────────────
  useEffect(() => {
    const sim = simRef.current;
    // Remove deleted
    for (const k of sim.keys()) if (!vertexIds.includes(k)) sim.delete(k);
    // Add new — spawn near canvas center with jitter, NOT on grid intersections
    for (const id of vertexIds) {
      if (sim.has(id)) continue;
      const angle = Math.random() * Math.PI * 2;
      const r     = Math.min(W, H) * 0.25 * (0.5 + Math.random() * 0.5);
      sim.set(id, {
        x: cx + r * Math.cos(angle) + (Math.random() - 0.5) * 20,
        y: cy + r * Math.sin(angle) + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        pinned: false,
      });
    }
    kickSim();
  }, [vertexIds, W, H, cx, cy]);

  useEffect(() => {
    // Re-kick when edges change (spring forces change)
    for (const v of simRef.current.values()) {
      v.vx += (Math.random() - 0.5) * 3;
      v.vy += (Math.random() - 0.5) * 3;
    }
    kickSim();
  }, [edges.length]);

  function kickSim() {
    cancelAnimationFrame(rafRef.current);
    let warm = 60;
    function tick() {
      const steps = warm-- > 0 ? 5 : 2;
      let mv = 0;
      for (let s = 0; s < steps; s++) mv = tickSim(simRef.current, edges, W, H, cx, cy);
      setRenderTick(t => t + 1);
      if (mv > 0.07) rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
  }

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  // Sync ref positions into state snapshot each tick (for rendering)
  const [snapshots, setSnapshots] = useState<Map<string, {x:number;y:number}>>(new Map());
  useLayoutEffect(() => {
    const s = new Map<string, {x:number;y:number}>();
    for (const [id, n] of simRef.current) s.set(id, { x: n.x, y: n.y });
    setSnapshots(new Map(s));
  }, [renderTick]);

  // ── Drag — FREE FORM, no grid snapping ───────────────────────────────────────
  const onPtrDown = useCallback((id: string, e: React.PointerEvent) => {
    e.stopPropagation();
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    if (!svgWrapRef.current) return;
    dragRef.current = { id, rect: svgWrapRef.current.getBoundingClientRect() };
    const node = simRef.current.get(id);
    if (node) { node.pinned = true; node.vx = 0; node.vy = 0; }
  }, []);

  const onPtrMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const { id, rect } = dragRef.current;
    const node = simRef.current.get(id);
    if (!node) return;
    // Map pointer to SVG space — no rounding, no snapping
    const scaleX = W / rect.width, scaleY = H / rect.height;
    node.x = Math.max(PAD, Math.min(W - PAD, (e.clientX - rect.left) * scaleX));
    node.y = Math.max(PAD, Math.min(H - PAD, (e.clientY - rect.top)  * scaleY));
    node.vx = 0; node.vy = 0;
    setRenderTick(t => t + 1);
  }, [W, H]);

  const onPtrUp = useCallback(() => {
    if (!dragRef.current) return;
    const node = simRef.current.get(dragRef.current.id);
    if (node) { node.pinned = false; node.vx = 0; node.vy = 0; }
    dragRef.current = null;
    kickSim();
  }, [edges]);

  // ── Edge routing (recomputed from live positions each render) ─────────────────
  const routed = useMemo(() => {
    // Build a position map from the latest snapshot
    const posMap = new Map<string, SimNode>();
    for (const [id, pos] of snapshots) {
      const node = simRef.current.get(id);
      posMap.set(id, node ?? { x: pos.x, y: pos.y, vx: 0, vy: 0, pinned: false });
    }
    return routeEdges(edges, posMap, config.directed, W);
  }, [snapshots, edges, config.directed, W]);

  // ── Graph operations ───────────────────────────────────────────────────────────
  const addVertices = useCallback(() => {
    const tokens = vInput.split(/[\s,;]+/).map(s => s.trim()).filter(Boolean);
    if (!tokens.length) return;
    const existing = new Set(vertexIds);
    const dupes = tokens.filter(t => existing.has(t));
    const fresh = tokens.filter(t => !existing.has(t));
    if (!fresh.length) { setError(`Already exists: ${dupes.join(", ")}`); return; }
    setError(dupes.length ? `Skipped: ${dupes.join(", ")}` : null);
    setVertexIds(prev => [...prev, ...fresh]);
    setVInput("");
  }, [vInput, vertexIds]);

  const removeVertex = useCallback((id: string) => {
    simRef.current.delete(id);
    setVertexIds(prev => prev.filter(v => v !== id));
    setEdges(prev => prev.filter(e => e.from !== id && e.to !== id));
    if (selV === id) setSelV("");
    setAlgo(null); setStep(-1);
  }, [selV]);

  const addEdge = useCallback(() => {
    const f = eFr.trim(), t = eTo.trim();
    if (!f || !t) { setError("Select both vertices"); return; }
    const vset = new Set(vertexIds);
    if (!vset.has(f) || !vset.has(t)) { setError("Vertex not found"); return; }
    const dup = edges.some(e =>
      (e.from === f && e.to === t) ||
      (!config.directed && e.from === t && e.to === f)
    );
    if (dup) { setError(`Edge ${f}${config.directed?"→":"—"}${t} already exists`); return; }
    setError(null);
    setEdges(prev => [...prev, { from: f, to: t, weight: Number(eWt) || 1 }]);
    setAlgo(null); setStep(-1);
  }, [eFr, eTo, eWt, vertexIds, edges, config.directed]);

  const removeEdge = useCallback((from: string, to: string) => {
    setEdges(prev => prev.filter(e => !(e.from === from && e.to === to)));
    setAlgo(null); setStep(-1);
  }, []);

  // ── Algorithms ─────────────────────────────────────────────────────────────────
  const adj = useMemo(
    () => buildAdj(vertexIds, edges, config.directed),
    [vertexIds, edges, config.directed]
  );

  const runAlgo = useCallback((type: AlgoType) => {
    if (!vertexIds.length) return;
    if (playTimer.current) clearInterval(playTimer.current);
    setPlaying(false); setStep(-1);
    const start = selV || vertexIds[0];
    if (type === "bfs")   setAlgo({ type, order: bfs(adj, vertexIds, start), startVertex: start });
    else if (type === "dfs") setAlgo({ type, order: dfs(adj, vertexIds, start), startVertex: start });
    else {
      const res = config.directed ? bfsCycleDir(vertexIds, adj) : bfsCycleUndir(vertexIds, adj);
      setAlgo({ type: "cycle", ...res });
    }
  }, [vertexIds, adj, selV, config.directed]);

  const playAlgo = useCallback(() => {
    if (!algo?.order?.length) return;
    setStep(0); setPlaying(true); let s = 0;
    playTimer.current = setInterval(() => {
      s++;
      if (s >= (algo.order?.length ?? 0)) {
        clearInterval(playTimer.current!); setPlaying(false);
        setStep((algo.order?.length ?? 1) - 1);
      } else setStep(s);
    }, 650);
  }, [algo]);

  const stopAlgo = useCallback(() => {
    if (playTimer.current) clearInterval(playTimer.current);
    setPlaying(false);
  }, []);

  const clearAll = useCallback(() => {
    simRef.current.clear();
    setVertexIds([]); setEdges([]); setSelV(""); setAlgo(null); setStep(-1);
    if (playTimer.current) clearInterval(playTimer.current);
    setPlaying(false);
  }, []);

  // ── Copy ─────────────────────────────────────────────────────────────────────
  const copyAll = useCallback(async () => {
    const lines = [
      `Graph (${config.directed?"Directed":"Undirected"}${config.weighted?", Weighted":""})`,
      `Vertices: ${vertexIds.join(", ")}`,
      `Edges: ${edges.map(e=>config.weighted?`${e.from}→${e.to}(${e.weight})`:`${e.from}→${e.to}`).join(", ")}`,
      "", "Adjacency List:",
      ...vertexIds.map(v=>`  ${v}: [${adj.get(v)?.join(", ") || "—"}]`),
    ];
    if (algo) {
      lines.push("");
      if (algo.type !== "cycle") lines.push(`${algo.type.toUpperCase()} from ${algo.startVertex}: ${algo.order?.join(" → ")}`);
      else lines.push(`Cycle (BFS): ${algo.hasCycle ? `YES — ${algo.cycleNodes?.join(", ")}` : "No cycle"}`);
    }
    await navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  }, [vertexIds, edges, config, adj, algo]);

  // ── Adjacency matrix ──────────────────────────────────────────────────────────
  const adjMat = useMemo(() => {
    const idx = new Map(vertexIds.map((v,i) => [v,i]));
    const n = vertexIds.length;
    const mat: (number|null)[][] = Array.from({length:n}, ()=>Array(n).fill(null));
    for (const e of edges) {
      const i = idx.get(e.from), j = idx.get(e.to);
      if (i==null||j==null) continue;
      mat[i][j] = config.weighted ? e.weight : 1;
      if (!config.directed) mat[j][i] = config.weighted ? e.weight : 1;
    }
    return mat;
  }, [vertexIds, edges, config]);

  // ── Presets ───────────────────────────────────────────────────────────────────
  const applyPreset = useCallback((p: {
    vids: string[]; edgs: [string,string][]; directed: boolean; weighted: boolean; weights?: number[];
  }) => {
    simRef.current.clear();
    setVertexIds(p.vids);
    setEdges(p.edgs.map(([from,to],i)=>({ from, to, weight: p.weights?.[i] ?? 1 })));
    setConfig({ directed: p.directed, weighted: p.weighted });
    setAlgo(null); setStep(-1); setSelV(p.vids[0] ?? "");
  }, []);

  // ── Display helpers ────────────────────────────────────────────────────────────
  const visitedSet = useMemo(() => new Set(algo?.order?.slice(0, step + 1) ?? []), [algo, step]);
  const cycleSet   = useMemo(() => new Set(algo?.cycleNodes ?? []), [algo]);
  const ec = isDark ? "#4b5563" : "#9ca3af";

  const nodeFill   = (id:string) => {
    if (algo?.type === "cycle" && cycleSet.has(id)) return "#ef4444";
    if (visitedSet.has(id)) return "#facc15";
    if (id === selV) return "#3b82f6";
    return isDark ? "#1f2937" : "#e5e7eb";
  };
  const nodeStroke = (id:string) => id === selV ? "#3b82f6" : isDark ? "#374151" : "#d1d5db";
  const nodeText   = (id:string) => {
    if (algo?.type === "cycle" && cycleSet.has(id)) return "#fff";
    if (visitedSet.has(id)) return "#1f2937";
    if (id === selV) return "#fff";
    return isDark ? "#f9fafb" : "#1f2937";
  };

  const edgeStroke = (e: Edge) => {
    if (algo?.type === "cycle" && cycleSet.has(e.from) && cycleSet.has(e.to)) return "#ef4444";
    if (visitedSet.has(e.from) && visitedSet.has(e.to)) return "#facc15";
    return ec;
  };
  const edgeMarker = (e: Edge) => {
    if (!config.directed) return undefined;
    if (algo?.type === "cycle" && cycleSet.has(e.from) && cycleSet.has(e.to)) return "url(#arr-cyc)";
    if (visitedSet.has(e.from) && visitedSet.has(e.to)) return "url(#arr-vis)";
    return "url(#arr)";
  };

  const presets = [
    { label:"Simple cycle",   directed:false, weighted:false, vids:["A","B","C","D"],         edgs:[["A","B"],["B","C"],["C","D"],["D","A"]] as [string,string][] },
    { label:"Directed DAG",   directed:true,  weighted:false, vids:["A","B","C","D","E"],     edgs:[["A","B"],["A","C"],["B","D"],["C","D"],["D","E"]] as [string,string][] },
    { label:"Weighted",       directed:false, weighted:true,  vids:["A","B","C","D","E"],     edgs:[["A","B"],["A","C"],["B","C"],["B","D"],["C","E"],["D","E"]] as [string,string][], weights:[4,2,1,5,8,2] },
    { label:"Directed cycle", directed:true,  weighted:false, vids:["A","B","C","D"],         edgs:[["A","B"],["B","C"],["C","D"],["D","B"]] as [string,string][] },
    { label:"Disconnected",   directed:false, weighted:false, vids:["A","B","C","D","E","F"], edgs:[["A","B"],["B","C"],["D","E"]] as [string,string][] },
  ];

  // ─────────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1419] pb-28">

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-b-3xl shadow-sm">
        <div className="px-4 pt-4 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/")}
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all">
              <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300"/>
            </button>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Toolbox</p>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Graph Calculator</h1>
            </div>
          </div>
          <button onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
            {isDark ? <Moon className="w-4 h-4 text-gray-300"/> : <Sun className="w-4 h-4 text-yellow-500"/>}
          </button>
        </div>
      </div>

      {/* Graph type toggles */}
      <div className="px-4 mt-4 flex gap-2">
        <button
          onClick={() => { setConfig(c => ({...c, directed: !c.directed})); setEdges([]); setAlgo(null); }}
          className={`flex-1 py-2.5 rounded-full text-sm font-bold transition-all ${config.directed ? "bg-indigo-600 text-white" : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"}`}>
          {config.directed ? "Directed" : "Undirected"}
        </button>
        <button
          onClick={() => setConfig(c => ({...c, weighted: !c.weighted}))}
          className={`flex-1 py-2.5 rounded-full text-sm font-bold transition-all ${config.weighted ? "bg-amber-500 text-white" : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"}`}>
          {config.weighted ? "Weighted" : "Unweighted"}
        </button>
      </div>
      <p className="text-[10px] text-center text-gray-400 dark:text-gray-600 mt-1.5">
        Grid {cols}×{rows} reference · vertices float freely · edges auto-route
      </p>

      {/* Build card */}
      <div className="px-4 mt-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">

          {/* Add vertices */}
          <div className="px-4 pt-4 pb-3 border-b border-gray-100 dark:border-gray-700">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">Add Vertices</p>
            <div className="flex gap-2">
              <div className={`flex-1 rounded-xl bg-gray-50 dark:bg-[#131820] border px-3 py-2.5 ${error ? "border-red-400" : "border-gray-200 dark:border-gray-700 focus-within:border-blue-500"}`}>
                <input type="text" value={vInput}
                  onChange={e => { setVInput(e.target.value); setError(null); }}
                  onKeyDown={e => e.key === "Enter" && addVertices()}
                  placeholder="A, B, C  or  A B C"
                  className="w-full bg-transparent text-sm font-mono text-gray-900 dark:text-white outline-none placeholder:text-gray-400 dark:placeholder:text-gray-600"/>
              </div>
              <button onClick={addVertices} disabled={!vInput.trim()}
                className={`flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${vInput.trim() ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed"}`}>
                <Plus className="w-4 h-4"/> Add
              </button>
            </div>
            {error && <p className="text-[10px] text-red-500 mt-1.5">⚠ {error}</p>}
            {vertexIds.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {vertexIds.map(id => (
                  <span key={id} onClick={() => setSelV(s => s === id ? "" : id)}
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold cursor-pointer transition-all ${id === selV ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/30"}`}>
                    {id}
                    <button onClick={e => { e.stopPropagation(); removeVertex(id); }} className="opacity-50 hover:opacity-100 ml-0.5">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Add edges */}
          <div className="px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">Add Edge</p>
            <div className="flex gap-2 items-center">
              <select value={eFr} onChange={e => setEFr(e.target.value)}
                className="flex-1 bg-gray-50 dark:bg-[#131820] border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm font-mono text-gray-900 dark:text-white outline-none">
                <option value="">From</option>
                {vertexIds.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
              <span className="text-gray-400 text-xs font-bold">{config.directed ? "→" : "—"}</span>
              <select value={eTo} onChange={e => setETo(e.target.value)}
                className="flex-1 bg-gray-50 dark:bg-[#131820] border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm font-mono text-gray-900 dark:text-white outline-none">
                <option value="">To</option>
                {vertexIds.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
              {config.weighted && (
                <input type="number" value={eWt} onChange={e => setEWt(e.target.value)}
                  className="w-14 bg-gray-50 dark:bg-[#131820] border border-gray-200 dark:border-gray-700 rounded-xl px-2 py-2.5 text-sm font-mono text-center text-gray-900 dark:text-white outline-none"
                  placeholder="w"/>
              )}
              <button onClick={addEdge} disabled={!eFr || !eTo}
                className={`flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${eFr && eTo ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed"}`}>
                <Plus className="w-4 h-4"/>
              </button>
            </div>
            {edges.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {edges.map((e, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    {e.from}{config.directed?"→":"—"}{e.to}{config.weighted?`(${e.weight})`:""}
                    <button onClick={() => removeEdge(e.from, e.to)} className="opacity-50 hover:opacity-100 ml-0.5">
                      <Trash2 className="w-2.5 h-2.5"/>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Visualization */}
      <div className="px-4 mt-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Graph Visualization</h3>
              <p className="text-[10px] text-gray-400 dark:text-gray-600 mt-0.5">
                {vertexIds.length > 0
                  ? `${vertexIds.length}V ${edges.length}E · Drag to reposition freely · Edges auto-route`
                  : "Add vertices to begin"}
              </p>
            </div>
            {vertexIds.length > 0 && (
              <button onClick={clearAll}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-500 transition-all">
                <RotateCcw className="w-3 h-3"/> Clear
              </button>
            )}
          </div>

          <div ref={svgWrapRef}
            className="flex justify-center overflow-x-auto"
            style={{ background: isDark ? "#0a0e14" : "#f9fafb" }}>
            {vertexIds.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 gap-3">
                <Share2 className="w-10 h-10 text-gray-300 dark:text-gray-700"/>
                <p className="text-sm text-gray-400 dark:text-gray-600">No vertices yet</p>
              </div>
            ) : (
              <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}
                style={{ width: "100%", maxWidth: W, touchAction: "none", overflow: "visible" }}
                onPointerMove={onPtrMove}
                onPointerUp={onPtrUp}
                onPointerLeave={onPtrUp}>
                <Defs ec={ec}/>
                {/* Grid reference — purely visual, no snapping logic */}
                <GridBg W={W} H={H} isDark={isDark}/>

                {/* Edges — auto-routed: straight when clear, curved to avoid crossings */}
                {routed.map((re, i) => {
                  const stroke = edgeStroke(re.edge);
                  const marker = edgeMarker(re.edge);
                  return (
                    <g key={i}>
                      <path d={re.d} fill="none" stroke={stroke} strokeWidth={1.6} markerEnd={marker}/>
                      {config.weighted && re.edge.from !== re.edge.to && (
                        <g>
                          <rect x={re.midX - 11} y={re.midY - 7} width={22} height={13} rx={3}
                            fill={isDark ? "#0f172a" : "#f8fafc"} fillOpacity={0.9}/>
                          <text x={re.midX} y={re.midY + 2} textAnchor="middle"
                            fontSize={9} fontFamily="ui-monospace, monospace"
                            fill={isDark ? "#94a3b8" : "#64748b"}>{re.edge.weight}</text>
                        </g>
                      )}
                    </g>
                  );
                })}

                {/* Vertices — positions from physics sim, free-form */}
                {vertexIds.map(id => {
                  const pos = snapshots.get(id);
                  if (!pos) return null;
                  const lbl = id.length > 3 ? id.slice(0, 3) : id;
                  return (
                    <g key={id} style={{ cursor: "grab" }}
                      onPointerDown={e => { e.stopPropagation(); onPtrDown(id, e); }}
                      onClick={() => setSelV(s => s === id ? "" : id)}>
                      {id === selV && (
                        <circle cx={pos.x} cy={pos.y} r={NODE_R + 5}
                          fill="none" stroke="#3b82f6" strokeWidth={2} opacity={0.3}/>
                      )}
                      <circle cx={pos.x} cy={pos.y} r={NODE_R}
                        fill={nodeFill(id)} stroke={nodeStroke(id)}
                        strokeWidth={id === selV ? 2 : 1.5}/>
                      <text x={pos.x} y={pos.y} textAnchor="middle" dy="0.35em"
                        fill={nodeText(id)} fontSize={lbl.length > 1 ? 11 : 13}
                        fontWeight="700" fontFamily="ui-monospace, monospace"
                        style={{ pointerEvents: "none", userSelect: "none" }}>
                        {lbl}
                      </text>
                    </g>
                  );
                })}
              </svg>
            )}
          </div>

          {vertexIds.length > 0 && (
            <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-4">
              {[["#3b82f6","Selected"],["#facc15","Visited"],["#ef4444","Cycle"]].map(([col,lbl]) => (
                <div key={lbl} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{background:col}}/>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">{lbl}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Algorithms */}
      <div className="px-4 mt-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Algorithms</h3>
            <p className="text-[10px] text-gray-400 dark:text-gray-600 mt-0.5">
              {selV ? `Start: ${selV}` : "Tap a vertex to set start · BFS cycle detection"}
            </p>
          </div>
          <div className="px-4 py-3 grid grid-cols-3 gap-2">
            {[
              {label:"BFS",       type:"bfs"   as AlgoType, cls:"bg-blue-600 hover:bg-blue-700"},
              {label:"DFS",       type:"dfs"   as AlgoType, cls:"bg-purple-600 hover:bg-purple-700"},
              {label:"Cycle(BFS)",type:"cycle" as AlgoType, cls:"bg-rose-600 hover:bg-rose-700"},
            ].map(({label,type,cls}) => (
              <button key={type} onClick={() => runAlgo(type)} disabled={!vertexIds.length}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all ${vertexIds.length ? `${cls} text-white active:scale-[0.97]` : "bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed"}`}>
                {label}
              </button>
            ))}
          </div>

          {algo && (
            <div className="border-t border-gray-100 dark:border-gray-700 px-4 py-3">
              {algo.type !== "cycle" && algo.order && (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-xs font-semibold text-gray-900 dark:text-white">
                        {algo.type.toUpperCase()} from <span className="font-mono text-blue-500">{algo.startVertex}</span>
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {algo.type === "bfs" ? "Queue · level-order" : "Recursive · depth-first"}
                      </p>
                    </div>
                    <button onClick={playing ? stopAlgo : playAlgo}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${playing ? "bg-amber-500 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200"}`}>
                      {playing ? <Pause className="w-3 h-3"/> : <Play className="w-3 h-3"/>}
                      {playing ? "Pause" : "Play"}
                    </button>
                  </div>
                  <input type="range" min={-1} max={algo.order.length - 1} value={step}
                    onChange={e => { stopAlgo(); setStep(Number(e.target.value)); }}
                    className="w-full h-1.5 rounded-full accent-blue-600 mb-3"/>
                  <div className="flex flex-wrap gap-1.5">
                    {algo.order.map((v,i) => (
                      <span key={i} className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-mono font-semibold transition-all ${i <= step ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 ring-1 ring-yellow-300/50" : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"}`}>
                        <span className="text-[9px] opacity-50">{i+1}.</span>{v}
                      </span>
                    ))}
                  </div>
                </>
              )}
              {algo.type === "cycle" && (
                <div className={`rounded-xl p-3 ${algo.hasCycle ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800" : "bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800"}`}>
                  <p className={`text-sm font-bold ${algo.hasCycle ? "text-red-700 dark:text-red-300" : "text-emerald-700 dark:text-emerald-300"}`}>
                    {algo.hasCycle ? "⚠ Cycle Detected" : "✓ No Cycle Found"}
                  </p>
                  <p className="text-[10px] mt-1 text-gray-500 dark:text-gray-400 font-mono">
                    {config.directed ? "Kahn's BFS — unprocessed nodes = cycle" : "BFS parent tracking — back edge = cycle"}
                  </p>
                  {algo.hasCycle && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {algo.cycleNodes!.map(v => (
                        <span key={v} className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">{v}</span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Adjacency list / matrix */}
      {vertexIds.length > 0 && (
        <div className="px-4 mt-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                {showMat ? "Adjacency Matrix" : "Adjacency List"}
              </h3>
              <div className="flex gap-1">
                {[{icon:<List className="w-3.5 h-3.5"/>, val:false},{icon:<Table className="w-3.5 h-3.5"/>, val:true}].map(({icon,val})=>(
                  <button key={String(val)} onClick={()=>setShowMat(val)}
                    className={`p-2 rounded-lg transition-all ${showMat===val?"bg-indigo-600 text-white":"bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"}`}>
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            {!showMat ? (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {vertexIds.map(v => (
                  <div key={v} className="flex items-center gap-3 px-4 py-2.5">
                    <span className="w-8 text-center font-mono font-bold text-sm text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 rounded-lg py-1">{v}</span>
                    <span className="text-gray-400 text-xs">→</span>
                    <div className="flex flex-wrap gap-1 flex-1">
                      {(adj.get(v) ?? []).length > 0
                        ? (adj.get(v) ?? []).map((nb,i)=>(
                            <span key={i} className="px-2 py-0.5 rounded-md text-xs font-mono font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                              {nb}{config.weighted ? `(${edges.find(e=>e.from===v&&e.to===nb)?.weight??""})` : ""}
                            </span>
                          ))
                        : <span className="text-xs text-gray-400 italic">no edges</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-3 overflow-x-auto">
                <table className="text-xs font-mono border-collapse">
                  <thead>
                    <tr>
                      <td className="w-8 h-8"/>
                      {vertexIds.map(v=><th key={v} className="w-8 h-8 text-center font-bold text-gray-700 dark:text-gray-300">{v}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {adjMat.map((row,i)=>(
                      <tr key={i}>
                        <td className="w-8 h-8 text-center font-bold text-gray-700 dark:text-gray-300 pr-1">{vertexIds[i]}</td>
                        {row.map((cell,j)=>(
                          <td key={j} className={`w-8 h-8 text-center border border-gray-200 dark:border-gray-700 ${cell!==null?"bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold":"bg-gray-50 dark:bg-gray-900 text-gray-300 dark:text-gray-700"}`}>
                            {cell!==null?cell:"0"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-[10px] text-gray-400 mt-2 font-mono">
                  Row=from · Col=to · {config.directed?"Asymmetric":"Symmetric"}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Presets */}
      <div className="px-4 mt-4">
        <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Quick Presets</p>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {presets.map(p=>(
            <button key={p.label} onClick={()=>applyPreset(p)}
              className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-4"/>

      {/* Bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 rounded-t-3xl shadow-lg z-10">
        <div className="flex items-center justify-between px-4 py-4">
          <button onClick={clearAll} className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            Clear All
          </button>
          <button onClick={copyAll} disabled={!vertexIds.length}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all ${vertexIds.length ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm" : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"}`}>
            {copied ? <><Check className="w-4 h-4"/> Copied!</> : <><Copy className="w-4 h-4"/> Copy All</>}
          </button>
        </div>
      </div>
    </div>
  );
}
