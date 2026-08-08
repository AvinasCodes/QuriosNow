/* ============================================================
   QuriosNow — Type Definitions
   ============================================================ */

/** Detected data types for column auto-detection */
export enum DataType {
  String = 'String',
  Integer = 'Integer',
  Float = 'Float',
  Boolean = 'Boolean',
  Date = 'Date',
  Email = 'Email',
  Phone = 'Phone',
  URL = 'URL',
}

/** Metadata for a single column */
export interface ColumnMeta {
  field: string;
  detectedType: DataType;
  missingCount: number;
  uniqueCount: number;
  sampleValues: string[];
}

/** High-level info about the uploaded dataset */
export interface DatasetInfo {
  fileName: string;
  fileSize: number;
  rowCount: number;
  colCount: number;
  duplicateRows: number;
  totalMissingValues: number;
}

/** A fully parsed dataset ready for the table */
export interface ParsedDataset {
  rows: Record<string, unknown>[];
  columns: ColumnMeta[];
  info: DatasetInfo;
  fileHandle?: any;
  /** ID used to persist this dataset in IndexedDB for recent files */
  datasetId?: string;
}

/** Supported export formats */
export type ExportFormat = 'csv' | 'xlsx' | 'json';

/** Undo/Redo action types */
export type EditActionType =
  | 'cell-edit'
  | 'add-row'
  | 'delete-rows'
  | 'duplicate-rows';

/** A single undoable action */
export interface EditAction {
  type: EditActionType;
  timestamp: number;
  /** Snapshot of rows before the action */
  previousRows: Record<string, unknown>[];
  /** Snapshot of rows after the action */
  nextRows: Record<string, unknown>[];
}

/** Notification severity */
export type NotificationType = 'success' | 'warning' | 'error' | 'info';

/** A single notification */
export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: number;
}

/** App view states */
export type AppView = 'landing' | 'table' | 'docs' | 'rag' | 'privacy' | 'terms' | 'about';

/** A recent file entry */
export interface RecentFileEntry {
  id: string;
  name: string;
  size: number;
  date: number;
  rowCount: number;
  colCount: number;
}

/** Loading stages for boot sequence */
export type LoadingStage =
  | 'idle'
  | 'validating'
  | 'initializing'
  | 'parsing'
  | 'detecting-types'
  | 'building-table'
  | 'chunking'
  | 'embedding'
  | 'indexing'
  | 'ready';
