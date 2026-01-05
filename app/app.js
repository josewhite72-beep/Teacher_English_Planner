// app/app.js - VERSIÓN FINAL Y FUNCIONAL
// ESTRUCTURA CORRECTA: {scenario: "string", themes: ["tema1", "tema2"], ...}

// ===== VARIABLES GLOBALES =====
let currentGradeData = [];  // Array completo del grado seleccionado
let currentScenarios = [];  // Array de escenarios únicos extraídos

// ===== FUNCIÓN PRINCIPAL DE CARGA =====
async function loadGradeData(gradeKey) {
  try {
    console.log(`📥 Cargando grado: ${gradeKey}`);
    
    // Determinar nombre de archivo
    let fileName = `grade_${gradeKey}.json`;
    if (gradeKey === 'pre-k') fileName = 'grade_pre-k.json';
    if (gradeKey === 'K') fileName = 'grade_K.json';
    
    // RUTA CORRECTA: data/ (no ../data/)
    const url = `data/${fileName}`;
    console.log(`🔗 URL: ${url}`);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: No se pudo cargar ${fileName}`);
    }
    
    const data = await response.json();
    console.log(`✅ ${data.length} elementos cargados de ${fileName}`);
    
    // Validar que sea array
    if (!Array.isArray(data)) {
      console.error("❌ ERROR: Los datos no son un array");
      return [];
    }
    
    return data;
    
  } catch (error) {
    console.error("❌ Error en loadGradeData:", error);
    alert(`Error al cargar grado: ${error.message}`);
    return [];
  }
}

// ===== PROCESAR ESCENARIOS =====
function processScenarios(gradeData) {
  console.log("🔄 Procesando escenarios...");
  
  const scenarios = [];
  const seenNames = new Set();
  
  gradeData.forEach((item, index) => {
    // Cada item es: {scenario: "nombre", themes: ["t1","t2"], ...}
    if (item.scenario && typeof item.scenario === 'string') {
      const scenarioName = item.scenario;
      
      // Solo agregar si no hemos visto este nombre antes
      if (!seenNames.has(scenarioName)) {
        seenNames.add(scenarioName);
        
        scenarios.push({
          id: `scenario_${index}`,  // ID único
          name: scenarioName,
          dataIndex: index,          // Índice en gradeData
          themes: item.themes || []  // Temas de este escenario
        });
        
        console.log(`📌 Escenario ${index}: "${scenarioName}" (${item.themes?.length || 0} temas)`);
      }
    }
  });
  
  console.log(`📊 Total escenarios únicos: ${scenarios.length}`);
  return scenarios;
}

// ===== POBLAR SELECTORES =====
function populateScenarios(scenarios, scenarioSelect) {
  console.log("📝 Poblando selector de escenarios...");
  
  // Limpiar selector
  scenarioSelect.innerHTML = '';
  
  // Opción por defecto
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = 'Seleccionar Escenario';
  scenarioSelect.appendChild(defaultOption);
  
  // Agregar cada escenario
  scenarios.forEach(scenario => {
    const option = document.createElement('option');
    option.value = scenario.id;
    option.textContent = scenario.name;
    scenarioSelect.appendChild(option);
  });
  
  console.log(`✅ ${scenarios.length} escenarios cargados en selector`);
}

function populateThemes(selectedScenario, themeSelect) {
  console.log("📝 Poblando selector de temas...");
  
  // Limpiar selector
  themeSelect.innerHTML = '';
  
  // Opción por defecto
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = 'Seleccionar Tema';
  themeSelect.appendChild(defaultOption);
  
  if (!selectedScenario || !selectedScenario.themes) {
    console.warn("⚠️ Escenario sin temas");
    return;
  }
  
  // Agregar cada tema
  selectedScenario.themes.forEach((themeName, index) => {
    const option = document.createElement('option');
    option.value = `theme_${selectedScenario.dataIndex}_${index}`;
    option.textContent = themeName;
    themeSelect.appendChild(option);
  });
  
  console.log(`✅ ${selectedScenario.themes.length} temas cargados`);
}

// ===== GENERAR VISTA PREVIA =====
function generateMarkdownPreview() {
  const gradeSelect = document.getElementById('grade');
  const scenarioSelect = document.getElementById('scenario');
  const themeSelect = document.getElementById('theme');
  
  const gradeKey = gradeSelect.value;
  const scenarioId = scenarioSelect.value;
  const themeId = themeSelect.value;
  
  // Validaciones
  if (!gradeKey) {
    alert("❌ Por favor selecciona un Grado");
    return;
  }
  
  if (!scenarioId) {
    alert("❌ Por favor selecciona un Escenario");
    return;
  }
  
  if (!themeId) {
    alert("❌ Por favor selecciona un Tema");
    return;
  }
  
  try {
    // Obtener datos
    const selectedScenario = currentScenarios.find(s => s.id === scenarioId);
    const themeIndex = parseInt(themeId.split('_')[2]);
    const themeName = selectedScenario.themes[themeIndex];
    const scenarioData = currentGradeData[selectedScenario.dataIndex];
    
    // Generar markdown
    let md = '# Teacher English Lesson Plan\n\n';
    
    // Sección 1: Datos Institucionales
    md += '## Institutional Data\n';
    md += `- **School:** ${document.getElementById('school').value || 'CEBG Barrigón'}\n`;
    md += `- **Teacher:** ${document.getElementById('teacher').value || 'José White'}\n`;
    md += `- **School Year:** ${document.getElementById('year').value || '2026'}\n`;
    md += `- **Trimester:** ${document.getElementById('term').value || '1'}\n`;
    md += `- **Weekly Hours:** ${document.getElementById('weeklyHours').value || '3'}\n`;
    md += `- **Weeks:** ${document.getElementById('weeks').value || 'From week __ to week __'}\n\n`;
    
    // Sección 2: Enfoque Curricular
    md += '## Curricular Focus\n';
    md += `- **Grade:** ${gradeSelect.options[gradeSelect.selectedIndex].text}\n`;
    md += `- **Scenario:** ${selectedScenario.name}\n`;
    md += `- **Theme:** ${themeName}\n\n`;
    
    // Sección 3: Estándares
    if (scenarioData.standards_and_learning_outcomes) {
      md += '## Standards & Learning Outcomes\n';
      const standards = scenarioData.standards_and_learning_outcomes;
      
      if (standards.listening) md += `- **Listening:** ${standards.listening.join(', ')}\n`;
      if (standards.reading) md += `- **Reading:** ${standards.reading.join(', ')}\n`;
      if (standards.speaking) md += `- **Speaking:** ${standards.speaking.join(', ')}\n`;
      if (standards.writing) md += `- **Writing:** ${standards.writing.join(', ')}\n`;
      if (standards.mediation) md += `- **Mediation:** ${standards.mediation.join(', ')}\n`;
      md += '\n';
    }
    
    // Sección 4: Competencias Comunicativas
    if (scenarioData.communicative_competences) {
      md += '## Communicative Competences\n';
      const competences = scenarioData.communicative_competences;
      
      if (competences.linguistic) md += `- **Linguistic:** ${competences.linguistic}\n`;
      if (competences.sociolinguistic) md += `- **Sociolinguistic:** ${competences.sociolinguistic}\n`;
      if (competences.pragmatic) md += `- **Pragmatic:** ${competences.pragmatic}\n`;
      md += '\n';
    }
    
    // Sección 5: Ideas de Evaluación
    if (scenarioData.assessment_ideas && scenarioData.assessment_ideas.length > 0) {
      md += '## Assessment Ideas\n';
      scenarioData.assessment_ideas.forEach((idea, idx) => {
        md += `${idx + 1}. ${idea}\n`;
      });
    }
    
    // Mostrar en textarea
    document.getElementById('mdPreview').value = md;
    
    console.log("✅ Vista previa generada exitosamente");
    alert("✅ Vista previa Markdown generada!\n\nRevisa la sección 'Vista previa (Markdown)'");
    
  } catch (error) {
    console.error("❌ Error generando vista previa:", error);
    alert("❌ Error al generar vista previa. Ver consola.");
  }
}

// ===== FUNCIONES DE EXPORTACIÓN =====
async function exportThemeDocx() {
  alert("📄 Exportación DOCX - Integración con docxExport.js pendiente");
  console.log("Exportar tema DOCX - En desarrollo");
}

async function exportLessonsDocx() {
  alert("📄 Exportación de lecciones DOCX - Integración con docxExport.js pendiente");
  console.log("Exportar lecciones DOCX - En desarrollo");
}

// ===== TOGGLE TEMA CLARO/OSCURO =====
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

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
  console.log("🚀 DOM Content Loaded - Inicializando aplicación");
  
  // Referencias a elementos
  const gradeSelect = document.getElementById('grade');
  const scenarioSelect = document.getElementById('scenario');
  const themeSelect = document.getElementById('theme');
  const themeToggleBtn = document.getElementById('themeToggle');
  
  // ===== 1. CARGAR GRADOS DISPONIBLES =====
  console.log("📚 Cargando lista de grados...");
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
  
  console.log("✅ Grados cargados en selector");
  
  // ===== 2. EVENTO: CAMBIO DE GRADO =====
  gradeSelect.addEventListener('change', async () => {
    const gradeKey = gradeSelect.value;
    
    if (!gradeKey) {
      console.log("⬅️ Grado deseleccionado");
      scenarioSelect.innerHTML = '<option value="">Seleccionar Escenario</option>';
      themeSelect.innerHTML = '<option value="">Seleccionar Tema</option>';
      return;
    }
    
    console.log(`🎓 Grado seleccionado: ${gradeKey}`);
    
    try {
      // Mostrar feedback al usuario
      alert(`⏳ Cargando datos de ${gradeSelect.options[gradeSelect.selectedIndex].text}...`);
      
      // Cargar datos del JSON
      currentGradeData = await loadGradeData(gradeKey);
      
      if (currentGradeData.length === 0) {
        alert(`❌ El grado ${gradeKey} no tiene datos disponibles`);
        return;
      }
      
      // Procesar escenarios
      currentScenarios = processScenarios(currentGradeData);
      
      if (currentScenarios.length === 0) {
        alert(`⚠️ No se encontraron escenarios en el grado ${gradeKey}`);
        return;
      }
      
      // Poblar selector de escenarios
      populateScenarios(currentScenarios, scenarioSelect);
      
      // Limpiar selector de temas
      themeSelect.innerHTML = '<option value="">Seleccionar Tema</option>';
      
      // Feedback al usuario
      alert(`✅ ${currentScenarios.length} escenarios cargados\n\nAhora selecciona un "Escenario"`);
      
      console.log(`✅ Grado ${gradeKey} procesado: ${currentScenarios.length} escenarios`);
      
    } catch (error) {
      console.error("❌ Error en cambio de grado:", error);
      alert(`❌ Error: ${error.message}`);
    }
  });
  
  // ===== 3. EVENTO: CAMBIO DE ESCENARIO =====
  scenarioSelect.addEventListener('change', () => {
    const scenarioId = scenarioSelect.value;
    
    if (!scenarioId) {
      console.log("⬅️ Escenario deseleccionado");
      themeSelect.innerHTML = '<option value="">Seleccionar Tema</option>';
      return;
    }
    
    console.log(`🏞️ Escenario seleccionado: ${scenarioId}`);
    
    // Encontrar escenario seleccionado
    const selectedScenario = currentScenarios.find(s => s.id === scenarioId);
    
    if (!selectedScenario) {
      console.error("❌ Escenario no encontrado:", scenarioId);
      return;
    }
    
    // Poblar temas del escenario seleccionado
    populateThemes(selectedScenario, themeSelect);
    
    // Feedback al usuario
    if (selectedScenario.themes.length > 0) {
      alert(`✅ ${selectedScenario.themes.length} temas disponibles\n\nAhora selecciona un "Tema"`);
    }
    
    console.log(`✅ Escenario "${selectedScenario.name}" - ${selectedScenario.themes.length} temas`);
  });
  
  // ===== 4. CONECTAR BOTONES =====
  console.log("🔗 Conectando botones...");
  
  // Vista previa Markdown
  document.getElementById('genPreview')?.addEventListener('click', generateMarkdownPreview);
  
  // Exportación DOCX
  document.getElementById('exportThemeDOC')?.addEventListener('click', exportThemeDocx);
  document.getElementById('exportLessonDOC')?.addEventListener('click', exportLessonsDocx);
  
  // Tema claro/oscuro
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }
  
  // Botones de configuración (placeholders)
  document.getElementById('saveCfg')?.addEventListener('click', () => {
    alert("💾 Guardar configuración - Funcionalidad pendiente");
  });
  
  document.getElementById('loadCfg')?.addEventListener('click', () => {
    alert("📂 Cargar configuración - Funcionalidad pendiente");
  });
  
  document.getElementById('clearSW')?.addEventListener('click', () => {
    alert("🧹 Borrar caché - Funcionalidad pendiente");
  });
  
  // ===== 5. INICIALIZACIÓN COMPLETA =====
  console.log("✅ Teacher English Planner inicializado correctamente");
  console.log("==========================================");
  console.log("📋 FLUJO DE TRABAJO:");
  console.log("1. Selecciona un Grado (ej: 'Grade 1')");
  console.log("2. Selecciona un Escenario");
  console.log("3. Selecciona un Tema");
  console.log("4. Genera Vista Previa o Exporta");
  console.log("==========================================");
  
  // Mensaje inicial
  setTimeout(() => {
    alert("✅ Teacher English Planner listo!\n\nSelecciona un Grado para comenzar");
  }, 500);
});