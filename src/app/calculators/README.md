# Dev Calculators - Organized Structure

All calculators in this app follow a consistent UI/UX pattern inspired by the Arithmetic Operations calculator.

## 📁 Folder Structure

```
/src/app/
├── calculators/           # Calculator exports (index)
│   └── index.ts          # Centralized exports
├── pages/                # Calculator implementations
│   ├── RadixConverter.tsx
│   ├── TwosComplement.tsx
│   ├── BitwiseOperations.tsx
│   ├── ArithmeticOperations.tsx
│   ├── MemoryAddressCalculator.tsx
│   ├── BigOCalculator.tsx
│   ├── StackQueueCalculator2.tsx
│   └── ExpressionEvaluator.tsx
└── components/           # Calculator-specific components
    ├── shared/           # Shared components
    │   └── CalculatorHeader.tsx
    ├── radix/           # Radix converter components
    ├── complement/      # Complement calculator components
    ├── bitwise/         # Bitwise operations components
    ├── arithmetic/      # Arithmetic operations components
    ├── memory/          # Memory address components
    ├── bigo/            # Big O calculator components
    ├── stackqueue/      # Stack & Queue components
    └── expression/      # Expression evaluator components
```

## 🎨 Consistent UI/UX Pattern

All calculators follow this standard format:

### 1. **Header Component**
- Back button (navigates to home)
- Title with "Toolbox" subtitle
- Help and more options buttons
- Dark mode support
- 40x40px minimum tap targets
- Consistent rounded-b-3xl styling

**Example:**
```tsx
<CalculatorHeader title="Calculator Name" />
```

### 2. **Layout Structure**
```tsx
<div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-6">
  <Header />
  <div className="px-4 mt-6 space-y-4">
    {/* Calculator inputs and outputs */}
  </div>
</div>
```

### 3. **Component Patterns**

#### Input Components
- Rounded-2xl borders
- 2px border width
- #58A6FF focus color
- Dark mode support
- Clear error states

#### Result Cards
- White/dark-gray-800 background
- Rounded-2xl corners
- Shadow-sm elevation
- Responsive padding (p-4 or p-6)

#### Action Buttons
- Minimum 40x40px tap targets
- 0.2s ease-out transitions
- Hover and active states
- Clear visual feedback

## 🛠️ Available Calculators

### 1. Radix Converter
- **Path:** `/radix-converter`
- **Components:** `/src/app/components/radix/`
- **Features:** Number base conversion (2-36)

### 2. 1's & 2's Complement
- **Path:** `/twos-complement`
- **Components:** `/src/app/components/complement/`
- **Features:** Binary complement calculations

### 3. Bitwise Shift & Rotate
- **Path:** `/bitwise-operations`
- **Components:** `/src/app/components/bitwise/`
- **Features:** Shift left/right, rotate operations

### 4. Arithmetic Operations
- **Path:** `/arithmetic-operations`
- **Components:** `/src/app/components/arithmetic/`
- **Features:** Add, subtract, multiply, divide in any base

### 5. Array & Record Addresses
- **Path:** `/memory-address`
- **Components:** `/src/app/components/memory/`
- **Features:** Memory address calculations for arrays

### 6. Big O Calculator
- **Path:** `/big-o-calculator`
- **Components:** `/src/app/components/bigo/`
- **Features:** Time complexity analysis

### 7. Stack & Queue
- **Path:** `/stack-queue`
- **Components:** `/src/app/components/stackqueue/`
- **Features:** LIFO and FIFO data structure visualization

### 8. Expression Evaluator
- **Path:** `/expression-evaluator`
- **Components:** `/src/app/components/expression/`
- **Features:** Infix to postfix/prefix conversion, evaluation

## 🎯 Design Guidelines

### Colors
- **Primary:** #58A6FF (GitHub blue)
- **Hover:** #1F6FEB (Darker blue)
- **IT/CS:** Blue gradient
- **Math:** Purple gradient
- **Everyday:** Green gradient

### Typography
- **Title:** text-xl font-bold
- **Subtitle:** text-xs font-medium
- **Labels:** text-xs font-semibold uppercase tracking-wide
- **Input:** text-2xl font-bold
- **Body:** text-sm or text-base

### Spacing
- **Card padding:** p-4 or p-6
- **Container spacing:** space-y-4
- **Page margins:** px-4
- **Top margin:** mt-6

### Animations
- **Duration:** 200ms (0.2s)
- **Easing:** ease-out
- **Hover scale:** 1.02
- **Active scale:** 0.98
- **Focus ring:** 4px with 20% opacity

## 📱 Mobile-First Principles

1. **Touch Targets:** Minimum 40x40px (48x48px preferred)
2. **Content Density:** Reduced padding on mobile
3. **Thumb Zone:** Important actions at bottom
4. **One-Handed:** Easy reach for common operations
5. **Safe Areas:** Support for notched devices

## 🌓 Dark Mode

All components support dark mode via Tailwind's `dark:` prefix:

```tsx
className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
```

## ✅ Checklist for New Calculators

When adding a new calculator, ensure:

- [ ] Header follows standard pattern (40x40px buttons, dark mode)
- [ ] Layout uses `min-h-screen bg-gray-50 dark:bg-gray-900`
- [ ] All tap targets are minimum 40x40px
- [ ] Animations use 0.2s ease-out
- [ ] Dark mode classes added to all components
- [ ] Focus states use #58A6FF
- [ ] Components in dedicated subfolder
- [ ] Exported in `/src/app/calculators/index.ts`
- [ ] Route added to `/src/app/routes.tsx`
- [ ] Added to Home page calculator list

## 📦 Importing Calculators

Use the centralized export:

```tsx
import { RadixConverter, ArithmeticOperations } from './calculators';
```

Or import directly:

```tsx
import { RadixConverter } from './pages/RadixConverter';
```

## 🔄 Updates & Maintenance

All calculator headers are now synchronized. Any updates to the shared header pattern should be applied across all calculator-specific headers to maintain consistency.

---

**Last Updated:** 2026-03-21
**Pattern Based On:** ArithmeticOperations.tsx
**Total Calculators:** 8
