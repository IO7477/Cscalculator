# Standalone Files Index

## 📦 Complete List of Standalone Files

### ✅ HTML Files (Self-Contained, Ready to Use)

| # | Calculator | HTML File | Status | Size |
|---|------------|-----------|--------|------|
| 1 | Radix Converter | `radix-converter.html` | ✅ Ready | ~8 KB |
| 2 | 1's & 2's Complement | `complement-calculator.html` | ✅ Ready | ~7 KB |
| 3 | Bitwise Operations | `bitwise-operations.html` | ✅ Ready | ~8 KB |
| 4 | Arithmetic Operations | `arithmetic-operations.html` | ✅ Ready | ~9 KB |
| 5 | Array & Record Addresses | `array-address.html` | ✅ Ready | ~6 KB |
| 6 | Big O Calculator | `big-o-calculator.html` | ✅ Ready | ~4 KB |
| 7 | Stack & Queue | `stack-queue.html` | ✅ Ready | ~12 KB |
| 8 | Expression Evaluator | `expression-evaluator.html` | ✅ Ready | ~15 KB |

**Total:** 8 complete HTML files

---

### ⚛️ React Component Files (TSX)

| # | Component | TSX File | Status | Use Case |
|---|-----------|----------|--------|----------|
| 1 | Radix Converter | `radix-converter.tsx` | ✅ Ready | React integration |
| 2 | Complement Calculator | `complement-calculator.tsx` | ✅ Ready | React integration |
| 3 | Bitwise Operations | `bitwise-operations.tsx` | ✅ Ready | React integration |
| 4 | Arithmetic Operations | `arithmetic-operations.tsx` | ✅ Ready | React integration |
| 5 | Home Page | `home-page.tsx` | ✅ Ready | Landing page |

**Total:** 5 React component files

---

## 🎯 Quick Reference

### Use HTML Files When:
- ✅ You need a standalone calculator
- ✅ No build process required
- ✅ Sharing with non-developers
- ✅ Quick demos or prototypes
- ✅ Embedding in websites
- ✅ Offline usage (after first load)

### Use TSX Files When:
- ✅ Building a React application
- ✅ Need TypeScript support
- ✅ Want to customize extensively
- ✅ Integrating into existing codebase
- ✅ Need state management
- ✅ Building with modern tooling

---

## 📥 Download Instructions

### Individual Files
```bash
# Download a single HTML file
curl -O https://your-domain.com/standalone/radix-converter.html

# Download a single TSX file
curl -O https://your-domain.com/standalone/radix-converter.tsx
```

### All Files
```bash
# Clone the repository
git clone https://github.com/your-username/dev-calculators.git

# Navigate to standalone folder
cd dev-calculators/standalone

# All files are here!
ls -la
```

---

## 🚀 Usage Examples

### HTML File - Direct Use
```bash
# 1. Download
curl -O radix-converter.html

# 2. Open in browser
open radix-converter.html

# Done! Calculator is running
```

### TSX File - React Integration
```bash
# 1. Copy to your project
cp radix-converter.tsx /your-project/src/components/

# 2. Import in your React app
import { RadixConverter } from './components/radix-converter';

# 3. Use in component
<RadixConverter />
```

---

## 📊 File Details

### Radix Converter
- **HTML:** `radix-converter.html` (8 KB)
- **TSX:** `radix-converter.tsx`
- **Features:** Base 2-36 conversion, swap, presets
- **CDN:** React 18.2.0, Tailwind CSS

### Complement Calculator
- **HTML:** `complement-calculator.html` (7 KB)
- **TSX:** `complement-calculator.tsx`
- **Features:** 1's & 2's complement, bit width selection
- **CDN:** React 18.2.0, Tailwind CSS

### Bitwise Operations
- **HTML:** `bitwise-operations.html` (8 KB)
- **TSX:** `bitwise-operations.tsx`
- **Features:** Shift, rotate, bit manipulation
- **CDN:** React 18.2.0, Tailwind CSS

### Arithmetic Operations
- **HTML:** `arithmetic-operations.html` (9 KB)
- **TSX:** `arithmetic-operations.tsx`
- **Features:** Multi-base arithmetic
- **CDN:** React 18.2.0, Tailwind CSS

### Array & Record Addresses
- **HTML:** `array-address.html` (6 KB)
- **Features:** Memory address calculations
- **CDN:** React 18.2.0, Tailwind CSS

### Big O Calculator
- **HTML:** `big-o-calculator.html` (4 KB)
- **Features:** Time complexity analysis
- **CDN:** React 18.2.0, Tailwind CSS

### Stack & Queue
- **HTML:** `stack-queue.html` (12 KB)
- **Features:** LIFO/FIFO visualization
- **CDN:** React 18.2.0, Tailwind CSS

### Expression Evaluator
- **HTML:** `expression-evaluator.html` (15 KB)
- **Features:** Infix/postfix/prefix conversion
- **CDN:** React 18.2.0, Tailwind CSS

---

## 🌐 CDN Dependencies

All HTML files use:

```html
<!-- React from esm.sh -->
<script type="module">
  import React from 'https://esm.sh/react@18.2.0';
  import ReactDOM from 'https://esm.sh/react-dom@18.2.0/client';
</script>

<!-- Tailwind CSS from CDN -->
<script src="https://cdn.tailwindcss.com"></script>
```

**Advantages:**
- No npm install required
- No build process
- Automatically cached
- Always up-to-date

---

## 🔗 Links

- **Main App:** `/src/app/`
- **Components:** `/src/app/components/`
- **Pages:** `/src/app/pages/`
- **Documentation:** `/src/app/calculators/README.md`
- **This Index:** `/standalone/INDEX.md`
- **Usage Guide:** `/standalone/README.md`

---

## ✅ Verification Checklist

Before using a file, verify:

- [ ] File downloaded completely
- [ ] No corruption or errors
- [ ] Internet connection (for CDN on first load)
- [ ] Browser JavaScript enabled
- [ ] Modern browser (Chrome 90+, Firefox 88+, Safari 14+)

---

## 📞 Support

- **Bug Reports:** GitHub Issues
- **Questions:** See README.md
- **Documentation:** Inline code comments
- **Examples:** See main app implementation

---

**Last Updated:** 2026-03-21  
**Version:** 1.0.0  
**Status:** ✅ Production Ready  
**Total Files:** 13 (8 HTML + 5 TSX)
