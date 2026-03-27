// src/app/components/graph/data/graphPresets.ts

// ─── Preset Type ──────────────────────────────────────────────────────────────

export interface GraphPreset {
  label: string;
  directed: boolean;
  weighted: boolean;
  vids: string[];
  edgs: [string, string][];
  weights?: number[];
}

// ─── Presets ──────────────────────────────────────────────────────────────────

export const graphPresets: GraphPreset[] = [
  {
    label: "Simple cycle",
    directed: false,
    weighted: false,
    vids: ["A", "B", "C", "D"],
    edgs: [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"]],
  },
  {
    label: "Directed DAG",
    directed: true,
    weighted: false,
    vids: ["A", "B", "C", "D", "E"],
    edgs: [["A", "B"], ["A", "C"], ["B", "D"], ["C", "D"], ["D", "E"]],
  },
  {
    label: "Weighted MST",
    directed: false,
    weighted: true,
    vids: ["A", "B", "C", "D", "E"],
    edgs: [["A", "B"], ["A", "C"], ["B", "C"], ["B", "D"], ["C", "E"], ["D", "E"]],
    weights: [4, 2, 1, 5, 8, 2],
  },
  {
    label: "Directed cycle",
    directed: true,
    weighted: false,
    vids: ["A", "B", "C", "D"],
    edgs: [["A", "B"], ["B", "C"], ["C", "D"], ["D", "B"]],
  },
  {
    label: "Disconnected",
    directed: false,
    weighted: false,
    vids: ["A", "B", "C", "D", "E", "F"],
    edgs: [["A", "B"], ["B", "C"], ["D", "E"]],
  },
];
