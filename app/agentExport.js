// app/agentExport.js
import { normalizeGradeData } from './compatAdapter.js';
import { enrichTheme } from './enrichment.js';
import { exportDocx } from './docxExport.js';

// Helper functions to get selected values
function getSelectedGrade() {
  return document.getElementById('grade').value;
}

function getSelectedScenario() {
  return document.getElementById('scenario').value;
}

function getSelectedTheme() {
  return document.getElementById('theme').value;
}

// Main export handler for Theme DOCX
async function exportThemeDocx() {
  const gradeKey = getSelectedGrade();
  const scenarioId = getSelectedScenario();
  const themeId = getSelectedTheme();

  if (!gradeKey || !scenarioId || !themeId) {
    alert("Por favor seleccione Grado, Escenario y Tema");
    return;
  }

  try {
    const rawGrade = await fetch(`./data/grade_${gradeKey}.json`).then(r => r.json());
    const normalizedThemes = normalizeGradeData(rawGrade);
    const themeObj = normalizedThemes.find(t => t.theme.id === themeId);

    if (!themeObj) {
      alert("Tema no encontrado");
      return;
    }

    const enriched = enrichTheme(themeObj);
    const filename = `${gradeKey}_${scenarioId}_${themeId}_theme.docx`;

    await exportDocx(enriched, filename, true); // true = theme only
    console.log("Theme DOCX export completed");
  } catch (error) {
    console.error("Error exporting Theme DOCX:", error);
    alert("Error al generar el archivo DOCX. Verifique la consola.");
  }
}

// Main export handler for Lessons DOCX
async function exportLessonsDocx() {
  const gradeKey = getSelectedGrade();
  const scenarioId = getSelectedScenario();
  const themeId = getSelectedTheme();

  if (!gradeKey || !scenarioId || !themeId) {
    alert("Por favor seleccione Grado, Escenario y Tema");
    return;
  }

  try {
    const rawGrade = await fetch(`./data/grade_${gradeKey}.json`).then(r => r.json());
    const normalizedThemes = normalizeGradeData(rawGrade);
    const themeObj = normalizedThemes.find(t => t.theme.id === themeId);

    if (!themeObj) {
      alert("Tema no encontrado");
      return;
    }

    const enriched = enrichTheme(themeObj);
    const filename = `${gradeKey}_${scenarioId}_${themeId}_lessons.docx`;

    await exportDocx(enriched, filename, false); // false = include lessons
    console.log("Lessons DOCX export completed");
  } catch (error) {
    console.error("Error exporting Lessons DOCX:", error);
    alert("Error al generar el archivo DOCX. Verifique la consola.");
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Attach event listeners to new buttons
  document.getElementById('exportThemeDOCX')?.addEventListener('click', exportThemeDocx);
  document.getElementById('exportLessonDOCX')?.addEventListener('click', exportLessonsDocx);
  
  console.log("DOCX export functionality initialized");
});