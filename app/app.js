// app/app.js - Versión para Celular con Mensajes Visuales

// --- Mostrar mensajes en pantalla (para celular) ---
function showMobileMessage(message, type = 'info') {
  // Crear o usar un div para mensajes
  let messageDiv = document.getElementById('mobileMessages');
  if (!messageDiv) {
    messageDiv = document.createElement('div');
    messageDiv.id = 'mobileMessages';
    messageDiv.style.cssText = `
      position: fixed;
      top: 10px;
      left: 10px;
      right: 10px;
      background: ${type === 'error' ? '#ff4444' : '#4CAF50'};
      color: white;
      padding: 15px;
      border-radius: 8px;
      z-index: 10000;
      font-family: Arial;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    document.body.appendChild(messageDiv);
  }
  
  messageDiv.textContent = message;
  messageDiv.style.display = 'block';
  
  // Ocultar después de 5 segundos
  setTimeout(() => {
    messageDiv.style.display = 'none';
  }, 5000);
}

// --- Funciones de carga dinámica ---
async function loadGradeData(gradeKey) {
  try {
    // Mostrar mensaje de carga
    showMobileMessage(`Cargando Grado ${gradeKey}...`, 'info');
    
    // Determinar nombre de archivo según la selección
    let fileName = '';
    if (gradeKey === 'pre-k') {
      fileName = 'grade_pre-k.json';
    } else if (gradeKey === 'K') {
      fileName = 'grade_K.json';
    } else {
      fileName = `grade_${gradeKey}.json`;
    }
    
    // Primero intentar con ../data/
    const url = `../data/${fileName}`;
    console.log(`Intentando cargar: ${url}`);
    
    let response = await fetch(url);
    
    // Si falla, intentar otras rutas
    if (!response.ok) {
      showMobileMessage(`Probando rutas alternativas...`, 'info');
      
      // Rutas alternativas comunes
      const altPaths = [
        `data/${fileName}`,           // data/ directamente
        `./data/${fileName}`,         // ./data/
        `/${fileName}`,               // desde raíz
        `../Teacher_English_Planner/data/${fileName}`,
        `./${fileName}`
      ];
      
      for (const altPath of altPaths) {
        console.log(`Probando: ${altPath}`);
        try {
          response = await fetch(altPath);
          if (response.ok) {
            showMobileMessage(`✓ Encontrado en: ${altPath}`, 'info');
            const data = await response.json();
            return processGradeData(data);
          }
        } catch (e) {
          continue; // Intentar siguiente ruta
        }
      }
      
      throw new Error(`No se encontró el archivo ${fileName}`);
    }
    
    const data = await response.json();
    showMobileMessage(`✓ Grado ${gradeKey} cargado`, 'info');
    return processGradeData(data);
    
  } catch (error) {
    const errorMsg = `Error: ${error.message}`;
    showMobileMessage(errorMsg, 'error');
    console.error("Error detallado:", error);
    throw error;
  }
}

function processGradeData(data) {
  let themesArray = [];
  
  if (Array.isArray(data)) {
    themesArray = data;
  } else if (data && typeof data === 'object') {
    if (Array.isArray(data.themes)) {
      themesArray = data.themes;
    } else if (Array.isArray(data.data)) {
      themesArray = data.data;
    } else if (Array.isArray(data.lessons)) {
      themesArray = data.lessons;
    } else {
      // Buscar cualquier array
      for (const key in data) {
        if (Array.isArray(data[key])) {
          themesArray = data[key];
          break;
        }
      }
    }
  }
  
  if (themesArray.length === 0) {
    showMobileMessage("⚠️ El archivo no tiene la estructura esperada", 'error');
  }
  
  return themesArray;
}

function populateScenarios(scenarios, scenarioSelect) {
  scenarioSelect.innerHTML = '<option value="">Seleccionar Escenario</option>';
  
  const uniqueScenarios = {};
  scenarios.forEach(theme => {
    const scenarioId = theme.scenario?.id;
    if (scenarioId && !uniqueScenarios[scenarioId]) {
      uniqueScenarios[scenarioId] = theme.scenario;
    }
  });
  
  Object.values(uniqueScenarios).forEach(scenario => {
    const option = document.createElement('option');
    option.value = scenario.id;
    option.textContent = scenario.name_en || scenario.name_es;
    scenarioSelect.appendChild(option);
  });
  
  showMobileMessage(`✓ ${Object.keys(uniqueScenarios).length} escenarios cargados`, 'info');
}

function populateThemes(themes, themeSelect, selectedScenarioId) {
  themeSelect.innerHTML = '<option value="">Seleccionar Tema</option>';
  
  const filteredThemes = themes.filter(theme => theme.scenario?.id === selectedScenarioId);
  
  filteredThemes.forEach(theme => {
    const option = document.createElement('option');
    option.value = theme.theme?.id;
    option.textContent = theme.theme?.name_en || theme.theme?.name_es;
    themeSelect.appendChild(option);
  });
  
  showMobileMessage(`✓ ${filteredThemes.length} temas disponibles`, 'info');
}

function loadAvailableGrades(selectElement) {
  selectElement.innerHTML = '<option value="">Seleccionar Grado</option>';
  
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

// --- Funciones simplificadas para prueba ---
async function generateMarkdownPreview() {
  showMobileMessage("Generando vista previa...", 'info');
  setTimeout(() => {
    document.getElementById('mdPreview').value = "# Vista Previa\n\nEsta función está activa.\nSelecciona Grado, Escenario y Tema.";
    showMobileMessage("✓ Vista previa generada", 'info');
  }, 1000);
}

async function exportThemeDocx() {
  showMobileMessage("Exportando tema DOCX...", 'info');
}

async function exportLessonsDocx() {
  showMobileMessage("Exportando lecciones DOCX...", 'info');
}

function toggleTheme() {
  const body = document.body;
  const currentTheme = body.getAttribute('data-theme');
  const themeToggleBtn = document.getElementById('themeToggle');
  
  if (currentTheme === 'dark') {
    body.setAttribute('data-theme', 'light');
    themeToggleBtn.textContent = 'Modo oscuro';
    showMobileMessage("Modo claro activado", 'info');
  } else {
    body.setAttribute('data-theme', 'dark');
    themeToggleBtn.textContent = 'Modo claro';
    showMobileMessage("Modo oscuro activado", 'info');
  }
}

// --- Variables globales ---
let currentGradeData = null;

// --- Inicialización ---
document.addEventListener('DOMContentLoaded', async () => {
  showMobileMessage("Aplicación cargada ✓", 'info');
  
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
      showMobileMessage(`Cargando datos de ${gradeKey}...`, 'info');
      currentGradeData = await loadGradeData(gradeKey);
      
      if (currentGradeData.length === 0) {
        showMobileMessage("El archivo está vacío o no tiene temas", 'error');
        return;
      }
      
      populateScenarios(currentGradeData, scenarioSelect);
      themeSelect.innerHTML = '<option value="">Seleccionar Tema</option>';
      
    } catch (error) {
      showMobileMessage(`Error al cargar: ${error.message}`, 'error');
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
  document.getElementById('exportThemeDOC')?.addEventListener('click', exportThemeDocx);
  document.getElementById('exportLessonDOC')?.addEventListener('click', exportLessonsDocx);
  
  // Conectar botón de modo claro/oscuro
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }
  
  // Agregar botón para probar rutas manualmente
  const testButton = document.createElement('button');
  testButton.textContent = "🔧 Probar Archivos";
  testButton.style.cssText = `
    position: fixed;
    bottom: 10px;
    right: 10px;
    background: #FF9800;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 20px;
    z-index: 9999;
    font-size: 12px;
  `;
  testButton.onclick = async () => {
    showMobileMessage("Probando archivos...", 'info');
    
    // Probar archivos comunes
    const filesToTest = ['grade_3.json', 'grade_pre-k.json', 'grade_K.json'];
    let foundFiles = [];
    
    for (const file of filesToTest) {
      try {
        const response = await fetch(`../data/${file}`);
        if (response.ok) {
          foundFiles.push(file);
        }
      } catch (e) {
        // Intentar ruta alternativa
        try {
          const response2 = await fetch(`data/${file}`);
          if (response2.ok) {
            foundFiles.push(`data/${file}`);
          }
        } catch (e2) {
          // No hacer nada
        }
      }
    }
    
    if (foundFiles.length > 0) {
      showMobileMessage(`✓ Encontrados: ${foundFiles.join(', ')}`, 'info');
    } else {
      showMobileMessage("❌ No se encontraron archivos JSON", 'error');
    }
  };
  
  document.body.appendChild(testButton);
  
  console.log("Aplicación lista para celular");
});