// app/app.js - VERSIÓN COMPLETA Y CORREGIDA
console.log("🚀 Teacher English Planner - Iniciando...");

// ===== VARIABLES GLOBALES =====
let currentData = null;
let currentScenarios = [];
let currentThemes = [];

// ===== 1. FUNCIONES DE CARGA UNIVERSALES =====

// Cargar lista de grados
function loadAvailableGrades() {
  const gradeSelect = document.getElementById('grade');
  if (!gradeSelect) return;
  
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

// Cargar datos de cualquier grado (compatible con múltiples estructuras)
async function loadGradeData(gradeKey) {
  try {
    console.log(`📥 Cargando grado: ${gradeKey}`);
    
    // Determinar nombre de archivo
    let fileName = `grade_${gradeKey}.json`;
    if (gradeKey === 'pre-k') fileName = 'grade_pre-k.json';
    if (gradeKey === 'K') fileName = 'grade_K.json';
    
    const url = `data/${fileName}`;
    console.log(`🔗 URL: ${url}`);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error ${response.status} al cargar ${fileName}`);
    }
    
    const data = await response.json();
    console.log("📊 Datos recibidos:", typeof data, Array.isArray(data) ? `Array[${data.length}]` : 'Object');
    
    // NORMALIZAR DATOS - Compatible con cualquier estructura
    let normalizedData = normalizeGradeData(data);
    
    return normalizedData;
    
  } catch (error) {
    console.error("❌ Error en loadGradeData:", error);
    alert(`Error al cargar grado ${gradeKey}: ${error.message}`);
    return null;
  }
}

// Normalizar datos para cualquier estructura JSON
function normalizeGradeData(rawData) {
  console.log("🔄 Normalizando datos...");
  
  // Caso 1: Es array directamente (grade_1.json)
  if (Array.isArray(rawData)) {
    console.log("📦 Estructura: Array directo");
    return rawData;
  }
  
  // Caso 2: Es objeto con propiedad 'themes', 'data', o similar
  if (rawData && typeof rawData === 'object') {
    // Buscar arrays dentro del objeto
    const possibleArrayKeys = ['themes', 'data', 'lessons', 'scenarios', 'items', 'content'];
    
    for (const key of possibleArrayKeys) {
      if (Array.isArray(rawData[key])) {
        console.log(`📦 Estructura: Objeto con array en propiedad "${key}"`);
        return rawData[key];
      }
    }
    
    // Si no encuentra arrays, devolver el objeto como array de un elemento
    console.log("📦 Estructura: Objeto sin arrays, convirtiendo a array");
    return [rawData];
  }
  
  // Caso 3: Datos inválidos
  console.error("❌ Estructura de datos no reconocida:", rawData);
  return [];
}

// Extraer escenarios de datos normalizados
function extractScenarios(data) {
  console.log("🔍 Extrayendo escenarios...");
  
  const scenarios = [];
  
  if (!data || !Array.isArray(data)) {
    console.error("❌ Datos no válidos para extraer escenarios");
    return [];
  }
  
  data.forEach((item, index) => {
    // Diferentes estructuras posibles
    let scenarioName = '';
    
    if (typeof item.scenario === 'string') {
      // Estructura grade_1: {scenario: "string", themes: [...]}
      scenarioName = item.scenario;
    } else if (item.scenario && item.scenario.name) {
      // Estructura alternativa: {scenario: {name: "..."}, ...}
      scenarioName = item.scenario.name;
    } else if (item.name) {
      // El item mismo es el escenario
      scenarioName = item.name;
    } else if (item.title) {
      scenarioName = item.title;
    }
    
    if (scenarioName) {
      scenarios.push({
        id: `scenario_${index}`,
        name: scenarioName,
        index: index,
        data: item,
        themes: item.themes || []
      });
    }
  });
  
  console.log(`✅ ${scenarios.length} escenarios extraídos`);
  return scenarios;
}

// ===== 2. FUNCIONES DE INTERFAZ =====

// Poblar selector de escenarios
function populateScenarios(scenarios) {
  const scenarioSelect = document.getElementById('scenario');
  if (!scenarioSelect) return;
  
  scenarioSelect.innerHTML = '<option value="">Seleccionar Escenario</option>';
  
  if (!scenarios || scenarios.length === 0) {
    console.warn("⚠️ No hay escenarios para mostrar");
    return;
  }
  
  scenarios.forEach(scenario => {
    const option = document.createElement('option');
    option.value = scenario.id;
    option.textContent = scenario.name;
    scenarioSelect.appendChild(option);
  });
  
  console.log(`✅ ${scenarios.length} escenarios cargados`);
}

// Poblar selector de temas
function populateThemes(scenarioId) {
  const themeSelect = document.getElementById('theme');
  if (!themeSelect) return;
  
  themeSelect.innerHTML = '<option value="">Seleccionar Tema</option>';
  
  const scenario = currentScenarios.find(s => s.id === scenarioId);
  if (!scenario) {
    console.warn("⚠️ Escenario no encontrado:", scenarioId);
    return;
  }
  
  // Temas pueden ser array de strings o array de objetos
  const themes = scenario.themes || [];
  
  if (themes.length === 0) {
    console.warn("⚠️ Escenario sin temas definidos");
    return;
  }
  
  themes.forEach((theme, index) => {
    const option = document.createElement('option');
    option.value = `theme_${scenario.index}_${index}`;
    
    // Determinar nombre del tema
    let themeName = '';
    if (typeof theme === 'string') {
      themeName = theme;
    } else if (theme && theme.name) {
      themeName = theme.name;
    } else if (theme && theme.title) {
      themeName = theme.title;
    } else {
      themeName = `Tema ${index + 1}`;
    }
    
    option.textContent = themeName;
    themeSelect.appendChild(option);
  });
  
  console.log(`✅ ${themes.length} temas cargados`);
}

// Generar tabla de lecciones (5 lecciones por defecto)
function generateLessonTable() {
  const lessonTable = document.getElementById('lessonTable');
  if (!lessonTable) return;
  
  lessonTable.innerHTML = '';
  
  // Generar 5 lecciones
  for (let i = 1; i <= 5; i++) {
    const row = document.createElement('tr');
    
    // Columna Lección
    const lessonCell = document.createElement('td');
    lessonCell.textContent = `Lesson ${i}`;
    row.appendChild(lessonCell);
    
    // Columna Fecha (input)
    const dateCell = document.createElement('td');
    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.className = 'lesson-date';
    dateInput.dataset.lesson = i;
    dateCell.appendChild(dateInput);
    row.appendChild(dateCell);
    
    // Columna Tiempo (input)
    const timeCell = document.createElement('td');
    const timeInput = document.createElement('input');
    timeInput.type = 'number';
    timeInput.className = 'lesson-time';
    timeInput.dataset.lesson = i;
    timeInput.placeholder = 'min';
    timeInput.min = '1';
    timeInput.max = '120';
    timeInput.value = '45';
    timeCell.appendChild(timeInput);
    row.appendChild(timeCell);
    
    lessonTable.appendChild(row);
  }
  
  console.log("✅ Tabla de lecciones generada");
}

// ===== 3. FUNCIONES DE EXPORTACIÓN =====

// Generar vista previa Markdown mejorada
function generateMarkdownPreview() {
  try {
    console.log("📝 Generando vista previa Markdown...");
    
    // Obtener valores
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
    
    // Obtener datos seleccionados
    const selectedScenario = currentScenarios.find(s => s.id === scenarioId);
    const themeIndex = parseInt(themeId.split('_')[2]);
    const scenarioData = selectedScenario.data;
    
    // Determinar nombre del tema
    let themeName = '';
    if (selectedScenario.themes && selectedScenario.themes[themeIndex]) {
      const theme = selectedScenario.themes[themeIndex];
      themeName = typeof theme === 'string' ? theme : (theme.name || theme.title || `Tema ${themeIndex + 1}`);
    }
    
    // Obtener datos de lecciones
    const lessonDates = [];
    const lessonTimes = [];
    
    document.querySelectorAll('.lesson-date').forEach((input, index) => {
      lessonDates[index] = input.value || `Fecha ${index + 1}`;
    });
    
    document.querySelectorAll('.lesson-time').forEach((input, index) => {
      lessonTimes[index] = input.value || '45';
    });
    
    // ===== GENERAR MARKDOWN COMPLETO =====
    let md = '# Teacher English Lesson Plan\n\n';
    
    // Sección 1: Datos Institucionales
    md += '## 📋 Institutional Data\n';
    md += `- **School:** ${document.getElementById('school').value || 'CEBG Barrigón'}\n`;
    md += `- **Teacher:** ${document.getElementById('teacher').value || 'José White'}\n`;
    md += `- **School Year:** ${document.getElementById('year').value || '2026'}\n`;
    md += `- **Trimester:** ${document.getElementById('term').value || '1'}\n`;
    md += `- **Weekly Hours:** ${document.getElementById('weeklyHours').value || '3'}\n`;
    md += `- **Weeks:** ${document.getElementById('weeks').value || 'From week __ to week __'}\n`;
    md += `- **CEFR Level:** ${document.getElementById('cefr').value || 'Pre-A1 / A1 / A2'}\n\n`;
    
    // Sección 2: Enfoque Curricular
    md += '## 🎯 Curricular Focus\n';
    md += `- **Grade:** ${gradeSelect.options[gradeSelect.selectedIndex].text}\n`;
    md += `- **Scenario:** ${selectedScenario.name}\n`;
    md += `- **Theme:** ${themeName}\n`;
    md += `- **Context:** ${document.getElementById('context').value || 'Grupo de primaria panameña; recursos básicos.'}\n\n`;
    
    // Sección 3: Lecciones
    md += '## 📅 Lessons Schedule\n';
    md += '| Lesson | Date | Time (min) |\n';
    md += '|--------|------|------------|\n';
    
    for (let i = 0; i < 5; i++) {
      md += `| Lesson ${i + 1} | ${lessonDates[i] || 'To be scheduled'} | ${lessonTimes[i] || '45'} |\n`;
    }
    md += '\n';
    
    // Sección 4: Estándares y Competencias (si existen)
    if (scenarioData.standards_and_learning_outcomes) {
      md += '## 📚 Standards & Learning Outcomes\n';
      const std = scenarioData.standards_and_learning_outcomes;
      
      if (std.listening && Array.isArray(std.listening)) md += `- **Listening:** ${std.listening.join(', ')}\n`;
      if (std.reading && Array.isArray(std.reading)) md += `- **Reading:** ${std.reading.join(', ')}\n`;
      if (std.speaking && Array.isArray(std.speaking)) md += `- **Speaking:** ${std.speaking.join(', ')}\n`;
      if (std.writing && Array.isArray(std.writing)) md += `- **Writing:** ${std.writing.join(', ')}\n`;
      if (std.mediation && Array.isArray(std.mediation)) md += `- **Mediation:** ${std.mediation.join(', ')}\n`;
      md += '\n';
    }
    
    if (scenarioData.communicative_competences) {
      md += '## 💬 Communicative Competences\n';
      const comp = scenarioData.communicative_competences;
      
      if (comp.linguistic) md += `- **Linguistic:** ${comp.linguistic}\n`;
      if (comp.sociolinguistic) md += `- **Sociolinguistic:** ${comp.sociolinguistic}\n`;
      if (comp.pragmatic) md += `- **Pragmatic:** ${comp.pragmatic}\n`;
      md += '\n';
    }
    
    // Sección 5: Ideas de Evaluación
    if (scenarioData.assessment_ideas && Array.isArray(scenarioData.assessment_ideas)) {
      md += '## 📊 Assessment Ideas\n';
      scenarioData.assessment_ideas.forEach((idea, idx) => {
        md += `${idx + 1}. ${idea}\n`;
      });
      md += '\n';
    }
    
    // Sección 6: Fecha de generación
    md += `---\n`;
    md += `*Generated: ${new Date().toLocaleString()}*\n`;
    md += `*By: Teacher English Planner*\n`;
    
    // Mostrar en textarea
    document.getElementById('mdPreview').value = md;
    
    console.log("✅ Markdown generado exitosamente");
    alert("✅ Vista previa Markdown generada!\n\nRevisa la sección 'Vista previa (Markdown)'");
    
  } catch (error) {
    console.error("❌ Error generando markdown:", error);
    alert(`❌ Error: ${error.message}`);
  }
}

// Exportar DOCX (placeholder - necesita integración con docxExport.js)
async function exportToDOCX(type = 'theme') {
  try {
    console.log(`📄 Exportando ${type} a DOCX...`);
    
    // Validar que haya datos seleccionados
    const gradeSelect = document.getElementById('grade');
    const scenarioSelect = document.getElementById('scenario');
    const themeSelect = document.getElementById('theme');
    
    if (!gradeSelect.value || !scenarioSelect.value || !themeSelect.value) {
      alert("❌ Por favor selecciona Grado, Escenario y Tema primero");
      return;
    }
    
    // Aquí iría la integración con docxExport.js
    // Por ahora solo placeholder
    
    if (type === 'theme') {
      alert("✅ Theme Planner DOCX listo para exportar\n\n(Integración con docxExport.js pendiente)");
    } else {
      alert("✅ Lesson Planner DOCX listo para exportar\n\n(Integración con docxExport.js pendiente)");
    }
    
  } catch (error) {
    console.error("❌ Error exportando DOCX:", error);
    alert(`❌ Error al exportar: ${error.message}`);
  }
}

// Exportar PDF (placeholder)
async function exportToPDF(type = 'theme') {
  alert(`📊 Exportación ${type} PDF - Funcionalidad en desarrollo\n\nSe implementará con md2pdf.js`);
}

// ===== 4. CONEXIÓN DE BOTONES =====

function connectAllButtons() {
  console.log("🔗 Conectando todos los botones...");
  
  // Botón de vista previa Markdown
  const previewBtn = document.getElementById('genPreview');
  if (previewBtn) {
    previewBtn.addEventListener('click', generateMarkdownPreview);
    console.log("✅ Botón 'Generar Preview Markdown' conectado");
  }
  
  // Botones DOCX
  const themeDocxBtn = document.getElementById('exportThemeDOC');
  if (themeDocxBtn) {
    themeDocxBtn.addEventListener('click', () => exportToDOCX('theme'));
    console.log("✅ Botón 'Theme Planner DOCX' conectado");
  }
  
  const lessonDocxBtn = document.getElementById('exportLessonDOC');
  if (lessonDocxBtn) {
    lessonDocxBtn.addEventListener('click', () => exportToDOCX('lessons'));
    console.log("✅ Botón 'Lesson Planner DOCX' conectado");
  }
  
  // Botones PDF
  const themePdfBtn = document.getElementById('exportThemePDF');
  if (themePdfBtn) {
    themePdfBtn.addEventListener('click', () => exportToPDF('theme'));
    console.log("✅ Botón 'Theme Planner PDF' conectado");
  }
  
  const lessonPdfBtn = document.getElementById('exportLessonPDF');
  if (lessonPdfBtn) {
    lessonPdfBtn.addEventListener('click', () => exportToPDF('lessons'));
    console.log("✅ Botón 'Lesson Planner PDF' conectado");
  }
  
  // Botón tema claro/oscuro
  const themeToggleBtn = document.getElementById('themeToggle');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function() {
      const body = document.body;
      const isDark = body.getAttribute('data-theme') === 'dark';
      body.setAttribute('data-theme', isDark ? 'light' : 'dark');
      this.textContent = isDark ? 'Modo oscuro' : 'Modo claro';
      console.log(`🌓 Tema cambiado a: ${isDark ? 'light' : 'dark'}`);
    });
    console.log("✅ Botón 'Modo claro/oscuro' conectado");
  }
  
  // Otros botones de configuración
  const configButtons = ['saveCfg', 'loadCfg', 'clearSW'];
  configButtons.forEach(btnId => {
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.addEventListener('click', () => {
        alert(`⚙️ ${btnId.replace('Cfg', ' Configuración').replace('clearSW', 'Borrar Caché')} - Funcionalidad en desarrollo`);
      });
      console.log(`✅ Botón '${btnId}' conectado`);
    }
  });
  
  console.log("✅ Todos los botones conectados");
}

// ===== 5. INICIALIZACIÓN PRINCIPAL =====

document.addEventListener('DOMContentLoaded', function() {
  console.log("✅ DOM completamente cargado");
  
  // 1. Cargar grados disponibles
  loadAvailableGrades();
  
  // 2. Generar tabla de lecciones
  generateLessonTable();
  
  // 3. Conectar todos los botones
  connectAllButtons();
  
  // 4. Configurar eventos de selección
  const gradeSelect = document.getElementById('grade');
  const scenarioSelect = document.getElementById('scenario');
  
  if (gradeSelect) {
    gradeSelect.addEventListener('change', async function() {
      const gradeKey = this.value;
      if (!gradeKey) {
        // Limpiar si no hay selección
        document.getElementById('scenario').innerHTML = '<option value="">Seleccionar Escenario</option>';
        document.getElementById('theme').innerHTML = '<option value="">Seleccionar Tema</option>';
        return;
      }
      
      try {
        alert(`⏳ Cargando ${this.options[this.selectedIndex].text}...`);
        
        // Cargar datos del grado
        currentData = await loadGradeData(gradeKey);
        
        if (!currentData || currentData.length === 0) {
          alert(`⚠️ El grado ${gradeKey} no tiene datos o el archivo está vacío`);
          return;
        }
        
        // Extraer escenarios
        currentScenarios = extractScenarios(currentData);
        
        if (currentScenarios.length === 0) {
          alert(`ℹ️ No se encontraron escenarios estructurados. Mostrando todos los temas.`);
          
          // Crear un escenario genérico con todos los datos
          currentScenarios = [{
            id: 'all',
            name: 'Todos los Temas',
            index: 0,
            data: currentData[0],
            themes: currentData.map((item, idx) => `Item ${idx + 1}`)
          }];
        }
        
        // Poblar escenarios
        populateScenarios(currentScenarios);
        
        // Limpiar temas
        document.getElementById('theme').innerHTML = '<option value="">Seleccionar Tema</option>';
        
        alert(`✅ ${currentScenarios.length} escenarios cargados\n\nAhora selecciona un "Escenario"`);
        
      } catch (error) {
        alert(`❌ Error: ${error.message}`);
      }
    });
  }
  
  if (scenarioSelect) {
    scenarioSelect.addEventListener('change', function() {
      const scenarioId = this.value;
      if (!scenarioId) {
        document.getElementById('theme').innerHTML = '<option value="">Seleccionar Tema</option>';
        return;
      }
      
      populateThemes(scenarioId);
      
      const selectedScenario = currentScenarios.find(s => s.id === scenarioId);
      if (selectedScenario && selectedScenario.themes && selectedScenario.themes.length > 0) {
        alert(`✅ ${selectedScenario.themes.length} temas disponibles\n\nAhora selecciona un "Tema"`);
      }
    });
  }
  
  // 5. Mensaje inicial
  console.log("🚀 Teacher English Planner completamente inicializado");
  console.log("===================================================");
  console.log("📋 ESTADO ACTUAL:");
  console.log("- Todos los botones conectados");
  console.log("- Tabla de lecciones generada");
  console.log("- Sistema listo para usar");
  console.log("===================================================");
  
  setTimeout(() => {
    alert("✅ Teacher English Planner listo!\n\n📚 Selecciona un Grado para comenzar");
  }, 1000);
});