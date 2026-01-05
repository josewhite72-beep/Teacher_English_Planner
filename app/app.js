// app/app.js - Versión Definitiva y Robusta

// --- Funciones de carga dinámica ---

async function loadGradeData(gradeKey) {
  try {
    const url = `./data/grade_${gradeKey}.json`;
    console.log(`🔍 Intentando cargar: ${url}`);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("✅ Datos del grado cargados:", data);
    
    // Normalizar estructura (si es objeto con .themes o .data)
    if (Array.isArray(data)) {
      return data;
    }
    if (data && typeof data === 'object' && Array.isArray(data.themes)) {
      console.log("📦 Estructura normalizada: { themes: [...] }");
      return data.themes;
    }
    if (data && typeof data === 'object' && Array.isArray(data.data)) {
      console.log("📦 Estructura normalizada: { data: [...] }");
      return data.data;
    }
    
    console.warn("⚠️ Estructura de datos no reconocida:", data);
    return [];
  } catch (error) {
    console.error("❌ Error al cargar datos del grado:", error);
    throw error; // Re-throw to be caught by caller
  }
}

function populateScenarios(scenarios, scenarioSelect) {
  scenarioSelect.innerHTML = '<option value="">Seleccionar Escenario</option>';
  
  // Agrupar por ID único
  const uniqueScenarios = {};
  scenarios.forEach(theme => {
    const scenarioId = theme.scenario.id;
    if (!uniqueScenarios[scenarioId]) {
      uniqueScenarios[scenarioId] = theme.scenario;
    }
  });
  
  Object.values(uniqueScenarios).forEach(scenario => {
    const option = document.createElement('option');
    option.value = scenario.id;
    option.textContent = scenario.name_en || scenario.name_es;
    scenarioSelect.appendChild(option);
  });
  
  console.log(`📊 Scenarios cargados: ${Object.keys(uniqueScenarios).length}`);
}

function populateThemes(themes, themeSelect, selectedScenarioId) {
  themeSelect.innerHTML = '<option value="">Seleccionar Tema</option>';
  
  const filteredThemes = themes.filter(theme => theme.scenario.id === selectedScenarioId);
  
  filteredThemes.forEach(theme => {
    const option = document.createElement('option');
    option.value = theme.theme.id;
    option.textContent = theme.theme.name_en || theme.theme.name_es;
    themeSelect.appendChild(option);
  });
  
  console.log(`📚 Temas cargados para escenario ${selectedScenarioId}: ${filteredThemes.length}`);
}

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
  
  console.log("✅ Grados disponibles cargados");
}

// --- Funciones de exportación ---

async function generateMarkdownPreview() {
  const gradeKey = document.getElementById('grade').value;
  const scenarioId = document.getElementById('scenario').value;
  const themeId = document.getElementById('theme').value;

  if (!gradeKey || !scenarioId || !themeId) {
    alert("Por favor seleccione Grado, Escenario y Tema");
    return;
  }

  try {
    const { normalizeGradeData } = await import('./compatAdapter.js');
    const rawGrade = await fetch(`./data/grade_${gradeKey}.json`).then(r => r.json());
    const normalizedThemes = normalizeGradeData(rawGrade);
    const themeObj = normalizedThemes.find(t => t.theme.id === themeId);

    if (!themeObj) {
      alert("Tema no encontrado");
      return;
    }

    // Generar Markdown simple
    let md = `# Teacher English Lesson Plan\n\n`;
    md += `**School:** ${document.getElementById('school').value || 'N/A'}\n`;
    md += `**Teacher:** ${document.getElementById('teacher').value || 'N/A'}\n`;
    md += `**Subject:** English\n`;
    md += `**Grade:** ${themeObj.grade_label_en}\n`;
    md += `**School Year:** ${document.getElementById('year').value || 'N/A'}\n`;
    md += `**Term:** ${document.getElementById('term').value || 'N/A'}\n\n`;
    
    md += `## Curricular Focus\n`;
    md += `**Scenario:** ${themeObj.scenario.name_en}\n`;
    md += `**Theme:** ${themeObj.theme.name_en}\n\n`;
    
    md += `## Standards\n`;
    for (const key of ['listening', 'reading', 'speaking', 'writing', 'mediation']) {
      md += `**${key}:** ${themeObj.standards[key]?.join(', ') || 'N/A'}\n`;
    }

    document.getElementById('mdPreview').value = md;
    console.log("✅ Vista previa Markdown generada");
  } catch (error) {
    console.error("❌ Error generando vista previa:", error);
    alert("Error al generar la vista previa. Verifique la consola.");
  }
}

async function exportThemeDocx() {
  const gradeKey = document.getElementById('grade').value;
  const scenarioId = document.getElementById('scenario').value;
  const themeId = document.getElementById('theme').value;

  if (!gradeKey || !scenarioId || !themeId) {
    alert("Por favor seleccione Grado, Escenario y Tema");
    return;
  }

  try {
    const { normalizeGradeData, enrichTheme } = await import('./compatAdapter.js');
    const { exportDocx } = await import('./docxExport.js');
    
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
    console.log("✅ Theme DOCX export completed");
  } catch (error) {
    console.error("❌ Error exporting Theme DOCX:", error);
    alert("Error al generar el archivo DOCX. Verifique la consola.");
  }
}

async function exportLessonsDocx() {
  const gradeKey = document.getElementById('grade').value;
  const scenarioId = document.getElementById('scenario').value;
  const themeId = document.getElementById('theme').value;

  if (!gradeKey || !scenarioId || !themeId) {
    alert("Por favor seleccione Grado, Escenario y Tema");
    return;
  }

  try {
    const { normalizeGradeData, enrichTheme } = await import('./compatAdapter.js');
    const { exportDocx } = await import('./docxExport.js');
    
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
    console.log("✅ Lessons DOCX export completed");
  } catch (error) {
    console.error("❌ Error exporting Lessons DOCX:", error);
    alert("Error al generar el archivo DOCX. Verifique la consola.");
  }
}

// --- Función para cambiar tema (modo claro/oscuro) ---

function toggleTheme() {
  const body = document.body;
  const currentTheme = body.getAttribute('data-theme');
  const themeToggleBtn = document.getElementById('themeToggle');
  
  if (currentTheme === 'dark') {
    body.setAttribute('data-theme', 'light');
    themeToggleBtn.textContent = 'Modo oscuro';
  } else {
    body.setAttribute('data-theme', 'dark');
    themeToggleBtn.textContent = 'Modo claro';
  }
}

// --- Variables globales ---
let currentGradeData = null;

// --- Inicialización ---
document.addEventListener('DOMContentLoaded', async () => {
  const gradeSelect = document.getElementById('grade');
  const scenarioSelect = document.getElementById('scenario');
  const themeSelect = document.getElementById('theme');
  const themeToggleBtn = document.getElementById('themeToggle');
  
  // Cargar grados disponibles
  loadAvailableGrades(gradeSelect);
  
  // Event listener para cambio de grado
  gradeSelect.addEventListener('change', async () => {
    const gradeKey = gradeSelect.value;
    if (!gradeKey) return;
    
    try {
      currentGradeData = await loadGradeData(gradeKey);
      
      if (currentGradeData.length === 0) {
        alert("No se pudieron cargar los datos del grado seleccionado.");
        return;
      }
      
      populateScenarios(currentGradeData, scenarioSelect);
      themeSelect.innerHTML = '<option value="">Seleccionar Tema</option>';
    } catch (error) {
      console.error("❌ Error al cargar datos del grado:", error);
      alert("No se pudieron cargar los datos del grado seleccionado. Verifique la consola.");
    }
  });
  
  // Event listener para cambio de escenario
  scenarioSelect.addEventListener('change', () => {
    const selectedScenarioId = scenarioSelect.value;
    if (!selectedScenarioId || !currentGradeData) return;
    
    populateThemes(currentGradeData, themeSelect, selectedScenarioId);
  });

  // Conectar botones
  document.getElementById('genPreview')?.addEventListener('click', generateMarkdownPreview);
  document.getElementById('exportThemeDOCX')?.addEventListener('click', exportThemeDocx);
  document.getElementById('exportLessonDOCX')?.addEventListener('click', exportLessonsDocx);
  
  // Conectar botón de modo claro/oscuro
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }
  
  console.log("🚀 Teacher English Planner - Todo inicializado correctamente");
});