// src/app/components/graph/types/graph.ts

// ─── Core Data Types ──────────────────────────────────────────────────────────

export interface Edge {
  from: string;
  to: string;
  weight: number;
}

export interface GraphConfig {
  directed: boolean;
  weighted: boolean;
}

export interface Position {
  x: number;
  y: number;
}

// ─── Algorithm Types ──────────────────────────────────────────────────────────

export type AlgoType = "bfs" | "dfs" | "kruskal";

export interface AlgoResult {
  type: AlgoType;
  order?: string[];
  startVertex?: string;
  mstEdges?: Edge[];
  mstCost?: number;
  skippedEdges?: Edge[];
  possible?: boolean;
}

export interface AlgoResults {
  bfs: AlgoResult | null;
  dfs: AlgoResult | null;
  kruskal: AlgoResult | null;
}
