import type { ExportFormat } from '@/types';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

/**
 * Export data in the specified format.
 */
export function exportData(
  data: Record<string, unknown>[],
  filename: string,
  format: ExportFormat
): void {
  switch (format) {
    case 'csv':
      exportCSV(data, filename);
      break;
    case 'xlsx':
      exportExcel(data, filename);
      break;
    case 'json':
      exportJSON(data, filename);
      break;
  }
}

/**
 * Export data as CSV using PapaParse.
 */
function exportCSV(data: Record<string, unknown>[], filename: string): void {
  const csv = Papa.unparse(data);
  downloadBlob(csv, `${filename}.csv`, 'text/csv;charset=utf-8;');
}

/**
 * Export data as Excel using SheetJS.
 */
function exportExcel(data: Record<string, unknown>[], filename: string): void {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, `${filename}.xlsx`);
}

/**
 * Export data as JSON.
 */
function exportJSON(data: Record<string, unknown>[], filename: string): void {
  const json = JSON.stringify(data, null, 2);
  downloadBlob(json, `${filename}.json`, 'application/json');
}

/**
 * Download a blob as a file.
 */
function downloadBlob(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Save data directly to the user's file system using the File System Access API.
 * NEVER falls back to download — always writes to the original file or asks the user
 * to pick a save location once.
 */
export async function saveDataToFile(
  data: Record<string, unknown>[],
  filename: string,
  existingHandle?: any
): Promise<any> {
  const isExcel = filename.toLowerCase().endsWith('.xlsx');
  const isJson = filename.toLowerCase().endsWith('.json');
  const format = isExcel ? 'xlsx' : (isJson ? 'json' : 'csv');
  
  // Generate the file content as a Blob
  let blob: Blob;
  if (format === 'csv') {
    blob = new Blob([Papa.unparse(data)], { type: 'text/csv' });
  } else if (format === 'json') {
    blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  } else {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const u8 = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
    blob = new Blob([u8], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }

  // Step 1: Get a valid writable handle
  let handle = existingHandle;

  if (handle) {
    // We already have a handle — verify write permission
    try {
      const perm = await handle.queryPermission({ mode: 'readwrite' });
      if (perm !== 'granted') {
        const req = await handle.requestPermission({ mode: 'readwrite' });
        if (req !== 'granted') {
          handle = null;
        }
      }
    } catch {
      handle = null;
    }
  }

  if (!handle) {
    // No valid handle — ask user to pick save location ONCE
    if (!('showSaveFilePicker' in window)) {
      throw new Error(
        'Your browser does not support direct file saving. Please use Chrome or Edge.'
      );
    }

    const extensions = format === 'csv' ? ['.csv'] : (format === 'xlsx' ? ['.xlsx'] : ['.json']);
    const mimeType = format === 'csv' ? 'text/csv' :
                     format === 'json' ? 'application/json' :
                     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

    handle = await (window as any).showSaveFilePicker({
      suggestedName: filename,
      types: [{
        description: `${format.toUpperCase()} File`,
        accept: { [mimeType]: extensions }
      }]
    });
  }

  // Step 2: Write directly to the file
  const writable = await handle.createWritable();
  await writable.write(blob);
  await writable.close();

  return handle;
}

