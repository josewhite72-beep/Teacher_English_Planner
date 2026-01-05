// app/app.js - VERSIÓN MÍNIMA Y FUNCIONAL
console.log("🔧 Iniciando aplicación...");

// --- VARIABLES GLOBALES ---
let currentData = [];
let currentScenarios = [];

// --- FUNCIÓN SIMPLE PARA CARGAR GRADOS ---
function loadAvailableGrades() {
  const gradeSelect = document.getElementById('grade');
  if (!gradeSelect) {
    console.error("❌ No se encontró el selector de grados");
    return;
  }
  
  gradeSelect.innerHTML = '<option value="">Seleccionar Grado</option>';
  
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
    gradeSelect.appendChild(option);
  });
  
  console.log("✅ Grados cargados");
}

// --- FUNCIÓN SIMPLE PARA CARGAR DATOS ---
async function loadGradeData(gradeKey) {
  try {
    alert(`Cargando Grado ${gradeKey}...`);
    
    let fileName = `grade_${gradeKey}.json`;
    if (gradeKey === 'pre-k') fileName = 'grade_pre-k.json';
    if (gradeKey === 'K') fileName = 'grade_K.json';
    
    const url = `data/${fileName}`;
    console.log(`URL: ${url}`);
    
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Error ${response.status}`);
    
    const data = await response.json();
    console.log(`Datos cargados: ${data.length} elementos`);
    
    currentData = data;
    
    // Extraer escenarios
    currentScenarios = [];
    data.forEach((item, index) => {
      if (item.scenario) {
        currentScenarios.push({
          id: `scenario_${index}`,
          name: item.scenario,
          index: index,
          themes: item.themes || []
        });
      }
    });
    
    alert(`✅ ${currentScenarios.length} escenarios encontrados`);
    return true;
    
  } catch (error) {
    alert(`❌ Error: ${error.message}`);
    return false;
  }
}

// --- FUNCIÓN PARA POBLAR ESCENARIOS ---
function populateScenarios() {
  const scenarioSelect = document.getElementById('scenario');
  if (!scenarioSelect) {
    console.error("❌ No se encontró el selector de escenarios");
    return;
  }
  
  scenarioSelect.innerHTML = '<option value="">Seleccionar Escenario</option>';
  
  currentScenarios.forEach(scenario => {
    const option = document.createElement('option');
    option.value = scenario.id;
    option.textContent = scenario.name;
    scenarioSelect.appendChild(option);
  });
  
  console.log("✅ Escenarios poblados");
}

// --- FUNCIÓN PARA POBLAR TEMAS ---
function populateThemes(scenarioId) {
  const themeSelect = document.getElementById('theme');
  if (!themeSelect) {
    console.error("❌ No se encontró el selector de temas");
    return;
  }
  
  themeSelect.innerHTML = '<option value="">Seleccionar Tema</option>';
  
  const scenario = currentScenarios.find(s => s.id === scenarioId);
  if (!scenario || !scenario.themes) return;
  
  scenario.themes.forEach((theme, index) => {
    const option = document.createElement('option');
    option.value = `theme_${scenario.index}_${index}`;
    option.textContent = theme;
    themeSelect.appendChild(option);
  });
  
  console.log(`✅ ${scenario.themes.length} temas poblados`);
}

// --- FUNCIÓN SIMPLE DE VISTA PREVIA ---
function generatePreview() {
  alert("Generando vista previa...");
  
  const gradeText = document.getElementById('grade').value ? 
    document.getElementById('grade').options[document.getElementById('grade').selectedIndex].text : 
    "No seleccionado";
  
  const scenarioText = document.getElementById('scenario').value ? 
    document.getElementById('scenario').options[document.getElementById('scenario').selectedIndex].text : 
    "No seleccionado";
  
  const themeText = document.getElementById('theme').value ? 
    document.getElementById('theme').options[document.getElementById('theme').selectedIndex].text : 
    "No seleccionado";
  
  const preview = `# Plan de Clases
Grado: ${gradeText}
Escenario: ${scenarioText}
Tema: ${themeText}

Fecha: ${new Date().toLocaleDateString()}
Generado por: Teacher English Planner`;
  
  document.getElementById('mdPreview').value = preview;
  alert("✅ Vista previa generada");
}

// --- CONECTAR BOTONES ---
function connectButtons() {
  console.log("🔗 Conectando botones...");
  
  // Botón de vista previa
  const previewBtn = document.getElementById('genPreview');
  if (previewBtn) {
    previewBtn.addEventListener('click', generatePreview);
    console.log("✅ Botón de vista previa conectado");
  } else {
    console.error("❌ No se encontró el botón genPreview");
  }
  
  // Botones de exportación (placeholders)
  const exportThemeBtn = document.getElementById('exportThemeDOC');
  if (exportThemeBtn) {
    exportThemeBtn.addEventListener('click', () => {
      alert("Exportación DOCX - En desarrollo");
    });
  }
  
  const exportLessonBtn = document.getElementById('exportLessonDOC');
  if (exportLessonBtn) {
    exportLessonBtn.addEventListener('click', () => {
      alert("Exportación de lecciones DOCX - En desarrollo");
    });
  }
  
  // Botón de tema claro/oscuro
  const themeToggleBtn = document.getElementById('themeToggle');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function() {
      const body = document.body;
      const isDark = body.getAttribute('data-theme') === 'dark';
      body.setAttribute('data-theme', isDark ? 'light' : 'dark');
      this.textContent = isDark ? 'Modo oscuro' : 'Modo claro';
    });
  }
}

// --- INICIALIZACIÓN PRINCIPAL ---
document.addEventListener('DOMContentLoaded', function() {
  console.log("✅ DOM cargado - Iniciando...");
  
  // 1. Cargar grados
  loadAvailableGrades();
  
  // 2. Conectar botones
  connectButtons();
  
  // 3. Configurar eventos de selección
  const gradeSelect = document.getElementById('grade');
  const scenarioSelect = document.getElementById('scenario');
  
  if (gradeSelect) {
    gradeSelect.addEventListener('change', async function() {
      const gradeKey = this.value;
      if (!gradeKey) return;
      
      const success = await loadGradeData(gradeKey);
      if (success) {
        populateScenarios();
        document.getElementById('theme').innerHTML = '<option value="">Seleccionar Tema</option>';
      }
    });
  }
  
  if (scenarioSelect) {
    scenarioSelect.addEventListener('change', function() {
      const scenarioId = this.value;
      if (!scenarioId) return;
      populateThemes(scenarioId);
    });
  }
  
  // 4. Mensaje inicial
  console.log("🚀 Aplicación lista");
  alert("✅ Teacher English Planner listo!\n\nSelecciona un Grado para comenzar");
});