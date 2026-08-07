import { create } from 'zustand';
import type { ParsedDataset, EditAction, ColumnMeta } from '@/types';

/* ============================================================
   Data Store — Zustand
   ============================================================ */

interface DataState {
  /** Current parsed dataset */
  dataset: ParsedDataset | null;
  /** Selected row indices */
  selectedRows: number[];
  /** Quick filter string */
  quickFilter: string;
  /** Undo stack */
  editHistory: EditAction[];
  /** Redo stack */
  redoStack: EditAction[];
  /** Loading state */
  isLoading: boolean;
  /** Current loading stage label */
  loadingStage: string;

  // ─── Actions ───────────────────────────────────

  setDataset: (dataset: ParsedDataset) => void;
  setFileHandle: (handle: any) => void;
  clearDataset: () => void;
  setLoading: (loading: boolean, stage?: string) => void;
  setQuickFilter: (filter: string) => void;
  setSelectedRows: (rows: number[]) => void;

  /** Update a single cell value */
  updateCell: (rowIndex: number, field: string, value: unknown) => void;

  /** Add a new empty row */
  addRow: () => void;

  /** Delete selected rows by indices */
  deleteRows: (indices: number[]) => void;

  /** Duplicate selected rows */
  duplicateRows: (indices: number[]) => void;

  /** Undo the last edit */
  undo: () => void;

  /** Redo the last undone edit */
  redo: () => void;
}

/** Maximum undo history depth */
const MAX_HISTORY = 50;

function pushHistory(
  state: DataState,
  type: EditAction['type'],
  previousRows: Record<string, unknown>[],
  nextRows: Record<string, unknown>[]
): Partial<DataState> {
  const action: EditAction = {
    type,
    timestamp: Date.now(),
    previousRows,
    nextRows,
  };
  const history = [...state.editHistory, action].slice(-MAX_HISTORY);
  return { editHistory: history, redoStack: [] };
}

export const useDataStore = create<DataState>((set, get) => ({
  dataset: null,
  selectedRows: [],
  quickFilter: '',
  editHistory: [],
  redoStack: [],
  isLoading: false,
  loadingStage: '',

  setDataset: (dataset) =>
    set({ dataset, editHistory: [], redoStack: [], selectedRows: [] }),

  setFileHandle: (handle) =>
    set((state) => ({
      dataset: state.dataset ? { ...state.dataset, fileHandle: handle } : null,
    })),

  clearDataset: () =>
    set({
      dataset: null,
      editHistory: [],
      redoStack: [],
      selectedRows: [],
      quickFilter: '',
    }),

  setLoading: (isLoading, stage = '') => set({ isLoading, loadingStage: stage }),

  setQuickFilter: (quickFilter) => set({ quickFilter }),

  setSelectedRows: (selectedRows) => set({ selectedRows }),

  updateCell: (rowIndex, field, value) => {
    const { dataset } = get();
    if (!dataset) return;

    const previousRows = [...dataset.rows];
    const newRows = dataset.rows.map((row, i) =>
      i === rowIndex ? { ...row, [field]: value } : row
    );

    set((state) => ({
      dataset: { ...dataset, rows: newRows },
      ...pushHistory(state, 'cell-edit', previousRows, newRows),
    }));
  },

  addRow: () => {
    const { dataset } = get();
    if (!dataset) return;

    const previousRows = [...dataset.rows];
    const emptyRow: Record<string, unknown> = {};
    for (const col of dataset.columns) {
      emptyRow[col.field] = '';
    }
    const newRows = [...dataset.rows, emptyRow];
    const newInfo = { ...dataset.info, rowCount: newRows.length };

    set((state) => ({
      dataset: { ...dataset, rows: newRows, info: newInfo },
      ...pushHistory(state, 'add-row', previousRows, newRows),
    }));
  },

  deleteRows: (indices) => {
    const { dataset } = get();
    if (!dataset || indices.length === 0) return;

    const indexSet = new Set(indices);
    const previousRows = [...dataset.rows];
    const newRows = dataset.rows.filter((_, i) => !indexSet.has(i));
    const newInfo = { ...dataset.info, rowCount: newRows.length };

    set((state) => ({
      dataset: { ...dataset, rows: newRows, info: newInfo },
      selectedRows: [],
      ...pushHistory(state, 'delete-rows', previousRows, newRows),
    }));
  },

  duplicateRows: (indices) => {
    const { dataset } = get();
    if (!dataset || indices.length === 0) return;

    const previousRows = [...dataset.rows];
    const duplicated = indices
      .filter((i) => i >= 0 && i < dataset.rows.length)
      .map((i) => ({ ...dataset.rows[i]! }));
    const newRows = [...dataset.rows, ...duplicated];
    const newInfo = { ...dataset.info, rowCount: newRows.length };

    set((state) => ({
      dataset: { ...dataset, rows: newRows, info: newInfo },
      ...pushHistory(state, 'duplicate-rows', previousRows, newRows),
    }));
  },

  undo: () => {
    const { dataset, editHistory } = get();
    if (!dataset || editHistory.length === 0) return;

    const lastAction = editHistory[editHistory.length - 1]!;
    const newHistory = editHistory.slice(0, -1);
    const newInfo = { ...dataset.info, rowCount: lastAction.previousRows.length };

    set((state) => ({
      dataset: { ...dataset, rows: lastAction.previousRows, info: newInfo },
      editHistory: newHistory,
      redoStack: [...state.redoStack, lastAction],
    }));
  },

  redo: () => {
    const { dataset, redoStack } = get();
    if (!dataset || redoStack.length === 0) return;

    const nextAction = redoStack[redoStack.length - 1]!;
    const newRedoStack = redoStack.slice(0, -1);
    const newInfo = { ...dataset.info, rowCount: nextAction.nextRows.length };

    set((state) => ({
      dataset: { ...dataset, rows: nextAction.nextRows, info: newInfo },
      redoStack: newRedoStack,
      editHistory: [...state.editHistory, nextAction],
    }));
  },
}));
