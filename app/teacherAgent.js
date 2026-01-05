/**
 * Teacher English Planner – Agent Orchestrator
 * Wires data loading + enrichment + DOCX export.
 *
 * Usage in index.html:
 *   import { runAgentFor } from './app/teacherAgent.js';
 *   await runAgentFor({ gradeKey: '2', scenarioId: 'school_days', themeId: 'theme_1' });
 */

import { enrichTheme } from './enrichment.js';

/** Provide an adapter to get grade/theme data.
 *  Expect global loader functions already present in your project:
 *    - loadPlannerData(gradeKey) returns { gradeData, institutional }
 *    - findThemeObject(gradeJson, scenarioId, themeId) returns theme object
 */
export async function runAgentFor({ gradeKey, scenarioId, themeId }) {
  if (!window.loadPlannerData || !window.findThemeObject) {
    throw new Error('Data loader not found. Ensure dataLoader.js is loaded and exposes helpers globally or adapt imports.');
  }
  const { gradeData, institutional } = await window.loadPlannerData(gradeKey);
  const baseTheme = window.findThemeObject(gradeData, scenarioId, themeId);
  if (!baseTheme) throw new Error('Theme not found for given scenarioId/themeId');
  const enriched = enrichTheme(baseTheme, institutional, { gradeKey });
  return enriched;
}
