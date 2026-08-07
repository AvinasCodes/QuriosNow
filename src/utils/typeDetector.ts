import { DataType } from '@/types';

/* ============================================================
   Type Detection — Regex Patterns
   ============================================================ */

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const URL_REGEX = /^(https?:\/\/|www\.)[^\s]+$/i;
const PHONE_REGEX = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,15}$/;
const INTEGER_REGEX = /^-?\d+$/;
const FLOAT_REGEX = /^-?\d+\.\d+$/;
const BOOLEAN_VALUES = new Set([
  'true', 'false', 'yes', 'no', '1', '0',
  'TRUE', 'FALSE', 'YES', 'NO',
  'True', 'False', 'Yes', 'No',
]);

const DATE_PATTERNS = [
  /^\d{4}-\d{2}-\d{2}$/,                           // 2024-01-15
  /^\d{2}\/\d{2}\/\d{4}$/,                          // 01/15/2024
  /^\d{2}-\d{2}-\d{4}$/,                            // 01-15-2024
  /^\d{4}\/\d{2}\/\d{2}$/,                          // 2024/01/15
  /^\d{1,2}\s+\w{3,9}\s+\d{4}$/,                    // 15 Jan 2024
  /^\w{3,9}\s+\d{1,2},?\s+\d{4}$/,                  // Jan 15, 2024
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/,           // ISO 8601
  /^\d{2}\/\d{2}\/\d{2}$/,                          // 01/15/24
];

/* ============================================================
   Single Value Type Detection
   ============================================================ */

function detectSingleValueType(value: unknown): DataType | null {
  if (value === null || value === undefined || value === '') return null;

  const str = String(value).trim();
  if (str === '') return null;

  // Check boolean first (before number, since '1' and '0' match)
  if (BOOLEAN_VALUES.has(str)) return DataType.Boolean;

  // Check integer
  if (INTEGER_REGEX.test(str)) return DataType.Integer;

  // Check float
  if (FLOAT_REGEX.test(str)) return DataType.Float;

  // Check email
  if (EMAIL_REGEX.test(str)) return DataType.Email;

  // Check URL
  if (URL_REGEX.test(str)) return DataType.URL;

  // Check phone
  if (PHONE_REGEX.test(str)) return DataType.Phone;

  // Check date patterns
  for (const pattern of DATE_PATTERNS) {
    if (pattern.test(str)) {
      // Verify it parses to a valid date
      const parsed = new Date(str);
      if (!isNaN(parsed.getTime())) return DataType.Date;
    }
  }

  return DataType.String;
}

/* ============================================================
   Column Type Detection (majority vote)
   ============================================================ */

/**
 * Detect the type of a column by sampling its values.
 * Uses majority vote: the type that appears most often wins.
 * Null/empty values are excluded from voting.
 */
export function detectColumnType(values: unknown[]): DataType {
  const sampleSize = Math.min(values.length, 200);
  const step = Math.max(1, Math.floor(values.length / sampleSize));

  const typeCounts = new Map<DataType, number>();

  for (let i = 0; i < values.length && typeCounts.size < values.length; i += step) {
    const type = detectSingleValueType(values[i]);
    if (type !== null) {
      typeCounts.set(type, (typeCounts.get(type) ?? 0) + 1);
    }
  }

  if (typeCounts.size === 0) return DataType.String;

  // Special case: if we have both Integer and Float, prefer Float
  const intCount = typeCounts.get(DataType.Integer) ?? 0;
  const floatCount = typeCounts.get(DataType.Float) ?? 0;
  if (intCount > 0 && floatCount > 0) {
    typeCounts.set(DataType.Float, intCount + floatCount);
    typeCounts.delete(DataType.Integer);
  }

  // Special case: Boolean '1'/'0' could be integers — if majority is integer, prefer integer
  const boolCount = typeCounts.get(DataType.Boolean) ?? 0;
  if (boolCount > 0 && intCount > boolCount) {
    typeCounts.set(DataType.Integer, intCount + boolCount);
    typeCounts.delete(DataType.Boolean);
  }

  // Return the type with the highest count
  let maxType = DataType.String;
  let maxCount = 0;
  for (const [type, count] of typeCounts) {
    if (count > maxCount) {
      maxCount = count;
      maxType = type;
    }
  }

  return maxType;
}

/**
 * Count missing values in a column.
 */
export function countMissing(values: unknown[]): number {
  return values.filter(
    (v) => v === null || v === undefined || String(v).trim() === ''
  ).length;
}

/**
 * Count unique values in a column.
 */
export function countUnique(values: unknown[]): number {
  const set = new Set(values.map((v) => String(v ?? '').trim()));
  return set.size;
}

/**
 * Get sample values from a column (non-empty, unique, limited).
 */
export function getSampleValues(values: unknown[], limit = 5): string[] {
  const seen = new Set<string>();
  const samples: string[] = [];
  for (const v of values) {
    const str = String(v ?? '').trim();
    if (str !== '' && !seen.has(str)) {
      seen.add(str);
      samples.push(str);
      if (samples.length >= limit) break;
    }
  }
  return samples;
}
