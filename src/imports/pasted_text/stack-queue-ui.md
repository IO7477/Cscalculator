## **1. Top bar – `Header / Stack & Queue`**

- Frame: 390×88, white, bottom radius 24.
- Left:
    - `Toolbox` (12, gray‑600).
    - `Stack & Queue` (24, bold, near‑black).
- Right: 32×32 pill `?` (help), 32×32 pill `⋯`.
- Back chevron on far left.

---

## **2. Segmented control – `Structure selector`**

Switch between stack and queue views (same screen, shared layout).

- Frame: 358×44, pill radius 999, fill `#F9FAFB`, margin 16.
- Segments (179×36):
    - `Stack (LIFO)` (selected default).
    - `Queue (FIFO)`.

Selected: blue fill, white text.

---

## **3. Card – `Input value`**

Shared value entry.

- Frame: 358×80, radius 16, `#F3F4F6` fill, stroke `#E5E7EB`, margin 16.
- Padding 12, vertical:
    - Label: `Value` (12, gray‑600).
    - Text field: placeholder `e.g., 42` (16, near‑black).
    - Helper: `Any short label or number` (11, gray‑500).

---

## **4. Operation buttons – `Stack actions` / `Queue actions`**

Horizontal buttons under input, content depends on active segment.

## **For Stack:**

- Container frame: 358×44, margin 16, horizontal auto‑layout, space‑between.
- Buttons (each 168×40, radius 999):
    - Primary: `Push` (blue fill, white text).
    - Secondary: `Pop` (white fill, gray border, gray‑800 text).

Small text under: `Top of stack is at the right.` (11, gray‑500).

## **For Queue:**

- Buttons:
    - Primary: `Enqueue` (blue).
    - Secondary: `Dequeue` (border).

Helper: `Front of queue is on the left.` (11, gray‑500).

---

## **5. Visualization card – `Stack view`**

Shown when Stack is active.

- Frame: 358×220, radius 16, white fill, stroke `#E5E7EB`, margin 16.
- Padding 12.

Content:

- Header row:
    - Title: `Stack` (14, semibold).
    - Tiny pill: `Size: 0` (11, gray‑700 on gray‑100).
- Main area: vertical auto‑layout aligned to bottom:
    - Each stack element: 300×32 rounded rectangle, fill `#E5E7EB`, text centered (value).
    - Elements stacked bottom‑up with 4px gap.
- Right side: label `Top` with arrow pointing to last element.

Empty state: grey text centered `Stack is empty. Use Push to add items.` (12, gray‑400).

---

## **6. Visualization card – `Queue view`**

Shown when Queue is active.

- Frame: 358×220, radius 16, white fill, stroke `#E5E7EB`, margin 16.
- Padding 12.

Content:

- Header row:
    - Title: `Queue` (14, semibold).
    - Pill: `Size: 0`.
- Main area: horizontal auto‑layout centered:
    - Each item: 48×48 rounded square, fill `#E5E7EB`, value centered.
    - 8px gaps between.
- Underneath:
    - Left label: `Front` with arrow to first item.
    - Right label: `Rear` with arrow to last item.

Empty state: `Queue is empty. Use Enqueue to add items.`

---

## **7. History card – `Operation log`**

Shows recent operations for learning/debugging.

- Frame: 358×auto, radius 16, `#F8FAFC` fill, stroke `#E5E7EB`, margin 16.
- Padding 12.

Content:

- Title: `Operations` (14, semibold).
- List items (each 1 row, 12px text, monospace):
    - `Push(42) → [10, 21, 42]`
    - `Pop() → removed 42`
- Max 5–8 entries, then scroll.

Empty: `No operations yet.` (12, gray‑400).

---

## **8. Info strip – `Definition & properties`**

Short theory reminder.

- Frame: 358×72, radius 16, white fill, stroke `#E5E7EB`, margin 16.
- Padding 12.

Dynamic text depending on mode:

- Stack:
    - `LIFO: Last In, First Out. Top is where push/pop occur. Common uses: undo stack, function call stack.` (mix 12/11, gray‑700).
- Queue:
    - `FIFO: First In, First Out. Enqueue at rear, dequeue at front. Common uses: task scheduling, BFS.`

---

## **9. Strip – `Quick presets`**

Chips to quickly set up initial states.

- Label: `Quick presets` (12, gray‑600), margin 16 left.
- Scroll chips (outline style):

For stack mode:

- `Fill [1,2,3]`
- `Reverse 3 items`
- `Clear`

For queue mode:

- `Fill [A,B,C]`
- `Max size 5`
- `Clear`

---

## **10. Bottom row – `Actions`**

Standard bottom bar.

- Frame: 390×64, white, top radius 24, top border `#E5E7EB`.
- Left text button: `Reset structure`.
- Right primary pill: `Copy state` (120×40, blue fill, white text).

---