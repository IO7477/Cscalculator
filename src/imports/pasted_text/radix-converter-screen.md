Here’s a Figma‑style component breakdown for a **Radix Converter** screen that visually fits your existing “Dev Calculators” mobile home (same radii, typography, and general structure).

Assume: 390×844 frame, light theme like your mock, radius‑lg for big cards, radius‑pill for chips.

***

## 1. Top bar – `Header / Radix`

Reuse the home header structure for consistency.

- Frame: 390×88, Fill: white, bottom corners radius 24.
- Left stack:
  - Small label: `Toolbox` (12, medium, gray‑600).
  - Large title: `Radix converter` (24, bold, near‑black).
- Right:
  - Icon button 1: 32×32, pill, light gray fill, icon `?` (help).
  - Icon button 2: 32×32, pill, icon `⋯` (options).
- Optional back affordance:
  - Back chevron at far left, 24×24, before “Toolbox”.

***

## 2. Card – `Number input`

Matches the “Welcome strip” and search field style from home.

- Frame: 358×96, radius 16, light gray fill (`#F3F4F6`), stroke subtle (`#E5E7EB`), margin 16 sides, 16 below header.
- Vertical stack inside (padding 12, 12):
  - Label: `Number to convert` (12, medium, gray‑600).
  - Input row (horizontal):
    - Value text: `101010…` or placeholder `Enter value` (18, medium, near‑black).
  - Helper text row:
    - Small gray text: `Supports base 2–32` (11, regular, gray‑500).

Variant states:
- Focused: stroke `#2563EB`, subtle shadow.
- Error: stroke `#DC2626`, helper text `Invalid digit for base 16`.

***

## 3. Two cards – `From / To base`

Use side‑by‑side cards like the home page’s category filter, but stacked for mobile.

### 3a. `From base` card

- Frame: 358×80, radius 16, white fill, stroke `#E5E7EB`, margin 16.
- Vertical stack (padding 12):
  - Label row:
    - Text: `From base` (12, medium, gray‑600).
    - Small info icon `i` on the right, 16×16, gray‑400.
  - Value row:
    - Large text: `Decimal (10)` (16, semibold, near‑black).
    - Right aligned dropdown chevron.

### 3b. `To base` card

- Same as above; label `To base`, value `Hexadecimal (16)` or `Base 2`, etc.

Below both, a small line of text: `Range: base 2 to base 32` (11, gray‑500) aligned with left margin.

***

## 4. Bar button – `Base range selector`

Optional control directly tied to “radii 2–32”.

- Frame: 358×44, radius 999 (pill), fill `#F3F4F6`, margin 16.
- Inside: horizontal slider or segmented feel:
  - Small label on left: `Base range` (12, gray‑600).
  - Right: `2 – 32` in bold, 14, with tiny chevron to indicate you can tweak allowed range (future feature, UI‑only for now).

***

## 5. Middle control – `Swap bases`

Echo the home page “swap” metaphor.

- Circle button centered horizontally between From/To area and Result.

Properties:
- 40×40, radius 20.
- Fill: white, stroke `#E5E7EB`, subtle shadow.
- Icon: `⇄` (arrows up/down or left/right), 18px, gray‑700.

Spacing:
- 12px margin above and below this control to separate sections.

***

## 6. Card – `Result`

Stylistically close to the number‑input card but visually stronger.

- Frame: 358×110, radius 16, fill near‑black (`#111827`), no stroke, margin 16, top margin 8–12.
- Padding 12 all around.

Content:
- Label row:
  - Text: `Result` (12, medium, gray‑300).
  - Right: small pill `Read‑only` (10, uppercase, gray‑100 on gray‑700).
- Value row:
  - Large monospaced number text: `1111101000…` (18, medium, white).
- Meta row:
  - Left tiny text: `Decimal (10) → Hex (16)` (11, regular, gray‑400).
  - Right: copy button:
    - 28×28, radius 999, fill `#1F2937`, icon `📋` or two rectangles.

Variants:
- Empty state: placeholder `Converted value will appear here` (13, gray‑500).
- Long value: enable horizontal scroll or `…` ellipsis; keep monospaced font for clarity.

***

## 7. Strip – `Quick presets`

Shortcuts aligned with the home’s category chips aesthetic.

- Label: `Quick presets` (12, medium, gray‑600) at 16px left, margin‑top 8.
- Horizontal scroll row beneath, pill buttons (same chip style as CATEGORIES on home):

Examples:
- `Bin ↔ Dec`
- `Dec ↔ Hex`
- `Hex ↔ Bin`
- `Oct ↔ Dec`

Each chip:
- 80–120px width (auto), 32px height, pill radius, regular/medium text.
- Selected when applied; subtle colored border (e.g., blue) to indicate active mapping.

***

## 8. Section – `Conversion details`

Lightweight info section that mirrors home’s text dividers.

- Divider label: `DETAILS` (11, medium, gray‑500) with lines left/right, margin 16.
- Below, small stacked text block in a card:

Card frame:
- 358×auto, radius 16, fill white, stroke `#E5E7EB`, padding 12, margin 16.

Content:
- Line 1: `Input value (base 10): 123456` (12, mono, gray‑700).
- Line 2: `Output value (base 16): 1E240` (12, mono, gray‑700).
- Line 3: `Digits allowed in base 16: 0–9, A–F` (11, gray‑500).

This reinforces learning, in sync with the more “educational” home.

***

## 9. Bottom area – `Pinned actions`

Instead of full bottom nav (which remains on the home), use a light fixed row for contextual actions.

- Frame: 390×64, white, top radius 24, stroke top `#E5E7EB`.
- Inside (horizontal, space‑between, padding 16):
  - Left button: `Reset` (text button, 14, gray‑700).
  - Right button: pill primary: 120×40, radius 999, fill blue (`#2563EB`), text `Copy result` (14, medium, white).

This aligns visually with your home bottom nav while staying task‑focused.

***

If you want, next step I can convert this into concrete Tailwind/React class suggestions aligned with your existing `className="min-h-screen bg-gray-50 pb-24"` setup so you can code it straight away.