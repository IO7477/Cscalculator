---

## 1. Top bar – `Header / Arithmetic`

Standard header.

- Frame: 390×88, white fill, bottom radius 24.
- Left:
    - `Toolbox` (12, gray‑600).
    - `Arithmetic Operations` (24, bold, near‑black).
- Right: help `?` (32×32 pill), options `⋯`.
- Far left: back chevron.

---

## 2. Segmented control – `Operation selector`

Top‑level operation picker.

- Frame: 358×44, pill radius 999, `#F9FAFB` fill, margin 16.
- 4 segments (88px each, height 36):
    - `Add (+)`
    - `Subtract (−)`
    - `Multiply (×)`
    - `Divide (÷)`

Blue fill for selected operation.

---

## 3. Dual input cards – `Operands`

Two input cards side‑by‑side feel, stacked on mobile.

**Card A** (`Operand 1`):

- Frame: 172×100, radius 16, `#F3F4F6` fill, stroke `#E5E7EB`, left margin 16.
- Vertical (padding 12):
    - Label: `Operand 1` (12, gray‑600).
    - Input: `1010` (monospace 18).
    - Base selector below: `Base 2` dropdown (14, semibold).

**Card B** (`Operand 2`):

- Identical frame, right margin 16.
- Label: `Operand 2`.
- Input + base selector.

**Operator indicator** between cards:

- Large symbol: `+` or `−` etc. (28px, bold, gray‑700) centered below segment control.

---

## 4. Card – `Output base`

Single card for result base.

- Frame: 358×72, radius 16, white fill, stroke `#E5E7EB`, margin 16.
- Vertical (padding 12):
    - Label: `Output base` (12, gray‑600).
    - Dropdown value: `Hexadecimal (16)` (16, semibold).
    - Helper: `Result shown in selected base` (11, gray‑500).

---

## 5. Circle button – `Calculate`

Divider button.

- 44×44 circle, white, gray stroke, shadow, centered.
- Icon: `=` (24px) or calculator symbol.

---

## 6. Card – `Result`

Primary output.

- Frame: 358×120, radius 16, `#111827` fill, margin 16.
- Padding 12.

Content:

- Header: `Result` (12, gray‑300) + copy `📋`.
- Large result: `1E2` (monospace 20, white).
- Meta: `1010₂ + 110₂ = 1E2₁₆` (11, gray‑400, with sub/superscript bases).

---

## 7. Scrollable card – `Step‑by‑step` (PDF core feature)

Key educational component showing column‑by‑column calculation.

- Frame: 358×auto (scrollable), radius 16, white fill, stroke `#E5E7EB`, margin 16.
- Padding 12.

**Structure per operation** (vertical stack):

**For Addition**:

- Title: `Addition steps (base 2)` (14, semibold).
- Animated/stepped columns:
    
    `text1 0 1 0   ← Operand 1
      + 1 1 0   ← Operand 2
    ---------
      1 0 0 0   ← Result
        ↑ ↑     ← Carry flags`
    

**For Subtraction**: show borrow arrows.

**Multiplication**: partial products stacked.

**Division**: long division bracket.

Each step:

- Monospace text block (12).
- Highlight current column (blue background).
- Helper text: `Carry 1 to next column` (11, gray‑500).

Toggle: `Show steps` / `Hide steps` switch at top.

---

## 8. Strip – `Quick presets`

Pills for common operations.

- Label: `Quick presets` (12, gray‑600).
- Horizontal scroll:
    - `Binary add 1`
    - `Hex multiply 10`
    - `Octal divide 2`
    - `Power of 2 check`

---

## 9. Card – `Overflow / Validation`

Error and edge case display.

- Frame: 358×64 (conditional), radius 16, yellow fill (`#FEF3C7`), margin 16.
- Inside:
    - Icon: warning triangle left.
    - Text: `Overflow detected in base 2` (12, gray‑800).
    - Right: `Ignore` / `Adjust` toggle.

---

## 10. Bottom row – `Actions`

Standard.

- Frame: 390×64, white, top radius 24.
- `Clear` (left).
- `Copy full steps` (right blue pill).

---