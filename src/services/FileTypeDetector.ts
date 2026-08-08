export type FileFormatType =
  | 'csv' | 'xlsx' | 'xls'
  | 'txt' | 'md' | 'pdf' | 'docx' | 'pptx'
  | 'code'
  | 'unsupported';

export type WorkspaceMode = 'table' | 'rag' | 'unsupported';

export interface FileDetectionResult {
  type: FileFormatType;
  mode: WorkspaceMode;
  mimeType: string;
  fileName: string;
}

/* ============================================================
   Code / scripting file extensions that should be treated
   as plain-text documents in RAG mode.
   ============================================================ */
const CODE_EXTENSIONS = new Set([
  // Web
  'js', 'jsx', 'ts', 'tsx', 'html', 'htm', 'css', 'scss', 'sass', 'less', 'vue', 'svelte',
  // Systems / compiled
  'c', 'cpp', 'h', 'hpp', 'cs', 'java', 'kt', 'go', 'rs', 'swift', 'scala', 'zig',
  // Scripting
  'py', 'rb', 'pl', 'php', 'lua', 'r', 'sh', 'bash', 'zsh', 'bat', 'ps1', 'fish',
  // Data / config
  'json', 'xml', 'yaml', 'yml', 'toml', 'ini', 'cfg', 'conf', 'env', 'properties',
  // Query / DB
  'sql', 'graphql', 'gql',
  // Markup / docs
  'rst', 'tex', 'adoc', 'org',
  // Other
  'log', 'diff', 'patch', 'dockerfile', 'makefile', 'cmake',
]);

export class FileTypeDetector {
  static detect(file: File): FileDetectionResult {
    const fileName = file.name;
    const mimeType = file.type;
    const extension = fileName.split('.').pop()?.toLowerCase() || '';

    let type: FileFormatType = 'unsupported';
    let mode: WorkspaceMode = 'unsupported';

    // ── 1. Table Mode ──────────────────────────────────────
    if (
      extension === 'csv' ||
      mimeType === 'text/csv' ||
      mimeType === 'application/csv'
    ) {
      type = 'csv';
      mode = 'table';
    } else if (
      extension === 'xlsx' ||
      mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      type = 'xlsx';
      mode = 'table';
    } else if (
      extension === 'xls' ||
      mimeType === 'application/vnd.ms-excel'
    ) {
      type = 'xls';
      mode = 'table';
    }
    // ── 2. RAG / Document Mode ─────────────────────────────
    else if (extension === 'pdf' || mimeType === 'application/pdf') {
      type = 'pdf';
      mode = 'rag';
    } else if (
      extension === 'docx' ||
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      type = 'docx';
      mode = 'rag';
    } else if (
      extension === 'pptx' ||
      mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ) {
      type = 'pptx';
      mode = 'rag';
    } else if (extension === 'txt' || mimeType === 'text/plain') {
      type = 'txt';
      mode = 'rag';
    } else if (extension === 'md' || mimeType === 'text/markdown') {
      type = 'md';
      mode = 'rag';
    } else if (CODE_EXTENSIONS.has(extension)) {
      type = 'code';
      mode = 'rag';
    }

    return { type, mode, mimeType, fileName };
  }
}
