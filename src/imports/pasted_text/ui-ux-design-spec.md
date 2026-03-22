You are a professional UI/UX developer, Visualize the following:

1. Top bar – Header

Curved rectangle spanning the top (status bar + app bar height).

Left: app name in two lines (strong hierarchy):

Small label: Toolbox

Larger title: Dev Calculators

Right: icon buttons: ☀/🌙 (theme toggle), ⋯ (more/settings).



2. Below header – Welcome strip

Narrow rounded rectangle just under the header.

Text: small, muted Good evening, Alex (or generic greeting).

Second line, slightly larger: What do you need to calculate today?

Purpose: sets context without stealing focus from the main selection.



3. Horizontal chips row – Category filter

Scrollable row of pill buttons beneath the welcome strip.

Label above, tiny all-caps: CATEGORIES.

Chips examples:

All

IT / CS

Networking

Math

Everyday

Selected chip has filled background; others are outlined.



4. Search bar – Calculator search

Full‑width rounded search field.

Placeholder: Search calculators (e.g. radix, subnet)…

Left icon: magnifying glass.

Right icon: small ⌄ for filters (future feature, but visually there).



5. Main list – Calculator cards

Scrollable vertical list of medium‑sized cards (each a curved rectangle).

Each card shows one calculator, with clear text hierarchy:

Top left: tiny pill label: e.g. IT / CS.

Main title (largest on the card): e.g. Radix converter.

Supporting line (smaller, muted): Convert numbers between bases 2–36.

Right side: simple icon (e.g. binary digits, network node).

Bottom line (tiny): Last used: 2h ago or New.

On mobile, aim for 4–6 visible cards before scroll.



6. Section divider – Section label

As the user scrolls, show a text divider to group cards.

Example:

Text (centered, small caps): RECENTLY USED.

Thin line left/right or just extra top margin.

Under it, cards that are specifically recent calculators.

Then another divider:

POPULAR IN IT / CS

Followed by more calculator cards.



7. Bottom dock – Quick actions

Fixed, small bar at the very bottom (above Android/iOS nav).

Curved rectangle with 3–4 icon+label buttons:

Home (filled, current).

Favorites (star).

History (clock).

More (grid or menu).

This keeps the homepage visually grounded and suggests future navigation, but for now it’s just structure.



8. Floating button – Primary shortcut

Small circular button partially overlapping the calculator list near bottom right.

Icon: ➕ or ⚙ with label on tooltip: Customize.

In the current phase it’s only visual, but it signals “add custom calculator / manage set” later.

