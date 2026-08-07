import { useAppStore } from '@/store/useAppStore';
import { motion } from 'framer-motion';
import {
  VscCloudUpload,
  VscTable,
  VscEdit,
  VscSave,
  VscExport,
  VscSearch,
  VscHistory,
  VscArrowLeft,
  VscSymbolKey,
  VscFilter,
  VscTrash,
  VscCopy,
} from 'react-icons/vsc';

/* ============================================================
   DocsPage — Documentation & User Guide
   ============================================================ */

const sections = [
  {
    id: 'getting-started',
    title: '> GETTING STARTED',
    icon: <VscCloudUpload size={20} />,
    content: [
      {
        subtitle: 'Upload Your Data',
        text: 'Drag & drop any CSV, XLSX, or XLS file into the upload zone — or click "Select File" to browse. QuriosNow instantly parses your data right in the browser. No servers, no uploads to the cloud.',
      },
      {
        subtitle: 'Supported Formats',
        text: 'CSV (comma-separated), XLSX (Excel 2007+), and XLS (legacy Excel). Files are parsed entirely client-side using PapaParse and SheetJS.',
      },
      {
        subtitle: 'Recent Files',
        text: 'Your previously opened files appear in the "Recent Files" section on the landing page. Click any entry to reload it instantly from the browser cache.',
      },
    ],
  },
  {
    id: 'data-table',
    title: '> DATA TABLE',
    icon: <VscTable size={20} />,
    content: [
      {
        subtitle: 'Viewing Data',
        text: 'Your dataset loads in a high-performance AG Grid table with virtual scrolling — so even 100K+ rows feel instant. Columns are auto-sized and typed (String, Integer, Float, Boolean, Date, etc.).',
      },
      {
        subtitle: 'Sorting & Filtering',
        text: 'Click any column header to sort ascending/descending. Use the built-in column filter (click the hamburger icon on any header) to filter by value, text, or condition.',
      },
      {
        subtitle: 'Column Reordering',
        text: 'Drag column headers left or right to rearrange them. Your layout persists for the session.',
      },
    ],
  },
  {
    id: 'editing',
    title: '> EDITING',
    icon: <VscEdit size={20} />,
    content: [
      {
        subtitle: 'Inline Cell Editing',
        text: 'Double-click any cell to edit its value in-place. Press Enter to confirm or Escape to cancel. Boolean columns render as Yes/No dropdowns.',
      },
      {
        subtitle: 'Add & Delete Rows',
        text: 'Use the "+" button in the toolbar to append a new empty row. Select rows (click the checkbox column), then click "Delete" to remove them.',
      },
      {
        subtitle: 'Duplicate Rows',
        text: 'Select one or more rows, then click "Duplicate" to copy them to the bottom of the dataset.',
      },
      {
        subtitle: 'Undo & Redo',
        text: 'Every edit is recorded. Use the Undo/Redo buttons or press Ctrl+Z / Ctrl+Y to step through your edit history (up to 50 actions).',
      },
    ],
  },
  {
    id: 'search-filter',
    title: '> SEARCH & FILTER',
    icon: <VscSearch size={20} />,
    content: [
      {
        subtitle: 'Quick Search',
        text: 'The search bar in the toolbar performs a global text search across ALL columns and rows. Type any character — numbers, letters, symbols — and the table filters instantly.',
      },
      {
        subtitle: 'Column Filters',
        text: 'Each column header has a filter icon. Click it to open a filter panel with options like "Contains", "Equals", "Starts With", "Greater Than", etc. based on column type.',
      },
    ],
  },
  {
    id: 'save-export',
    title: '> SAVE & EXPORT',
    icon: <VscSave size={20} />,
    content: [
      {
        subtitle: 'Direct File Save',
        text: 'Click the "Save" button or press Ctrl+S. On first save, you\'ll pick the target file via a native system dialog. After that, every save silently overwrites the same file — no downloads.',
      },
      {
        subtitle: 'Export Formats',
        text: 'Click "Export" to download your data as CSV, JSON, or XLSX. This creates a new file — your original is untouched unless you use Save.',
      },
      {
        subtitle: 'Browser Compatibility',
        text: 'Direct file saving uses the File System Access API, available in Chrome and Edge. Firefox/Safari will fall back to standard downloads.',
      },
    ],
  },
  {
    id: 'keyboard-shortcuts',
    title: '> KEYBOARD SHORTCUTS',
    icon: <VscSymbolKey size={20} />,
    content: [],
    shortcuts: [
      { keys: 'Ctrl + S', action: 'Save file to disk' },
      { keys: 'Ctrl + Z', action: 'Undo last edit' },
      { keys: 'Ctrl + Y', action: 'Redo last edit' },
      { keys: 'Ctrl + Shift + Z', action: 'Redo (alternative)' },
      { keys: 'Delete', action: 'Delete selected rows' },
      { keys: 'Enter', action: 'Confirm cell edit' },
      { keys: 'Escape', action: 'Cancel cell edit' },
      { keys: 'F11 / Maximize', action: 'Toggle fullscreen table' },
    ],
  },
];

export function DocsPage() {
  const setView = useAppStore((s) => s.setView);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="docs-page"
    >
      {/* Header */}
      <div className="docs-header">
        <button onClick={() => setView('landing')} className="docs-back-btn">
          <VscArrowLeft size={16} />
          <span>Back</span>
        </button>
        <div className="docs-header-content">
          <h1 className="docs-title">
            <span className="glow-green">{'>'}</span> DOCUMENTATION
          </h1>
          <p className="docs-subtitle">
            Everything you need to know about QuriosNow
          </p>
        </div>
      </div>

      {/* Table of Contents */}
      <nav className="docs-toc">
        <p className="docs-toc-label">// TABLE OF CONTENTS</p>
        <div className="docs-toc-links">
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="docs-toc-link">
              <span className="docs-toc-icon">{s.icon}</span>
              <span>{s.title.replace('> ', '')}</span>
            </a>
          ))}
        </div>
      </nav>

      {/* Content Sections */}
      <div className="docs-content">
        {sections.map((section, idx) => (
          <motion.section
            key={section.id}
            id={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className="docs-section"
          >
            <h2 className="docs-section-title">
              <span className="docs-section-icon">{section.icon}</span>
              {section.title}
            </h2>

            {section.content.map((item, i) => (
              <div key={i} className="docs-item">
                <h3 className="docs-item-title">{item.subtitle}</h3>
                <p className="docs-item-text">{item.text}</p>
              </div>
            ))}

            {/* Keyboard shortcuts table */}
            {section.shortcuts && (
              <div className="docs-shortcuts-table">
                <div className="docs-shortcut-header">
                  <span>Shortcut</span>
                  <span>Action</span>
                </div>
                {section.shortcuts.map((sc, i) => (
                  <div key={i} className="docs-shortcut-row">
                    <kbd className="docs-kbd">{sc.keys}</kbd>
                    <span className="docs-shortcut-action">{sc.action}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.section>
        ))}
      </div>

      {/* Footer */}
      <footer className="docs-footer">
        <p>QuriosNow v1.0.0 ─ 100% browser-native. No backend. No tracking.</p>
      </footer>
    </motion.div>
  );
}
