# ⚡ QuriosNow

> **Talk to Your Data. Instantly.**

A production-quality, frontend-only web application for uploading CSV and Excel files and instantly converting them into a fully interactive, editable table. Features a **Modern Minimalist / Apple-inspired** aesthetic with clean typography and subtle micro-animations.

**No backend. Everything runs in your browser.**

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
# → http://localhost:5173
```

---

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI framework |
| **TypeScript** | Type safety |
| **Vite** | Build tool |
| **TailwindCSS v4** | Utility CSS |
| **AG Grid Community** | Data table |
| **Zustand** | State management |
| **PapaParse** | CSV parsing |
| **SheetJS (xlsx)** | Excel parsing |
| **Framer Motion** | Animations |
| **React Icons** | Icon library |

---

## ✨ Features

### Upload
- Drag & drop CSV / XLSX / XLS files
- File validation (type, size, emptiness)
- 100MB max file size
- Smooth loading sequences

### Table (AG Grid)
- Inline cell editing (double-click)
- Sorting, filtering, column resize
- Column moving, hiding, pinning
- Pagination with configurable page sizes
- Virtual scrolling for large datasets
- Quick filter search
- Row selection (single + multi)
- Add / Delete / Duplicate rows
- Undo / Redo with keyboard shortcuts
- Sticky header
- Auto column sizing

### Auto-Detection
- String, Integer, Float, Boolean
- Date, Email, Phone, URL
- Color-coded by type in the table

### Direct File Save & Export
- **Direct Save**: Overwrite the original file on your hard drive directly using the **File System Access API** (Chrome/Edge).
- **Recent Files**: Persisted via IndexedDB and `localStorage`, saving both file metadata and edited content across sessions.
- **Export**: Download copies as CSV (via PapaParse), Excel (via SheetJS), or JSON.

### Info Panel
- Total rows / columns
- File name / size
- Detected types breakdown
- Missing values count
- Duplicate rows count
- Column list with types

### UI / UX
- **Apple/Notion-inspired Light Theme** with crisp whites, slate text, and subtle shadows.
- Fully **Responsive Design** across Desktop, Tablet, and Mobile devices.
- Improved **Fullscreen/Maximize Mode** with a custom stats header bar.
- Dedicated **In-App Documentation** page.
- Elegant typing animations and polished hover states.
- Global Notification popups for success/error feedback.
- Status bar with live stats.
- Comprehensive keyboard shortcuts.

---

## 📁 Project Structure

```
src/
├── components/
│   ├── landing/         # Landing page sections
│   │   ├── HeroSection.tsx
│   │   ├── UploadZone.tsx
│   │   ├── RecentFiles.tsx
│   │   └── FeaturesSection.tsx
│   ├── layout/          # App shell
│   │   ├── Layout.tsx
│   │   └── Navbar.tsx
│   ├── table/           # Table view components
│   │   ├── DataTable.tsx
│   │   ├── Toolbar.tsx
│   │   ├── InfoPanel.tsx
│   │   └── ExportMenu.tsx
│   └── ui/              # Reusable primitives
│       ├── RetroWindow.tsx
│       ├── RetroButton.tsx
│       ├── GlowText.tsx
│       ├── ScanlineOverlay.tsx
│       ├── RetroNotification.tsx
│       ├── BootSequence.tsx
│       ├── RetroProgressBar.tsx
│       └── ASCIIEmptyState.tsx
├── constants/
│   └── index.ts
├── hooks/
│   ├── useFileUpload.ts
│   └── useKeyboardShortcuts.ts
├── lib/
│   └── utils.ts
├── pages/
│   ├── LandingPage.tsx
│   ├── TablePage.tsx
│   └── DocsPage.tsx       # In-app documentation
├── services/
│   └── parser.ts
├── store/
│   ├── useAppStore.ts
│   └── useDataStore.ts
├── types/
│   └── index.ts
├── utils/
│   ├── dataAnalysis.ts
│   ├── exporters.ts
│   ├── db.ts              # IndexedDB persistence
│   ├── typeDetector.ts
│   └── validators.ts
├── App.tsx
├── main.tsx
├── index.css
└── vite-env.d.ts
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + S` | Save directly to original file |
| `Ctrl + Z` | Undo |
| `Ctrl + Y` | Redo |
| `Ctrl + Shift + Z` | Redo (alternative) |
| `Delete` | Delete selected rows |
| `Double-click` | Edit cell |
| `Enter` | Confirm cell edit |
| `Escape` | Cancel cell edit |

---

## 🎨 Design Aesthetic

**Modern Minimalist / Premium Light Theme**

Inspired by Apple interfaces and Notion, focusing on clarity, whitespace, and subtle micro-interactions.

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Background | `#F4F4F0` | Warm Off-White (Landing) |
| Surface/Card| `#FFFFFF` | Main content areas |
| Text | `#000000` | Primary Typography |
| Border | `#000000` | Crisp demarcations |
| Primary Accent | `#FF90E8` | Buttons, highlights |
| Secondary | `#FFC900` | Warnings |

---

## 📄 License

MIT
