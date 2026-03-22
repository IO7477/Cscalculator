## 1. Top bar – `Header / Address Calc`

Standard header.

- Frame: 390×88, white fill, bottom radius 24.
- Left:
    - `Toolbox` (12, gray‑600).
    - `Array & Record Addresses` (24, bold, near‑black).
- Right: help `?` (32×32 pill), options `⋯`.
- Far left: back chevron.

---

## 2. Segmented control – `Array type`

Selector for 1D/2D/3D/Record.

- Frame: 358×44, pill radius 999, `#F9FAFB` fill, margin 16.
- Segments (88px each):
    - `1D Array`
    - `2D Array` (selected)
    - `3D+ Array`
    - `Record`

---

## 3. Card – `Base address (α)`

Core input from PDF formula.

- Frame: 358×80, radius 16, `#F3F4F6` fill, stroke `#E5E7EB`, margin 16.
- Vertical (padding 12):
    - Label: `Base address (α)` (12, gray‑600).
    - Input: `0x2000` (monospace 16).
    - Helper: `Starting memory address (hex or decimal)` (11, gray‑500).

---

## 4. Parameter cards – `Array indices & sizes`

Dynamic cards based on selected array type.

**For 2D Array** (shows 2 index cards + 1 size card):

**Card 1 – `Index i`**:

- Frame: 172×72, radius 16, light gray fill, left margin 16.
- Label: `Index i` (12, gray‑600).
- Input: `2` (16, monospace).

**Card 2 – `Index j`**:

- Identical frame, right margin 16.
- Label: `Index j`.
- Input: `3`.

**Card 3 – `Element size`**:

- Frame: 358×72, margin 16 below indices.
- Label: `Element size (bytes)` (12, gray‑600).
- Input: `4` (int/float).
- Helper: `esize from declaration` (11, gray‑500).

**For Records** (instead of indices):

- Single card showing `RecordType.field1` dropdown.

**Dynamic**: 1D shows only `i`; 3D shows `i`, `j`, `k` + UB2, UB3 inputs.

---

## 5. Card – `Upper bounds (for multi‑D)`

Conditional for 2D+ arrays.

- Frame: 358×72, radius 16, white fill, margin 16.
- For 2D: `Upper bound 2 (UB₂): 10` (16, monospace).
- Helper: `From declaration A[10][15]` (11, gray‑500).

---

## 6. Formula display – `Live formula`

Educational block showing PDF equation.

- Frame: 358×64, radius 16, `#F8FAFC` fill, margin 16.
- Padding 12.

Content:

- LaTeX‑style: `A₂₃ = 0x2000 + (2×15 + 3) × 4` (monospace 14, near‑black).
- Right: `Recalculate` button (small blue pill).

Updates live as inputs change.

---

## 7. Circle button – `Compute address`

Standard divider.

- 44×44 circle, white/gray stroke/shadow.
- Icon: `➜` or memory chip symbol.

---

## 8. Card – `Calculated address`

Primary result.

- Frame: 358×96, radius 16, `#111827` fill, margin 16.
- Padding 12.

Content:

- Header: `Address of A₂₃` (12, gray‑300).
- Large result: `0x2014` (monospace 24, white).
- Meta rows:
    - `Decimal: 8212` (12, gray‑400).
    - `Binary: 0001 1111 0001 0100` (12, monospace, gray‑400).
- Copy button: 32×32 pill, `📋`.

---

## 9. Expandable card – `Step breakdown`

Detailed calculation matching PDF formulas.

- Frame: 358×auto, radius 16, white fill, stroke `#E5E7EB`, margin 16.
- Header toggle: `Show calculation` (14, semibold) + chevron.

Expanded content (vertical monospace blocks):

`textAij = α + (i × UB₂ + j) × esize
  = 0x2000 + (2 × 15 + 3) × 4
  = 0x2000 + (30 + 3) × 4  
  = 0x2000 + 33 × 4
  = 0x2000 + 132
  = 0x2014 ✓`

For records: `Record.field3 = α + (field1 + field2) * esize`.

---

## 10. Strip – `Quick presets`

Pills for common scenarios.

- Label: `Quick presets` (12, gray‑600).
- Chips:
    - `1D int[100] i=5`
    - `2D char[10][20] 2,3`
    - `Record offset field2`
    - `3D float[5][6][7] 1,2,3`

---

## 11. Bottom row – `Actions`

Standard.

- `Clear all` (left).
- `Save calculation` (right blue pill).