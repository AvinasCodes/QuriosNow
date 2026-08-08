# ⚡ QuriosNow

> **Talk to Your Data. Instantly.**

A production-quality, frontend-only web application for exploring data and chatting with your documents. QuriosNow features two powerful, locally-run workspaces: an **Interactive Data Table** for spreadsheets (CSV/Excel) and an **AI Document Terminal (RAG)** for text documents (PDF/DOCX/PPTX/TXT). 

Everything is wrapped in a premium **Retro Terminal / CRT Aesthetic** with glowing text, scanlines, and immersive micro-animations.

**No backend. No API keys. Everything runs locally in your browser.**

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
| **TailwindCSS v4** | Utility CSS + Custom CRT styles |
| **HuggingFace Transformers.js** | Local AI Embeddings (Web Worker) |
| **IndexedDB** | Fast local vector store |
| **AG Grid Community** | High-performance data table |
| **Zustand** | State management |
| **pdfjs-dist / mammoth / jszip** | Document parsing |
| **Framer Motion** | Fluid animations |
| **Google AdSense** | Integrated monetization |

---

## ✨ Core Features

### 1. Smart File Routing
- Drag & drop any file. The system automatically routes:
  - **Spreadsheets** (`.csv`, `.xlsx`, `.xls`) → Table Workspace
  - **Documents** (`.pdf`, `.docx`, `.pptx`, `.txt`, `.md`) → RAG Workspace

### 2. Document Intelligence (RAG Workspace)
- **100% Local AI**: Uses Transformers.js to generate embeddings directly in your browser. No data leaves your machine.
- **Smart Extraction**: Instead of dumping raw chunks, the LLM service extracts and scores specific sentences based on your query keywords and question type (who/when/where).
- **Hybrid Search**: Combines Cosine Vector Similarity with a keyword-based fallback to guarantee relevant results even on weaker devices.
- **Dynamic Imports**: Heavy parsing libraries (PDF, DOCX, PPTX) are only loaded when needed, keeping the initial bundle size incredibly small.
- **Source Citations**: AI responses include exact document citations and similarity scores.

### 3. Data Table (Table Workspace)
- **AG Grid Integration**: Inline cell editing, sorting, filtering, and column resizing.
- **Auto-Detection**: Automatically detects types (String, Integer, Float, Date, Email, etc.) and color-codes them.
- **Undo/Redo**: Full history state with keyboard shortcuts.
- **Direct Save**: Overwrite your original local file directly using the File System Access API.

### 4. Monetization & Compliance Ready
- **Google AdSense** integration ready out of the box.
- Built-in **Privacy Policy**, **Terms of Service**, and **About Us** pages to ensure fast AdSense approval.

### 5. Premium UI / UX
- **CRT Monitor Aesthetic**: Scanlines, text glow, phosphor trails, and terminal boot sequences.
- **Responsive Layouts**: Mobile-friendly tabbed interfaces and fluid grid systems.

---

## 📁 Project Structure

```
src/
├── components/
│   ├── landing/         # Landing page & file upload
│   ├── layout/          # App shell (Navbar, CRT Overlays)
│   ├── rag/             # Document Intelligence workspace
│   │   ├── ChatPanel.tsx
│   │   ├── DocumentViewer.tsx
│   │   └── ProcessingProgress.tsx
│   ├── table/           # Data Table workspace
│   └── ui/              # Reusable primitives (Buttons, Notifications)
├── pages/               # Main views (Landing, Table, Rag, Privacy, etc.)
├── services/
│   └── rag/             # Local AI services
│       ├── ChunkingService.ts
│       ├── EmbeddingService.ts
│       ├── LLMService.ts
│       ├── RetrievalService.ts
│       └── TextExtractor.ts
├── store/               # Zustand state stores
├── workers/             # Web Workers (embeddings)
├── App.tsx
└── main.tsx
```

---

## 🎨 Design Aesthetic

**Premium Retro Terminal / Cyberpunk**

Inspired by classic CRT monitors, command-line interfaces, and cyberpunk aesthetics, focusing on immersive visual feedback and nostalgic interactions.

### Color Palette

| Color | CSS Variable | Usage |
|-------|--------------|-------|
| Background | `--crt-bg` | Deep green/black (#050806) |
| Primary Glow | `--crt-green` | Main text, accents (#39FF14) |
| Secondary | `--crt-amber` | Highlights, user messages (#FFB000) |
| Muted | `--crt-muted` | Secondary text, borders (#2A4A32) |
| CRT Glow | `--crt-glow` | Text shadow effect for realism |

---

## 📄 License

MIT
