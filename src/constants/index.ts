/* ============================================================
   QuriosNow — Constants
   ============================================================ */

/** Maximum file size in bytes (100 MB) */
export const MAX_FILE_SIZE = 100 * 1024 * 1024;

/** Accepted file extensions */
export const ACCEPTED_EXTENSIONS = ['.csv', '.xlsx', '.xls'];

/** MIME types for accepted files */
export const ACCEPTED_MIME_TYPES = [
  'text/csv',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

/** Retro color palette */
export const COLORS = {
  background: '#0B0F0C',
  secondary: '#111714',
  panel: '#161B18',
  primaryGreen: '#39FF14',
  amber: '#FFC857',
  blue: '#4DA6FF',
  danger: '#FF5A5F',
  white: '#EAEAEA',
  dimGreen: '#1a5c0a',
  dimAmber: '#5c4a1a',
  dimBlue: '#1a3a5c',
} as const;

/** Boot sequence messages */
export const BOOT_MESSAGES: readonly string[] = [
  'QURIOSNOW v1.0.0',
  '(c) 2026 QuriosNow Systems Corp.',
  'QDOS version 4.2.0.1',
  'Initializing system...',
  'Loading memory banks... OK',
  'Checking file parser modules...',
  '  > PapaParse v5.5 .......... OK',
  '  > SheetJS v0.18 ........... OK',
  'Loading table renderer...',
  '  > AG Grid v32 ............. OK',
  'Detecting column types...',
  'Building data matrix...',
  '',
  'SYSTEM READY.',
  '',
  '> _',
];

/** ASCII art for empty state */
export const EMPTY_STATE_ASCII = `
┌─────────────────────────────────────────┐
│                                         │
│         ██████╗ ██╗   ██╗███████╗       │
│        ██╔═══██╗██║   ██║██╔════╝       │
│        ██║   ██║██║   ██║█████╗         │
│        ██║▄▄ ██║██║   ██║██╔══╝         │
│        ╚██████╔╝╚██████╔╝███████╗       │
│         ╚══▀▀═╝  ╚═════╝ ╚══════╝       │
│                                         │
│          NO DATA LOADED                 │
│                                         │
│    Drag a CSV or Excel file here        │
│    or click [UPLOAD] to begin           │
│                                         │
└─────────────────────────────────────────┘`;

/** Keyboard shortcut definitions */
export const SHORTCUTS = {
  undo: { key: 'z', ctrl: true, label: 'Ctrl+Z' },
  redo: { key: 'y', ctrl: true, label: 'Ctrl+Y' },
  search: { key: 'f', ctrl: true, label: 'Ctrl+F' },
  delete: { key: 'Delete', ctrl: false, label: 'Del' },
  escape: { key: 'Escape', ctrl: false, label: 'Esc' },
  selectAll: { key: 'a', ctrl: true, label: 'Ctrl+A' },
} as const;

/** Feature cards for landing page */
export const FEATURES = [
  {
    icon: 'upload',
    title: 'Instant Upload',
    description: 'Drag & drop CSV or Excel files. Parsed instantly in your browser.',
  },
  {
    icon: 'table',
    title: 'Smart Grid',
    description: 'Sort, filter, edit, resize, and navigate your data with AG Grid.',
  },
  {
    icon: 'type',
    title: 'Auto-Detect Types',
    description: 'Columns detected as String, Integer, Float, Date, Email, URL & more.',
  },
  {
    icon: 'edit',
    title: 'Inline Editing',
    description: 'Double-click any cell to edit. Full undo/redo support.',
  },
  {
    icon: 'export',
    title: 'Multi-Export',
    description: 'Export your data as CSV, Excel, or JSON with one click.',
  },
  {
    icon: 'lock',
    title: '100% Private',
    description: 'No server. No uploads. Everything runs locally in your browser.',
  },
] as const;

/** Pagination page size options */
export const PAGE_SIZE_OPTIONS = [25, 50, 100, 250, 500] as const;
