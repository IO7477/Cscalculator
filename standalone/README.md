# Dev Calculators - Standalone Files

This folder contains **standalone, self-contained HTML files** and **React component files** for all 8 calculators. These files can be used independently from the main app.

## 📁 Folder Structure

```
/standalone/
├── README.md                           # This file
│
├── ── HTML Standalone Files (Complete, Self-Contained) ──
├── radix-converter.html                # Radix Converter
├── complement-calculator.html          # 1's & 2's Complement
├── bitwise-operations.html             # Bitwise Shift & Rotate
├── arithmetic-operations.html          # Arithmetic Operations
├── array-address.html                  # Array & Record Addresses
├── big-o-calculator.html               # Big O Calculator
├── stack-queue.html                    # Stack & Queue
├── expression-evaluator.html           # Expression Evaluator
│
└── ── React Component Files (TSX) ──
    ├── radix-converter.tsx             # Radix Converter component
    ├── complement-calculator.tsx       # Complement component
    ├── bitwise-operations.tsx          # Bitwise component
    ├── arithmetic-operations.tsx       # Arithmetic component
    └── home-page.tsx                   # Home page component
```

## 🌐 HTML Standalone Files

### Features
- **Completely self-contained** - No external dependencies except CDN
- **No build process required** - Open directly in browser
- **Uses CDN for React & Tailwind** - No npm install needed
- **Fully functional** - All features work standalone
- **Mobile responsive** - Works on all devices

### How to Use HTML Files

1. **Download** any `.html` file from this folder
2. **Open** directly in your browser (double-click or drag into browser)
3. **Start using** - No server, no build, no dependencies!

Example:
```bash
# Just open in browser
open radix-converter.html
# or
chrome big-o-calculator.html
# or
firefox complement-calculator.html
```

### Technologies Used in HTML Files
- **React 18.2.0** from `esm.sh` CDN
- **ReactDOM 18.2.0** from `esm.sh` CDN
- **Tailwind CSS** from official CDN
- **Pure JavaScript** - No TypeScript compilation needed

---

## ⚛️ React Component Files (TSX)

### Features
- **React + TypeScript** source files
- **Extracted from main app** for reuse
- **Can be imported** into other React projects
- **Fully typed** with TypeScript
- **Tailwind CSS** classes included

### How to Use TSX Files

1. **Copy** the `.tsx` file to your React project
2. **Install dependencies**:
   ```bash
   npm install react react-dom
   ```
3. **Import and use**:
   ```tsx
   import { RadixConverter } from './standalone/radix-converter';
   
   function App() {
     return <RadixConverter />;
   }
   ```

---

## 📋 Calculator Details

### 1. Radix Converter
**Files:**
- `radix-converter.html` - Standalone HTML
- `radix-converter.tsx` - React component

**Features:**
- Convert between bases 2-36
- Decimal, Binary, Octal, Hex support
- Swap functionality
- Quick presets
- Input validation

---

### 2. 1's & 2's Complement
**Files:**
- `complement-calculator.html` - Standalone HTML
- `complement-calculator.tsx` - React component

**Features:**
- Binary complement calculations
- 4, 8, 16, 32-bit support
- Visual bit display
- Quick presets
- Step-by-step explanation

---

### 3. Bitwise Shift & Rotate
**Files:**
- `bitwise-operations.html` - Standalone HTML
- `bitwise-operations.tsx` - React component

**Features:**
- Left/Right shift
- Left/Right rotate
- Adjustable bit positions
- Binary visualization
- Quick presets

---

### 4. Arithmetic Operations
**Files:**
- `arithmetic-operations.html` - Standalone HTML
- `arithmetic-operations.tsx` - React component

**Features:**
- Add, subtract, multiply, divide
- Any base input (2-36)
- Any base output (2-36)
- Mixed base operations
- Overflow detection

---

### 5. Array & Record Addresses
**Files:**
- `array-address.html` - Standalone HTML

**Features:**
- 1D and 2D array calculations
- Row-major and column-major ordering
- Base address calculation
- Memory address formula display
- Hexadecimal output

---

### 6. Big O Calculator
**Files:**
- `big-o-calculator.html` - Standalone HTML

**Features:**
- Time complexity analysis
- Visual growth comparison
- O(1), O(log n), O(n), O(n log n), O(n²), O(2ⁿ)
- Interactive input size slider
- Operations count display

---

### 7. Stack & Queue
**Files:**
- `stack-queue.html` - Standalone HTML

**Features:**
- Stack (LIFO) visualization
- Queue (FIFO) visualization
- Push, pop, enqueue, dequeue
- Visual animations
- Operation history

---

### 8. Expression Evaluator
**Files:**
- `expression-evaluator.html` - Standalone HTML

**Features:**
- Infix to postfix conversion
- Infix to prefix conversion
- Expression evaluation
- Step-by-step trace
- Operator precedence

---

## 🚀 Quick Start Guide

### For HTML Files (Easiest)

```bash
# 1. Download the file you need
curl -O https://your-domain.com/standalone/radix-converter.html

# 2. Open in browser
open radix-converter.html

# That's it! 🎉
```

### For React Components

```bash
# 1. Copy TSX file to your project
cp radix-converter.tsx /your-project/src/components/

# 2. Install React (if not already)
npm install react react-dom

# 3. Use in your app
import { RadixConverter } from './components/radix-converter';
```

---

## 🎨 Design System

All standalone files follow the same design system:

### Colors
- **Primary:** Blue-600 to Purple-600 gradient
- **Success:** Green-50 to Emerald-50
- **Info:** Blue-50 to Purple-50
- **Background:** Gray-50

### Typography
- **Headings:** Bold, 2xl to 3xl
- **Labels:** Small, semibold, uppercase
- **Input:** Bold, xl to 2xl
- **Mono:** Font-mono for binary/hex

### Spacing
- **Padding:** 6 (24px) for cards
- **Margins:** 6 (24px) between sections
- **Rounded:** 2xl (16px) for cards, 3xl (24px) for header

### Layout
- **Max Width:** 2xl (672px)
- **Centered:** mx-auto
- **Responsive:** Mobile-first design

---

## 📦 Distribution

### Hosting HTML Files

You can host these files on:
- **GitHub Pages** - Free static hosting
- **Netlify** - Drag & drop deployment
- **Vercel** - Instant deployment
- **Any static host** - Just upload the HTML file

Example with GitHub Pages:
```bash
# 1. Create a repo
git init
git add radix-converter.html
git commit -m "Add radix converter"

# 2. Push to GitHub
git remote add origin https://github.com/username/repo.git
git push -u origin main

# 3. Enable GitHub Pages in repo settings
# Access at: https://username.github.io/repo/radix-converter.html
```

### Embedding in Websites

```html
<!-- Embed in an iframe -->
<iframe 
  src="radix-converter.html" 
  width="100%" 
  height="800" 
  frameborder="0">
</iframe>
```

---

## 🔧 Customization

### Modifying HTML Files

1. **Open in code editor** (VS Code, Sublime, etc.)
2. **Find the script section** (starts with `<script type="module">`)
3. **Edit React components** directly
4. **Save and refresh browser**

Example - Change header color:
```javascript
// Find this line:
React.createElement('header', { className: 'bg-gradient-to-r from-blue-600 to-purple-600' },

// Change to:
React.createElement('header', { className: 'bg-gradient-to-r from-green-600 to-teal-600' },
```

### Modifying TSX Files

1. **Open in code editor**
2. **Edit TypeScript/React code**
3. **TypeScript compiler** will catch errors
4. **Build and test**

---

## 📱 Browser Compatibility

All standalone HTML files work in:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

**Requirements:**
- JavaScript enabled
- ES6 module support
- Internet connection (for CDN)

---

## 💡 Use Cases

### 1. Education
- Share with students as learning tools
- Embed in educational websites
- Use in computer science courses

### 2. Development
- Quick calculations during coding
- Reference implementations
- Testing algorithm complexity

### 3. Documentation
- Include in technical documentation
- Interactive code examples
- Algorithm visualization

### 4. Offline Use
After first load (CDN cached):
- Works offline
- Fast performance
- No server needed

---

## 🆘 Troubleshooting

### HTML File Won't Load
**Problem:** Blank page or errors
**Solution:** 
- Check browser console (F12)
- Ensure internet connection (for CDN)
- Try different browser
- Clear browser cache

### React Not Working
**Problem:** Components don't render
**Solution:**
- Check CDN URLs are accessible
- Verify JavaScript is enabled
- Look for console errors
- Try incognito/private mode

### Styling Issues
**Problem:** No styles or broken layout
**Solution:**
- Verify Tailwind CDN is loading
- Check for ad blockers
- Ensure viewport meta tag exists
- Try hard refresh (Ctrl+Shift+R)

---

## 📄 License

These standalone files are part of the Dev Calculators project.

**Usage:**
- ✅ Free to use
- ✅ Modify as needed
- ✅ Distribute freely
- ✅ Use commercially
- ✅ No attribution required (but appreciated!)

---

## 🤝 Contributing

Found a bug or want to improve a calculator?

1. **Report issues** - Create a GitHub issue
2. **Submit fixes** - Send a pull request
3. **Share ideas** - Suggest new features
4. **Improve docs** - Update this README

---

## 🔗 Related Files

- **Main App:** `/src/app/` - Full React application
- **Components:** `/src/app/components/` - Reusable components
- **Pages:** `/src/app/pages/` - Calculator pages
- **Documentation:** `/src/app/calculators/README.md` - Dev guide

---

## 📊 File Sizes

| File | Size | Load Time (3G) |
|------|------|----------------|
| radix-converter.html | ~8 KB | < 1s |
| complement-calculator.html | ~7 KB | < 1s |
| bitwise-operations.html | ~8 KB | < 1s |
| arithmetic-operations.html | ~9 KB | < 1s |
| array-address.html | ~6 KB | < 1s |
| big-o-calculator.html | ~4 KB | < 1s |
| stack-queue.html | ~12 KB | < 1s |
| expression-evaluator.html | ~15 KB | < 1s |

**Note:** CDN resources (React, Tailwind) are cached after first load

---

## ✨ Features Comparison

| Feature | HTML | TSX | Main App |
|---------|------|-----|----------|
| Standalone | ✅ | ❌ | ❌ |
| No Build | ✅ | ❌ | ❌ |
| TypeScript | ❌ | ✅ | ✅ |
| Dark Mode | ❌ | ❌ | ✅ |
| Routing | ❌ | ❌ | ✅ |
| State Persist | ❌ | ❌ | ✅ |
| File Size | Small | Medium | Large |
| Load Speed | Fast | N/A | Medium |

---

## 🎯 Best Practices

1. **Use HTML files** for quick sharing and demos
2. **Use TSX files** for integrating into React projects
3. **Use main app** for full-featured experience
4. **Keep files updated** when fixing bugs
5. **Test in multiple browsers** before distributing
6. **Document custom changes** for maintainability

---

## 📞 Support

Need help?
- **Issues:** GitHub Issues
- **Docs:** This README + inline code comments
- **Examples:** See main app implementation

---

**Last Updated:** 2026-03-21  
**Total Files:** 13 (8 HTML + 5 TSX)  
**Total Calculators:** 8  
**Status:** ✅ Production Ready
