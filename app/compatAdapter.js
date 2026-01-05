
/**
 * Teacher English Planner – Compatibility Adapter
 * Minimal, safe normalizer for grade-level JSON to an array of theme objects.
 *
 * Usage:
 *   import { normalizeGradeData } from './app/compatAdapter.js';
 *   const arr = normalizeGradeData(gradeData);
 *
 * Design:
 * - Non-breaking: only normalizes known shapes and returns [] if unknown.
 * - Logs a warning when structure is not recognized.
 */

/**
 * Normalize various grade JSON shapes to a flat array of theme-like items.
 *
 * Accepted shapes:
 *  - Array: [ {...}, {...} ] → returned as-is.
 *  - Object with `themes`: { themes: [ ... ] } → returns `themes`.
 *  - Object with `data`:   { data:   [ ... ] } → returns `data`.
 *
 * Unknown shapes: returns [] and warns.
 *
 * @param {any} data Input grade data (array or object)
 * @returns {Array} Normalized array of items
 */
export function normalizeGradeData(data) {
  // Already an array
  if (Array.isArray(data)) {
    return data;
  }

  // Known nested arrays
  if (data && typeof data === 'object') {
    if (Array.isArray(data.themes)) {
      return data.themes; // normalize { themes: [...] } → [...]
    }
    if (Array.isArray(data.data)) {
      return data.data;   // normalize { data: [...] } → [...]
    }
  }

  // Fallback: unrecognized shape
  console.warn('normalizeGradeData: unrecognized grade data structure', data);
  return [];
}

// Optional alias for backward compatibility (if some modules import normalizeGradeJson)
export const normalizeGradeJson = normalizeGradeData;
