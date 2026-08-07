import { MAX_FILE_SIZE, ACCEPTED_EXTENSIONS } from '@/constants';

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate a file before parsing.
 * Checks: extension, size, non-empty.
 */
export function validateFile(file: File): ValidationResult {
  // Check extension
  const name = file.name.toLowerCase();
  const ext = name.slice(name.lastIndexOf('.'));

  if (!ACCEPTED_EXTENSIONS.includes(ext)) {
    return {
      valid: false,
      error: `Unsupported file format "${ext}". Accepted: ${ACCEPTED_EXTENSIONS.join(', ')}`,
    };
  }

  // Check size
  if (file.size > MAX_FILE_SIZE) {
    const maxMB = MAX_FILE_SIZE / (1024 * 1024);
    const fileMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File too large (${fileMB} MB). Maximum size: ${maxMB} MB.`,
    };
  }

  // Check empty
  if (file.size === 0) {
    return {
      valid: false,
      error: 'File is empty. Please select a valid file.',
    };
  }

  return { valid: true };
}

/**
 * Get file extension from filename.
 */
export function getFileExtension(filename: string): string {
  return filename.slice(filename.lastIndexOf('.')).toLowerCase();
}
