# Dark Theme Design System - Dev Calculators

## 🎨 Color System

### Dark Mode Colors (SOLID ONLY - NO GRADIENTS)

```css
/* Primary Background - Very Dark Blue-Gray */
--background: #0f1419;

/* Text Primary - Off-White */
--foreground: #e8eaed;

/* Card Fill - Medium Dark Gray-Blue */
--card: #1a1f2e;

/* Secondary Background - Slightly Lighter Dark Blue-Gray */
--popover: #151b26;

/* Accent Color - Purple (All buttons, selected states, highlights) */
--primary: #8b5cf6;
--accent: #8b5cf6;

/* Secondary Elements */
--secondary: #252b3b;

/* Muted Elements */
--muted: #1e2433;

/* Text Secondary - Light Gray */
--muted-foreground: #9ca3af;

/* Input Backgrounds - Darker Gray */
--input: #131820;
--input-background: #131820;

/* Result Blocks - Darkest Blue-Gray */
--result-bg: #0a0e14;

/* Borders - Subtle Medium Gray */
--border: #2d3748;
```

---

## 📐 Component Specifications

### Headers
- **Background:** Dark card fill (`#1a1f2e`)
- **Text:** Off-white (`#e8eaed`)
- **Accent:** Purple underline on title (`#8b5cf6`)
- **Border:** Subtle border-bottom with purple accent

```tsx
<header className="bg-blue-600 dark:bg-[#1a1f2e] text-white border-b-2 border-purple-600 dark:border-purple-500">
```

---

### Input Fields
- **Background:** Darker gray (`#131820`)
- **Text:** Bright white/off-white
- **Borders:** Subtle gray (`#2d3748`)
- **Padding:** 16px all around
- **Focus State:** Purple border (`#8b5cf6`)
- **Corner Radius:** 12px (rounded-xl)

```tsx
<input 
  className="bg-gray-50 dark:bg-[#131820] 
             text-gray-900 dark:text-white 
             border border-gray-200 dark:border-gray-700 
             rounded-xl p-4
             focus:border-purple-600 dark:focus:border-purple-500"
/>
```

---

### Primary Buttons
- **Fill:** Solid purple (`#8b5cf6`)
- **Text:** White
- **Shape:** Pill-shaped (large radius/rounded-full)
- **Minimum Height:** 44px
- **Hover:** Darker purple (`#7c3aed`)

```tsx
<button className="bg-purple-600 hover:bg-purple-700 
                   dark:bg-purple-600 dark:hover:bg-purple-700
                   text-white rounded-full h-[44px] px-6
                   shadow-lg transition-all duration-200">
  Calculate
</button>
```

**Large Primary Button (Array Calculator):**
- Width: 140px
- Height: 44px

---

### Secondary Buttons
- **Fill:** Dark card fill (`#252b3b`)
- **Text:** Off-white
- **Height:** 40px
- **Hover:** Slightly lighter

```tsx
<button className="bg-gray-100 dark:bg-[#252b3b]
                   text-gray-900 dark:text-white
                   h-10 px-4 rounded-xl
                   hover:bg-gray-200 dark:hover:bg-gray-700">
  Secondary
</button>
```

---

### Result Blocks
- **Background:** Darkest blue-gray (`#0a0e14`)
- **Text:** Bright white monospace (16px)
- **Shadow:** Subtle drop shadow
- **Border:** Dark gray (`#2d3748`)
- **Padding:** 16px

```tsx
<div className="bg-[#0a0e14] dark:bg-[#0a0e14] 
                border border-gray-800 dark:border-gray-700
                rounded-xl p-4 shadow-lg">
  <p className="text-white font-mono text-base">
    0x2A3C
  </p>
</div>
```

---

### Cards
- **Fill:** Medium dark fill (`#1a1f2e`)
- **Border:** Subtle gray stroke (`#2d3748`)
- **Corner Radius:** 12px (rounded-xl)
- **Internal Padding:** 12-16px
- **Shadow:** Subtle elevation shadow

```tsx
<div className="bg-white dark:bg-[#1a1f2e]
                border border-gray-200 dark:border-gray-700
                rounded-xl p-4 shadow-sm">
  Card Content
</div>
```

---

### Segmented Controls
- **Active Tab:** Solid purple fill (`#8b5cf6`)
- **Inactive Tab:** Transparent/dark background
- **Height:** 44px
- **Border Radius:** rounded-full

```tsx
<div className="bg-gray-100 dark:bg-[#1a1f2e] rounded-full p-1 flex gap-1">
  <button className={active 
    ? "bg-purple-600 text-white" 
    : "text-gray-700 dark:text-gray-300"}>
    Tab 1
  </button>
</div>
```

---

## 📏 Spacing System

- **Screen Gutters:** 16px
- **Between Major Sections:** 24px
- **Between Cards:** 16px
- **Internal Card Padding:** 12-16px
- **Input Field Padding:** 16px

---

## 🔤 Typography

### Font Families
- **Body Text:** System font stack
- **Numbers/Code/Results:** Monospace (font-mono)

### Font Sizes
- **12px:** Small labels, hints
- **14px:** Secondary text
- **16px:** Body text, inputs, results
- **20px:** Section headings
- **24px:** Page titles

### Font Weights
- **Normal:** 400
- **Medium:** 500 (labels, buttons)
- **Bold:** 600-700 (headings)

```tsx
<p className="text-xs">12px text</p>
<p className="text-sm">14px text</p>
<p className="text-base">16px text</p>
<p className="text-lg">18px text</p>
<p className="text-xl">20px text</p>
<p className="text-2xl">24px text</p>
```

---

## 🎯 Calculator-Specific Layouts

### 1. Array Address Calculator

**Layout Improvements:**
```
✅ Large purple "Calculate" button (140×44px)
✅ 16px padding around all input fields
✅ Index i/j cards: Side-by-side with 16px gap
✅ Formula display ABOVE result card
✅ Dark input backgrounds (#131820)
✅ Purple copy button (28×28px) in result
```

### 2. Arithmetic Operations

**Layout Improvements:**
```
✅ Dual operand cards: Side-by-side 172×100px (16px gap)
✅ Large operator symbol (28px) between operand cards
✅ Step-by-step preview card (120px height, scrollable)
✅ Base dropdowns: Purple accent on hover/focus
✅ Purple button fills
```

### 3. Bitwise Shift & Rotate

**Layout Improvements:**
```
✅ Segmented controls: Purple fill for active (44px height)
✅ Bit visualization: 32 small circles (8px each)
✅ Purple highlights for 1s in binary
✅ Results: 3 horizontal cards (Decimal/Binary/Hex) 116×80 each
✅ FAB repositioned higher, centered on second card
```

### 4. Radix Converter

**Layout Improvements:**
```
✅ From/To base cards: Side-by-side 172×80px (16px gap)
✅ Swap button: 40×40px circle BETWEEN base cards
✅ Result box: 28×28px copy button (right-aligned inside)
✅ Quick presets: Horizontal scrollable chips
✅ Purple accent throughout
```

### 5. 1's & 2's Complement

**Layout Improvements:**
```
✅ Segmented control: 3 equal-width segments (116px each)
✅ Bit width card: 32px total padding
✅ Results: 2 cards side-by-side (168×72 each)
✅ Purple "1's"/"2's" labels
✅ Complexity label O(1) below results
```

### 6. Big O Calculator

**Layout Improvements:**
```
✅ Code input: 180px height with line numbers
✅ Dark gray background for code
✅ Complexity chips: 3×3 grid (90×32 each)
✅ Purple fill when active
✅ Analysis buttons: Horizontal row
✅ Result preview: Right column (50% width)
```

---

## 🎨 Component Examples

### Input Field Component
```tsx
function DarkInput({ label, value, onChange }: Props) {
  const [focused, setFocused] = useState(false);
  
  return (
    <div className={`rounded-xl bg-gray-50 dark:bg-[#131820] 
                     border transition-all p-4 ${
                       focused 
                         ? 'border-purple-600 dark:border-purple-500' 
                         : 'border-gray-200 dark:border-gray-700'
                     }`}>
      <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
        {label}
      </label>
      <input
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full bg-transparent text-base font-mono 
                   text-gray-900 dark:text-white outline-none mt-1
                   placeholder:text-gray-400 dark:placeholder:text-gray-600"
      />
    </div>
  );
}
```

### Primary Button Component
```tsx
function PrimaryButton({ children, onClick }: Props) {
  return (
    <button 
      onClick={onClick}
      className="bg-purple-600 hover:bg-purple-700 
                 dark:bg-purple-600 dark:hover:bg-purple-700
                 text-white rounded-full h-[44px] px-6
                 shadow-lg transition-all duration-200
                 font-medium flex items-center justify-center gap-2">
      {children}
    </button>
  );
}
```

### Result Card Component
```tsx
function ResultCard({ title, value }: Props) {
  return (
    <div className="bg-[#0a0e14] dark:bg-[#0a0e14] 
                    border border-gray-800 dark:border-gray-700
                    rounded-xl p-4 shadow-lg">
      <span className="text-xs font-medium text-gray-400">
        {title}
      </span>
      <p className="text-2xl font-mono font-medium text-white mt-2">
        {value}
      </p>
    </div>
  );
}
```

### Segmented Control Component
```tsx
function SegmentedControl({ options, selected, onChange }: Props) {
  return (
    <div className="bg-gray-100 dark:bg-[#1a1f2e] 
                    rounded-full p-1 flex gap-1
                    border border-gray-200 dark:border-gray-700">
      {options.map(option => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`flex-1 px-4 py-2 rounded-full 
                      text-sm font-medium transition-all ${
                        selected === option.value
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}>
          {option.label}
        </button>
      ))}
    </div>
  );
}
```

---

## ✨ Shadows & Elevation

```css
/* Card Shadow */
shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)

/* Button Shadow */
shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1)

/* Result Card Shadow */
shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1)
```

---

## 🔄 Transitions

All interactive elements use smooth 0.2s transitions:

```tsx
transition-all duration-200 ease-out
```

---

## ♿ Accessibility

1. **Minimum tap targets:** 40×40px (44px preferred)
2. **Color contrast:** 4.5:1 minimum for text
3. **Focus indicators:** Purple ring on focus
4. **ARIA labels:** On all interactive elements

```tsx
<button 
  aria-label="Toggle theme"
  className="min-w-[40px] min-h-[40px]">
```

---

## 📱 Mobile-First Approach

1. **Thumb-friendly zones:** Bottom 1/3 of screen
2. **Generous spacing:** 16px minimum between tappable elements
3. **Scrollable areas:** Clearly indicated
4. **Safe areas:** Respect device notches

---

## 🎯 Implementation Checklist

For each calculator:

- [ ] Remove all gradients, use solid colors
- [ ] Update background to `#0f1419` in dark mode
- [ ] Update card backgrounds to `#1a1f2e`
- [ ] Update input backgrounds to `#131820`
- [ ] Change all blue accents to purple (`#8b5cf6`)
- [ ] Update all borders to `#2d3748`
- [ ] Add proper focus states (purple border)
- [ ] Use monospace font for all numbers/code
- [ ] Ensure 16px padding on input fields
- [ ] Make primary buttons purple with 44px height
- [ ] Update result blocks to `#0a0e14` background
- [ ] Apply consistent 12px border radius (rounded-xl)
- [ ] Add proper dark mode text colors
- [ ] Implement smooth 0.2s transitions
- [ ] Test contrast ratios (4.5:1 minimum)

---

## 🎨 Design Token Reference

```tsx
// Background Colors
bg-primary: "bg-gray-50 dark:bg-[#0f1419]"
bg-card: "bg-white dark:bg-[#1a1f2e]"
bg-secondary: "bg-gray-100 dark:bg-[#252b3b]"
bg-input: "bg-gray-50 dark:bg-[#131820]"
bg-result: "bg-[#0a0e14] dark:bg-[#0a0e14]"

// Text Colors
text-primary: "text-gray-900 dark:text-white"
text-secondary: "text-gray-600 dark:text-gray-400"
text-muted: "text-gray-500 dark:text-gray-500"

// Border Colors
border-default: "border-gray-200 dark:border-gray-700"
border-input: "border-gray-300 dark:border-gray-700"
border-focus: "border-purple-600 dark:border-purple-500"

// Button Colors
btn-primary: "bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700"
btn-secondary: "bg-gray-100 dark:bg-[#252b3b] hover:bg-gray-200 dark:hover:bg-gray-700"
```

---

**Status:** ✅ Design System Complete  
**Coverage:** All 7 calculators  
**Theme:** Dark blue-gray with purple accents  
**Style:** Solid colors only (no gradients)  
**Ready for:** Production implementation
