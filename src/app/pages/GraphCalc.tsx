import {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";
import {
  ChevronLeft,
  HelpCircle,
  MoreVertical,
  Moon,
  Sun,
  Copy,
  Check,
  Plus,
  RotateCcw,
  Play,
  Share2,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useTheme } from "../contexts/ThemeContext";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface Edge {
  from: string;
  to: string;
  weight: number;
}

interface GraphState {
  vertices: string[];
  edges: Edge[];
  directed: boolean;
  weighted: boolean;
}

type AlgoResult = {
  type: "bfs" | "dfs" | "cycle";
  visitOrder?: string[];
  hasCycle?: boolean;
  cycleNodes?: string[];
  startVertex?: string;
};

// Physics node — position + velocity stored in a ref (not React state)
interface SimNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  pinned: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Graph algorithms
// ─────────────────────────────────────────────────────────────────────────────

function buildAdjList(
  vertices: string[],
  edges: Edge[],
  directed: boolean,
): Map<string, { neighbor: string; weight: number }[]> {
  const adj = new Map<
    string,
    { neighbor: string; weight: number }[]
  >();
  for (const v of vertices) adj.set(v, []);
  for (const e of edges) {
    adj.get(e.from)?.push({ neighbor: e.to, weight: e.weight });
    if (!directed)
      adj
        .get(e.to)
        ?.push({ neighbor: e.from, weight: e.weight });
  }
  return adj;
}

function bfsTraversal(
  vertices: string[],
  adj: Map<string, { neighbor: string; weight: number }[]>,
  startVertex: string,
): string[] {
  const visited = new Set<string>();
  const order: string[] = [];
  const sources = [
    startVertex,
    ...vertices.filter((v) => v !== startVertex),
  ];
  for (const src of sources) {
    if (visited.has(src)) continue;
    const queue = [src];
    visited.add(src);
    while (queue.length) {
      const curr = queue.shift()!;
      order.push(curr);
      for (const { neighbor } of adj.get(curr) ?? []) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
  }
  return order;
}

function dfsTraversal(
  vertices: string[],
  adj: Map<string, { neighbor: string; weight: number }[]>,
  startVertex: string,
): string[] {
  const visited = new Set<string>(),
    order: string[] = [];
  function dfs(v: string) {
    visited.add(v);
    order.push(v);
    for (const { neighbor } of adj.get(v) ?? []) {
      if (!visited.has(neighbor)) dfs(neighbor);
    }
  }
  dfs(startVertex);
  for (const v of vertices) {
    if (!visited.has(v)) dfs(v);
  }
  return order;
}

function bfsCycleUndirected(
  vertices: string[],
  adj: Map<string, { neighbor: string; weight: number }[]>,
): { hasCycle: boolean; cycleNodes: string[] } {
  const visited = new Set<string>();
  for (const src of vertices) {
    if (visited.has(src)) continue;
    const queue: [string, string | null][] = [[src, null]];
    visited.add(src);
    while (queue.length) {
      const [curr, parent] = queue.shift()!;
      for (const { neighbor } of adj.get(curr) ?? []) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push([neighbor, curr]);
        } else if (neighbor !== parent)
          return {
            hasCycle: true,
            cycleNodes: [curr, neighbor],
          };
      }
    }
  }
  return { hasCycle: false, cycleNodes: [] };
}

function bfsCycleDirected(
  vertices: string[],
  adj: Map<string, { neighbor: string; weight: number }[]>,
): { hasCycle: boolean; cycleNodes: string[] } {
  const inDegree = new Map<string, number>();
  for (const v of vertices) inDegree.set(v, 0);
  for (const v of vertices) {
    for (const { neighbor } of adj.get(v) ?? []) {
      inDegree.set(neighbor, (inDegree.get(neighbor) ?? 0) + 1);
    }
  }
  const queue: string[] = [];
  for (const v of vertices) {
    if (inDegree.get(v) === 0) queue.push(v);
  }
  let processed = 0;
  while (queue.length) {
    const curr = queue.shift()!;
    processed++;
    for (const { neighbor } of adj.get(curr) ?? []) {
      const d = (inDegree.get(neighbor) ?? 1) - 1;
      inDegree.set(neighbor, d);
      if (d === 0) queue.push(neighbor);
    }
  }
  const cycleNodes = vertices.filter(
    (v) => (inDegree.get(v) ?? 0) > 0,
  );
  return { hasCycle: processed < vertices.length, cycleNodes };
}

function buildAdjMatrix(
  vertices: string[],
  edges: Edge[],
  directed: boolean,
  weighted: boolean,
): (number | null)[][] {
  const n = vertices.length;
  const idx = new Map(vertices.map((v, i) => [v, i]));
  const mat: (number | null)[][] = Array.from(
    { length: n },
    () => Array(n).fill(null),
  );
  for (const e of edges) {
    const i = idx.get(e.from)!,
      j = idx.get(e.to)!;
    const val = weighted ? e.weight : 1;
    mat[i][j] = val;
    if (!directed) mat[j][i] = val;
  }
  return mat;
}

// ─────────────────────────────────────────────────────────────────────────────
// Force-directed simulation constants
// ─────────────────────────────────────────────────────────────────────────────
// Fix 4: Dynamic canvas — scales with vertex count so nodes always have room
// ─────────────────────────────────────────────────────────────────────────────
function canvasSize(n: number) {
  const w = Math.max(420, Math.min(n * 68, 660));
  const h = Math.max(340, Math.min(n * 58, 520));
  return { w, h, cx: w / 2, cy: h / 2, pad: NR + 10 };
}

const NR = 22; // node radius (px)

// Fix 1: Raised repulsion — was 5000, now 12000
const K_REPEL = 12000;
// Fix 2: Raised crossing penalty — was 1800, now 6000
const K_CROSSING = 6000;
const K_SPRING = 0.045; // slightly softer spring so repulsion wins near-field
const K_GRAVITY = 0.012; // gentle center pull for connected nodes
// Fix 3: Stronger gravity for isolated (degree-0) nodes so they don't drift
const K_GRAVITY0 = 0.055;
const DAMPING = 0.76;
const MAX_VEL = 8;
const SETTLE_VEL = 0.07;
const MIN_SEP = NR * 2 + 6; // Fix 6: hard minimum node separation

// ─────────────────────────────────────────────────────────────────────────────
// Force simulation (runs on refs, not state)
// ─────────────────────────────────────────────────────────────────────────────

// Fix 4+5: accepts canvas dims so L0 and boundaries scale with canvas
function initNodeAtAngle(
  n: number,
  i: number,
  cx: number,
  cy: number,
  w: number,
  h: number,
): { x: number; y: number } {
  if (n === 1) return { x: cx, y: cy };
  const angle = (2 * Math.PI * i) / n - Math.PI / 2;
  const r = Math.min(w, h) * 0.3;
  return {
    x: cx + r * Math.cos(angle) + (Math.random() - 0.5) * 10,
    y: cy + r * Math.sin(angle) + (Math.random() - 0.5) * 10,
  };
}

// ── Segment intersection test ─────────────────────────────────────────────────
function segmentsCross(
  ax: number,
  ay: number,
  bx: number,
  by: number,
  cx: number,
  cy: number,
  dx: number,
  dy: number,
): { cross: boolean; ix: number; iy: number } {
  const denom = (ax - bx) * (cy - dy) - (ay - by) * (cx - dx);
  if (Math.abs(denom) < 1e-9)
    return { cross: false, ix: 0, iy: 0 };
  const t =
    ((ax - cx) * (cy - dy) - (ay - cy) * (cx - dx)) / denom;
  const u =
    -((ax - bx) * (ay - cy) - (ay - by) * (ax - cx)) / denom;
  const ε = 0.08;
  if (t > ε && t < 1 - ε && u > ε && u < 1 - ε) {
    return {
      cross: true,
      ix: ax + t * (bx - ax),
      iy: ay + t * (by - ay),
    };
  }
  return { cross: false, ix: 0, iy: 0 };
}

function tickSimulation(
  sim: Map<string, SimNode>,
  edges: Edge[],
  vertices: string[],
  svgW: number,
  svgH: number,
  cx: number,
  cy: number,
  pad: number,
): number {
  const nodes = vertices
    .map((v) => sim.get(v)!)
    .filter(Boolean);
  // Fix 5: L0 scales with canvas width so edges breathe on larger canvases
  const L0 = Math.max(110, svgW * 0.27);

  // Fix 3: build degree map so we know which nodes are isolated
  const degree = new Map<string, number>();
  for (const v of vertices) degree.set(v, 0);
  for (const e of edges) {
    if (e.from !== e.to) {
      degree.set(e.from, (degree.get(e.from) ?? 0) + 1);
      degree.set(e.to, (degree.get(e.to) ?? 0) + 1);
    }
  }

  // ── 1. Node-node repulsion ────────────────────────────────────────────────
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i],
        b = nodes[j];
      const dx = b.x - a.x,
        dy = b.y - a.y;
      const dist2 = Math.max(dx * dx + dy * dy, 0.01);
      const dist = Math.sqrt(dist2);
      const f = K_REPEL / dist2;
      const fx = (dx / dist) * f,
        fy = (dy / dist) * f;
      if (!a.pinned) {
        a.vx -= fx;
        a.vy -= fy;
      }
      if (!b.pinned) {
        b.vx += fx;
        b.vy += fy;
      }
    }
  }

  // ── 2. Spring attraction along edges ──────────────────────────────────────
  for (const e of edges) {
    const a = sim.get(e.from),
      b = sim.get(e.to);
    if (!a || !b || e.from === e.to) continue;
    const dx = b.x - a.x,
      dy = b.y - a.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 0.1;
    const f = K_SPRING * (dist - L0);
    const fx = (dx / dist) * f,
      fy = (dy / dist) * f;
    if (!a.pinned) {
      a.vx += fx;
      a.vy += fy;
    }
    if (!b.pinned) {
      b.vx -= fx;
      b.vy -= fy;
    }
  }

  // ── 3. Edge-crossing penalty ──────────────────────────────────────────────
  const nonLoop = edges.filter((e) => e.from !== e.to);
  for (let i = 0; i < nonLoop.length; i++) {
    for (let j = i + 1; j < nonLoop.length; j++) {
      const e1 = nonLoop[i],
        e2 = nonLoop[j];
      if (
        e1.from === e2.from ||
        e1.from === e2.to ||
        e1.to === e2.from ||
        e1.to === e2.to
      )
        continue;
      const a = sim.get(e1.from),
        b = sim.get(e1.to);
      const c = sim.get(e2.from),
        d = sim.get(e2.to);
      if (!a || !b || !c || !d) continue;
      const { cross, ix, iy } = segmentsCross(
        a.x,
        a.y,
        b.x,
        b.y,
        c.x,
        c.y,
        d.x,
        d.y,
      );
      if (!cross) continue;
      for (const [node, nx, ny] of [
        [a, a.x, a.y],
        [b, b.x, b.y],
        [c, c.x, c.y],
        [d, d.x, d.y],
      ] as [SimNode, number, number][]) {
        if (node.pinned) continue;
        const ddx = nx - ix,
          ddy = ny - iy;
        const ddist = Math.sqrt(ddx * ddx + ddy * ddy) || 1;
        const strength = K_CROSSING / (ddist + 25);
        node.vx += (ddx / ddist) * strength;
        node.vy += (ddy / ddist) * strength;
      }
    }
  }

  // ── 4. Integrate: gravity + damping + clamp + boundary ───────────────────
  let maxVel = 0;
  for (const v of vertices) {
    const node = sim.get(v);
    if (!node || node.pinned) continue;
    // Fix 3: isolated nodes get pulled harder to center so they don't drift
    const g =
      (degree.get(v) ?? 0) === 0 ? K_GRAVITY0 : K_GRAVITY;
    node.vx += g * (cx - node.x);
    node.vy += g * (cy - node.y);
    node.vx *= DAMPING;
    node.vy *= DAMPING;
    const speed = Math.sqrt(
      node.vx * node.vx + node.vy * node.vy,
    );
    if (speed > MAX_VEL) {
      node.vx *= MAX_VEL / speed;
      node.vy *= MAX_VEL / speed;
    }
    node.x += node.vx;
    node.y += node.vy;
    if (node.x < pad) {
      node.x = pad;
      node.vx = Math.abs(node.vx) * 0.4;
    }
    if (node.x > svgW - pad) {
      node.x = svgW - pad;
      node.vx = -Math.abs(node.vx) * 0.4;
    }
    if (node.y < pad) {
      node.y = pad;
      node.vy = Math.abs(node.vy) * 0.4;
    }
    if (node.y > svgH - pad) {
      node.y = svgH - pad;
      node.vy = -Math.abs(node.vy) * 0.4;
    }
    maxVel = Math.max(maxVel, speed);
  }

  // ── 5. Fix 6: Hard separation — prevent node body overlap ────────────────
  // Applied as a position correction after velocity integration so that
  // overlapping nodes are pushed apart regardless of force magnitude.
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i],
        b = nodes[j];
      const dx = b.x - a.x,
        dy = b.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 0.1;
      if (dist < MIN_SEP) {
        const overlap = (MIN_SEP - dist) / 2;
        const ux = dx / dist,
          uy = dy / dist;
        if (!a.pinned) {
          a.x -= ux * overlap;
          a.y -= uy * overlap;
        }
        if (!b.pinned) {
          b.x += ux * overlap;
          b.y += uy * overlap;
        }
      }
    }
  }

  return maxVel;
}

// ─────────────────────────────────────────────────────────────────────────────
// Arrow marker defs
// ─────────────────────────────────────────────────────────────────────────────

function ArrowDefs({ edgeColor }: { edgeColor: string }) {
  return (
    <defs>
      <marker
        id="arr"
        markerWidth="8"
        markerHeight="8"
        refX="6"
        refY="3"
        orient="auto"
      >
        <path d="M0,0 L0,6 L8,3 z" fill={edgeColor} />
      </marker>
      <marker
        id="arr-cycle"
        markerWidth="8"
        markerHeight="8"
        refX="6"
        refY="3"
        orient="auto"
      >
        <path d="M0,0 L0,6 L8,3 z" fill="#ef4444" />
      </marker>
    </defs>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Edge rendering — every edge is always a quadratic Bézier curve.
//
// Curvature strategy:
//  1. Each edge gets a base curvature derived from its index in the sorted
//     edge list, ensuring consistent direction across re-renders.
//  2. Detected crossing pairs are assigned opposite curvature signs so they
//     bow away from each other visually even when the physics hasn't fully
//     resolved the layout.
//  3. Bidirectional directed pairs (A→B + B→A) always curve to opposite sides.
//  4. Multiple edges between the same pair fan outward in increasing offsets.
//
// MIN_CURVE ensures no edge is ever a straight line.
// ─────────────────────────────────────────────────────────────────────────────

const MIN_CURVE = 18; // baseline curvature for every edge (px)
const CROSS_CURVE = 42; // extra curvature applied to each side of a crossing pair

function renderEdges(
  graph: GraphState,
  sim: Map<string, SimNode>,
  cycleSet: Set<string>,
  algoType: string | undefined,
  edgeColor: string,
  isDark: boolean,
): React.ReactNode[] {
  const nonLoopEdges = graph.edges.filter(
    (e) => e.from !== e.to,
  );

  // ── Step 1: assign a deterministic curvature sign per edge ───────────────
  // Uses the sorted vertex-pair canonical key so the same edge always curves
  // the same way regardless of insertion order.
  const curvatureSign = new Map<Edge, number>();
  for (const e of nonLoopEdges) {
    const canonical = [e.from, e.to].sort().join("");
    // Hash the canonical key to a stable +1 / -1
    let h = 0;
    for (let i = 0; i < canonical.length; i++)
      h = (h * 31 + canonical.charCodeAt(i)) & 0xffff;
    curvatureSign.set(e, h % 2 === 0 ? 1 : -1);
  }

  // ── Step 2: group by canonical pair so parallel edges fan outward ─────────
  const pairGroups = new Map<string, Edge[]>();
  for (const e of nonLoopEdges) {
    const key = graph.directed
      ? `${e.from}||${e.to}`
      : [e.from, e.to].sort().join("||");
    if (!pairGroups.has(key)) pairGroups.set(key, []);
    pairGroups.get(key)!.push(e);
  }

  // ── Step 3: detect crossings and flip curvature for crossing pairs ────────
  // For each crossing pair (e1, e2), we increase curvature and apply opposite
  // signs so both edges bow away from the intersection point.
  const crossBoost = new Map<Edge, number>(); // extra curvature magnitude
  const crossFlip = new Map<Edge, number>(); // +1 or -1 override for crossing pairs

  for (let i = 0; i < nonLoopEdges.length; i++) {
    for (let j = i + 1; j < nonLoopEdges.length; j++) {
      const e1 = nonLoopEdges[i],
        e2 = nonLoopEdges[j];
      if (
        e1.from === e2.from ||
        e1.from === e2.to ||
        e1.to === e2.from ||
        e1.to === e2.to
      )
        continue;
      const a = sim.get(e1.from),
        b = sim.get(e1.to);
      const c = sim.get(e2.from),
        d = sim.get(e2.to);
      if (!a || !b || !c || !d) continue;
      const { cross } = segmentsCross(
        a.x,
        a.y,
        b.x,
        b.y,
        c.x,
        c.y,
        d.x,
        d.y,
      );
      if (!cross) continue;
      // Boost both edges and assign opposite flip directions
      crossBoost.set(e1, CROSS_CURVE);
      crossBoost.set(e2, CROSS_CURVE);
      crossFlip.set(e1, 1);
      crossFlip.set(e2, -1);
    }
  }

  // ── Step 4: render ────────────────────────────────────────────────────────
  const nodes: React.ReactNode[] = [];

  // Self-loops first
  for (const edge of graph.edges.filter(
    (e) => e.from === e.to,
  )) {
    const ap = sim.get(edge.from);
    if (!ap) continue;
    nodes.push(
      <g key={`self-${edge.from}`}>
        <ellipse
          cx={ap.x}
          cy={ap.y - NR - 10}
          rx={13}
          ry={11}
          fill="none"
          stroke={edgeColor}
          strokeWidth={1.5}
          markerEnd={graph.directed ? "url(#arr)" : undefined}
        />
        {graph.weighted && (
          <text
            x={ap.x + 16}
            y={ap.y - NR - 14}
            fontSize={9}
            fill={isDark ? "#9ca3af" : "#6b7280"}
            fontFamily="ui-monospace, monospace"
          >
            {edge.weight}
          </text>
        )}
      </g>,
    );
  }

  // Regular edges — always Bézier
  for (const [, edgeGroup] of pairGroups) {
    const groupSize = edgeGroup.length;
    // For directed: check if the reverse pair exists
    const firstEdge = edgeGroup[0];
    const reverseKey = graph.directed
      ? `${firstEdge.to}||${firstEdge.from}`
      : null;
    const reverseExists = reverseKey
      ? pairGroups.has(reverseKey)
      : false;

    edgeGroup.forEach((edge, groupIdx) => {
      const ap = sim.get(edge.from),
        bp = sim.get(edge.to);
      if (!ap || !bp) return;

      const dx = bp.x - ap.x,
        dy = bp.y - ap.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const ux = dx / dist,
        uy = dy / dist;
      const px = -uy,
        py = ux; // perpendicular unit vector

      // Curvature magnitude:
      // - MIN_CURVE always applied (no straight lines)
      // - Crossing pairs get CROSS_CURVE added
      // - Parallel edges in same group fan out by groupIdx * spread
      const baseMag = MIN_CURVE + (crossBoost.get(edge) ?? 0);
      const fanMag =
        groupSize > 1 ? 28 * Math.ceil((groupIdx + 1) / 2) : 0;
      const totalMag = baseMag + fanMag;

      // Sign: crossing flip > parallel fan > canonical hash
      let sign: number;
      if (crossFlip.has(edge)) {
        sign = crossFlip.get(edge)!;
      } else if (groupSize > 1) {
        sign = groupIdx % 2 === 0 ? 1 : -1;
      } else if (reverseExists) {
        // Consistent sign for one side of a bidirectional pair
        sign = 1; // reverse pair will come from opposite pairGroup with sign -1
      } else {
        sign = curvatureSign.get(edge) ?? 1;
      }

      // For reverse-pair edges, the second direction should go opposite
      // We detect it by checking if from > to alphabetically
      if (reverseExists && !crossFlip.has(edge)) {
        sign = edge.from < edge.to ? 1 : -1;
      }

      const curvature = sign * totalMag;

      const arrowPad = graph.directed ? 9 : 0;
      const sx = ap.x + ux * NR,
        sy = ap.y + uy * NR;
      const ex = bp.x - ux * (NR + arrowPad),
        ey = bp.y - uy * (NR + arrowPad);
      const mx = (sx + ex) / 2,
        my = (sy + ey) / 2;
      const cpx = mx + px * curvature,
        cpy = my + py * curvature;

      const isCycleEdge =
        cycleSet.has(edge.from) &&
        cycleSet.has(edge.to) &&
        algoType === "cycle";
      const stroke = isCycleEdge ? "#ef4444" : edgeColor;
      const marker = isCycleEdge
        ? "url(#arr-cycle)"
        : "url(#arr)";

      nodes.push(
        <g key={`edge-${edge.from}-${edge.to}-${groupIdx}`}>
          <path
            d={`M${sx},${sy} Q${cpx},${cpy} ${ex},${ey}`}
            fill="none"
            stroke={stroke}
            strokeWidth={1.5}
            markerEnd={graph.directed ? marker : undefined}
          />
          {graph.weighted && (
            <text
              x={cpx}
              y={cpy - 5}
              fontSize={9}
              textAnchor="middle"
              fill={isDark ? "#9ca3af" : "#6b7280"}
              fontFamily="ui-monospace, monospace"
            >
              {edge.weight}
            </text>
          )}
        </g>,
      );
    });
  }

  return nodes;
}

// ─────────────────────────────────────────────────────────────────────────────
// GraphSVG — uses simulated positions, supports drag
// ─────────────────────────────────────────────────────────────────────────────

function GraphSVG({
  graph,
  simRef,
  renderTick,
  algoResult,
  highlightStep,
  isDark,
  onVertexClick,
  selectedVertex,
  onDragStart,
  onDragMove,
  onDragEnd,
  svgW,
  svgH,
}: {
  graph: GraphState;
  simRef: React.MutableRefObject<Map<string, SimNode>>;
  renderTick: number;
  algoResult: AlgoResult | null;
  highlightStep: number;
  isDark: boolean;
  onVertexClick: (v: string) => void;
  selectedVertex: string;
  onDragStart: (v: string, e: React.PointerEvent) => void;
  onDragMove: (e: React.PointerEvent) => void;
  onDragEnd: () => void;
  svgW: number;
  svgH: number;
}) {
  void renderTick; // consumed to trigger re-render

  if (graph.vertices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-52 gap-3">
        <Share2 className="w-10 h-10 text-gray-300 dark:text-gray-700" />
        <p className="text-sm text-gray-400 dark:text-gray-600">
          Add vertices and edges above
        </p>
      </div>
    );
  }

  const edgeColor = isDark ? "#4b5563" : "#9ca3af";
  const visitedSet = new Set(
    algoResult?.visitOrder?.slice(0, highlightStep + 1) ?? [],
  );
  const cycleSet = new Set(algoResult?.cycleNodes ?? []);

  const getNodeFill = (v: string) => {
    if (algoResult?.type === "cycle" && cycleSet.has(v))
      return "#ef4444";
    if (visitedSet.has(v)) return "#facc15";
    if (v === selectedVertex) return "#3b82f6";
    return isDark ? "#374151" : "#e5e7eb";
  };
  const getNodeText = (v: string) => {
    if (
      (algoResult?.type === "cycle" && cycleSet.has(v)) ||
      visitedSet.has(v)
    )
      return "#1f2937";
    if (v === selectedVertex) return "#ffffff";
    return isDark ? "#f9fafb" : "#1f2937";
  };

  const edges = renderEdges(
    graph,
    simRef.current,
    cycleSet,
    algoResult?.type,
    edgeColor,
    isDark,
  );

  return (
    <svg
      width={svgW}
      height={svgH}
      viewBox={`0 0 ${svgW} ${svgH}`}
      style={{
        width: "100%",
        maxWidth: svgW,
        touchAction: "none",
      }}
      onPointerMove={onDragMove}
      onPointerUp={onDragEnd}
      onPointerLeave={onDragEnd}
    >
      <ArrowDefs edgeColor={edgeColor} />
      {edges}
      {graph.vertices.map((v) => {
        const node = simRef.current.get(v);
        if (!node) return null;
        const fill = getNodeFill(v);
        const textFill = getNodeText(v);
        const lbl = v.length > 3 ? v.slice(0, 3) : v;
        const isSel = v === selectedVertex;
        return (
          <g
            key={v}
            style={{ cursor: "grab" }}
            onPointerDown={(e) => {
              e.stopPropagation();
              onDragStart(v, e);
            }}
            onClick={() => onVertexClick(v)}
          >
            {isSel && (
              <circle
                cx={node.x}
                cy={node.y}
                r={NR + 5}
                fill="none"
                stroke="#3b82f6"
                strokeWidth={2}
                opacity={0.35}
              />
            )}
            <circle
              cx={node.x}
              cy={node.y}
              r={NR}
              fill={fill}
              stroke={
                isSel
                  ? "#3b82f6"
                  : isDark
                    ? "#4b5563"
                    : "#d1d5db"
              }
              strokeWidth={isSel ? 2 : 1.5}
            />
            <text
              x={node.x}
              y={node.y}
              textAnchor="middle"
              dy="0.35em"
              fill={textFill}
              fontSize={lbl.length > 1 ? 11 : 13}
              fontWeight="700"
              fontFamily="ui-monospace, monospace"
              style={{
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              {lbl}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

export function GraphCalculator() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  // Graph state
  const [graph, setGraph] = useState<GraphState>({
    vertices: [],
    edges: [],
    directed: false,
    weighted: false,
  });

  // Input
  const [vertexInput, setVertexInput] = useState("");
  const [edgeFrom, setEdgeFrom] = useState("");
  const [edgeTo, setEdgeTo] = useState("");
  const [edgeWeight, setEdgeWeight] = useState("1");
  const [inputError, setInputError] = useState<string | null>(
    null,
  );

  // Algo
  const [selectedVertex, setSelectedVertex] = useState("");
  const [algoResult, setAlgoResult] =
    useState<AlgoResult | null>(null);
  const [highlightStep, setHighlightStep] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const playRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );

  const [copied, setCopied] = useState(false);
  const [showMatrix, setShowMatrix] = useState(false);

  // ── Force simulation refs ─────────────────────────────────────────────────
  const simRef = useRef<Map<string, SimNode>>(new Map());
  const rafRef = useRef<number>(0);
  const [renderTick, setRenderTick] = useState(0);

  // Fix 4: dynamic canvas — recompute whenever vertex count changes
  const {
    w: svgW,
    h: svgH,
    cx,
    cy,
    pad,
  } = useMemo(
    () => canvasSize(graph.vertices.length),
    [graph.vertices.length],
  );

  // Drag
  const dragRef = useRef<{
    vertex: string;
    svgRect: DOMRect;
  } | null>(null);
  const svgContainerRef = useRef<HTMLDivElement>(null);

  // ── Initialize / sync sim when vertices change ────────────────────────────
  useEffect(() => {
    const sim = simRef.current;
    const verts = graph.vertices;
    for (const k of sim.keys()) {
      if (!verts.includes(k)) sim.delete(k);
    }
    const newVerts = verts.filter((v) => !sim.has(v));
    newVerts.forEach((v) => {
      // Fix 4+5: pass canvas dims so initial placement scales correctly
      const pos = initNodeAtAngle(
        Math.max(verts.length, 1),
        verts.indexOf(v),
        cx,
        cy,
        svgW,
        svgH,
      );
      sim.set(v, {
        x: pos.x,
        y: pos.y,
        vx: 0,
        vy: 0,
        pinned: false,
      });
    });
    for (const node of sim.values()) {
      node.vx += (Math.random() - 0.5) * 4;
      node.vy += (Math.random() - 0.5) * 4;
    }
    startSimulation();
  }, [graph.vertices, svgW, svgH]);

  // Re-kick sim on edge changes with bigger jolt so crossing forces engage
  useEffect(() => {
    for (const node of simRef.current.values()) {
      node.vx += (Math.random() - 0.5) * 5;
      node.vy += (Math.random() - 0.5) * 5;
    }
    startSimulation();
  }, [graph.edges]);

  function startSimulation() {
    cancelAnimationFrame(rafRef.current);
    let warmUp = 60; // first 60 frames run more substeps to resolve crossings fast
    function tick() {
      const SUBSTEPS =
        warmUp > 0 ? 6 : graph.edges.length > 0 ? 3 : 2;
      warmUp = Math.max(0, warmUp - 1);
      let maxVel = 0;
      for (let s = 0; s < SUBSTEPS; s++) {
        maxVel = tickSimulation(
          simRef.current,
          graph.edges,
          graph.vertices,
          svgW,
          svgH,
          cx,
          cy,
          pad,
        );
      }
      setRenderTick((t) => t + 1);
      if (maxVel > SETTLE_VEL)
        rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
  }

  // Cleanup RAF on unmount
  useEffect(
    () => () => cancelAnimationFrame(rafRef.current),
    [],
  );

  // ── Drag handlers ─────────────────────────────────────────────────────────
  const handleDragStart = useCallback(
    (v: string, e: React.PointerEvent) => {
      const svgEl = svgContainerRef.current;
      if (!svgEl) return;
      (e.currentTarget as SVGGElement).setPointerCapture(
        e.pointerId,
      );
      dragRef.current = {
        vertex: v,
        svgRect: svgEl.getBoundingClientRect(),
      };
      const node = simRef.current.get(v);
      if (node) {
        node.pinned = true;
        node.vx = 0;
        node.vy = 0;
      }
    },
    [],
  );

  const handleDragMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragRef.current) return;
      const { vertex, svgRect } = dragRef.current;
      const node = simRef.current.get(vertex);
      if (!node) return;
      const scaleX = svgW / svgRect.width;
      const scaleY = svgH / svgRect.height;
      node.x = Math.max(
        pad,
        Math.min(
          svgW - pad,
          (e.clientX - svgRect.left) * scaleX,
        ),
      );
      node.y = Math.max(
        pad,
        Math.min(
          svgH - pad,
          (e.clientY - svgRect.top) * scaleY,
        ),
      );
      node.vx = 0;
      node.vy = 0;
      setRenderTick((t) => t + 1);
    },
    [svgW, svgH, pad],
  );

  const handleDragEnd = useCallback(() => {
    if (!dragRef.current) return;
    const node = simRef.current.get(dragRef.current.vertex);
    if (node) {
      node.pinned = false;
      node.vx = 0;
      node.vy = 0;
    }
    dragRef.current = null;
    // Resume simulation after drag
    startSimulation();
  }, [graph.edges, graph.vertices]);

  // ── Derived ───────────────────────────────────────────────────────────────
  const adj = useMemo(
    () =>
      buildAdjList(graph.vertices, graph.edges, graph.directed),
    [graph],
  );
  const adjMatrix = useMemo(
    () =>
      buildAdjMatrix(
        graph.vertices,
        graph.edges,
        graph.directed,
        graph.weighted,
      ),
    [graph],
  );

  // ── Add vertex ─────────────────────────────────────────────────────────────
  const handleAddVertex = useCallback(() => {
    const tokens = vertexInput
      .split(/[\s,;]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (!tokens.length) return;
    setInputError(null);
    const dupes = tokens.filter((t) =>
      graph.vertices.includes(t),
    );
    const toAdd = tokens.filter(
      (t) => !graph.vertices.includes(t),
    );
    if (!toAdd.length) {
      setInputError(`Already exists: ${dupes.join(", ")}`);
      return;
    }
    setGraph((g) => ({
      ...g,
      vertices: [...g.vertices, ...toAdd],
    }));
    setVertexInput("");
    if (dupes.length)
      setInputError(`Skipped duplicates: ${dupes.join(", ")}`);
  }, [vertexInput, graph.vertices]);

  const handleRemoveVertex = useCallback(
    (v: string) => {
      setGraph((g) => ({
        ...g,
        vertices: g.vertices.filter((x) => x !== v),
        edges: g.edges.filter(
          (e) => e.from !== v && e.to !== v,
        ),
      }));
      if (selectedVertex === v) setSelectedVertex("");
      setAlgoResult(null);
      setHighlightStep(-1);
    },
    [selectedVertex],
  );

  const handleAddEdge = useCallback(() => {
    const f = edgeFrom.trim(),
      t = edgeTo.trim();
    if (!f || !t) {
      setInputError("Select both vertices");
      return;
    }
    if (!graph.vertices.includes(f)) {
      setInputError(`Vertex "${f}" not found`);
      return;
    }
    if (!graph.vertices.includes(t)) {
      setInputError(`Vertex "${t}" not found`);
      return;
    }
    const w = Number(edgeWeight) || 1;
    const exists = graph.edges.some(
      (e) =>
        (e.from === f && e.to === t) ||
        (!graph.directed && e.from === t && e.to === f),
    );
    if (exists) {
      setInputError(`Edge ${f}→${t} already exists`);
      return;
    }
    setInputError(null);
    setGraph((g) => ({
      ...g,
      edges: [...g.edges, { from: f, to: t, weight: w }],
    }));
    setAlgoResult(null);
    setHighlightStep(-1);
  }, [edgeFrom, edgeTo, edgeWeight, graph]);

  const handleRemoveEdge = useCallback((e: Edge) => {
    setGraph((g) => ({
      ...g,
      edges: g.edges.filter(
        (x) => !(x.from === e.from && x.to === e.to),
      ),
    }));
    setAlgoResult(null);
    setHighlightStep(-1);
  }, []);

  const handleVertexClick = useCallback((v: string) => {
    setSelectedVertex((prev) => (prev === v ? "" : v));
    setAlgoResult(null);
    setHighlightStep(-1);
    if (playRef.current) clearInterval(playRef.current);
    setIsPlaying(false);
  }, []);

  // ── Algorithms ─────────────────────────────────────────────────────────────
  const runAlgo = useCallback(
    (type: "bfs" | "dfs" | "cycle") => {
      if (!graph.vertices.length) return;
      if (playRef.current) clearInterval(playRef.current);
      setIsPlaying(false);
      setHighlightStep(-1);
      const start = selectedVertex || graph.vertices[0];
      if (type === "bfs") {
        setAlgoResult({
          type: "bfs",
          visitOrder: bfsTraversal(graph.vertices, adj, start),
          startVertex: start,
        });
      } else if (type === "dfs") {
        setAlgoResult({
          type: "dfs",
          visitOrder: dfsTraversal(graph.vertices, adj, start),
          startVertex: start,
        });
      } else {
        const res = graph.directed
          ? bfsCycleDirected(graph.vertices, adj)
          : bfsCycleUndirected(graph.vertices, adj);
        setAlgoResult({ type: "cycle", ...res });
      }
    },
    [graph, adj, selectedVertex],
  );

  const startPlay = useCallback(() => {
    if (!algoResult?.visitOrder?.length) return;
    setHighlightStep(0);
    setIsPlaying(true);
    let step = 0;
    playRef.current = setInterval(() => {
      step++;
      if (step >= (algoResult.visitOrder?.length ?? 0)) {
        clearInterval(playRef.current!);
        setIsPlaying(false);
        setHighlightStep(
          (algoResult.visitOrder?.length ?? 1) - 1,
        );
      } else setHighlightStep(step);
    }, 700);
  }, [algoResult]);

  const stopPlay = useCallback(() => {
    if (playRef.current) clearInterval(playRef.current);
    setIsPlaying(false);
  }, []);

  const copyOutput = useCallback(async () => {
    const lines = [
      `Graph — ${graph.directed ? "Directed" : "Undirected"}${graph.weighted ? ", Weighted" : ""}`,
      `Vertices: ${graph.vertices.join(", ")}`,
      `Edges: ${graph.edges.map((e) => (graph.weighted ? `${e.from}→${e.to}(${e.weight})` : `${e.from}→${e.to}`)).join(", ")}`,
      "",
      "Adjacency List:",
      ...graph.vertices.map((v) => {
        const nb =
          adj
            .get(v)
            ?.map((n) =>
              graph.weighted
                ? `${n.neighbor}(${n.weight})`
                : n.neighbor,
            )
            .join(", ") || "—";
        return `  ${v}: [${nb}]`;
      }),
    ];
    if (algoResult) {
      lines.push("");
      if (algoResult.type !== "cycle")
        lines.push(
          `${algoResult.type.toUpperCase()} from ${algoResult.startVertex}: ${algoResult.visitOrder?.join(" → ")}`,
        );
      else
        lines.push(
          `Cycle (BFS): ${algoResult.hasCycle ? `FOUND — ${algoResult.cycleNodes?.join(", ")}` : "None"}`,
        );
    }
    await navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [graph, adj, algoResult]);

  const toggleDirected = () => {
    setGraph((g) => ({
      ...g,
      directed: !g.directed,
      edges: [],
    }));
    setAlgoResult(null);
    setHighlightStep(-1);
  };
  const toggleWeighted = () =>
    setGraph((g) => ({ ...g, weighted: !g.weighted }));

  const clearAll = () => {
    setGraph((g) => ({ ...g, vertices: [], edges: [] }));
    setAlgoResult(null);
    setHighlightStep(-1);
    setSelectedVertex("");
    if (playRef.current) clearInterval(playRef.current);
    setIsPlaying(false);
  };

  const applyPreset = (p: GraphState) => {
    setGraph(p);
    setAlgoResult(null);
    setHighlightStep(-1);
    setSelectedVertex(p.vertices[0] ?? "");
  };

  const presets: { label: string } & GraphState[] = [
    {
      label: "Simple cycle",
      directed: false,
      weighted: false,
      vertices: ["A", "B", "C", "D"],
      edges: [
        { from: "A", to: "B", weight: 1 },
        { from: "B", to: "C", weight: 1 },
        { from: "C", to: "D", weight: 1 },
        { from: "D", to: "A", weight: 1 },
      ],
    },
    {
      label: "Directed DAG",
      directed: true,
      weighted: false,
      vertices: ["A", "B", "C", "D", "E"],
      edges: [
        { from: "A", to: "B", weight: 1 },
        { from: "A", to: "C", weight: 1 },
        { from: "B", to: "D", weight: 1 },
        { from: "C", to: "D", weight: 1 },
        { from: "D", to: "E", weight: 1 },
      ],
    },
    {
      label: "Weighted",
      directed: false,
      weighted: true,
      vertices: ["A", "B", "C", "D", "E"],
      edges: [
        { from: "A", to: "B", weight: 4 },
        { from: "A", to: "C", weight: 2 },
        { from: "B", to: "C", weight: 1 },
        { from: "B", to: "D", weight: 5 },
        { from: "C", to: "E", weight: 8 },
        { from: "D", to: "E", weight: 2 },
      ],
    },
    {
      label: "Directed cycle",
      directed: true,
      weighted: false,
      vertices: ["A", "B", "C", "D"],
      edges: [
        { from: "A", to: "B", weight: 1 },
        { from: "B", to: "C", weight: 1 },
        { from: "C", to: "D", weight: 1 },
        { from: "D", to: "B", weight: 1 },
      ],
    },
    {
      label: "Disconnected",
      directed: false,
      weighted: false,
      vertices: ["A", "B", "C", "D", "E", "F"],
      edges: [
        { from: "A", to: "B", weight: 1 },
        { from: "B", to: "C", weight: 1 },
        { from: "D", to: "E", weight: 1 },
      ],
    },
  ] as any;

  const hasResult = !!algoResult;
  const visitOrder = algoResult?.visitOrder ?? [];
  const maxStep = visitOrder.length - 1;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1419] pb-28">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-gray-800 rounded-b-3xl shadow-sm pb-4">
        <div className="px-4 pt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
            <div>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Toolbox
              </p>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Graph Calculator
              </h1>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
            >
              {isDark ? (
                <Moon className="w-4 h-4 text-gray-300" />
              ) : (
                <Sun className="w-4 h-4 text-yellow-600" />
              )}
            </button>
            <button className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
              <HelpCircle className="w-4 h-4 text-gray-700 dark:text-gray-300" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all">
              <MoreVertical className="w-4 h-4 text-gray-700 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Graph type toggles ─────────────────────────────────────────────── */}
      <div className="px-4 mt-4 flex gap-2">
        <button
          onClick={toggleDirected}
          className={`flex-1 py-2.5 rounded-full text-sm font-bold transition-all ${graph.directed ? "bg-indigo-600 text-white shadow-sm" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"}`}
        >
          {graph.directed ? "Directed" : "Undirected"}
        </button>
        <button
          onClick={toggleWeighted}
          className={`flex-1 py-2.5 rounded-full text-sm font-bold transition-all ${graph.weighted ? "bg-amber-500 text-white shadow-sm" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"}`}
        >
          {graph.weighted ? "Weighted" : "Unweighted"}
        </button>
      </div>
      <p className="text-[10px] text-gray-400 dark:text-gray-600 text-center mt-1.5">
        {graph.directed
          ? "One-way edges · switching clears edges"
          : "Two-way edges"}{" "}
        ·{" "}
        {graph.weighted
          ? "Weight labels shown"
          : "All weights = 1"}
      </p>

      {/* ── Build card ─────────────────────────────────────────────────────── */}
      <div className="px-4 mt-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Add vertices */}
          <div className="px-4 pt-4 pb-3 border-b border-gray-100 dark:border-gray-700">
            <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
              Add Vertices
            </p>
            <div className="flex gap-2">
              <div
                className={`flex-1 rounded-xl bg-gray-50 dark:bg-[#131820] border px-3 py-2.5 ${inputError ? "border-red-400 dark:border-red-500" : "border-gray-200 dark:border-gray-700 focus-within:border-blue-500"}`}
              >
                <input
                  type="text"
                  value={vertexInput}
                  onChange={(e) => {
                    setVertexInput(e.target.value);
                    setInputError(null);
                  }}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleAddVertex()
                  }
                  placeholder="A, B, C  or  A B C"
                  className="w-full bg-transparent text-sm font-mono text-gray-900 dark:text-white outline-none placeholder:text-gray-400 dark:placeholder:text-gray-600"
                />
              </div>
              <button
                onClick={handleAddVertex}
                disabled={!vertexInput.trim()}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${vertexInput.trim() ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm active:scale-[0.98]" : "bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed"}`}
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            {inputError && (
              <p className="text-[10px] text-red-500 mt-1.5">
                ⚠ {inputError}
              </p>
            )}
            {graph.vertices.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {graph.vertices.map((v) => (
                  <span
                    key={v}
                    onClick={() => handleVertexClick(v)}
                    className={`group inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold cursor-pointer transition-all ${v === selectedVertex ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/30"}`}
                  >
                    {v}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveVertex(v);
                      }}
                      className="ml-0.5 opacity-50 hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Add edges */}
          <div className="px-4 py-3">
            <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
              Add Edge
            </p>
            <div className="flex gap-2 items-center">
              <select
                value={edgeFrom}
                onChange={(e) => setEdgeFrom(e.target.value)}
                className="flex-1 bg-gray-50 dark:bg-[#131820] border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm font-mono text-gray-900 dark:text-white outline-none"
              >
                <option value="">From</option>
                {graph.vertices.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
              <span className="text-gray-400 dark:text-gray-600 text-xs font-bold">
                {graph.directed ? "→" : "—"}
              </span>
              <select
                value={edgeTo}
                onChange={(e) => setEdgeTo(e.target.value)}
                className="flex-1 bg-gray-50 dark:bg-[#131820] border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm font-mono text-gray-900 dark:text-white outline-none"
              >
                <option value="">To</option>
                {graph.vertices.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
              {graph.weighted && (
                <input
                  type="number"
                  value={edgeWeight}
                  onChange={(e) =>
                    setEdgeWeight(e.target.value)
                  }
                  className="w-14 bg-gray-50 dark:bg-[#131820] border border-gray-200 dark:border-gray-700 rounded-xl px-2 py-2.5 text-sm font-mono text-gray-900 dark:text-white outline-none text-center"
                  placeholder="w"
                />
              )}
              <button
                onClick={handleAddEdge}
                disabled={!edgeFrom || !edgeTo}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${edgeFrom && edgeTo ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm active:scale-[0.98]" : "bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed"}`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {graph.edges.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {graph.edges.map((e, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    {e.from}
                    {graph.directed ? "→" : "—"}
                    {e.to}
                    {graph.weighted ? `(${e.weight})` : ""}
                    <button
                      onClick={() => handleRemoveEdge(e)}
                      className="opacity-50 hover:opacity-100 ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Visualization ─────────────────────────────────────────────────── */}
      <div className="px-4 mt-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Graph Visualization
              </h3>
              <p className="text-[10px] text-gray-400 dark:text-gray-600 mt-0.5">
                {graph.vertices.length > 0
                  ? selectedVertex
                    ? `Start: ${selectedVertex} · Drag nodes to reposition`
                    : "Tap a node to select · Drag to move"
                  : "Add vertices to begin"}
              </p>
            </div>
            {graph.vertices.length > 0 && (
              <button
                onClick={clearAll}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-all"
              >
                <RotateCcw className="w-3 h-3" /> Clear
              </button>
            )}
          </div>

          <div
            ref={svgContainerRef}
            className="flex justify-center"
            style={{
              background: isDark ? "#0a0e14" : "#f9fafb",
            }}
          >
            <GraphSVG
              graph={graph}
              simRef={simRef}
              renderTick={renderTick}
              algoResult={algoResult}
              highlightStep={highlightStep}
              isDark={isDark}
              onVertexClick={handleVertexClick}
              selectedVertex={selectedVertex}
              onDragStart={handleDragStart}
              onDragMove={handleDragMove}
              onDragEnd={handleDragEnd}
              svgW={svgW}
              svgH={svgH}
            />
          </div>

          {graph.vertices.length > 0 && (
            <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-blue-600" />
                <span className="text-[10px] text-gray-500 dark:text-gray-400">
                  Selected
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <span className="text-[10px] text-gray-500 dark:text-gray-400">
                  Visited
                </span>
              </div>
              {algoResult?.type === "cycle" && (
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">
                    Cycle
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Algorithms ────────────────────────────────────────────────────── */}
      <div className="px-4 mt-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Algorithms
            </h3>
            <p className="text-[10px] text-gray-400 dark:text-gray-600 mt-0.5">
              {selectedVertex
                ? `Starting from ${selectedVertex}`
                : "Tap a node to set start vertex, or first vertex is used"}
            </p>
          </div>
          <div className="px-4 py-3 grid grid-cols-3 gap-2">
            {[
              {
                label: "BFS",
                type: "bfs" as const,
                cls: "bg-blue-600 hover:bg-blue-700",
              },
              {
                label: "DFS",
                type: "dfs" as const,
                cls: "bg-purple-600 hover:bg-purple-700",
              },
              {
                label: "Cycle",
                type: "cycle" as const,
                cls: "bg-rose-600 hover:bg-rose-700",
              },
            ].map(({ label, type, cls }) => (
              <button
                key={type}
                onClick={() => runAlgo(type)}
                disabled={!graph.vertices.length}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all ${graph.vertices.length ? `${cls} text-white shadow-sm active:scale-[0.98]` : "bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed"}`}
              >
                {label}
              </button>
            ))}
          </div>

          {hasResult && (
            <div className="border-t border-gray-100 dark:border-gray-700 px-4 py-3">
              {(algoResult!.type === "bfs" ||
                algoResult!.type === "dfs") && (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-xs font-semibold text-gray-900 dark:text-white">
                        {algoResult!.type.toUpperCase()} from{" "}
                        <span className="font-mono text-blue-600 dark:text-blue-400">
                          {algoResult!.startVertex}
                        </span>
                      </p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-600 mt-0.5">
                        {algoResult!.type === "bfs"
                          ? "Queue-based · level by level"
                          : "Recursive · depth first"}
                      </p>
                    </div>
                    <button
                      onClick={isPlaying ? stopPlay : startPlay}
                      disabled={!visitOrder.length}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${isPlaying ? "bg-amber-500 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"}`}
                    >
                      <Play className="w-3 h-3" />{" "}
                      {isPlaying ? "Stop" : "Play"}
                    </button>
                  </div>
                  {visitOrder.length > 0 && (
                    <input
                      type="range"
                      min={-1}
                      max={maxStep}
                      value={highlightStep}
                      onChange={(e) => {
                        stopPlay();
                        setHighlightStep(
                          Number(e.target.value),
                        );
                      }}
                      className="w-full h-1.5 rounded-full accent-blue-600 mb-3"
                    />
                  )}
                  <div className="flex flex-wrap gap-1.5">
                    {visitOrder.map((v, i) => (
                      <span
                        key={i}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono font-semibold transition-all ${i <= highlightStep ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 ring-1 ring-yellow-400/50" : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"}`}
                      >
                        <span className="text-[9px] opacity-60">
                          {i + 1}.
                        </span>
                        {v}
                      </span>
                    ))}
                  </div>
                </>
              )}
              {algoResult!.type === "cycle" && (
                <div
                  className={`rounded-xl p-3 ${algoResult!.hasCycle ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800" : "bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800"}`}
                >
                  <p
                    className={`text-sm font-bold ${algoResult!.hasCycle ? "text-red-700 dark:text-red-300" : "text-emerald-700 dark:text-emerald-300"}`}
                  >
                    {algoResult!.hasCycle
                      ? "⚠ Cycle Detected"
                      : "✓ No Cycle Found"}
                  </p>
                  <p className="text-[10px] mt-1 text-gray-500 dark:text-gray-400 font-mono">
                    {graph.directed
                      ? "BFS Kahn's (topological) — unprocessed nodes = cycle"
                      : "BFS parent tracking — back edge to non-parent = cycle"}
                  </p>
                  {algoResult!.hasCycle && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {algoResult!.cycleNodes!.map((v) => (
                        <span
                          key={v}
                          className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                        >
                          {v}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Adjacency list / matrix ────────────────────────────────────────── */}
      {graph.vertices.length > 0 && (
        <div className="px-4 mt-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Adjacency List
              </h3>
              <button
                onClick={() => setShowMatrix((m) => !m)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${showMatrix ? "bg-indigo-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"}`}
              >
                Matrix
              </button>
            </div>
            {!showMatrix ? (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {graph.vertices.map((v) => {
                  const nb = adj.get(v) ?? [];
                  return (
                    <div
                      key={v}
                      className="flex items-center gap-3 px-4 py-2.5"
                    >
                      <span className="w-8 text-center font-mono font-bold text-sm text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 rounded-lg py-1">
                        {v}
                      </span>
                      <span className="text-gray-400 dark:text-gray-600 text-xs">
                        →
                      </span>
                      <div className="flex flex-wrap gap-1 flex-1">
                        {nb.length > 0 ? (
                          nb.map((n, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md text-xs font-mono font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                            >
                              {n.neighbor}
                              {graph.weighted
                                ? `(${n.weight})`
                                : ""}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400 dark:text-gray-600 italic">
                            no edges
                          </span>
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
                      {graph.vertices.map((v) => (
                        <th
                          key={v}
                          className="w-8 h-8 text-center font-bold text-gray-700 dark:text-gray-300"
                        >
                          {v}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {adjMatrix.map((row, i) => (
                      <tr key={i}>
                        <td className="w-8 h-8 text-center font-bold text-gray-700 dark:text-gray-300 pr-1">
                          {graph.vertices[i]}
                        </td>
                        {row.map((cell, j) => (
                          <td
                            key={j}
                            className={`w-8 h-8 text-center border border-gray-200 dark:border-gray-700 ${cell !== null ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold" : "bg-gray-50 dark:bg-gray-900 text-gray-300 dark:text-gray-700"}`}
                          >
                            {cell !== null ? cell : "0"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-[10px] text-gray-400 dark:text-gray-600 mt-2 font-mono">
                  Row=from · Col=to ·{" "}
                  {graph.directed
                    ? "Directed (may be asymmetric)"
                    : "Undirected (symmetric)"}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Presets ────────────────────────────────────────────────────────── */}
      <div className="px-4 mt-4">
        <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
          Quick presets
        </p>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {presets.map((p: any) => (
            <button
              key={p.label}
              onClick={() => applyPreset(p)}
              className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-transparent hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-4" />

      {/* ── Bottom bar ─────────────────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 rounded-t-3xl shadow-lg z-10">
        <div className="flex items-center justify-between px-4 py-4">
          <button
            onClick={clearAll}
            className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Clear
          </button>
          <button
            onClick={copyOutput}
            disabled={!graph.vertices.length}
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${graph.vertices.length ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm" : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"}`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Copy all
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}