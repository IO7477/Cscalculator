import { useState, useMemo, useCallback } from 'react';
import {
  ChevronLeft, HelpCircle, MoreVertical, Moon, Sun,
  Copy, Check, GitBranch, Plus, Trash2, RotateCcw,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { useTheme } from '../contexts/ThemeContext';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface TreeNode {
  id: number;
  value: string;
  left: TreeNode | null;
  right: TreeNode | null;
  height: number;
}

interface Position { x: number; y: number; }
type TreeType  = 'normal' | 'bst' | 'avl' | 'stack';
type InputMode = 'build' | 'modify';

interface LogEntry {
  op: 'build' | 'insert' | 'delete';
  applied: string[];
  skipped: string[];
  ts: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Core tree algorithms
// ─────────────────────────────────────────────────────────────────────────────

// ── Height helpers ─────────────────────────────────────────────────────────
// Matches Java: height(null) = -1, fresh leaf height = 0
// Java: int height(Node n) { return n == null ? -1 : n.height; }
function height(n: TreeNode | null): number { return n ? n.height : -1; }
function updateHeight(n: TreeNode): void {
  n.height = 1 + Math.max(height(n.left), height(n.right));
}

// Java: int getBalance(Node n) { return (n == null) ? 0 : height(n.right) - height(n.left); }
// right - left: positive = right-heavy, negative = left-heavy
function getBalance(n: TreeNode | null): number {
  return n ? height(n.right) - height(n.left) : 0;
}

// For SVG balance factor labels: show left - right (standard textbook convention)
function displayBF(n: TreeNode | null): number {
  return n ? height(n.left) - height(n.right) : 0;
}

// ── Rotations ─────────────────────────────────────────────────────────────────
// Mirror of Java rotateRight / rotateLeft

function rotateRight(a: TreeNode): TreeNode {
  const b = a.left!;   // b becomes new root
  const c = b.right;   // b's right child moves to a's left
  b.right = a;
  a.left  = c;
  updateHeight(a);     // update a first (now lower)
  updateHeight(b);     // then b (now higher)
  return b;
}

function rotateLeft(a: TreeNode): TreeNode {
  const b = a.right!;  // b becomes new root
  const c = b.left;    // b's left child moves to a's right
  b.left  = a;
  a.right = c;
  updateHeight(a);
  updateHeight(b);
  return b;
}

// ── rebalance ──────────────────────────────────────────────────────────────────
// Direct port of Java rebalance(Node a).
// Called on the way back up the call stack after every insert or delete.
//
//  balance > 1  → right-heavy (|right| > |left| + 1)
//    height(right.right) < height(right.left) → RL: rotate right child right first
//    otherwise                                → RR: single left rotation
//
//  balance < -1 → left-heavy (|left| > |right| + 1)
//    height(left.left) < height(left.right)   → LR: rotate left child left first
//    otherwise                                → LL: single right rotation
function rebalance(a: TreeNode): TreeNode {
  updateHeight(a);
  const balance = getBalance(a);

  if (balance > 1) {
    // Right-heavy
    if (height(a.right!.right) < height(a.right!.left)) {
      // RL case — right child is left-heavy: fix it first
      a.right = rotateRight(a.right!);
    }
    a = rotateLeft(a);  // RR case (or after RL pre-rotation)
  } else if (balance < -1) {
    // Left-heavy
    if (height(a.left!.left) < height(a.left!.right)) {
      // LR case — left child is right-heavy: fix it first
      a.left = rotateLeft(a.left!);
    }
    a = rotateRight(a); // LL case (or after LR pre-rotation)
  }
  return a;
}

// ── Node factory ──────────────────────────────────────────────────────────────
// Java: Node(int data) { this.data = data; } — height defaults to 0 (int default)
let _uid = 0;
function mkNode(v: string): TreeNode {
  return { id: _uid++, value: v, left: null, right: null, height: 0 };
}
function clone(n: TreeNode | null): TreeNode | null {
  if (!n) return null;
  return { id: n.id, value: n.value, height: n.height, left: clone(n.left), right: clone(n.right) };
}

// Numeric-first comparator — fixes "300" < "40" in string comparison
function cmp(a: string, b: string): number {
  const na = Number(a), nb = Number(b);
  if (!isNaN(na) && !isNaN(nb)) return na - nb;
  return a < b ? -1 : a > b ? 1 : 0;
}

// ── INSERT ─────────────────────────────────────────────────────────────────────

function bstInsert(r: TreeNode | null, v: string): TreeNode {
  if (!r) return mkNode(v);
  const c = cmp(v, r.value);
  if (c < 0) r.left  = bstInsert(r.left,  v);
  else if (c > 0) r.right = bstInsert(r.right, v);
  return r; // duplicate: return unchanged
}

// Direct port of Java insert(Node rootNode, int key)
// BST insert down, rebalance() on the way back up
function avlInsert(r: TreeNode | null, v: string): TreeNode {
  if (!r) return mkNode(v);
  const c = cmp(v, r.value);
  if (c > 0)      r.right = avlInsert(r.right, v);  // key > node → go right
  else if (c < 0) r.left  = avlInsert(r.left,  v);  // key < node → go left
  else return r;                                      // duplicate → no insert
  return rebalance(r);
}

function normalInsert(r: TreeNode | null, v: string): TreeNode {
  const node = mkNode(v);
  if (!r) return node;
  const q: TreeNode[] = [r];
  while (q.length) {
    const cur = q.shift()!;
    if (!cur.left)  { cur.left  = node; return r; }
    q.push(cur.left);
    if (!cur.right) { cur.right = node; return r; }
    q.push(cur.right);
  }
  return r;
}

function insertOne(r: TreeNode | null, v: string, type: TreeType): TreeNode {
  return type === 'avl' ? avlInsert(r, v)
       : type === 'bst' ? bstInsert(r, v)
       : normalInsert(r, v);
}

// ── DELETE ─────────────────────────────────────────────────────────────────────

function bstDelete(r: TreeNode | null, v: string): [TreeNode | null, boolean] {
  if (!r) return [null, false];
  const c = cmp(v, r.value);
  if (c < 0) { const [l, ok]  = bstDelete(r.left,  v); r.left  = l;  return [r, ok]; }
  if (c > 0) { const [ri, ok] = bstDelete(r.right, v); r.right = ri; return [r, ok]; }
  if (!r.left)  return [r.right, true];
  if (!r.right) return [r.left,  true];
  // Two children: inorder successor
  let succ = r.right; while (succ.left) succ = succ.left;
  r.value = succ.value;
  const [ri] = bstDelete(r.right, succ.value);
  r.right = ri;
  return [r, true];
}

// Direct port of Java getReplacement(Node curr):
// Finds inorder predecessor — rightmost node of left subtree.
// Called only when node has two children, so curr.left is guaranteed non-null.
function getReplacement(node: TreeNode): TreeNode {
  let curr = node.left!;
  while (curr.right) curr = curr.right; // go as far right as possible
  return curr;
}

// Direct port of Java delete(Node rootNode, int num):
//  - Recurse to find node
//  - 0/1 child: return the surviving child directly
//  - 2 children: copy inorder PREDECESSOR value up, delete it from LEFT subtree
//  - rebalance() on the way back up
function avlDelete(r: TreeNode | null, v: string): [TreeNode | null, boolean] {
  if (!r) return [null, false];
  const c = cmp(v, r.value);
  let found = false;

  if (cmp(r.value, v) > 0) {
    // Java: if (rootNode.data > num) → go left
    const [l, ok] = avlDelete(r.left, v); r.left = l; found = ok;
  } else if (cmp(r.value, v) < 0) {
    // Java: else if (rootNode.data < num) → go right
    const [ri, ok] = avlDelete(r.right, v); r.right = ri; found = ok;
  } else {
    // Found — Java's else branch
    if (!r.left)  return [r.right, true]; // no left child
    if (!r.right) return [r.left,  true]; // no right child
    // Two children: get inorder predecessor, copy up, delete from LEFT subtree
    const replacement = getReplacement(r);
    r.value = replacement.value;
    const [l] = avlDelete(r.left, replacement.value); // Java: rootNode.left = delete(rootNode.left, ...)
    r.left = l;
    found = true;
  }

  if (!found) return [r, false];
  return [rebalance(r), true];
}

function normalDelete(r: TreeNode | null, v: string): [TreeNode | null, boolean] {
  if (!r) return [null, false];
  let target: TreeNode | null = null;
  let last: TreeNode | null = null, lastParent: TreeNode | null = null, lastIsLeft = false;
  const q: [TreeNode, TreeNode | null, boolean][] = [[r, null, false]];
  while (q.length) {
    const [n, parent, isLeft] = q.shift()!;
    if (cmp(n.value, v) === 0 && !target) target = n;
    last = n; lastParent = parent; lastIsLeft = isLeft;
    if (n.left)  q.push([n.left,  n, true]);
    if (n.right) q.push([n.right, n, false]);
  }
  if (!target || !last) return [r, false];
  target.value = last.value;
  if (lastParent) { if (lastIsLeft) lastParent.left = null; else lastParent.right = null; }
  else return [null, true];
  return [r, true];
}

function deleteOne(r: TreeNode | null, v: string, type: TreeType): [TreeNode | null, boolean] {
  return type === 'avl'                  ? avlDelete(r, v)
       : type === 'bst' || type === 'stack' ? bstDelete(r, v)
       : normalDelete(r, v);
}

// ── Shared utilities ──────────────────────────────────────────────────────────

function contains(r: TreeNode | null, v: string): boolean {
  if (!r) return false;
  if (cmp(v, r.value) === 0) return true;
  return contains(r.left, v) || contains(r.right, v);
}

function findId(r: TreeNode | null, v: string): number | null {
  if (!r) return null;
  if (cmp(r.value, v) === 0) return r.id;
  return findId(r.left, v) ?? findId(r.right, v);
}

// ── Shared parser — identical for all three operations ────────────────────────
function parseValues(raw: string): string[] {
  return raw.split(/[\s,;]+/).map(s => s.trim()).filter(Boolean);
}

// ─────────────────────────────────────────────────────────────────────────────
// Traversals & array representation
// ─────────────────────────────────────────────────────────────────────────────

function inorder(n: TreeNode | null, r: string[] = []): string[] {
  if (!n) return r; inorder(n.left, r); r.push(n.value); inorder(n.right, r); return r;
}
function preorder(n: TreeNode | null, r: string[] = []): string[] {
  if (!n) return r; r.push(n.value); preorder(n.left, r); preorder(n.right, r); return r;
}
function postorder(n: TreeNode | null, r: string[] = []): string[] {
  if (!n) return r; postorder(n.left, r); postorder(n.right, r); r.push(n.value); return r;
}
function levelOrder(n: TreeNode | null): string[] {
  if (!n) return [];
  const r: string[] = [], q: TreeNode[] = [n];
  while (q.length) { const x = q.shift()!; r.push(x.value); if (x.left) q.push(x.left); if (x.right) q.push(x.right); }
  return r;
}
function treeDepth(n: TreeNode | null): number { if (!n) return 0; return 1 + Math.max(treeDepth(n.left), treeDepth(n.right)); }
function countNodes(n: TreeNode | null): number { if (!n) return 0; return 1 + countNodes(n.left) + countNodes(n.right); }
function toArray(root: TreeNode | null): (string | null)[] {
  if (!root) return [];
  const m: Record<number, string> = {}; let maxI = 0;
  const q: [TreeNode, number][] = [[root, 1]];
  while (q.length) { const [n, i] = q.shift()!; m[i] = n.value; maxI = Math.max(maxI, i); if (n.left) q.push([n.left, 2*i]); if (n.right) q.push([n.right, 2*i+1]); }
  const a: (string | null)[] = [null];
  for (let i = 1; i <= maxI; i++) a.push(m[i] ?? null);
  return a;
}

// ─────────────────────────────────────────────────────────────────────────────
// SVG layout
// ─────────────────────────────────────────────────────────────────────────────

const NR = 22, HG = 58, VG = 78;

function computeLayout(n: TreeNode | null, d: number, ctr: { v: number }, pos: Map<number, Position>): void {
  if (!n) return;
  computeLayout(n.left,  d + 1, ctr, pos);
  pos.set(n.id, { x: ctr.v * HG + NR + 10, y: d * VG + NR + 12 });
  ctr.v++;
  computeLayout(n.right, d + 1, ctr, pos);
}

// ─────────────────────────────────────────────────────────────────────────────
// SVG component
// ─────────────────────────────────────────────────────────────────────────────

function TreeSVG({ root, treeType, positions, showBF, isDark, highlightId }: {
  root: TreeNode | null; treeType: TreeType;
  positions: Map<number, Position>;
  showBF: boolean; isDark: boolean; highlightId: number | null;
}) {
  if (!root || positions.size === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-44 gap-3">
        <GitBranch className="w-9 h-9 text-gray-300 dark:text-gray-700" />
        <p className="text-sm text-gray-400 dark:text-gray-600">Type values above to see the tree</p>
      </div>
    );
  }
  const all = Array.from(positions.values());
  const svgW = Math.max(...all.map(p => p.x)) + NR + 20;
  const svgH = Math.max(...all.map(p => p.y)) + NR + 20;
  const fill0 = { normal: '#10b981', bst: '#3b82f6', avl: '#8b5cf6' }[treeType];
  const edgeC = isDark ? '#374151' : '#9ca3af';
  const edges: React.ReactNode[] = [], nodes: React.ReactNode[] = [];

  function draw(n: TreeNode | null) {
    if (!n) return;
    const p = positions.get(n.id)!;
    const b = displayBF(n); // left - right (standard textbook display)
    if (n.left)  { const lp = positions.get(n.left.id)!;  edges.push(<line key={`el${n.id}`} x1={p.x} y1={p.y} x2={lp.x} y2={lp.y} stroke={edgeC} strokeWidth={1.5}/>); }
    if (n.right) { const rp = positions.get(n.right.id)!; edges.push(<line key={`er${n.id}`} x1={p.x} y1={p.y} x2={rp.x} y2={rp.y} stroke={edgeC} strokeWidth={1.5}/>); }
    const hi  = n.id === highlightId;
    const unb = treeType === 'avl' && Math.abs(b) > 1;
    const fc  = unb ? '#ef4444' : fill0;
    const sc  = hi ? '#facc15' : unb ? '#b91c1c' : isDark ? '#ffffff22' : '#ffffff55';
    const lbl = n.value.length > 4 ? n.value.slice(0, 4) : n.value;
    nodes.push(
      <g key={n.id}>
        {hi && <circle cx={p.x} cy={p.y} r={NR+6} fill="none" stroke="#facc15" strokeWidth={2} opacity={0.4}/>}
        <circle cx={p.x} cy={p.y} r={NR} fill={fc} stroke={sc} strokeWidth={hi ? 3 : 1.5}/>
        <text x={p.x} y={p.y} textAnchor="middle" dy="0.35em" fill="white"
          fontSize={lbl.length > 2 ? 9 : 11} fontWeight="700" fontFamily="ui-monospace, monospace">{lbl}</text>
        {showBF && treeType === 'avl' && (
          <g>
            <rect x={p.x+NR-2} y={p.y-NR-2} width={22} height={14} rx={4}
              fill={unb ? '#ef4444' : isDark ? '#1f2937' : '#f3f4f6'}
              stroke={unb ? '#b91c1c' : isDark ? '#374151' : '#e5e7eb'} strokeWidth={1}/>
            <text x={p.x+NR+9} y={p.y-NR+8} textAnchor="middle" fontSize={8}
              fill={unb ? 'white' : isDark ? '#9ca3af' : '#6b7280'} fontFamily="ui-monospace, monospace">
              {b > 0 ? `+${b}` : `${b}`}
            </text>
          </g>
        )}
      </g>
    );
    draw(n.left); draw(n.right);
  }
  draw(root);
  return (
    <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} style={{ minWidth: svgW }}>
      {edges}{nodes}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Output card — traversals + array in one block
// ─────────────────────────────────────────────────────────────────────────────

const TC = [
  'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
  'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
  'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
];

function OutputCard({ ino, pre, post, lvl, arr, copied, onCopy }: {
  ino: string[]; pre: string[]; post: string[]; lvl: string[];
  arr: (string | null)[]; copied: boolean; onCopy: () => void;
}) {
  const rows = [
    { label: 'Inorder',     hint: 'L→Root→R', data: ino,  ci: 0 },
    { label: 'Preorder',    hint: 'Root→L→R',  data: pre,  ci: 1 },
    { label: 'Postorder',   hint: 'L→R→Root',  data: post, ci: 2 },
    { label: 'Level-order', hint: 'BFS',        data: lvl,  ci: 3 },
  ];
  const empty = ino.length === 0;
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Traversals & Array</h3>
        <button onClick={onCopy} disabled={empty}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            empty ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}>
          {copied ? <Check className="w-3 h-3 text-green-500"/> : <Copy className="w-3 h-3"/>}
          {copied ? 'Copied!' : 'Copy all'}
        </button>
      </div>
      {empty ? (
        <p className="text-xs text-gray-400 dark:text-gray-600 italic text-center py-6">Tree is empty</p>
      ) : (
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {rows.map(row => (
            <div key={row.label} className="flex items-start gap-3 px-4 py-3">
              <div className="w-[82px] flex-shrink-0 pt-0.5">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">{row.label}</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-600 font-mono mt-0.5">{row.hint}</p>
              </div>
              <div className="flex flex-wrap gap-1 flex-1 min-w-0">
                {row.data.map((v, i) => (
                  <span key={i} className={`px-2 py-0.5 rounded-md text-xs font-mono font-semibold ${TC[row.ci]}`}>{v}</span>
                ))}
              </div>
            </div>
          ))}
          {arr.length > 1 && (
            <div className="px-4 py-3">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Array</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-600 font-mono">heap-style 1-indexed</p>
              </div>
              <div className="overflow-x-auto pb-1">
                <div className="flex gap-1.5 min-w-max">
                  {arr.slice(1).map((val, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <span className="text-[9px] font-mono text-gray-400 dark:text-gray-600 mb-1">[{i+1}]</span>
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-mono font-bold border-2 ${
                        val !== null
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600'
                          : 'bg-gray-50 dark:bg-gray-900 text-gray-300 dark:text-gray-700 border-dashed border-gray-200 dark:border-gray-800'
                      }`}>{val ?? '∅'}</div>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-[10px] font-mono text-gray-400 dark:text-gray-600 mt-2">
                left=[2i] · right=[2i+1] · parent=[⌊i/2⌋]
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

export function TreeCalculator() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  // ── State ─────────────────────────────────────────────────────────────────

  const [treeType,    setTreeType]    = useState<TreeType>('bst');
  const [inputMode,   setInputMode]   = useState<InputMode>('build');

  // Single input field — used for both build (live) and modify (on-demand)
  const [inputText,   setInputText]   = useState('');

  // The live tree — owned as state, mutated by all three operations
  const [treeRoot,    setTreeRoot]    = useState<TreeNode | null>(null);

  const [highlightId, setHighlightId] = useState<number | null>(null);
  const [log,         setLog]         = useState<LogEntry[]>([]);
  const [modError,    setModError]    = useState<string | null>(null);
  const [showBF,      setShowBF]      = useState(false);
  const [copied,      setCopied]      = useState(false);

  // ── Shared parser (identical for all operations) ──────────────────────────
  const tokens = useMemo(() => parseValues(inputText), [inputText]);

  // ── Build mode: tree rebuilds live as tokens change ───────────────────────
  // We derive a "preview root" from the current inputText whenever in build mode.
  // This is computed purely from tokens — no side-effects needed.
  const buildPreview = useMemo(() => {
    if (inputMode !== 'build' || tokens.length === 0) return null;
    _uid = 0;
    let r: TreeNode | null = null;
    for (const v of tokens) {
      const c = clone(r);
      r = insertOne(c, v, treeType);
    }
    return r;
  }, [tokens, treeType, inputMode]);

  // The tree we actually display — live preview when in build mode, committed
  // state when in modify mode.
  const displayRoot = inputMode === 'build' ? buildPreview : treeRoot;

  // ── Derived display values ────────────────────────────────────────────────
  const { positions, ino, pre, post, lvl, arr, depth, count } = useMemo(() => {
    const pos = new Map<number, Position>();
    if (displayRoot) computeLayout(displayRoot, 0, { v: 0 }, pos);
    return {
      positions: pos,
      ino:   inorder(displayRoot),
      pre:   preorder(displayRoot),
      post:  postorder(displayRoot),
      lvl:   levelOrder(displayRoot),
      arr:   toArray(displayRoot),
      depth: treeDepth(displayRoot),
      count: countNodes(displayRoot),
    };
  }, [displayRoot]);

  const flash = useCallback((id: number | null) => {
    setHighlightId(id);
    setTimeout(() => setHighlightId(null), 1800);
  }, []);

  // ── When user commits a build (clicks "Set as tree") ─────────────────────
  const handleCommitBuild = useCallback(() => {
    if (!buildPreview) return;
    setTreeRoot(buildPreview);
    setLog(prev => [{ op: 'build', applied: tokens, skipped: [], ts: Date.now() }, ...prev].slice(0, 12));
    flash(buildPreview.id);
    // don't clear input — user may want to continue from here
  }, [buildPreview, tokens, flash]);

  // ── Insert ────────────────────────────────────────────────────────────────
  const handleInsert = useCallback(() => {
    if (tokens.length === 0) return;
    setModError(null);
    let r = clone(treeRoot);
    const applied: string[] = [], skipped: string[] = [];
    let lastId: number | null = null;
    for (const v of tokens) {
      if ((treeType === 'bst' || treeType === 'avl') && contains(r, v)) {
        skipped.push(v); continue;
      }
      r = insertOne(r, v, treeType);
      applied.push(v);
      lastId = findId(r, v);
    }
    if (applied.length === 0) {
      setModError(skipped.length > 0 ? `Already exists: ${skipped.join(', ')}` : 'Nothing to insert');
      return;
    }
    setTreeRoot(r);
    flash(lastId);
    setLog(prev => [{ op: 'insert', applied, skipped, ts: Date.now() }, ...prev].slice(0, 12));
    setInputText('');
    if (skipped.length > 0) setModError(`Skipped duplicates: ${skipped.join(', ')}`);
  }, [tokens, treeRoot, treeType, flash]);

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = useCallback(() => {
    if (tokens.length === 0 || !treeRoot) return;
    setModError(null);
    let r = clone(treeRoot);
    const applied: string[] = [], skipped: string[] = [];
    for (const v of tokens) {
      if (!contains(r, v)) { skipped.push(v); continue; }
      let ok: boolean;
      [r, ok] = deleteOne(r, v, treeType);
      if (ok) applied.push(v);
    }
    if (applied.length === 0) {
      setModError(skipped.length > 0 ? `Not found: ${skipped.join(', ')}` : 'Nothing to delete');
      return;
    }
    setTreeRoot(r);
    setLog(prev => [{ op: 'delete', applied, skipped, ts: Date.now() }, ...prev].slice(0, 12));
    setInputText('');
    if (skipped.length > 0) setModError(`Not found (skipped): ${skipped.join(', ')}`);
  }, [tokens, treeRoot, treeType]);

  // ── Copy all ──────────────────────────────────────────────────────────────
  const copyAll = async () => {
    if (!displayRoot) return;
    const text = [
      `Tree — ${treeType.toUpperCase()}  |  Nodes: ${count}  Height: ${depth}`,
      ``,
      `Inorder:     [ ${ino.join(', ')} ]`,
      `Preorder:    [ ${pre.join(', ')} ]`,
      `Postorder:   [ ${post.join(', ')} ]`,
      `Level-order: [ ${lvl.join(', ')} ]`,
      `Array:       [ ${arr.slice(1).map((v, i) => `[${i+1}]=${v ?? '∅'}`).join('  ')} ]`,
    ].join('\n');
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Switch modes ──────────────────────────────────────────────────────────
  const switchMode = (m: InputMode) => {
    setInputMode(m);
    setInputText('');
    setModError(null);
    // When entering modify mode, commit whatever was previewed in build mode
    if (m === 'modify' && buildPreview) {
      setTreeRoot(buildPreview);
    }
  };

  // ── Config ────────────────────────────────────────────────────────────────
  const typeConfig = {
    normal: { label: 'Normal', color: 'bg-emerald-600', desc: 'Level-by-level, complete shape' },
    bst:    { label: 'BST',    color: 'bg-blue-600',    desc: 'Binary Search Tree — value-ordered' },
    avl:    { label: 'AVL',    color: 'bg-purple-600',  desc: 'Self-balancing BST, auto-rotates' },
  };
  const nodeColor = typeConfig[treeType].color;

  const logStyle = (op: LogEntry['op']) =>
    op === 'build'  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
    op === 'insert' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' :
                      'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400';
  const logIcon = (op: LogEntry['op']) => op === 'build' ? '↺' : op === 'insert' ? '＋' : '－';

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1419] pb-28">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-gray-800 rounded-b-3xl shadow-sm pb-4">
        <div className="px-4 pt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')}
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all">
              <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
            <div>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Toolbox</p>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Tree Calculator</h1>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
              {isDark ? <Moon className="w-4 h-4 text-gray-300"/> : <Sun className="w-4 h-4 text-yellow-600"/>}
            </button>
            <button className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
              <HelpCircle className="w-4 h-4 text-gray-700 dark:text-gray-300"/>
            </button>
            <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all">
              <MoreVertical className="w-4 h-4 text-gray-700 dark:text-gray-300"/>
            </button>
          </div>
        </div>
      </div>

      {/* ── Tree type ──────────────────────────────────────────────────────── */}
      <div className="px-4 mt-4">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-1 flex gap-1 border border-gray-200 dark:border-gray-700">
          {(Object.keys(typeConfig) as TreeType[]).map(t => (
            <button key={t} onClick={() => setTreeType(t)}
              className={`flex-1 py-2.5 rounded-full text-sm font-bold transition-all ${
                treeType === t
                  ? `${typeConfig[t].color} text-white shadow-sm`
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}>
              {typeConfig[t].label}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">{typeConfig[treeType].desc}</p>
      </div>

      {/* ── Unified control card ───────────────────────────────────────────── */}
      <div className="px-4 mt-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">

          {/* Mode toggle — two tabs only */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {([
              { id: 'build',  label: 'Build',          accent: 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/10' },
              { id: 'modify', label: 'Insert / Delete', accent: 'border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/10' },
            ] as const).map(tab => (
              <button key={tab.id}
                onClick={() => switchMode(tab.id)}
                className={`flex-1 py-3 text-sm font-semibold transition-all ${
                  inputMode === tab.id
                    ? `border-b-2 ${tab.accent}`
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/20'
                }`}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Input area — identical for both modes */}
          <div className="px-4 pt-4 pb-3">
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-2 font-medium uppercase tracking-wide">
              {inputMode === 'build' ? 'Values — tree updates live as you type' : 'Values to insert or delete'}
            </p>

            {/* The one shared input field */}
            <div className={`rounded-xl bg-gray-50 dark:bg-[#131820] border transition-all px-3 py-2.5 mb-3 ${
              modError ? 'border-red-400 dark:border-red-500' : 'border-gray-200 dark:border-gray-700 focus-within:border-blue-500 dark:focus-within:border-blue-400'
            }`}>
              <input
                type="text"
                value={inputText}
                onChange={e => { setInputText(e.target.value); setModError(null); }}
                onKeyDown={e => { if (e.key === 'Enter' && inputMode === 'build') handleCommitBuild(); }}
                placeholder="e.g.  50, 30, 70  or  50 30 70  or  50;30;70"
                className="w-full bg-transparent text-sm font-mono text-gray-900 dark:text-white outline-none placeholder:text-gray-400 dark:placeholder:text-gray-600"
              />
            </div>

            {/* Token preview badges — same appearance both modes */}
            {tokens.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {tokens.map((v, i) => (
                  <span key={i}
                    className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold text-white ${nodeColor}`}>
                    {v}
                  </span>
                ))}
              </div>
            )}

            {/* Action buttons — differ by mode */}
            {inputMode === 'build' ? (
              /* Build mode: one "Set as tree" button (optional commit) */
              <button
                onClick={handleCommitBuild}
                disabled={tokens.length === 0}
                className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all ${
                  tokens.length > 0
                    ? `${nodeColor} text-white hover:opacity-90 active:scale-[0.98] shadow-sm`
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                }`}>
                {tokens.length > 0
                  ? `Set as tree (${tokens.length} value${tokens.length > 1 ? 's' : ''})`
                  : 'Type values to preview the tree'}
              </button>
            ) : (
              /* Modify mode: Insert + Delete side by side */
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleInsert}
                  disabled={tokens.length === 0}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    tokens.length > 0
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm active:scale-[0.98]'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                  }`}>
                  <Plus className="w-4 h-4"/> Insert
                </button>
                <button
                  onClick={handleDelete}
                  disabled={tokens.length === 0 || !treeRoot}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    tokens.length > 0 && treeRoot
                      ? 'bg-red-600 hover:bg-red-700 text-white shadow-sm active:scale-[0.98]'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                  }`}>
                  <Trash2 className="w-4 h-4"/> Delete
                </button>
              </div>
            )}

            {/* Error / hint line */}
            <p className={`text-[10px] mt-2 ${modError ? 'text-red-500' : 'text-gray-400 dark:text-gray-600'}`}>
              {modError
                ? `⚠ ${modError}`
                : inputMode === 'build'
                  ? 'Comma, space, or semicolon separated · Enter to commit'
                  : 'Same parsing as Build · Insert adds, Delete removes matching values'}
            </p>
          </div>

          {/* Operation log */}
          {log.length > 0 && (
            <div className="border-t border-gray-100 dark:border-gray-700 px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">History</p>
                <button onClick={() => setLog([])}
                  className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                  <RotateCcw className="w-3 h-3"/> Clear
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {log.map((e, i) => (
                  <span key={e.ts + i}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono font-semibold ${logStyle(e.op)}`}>
                    {logIcon(e.op)} {e.applied.join(', ')}
                    {e.skipped.length > 0 && (
                      <span className="opacity-50 ml-0.5">(skip: {e.skipped.join(',')})</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Stats ──────────────────────────────────────────────────────────── */}
      {displayRoot && (
        <div className="px-4 mt-3">
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Nodes',  value: count },
              { label: 'Height', value: depth },
              { label: 'Levels', value: depth },
              { label: 'Type',   value: treeType.toUpperCase() },
            ].map(s => (
              <div key={s.label} className="bg-white dark:bg-gray-800 rounded-xl p-2 text-center border border-gray-200 dark:border-gray-700">
                <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide">{s.label}</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Tree visualization ─────────────────────────────────────────────── */}
      <div className="px-4 mt-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Tree Visualization
              {inputMode === 'build' && tokens.length > 0 && (
                <span className="ml-2 text-[10px] font-normal text-blue-500 dark:text-blue-400">live preview</span>
              )}
            </h3>
            <div className="flex items-center gap-2">
              {treeType === 'avl' && (
                <button onClick={() => setShowBF(!showBF)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    showBF ? 'bg-purple-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}>
                  Balance Factors
                </button>
              )}
              {displayRoot && (
                <button
                  onClick={() => { setTreeRoot(null); setInputText(''); setLog([]); setModError(null); }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-all">
                  <RotateCcw className="w-3 h-3"/> Clear
                </button>
              )}
            </div>
          </div>
          <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: '320px', background: isDark ? '#0a0e14' : '#f9fafb' }}>
            <div className="p-4">
              <TreeSVG
                root={displayRoot}
                treeType={treeType}
                positions={positions}
                showBF={showBF}
                isDark={isDark}
                highlightId={highlightId}
              />
            </div>
          </div>
          {displayRoot && (
            <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex flex-wrap items-center gap-4">
              {treeType === 'avl' && (
                <>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-purple-600"/>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400">Balanced</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"/>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400">Unbalanced</span>
                  </div>
                </>
              )}
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-yellow-400"/>
                <span className="text-[10px] text-gray-500 dark:text-gray-400">Last applied</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Traversals & array output ──────────────────────────────────────── */}
      <div className="px-4 mt-4">
        <OutputCard ino={ino} pre={pre} post={post} lvl={lvl} arr={arr} copied={copied} onCopy={copyAll}/>
      </div>

      {/* ── Quick presets ──────────────────────────────────────────────────── */}
      <div className="px-4 mt-4">
        <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Quick presets</p>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { label: 'BST balanced',  val: '50 30 70 20 40 60 80', type: 'bst'    as TreeType },
            { label: 'AVL rotations', val: '10 20 30 40 50',        type: 'avl'    as TreeType },
            { label: 'Letters (BST)', val: 'D B F A C E G',         type: 'bst'    as TreeType },
            { label: 'Normal tree',   val: '1 2 3 4 5 6 7',         type: 'normal' as TreeType },
            { label: 'AVL balanced',  val: '30 20 40 10 25 35 50',  type: 'avl'    as TreeType },
          ].map(p => (
            <button key={p.label}
              onClick={() => { setTreeType(p.type); setInputMode('build'); setInputText(p.val); setModError(null); }}
              className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-transparent hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-4"/>

      {/* ── Bottom bar ─────────────────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 rounded-t-3xl shadow-lg z-10">
        <div className="flex items-center justify-between px-4 py-4">
          <button
            onClick={() => { setTreeRoot(null); setInputText(''); setLog([]); setModError(null); }}
            className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
            Clear
          </button>
          <button onClick={copyAll} disabled={!displayRoot}
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
              displayRoot
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
            }`}>
            {copied ? <><Check className="w-4 h-4"/> Copied!</> : <><Copy className="w-4 h-4"/> Copy all</>}
          </button>
        </div>
      </div>

    </div>
  );
}
