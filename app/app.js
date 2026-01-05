// app/app.js - VERSIÓN DEFINITIVA CON ESTRUCTURA CORRECTA

// --- Variables globales ---
let currentThemes = []; // Array de temas del grado seleccionado
let currentScenarios = []; // Array de escenarios únicos

// --- Función PRINCIPAL corregida ---
async function loadGradeData(gradeKey) {
  try {
    // Ruta correcta según lo confirmado
    let fileName = `grade_${gradeKey}.json`;
    if (gradeKey === 'pre-k') fileName = 'grade_pre-k.json';
    if (gradeKey === 'K') fileName = 'grade_K.json';
    
    const url = `data/${fileName}`;
    console.log(`📂 Cargando: ${url}`);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`No se pudo cargar ${fileName}`);
    }
    
    const data = await response.json();
    console.log(`✅ ${data.length} elementos cargados`);
    
    // Los datos SON un array de "escenarios con temas"
    // Cada elemento tiene: scenario (string) y themes (array)
    
    return data; // Devolvemos el array completo
    
  } catch (error) {
    console.error("❌ Error:", error);
    alert(`Error al cargar grado ${gradeKey}: ${error.message}`);
    return [];
  }
}

// --- Extraer escenarios únicos ---
function extractUniqueScenarios(themesData) {
  const scenariosMap = new Map();
  
  themesData.forEach((item, index) => {
    if (item.scenario && typeof item.scenario === 'string') {
      // Crear ID único para el escenario
      const scenarioId = `scenario_${index}`;
      
      if (!scenariosMap.has(scenarioId)) {
        scenariosMap.set(scenarioId, {
          id: scenarioId,
          name: item.scenario,
          index: index, // Guardar índice para referencia
          themes: item.themes || [] // Temas dentro de este escenario
        });
      }
    }
  });
  
  return Array.from(scenariosMap.values());
}

// --- Poblar escenarios CORREGIDO ---
function populateScenarios(scenarios, scenarioSelect) {
  console.log("📊 Poblando escenarios:", scenarios);
  
  scenarioSelect.innerHTML = '<option value="">Seleccionar Escenario</option>';
  
  if (!scenarios || scenarios.length === 0) {
    // Si no hay escenarios, crear uno genérico con todos los temas
    const option = document.createElement('option');
    option.value = "all";
    option.textContent = "Todos los Escenarios";
    scenarioSelect.appendChild(option);
    
    console.warn("⚠️ No se encontraron escenarios, usando genérico");
    return;
  }
  
  // Agregar cada escenario al selector
  scenarios.forEach(scenario => {
    const option = document.createElement('option');
    option.value = scenario.id;
    option.textContent = scenario.name;
    scenarioSelect.appendChild(option);
  });
  
  console.log(`✅ ${scenarios.length} escenarios cargados`);
}

// --- Poblar temas CORREGIDO ---
function populateThemes(scenarios, themeSelect, selectedScenarioId) {
  console.log(`📚 Buscando temas para escenario: ${selectedScenarioId}`);
  
  themeSelect.innerHTML = '<option value="">Seleccionar Tema</option>';
  
  // Encontrar el escenario seleccionado
  const selectedScenario = scenarios.find(s => s.id === selectedScenarioId);
  
  if (!selectedScenario || !selectedScenario.themes || selectedScenario.themes.length === 0) {
    console.warn("⚠️ No se encontraron temas para este escenario");
    alert("Este escenario no tiene temas definidos");
    return;
  }
  
  // Agregar cada tema al selector
  selectedScenario.themes.forEach((themeName, index) => {
    const option = document.createElement('option');
    option.value = `theme_${selectedScenario.index}_${index}`;
    option.textContent = themeName;
    themeSelect.appendChild(option);
  });
  
  console.log(`✅ ${selectedScenario.themes.length} temas cargados`);
  alert(`✅ ${selectedScenario.themes.length} temas disponibles: ${selectedScenario.themes.join(", ")}`);
}

// --- Generar vista previa MEJORADA ---
async function generateMarkdownPreview() {
  const gradeKey = document.getElementById('grade').value;
  const scenarioId = document.getElementById('scenario').value;
  const themeId = document.getElementById('theme').value;
  
  if (!gradeKey) {
    alert("Por favor selecciona un Grado");
    return;
  }
  
  if (!scenarioId) {
    alert("Por favor selecciona un Escenario");
    return;
  }
  
  if (!themeId) {
    alert("Por favor selecciona un Tema");
    return;
  }
  
  try {
    // Obtener datos del tema seleccionado
    const selectedScenario = currentScenarios.find(s => s.id === scenarioId);
    const themeIndex = parseInt(themeId.split('_')[2]);
    const themeName = selectedScenario.themes[themeIndex];
    
    // Obtener datos completos del tema original
    const themeData = currentThemes[selectedScenario.index];
    
    // Generar markdown enriquecido
    let md = `# Teacher English Lesson Plan\n\n`;
    
    // Datos institucionales
    md += `## Institutional Data\n`;
    md += `- **School:** ${document.getElementById('school').value || 'CEBG Barrigón'}\n`;
    md += `- **Teacher:** ${document.getElementById('teacher').value || 'José White'}\n`;
    md += `- **School Year:** ${document.getElementById('year').value || '2026'}\n`;
    md += `- **Trimester:** ${document.getElementById('term').value || '1'}\n`;
    md += `- **Weekly Hours:** ${document.getElementById('weeklyHours').value || '3'}\n\n`;
    
    // Datos curriculares
    md += `## Curricular Focus\n`;
    md += `- **Grade:** Grade ${gradeKey.toUpperCase()}\n`;
    md += `- **Scenario:** ${selectedScenario.name}\n`;
    md += `- **Theme:** ${themeName}\n\n`;
    
    // Estándares (si existen)
    if (themeData.standards_and_learning_outcomes) {
      md += `## Standards & Learning Outcomes\n`;
      for (const key in themeData.standards_and_learning_outcomes) {
        if (Array.isArray(themeData.standards_and_learning_outcomes[key])) {
          md += `- **${key.replace(/_/g, ' ').toUpperCase()}:** ${themeData.standards_and_learning_outcomes[key].join(', ')}\n`;
        }
      }
      md += `\n`;
    }
    
    // Competencias comunicativas (si existen)
    if (themeData.communicative_competences) {
      md += `## Communicative Competences\n`;
      for (const key in themeData.communicative_competences) {
        const value = themeData.communicative_competences[key];
        if (Array.isArray(value)) {
          md += `- **${key.replace(/_/g, ' ')}:** ${value.join(', ')}\n`;
        } else if (typeof value === 'string') {
          md += `- **${key.replace(/_/g, ' ')}:** ${value}\n`;
        }
      }
      md += `\n`;
    }
    
    // Ideas de evaluación (si existen)
    if (themeData.assessment_ideas && Array.isArray(themeData.assessment_ideas)) {
      md += `## Assessment Ideas\n`;
      themeData.assessment_ideas.forEach((idea, idx) => {
        md += `${idx + 1}. ${idea}\n`;
      });
    }
    
    document.getElementById('mdPreview').value = md;
    alert("✅ Vista previa Markdown generada con éxito!");
    
  } catch (error) {
    console.error("Error generando vista previa:", error);
    alert("Error al generar vista previa. Ver consola.");
  }
}

// --- Inicialización CORREGIDA ---
document.addEventListener('DOMContentLoaded', () => {
  console.log("🚀 Teacher English Planner - Iniciando...");
  
  const gradeSelect = document.getElementById('grade');
  const scenarioSelect = document.getElementById('scenario');
  const themeSelect = document.getElementById('theme');
  
  // Cargar lista de grados disponibles
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
  
  // Evento: Cambio de grado
  gradeSelect.addEventListener('change', async () => {
    const gradeKey = gradeSelect.value;
    if (!gradeKey) return;
    
    try {
      alert(`⏳ Cargando Grado ${gradeKey}...`);
      
      // Cargar datos del grado
      currentThemes = await loadGradeData(gradeKey);
      
      if (currentThemes.length === 0) {
        alert(`❌ El grado ${gradeKey} no tiene datos o el archivo está vacío`);
        return;
      }
      
      // Extraer escenarios únicos
      currentScenarios = extractUniqueScenarios(currentThemes);
      
      if (currentScenarios.length === 0) {
        alert("⚠️ No se encontraron escenarios en los datos");
        // Crear escenario genérico con todos los temas combinados
        const allThemes = [];
        currentThemes.forEach(item => {
          if (item.themes && Array.isArray(item.themes)) {
            allThemes.push(...item.themes);
          }
        });
        
        currentScenarios = [{
          id: "all",
          name: "Todos los Temas",
          index: 0,
          themes: allThemes
        }];
      }
      
      // Poblar selector de escenarios
      populateScenarios(currentScenarios, scenarioSelect);
      themeSelect.innerHTML = '<option value="">Seleccionar Tema</option>';
      
      alert(`✅ Grado ${gradeKey} cargado correctamente\n📊 ${currentScenarios.length} escenarios encontrados`);
      
    } catch (error) {
      alert(`❌ Error al cargar el grado: ${error.message}`);
    }
  });
  
  // Evento: Cambio de escenario
  scenarioSelect.addEventListener('change', () => {
    const selectedScenarioId = scenarioSelect.value;
    if (!selectedScenarioId || currentScenarios.length === 0) return;
    
    populateThemes(currentScenarios, themeSelect, selectedScenarioId);
  });
  
  // Conectar botones
  document.getElementById('genPreview')?.addEventListener('click', generateMarkdownPreview);
  
  document.getElementById('exportThemeDOC')?.addEventListener('click', () => {
    alert("📄 Exportación DOCX - Funcionalidad disponible pronto");
  });
  
  document.getElementById('exportLessonDOC')?.addEventListener('click', () => {
    alert("📄 Exportación de Lecciones DOCX - Funcionalidad disponible pronto");
  });
  
  // Tema claro/oscuro
  document.getElementById('themeToggle')?.addEventListener('click', function() {
    const body = document.body;
    if (body.getAttribute('data-theme') === 'dark') {
      body.setAttribute('data-theme', 'light');
      this.textContent = 'Modo oscuro';
    } else {
      body.setAttribute('data-theme', 'dark');
      this.textContent = 'Modo claro';
    }
  });
  
  console.log("✅ Sistema completamente inicializado");
  alert("✅ Teacher English Planner listo!\n\nSelecciona un Grado para comenzar");
});