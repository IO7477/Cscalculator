// src/app/components/graph/utils/graphAlgorithms.ts
// W3Schools References:
//   Graph Theory:        https://www.w3schools.com/dsa/dsa_theory_graphs.php
//   Traversal (BFS/DFS): https://www.w3schools.com/dsa/dsa_algo_graphs_traversal.php
// GeeksforGeeks References:
//   Kruskal's MST:       https://www.geeksforgeeks.org/dsa/kruskals-minimum-spanning-tree-algorithm-greedy-algo-2/

import type { Edge } from "../types/graph";

// ─── Vertex label comparison ──────────────────────────────────────────────────
// Compares two vertex label strings correctly:
//   - If BOTH labels are pure integers → numeric comparison (10 > 9, 100 > 90)
//   - Otherwise                        → locale-aware string comparison
// This fixes the bug where "90" > "100" under lexicographic ordering.

export function compareLabels(a: string, b: string): number {
  const na = Number(a), nb = Number(b);
  if (
    Number.isFinite(na) &&
    Number.isFinite(nb) &&
    String(na) === a &&
    String(nb) === b
  ) {
    return na - nb; // true numeric sort: 9 < 10 < 90 < 100 < 110
  }
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

// ─── Adjacency builder ────────────────────────────────────────────────────────

export function buildAdj(
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

// ─── BFS ─────────────────────────────────────────────────────────────────────

export function bfs(
  adj: Map<string, string[]>,
  vids: string[],
  start: string
): string[] {
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

// ─── DFS ─────────────────────────────────────────────────────────────────────

export function dfs(
  adj: Map<string, string[]>,
  vids: string[],
  start: string
): string[] {
  const vis = new Set<string>(), order: string[] = [];
  const go = (v: string) => {
    vis.add(v);
    order.push(v);
    for (const nb of adj.get(v) ?? []) if (!vis.has(nb)) go(nb);
  };
  go(start);
  for (const v of vids) if (!vis.has(v)) go(v);
  return order;
}

// ─── Disjoint Set Union (DSU) ─────────────────────────────────────────────────
// Used internally by Kruskal's algorithm for cycle detection.

export class DSU {
  private parent: Map<string, string>;
  private rank: Map<string, number>;

  constructor(vids: string[]) {
    this.parent = new Map(vids.map((v) => [v, v]));
    this.rank   = new Map(vids.map((v) => [v, 0]));
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
    if (rankX < rankY)      this.parent.set(rx, ry);
    else if (rankX > rankY) this.parent.set(ry, rx);
    else { this.parent.set(ry, rx); this.rank.set(rx, rankX + 1); }
    return true;
  }
}

// ─── Kruskal's MST ────────────────────────────────────────────────────────────

export function kruskal(
  vids: string[],
  edges: Edge[]
): {
  mstEdges: Edge[];
  skippedEdges: Edge[];
  mstCost: number;
  possible: boolean;
} {
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
