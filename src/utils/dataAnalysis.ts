/**
 * Count duplicate rows in the dataset.
 * Two rows are duplicates if all their stringified values match.
 */
export function countDuplicateRows(rows: Record<string, unknown>[]): number {
  const seen = new Set<string>();
  let duplicates = 0;

  for (const row of rows) {
    const key = JSON.stringify(
      Object.values(row).map((v) => String(v ?? ''))
    );
    if (seen.has(key)) {
      duplicates++;
    } else {
      seen.add(key);
    }
  }

  return duplicates;
}

/**
 * Count total missing values across all cells.
 */
export function countTotalMissingValues(rows: Record<string, unknown>[]): number {
  let missing = 0;
  for (const row of rows) {
    for (const value of Object.values(row)) {
      if (value === null || value === undefined || String(value).trim() === '') {
        missing++;
      }
    }
  }
  return missing;
}
