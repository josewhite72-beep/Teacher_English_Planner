// app/compatAdapter.js
export function normalizeGradeData(data) {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object' && Array.isArray(data.themes)) return data.themes;
  if (data && typeof data === 'object' && Array.isArray(data.data)) return data.data;
  console.warn("Grade data structure unrecognized:", data);
  return [];
}