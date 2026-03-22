## 1. Top bar – `Header / Complements`

Matches radix converter header exactly.

- Frame: 390×88, Fill: white, bottom radius 24.
- Left vertical stack:
    - `Toolbox` (12, medium, gray‑600).
    - `1’s & 2’s Complement` (24, bold, near‑black).
- Right:
    - Icon button: 32×32 pill, gray fill, `?` (help).
    - Icon button: 32×32 pill, `⋯` (options).
- Far left: back chevron before “Toolbox”.

---

## 2. Card – `Input number`

Same style as radix converter’s number input card.

- Frame: 358×96, radius 16, light gray fill (`#F3F4F6`), stroke `#E5E7EB`, margin 16 sides, 16 below header.
- Vertical stack (padding 12):
    - Label: `Binary number` (12, medium, gray‑600).
    - Input field: `10101010` (monospace 18, medium, near‑black).
    - Helper: `Enter 8–32 bits (0s and 1s only)` (11, gray‑500).

Variants:

- Error: stroke red, helper `Only 0s and 1s allowed`.

---

## 3. Segmented control – `Complement type`

Horizontal segmented buttons (like category chips but with fill states).

- Frame: 358×44, radius 999 (pill container), fill `#F9FAFB`, margin 16.
- Inside: 3‑segment horizontal auto‑layout:
    - Segment 1: `1’s Complement` (selected fill blue, text white).
    - Segment 2: `2’s Complement` (outline, gray text).
    - Segment 3: `Both` (outline, gray text).

Each segment: 116px wide, radius 999, height 36px, padding horizontal 12.

---

## 4. Card – `Bit width`

Smaller card for bit length selection.

- Frame: 358×72, radius 16, white fill, stroke `#E5E7EB`, margin 16.
- Vertical stack (padding 12):
    - Label row:
        - `Bit width` (12, medium, gray‑600).
        - Info icon `i` right, 16×16 gray.
    - Dropdown‑like value:
        - `8 bits` (16, semibold, near‑black) + chevron right.
        - Helper below: `Common sizes: 8, 16, 32` (11, gray‑500).

---

## 5. Circle button – `Invert & Add 1`

Visual separator like radix swap button.

- 40×40 circle, white fill, gray stroke, subtle shadow, centered, 12px margin above/below.
- Icon: `↕` (arrows) or `1+` (custom), 18px gray‑700.

Purpose: visual divider between input and result.

---

## 6. Card – `Results`

Dual‑output card, stronger visual emphasis.

- Frame: 358×140, radius 16, fill near‑black (`#111827`), margin 16.
- Padding 12.

Structure (vertical stack):

- Label row:
    - `Results` (12, medium, gray‑300).
    - Right: copy‑all button 28×28 pill, gray fill, `📋` icon.
- **1’s Complement result**:
    - Label: `1’s Complement` (11, medium, gray‑400).
    - Value: `01010101` (monospace 16, white).
- **2’s Complement result**:
    - Label: `2’s Complement` (11, medium, gray‑400).
    - Value: `01010110` (monospace 16, white).
- Meta: `Input: 10101010 (8 bits)` (10, gray‑500).

Variants:

- Empty: `Enter binary above` placeholder gray.
- Long values: monospace + horizontal scroll.

---

## 7. Strip – `Quick presets`

Horizontal pill chips like radix quick presets.

- Label: `Quick presets` (12, gray‑600), margin 16 left.
- Scrollable row:

Pills:

- `Invert bits (1’s)`
- `Add 1 to 1’s (2’s)`
- `8‑bit all 1s`
- `16‑bit all 1s`

Style: same as category chips (outline default, blue fill selected).

---

## 8. Card – `Explanation`

Educational block matching home page text hierarchy.

- Frame: 358×auto, radius 16, white fill, stroke `#E5E7EB`, margin 16.
- Padding 12.

Content (vertical):

- Title: `How it works` (14, semibold, near‑black).
- 1’s explanation: `Flip all bits (0→1, 1→0)` (12, gray‑700).
- 2’s explanation: `1’s complement + 1` (12, gray‑700).
- Small badge: `CS fundamentals` (10, blue text, blue outline).

---

## 9. Bottom row – `Actions`

Light fixed bar for task completion.

- Frame: 390×64, white, top radius 24, stroke top `#E5E7EB`.
- Horizontal space‑between:
    - Left: `Reset` text button (14, gray‑700).
    - Right pill button: 120×40, blue fill, `Copy all` (14, white).

---