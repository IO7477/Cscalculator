// GraphCalc.tsx — Brand new, built from scratch
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

interface Vertex {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  pinned: boolean;
}

interface Edge {
  from: string;
  to: string;
  weight: number;
}

type EdgeStyle = "auto" | "straight" | "curved" | "arc";

interface GraphConfig {
  directed: boolean;
  weighted: boolean;
  edgeStyle: EdgeStyle;
}

type AlgoType = "bfs" | "dfs" | "cycle";

interface AlgoResult {
  type: AlgoType;
  order?: string[];
  hasCycle?: boolean;
  cycleNodes?: string[];
  startVertex?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const NODE_R = 22;
const MIN_DIST = NODE_R * 2 + 14;
const CELL = 72;

// ─── Grid sizing: procedurally expands as vertices grow ──────────────────────
// V<=3 → 4×4 | V<=4 → 5×5 | V<=8 → 6×6 | V<=12 → 8×7 | V>12 → sqrt scale

function computeGrid(n: number) {
  let cols: number, rows: number;
  if (n <= 3)       { cols = 4;  rows = 4; }
  else if (n <= 4)  { cols = 5;  rows = 5; }
  else if (n <= 8)  { cols = 6;  rows = 6; }
  else if (n <= 12) { cols = 8;  rows = 7; }
  else              { cols = Math.ceil(Math.sqrt(n)) + 3; rows = cols - 1; }
  const W = cols * CELL;
  const H = rows * CELL;
  return { cols, rows, W, H, cx: W / 2, cy: H / 2 };
}

// ─── BFS Traversal ───────────────────────────────────────────────────────────
// https://www.w3schools.com/dsa/dsa_algo_graphs_traversal.php

function bfs(adj: Map<string, string[]>, vertices: string[], start: string): string[] {
  const visited = new Set<string>();
  const order: string[] = [];
  const queue = [start];
  visited.add(start);
  while (queue.length) {
    const v = queue.shift()!;
    order.push(v);
    for (const nb of adj.get(v) ?? []) {
      if (!visited.has(nb)) { visited.add(nb); queue.push(nb); }
    }
  }
  for (const v of vertices) {
    if (!visited.has(v)) {
      visited.add(v); queue.push(v);
      while (queue.length) {
        const u = queue.shift()!;
        order.push(u);
        for (const nb of adj.get(u) ?? []) {
          if (!visited.has(nb)) { visited.add(nb); queue.push(nb); }
        }
      }
    }
  }
  return order;
}

// ─── DFS Traversal ───────────────────────────────────────────────────────────
// https://www.w3schools.com/dsa/dsa_algo_graphs_traversal.php

function dfs(adj: Map<string, string[]>, vertices: string[], start: string): string[] {
  const visited = new Set<string>();
  const order: string[] = [];
  function go(v: string) {
    visited.add(v); order.push(v);
    for (const nb of adj.get(v) ?? []) { if (!visited.has(nb)) go(nb); }
  }
  go(start);
  for (const v of vertices) { if (!visited.has(v)) go(v); }
  return order;
}

// ─── BFS Cycle Detection — Undirected ────────────────────────────────────────
// https://www.w3schools.com/dsa/dsa_algo_graphs_cycledetection.php
// Tracks parent; a visited neighbour that isn't parent = back-edge = cycle

function bfsCycleUndirected(adj: Map<string, string[]>, vertices: string[]) {
  const visited = new Set<string>();
  for (const src of vertices) {
    if (visited.has(src)) continue;
    const queue: [string, string | null][] = [[src, null]];
    visited.add(src);
    while (queue.length) {
      const [v, parent] = queue.shift()!;
      for (const nb of adj.get(v) ?? []) {
        if (!visited.has(nb)) { visited.add(nb); queue.push([nb, v]); }
        else if (nb !== parent) return { hasCycle: true, cycleNodes: [v, nb] };
      }
    }
  }
  return { hasCycle: false, cycleNodes: [] as string[] };
}

// ─── BFS Cycle Detection — Directed (Kahn's algorithm) ──────────────────────
// https://www.w3schools.com/dsa/dsa_algo_graphs_cycledetection.php
// Nodes with remaining in-degree after BFS = part of cycle

function bfsCycleDirected(adj: Map<string, string[]>, vertices: string[]) {
  const inDeg = new Map(vertices.map(v => [v, 0]));
  for (const v of vertices) for (const nb of adj.get(v) ?? []) inDeg.set(nb, (inDeg.get(nb) ?? 0) + 1);
  const queue = vertices.filter(v => inDeg.get(v) === 0);
  let processed = 0;
  while (queue.length) {
    const v = queue.shift()!; processed++;
    for (const nb of adj.get(v) ?? []) {
      const d = (inDeg.get(nb) ?? 1) - 1; inDeg.set(nb, d);
      if (d === 0) queue.push(nb);
    }
  }
  const cycleNodes = vertices.filter(v => (inDeg.get(v) ?? 0) > 0);
  return { hasCycle: processed < vertices.length, cycleNodes };
}

// ─── Build adjacency list ────────────────────────────────────────────────────
// https://www.w3schools.com/dsa/dsa_data_graphs_implementation.php

function buildAdj(vertices: string[], edges: Edge[], directed: boolean) {
  const adj = new Map<string, string[]>();
  for (const v of vertices) adj.set(v, []);
  for (const e of edges) {
    adj.get(e.from)?.push(e.to);
    if (!directed) adj.get(e.to)?.push(e.from);
  }
  return adj;
}

// ─── Build adjacency matrix ───────────────────────────────────────────────────
// https://www.w3schools.com/dsa/dsa_data_graphs_implementation.php

function buildMatrix(vertices: string[], edges: Edge[], directed: boolean, weighted: boolean) {
  const idx = new Map(vertices.map((v, i) => [v, i]));
  const n = vertices.length;
  const mat: (number | null)[][] = Array.from({ length: n }, () => Array(n).fill(null));
  for (const e of edges) {
    const i = idx.get(e.from)!, j = idx.get(e.to)!;
    mat[i][j] = weighted ? e.weight : 1;
    if (!directed) mat[j][i] = weighted ? e.weight : 1;
  }
  return mat;
}

// ─── Segment intersection ────────────────────────────────────────────────────

function segmentsIntersect(
  ax: number, ay: number, bx: number, by: number,
  cx: number, cy: number, dx: number, dy: number
) {
  const d = (bx - ax) * (dy - cy) - (by - ay) * (dx - cx);
  if (Math.abs(d) < 1e-9) return false;
  const t = ((cx - ax) * (dy - cy) - (cy - ay) * (dx - cx)) / d;
  const u = ((cx - ax) * (by - ay) - (cy - ay) * (bx - ax)) / d;
  const eps = 0.05;
  return t > eps && t < 1 - eps && u > eps && u < 1 - eps;
}

// ─── Determine edge path style ───────────────────────────────────────────────
// "auto" = straight if no crossing detected, curved if crossing, arc if parallel reverse edge

function computeEdgePath(
  from: Vertex, to: Vertex,
  allEdges: Edge[], allVerts: Map<string, Vertex>,
  config: GraphConfig,
  edgeIndex: number
): string {
  const fx = from.x, fy = from.y, tx = to.x, ty = to.y;
  const dx = tx - fx, dy = ty - fy;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  const ux = dx / dist, uy = dy / dist;
  const sx = fx + ux * NODE_R, sy = fy + uy * NODE_R;
  const ex = tx - ux * (NODE_R + (config.directed ? 9 : 0));
  const ey = ty - uy * (NODE_R + (config.directed ? 9 : 0));

  // Self-loop
  if (from.id === to.id) {
    const r = NODE_R + 12;
    return `M ${fx} ${fy - NODE_R} C ${fx + r} ${fy - r}, ${fx + r} ${fy + r}, ${fx} ${fy + NODE_R}`;
  }

  const style = config.edgeStyle;

  // Check if reverse edge exists (for directed graphs → arc apart)
  const hasReverse = config.directed &&
    allEdges.some(e => e.from === to.id && e.to === from.id);

  // Check for parallel edges (multiple edges between same pair)
  const parallelEdges = allEdges.filter(e =>
    (e.from === from.id && e.to === to.id) ||
    (!config.directed && e.from === to.id && e.to === from.id)
  );
  const parallelIdx = parallelEdges.findIndex((_, i) => i === edgeIndex % parallelEdges.length);

  // Check if this straight segment would cross another edge
  let wouldCross = false;
  if (style === "auto" || style === "straight") {
    for (const e of allEdges) {
      if (e.from === from.id || e.to === from.id || e.from === to.id || e.to === to.id) continue;
      const va = allVerts.get(e.from), vb = allVerts.get(e.to);
      if (!va || !vb) continue;
      if (segmentsIntersect(sx, sy, ex, ey, va.x, va.y, vb.x, vb.y)) {
        wouldCross = true; break;
      }
    }
  }

  const perpX = -uy, perpY = ux;

  // Straight
  if (style === "straight" && !hasReverse && parallelEdges.length <= 1) {
    return `M ${sx} ${sy} L ${ex} ${ey}`;
  }

  // Arc (reverse pair or forced arc)
  if (style === "arc" || hasReverse) {
    const bend = hasReverse ? 36 : 28;
    const sign = hasReverse ? (from.id < to.id ? 1 : -1) : (parallelIdx % 2 === 0 ? 1 : -1);
    const cpx = (sx + ex) / 2 + perpX * bend * sign;
    const cpy = (sy + ey) / 2 + perpY * bend * sign;
    return `M ${sx} ${sy} Q ${cpx} ${cpy} ${ex} ${ey}`;
  }

  // Curved (auto when crossing detected, or parallel edges)
  if (style === "curved" || wouldCross || parallelEdges.length > 1) {
    const sign = parallelIdx % 2 === 0 ? 1 : -1;
    const magnitude = 30 + parallelIdx * 14;
    const cpx = (sx + ex) / 2 + perpX * magnitude * sign;
    const cpy = (sy + ey) / 2 + perpY * magnitude * sign;
    return `M ${sx} ${sy} Q ${cpx} ${cpy} ${ex} ${ey}`;
  }

  // Default: straight
  return `M ${sx} ${sy} L ${ex} ${ey}`;
}

// ─── Force simulation ────────────────────────────────────────────────────────

const K_REP = 11000;
const K_SPR = 0.038;
const K_GRAV = 0.014;
const K_GRAV0 = 0.06;
const DAMP = 0.74;
const MAX_V = 9;
const REST_L = 115;

function simulateStep(
  verts: Vertex[], edges: Edge[],
  W: number, H: number, cx: number, cy: number
): number {
  const deg = new Map(verts.map(v => [v.id, 0]));
  for (const e of edges) {
    if (e.from !== e.to) {
      deg.set(e.from, (deg.get(e.from) ?? 0) + 1);
      deg.set(e.to, (deg.get(e.to) ?? 0) + 1);
    }
  }
  // Repulsion
  for (let i = 0; i < verts.length; i++) {
    for (let j = i + 1; j < verts.length; j++) {
      const a = verts[i], b = verts[j];
      const ddx = b.x - a.x, ddy = b.y - a.y;
      const d2 = Math.max(ddx * ddx + ddy * ddy, 1);
      const d = Math.sqrt(d2);
      const f = K_REP / d2;
      const fx = (ddx / d) * f, fy = (ddy / d) * f;
      if (!a.pinned) { a.vx -= fx; a.vy -= fy; }
      if (!b.pinned) { b.vx += fx; b.vy += fy; }
    }
  }
  // Spring
  const vm = new Map(verts.map(v => [v.id, v]));
  for (const e of edges) {
    if (e.from === e.to) continue;
    const a = vm.get(e.from)!, b = vm.get(e.to)!;
    if (!a || !b) continue;
    const ddx = b.x - a.x, ddy = b.y - a.y;
    const d = Math.sqrt(ddx * ddx + ddy * ddy) || 1;
    const f = K_SPR * (d - REST_L);
    const fx = (ddx / d) * f, fy = (ddy / d) * f;
    if (!a.pinned) { a.vx += fx; a.vy += fy; }
    if (!b.pinned) { b.vx -= fx; b.vy -= fy; }
  }
  // Gravity + separation
  let maxV = 0;
  const PAD = NODE_R + 10;
  for (const v of verts) {
    if (v.pinned) continue;
    const g = (deg.get(v.id) ?? 0) === 0 ? K_GRAV0 : K_GRAV;
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
  // Min separation enforcement
  for (let i = 0; i < verts.length; i++) {
    for (let j = i + 1; j < verts.length; j++) {
      const a = verts[i], b = verts[j];
      const ddx = b.x - a.x, ddy = b.y - a.y;
      const d = Math.sqrt(ddx * ddx + ddy * ddy) || 1;
      if (d < MIN_DIST) {
        const ov = (MIN_DIST - d) / 2;
        const ux2 = ddx / d, uy2 = ddy / d;
        if (!a.pinned) { a.x -= ux2 * ov; a.y -= uy2 * ov; }
        if (!b.pinned) { b.x += ux2 * ov; b.y += uy2 * ov; }
      }
    }
  }
  return maxV;
}

// ─── Grid SVG background ─────────────────────────────────────────────────────

function GridBg({ W, H, isDark }: { W: number; H: number; isDark: boolean }) {
  const col = isDark ? "rgba(255,255,255,0.055)" : "rgba(0,0,0,0.07)";
  const lines: React.ReactNode[] = [];
  for (let x = 0; x <= W; x += CELL)
    lines.push(<line key={`v${x}`} x1={x} y1={0} x2={x} y2={H} stroke={col} strokeWidth={1} />);
  for (let y = 0; y <= H; y += CELL)
    lines.push(<line key={`h${y}`} x1={0} y1={y} x2={W} y2={y} stroke={col} strokeWidth={1} />);
  return <g>{lines}</g>;
}

// ─── Arrow marker defs ────────────────────────────────────────────────────────

function Defs({ isDark, cycleColor }: { isDark: boolean; cycleColor: string }) {
  const ec = isDark ? "#6b7280" : "#9ca3af";
  return (
    <defs>
      <marker id="arrow" markerWidth="9" markerHeight="9" refX="7" refY="3.5" orient="auto">
        <path d="M0,0 L0,7 L9,3.5 z" fill={ec} />
      </marker>
      <marker id="arrow-cycle" markerWidth="9" markerHeight="9" refX="7" refY="3.5" orient="auto">
        <path d="M0,0 L0,7 L9,3.5 z" fill={cycleColor} />
      </marker>
      <marker id="arrow-visit" markerWidth="9" markerHeight="9" refX="7" refY="3.5" orient="auto">
        <path d="M0,0 L0,7 L9,3.5 z" fill="#facc15" />
      </marker>
    </defs>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function GraphCalculator() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  // Graph data
  const [vertices, setVertices] = useState<Vertex[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [config, setConfig] = useState<GraphConfig>({
    directed: false, weighted: false, edgeStyle: "auto",
  });

  // UI state
  const [vertexInput, setVertexInput] = useState("");
  const [edgeFrom, setEdgeFrom] = useState("");
  const [edgeTo, setEdgeTo] = useState("");
  const [edgeWeight, setEdgeWeight] = useState("1");
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string>("");
  const [showMatrix, setShowMatrix] = useState(false);
  const [copied, setCopied] = useState(false);

  // Algorithm state
  const [algoResult, setAlgoResult] = useState<AlgoResult | null>(null);
  const [step, setStep] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const playTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Simulation
  const simRef = useRef<Vertex[]>([]);
  const [tick, setTick] = useState(0);
  const rafRef = useRef<number>(0);
  const dragRef = useRef<{ id: string; rect: DOMRect } | null>(null);
  const svgWrapRef = useRef<HTMLDivElement>(null);

  const { W, H, cx, cy } = useMemo(() => computeGrid(vertices.length), [vertices.length]);

  // Sync simRef with vertices
  useEffect(() => {
    const existing = new Map(simRef.current.map(v => [v.id, v]));
    const newSim: Vertex[] = vertices.map((v, i) => {
      if (existing.has(v.id)) return existing.get(v.id)!;
      const angle = (2 * Math.PI * i) / Math.max(vertices.length, 1) - Math.PI / 2;
      const r = Math.min(W, H) * 0.27;
      return {
        id: v.id,
        x: cx + r * Math.cos(angle) + (Math.random() - 0.5) * 10,
        y: cy + r * Math.sin(angle) + (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        pinned: false,
      };
    });
    simRef.current = newSim;
    setVertices(newSim.map(v => ({ ...v })));
    kickSim();
  }, [vertices.length, W, H]);

  useEffect(() => { kickSim(); }, [edges.length]);

  function kickSim() {
    cancelAnimationFrame(rafRef.current);
    let warm = 50;
    function tickFn() {
      const steps = warm-- > 0 ? 5 : 2;
      let mv = 0;
      for (let s = 0; s < steps; s++)
        mv = simulateStep(simRef.current, edges, W, H, cx, cy);
      setTick(t => t + 1);
      if (mv > 0.08) rafRef.current = requestAnimationFrame(tickFn);
    }
    rafRef.current = requestAnimationFrame(tickFn);
  }

  useEffect(() => () => { cancelAnimationFrame(rafRef.current); }, []);

  // Sync simRef positions → vertices for render
  useLayoutEffect(() => {
    setVertices(simRef.current.map(v => ({ ...v })));
  }, [tick]);

  // Drag handlers
  const onDragStart = useCallback((id: string, e: React.PointerEvent) => {
    if (!svgWrapRef.current) return;
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    dragRef.current = { id, rect: svgWrapRef.current.getBoundingClientRect() };
    const node = simRef.current.find(v => v.id === id);
    if (node) { node.pinned = true; node.vx = 0; node.vy = 0; }
  }, []);

  const onDragMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const { id, rect } = dragRef.current;
    const node = simRef.current.find(v => v.id === id);
    if (!node) return;
    const scaleX = W / rect.width, scaleY = H / rect.height;
    const PAD = NODE_R + 10;
    node.x = Math.max(PAD, Math.min(W - PAD, (e.clientX - rect.left) * scaleX));
    node.y = Math.max(PAD, Math.min(H - PAD, (e.clientY - rect.top) * scaleY));
    node.vx = 0; node.vy = 0;
    setTick(t => t + 1);
  }, [W, H]);

  const onDragEnd = useCallback(() => {
    if (!dragRef.current) return;
    const node = simRef.current.find(v => v.id === dragRef.current!.id);
    if (node) { node.pinned = false; node.vx = 0; node.vy = 0; }
    dragRef.current = null;
    kickSim();
  }, [edges]);

  // ── Graph operations ─────────────────────────────────────────────────────

  const addVertices = useCallback(() => {
    const tokens = vertexInput.split(/[\s,;]+/).map(s => s.trim()).filter(Boolean);
    if (!tokens.length) return;
    const dupes = tokens.filter(t => vertices.some(v => v.id === t));
    const fresh = tokens.filter(t => !vertices.some(v => v.id === t));
    if (!fresh.length) { setError(`Already exists: ${dupes.join(", ")}`); return; }
    setError(dupes.length ? `Skipped duplicates: ${dupes.join(", ")}` : null);
    const angle0 = (2 * Math.PI * vertices.length) / Math.max(vertices.length + fresh.length, 1);
    const newNodes: Vertex[] = fresh.map((id, i) => {
      const angle = angle0 + (2 * Math.PI * i) / Math.max(vertices.length + fresh.length, 1);
      const r = Math.min(W, H) * 0.27;
      return { id, x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle), vx: 0, vy: 0, pinned: false };
    });
    simRef.current = [...simRef.current, ...newNodes];
    setVertices(prev => [...prev, ...newNodes]);
    setVertexInput("");
  }, [vertexInput, vertices, W, H, cx, cy]);

  const removeVertex = useCallback((id: string) => {
    simRef.current = simRef.current.filter(v => v.id !== id);
    setVertices(prev => prev.filter(v => v.id !== id));
    setEdges(prev => prev.filter(e => e.from !== id && e.to !== id));
    if (selected === id) setSelected("");
    setAlgoResult(null); setStep(-1);
  }, [selected]);

  const addEdge = useCallback(() => {
    const f = edgeFrom.trim(), t = edgeTo.trim();
    if (!f || !t) { setError("Pick both vertices"); return; }
    const vids = vertices.map(v => v.id);
    if (!vids.includes(f)) { setError(`"${f}" not found`); return; }
    if (!vids.includes(t)) { setError(`"${t}" not found`); return; }
    const dup = edges.some(e =>
      (e.from === f && e.to === t) ||
      (!config.directed && e.from === t && e.to === f)
    );
    if (dup) { setError(`Edge ${f}${config.directed ? "→" : "—"}${t} already exists`); return; }
    setError(null);
    setEdges(prev => [...prev, { from: f, to: t, weight: Number(edgeWeight) || 1 }]);
    setAlgoResult(null); setStep(-1);
  }, [edgeFrom, edgeTo, edgeWeight, vertices, edges, config.directed]);

  const removeEdge = useCallback((from: string, to: string) => {
    setEdges(prev => prev.filter(e => !(e.from === from && e.to === to)));
    setAlgoResult(null); setStep(-1);
  }, []);

  // ── Algorithms ───────────────────────────────────────────────────────────

  const adj = useMemo(
    () => buildAdj(vertices.map(v => v.id), edges, config.directed),
    [vertices, edges, config.directed]
  );

  const runAlgo = useCallback((type: AlgoType) => {
    if (!vertices.length) return;
    if (playTimerRef.current) clearInterval(playTimerRef.current);
    setPlaying(false); setStep(-1);
    const start = selected || vertices[0].id;
    const vids = vertices.map(v => v.id);
    if (type === "bfs") {
      setAlgoResult({ type, order: bfs(adj, vids, start), startVertex: start });
    } else if (type === "dfs") {
      setAlgoResult({ type, order: dfs(adj, vids, start), startVertex: start });
    } else {
      const res = config.directed
        ? bfsCycleDirected(adj, vids)
        : bfsCycleUndirected(adj, vids);
      setAlgoResult({ type: "cycle", ...res });
    }
  }, [vertices, adj, selected, config.directed]);

  const playAlgo = useCallback(() => {
    if (!algoResult?.order?.length) return;
    setStep(0); setPlaying(true);
    let s = 0;
    playTimerRef.current = setInterval(() => {
      s++;
      if (s >= (algoResult.order?.length ?? 0)) {
        clearInterval(playTimerRef.current!); setPlaying(false);
        setStep((algoResult.order?.length ?? 1) - 1);
      } else setStep(s);
    }, 650);
  }, [algoResult]);

  const stopAlgo = useCallback(() => {
    if (playTimerRef.current) clearInterval(playTimerRef.current);
    setPlaying(false);
  }, []);

  const clearAll = useCallback(() => {
    simRef.current = [];
    setVertices([]); setEdges([]); setSelected(""); setAlgoResult(null); setStep(-1);
    if (playTimerRef.current) clearInterval(playTimerRef.current);
    setPlaying(false);
  }, []);

  // ── Copy ─────────────────────────────────────────────────────────────────

  const copyAll = useCallback(async () => {
    const vids = vertices.map(v => v.id);
    const lines = [
      `Graph (${config.directed ? "Directed" : "Undirected"}${config.weighted ? ", Weighted" : ""})`,
      `Vertices: ${vids.join(", ")}`,
      `Edges: ${edges.map(e => config.weighted ? `${e.from}→${e.to}(${e.weight})` : `${e.from}→${e.to}`).join(", ")}`,
      "",
      "Adjacency List:",
      ...vids.map(v => {
        const nbs = adj.get(v)?.join(", ") || "—";
        return `  ${v}: [${nbs}]`;
      }),
    ];
    if (algoResult) {
      lines.push("");
      if (algoResult.type !== "cycle")
        lines.push(`${algoResult.type.toUpperCase()} from ${algoResult.startVertex}: ${algoResult.order?.join(" → ")}`);
      else
        lines.push(`Cycle (BFS): ${algoResult.hasCycle ? `YES — ${algoResult.cycleNodes?.join(", ")}` : "No cycle"}`);
    }
    await navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  }, [vertices, edges, config, adj, algoResult]);

  // ── Presets ───────────────────────────────────────────────────────────────

  const presets = [
    {
      label: "Simple Cycle", directed: false, weighted: false,
      verts: ["A", "B", "C", "D"],
      edgs: [["A","B"],["B","C"],["C","D"],["D","A"]] as [string,string][],
    },
    {
      label: "Directed DAG", directed: true, weighted: false,
      verts: ["A","B","C","D","E"],
      edgs: [["A","B"],["A","C"],["B","D"],["C","D"],["D","E"]] as [string,string][],
    },
    {
      label: "Weighted", directed: false, weighted: true,
      verts: ["A","B","C","D","E"],
      edgs: [["A","B"],["A","C"],["B","C"],["B","D"],["C","E"],["D","E"]] as [string,string][],
      weights: [4,2,1,5,8,2],
    },
    {
      label: "Directed Cycle", directed: true, weighted: false,
      verts: ["A","B","C","D"],
      edgs: [["A","B"],["B","C"],["C","D"],["D","B"]] as [string,string][],
    },
    {
      label: "Disconnected", directed: false, weighted: false,
      verts: ["A","B","C","D","E","F"],
      edgs: [["A","B"],["B","C"],["D","E"]] as [string,string][],
    },
  ];

  const applyPreset = (p: typeof presets[number]) => {
    simRef.current = [];
    const g = computeGrid(p.verts.length);
    const newVerts: Vertex[] = p.verts.map((id, i) => {
      const angle = (2 * Math.PI * i) / p.verts.length - Math.PI / 2;
      const r = Math.min(g.W, g.H) * 0.27;
      return { id, x: g.cx + r * Math.cos(angle), y: g.cy + r * Math.sin(angle), vx: 0, vy: 0, pinned: false };
    });
    simRef.current = newVerts;
    setVertices(newVerts);
    setEdges(p.edgs.map(([from, to], i) => ({
      from, to, weight: (p as any).weights?.[i] ?? 1,
    })));
    setConfig(c => ({ ...c, directed: p.directed, weighted: p.weighted }));
    setAlgoResult(null); setStep(-1); setSelected(p.verts[0]);
  };

  // ── Render helpers ────────────────────────────────────────────────────────

  const vertMap = useMemo(() => new Map(vertices.map(v => [v.id, v])), [vertices]);
  const visitedSet = useMemo(
    () => new Set(algoResult?.order?.slice(0, step + 1) ?? []),
    [algoResult, step]
  );
  const cycleSet = useMemo(() => new Set(algoResult?.cycleNodes ?? []), [algoResult]);

  const getNodeFill = (id: string) => {
    if (algoResult?.type === "cycle" && cycleSet.has(id)) return "#ef4444";
    if (visitedSet.has(id)) return "#facc15";
    if (id === selected) return "#3b82f6";
    return isDark ? "#1f2937" : "#e5e7eb";
  };
  const getNodeStroke = (id: string) => {
    if (id === selected) return "#3b82f6";
    return isDark ? "#374151" : "#d1d5db";
  };
  const getNodeText = (id: string) => {
    if (algoResult?.type === "cycle" && cycleSet.has(id)) return "#fff";
    if (visitedSet.has(id)) return "#1f2937";
    if (id === selected) return "#fff";
    return isDark ? "#f9fafb" : "#1f2937";
  };

  const edgeBaseColor = isDark ? "#4b5563" : "#9ca3af";

  const getEdgeColor = (e: Edge) => {
    if (algoResult?.type === "cycle" && cycleSet.has(e.from) && cycleSet.has(e.to)) return "#ef4444";
    if (visitedSet.has(e.from) && visitedSet.has(e.to)) return "#facc15";
    return edgeBaseColor;
  };

  const getArrowMarker = (e: Edge) => {
    if (!config.directed) return undefined;
    if (algoResult?.type === "cycle" && cycleSet.has(e.from) && cycleSet.has(e.to)) return "url(#arrow-cycle)";
    if (visitedSet.has(e.from) && visitedSet.has(e.to)) return "url(#arrow-visit)";
    return "url(#arrow)";
  };

  const vids = vertices.map(v => v.id);
  const matrix = useMemo(
    () => buildMatrix(vids, edges, config.directed, config.weighted),
    [vids, edges, config.directed, config.weighted]
  );

  const gridLabel = (() => {
    const g = computeGrid(vertices.length);
    return `${g.cols}×${g.rows}`;
  })();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1419] pb-28">

      {/* ── Header ── */}
      <div className="bg-white dark:bg-gray-800 rounded-b-3xl shadow-sm">
        <div className="px-4 pt-4 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/")}
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all">
              <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Toolbox</p>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Graph Calculator</h1>
            </div>
          </div>
          <button onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
            {isDark
              ? <Moon className="w-4 h-4 text-gray-300" />
              : <Sun className="w-4 h-4 text-yellow-500" />}
          </button>
        </div>
      </div>

      {/* ── Graph Type ── */}
      <div className="px-4 mt-4 flex gap-2">
        <button onClick={() => { setConfig(c => ({ ...c, directed: !c.directed })); setEdges([]); setAlgoResult(null); }}
          className={`flex-1 py-2.5 rounded-full text-sm font-bold transition-all ${config.directed ? "bg-indigo-600 text-white" : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"}`}>
          {config.directed ? "Directed" : "Undirected"}
        </button>
        <button onClick={() => setConfig(c => ({ ...c, weighted: !c.weighted }))}
          className={`flex-1 py-2.5 rounded-full text-sm font-bold transition-all ${config.weighted ? "bg-amber-500 text-white" : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"}`}>
          {config.weighted ? "Weighted" : "Unweighted"}
        </button>
      </div>

      {/* ── Edge Style ── */}
      <div className="px-4 mt-2 flex gap-1.5">
        {(["auto", "straight", "curved", "arc"] as EdgeStyle[]).map(s => (
          <button key={s} onClick={() => setConfig(c => ({ ...c, edgeStyle: s }))}
            className={`flex-1 py-1.5 rounded-full text-[11px] font-semibold capitalize transition-all ${config.edgeStyle === s ? "bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900" : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700"}`}>
            {s}
          </button>
        ))}
      </div>
      <p className="text-[10px] text-center text-gray-400 dark:text-gray-600 mt-1">
        Auto = straight unless crossing detected · Arc = bowed · Curved = always bent
      </p>

      {/* ── Build Card ── */}
      <div className="px-4 mt-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">

          {/* Add Vertices */}
          <div className="px-4 pt-4 pb-3 border-b border-gray-100 dark:border-gray-700">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
              Add Vertices
            </p>
            <div className="flex gap-2">
              <div className={`flex-1 rounded-xl bg-gray-50 dark:bg-[#131820] border px-3 py-2.5 ${error ? "border-red-400" : "border-gray-200 dark:border-gray-700 focus-within:border-blue-500"}`}>
                <input
                  type="text" value={vertexInput}
                  onChange={e => { setVertexInput(e.target.value); setError(null); }}
                  onKeyDown={e => e.key === "Enter" && addVertices()}
                  placeholder="A, B, C or A B C"
                  className="w-full bg-transparent text-sm font-mono text-gray-900 dark:text-white outline-none placeholder:text-gray-400 dark:placeholder:text-gray-600"
                />
              </div>
              <button onClick={addVertices} disabled={!vertexInput.trim()}
                className={`flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${vertexInput.trim() ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed"}`}>
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            {error && <p className="text-[10px] text-red-500 mt-1.5">⚠ {error}</p>}
            {vertices.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {vertices.map(v => (
                  <span key={v.id} onClick={() => setSelected(s => s === v.id ? "" : v.id)}
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold cursor-pointer transition-all ${v.id === selected ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/30"}`}>
                    {v.id}
                    <button onClick={e => { e.stopPropagation(); removeVertex(v.id); }}
                      className="opacity-50 hover:opacity-100 ml-0.5 transition-opacity">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Add Edges */}
          <div className="px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
              Add Edge
            </p>
            <div className="flex gap-2 items-center">
              <select value={edgeFrom} onChange={e => setEdgeFrom(e.target.value)}
                className="flex-1 bg-gray-50 dark:bg-[#131820] border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm font-mono text-gray-900 dark:text-white outline-none">
                <option value="">From</option>
                {vertices.map(v => <option key={v.id} value={v.id}>{v.id}</option>)}
              </select>
              <span className="text-gray-400 text-xs font-bold">{config.directed ? "→" : "—"}</span>
              <select value={edgeTo} onChange={e => setEdgeTo(e.target.value)}
                className="flex-1 bg-gray-50 dark:bg-[#131820] border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm font-mono text-gray-900 dark:text-white outline-none">
                <option value="">To</option>
                {vertices.map(v => <option key={v.id} value={v.id}>{v.id}</option>)}
              </select>
              {config.weighted && (
                <input type="number" value={edgeWeight}
                  onChange={e => setEdgeWeight(e.target.value)}
                  className="w-14 bg-gray-50 dark:bg-[#131820] border border-gray-200 dark:border-gray-700 rounded-xl px-2 py-2.5 text-sm font-mono text-center text-gray-900 dark:text-white outline-none"
                  placeholder="w" />
              )}
              <button onClick={addEdge} disabled={!edgeFrom || !edgeTo}
                className={`flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${edgeFrom && edgeTo ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed"}`}>
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {edges.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {edges.map((e, i) => (
                  <span key={i}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    {e.from}{config.directed ? "→" : "—"}{e.to}
                    {config.weighted ? `(${e.weight})` : ""}
                    <button onClick={() => removeEdge(e.from, e.to)}
                      className="opacity-50 hover:opacity-100 ml-0.5">
                      <Trash2 className="w-2.5 h-2.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Visualization ── */}
      <div className="px-4 mt-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Visualization</h3>
              <p className="text-[10px] text-gray-400 dark:text-gray-600 mt-0.5">
                {vertices.length > 0
                  ? `${gridLabel} grid · ${vertices.length}V ${edges.length}E · Drag to reposition`
                  : "Add vertices to begin"}
              </p>
            </div>
            {vertices.length > 0 && (
              <button onClick={clearAll}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-500 transition-all">
                <RotateCcw className="w-3 h-3" /> Clear
              </button>
            )}
          </div>

          <div
            ref={svgWrapRef}
            className="flex justify-center overflow-x-auto"
            style={{ background: isDark ? "#0a0e14" : "#f9fafb" }}>
            {vertices.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 gap-3">
                <Share2 className="w-10 h-10 text-gray-300 dark:text-gray-700" />
                <p className="text-sm text-gray-400 dark:text-gray-600">No vertices yet</p>
              </div>
            ) : (
              <svg
                width={W} height={H}
                viewBox={`0 0 ${W} ${H}`}
                style={{ width: "100%", maxWidth: W, touchAction: "none", overflow: "visible" }}
                onPointerMove={onDragMove}
                onPointerUp={onDragEnd}
                onPointerLeave={onDragEnd}>
                <Defs isDark={isDark} cycleColor="#ef4444" />
                <GridBg W={W} H={H} isDark={isDark} />

                {/* Edges */}
                {edges.map((e, i) => {
                  const from = vertMap.get(e.from);
                  const to = vertMap.get(e.to);
                  if (!from || !to) return null;
                  const d = computeEdgePath(from, to, edges, vertMap, config, i);
                  const col = getEdgeColor(e);
                  const marker = getArrowMarker(e);
                  const isSelf = e.from === e.to;

                  return (
                    <g key={`edge-${e.from}-${e.to}-${i}`}>
                      <path
                        d={d}
                        fill="none"
                        stroke={col}
                        strokeWidth={1.6}
                        markerEnd={isSelf ? undefined : marker}
                      />
                      {config.weighted && !isSelf && (() => {
                        const mx = (from.x + to.x) / 2;
                        const my = (from.y + to.y) / 2;
                        return (
                          <text x={mx} y={my - 8} fontSize={9} textAnchor="middle"
                            fill={isDark ? "#9ca3af" : "#6b7280"}
                            fontFamily="ui-monospace, monospace">
                            {e.weight}
                          </text>
                        );
                      })()}
                    </g>
                  );
                })}

                {/* Vertices */}
                {vertices.map(v => {
                  const fill = getNodeFill(v.id);
                  const stroke = getNodeStroke(v.id);
                  const textFill = getNodeText(v.id);
                  const lbl = v.id.length > 3 ? v.id.slice(0, 3) : v.id;
                  return (
                    <g key={v.id} style={{ cursor: "grab" }}
                      onPointerDown={e => { e.stopPropagation(); onDragStart(v.id, e); }}
                      onClick={() => setSelected(s => s === v.id ? "" : v.id)}>
                      {v.id === selected && (
                        <circle cx={v.x} cy={v.y} r={NODE_R + 5}
                          fill="none" stroke="#3b82f6" strokeWidth={2} opacity={0.3} />
                      )}
                      <circle cx={v.x} cy={v.y} r={NODE_R}
                        fill={fill} stroke={stroke} strokeWidth={v.id === selected ? 2 : 1.5} />
                      <text x={v.x} y={v.y} textAnchor="middle" dy="0.35em"
                        fill={textFill}
                        fontSize={lbl.length > 1 ? 11 : 13}
                        fontWeight="700"
                        fontFamily="ui-monospace, monospace"
                        style={{ pointerEvents: "none", userSelect: "none" }}>
                        {lbl}
                      </text>
                    </g>
                  );
                })}
              </svg>
            )}
          </div>

          {vertices.length > 0 && (
            <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-4">
              {[
                { col: "#3b82f6", label: "Selected" },
                { col: "#facc15", label: "Visited" },
                { col: "#ef4444", label: "Cycle" },
              ].map(({ col, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ background: col }} />
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">{label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Algorithms ── */}
      <div className="px-4 mt-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Algorithms</h3>
            <p className="text-[10px] text-gray-400 dark:text-gray-600 mt-0.5">
              {selected ? `Start: ${selected}` : "Tap a node to set start, or first vertex used"} · BFS cycle detection
            </p>
          </div>
          <div className="px-4 py-3 grid grid-cols-3 gap-2">
            {[
              { label: "BFS", type: "bfs" as AlgoType, cls: "bg-blue-600 hover:bg-blue-700" },
              { label: "DFS", type: "dfs" as AlgoType, cls: "bg-purple-600 hover:bg-purple-700" },
              { label: "Cycle (BFS)", type: "cycle" as AlgoType, cls: "bg-rose-600 hover:bg-rose-700" },
            ].map(({ label, type, cls }) => (
              <button key={type} onClick={() => runAlgo(type)}
                disabled={!vertices.length}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all ${vertices.length ? `${cls} text-white active:scale-[0.97]` : "bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed"}`}>
                {label}
              </button>
            ))}
          </div>

          {algoResult && (
            <div className="border-t border-gray-100 dark:border-gray-700 px-4 py-3">
              {algoResult.type !== "cycle" && algoResult.order && (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-xs font-semibold text-gray-900 dark:text-white">
                        {algoResult.type.toUpperCase()} from{" "}
                        <span className="font-mono text-blue-500">{algoResult.startVertex}</span>
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {algoResult.type === "bfs" ? "Queue · level-order" : "Stack (recursive) · depth-first"}
                      </p>
                    </div>
                    <button onClick={playing ? stopAlgo : playAlgo}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${playing ? "bg-amber-500 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200"}`}>
                      {playing ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                      {playing ? "Pause" : "Play"}
                    </button>
                  </div>
                  <input type="range" min={-1} max={algoResult.order.length - 1} value={step}
                    onChange={e => { stopAlgo(); setStep(Number(e.target.value)); }}
                    className="w-full h-1.5 rounded-full accent-blue-600 mb-3" />
                  <div className="flex flex-wrap gap-1.5">
                    {algoResult.order.map((v, i) => (
                      <span key={i}
                        className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-mono font-semibold transition-all ${i <= step ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 ring-1 ring-yellow-300/50" : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"}`}>
                        <span className="text-[9px] opacity-50">{i + 1}.</span>{v}
                      </span>
                    ))}
                  </div>
                </>
              )}
              {algoResult.type === "cycle" && (
                <div className={`rounded-xl p-3 ${algoResult.hasCycle ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800" : "bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800"}`}>
                  <p className={`text-sm font-bold ${algoResult.hasCycle ? "text-red-700 dark:text-red-300" : "text-emerald-700 dark:text-emerald-300"}`}>
                    {algoResult.hasCycle ? "⚠ Cycle Detected" : "✓ No Cycle Found"}
                  </p>
                  <p className="text-[10px] mt-1 text-gray-500 dark:text-gray-400 font-mono">
                    {config.directed
                      ? "Kahn's BFS — unprocessed nodes after traversal = cycle"
                      : "BFS parent tracking — visited non-parent = back edge = cycle"}
                  </p>
                  {algoResult.hasCycle && algoResult.cycleNodes && algoResult.cycleNodes.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {algoResult.cycleNodes.map(v => (
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

      {/* ── Adjacency List / Matrix ── */}
      {vertices.length > 0 && (
        <div className="px-4 mt-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                {showMatrix ? "Adjacency Matrix" : "Adjacency List"}
              </h3>
              <div className="flex gap-1">
                {[
                  { label: <List className="w-3.5 h-3.5" />, val: false },
                  { label: <Table className="w-3.5 h-3.5" />, val: true },
                ].map(({ label, val }) => (
                  <button key={String(val)} onClick={() => setShowMatrix(val)}
                    className={`p-2 rounded-lg transition-all ${showMatrix === val ? "bg-indigo-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            {!showMatrix ? (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {vertices.map(v => {
                  const nbs = adj.get(v.id) ?? [];
                  return (
                    <div key={v.id} className="flex items-center gap-3 px-4 py-2.5">
                      <span className="w-8 text-center font-mono font-bold text-sm text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 rounded-lg py-1">{v.id}</span>
                      <span className="text-gray-400 text-xs">→</span>
                      <div className="flex flex-wrap gap-1 flex-1">
                        {nbs.length > 0 ? nbs.map((nb, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md text-xs font-mono font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                            {nb}{config.weighted ? `(${edges.find(e => e.from === v.id && e.to === nb)?.weight ?? ""})` : ""}
                          </span>
                        )) : (
                          <span className="text-xs text-gray-400 italic">no edges</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="px-4 py-3 overflow-x-auto">
                <table className="text-xs font-mono border-collapse">
                  <thead>
                    <tr>
                      <td className="w-8 h-8" />
                      {vids.map(v => (
                        <th key={v} className="w-8 h-8 text-center font-bold text-gray-700 dark:text-gray-300">{v}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {matrix.map((row, i) => (
                      <tr key={i}>
                        <td className="w-8 h-8 text-center font-bold text-gray-700 dark:text-gray-300 pr-1">{vids[i]}</td>
                        {row.map((cell, j) => (
                          <td key={j}
                            className={`w-8 h-8 text-center border border-gray-200 dark:border-gray-700 ${cell !== null ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold" : "bg-gray-50 dark:bg-gray-900 text-gray-300 dark:text-gray-700"}`}>
                            {cell !== null ? cell : "0"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-[10px] text-gray-400 mt-2 font-mono">
                  Row=from · Col=to · {config.directed ? "Asymmetric (directed)" : "Symmetric (undirected)"}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Presets ── */}
      <div className="px-4 mt-4">
        <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Quick Presets</p>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {presets.map(p => (
            <button key={p.label} onClick={() => applyPreset(p)}
              className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-4" />

      {/* ── Bottom Bar ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 rounded-t-3xl shadow-lg z-10">
        <div className="flex items-center justify-between px-4 py-4">
          <button onClick={clearAll}
            className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            Clear All
          </button>
          <button onClick={copyAll} disabled={!vertices.length}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all ${vertices.length ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm" : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"}`}>
            {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy All</>}
          </button>
        </div>
      </div>
    </div>
  );
}
