
// app/agentExport.js
import { normalizeGradeData } from './compatAdapter.js';
import { enrichTheme } from './enrichment.js';
import { exportDocx } from './docxExport.js';

// Function to get selected values (adjust selectors to match your HTML)
function getSelectedGrade() {
  const gradeSelect = document.getElementById('gradeSelect') || document.querySelector('[id*="grade"]');
  return gradeSelect ? gradeSelect.value : null;
}

function getSelectedScenario() {
  const scenarioSelect = document.getElementById('scenarioSelect') || document.querySelector('[id*="scenario"]');
  return scenarioSelect ? scenarioSelect.value : null;
}

function getSelectedTheme() {
  const themeSelect = document.getElementById('themeSelect') || document.querySelector('[id*="theme"]');
  return themeSelect ? themeSelect.value : null;
}

// Main export function - hook into existing button
export async function setupDocxExport() {
  // Find existing export button (adjust selector as needed)
  const exportBtn = document.getElementById('exportBtn') || 
                   document.querySelector('[onclick*="export"]') || 
                   document.querySelector('[class*="export"]') ||
                   document.querySelector('button');

  if (exportBtn) {
    exportBtn.addEventListener('click', onExportDocx);
    console.log("DOCX export functionality attached to existing button");
  } else {
    console.warn("No export button found - add one manually or adjust selectors");
  }
}

// The main export handler
export async function onExportDocx() {
  try {
    const gradeKey = getSelectedGrade();
    const scenarioId = getSelectedScenario();
    const themeId = getSelectedTheme();

    if (!gradeKey || !scenarioId || !themeId) {
      alert("Please select Grade, Scenario, and Theme first");
      return;
    }

    // Load grade data
    const rawGrade = await fetch(`./data/grade_${gradeKey}.json`).then(r => r.json());
    const normalizedThemes = normalizeGradeData(rawGrade);

    // Find theme
    const themeObj = normalizedThemes.find(t => t?.theme?.id === themeId);
    if (!themeObj) {
      console.error("Theme not found", themeId);
      alert("Theme not found. Please check your selection.");
      return;
    }

    // Load institutional standards if available
    let institutionalStandards = {};
    try {
      institutionalStandards = await fetch(`./data/grade_${gradeKey}_institutional_standards.json`)
        .then(r => r.json())
        .catch(() => ({}));
    } catch (e) {
      console.warn("No institutional standards found for this grade");
    }

    // Enrich the theme
    const enriched = enrichTheme(themeObj, institutionalStandards);

    // Generate filename
    const cleanGrade = String(gradeKey).replace(/[^a-zA-Z0-9]/g, '');
    const cleanScenario = String(scenarioId).replace(/[^a-zA-Z0-9]/g, '');
    const cleanTheme = String(themeId).replace(/[^a-zA-Z0-9]/g, '');
    const filename = `${cleanGrade}_${cleanScenario}_${cleanTheme}.docx`;

    // Export to .docx
    await exportDocx(enriched, filename);

    console.log("DOCX export completed successfully");
  } catch (error) {
    console.error("Export failed:", error);
    alert("Export failed. Check console for details.");
  }
}

// Initialize export functionality when DOM is ready
document.addEventListener('DOMContentLoaded', setupDocxExport);
