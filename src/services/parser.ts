import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import type { ParsedDataset, ColumnMeta, DatasetInfo } from '@/types';
import {
  detectColumnType,
  countMissing,
  countUnique,
  getSampleValues,
} from '@/utils/typeDetector';
import { countDuplicateRows, countTotalMissingValues } from '@/utils/dataAnalysis';
import { getFileExtension } from '@/utils/validators';

/* ============================================================
   CSV Parsing (PapaParse)
   ============================================================ */

function parseCSV(file: File): Promise<Record<string, unknown>[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false, // keep everything as strings for type detection
      complete: (results) => {
        if (results.errors.length > 0 && results.data.length === 0) {
          reject(new Error(`CSV parse error: ${results.errors[0]?.message}`));
          return;
        }
        resolve(results.data as Record<string, unknown>[]);
      },
      error: (error: Error) => {
        reject(new Error(`CSV parse error: ${error.message}`));
      },
    });
  });
}

/* ============================================================
   Excel Parsing (SheetJS)
   ============================================================ */

function parseExcel(file: File): Promise<Record<string, unknown>[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        if (!firstSheetName) {
          reject(new Error('Excel file contains no sheets.'));
          return;
        }
        const worksheet = workbook.Sheets[firstSheetName];
        if (!worksheet) {
          reject(new Error('Could not read the worksheet.'));
          return;
        }
        const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(
          worksheet,
          { defval: '' }
        );
        resolve(jsonData);
      } catch (err) {
        reject(
          new Error(
            `Excel parse error: ${err instanceof Error ? err.message : 'Unknown error'}`
          )
        );
      }
    };
    reader.onerror = () => reject(new Error('Failed to read the file.'));
    reader.readAsArrayBuffer(file);
  });
}

/* ============================================================
   Build Column Metadata
   ============================================================ */

function buildColumnMeta(
  rows: Record<string, unknown>[]
): ColumnMeta[] {
  if (rows.length === 0) return [];

  const firstRow = rows[0];
  if (!firstRow) return [];

  const fields = Object.keys(firstRow);

  return fields.map((field) => {
    const values = rows.map((row) => row[field]);
    return {
      field,
      detectedType: detectColumnType(values),
      missingCount: countMissing(values),
      uniqueCount: countUnique(values),
      sampleValues: getSampleValues(values),
    };
  });
}

/* ============================================================
   Build Dataset Info
   ============================================================ */

function buildDatasetInfo(
  file: File,
  rows: Record<string, unknown>[],
  columns: ColumnMeta[]
): DatasetInfo {
  return {
    fileName: file.name,
    fileSize: file.size,
    rowCount: rows.length,
    colCount: columns.length,
    duplicateRows: countDuplicateRows(rows),
    totalMissingValues: countTotalMissingValues(rows),
  };
}

/* ============================================================
   Main Entry Point
   ============================================================ */

/**
 * Parse a file (CSV or Excel) and return a fully enriched ParsedDataset.
 */
export async function parseFile(file: File): Promise<ParsedDataset> {
  const ext = getFileExtension(file.name);

  let rows: Record<string, unknown>[];

  if (ext === '.csv') {
    rows = await parseCSV(file);
  } else if (ext === '.xlsx' || ext === '.xls') {
    rows = await parseExcel(file);
  } else {
    throw new Error(`Unsupported file format: ${ext}`);
  }

  if (rows.length === 0) {
    throw new Error('File contains no data rows.');
  }

  const columns = buildColumnMeta(rows);
  const info = buildDatasetInfo(file, rows, columns);

  return { rows, columns, info };
}
