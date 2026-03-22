## 1. Top bar – `Header / Bitwise Shift`

Identical header structure.

- Frame: 390×88, white fill, bottom radius 24.
- Left:
    - `Toolbox` (12, gray‑600).
    - `Bitwise Shift & Rotate` (24, bold, near‑black).
- Right: help `?` (32×32 pill), options `⋯`.
- Far left: back chevron.

---

## 2. Card – `Input number`

Standard input card.

- Frame: 358×96, radius 16, `#F3F4F6` fill, stroke `#E5E7EB`, margin 16.
- Vertical (padding 12):
    - Label: `Number (decimal)` (12, gray‑600).
    - Input: `123456` (18, near‑black).
    - Helper: `Integer 0–2³²‑1` (11, gray‑500).

---

## 3. Segmented control – `Operation type`

Horizontal segments for shift vs rotate.

- Frame: 358×44, pill radius 999, `#F9FAFB` fill, margin 16.
- 3 segments (116px each, height 36):
    - `Left Shift (<<)` (blue fill selected).
    - `Right Shift (>>)` (outline).
    - `Rotate` (outline).

---

## 4. Card – `Shift parameters`

Compact card for shift amount + bit width.

- Frame: 358×88, radius 16, white fill, stroke `#E5E7EB`, margin 16.
- Two horizontal rows inside (padding 12):

**Row 1**:

- Left label: `Shift amount` (12, gray‑600).
- Right input: `3` (16, semibold) + small chevron.

**Row 2**:

- Left label: `Bit width` (12, gray‑600).
- Right dropdown: `32 bits` (16, semibold).

Helper below: `Shift by 0–31 positions` (11, gray‑500).

---

## 5. Toggle card – `Rotate mode` (conditional)

Only shown when “Rotate” is selected.

- Frame: 358×64, radius 16, `#F3F4F6` fill, margin 16.
- Inside (horizontal, padding 12):
    - Toggle switch: left off/right on, 44×28, blue accent.
    - Label right: `Circular rotation (wraps around)` (14, medium, gray‑700).
    - Info icon `i` far right.

---

## 6. Circle button – `Perform operation`

Visual divider like previous calculators.

- 44×44 circle, white fill, gray stroke, shadow, centered.
- Icon: `⇄` or `⟲` (shift arrows), 20px gray‑700.

---

## 7. Card – `Results` (multi‑format)

Rich output showing decimal, binary, hex.

- Frame: 358×160, radius 16, `#111827` fill, margin 16.
- Padding 12.

Vertical structure:

- Header row:
    - `Results` (12, gray‑300).
    - Copy button 28×28 pill, gray fill, `📋`.
- **Decimal output**:
    - Label: `Decimal` (11, gray‑400).
    - `987654` (16, monospace, white).
- **Binary output**:
    - Label: `Binary (32 bits)` (11, gray‑400).
    - `0001 1011 0010…` (14, monospace, white).
- **Hex output**:
    - Label: `Hex` (11, gray‑400).
    - `F1A2B3C` (16, monospace, white).
- Meta: `123456 << 3 = 987648` (10, gray‑500).

Empty state: `Set parameters above`.

---

## 8. Strip – `Quick presets`

Horizontal pills like other calculators.

- Label: `Quick presets` (12, gray‑600).
- Scrollable chips:
    - `<< 1` (logical shift)
    - `>> 1` (arithmetic)
    - `Rotate left 8`
    - `Rotate right 8`
    - `32‑bit align`
    - `Sign extend`

Style: outline default, blue fill active.

---

## 9. Card – `Bit visualization`

Unique visual feature for bitwise tools.

- Frame: 358×auto, radius 16, white fill, stroke `#E5E7EB`, margin 16.
- Padding 12.

Content:

- Title: `Bit view (32 bits)` (14, semibold).
- Horizontal bit strip:
    - 32 small circles or rectangles (8px each), connected by thin line.
    - `1` bits: blue fill.
    - `0` bits: gray fill.
    - Left label: `MSB` … `LSB` right.
- Below: slider handle showing shift position (vertical line marker).

This makes bitwise ops tangible.

---

## 10. Bottom row – `Actions`

Consistent with previous.

- Frame: 390×64, white, top radius 24.
- `Reset` (left text button).
- `Copy all formats` (right blue pill, 120×40).

---