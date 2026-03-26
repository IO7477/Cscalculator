// GraphCalc.tsx
// W3Schools References:
//   Graph Theory:        https://www.w3schools.com/dsa/dsa_theory_graphs.php
//   Implementation:      https://www.w3schools.com/dsa/dsa_data_graphs_implementation.php
//   Traversal (BFS/DFS): https://www.w3schools.com/dsa/dsa_algo_graphs_traversal.php
// GeeksforGeeks References:
//   Kruskal's MST:       https://www.geeksforgeeks.org/dsa/kruskals-minimum-spanning-tree-algorithm-greedy-algo-2/

import React, { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router";
import {
  ChevronLeft,
  Moon,
  Sun,
  Plus,
  Trash2,
  RotateCcw,
  Copy,
  Check,
  Share2,
  Table,
  List,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Edge {
  from: string;
  to: string;
  weight: number;
}

interface GraphConfig {
  directed: boolean;
  weighted: boolean;
}

type AlgoType = "bfs" | "dfs" | "kruskal";

interface AlgoResult {
  type: AlgoType;
  order?: string[];
  startVertex?: string;
  mstEdges?: Edge[];
  mstCost?: number;
  skippedEdges?: Edge[];
  possible?: boolean;
}

interface AlgoResults {
  bfs: AlgoResult | null;
  dfs: AlgoResult | null;
  kruskal: AlgoResult | null;
}

interface Position {
  x: number;
  y: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const NODE_R = 22;
const CELL = 72;

function gridDims(n: number) {
  let cols: number, rows: number;
  if (n <= 3) {
    cols = 4; rows = 4;
  } else if (n <= 4) {
    cols = 5; rows = 5;
  } else if (n <= 8) {
    cols = 6; rows = 6;
  } else if (n <= 12) {
    cols = 8; rows = 7;
  } else {
    cols = Math.ceil(Math.sqrt(n)) + 3;
    rows = Math.max(cols - 1, cols);
  }
  const W = cols * CELL, H = rows * CELL;
  return { cols, rows, W, H };
}

// ─── Static layout — circle arrangement ──────────────────────────────────────

function staticLayout(vids: string[], W: number, H: number) {
  const positions = new Map<string, { x: number; y: number }>();
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

function staticRouteEdge(
  from: { x: number; y: number },
  to: { x: number; y: number },
  directed: boolean,
  hasBoth: boolean,
  isSmaller: boolean,
  laneIndex: number = 0
): { d: string; midX: number; midY: number } {
  const dx = to.x - from.x, dy = to.y - from.y;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  const ux = dx / dist, uy = dy / dist, px = -uy, py = ux;
  const arrPad = directed ? 9 : 0;

  const sx = from.x + ux * NODE_R, sy = from.y + uy * NODE_R;
  const ex = to.x - ux * (NODE_R + arrPad), ey = to.y - uy * (NODE_R + arrPad);
  const mx = (sx + ex) / 2, my = (sy + ey) / 2;

  const baseOffset = hasBoth ? 38 : 18;
  const laneOffset = laneIndex === 0 ? 0 : baseOffset * laneIndex;
  const sign = isSmaller ? 1 : -1;

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

// ─── Graph algorithms ─────────────────────────────────────────────────────────

function buildAdj(
  vids: string[],
  edges: Edge[],
  directed: boolean
): Map<string, string[]> {
  const adj = new Map<string, string[]>();
  for (const v of vids) adj.set(v, []);
  for (const e of edges) {
    adj.get(e.from)?.push(e.to);
    if (!directed) adj.get(e.to)?.push(e.from);
  }
  return adj;
}

function bfs(adj: Map<string, string[]>, vids: string[], start: string): string[] {
  const vis = new Set<string>(), order: string[] = [];
  for (const src of [start, ...vids.filter((v) => v !== start)]) {
    if (vis.has(src)) continue;
    const q = [src];
    vis.add(src);
    while (q.length) {
      const v = q.shift()!;
      order.push(v);
      for (const nb of adj.get(v) ?? []) {
        if (!vis.has(nb)) { vis.add(nb); q.push(nb); }
      }
    }
  }
  return order;
}

function dfs(adj: Map<string, string[]>, vids: string[], start: string): string[] {
  const vis = new Set<string>(), order: string[] = [];
  const go = (v: string) => {
    vis.add(v); order.push(v);
    for (const nb of adj.get(v) ?? []) if (!vis.has(nb)) go(nb);
  };
  go(start);
  for (const v of vids) if (!vis.has(v)) go(v);
  return order;
}

// ─── Kruskal / DSU ────────────────────────────────────────────────────────────

class DSU {
  private parent: Map<string, string>;
  private rank: Map<string, number>;

  constructor(vids: string[]) {
    this.parent = new Map(vids.map((v) => [v, v]));
    this.rank = new Map(vids.map((v) => [v, 0]));
  }

  find(x: string): string {
    if (this.parent.get(x) !== x) {
      this.parent.set(x, this.find(this.parent.get(x)!));
    }
    return this.parent.get(x)!;
  }

  union(x: string, y: string): boolean {
    const rx = this.find(x), ry = this.find(y);
    if (rx === ry) return false;
    const rankX = this.rank.get(rx)!, rankY = this.rank.get(ry)!;
    if (rankX < rankY) this.parent.set(rx, ry);
    else if (rankX > rankY) this.parent.set(ry, rx);
    else { this.parent.set(ry, rx); this.rank.set(rx, rankX + 1); }
    return true;
  }
}

function kruskal(vids: string[], edges: Edge[]) {
  const sorted = [...edges].sort((a, b) => a.weight - b.weight);
  const dsu = new DSU(vids);
  const mstEdges: Edge[] = [], skippedEdges: Edge[] = [];
  let mstCost = 0;

  for (const e of sorted) {
    if (e.from === e.to) continue;
    if (dsu.union(e.from, e.to)) {
      mstEdges.push(e);
      mstCost += e.weight;
      if (mstEdges.length === vids.length - 1) break;
    } else {
      skippedEdges.push(e);
    }
  }

  return {
    mstEdges,
    skippedEdges,
    mstCost,
    possible: mstEdges.length === vids.length - 1,
  };
}

// ─── Grid background ──────────────────────────────────────────────────────────

function GridBg({ W, H, isDark }: { W: number; H: number; isDark: boolean }) {
  const lineClr = isDark ? "rgba(255,255,255,0.045)" : "rgba(30,50,120,0.065)";
  const dotClr = isDark ? "rgba(255,255,255,0.16)" : "rgba(30,50,120,0.18)";
  const els: React.ReactNode[] = [];

  for (let x = 0; x <= W; x += CELL) {
    els.push(
      <line key={`v${x}`} x1={x} y1={0} x2={x} y2={H} stroke={lineClr} strokeWidth={0.6} />
    );
  }
  for (let y = 0; y <= H; y += CELL) {
    els.push(
      <line key={`h${y}`} x1={0} y1={y} x2={W} y2={y} stroke={lineClr} strokeWidth={0.6} />
    );
  }
  for (let x = 0; x <= W; x += CELL) {
    for (let y = 0; y <= H; y += CELL) {
      els.push(<circle key={`d${x},${y}`} cx={x} cy={y} r={1.5} fill={dotClr} />);
    }
  }

  return <g>{els}</g>;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function GraphCalculator() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  // ── Graph data ──────────────────────────────────────────────────────────────
  const [vertexIds, setVertexIds] = useState<string[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [config, setConfig] = useState<GraphConfig>({
    directed: false,
    weighted: false,
  });

  // ── UI state ────────────────────────────────────────────────────────────────
  const [vInput, setVInput] = useState("");
  const [eFr, setEFr] = useState("");
  const [eTo, setETo] = useState("");
  const [eWt, setEWt] = useState("1");
  const [error, setError] = useState<string | null>(null);
  const [selV, setSelV] = useState("");
  const [showMat, setShowMat] = useState(false);
  const [copied, setCopied] = useState(false);

  // ── Algorithm state ─────────────────────────────────────────────────────────
  const [algoResults, setAlgoResults] = useState<AlgoResults>({
    bfs: null,
    dfs: null,
    kruskal: null,
  });
  const [activeAlgo, setActiveAlgo] = useState<AlgoType>("bfs");
  const [algoStart, setAlgoStart] = useState("");
  const [neighborOrder, setNeighborOrder] = useState<"lvf" | "hvf">("lvf");

  // ── Option 1: Tap row = replay once ─────────────────────────────────────────
  const [bfsRunId, setBfsRunId] = useState(0);
  const [dfsRunId, setDfsRunId] = useState(0);
  const [animatingAlgo, setAnimatingAlgo] = useState<"bfs" | "dfs" | null>(null);
  const [stepIndex, setStepIndex] = useState(0);

  // ── Node positions & dragging ───────────────────────────────────────────────
  const [nodePositions, setNodePositions] = useState<Record<string, Position>>({});
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<Position | null>(null);

  // ── Edge selection + inline weight editing ──────────────────────────────────
  const [selectedEdgeKey, setSelectedEdgeKey] = useState<string | null>(null);
  const [editingEdgeKey, setEditingEdgeKey] = useState<string | null>(null);
  const [editingWeight, setEditingWeight] = useState<string>("");

  const edgeKey = useCallback((e: Edge) => `${e.from}→${e.to}`, []);

  // ── Double-tap to connect ───────────────────────────────────────────────────
  const [dtapFirst, setDtapFirst] = useState<string | null>(null);
  const [dtapTimer, setDtapTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  // ─── Adjacency ───────────────────────────────────────────────────────────────

  const adj = useMemo(
    () => buildAdj(vertexIds, edges, config.directed),
    [vertexIds, edges, config.directed]
  );

  const sortedAdj = useMemo(() => {
    const sorted = new Map<string, string[]>();
    for (const [v, neighbors] of adj) {
      const s = [...neighbors].sort((a, b) => {
        if (config.weighted) {
          const wa = Number(
            edges.find((e) => e.from === v && e.to === a)?.weight ?? 0
          );
          const wb = Number(
            edges.find((e) => e.from === v && e.to === b)?.weight ?? 0
          );
          return neighborOrder === "lvf" ? wa - wb : wb - wa;
        }
        return neighborOrder === "lvf"
          ? a.localeCompare(b)
          : b.localeCompare(a);
      });
      sorted.set(v, s);
    }
    return sorted;
  }, [adj, edges, config.weighted, neighborOrder]);

  // ─── Auto-run algorithms ──────────────────────────────────────────────────────

  React.useEffect(() => {
    if (!vertexIds.length) {
      setAlgoResults({ bfs: null, dfs: null, kruskal: null });
      return;
    }
    const start = algoStart || selV || vertexIds[0];
    setAlgoResults({
      bfs: {
        type: "bfs",
        order: bfs(sortedAdj, vertexIds, start),
        startVertex: start,
      },
      dfs: {
        type: "dfs",
        order: dfs(sortedAdj, vertexIds, start),
        startVertex: start,
      },
      kruskal: config.directed
        ? { type: "kruskal", possible: false, mstEdges: [], skippedEdges: [], mstCost: 0 }
        : { type: "kruskal", ...kruskal(vertexIds, edges) },
    });
  }, [vertexIds, edges, sortedAdj, algoStart, selV, config.directed]);

  const activeResult = algoResults[activeAlgo] ?? null;

  // Snap to end when not animating
  React.useEffect(() => {
    if (!activeResult || activeResult.type === "kruskal") return;
    if (animatingAlgo) return;
    const order = activeResult.order ?? [];
    setStepIndex(Math.max(0, order.length - 1));
  }, [activeResult, animatingAlgo]);

  // Animate BFS on bfsRunId bump
  React.useEffect(() => {
    if (activeAlgo !== "bfs") return;
    if (bfsRunId === 0) return;
    if (!activeResult || activeResult.type !== "bfs") return;
    const order = activeResult.order ?? [];
    if (!order.length) return;

    setAnimatingAlgo("bfs");
    setStepIndex(0);

    const id = window.setInterval(() => {
      setStepIndex((prev) => {
        if (prev >= order.length - 1) {
          window.clearInterval(id);
          setAnimatingAlgo(null);
          return order.length - 1;
        }
        return prev + 1;
      });
    }, 600);

    return () => { window.clearInterval(id); setAnimatingAlgo(null); };
  }, [activeAlgo, bfsRunId, activeResult]);

  // Animate DFS on dfsRunId bump
  React.useEffect(() => {
    if (activeAlgo !== "dfs") return;
    if (dfsRunId === 0) return;
    if (!activeResult || activeResult.type !== "dfs") return;
    const order = activeResult.order ?? [];
    if (!order.length) return;

    setAnimatingAlgo("dfs");
    setStepIndex(0);

    const id = window.setInterval(() => {
      setStepIndex((prev) => {
        if (prev >= order.length - 1) {
          window.clearInterval(id);
          setAnimatingAlgo(null);
          return order.length - 1;
        }
        return prev + 1;
      });
    }, 600);

    return () => { window.clearInterval(id); setAnimatingAlgo(null); };
  }, [activeAlgo, dfsRunId, activeResult]);

  // ─── Graph operations ─────────────────────────────────────────────────────────

  const addVertices = useCallback(() => {
    const raw = vInput.trim();
    if (!raw) return;

    const segments = raw.split(",").map((s) => s.trim()).filter(Boolean);

    const newVertices: string[] = [];
    const newEdges: { from: string; to: string }[] = [];
    const skipped: string[] = [];
    const errors: string[] = [];

    const existing = new Set(vertexIds);

    for (const seg of segments) {
      const toMatch = seg.match(/^(\S+)\s+to\s+(\S+)$/i);

      if (toMatch) {
        const from = toMatch[1].trim();
        const to = toMatch[2].trim();

        if (!existing.has(from)) { newVertices.push(from); existing.add(from); }
        if (!existing.has(to)) { newVertices.push(to); existing.add(to); }

        const dup = edges.some(
          (e) =>
            (e.from === from && e.to === to) ||
            (!config.directed && e.from === to && e.to === from)
        );
        if (!dup) {
          newEdges.push({ from, to });
        } else {
          errors.push(`Edge ${from}→${to} already exists`);
        }
      } else {
        const tokens = seg.split(/\s+/).filter(Boolean);
        for (const t of tokens) {
          if (existing.has(t)) { skipped.push(t); }
          else { newVertices.push(t); existing.add(t); }
        }
      }
    }

    if (newVertices.length === 0 && newEdges.length === 0) {
      setError(skipped.length ? `Already exists: ${skipped.join(", ")}` : null);
      return;
    }

    if (newVertices.length > 0) setVertexIds((prev) => [...prev, ...newVertices]);
    if (newEdges.length > 0) {
      setEdges((prev) => [
        ...prev,
        ...newEdges.map((e) => ({ ...e, weight: Number(eWt) || 1 })),
      ]);
    }

    const allErrors = [
      ...errors,
      ...(skipped.length ? [`Skipped: ${skipped.join(", ")}`] : []),
    ];
    setError(allErrors.length ? allErrors.join(" · ") : null);
    setVInput("");
  }, [vInput, vertexIds, edges, config.directed, eWt]);

  const removeVertex = useCallback(
    (id: string) => {
      setVertexIds((prev) => prev.filter((v) => v !== id));
      setEdges((prev) => prev.filter((e) => e.from !== id && e.to !== id));
      setNodePositions((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      if (selV === id) setSelV("");
      if (algoStart === id) setAlgoStart("");
    },
    [selV, algoStart]
  );

  const addEdge = useCallback(() => {
    const f = eFr.trim(), t = eTo.trim();
    if (!f || !t) { setError("Select both vertices"); return; }

    const vset = new Set(vertexIds);
    if (!vset.has(f) || !vset.has(t)) { setError("Vertex not found"); return; }

    const dup = edges.some(
      (e) =>
        (e.from === f && e.to === t) ||
        (!config.directed && e.from === t && e.to === f)
    );
    if (dup) {
      setError(`Edge ${f}${config.directed ? "→" : "—"}${t} already exists`);
      return;
    }

    setError(null);
    setEdges((prev) => [...prev, { from: f, to: t, weight: Number(eWt) || 1 }]);
  }, [eFr, eTo, eWt, vertexIds, edges, config.directed]);

  const removeEdge = useCallback((from: string, to: string) => {
    setEdges((prev) => prev.filter((e) => !(e.from === from && e.to === to)));
  }, []);

  const clearAll = useCallback(() => {
    setVertexIds([]);
    setEdges([]);
    setSelV("");
    setAlgoStart("");
    setNodePositions({});
    setAlgoResults({ bfs: null, dfs: null, kruskal: null });
  }, []);

  const copyAll = useCallback(async () => {
    const lines = [
      `Graph (${config.directed ? "Directed" : "Undirected"}${config.weighted ? ", Weighted" : ""})`,
      `Vertices: ${vertexIds.join(", ")}`,
      `Edges: ${edges.map((e) => config.weighted ? `${e.from}→${e.to}(${e.weight})` : `${e.from}→${e.to}`).join(", ")}`,
      "",
      "Adjacency List:",
      ...vertexIds.map((v) => `  ${v}: [${adj.get(v)?.join(", ") || "—"}]`),
      "",
      algoResults.bfs
        ? `BFS from ${algoResults.bfs.startVertex}: [${algoResults.bfs.order?.join(", ")}]`
        : "",
      algoResults.dfs
        ? `DFS from ${algoResults.dfs.startVertex}: [${algoResults.dfs.order?.join(", ")}]`
        : "",
      algoResults.kruskal?.possible
        ? `Kruskal MST cost: ${algoResults.kruskal.mstCost} — edges: ${algoResults.kruskal.mstEdges?.map((e) => `${e.from}—${e.to}(${e.weight})`).join(", ")}`
        : "",
    ].filter((l) => l !== "");

    await navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [vertexIds, edges, config, adj, algoResults]);

  // ── Double-tap to connect handler ──────────────────────────────────────────

  const handleNodeDoubleClick = useCallback(
    (id: string) => {
      if (!dtapFirst) {
        setDtapFirst(id);
        const t = setTimeout(() => setDtapFirst(null), 3000);
        setDtapTimer(t);
      } else {
        if (dtapTimer) clearTimeout(dtapTimer);
        setDtapTimer(null);

        if (dtapFirst === id) {
          setDtapFirst(null);
          return;
        }

        const dup = edges.some(
          (e) =>
            (e.from === dtapFirst && e.to === id) ||
            (!config.directed && e.from === id && e.to === dtapFirst)
        );

        if (!dup) {
          setEdges((prev) => [
            ...prev,
            { from: dtapFirst, to: id, weight: Number(eWt) || 1 },
          ]);
        } else {
          setError(`Edge ${dtapFirst}${config.directed ? "→" : "—"}${id} already exists`);
        }

        setDtapFirst(null);
      }
    },
    [dtapFirst, dtapTimer, edges, config.directed, eWt]
  );

  // ── Presets ─────────────────────────────────────────────────────────────────

  const applyPreset = useCallback(
    (p: {
      vids: string[];
      edgs: [string, string][];
      directed: boolean;
      weighted: boolean;
      weights?: number[];
    }) => {
      setVertexIds(p.vids);
      setEdges(p.edgs.map(([from, to], i) => ({ from, to, weight: p.weights?.[i] ?? 1 })));
      setConfig({ directed: p.directed, weighted: p.weighted });
      setSelV(p.vids[0] ?? "");
      setAlgoStart("");
      setNodePositions({});
      setAlgoResults({ bfs: null, dfs: null, kruskal: null });
    },
    []
  );

  const presets = [
    {
      label: "Simple cycle",
      directed: false, weighted: false,
      vids: ["A", "B", "C", "D"],
      edgs: [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"]] as [string, string][],
    },
    {
      label: "Directed DAG",
      directed: true, weighted: false,
      vids: ["A", "B", "C", "D", "E"],
      edgs: [["A", "B"], ["A", "C"], ["B", "D"], ["C", "D"], ["D", "E"]] as [string, string][],
    },
    {
      label: "Weighted MST",
      directed: false, weighted: true,
      vids: ["A", "B", "C", "D", "E"],
      edgs: [["A", "B"], ["A", "C"], ["B", "C"], ["B", "D"], ["C", "E"], ["D", "E"]] as [string, string][],
      weights: [4, 2, 1, 5, 8, 2],
    },
    {
      label: "Directed cycle",
      directed: true, weighted: false,
      vids: ["A", "B", "C", "D"],
      edgs: [["A", "B"], ["B", "C"], ["C", "D"], ["D", "B"]] as [string, string][],
    },
    {
      label: "Disconnected",
      directed: false, weighted: false,
      vids: ["A", "B", "C", "D", "E", "F"],
      edgs: [["A", "B"], ["B", "C"], ["D", "E"]] as [string, string][],
    },
  ];

  // ── Adjacency matrix ────────────────────────────────────────────────────────

  const adjMat = useMemo(() => {
    const idx = new Map(vertexIds.map((v, i) => [v, i]));
    const n = vertexIds.length;
    const mat: (number | null)[][] = Array.from({ length: n }, () => Array(n).fill(null));

    for (const e of edges) {
      const i = idx.get(e.from), j = idx.get(e.to);
      if (i == null || j == null) continue;
      mat[i][j] = config.weighted ? e.weight : 1;
      if (!config.directed) mat[j][i] = config.weighted ? e.weight : 1;
    }

    return mat;
  }, [vertexIds, edges, config]);

  // ── Drag handlers ───────────────────────────────────────────────────────────

  const handleNodeMouseDown = useCallback(
    (id: string, e: React.MouseEvent<SVGGElement, MouseEvent>, fallbackPos: Position) => {
      e.preventDefault();
      const svg = e.currentTarget.ownerSVGElement;
      if (!svg) return;

      const pt = svg.createSVGPoint();
      pt.x = e.clientX; pt.y = e.clientY;
      const ctm = svg.getScreenCTM();
      if (!ctm) return;
      const cursor = pt.matrixTransform(ctm.inverse());

      const current = nodePositions[id] ?? fallbackPos;
      setDraggingId(id);
      setDragOffset({ x: cursor.x - current.x, y: cursor.y - current.y });
    },
    [nodePositions]
  );

  const handleSvgMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
      if (!draggingId || !dragOffset) return;
      const svg = e.currentTarget;
      const pt = svg.createSVGPoint();
      pt.x = e.clientX; pt.y = e.clientY;
      const ctm = svg.getScreenCTM();
      if (!ctm) return;
      const cursor = pt.matrixTransform(ctm.inverse());

      setNodePositions((prev) => ({
        ...prev,
        [draggingId]: { x: cursor.x - dragOffset.x, y: cursor.y - dragOffset.y },
      }));
    },
    [draggingId, dragOffset]
  );

  const handleSvgMouseUp = useCallback(() => {
    if (draggingId) setDraggingId(null);
    if (dragOffset) setDragOffset(null);
  }, [draggingId, dragOffset]);
  // ─── Visualization memo ───────────────────────────────────────────────────────

  const vizContent = useMemo(() => {
    if (vertexIds.length === 0) return null;

    const { W, H } = gridDims(vertexIds.length);
    const autoLayout = staticLayout(vertexIds, W, H);

    const positions = new Map<string, Position>();
    vertexIds.forEach((id) => {
      const override = nodePositions[id];
      if (override) positions.set(id, override);
      else {
        const base = autoLayout.get(id);
        if (base) positions.set(id, base);
      }
    });

    const ec = isDark ? "#4b5563" : "#9ca3af";

    const baseOrder = activeResult?.order ?? [];

    const shouldAnimate =
      activeResult &&
      (activeResult.type === "bfs" || activeResult.type === "dfs") &&
      animatingAlgo === activeResult.type;

    const visibleOrder =
      activeResult && activeResult.type !== "kruskal"
        ? shouldAnimate
          ? baseOrder.slice(0, Math.min(stepIndex + 1, baseOrder.length))
          : baseOrder
        : baseOrder;

    const visitedSet = new Set(visibleOrder);

    const mstSet = new Set(
      activeResult?.type === "kruskal"
        ? (activeResult.mstEdges ?? []).map((e) => [e.from, e.to].sort().join("—"))
        : []
    );

    const edgeGroups = new Map<string, Edge[]>();
    edges.forEach((e) => {
      const key = [e.from, e.to].sort().join("|");
      const group = edgeGroups.get(key) ?? [];
      group.push(e);
      edgeGroups.set(key, group);
    });

    const renderedEdges = edges
      .map((edge) => {
        const a = positions.get(edge.from);
        const b = positions.get(edge.to);
        if (!a || !b) return null;

        if (edge.from === edge.to) {
          return {
            edge,
            d: `M ${a.x - 10} ${a.y - NODE_R} a 14 12 0 1 1 20 0`,
            midX: a.x + 17,
            midY: a.y - NODE_R - 14,
          };
        }

        const hasBoth =
          config.directed &&
          edges.some((e) => e.from === edge.to && e.to === edge.from);

        const key = [edge.from, edge.to].sort().join("|");
        const group = edgeGroups.get(key) ?? [];
        const laneIndex = group.length > 1 ? group.indexOf(edge) + 1 : 0;

        return {
          edge,
          ...staticRouteEdge(
            a, b,
            config.directed,
            hasBoth,
            edge.from < edge.to,
            laneIndex
          ),
        };
      })
      .filter(Boolean) as Array<{ edge: Edge; d: string; midX: number; midY: number }>;

    const isMST = (e: Edge) => mstSet.has([e.from, e.to].sort().join("—"));

    const edgeStroke = (e: Edge) => {
      const isSelected = edgeKey(e) === selectedEdgeKey;
      if (activeResult?.type === "kruskal") {
        if (isMST(e)) return isSelected ? "#22c55e" : "#10b981";
        return isDark ? "#374151" : "#d1d5db";
      }
      if (visitedSet.has(e.from) && visitedSet.has(e.to)) return "#facc15";
      if (isSelected) return isDark ? "#e5e7eb" : "#111827";
      return ec;
    };

    const edgeStrokeW = (e: Edge) => {
      const isSelected = edgeKey(e) === selectedEdgeKey;
      if (isSelected) return 3;
      return activeResult?.type === "kruskal" ? (isMST(e) ? 2.5 : 1) : 1.6;
    };

    const edgeMarker = (e: Edge) => {
      if (!config.directed) return undefined;
      if (activeResult?.type === "kruskal" && isMST(e)) return "url(#arr-mst)";
      return visitedSet.has(e.from) && visitedSet.has(e.to)
        ? "url(#arr-vis)"
        : "url(#arr)";
    };

    const nodeFill = (id: string) => {
      if (id === dtapFirst) return isDark ? "#7c3aed" : "#8b5cf6";
      if (
        activeResult?.type === "kruskal" &&
        activeResult.mstEdges?.some((e) => e.from === id || e.to === id)
      )
        return "#10b981";
      if (visitedSet.has(id)) return "#facc15";
      if (id === selV) return "#3b82f6";
      return isDark ? "#1f2937" : "#e5e7eb";
    };

    const nodeStroke = (id: string) =>
      id === selV ? "#3b82f6" : isDark ? "#374151" : "#d1d5db";

    const nodeText = (id: string) => {
      if (id === dtapFirst) return "#fff";
      if (
        activeResult?.type === "kruskal" &&
        activeResult.mstEdges?.some((e) => e.from === id || e.to === id)
      )
        return "#fff";
      if (visitedSet.has(id)) return "#1f2937";
      if (id === selV) return "#fff";
      return isDark ? "#f9fafb" : "#1f2937";
    };

    return {
      svgWidth: W,
      svgHeight: H,
      positions,
      renderedEdges,
      edgeStroke,
      edgeStrokeW,
      edgeMarker,
      nodeFill,
      nodeStroke,
      nodeText,
    };
  }, [
    vertexIds,
    edges,
    config,
    activeResult,
    selV,
    isDark,
    nodePositions,
    stepIndex,
    animatingAlgo,
    selectedEdgeKey,
    edgeKey,
    dtapFirst,
  ]);

  // ─── Destructure vizContent ───────────────────────────────────────────────────

  const {
    svgWidth,
    svgHeight,
    positions,
    renderedEdges,
    edgeStroke,
    edgeStrokeW,
    edgeMarker,
    nodeFill,
    nodeStroke,
    nodeText,
  } = (vizContent as any) || {};

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1419] pb-28">

      {/* ── Header ── */}
      <div className="bg-white dark:bg-gray-800 rounded-b-3xl shadow-sm">
        <div className="px-4 pt-4 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Toolbox</p>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Graph Calculator</h1>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
          >
            {isDark ? <Moon className="w-4 h-4 text-gray-300" /> : <Sun className="w-4 h-4 text-yellow-500" />}
          </button>
        </div>
      </div>

      {/* ── Graph type toggles ── */}
      <div className="px-4 mt-4 flex gap-2">
        <button
          onClick={() => { setConfig((c) => ({ ...c, directed: !c.directed })); setEdges([]); }}
          className={`flex-1 py-2.5 rounded-full text-sm font-bold transition-all ${
            config.directed
              ? "bg-indigo-600 text-white"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
          }`}
        >
          {config.directed ? "Directed" : "Undirected"}
        </button>
        <button
          onClick={() => setConfig((c) => ({ ...c, weighted: !c.weighted }))}
          className={`flex-1 py-2.5 rounded-full text-sm font-bold transition-all ${
            config.weighted
              ? "bg-amber-500 text-white"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
          }`}
        >
          {config.weighted ? "Weighted" : "Unweighted"}
        </button>
      </div>

      {/* ── Build card ── */}
      <div className="px-4 mt-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">

          {/* Add Vertices */}
          <div className="px-4 pt-4 pb-3 border-b border-gray-100 dark:border-gray-700">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
              Add Vertices
            </p>
            <div className="flex gap-2">
              <div className={`flex-1 rounded-xl bg-gray-50 dark:bg-[#131820] border px-3 py-2.5 ${
                error
                  ? "border-red-400"
                  : "border-gray-200 dark:border-gray-700 focus-within:border-blue-500"
              }`}>
                <input
                  type="text"
                  value={vInput}
                  onChange={(e) => { setVInput(e.target.value); setError(null); }}
                  onKeyDown={(e) => e.key === "Enter" && addVertices()}
                  placeholder='A B C  or  "A to B, C to D"'
                  className="w-full bg-transparent text-sm font-mono text-gray-900 dark:text-white outline-none placeholder:text-gray-400 dark:placeholder:text-gray-600"
                />
              </div>
              <button
                onClick={addVertices}
                disabled={!vInput.trim()}
                className={`flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  vInput.trim()
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            {error && <p className="text-[10px] text-red-500 mt-1.5">⚠ {error}</p>}
            {vertexIds.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {vertexIds.map((id) => (
                  <span
                    key={id}
                    onClick={() => setSelV((s) => (s === id ? "" : id))}
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold cursor-pointer transition-all ${
                      id === selV
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                    }`}
                  >
                    {id}
                    <button
                      onClick={(e) => { e.stopPropagation(); removeVertex(id); }}
                      className="opacity-50 hover:opacity-100 ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Add Edge */}
          <div className="px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
              Add Edge
            </p>
            <div className="flex gap-2 items-center">
              <select
                value={eFr}
                onChange={(e) => setEFr(e.target.value)}
                className="flex-1 bg-gray-50 dark:bg-[#131820] border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm font-mono text-gray-900 dark:text-white outline-none"
              >
                <option value="">From</option>
                {vertexIds.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
              <span className="text-gray-400 text-xs font-bold">
                {config.directed ? "→" : "—"}
              </span>
              <select
                value={eTo}
                onChange={(e) => setETo(e.target.value)}
                className="flex-1 bg-gray-50 dark:bg-[#131820] border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm font-mono text-gray-900 dark:text-white outline-none"
              >
                <option value="">To</option>
                {vertexIds.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
              {config.weighted && (
                <input
                  type="number"
                  value={eWt}
                  onChange={(e) => setEWt(e.target.value)}
                  className="w-14 bg-gray-50 dark:bg-[#131820] border border-gray-200 dark:border-gray-700 rounded-xl px-2 py-2.5 text-sm font-mono text-center text-gray-900 dark:text-white outline-none"
                  placeholder="w"
                />
              )}
              <button
                onClick={addEdge}
                disabled={!eFr || !eTo}
                className={`flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  eFr && eTo
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {edges.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {edges.map((e, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    {e.from}{config.directed ? "→" : "—"}{e.to}
                    {config.weighted ? `(${e.weight})` : ""}
                    <button
                      onClick={() => removeEdge(e.from, e.to)}
                      className="opacity-50 hover:opacity-100 ml-0.5"
                    >
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
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Graph Visualization
              </h3>
              <p className="text-[10px] text-gray-400 dark:text-gray-600 mt-0.5">
                {vertexIds.length > 0
                  ? `${vertexIds.length} vertices · ${edges.length} edges · drag nodes · double-tap two nodes to connect`
                  : "Add vertices to begin"}
              </p>
            </div>
            {vertexIds.length > 0 && (
              <button
                onClick={clearAll}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-500 transition-all"
              >
                <RotateCcw className="w-3 h-3" /> Clear
              </button>
            )}
          </div>

          <div
            className="flex justify-center overflow-hidden"
            style={{ background: isDark ? "#0a0e14" : "#f9fafb" }}
          >
            {vertexIds.length === 0 || !vizContent ? (
              <div className="flex flex-col items-center justify-center h-48 gap-3">
                <Share2 className="w-10 h-10 text-gray-300 dark:text-gray-700" />
                <p className="text-sm text-gray-400 dark:text-gray-600">No vertices yet</p>
              </div>
            ) : (
              <svg
                width={svgWidth}
                height={svgHeight}
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                style={{ width: "100%", maxWidth: svgWidth, display: "block" }}
                onMouseMove={handleSvgMouseMove}
                onMouseUp={handleSvgMouseUp}
              >
                <defs>
                  <marker id="arr" markerWidth="9" markerHeight="9" refX="7" refY="3.5" orient="auto">
                    <path d="M0,0 L0,7 L9,3.5 z" fill={isDark ? "#4b5563" : "#9ca3af"} />
                  </marker>
                  <marker id="arr-vis" markerWidth="9" markerHeight="9" refX="7" refY="3.5" orient="auto">
                    <path d="M0,0 L0,7 L9,3.5 z" fill="#facc15" />
                  </marker>
                  <marker id="arr-mst" markerWidth="9" markerHeight="9" refX="7" refY="3.5" orient="auto">
                    <path d="M0,0 L0,7 L9,3.5 z" fill="#10b981" />
                  </marker>
                </defs>

                <GridBg W={svgWidth} H={svgHeight} isDark={isDark} />

                {/* ── Edges ── */}
                {renderedEdges.map((re: any, i: number) => {
                  const ek = edgeKey(re.edge);
                  const isSelected = ek === selectedEdgeKey;
                  const isEditing = ek === editingEdgeKey;

                  return (
                    <g
                      key={i}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEdgeKey((prev) => (prev === ek ? null : ek));
                        if (editingEdgeKey && editingEdgeKey !== ek) setEditingEdgeKey(null);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      {/* Edge path */}
                      <path
                        d={re.d}
                        fill="none"
                        stroke={edgeStroke(re.edge)}
                        strokeWidth={edgeStrokeW(re.edge)}
                        strokeDasharray={
                          activeResult?.type === "kruskal" && !edgeMarker(re.edge)
                            ? "4 3"
                            : undefined
                        }
                        markerEnd={edgeMarker(re.edge)}
                      />

                      {/* Weight pill / inline editor */}
                      {config.weighted && re.edge.from !== re.edge.to && (
                        <g
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isEditing) {
                              setEditingEdgeKey(ek);
                              setEditingWeight(String(re.edge.weight));
                            }
                          }}
                          style={{ cursor: isEditing ? "text" : "pointer" }}
                        >
                          <rect
                            x={re.midX - 11}
                            y={re.midY - 7}
                            width={22}
                            height={13}
                            rx={3}
                            fill={isDark ? "#0f172a" : "#f8fafc"}
                            fillOpacity={0.9}
                            stroke={isSelected ? "#3b82f6" : "transparent"}
                            strokeWidth={isSelected ? 0.8 : 0}
                          />
                          {isEditing ? (
                            <foreignObject x={re.midX - 11} y={re.midY - 7} width={22} height={13}>
                              <input
                                value={editingWeight}
                                onChange={(e) => setEditingWeight(e.target.value)}
                                onBlur={() => {
                                  const w = Number(editingWeight);
                                  if (!Number.isNaN(w)) {
                                    setEdges((prev) =>
                                      prev.map((ed) =>
                                        edgeKey(ed) === ek ? { ...ed, weight: w } : ed
                                      )
                                    );
                                  }
                                  setEditingEdgeKey(null);
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                                  if (e.key === "Escape") setEditingEdgeKey(null);
                                }}
                                className="w-full h-full text-[9px] font-mono bg-transparent text-center text-gray-800 dark:text-gray-100 outline-none"
                              />
                            </foreignObject>
                          ) : (
                            <text
                              x={re.midX}
                              y={re.midY + 2}
                              textAnchor="middle"
                              fontSize={9}
                              fontFamily="ui-monospace,monospace"
                              fill={isDark ? "#94a3b8" : "#64748b"}
                            >
                              {re.edge.weight}
                            </text>
                          )}
                        </g>
                      )}

                      {/* Inline delete chip */}
                      {isSelected && (
                        <g
                          onClick={(e) => {
                            e.stopPropagation();
                            removeEdge(re.edge.from, re.edge.to);
                            setSelectedEdgeKey(null);
                            if (editingEdgeKey === ek) setEditingEdgeKey(null);
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          <rect
                            x={re.midX + 12}
                            y={re.midY - 7}
                            width={14}
                            height={14}
                            rx={3}
                            fill={isDark ? "#111827" : "#fee2e2"}
                            stroke={isDark ? "#b91c1c" : "#ef4444"}
                            strokeWidth={0.7}
                          />
                          <text
                            x={re.midX + 19}
                            y={re.midY + 2}
                            textAnchor="middle"
                            fontSize={9}
                            fontFamily="ui-monospace,monospace"
                            fill={isDark ? "#fecaca" : "#b91c1c"}
                          >
                            ×
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}

                {/* ── Nodes ── */}
                {vertexIds.map((id) => {
                  const pos = positions.get(id);
                  if (!pos) return null;
                  const lbl = id.length > 3 ? id.slice(0, 3) : id;

                  return (
                    <g
                      key={id}
                      style={{ cursor: "pointer" }}
                      onMouseDown={(e) => handleNodeMouseDown(id, e, pos as Position)}
                      onClick={() => setSelV((s) => (s === id ? "" : id))}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        handleNodeDoubleClick(id);
                      }}
                    >
                      {id === selV && (
                        <circle
                          cx={pos.x} cy={pos.y} r={NODE_R + 5}
                          fill="none" stroke="#3b82f6" strokeWidth={2} opacity={0.3}
                        />
                      )}
                      {id === dtapFirst && (
                        <circle
                          cx={pos.x} cy={pos.y} r={NODE_R + 7}
                          fill="none" stroke="#8b5cf6" strokeWidth={2}
                          opacity={0.5}
                          strokeDasharray="4 3"
                        />
                      )}
                      <circle
                        cx={pos.x} cy={pos.y} r={NODE_R}
                        fill={nodeFill(id)}
                        stroke={nodeStroke(id)}
                        strokeWidth={id === selV ? 2 : 1.5}
                      />
                      <text
                        x={pos.x} y={pos.y}
                        textAnchor="middle" dy="0.35em"
                        fill={nodeText(id)}
                        fontSize={lbl.length > 1 ? 11 : 13}
                        fontWeight="700"
                        fontFamily="ui-monospace,monospace"
                        style={{ pointerEvents: "none", userSelect: "none" }}
                      >
                        {lbl}
                      </text>
                    </g>
                  );
                })}
              </svg>
            )}
          </div>

          {/* Legend */}
          {vertexIds.length > 0 && (
            <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-4 items-center">
              {[
                ["#3b82f6", "Selected"],
                ["#8b5cf6", "Connecting…"],
                ["#facc15", "BFS/DFS visited"],
                ["#10b981", "MST edge/node"],
              ].map(([col, lbl]) => (
                <div key={lbl as string} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ background: col as string }} />
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">{lbl as string}</span>
                </div>
              ))}
              {selectedEdgeKey && (
                <span className="text-[10px] text-blue-500 dark:text-blue-400 ml-auto">
                  Edge selected · click weight to edit · click × to delete
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Algorithm Panel ── */}
      <div className="px-4 mt-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Algorithms</h3>
            <p className="text-[10px] text-gray-400 dark:text-gray-600 mt-0.5">
              Tap BFS/DFS to replay traversal once. Edits on the graph update results instantly.
            </p>
          </div>

          {vertexIds.length > 0 && (
            <div className="px-4 pt-3 pb-2 space-y-2 border-b border-gray-100 dark:border-gray-700">
              {/* Start vertex */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1.5">
                  Start Vertex <span className="font-normal normal-case text-gray-400">(BFS / DFS)</span>
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {vertexIds.map((id) => (
                    <button
                      key={id}
                      onClick={() => setAlgoStart((s) => (s === id ? "" : id))}
                      className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold transition-all ${
                        algoStart === id
                          ? "bg-indigo-600 text-white ring-2 ring-indigo-400"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30"
                      }`}
                    >
                      {id}
                    </button>
                  ))}
                </div>
              </div>

              {/* Neighbor order */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Neighbor Order
                </span>
                {(["lvf", "hvf"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setNeighborOrder(mode)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      neighborOrder === mode
                        ? "bg-amber-500 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-amber-100 dark:hover:bg-amber-900/20"
                    }`}
                  >
                    {mode === "lvf" ? "LVF" : "HVF"}
                  </button>
                ))}
                <span className="text-[10px] text-gray-400 dark:text-gray-600">
                  {neighborOrder === "lvf"
                    ? config.weighted ? "lowest weight first" : "A → Z"
                    : config.weighted ? "highest weight first" : "Z → A"}
                </span>
              </div>
            </div>
          )}

          {vertexIds.length > 0 ? (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">

              {/* BFS row */}
              {(() => {
                const r = algoResults.bfs;
                const isActive = activeAlgo === "bfs";
                return (
                  <button
                    onClick={() => { setActiveAlgo("bfs"); setBfsRunId((n) => n + 1); }}
                    className={`w-full text-left px-4 py-3 transition-all ${
                      isActive
                        ? "bg-blue-50 dark:bg-blue-900/20"
                        : "hover:bg-gray-50 dark:hover:bg-gray-700/40"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-20 pt-0.5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${
                          isActive
                            ? "bg-blue-600 text-white"
                            : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                        }`}>
                          BFS
                        </span>
                        {r?.startVertex && (
                          <p className="text-[9px] text-gray-400 mt-1 font-mono">from {r.startVertex}</p>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        {r?.order && r.order.length > 0 ? (
                          <div className="flex flex-wrap gap-1 items-center">
                            {r.order.map((v, i) => (
                              <React.Fragment key={`${v}-${i}`}>
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 font-mono font-bold text-[10px] ring-1 ring-yellow-300/40">
                                  {v}
                                </span>
                                {i < r.order.length - 1 && (
                                  <span className="text-[9px] text-gray-300 dark:text-gray-600">→</span>
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-400 italic">—</p>
                        )}
                        <p className="text-[9px] text-gray-400 dark:text-gray-600 mt-1">
                          Queue · level-order traversal
                        </p>
                      </div>
                      <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                        isActive ? "bg-blue-500" : "bg-transparent"
                      }`} />
                    </div>
                  </button>
                );
              })()}

              {/* DFS row */}
              {(() => {
                const r = algoResults.dfs;
                const isActive = activeAlgo === "dfs";
                return (
                  <button
                    onClick={() => { setActiveAlgo("dfs"); setDfsRunId((n) => n + 1); }}
                    className={`w-full text-left px-4 py-3 transition-all ${
                      isActive
                        ? "bg-purple-50 dark:bg-purple-900/20"
                        : "hover:bg-gray-50 dark:hover:bg-gray-700/40"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-20 pt-0.5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${
                          isActive
                            ? "bg-purple-600 text-white"
                            : "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                        }`}>
                          DFS
                        </span>
                        {r?.startVertex && (
                          <p className="text-[9px] text-gray-400 mt-1 font-mono">from {r.startVertex}</p>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        {r?.order && r.order.length > 0 ? (
                          <div className="flex flex-wrap gap-1 items-center">
                            {r.order.map((v, i) => (
                              <React.Fragment key={`${v}-${i}`}>
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 font-mono font-bold text-[10px] ring-1 ring-yellow-300/40">
                                  {v}
                                </span>
                                {i < r.order.length - 1 && (
                                  <span className="text-[9px] text-gray-300 dark:text-gray-600">→</span>
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-400 italic">—</p>
                        )}
                        <p className="text-[9px] text-gray-400 dark:text-gray-600 mt-1">
                          Stack · depth-first traversal
                        </p>
                      </div>
                      <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                        isActive ? "bg-purple-500" : "bg-transparent"
                      }`} />
                    </div>
                  </button>
                );
              })()}

              {/* Kruskal row */}
              {(() => {
                const r = algoResults.kruskal;
                const isActive = activeAlgo === "kruskal";
                return (
                  <button
                    onClick={() => setActiveAlgo("kruskal")}
                    className={`w-full text-left px-4 py-3 transition-all ${
                      isActive
                        ? "bg-emerald-50 dark:bg-emerald-900/20"
                        : "hover:bg-gray-50 dark:hover:bg-gray-700/40"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-20 pt-0.5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${
                          isActive
                            ? "bg-emerald-600 text-white"
                            : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                        }`}>
                          Kruskal
                        </span>
                        {r?.possible && (
                          <span className="inline-flex items-center gap-0.5 mt-1 px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-mono font-bold text-[9px]">
                            cost {r.mstCost}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        {config.directed && (
                          <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                            Requires undirected graph
                          </p>
                        )}
                        {!config.directed && r && !r.possible && (
                          <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                            Graph is disconnected
                          </p>
                        )}
                        {!config.directed && r?.possible && (
                          <div className="flex flex-wrap gap-1 items-center">
                            {(r.mstEdges ?? []).map((e, i) => (
                              <span
                                key={`${e.from}-${e.to}-${i}`}
                                className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-300/30"
                              >
                                {e.from}—{e.to}
                                {config.weighted && <span className="opacity-60">({e.weight})</span>}
                              </span>
                            ))}
                            {(r.skippedEdges ?? []).length > 0 && (
                              <>
                                <span className="text-[9px] text-gray-300 dark:text-gray-600 mx-0.5">│</span>
                                {(r.skippedEdges ?? []).map((e, i) => (
                                  <span
                                    key={`${e.from}-${e.to}-skip-${i}`}
                                    className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[10px] font-mono bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 line-through"
                                  >
                                    {e.from}—{e.to}
                                    {config.weighted && <span className="no-underline opacity-60">({e.weight})</span>}
                                  </span>
                                ))}
                              </>
                            )}
                          </div>
                        )}
                        <p className="text-[9px] text-gray-400 dark:text-gray-600 mt-1">
                          Greedy · sort by weight · DSU · O(E log E)
                        </p>
                      </div>
                      <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                        isActive ? "bg-emerald-500" : "bg-transparent"
                      }`} />
                    </div>
                  </button>
                );
              })()}
            </div>
          ) : (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-gray-400 dark:text-gray-600">
                Add vertices to see algorithm results
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Adjacency list / matrix ── */}
      {vertexIds.length > 0 && (
        <div className="px-4 mt-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                {showMat ? "Adjacency Matrix" : "Adjacency List"}
              </h3>
              <div className="flex gap-1">
                {[
                  { icon: <List className="w-3.5 h-3.5" />, val: false },
                  { icon: <Table className="w-3.5 h-3.5" />, val: true },
                ].map(({ icon, val }) => (
                  <button
                    key={String(val)}
                    onClick={() => setShowMat(val)}
                    className={`p-2 rounded-lg transition-all ${
                      showMat === val
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {!showMat ? (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {vertexIds.map((v) => (
                  <div key={v} className="flex items-center gap-3 px-4 py-2.5">
                    <span className="w-8 text-center font-mono font-bold text-sm text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 rounded-lg py-1">
                      {v}
                    </span>
                    <span className="text-gray-400 text-xs">→</span>
                    <div className="flex flex-wrap gap-1 flex-1">
                      {(adj.get(v) ?? []).length > 0 ? (
                        (adj.get(v) ?? []).map((nb, i) => (
                          <span
                            key={`${v}-${nb}-${i}`}
                            className="px-2 py-0.5 rounded-md text-xs font-mono font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                          >
                            {nb}
                            {config.weighted && (
                              <span className="opacity-70">
                                ({edges.find((e) => e.from === v && e.to === nb)?.weight})
                              </span>
                            )}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400 italic">no edges</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-3 overflow-x-auto">
                <table className="text-xs font-mono border-collapse">
                  <thead>
                    <tr>
                      <th className="w-8 h-8" />
                      {vertexIds.map((v) => (
                        <th key={v} className="w-8 h-8 text-center text-gray-500 dark:text-gray-400 font-bold">
                          {v}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {vertexIds.map((v, i) => (
                      <tr key={v}>
                        <td className="w-8 h-8 text-center text-gray-500 dark:text-gray-400 font-bold pr-2">{v}</td>
                        {adjMat[i].map((val, j) => (
                          <td
                            key={`${i}-${j}`}
                            className={`w-8 h-8 text-center border border-gray-100 dark:border-gray-700 rounded ${
                              val !== null
                                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold"
                                : "text-gray-300 dark:text-gray-700"
                            }`}
                          >
                            {val !== null ? (config.weighted ? val : "1") : "0"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Presets ── */}
      <div className="px-4 mt-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Presets</h3>
            <p className="text-[10px] text-gray-400 dark:text-gray-600 mt-0.5">
              Tap to load a sample graph
            </p>
          </div>
          <div className="p-3 flex flex-wrap gap-2">
            {presets.map((p) => (
              <button
                key={p.label}
                onClick={() => applyPreset(p)}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-700 dark:hover:text-indigo-300 transition-all border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800"
              >
                {p.label}
                <span className="ml-1.5 text-[9px] text-gray-400 font-normal">
                  {p.directed ? "dir" : "undir"}{p.weighted ? " · w" : ""}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Copy button ── */}
      {vertexIds.length > 0 && (
        <div className="px-4 mt-4 mb-6">
          <button
            onClick={copyAll}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 transition-all shadow-sm"
          >
            {copied ? (
              <><Check className="w-4 h-4 text-emerald-500" /> Copied!</>
            ) : (
              <><Copy className="w-4 h-4" /> Copy Graph & Results</>
            )}
          </button>
        </div>
      )}

    </div>
  );
}
