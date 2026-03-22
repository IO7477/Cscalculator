## 1. Top bar – `Header / Big O`

- Frame: 390×88, white, bottom radius 24.
- Left:
    - `Toolbox` (12, medium, gray‑600).
    - `Big O Calculator` (24, bold, near‑black).
- Right: 32×32 pill `?` (help explaining Big O), 32×32 pill `⋯`.
- Back chevron on far left.

---

## 2. Segmented control – `Mode selector`

Two core modes: direct selection vs derive from loops.

- Frame: 358×44, pill radius 999, fill `#F9FAFB`, margin 16.
- Segments (179px each, 36px height):
    - `Pick complexity`
    - `Analyze code` (for later, still UI).

Selected segment: blue fill, white text.

---

## 3. Card – `Operation description`

Short, natural‑language description of what you’re analyzing.

- Frame: 358×96, radius 16, `#F3F4F6` fill, stroke `#E5E7EB`, margin 16.
- Padding 12.
- Label: `What does your algorithm do?` (12, gray‑600).
- Multiline text input (or single line): placeholder `e.g., Loop over array once and print each item` (14, gray‑500).
- Tiny helper: `Used to label result & explanation` (11, gray‑500).

---

## 4. Card – `Operations per input`

Guided form to map to Big O rules (like loops, nested loops, divide‑and‑conquer).geeksforgeeks+1

- Frame: 358×120, radius 16, white fill, stroke `#E5E7EB`, margin 16.
- Padding 12, vertical stack:

Row 1:

- Label: `Loop structure` (12, gray‑600).
- Dropdown right: `Single loop`, other options: `Nested loops`, `Divide & conquer`, `No loop`.

Row 2:

- Label: `Work per element` (12, gray‑600).
- Dropdown: `O(1) each`, `O(log n) each`, etc.

Row 3:

- Tiny helper line: `This helps infer O(n), O(n²), O(n log n)…` (11, gray‑500).

---

## 5. Complexity class chips – `Pick complexity` (direct)

Visible when “Pick complexity” mode is active.

- Label: `Choose complexity class` (12, gray‑600) at 16px left.
- Horizontal / wrapped chip group inside 358px wide container:

Each chip: 90×32 (auto), radius 999, outline style.

Labels:

- `O(1)`
- `O(log n)`
- `O(n)`
- `O(n log n)`
- `O(n²)`
- `O(2ⁿ)`
- `O(n!)`

Selected chip: blue fill, white text.

---

## 6. Circle button – `Compute / Explain`

- 44×44 circle, centered, white fill, gray stroke, subtle shadow.
- Icon: `ƒ(n)` or `=`.

Acts as visual break between input and explanation.

---

## 7. Card – `Result summary`

Primary output summarizing the Big‑O class.

- Frame: 358×120, radius 16, `#111827` fill, margin 16.
- Padding 12.

Content:

- Header row:
    - `Time complexity` (12, gray‑300).
    - Small pill: `Worst‑case O(...)` (10, uppercase, gray‑900 on gray‑100).
- Main line:
    - Large text: `O(n log n)` (20, bold, white).
- Subline:
    - `For input size n, runtime grows roughly n × log₂(n).` (12, gray‑300).[[happycoders](https://www.happycoders.eu/algorithms/big-o-notation-time-complexity/)]
- Meta:
    - `Typical examples: merge sort, heap sort.` (11, gray‑400).[[happycoders](https://www.happycoders.eu/algorithms/big-o-notation-time-complexity/)]

---

## 8. Card – `Growth intuition`

Visual, textual explanation similar to charts/cheat sheets.bigocheatsheet+1

- Frame: 358×150, radius 16, white fill, stroke `#E5E7EB`, margin 16.
- Padding 12.

Content:

- Title: `How does it grow?` (14, semibold).
- Mini table (2 columns):
    - Left column labels (12, gray‑600): `n = 10`, `n = 100`, `n = 1000`.
    - Right column values (12, monospace):
        - For O(n log n): `≈ 33`, `≈ 664`, `≈ 9966` “steps”.
- Underneath, a small horizontal bar chart feel:
    - Three rectangles of increasing width for n = 10, 100, 1000.

Helper text: `Not exact counts, just growth comparison.` (11, gray‑500).

---

## 9. Strip – `Compare with others`

Quick comparison vs other common classes.bigocheatsheet+1

- Label: `Compare classes` (12, gray‑600).
- Horizontal scroll chips (outline):

Examples:

- `O(1) – constant`
- `O(log n) – logarithmic`
- `O(n²) – quadratic`
- `O(2ⁿ) – exponential`

Selecting another chip temporarily flips the summary + growth cards to that class so users can “feel” the difference.

---

## 10. Expandable card – `Formal definition & notes`

For theory or exam prep.geeksforgeeks+1

- Frame: 358×auto, radius 16, `#F8FAFC` fill, margin 16.
- Header: `Definition & examples` (14, semibold) + chevron.

Expanded content:

- Text block (12, gray‑700):
    - Short definition:
        
        `O(f(n)) gives an upper bound on runtime as n grows.`geeksforgeeks+1
        
    - Bullet examples per class (e.g., `O(1): array index access`, `O(n): single loop`, `O(n²): nested loops`).timecomplexity+1

---

## 11. Bottom row – `Actions`

Standard bottom bar consistent with other tools.

- Frame: 390×64, white, top radius 24, top border `#E5E7EB`.
- Left text button: `Reset`.
- Right primary pill: `Save note` or `Copy summary` (120×40, blue fill, white text).