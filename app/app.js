// app/app.js
import { loadGradeData, populateScenarios, populateThemes } from './curriculumLoader.js';

// Variables globales
let currentGradeData = null;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  const gradeSelect = document.getElementById('grade');
  const scenarioSelect = document.getElementById('scenario');
  const themeSelect = document.getElementById('theme');
  
  // Cargar grados disponibles
  loadAvailableGrades(gradeSelect);
  
  // Event listener para cambio de grado
  gradeSelect.addEventListener('change', async () => {
    const gradeKey = gradeSelect.value;
    if (!gradeKey) return;
    
    currentGradeData = await loadGradeData(gradeKey);
    
    if (currentGradeData.length === 0) {
      alert("No se pudieron cargar los datos del grado seleccionado.");
      return;
    }
    
    populateScenarios(currentGradeData, scenarioSelect);
    themeSelect.innerHTML = '<option value="">Seleccionar Tema</option>';
  });
  
  // Event listener para cambio de escenario
  scenarioSelect.addEventListener('change', () => {
    const selectedScenarioId = scenarioSelect.value;
    if (!selectedScenarioId || !currentGradeData) return;
    
    populateThemes(currentGradeData, themeSelect, selectedScenarioId);
  });
});

function loadAvailableGrades(selectElement) {
  selectElement.innerHTML = '<option value="">Seleccionar Grado</option>';
  
  // Suponiendo que tienes archivos desde grade_pre-k.json hasta grade_6.json
  const grades = [
    { key: "pre-k", label: "Pre-K" },
    { key: "K", label: "Kindergarten" },
    { key: "1", label: "Grade 1" },
    { key: "2", label: "Grade 2" },
    { key: "3", label: "Grade 3" },
    { key: "4", label: "Grade 4" },
    { key: "5", label: "Grade 5" },
    { key: "6", label: "Grade 6" }
  ];
  
  grades.forEach(grade => {
    const option = document.createElement('option');
    option.value = grade.key;
    option.textContent = grade.label;
    selectElement.appendChild(option);
  });
}