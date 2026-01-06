// app/app.js - VERSIÓN CORREGIDA Y MÁS ROBUSTA
console.log("🚀 Teacher English Planner - Iniciando...");

// ===== VARIABLES GLOBALES =====
let currentData = null;
let currentScenarios = [];
let currentLang = 'es';

// ===== I18N SIMPLIFICADO =====
const i18n = {
  es: {
    selectGrade: 'Seleccionar Grado',
    selectScenario: 'Seleccionar Escenario',
    selectTheme: 'Seleccionar Tema',
    // ... (mantén el resto de traducciones)
  },
  en: {
    // ... (traducciones en inglés)
  }
};

function t(key) { return i18n[currentLang][key] || key; }

// ===== DATOS PREDETERMINADOS PARA MEDUCA =====
const DEFAULT_SCENARIOS = {
  '1': [
    { id: 'scenario_1', name: 'Scenario 1: All Week Long!', name_es: 'Scenario 1: All Week Long!', name_en: 'Scenario 1: All Week Long!' },
    { id: 'scenario_2', name: 'Scenario 2: Nice Weather Today!', name_es: 'Scenario 2: Nice Weather Today!', name_en: 'Scenario 2: Nice Weather Today!' },
    { id: 'scenario_3', name: 'Scenario 3: Colors in Our World', name_es: 'Scenario 3: Colors in Our World', name_en: 'Scenario 3: Colors in Our World' },
    { id: 'scenario_4', name: 'Scenario 4: My Family and I', name_es: 'Scenario 4: My Family and I', name_en: 'Scenario 4: My Family and I' },
    { id: 'scenario_5', name: 'Scenario 5: Colors of Things that Go', name_es: 'Scenario 5: Colors of Things that Go', name_en: 'Scenario 5: Colors of Things that Go' },
    { id: 'scenario_6', name: 'Scenario 6: Shapes Around Us', name_es: 'Scenario 6: Shapes Around Us', name_en: 'Scenario 6: Shapes Around Us' },
    { id: 'scenario_7', name: 'Scenario 7: Shapes on Our Plates', name_es: 'Scenario 7: Shapes on Our Plates', name_en: 'Scenario 7: Shapes on Our Plates' },
    { id: 'scenario_8', name: "Scenario 8: It's Our Garden", name_es: "Scenario 8: It's Our Garden", name_en: "Scenario 8: It's Our Garden" }
  ],
  '2': [
    { id: 'scenario_1', name: 'Escenario 1: Mi escuela', name_es: 'Escenario 1: Mi escuela', name_en: 'Scenario 1: My School' },
    { id: 'scenario_2', name: 'Escenario 2: Mi familia', name_es: 'Escenario 2: Mi familia', name_en: 'Scenario 2: My Family' },
    { id: 'scenario_3', name: 'Escenario 3: Mi comunidad', name_es: 'Escenario 3: Mi comunidad', name_en: 'Scenario 3: My Community' },
    { id: 'scenario_4', name: 'Escenario 4: Animales', name_es: 'Escenario 4: Animales', name_en: 'Scenario 4: Animals' },
    { id: 'scenario_5', name: 'Escenario 5: Comida', name_es: 'Escenario 5: Comida', name_en: 'Scenario 5: Food' },
    { id: 'scenario_6', name: 'Escenario 6: Juegos', name_es: 'Escenario 6: Juegos', name_en: 'Scenario 6: Games' },
    { id: 'scenario_7', name: 'Escenario 7: Naturaleza', name_es: 'Escenario 7: Naturaleza', name_en: 'Scenario 7: Nature' },
    { id: 'scenario_8', name: 'Escenario 8: Festividades', name_es: 'Escenario 8: Festividades', name_en: 'Scenario 8: Holidays' }
  ]
};

const DEFAULT_THEMES = {
  'scenario_1': [
    { id: 'theme_1', name: 'Tema 1: Días y rutinas', name_es: 'Tema 1: Días y rutinas', name_en: 'Theme 1: Days and Routines' },
    { id: 'theme_2', name: 'Tema 2: Actividades escolares', name_es: 'Tema 2: Actividades escolares', name_en: 'Theme 2: School Activities' }
  ],
  'scenario_2': [
    { id: 'theme_1', name: 'Tema 1: El clima', name_es: 'Tema 1: El clima', name_en: 'Theme 1: Weather' },
    { id: 'theme_2', name: 'Tema 2: Vestimenta', name_es: 'Tema 2: Vestimenta', name_en: 'Theme 2: Clothing' }
  ],
  'scenario_3': [
    { id: 'theme_1', name: 'Tema 1: Colores básicos', name_es: 'Tema 1: Colores básicos', name_en: 'Theme 1: Basic Colors' },
    { id: 'theme_2', name: 'Tema 2: Objetos coloridos', name_es: 'Tema 2: Objetos coloridos', name_en: 'Theme 2: Colorful Objects' }
  ],
  'scenario_4': [
    { id: 'theme_1', name: 'Tema 1: Miembros familiares', name_es: 'Tema 1: Miembros familiares', name_en: 'Theme 1: Family Members' },
    { id: 'theme_2', name: 'Tema 2: Sentimientos', name_es: 'Tema 2: Sentimientos', name_en: 'Theme 2: Feelings' }
  ]
};

// ===== FUNCIONES DE CARGA =====
function loadAvailableGrades() {
  const gradeSelect = document.getElementById('grade');
  if (!gradeSelect) return;

  gradeSelect.innerHTML = `<option value="">${t('selectGrade')}</option>`;

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
}

async function loadGradeData(gradeKey) {
  console.log(`📥 Cargando datos para grado: ${gradeKey}`);
  
  try {
    // Intentar cargar desde archivo JSON
    const fileName = `data/grade_${gradeKey}.json`;
    const response = await fetch(fileName);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Datos cargados desde JSON para grado ${gradeKey}`, data);
      return data;
    } else {
      console.log(`ℹ️ No se encontró archivo JSON para grado ${gradeKey}, usando datos predeterminados`);
      return createDefaultData(gradeKey);
    }
  } catch (error) {
    console.warn(`⚠️ Error cargando datos para grado ${gradeKey}:`, error);
    return createDefaultData(gradeKey);
  }
}

function createDefaultData(gradeKey) {
  console.log(`📝 Creando datos predeterminados para grado ${gradeKey}`);
  
  const scenarios = DEFAULT_SCENARIOS[gradeKey] || DEFAULT_SCENARIOS['1'];
  const defaultData = [];
  
  scenarios.forEach(scenario => {
    const themes = DEFAULT_THEMES[scenario.id] || [
      { id: 'theme_1', name: `Tema 1 - ${scenario.name}`, name_es: `Tema 1 - ${scenario.name}`, name_en: `Theme 1 - ${scenario.name}` },
      { id: 'theme_2', name: `Tema 2 - ${scenario.name}`, name_es: `Tema 2 - ${scenario.name}`, name_en: `Theme 2 - ${scenario.name}` }
    ];
    
    themes.forEach(theme => {
      defaultData.push({
        scenario_id: scenario.id,
        scenario_name_es: scenario.name_es || scenario.name,
        scenario_name_en: scenario.name_en || scenario.name,
        theme_id: theme.id,
        theme_name_es: theme.name_es || theme.name,
        theme_name_en: theme.name_en || theme.name,
        standards: {
          linguistic: `Estándar lingüístico para ${scenario.name} - ${theme.name}`,
          sociolinguistic: `Estándar sociolingüístico para ${scenario.name} - ${theme.name}`,
          pragmatic: `Estándar pragmático para ${scenario.name} - ${theme.name}`
        },
        learning_outcomes: {
          listening: `El estudiante podrá entender conceptos básicos de ${theme.name}`,
          speaking: `El estudiante podrá expresar ideas sobre ${theme.name}`,
          reading: `El estudiante podrá leer textos relacionados con ${theme.name}`,
          writing: `El estudiante podrá escribir sobre ${theme.name}`
        }
      });
    });
  });
  
  return defaultData;
}

// ===== EXTRACCIÓN DE SCENARIOS SIMPLIFICADA =====
function extractScenarios(data) {
  console.log('🔍 Extrayendo scenarios...');
  
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn('⚠️ No hay datos para extraer scenarios');
    return [];
  }

  const scenariosMap = new Map();
  
  data.forEach(item => {
    // Obtener información del scenario
    const scenarioId = item.scenario_id || 'scenario_1';
    const scenarioName = currentLang === 'es' 
      ? (item.scenario_name_es || item.scenario_name || `Escenario ${scenarioId.split('_')[1]}`)
      : (item.scenario_name_en || item.scenario_name || `Scenario ${scenarioId.split('_')[1]}`);
    
    // Obtener información del tema
    const themeId = item.theme_id || 'theme_1';
    const themeName = currentLang === 'es'
      ? (item.theme_name_es || item.theme_name || `Tema ${themeId.split('_')[1]}`)
      : (item.theme_name_en || item.theme_name || `Theme ${themeId.split('_')[1]}`);
    
    // Crear o obtener el scenario
    if (!scenariosMap.has(scenarioId)) {
      scenariosMap.set(scenarioId, {
        id: scenarioId,
        name: scenarioName,
        themes: [],
        allData: []
      });
    }
    
    const scenario = scenariosMap.get(scenarioId);
    
    // Verificar si el tema ya existe
    const existingTheme = scenario.themes.find(t => t.id === themeId);
    if (!existingTheme) {
      scenario.themes.push({
        id: themeId,
        name: themeName,
        item: item
      });
    }
    
    scenario.allData.push(item);
  });
  
  // Convertir a array y ordenar
  const scenarios = Array.from(scenariosMap.values());
  scenarios.sort((a, b) => a.id.localeCompare(b.id));
  
  console.log(`📊 ${scenarios.length} scenarios extraídos:`, scenarios);
  return scenarios;
}

// ===== FUNCIONES DE INTERFAZ =====
function populateScenarios(scenarios) {
  const scenarioSelect = document.getElementById('scenario');
  if (!scenarioSelect) return;

  scenarioSelect.innerHTML = `<option value="">${t('selectScenario')}</option>`;

  // Mostrar máximo 8 scenarios
  scenarios.slice(0, 8).forEach(scenario => {
    const option = document.createElement('option');
    option.value = scenario.id;
    option.textContent = scenario.name;
    scenarioSelect.appendChild(option);
  });
  
  console.log(`✅ ${scenarios.length} scenarios cargados`);
}

function populateThemes(scenarioId) {
  const themeSelect = document.getElementById('theme');
  if (!themeSelect) return;

  themeSelect.innerHTML = `<option value="">${t('selectTheme')}</option>`;

  const scenario = currentScenarios.find(s => s.id === scenarioId);
  if (!scenario || !scenario.themes) {
    console.warn(`⚠️ No hay temas para el scenario ${scenarioId}`);
    return;
  }

  // Mostrar máximo 2 temas
  scenario.themes.slice(0, 2).forEach(theme => {
    const option = document.createElement('option');
    option.value = theme.id;
    option.textContent = theme.name;
    themeSelect.appendChild(option);
  });
  
  console.log(`✅ ${scenario.themes.length} temas cargados para ${scenario.name}`);
}

function generateLessonTable() {
  const lessonTable = document.getElementById('lessonTable');
  if (!lessonTable) return;

  lessonTable.innerHTML = '';

  for (let i = 1; i <= 5; i++) {
    const row = document.createElement('tr');

    const lessonCell = document.createElement('td');
    lessonCell.textContent = `${t('lesson')} ${i}`;
    row.appendChild(lessonCell);

    const dateCell = document.createElement('td');
    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.className = 'lesson-date';
    dateInput.id = `lesson-date-${i}`;
    dateCell.appendChild(dateInput);
    row.appendChild(dateCell);

    const timeCell = document.createElement('td');
    const timeInput = document.createElement('input');
    timeInput.type = 'number';
    timeInput.className = 'lesson-time';
    timeInput.id = `lesson-time-${i}`;
    timeInput.placeholder = t('minutes');
    timeInput.value = '45';
    timeInput.min = '1';
    timeCell.appendChild(timeInput);
    row.appendChild(timeCell);

    lessonTable.appendChild(row);
  }
}

// ===== PREVIEW MARKDOWN (YA FUNCIONA SEGÚN IMÁGENES) =====
function generateMarkdownPreview() {
  try {
    console.log('📝 Generando preview Markdown...');
    
    const gradeSelect = document.getElementById('grade');
    const scenarioSelect = document.getElementById('scenario');
    const themeSelect = document.getElementById('theme');
    
    if (!gradeSelect || !scenarioSelect || !themeSelect) {
      throw new Error('Elementos del formulario no encontrados');
    }
    
    const gradeKey = gradeSelect.value;
    const scenarioId = scenarioSelect.value;
    const themeId = themeSelect.value;
    
    if (!gradeKey || !scenarioId || !themeId) {
      throw new Error('Selecciona Grado, Escenario y Tema primero');
    }
    
    // Encontrar datos
    const selectedScenario = currentScenarios.find(s => s.id === scenarioId);
    const selectedTheme = selectedScenario?.themes.find(t => t.id === themeId);
    
    if (!selectedTheme) {
      throw new Error('Tema no encontrado');
    }
    
    // Recoger lecciones
    const lessons = [];
    for (let i = 1; i <= 5; i++) {
      const dateInput = document.getElementById(`lesson-date-${i}`);
      const timeInput = document.getElementById(`lesson-time-${i}`);
      lessons.push({
        number: i,
        date: dateInput?.value || 'Sin fecha',
        time: timeInput?.value || '45'
      });
    }
    
    // Construir Markdown
    let md = `# Teacher English Lesson Plan\n\n`;
    
    md += `## Datos Institucionales\n`;
    md += `- **Colegio:** ${document.getElementById('school')?.value || 'CEBG Barrigón'}\n`;
    md += `- **Docente:** ${document.getElementById('teacher')?.value || 'José White'}\n`;
    md += `- **Año Escolar:** ${document.getElementById('year')?.value || '2026'}\n`;
    md += `- **Grado:** ${gradeSelect.options[gradeSelect.selectedIndex].text}\n\n`;
    
    md += `## Enfoque Curricular\n`;
    md += `- **Escenario:** ${selectedScenario.name}\n`;
    md += `- **Tema:** ${selectedTheme.name}\n\n`;
    
    md += `## Cronograma de Lecciones\n`;
    md += `| Lección | Fecha | Tiempo (min) |\n`;
    md += `|---------|-------|--------------|\n`;
    lessons.forEach(lesson => {
      md += `| Lección ${lesson.number} | ${lesson.date} | ${lesson.time} |\n`;
    });
    md += `\n`;
    
    // Añadir estándares si existen
    if (selectedTheme.item.standards) {
      md += `## Estándares Curriculares\n`;
      Object.entries(selectedTheme.item.standards).forEach(([key, value]) => {
        md += `- **${key}:** ${value}\n`;
      });
      md += `\n`;
    }
    
    // Añadir resultados de aprendizaje si existen
    if (selectedTheme.item.learning_outcomes) {
      md += `## Resultados de Aprendizaje\n`;
      Object.entries(selectedTheme.item.learning_outcomes).forEach(([key, value]) => {
        md += `- **${key}:** ${value}\n`;
      });
      md += `\n`;
    }
    
    md += `---\n*Generado: ${new Date().toLocaleString()}*\n`;
    
    // Mostrar en textarea
    const previewTextarea = document.getElementById('mdPreview');
    if (previewTextarea) {
      previewTextarea.value = md;
      alert('✅ Vista previa Markdown generada');
    } else {
      alert('✅ Markdown generado. Revisa la consola.');
      console.log(md);
    }
    
  } catch (error) {
    console.error('❌ Error generando Markdown:', error);
    alert(`❌ Error: ${error.message}`);
  }
}

// ===== FUNCIONES AUXILIARES =====
function updateStandardsPanel() {
  const scenarioSelect = document.getElementById('scenario');
  const themeSelect = document.getElementById('theme');
  const panel = document.getElementById('standardsPanel');
  
  if (!scenarioSelect || !themeSelect || !panel) return;

  const scenarioId = scenarioSelect.value;
  const themeId = themeSelect.value;
  
  if (!scenarioId || !themeId) {
    panel.innerHTML = '<p>Selecciona un escenario y tema para ver los estándares.</p>';
    return;
  }

  const selectedScenario = currentScenarios.find(s => s.id === scenarioId);
  const selectedTheme = selectedScenario?.themes.find(t => t.id === themeId);
  
  if (!selectedTheme) {
    panel.innerHTML = '<p>No se encontraron datos para esta selección.</p>';
    return;
  }

  const raw = selectedTheme.item;
  
  let html = `<h4>${selectedScenario.name} - ${selectedTheme.name}</h4>`;
  
  if (raw.standards) {
    html += `<h5>Estándares Curriculares</h5><ul>`;
    Object.entries(raw.standards).forEach(([key, value]) => {
      html += `<li><strong>${key}:</strong> ${value}</li>`;
    });
    html += `</ul>`;
  }
  
  if (raw.learning_outcomes) {
    html += `<h5>Resultados de Aprendizaje</h5><ul>`;
    Object.entries(raw.learning_outcomes).forEach(([key, value]) => {
      html += `<li><strong>${key}:</strong> ${value}</li>`;
    });
    html += `</ul>`;
  }
  
  panel.innerHTML = html;
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
  console.log('✅ DOM cargado - Iniciando aplicación');
  
  // Inicializar
  loadAvailableGrades();
  generateLessonTable();
  
  // Configurar event listeners
  const gradeSelect = document.getElementById('grade');
  const scenarioSelect = document.getElementById('scenario');
  const themeSelect = document.getElementById('theme');
  
  if (gradeSelect) {
    gradeSelect.addEventListener('change', async function() {
      const gradeKey = this.value;
      console.log(`🎓 Grado seleccionado: ${gradeKey}`);
      
      if (!gradeKey) {
        if (scenarioSelect) scenarioSelect.innerHTML = `<option value="">${t('selectScenario')}</option>`;
        if (themeSelect) themeSelect.innerHTML = `<option value="">${t('selectTheme')}</option>`;
        return;
      }
      
      try {
        console.log(`📥 Cargando datos para grado ${gradeKey}...`);
        currentData = await loadGradeData(gradeKey);
        
        if (!currentData || currentData.length === 0) {
          alert('⚠️ No hay datos disponibles para este grado');
          return;
        }
        
        currentScenarios = extractScenarios(currentData);
        
        if (currentScenarios.length === 0) {
          alert('⚠️ No se pudieron extraer los escenarios');
          return;
        }
        
        if (scenarioSelect) populateScenarios(currentScenarios);
        if (themeSelect) themeSelect.innerHTML = `<option value="">${t('selectTheme')}</option>`;
        
        console.log(`✅ ${currentScenarios.length} escenarios cargados exitosamente`);
        
      } catch (error) {
        console.error('❌ Error:', error);
        alert(`❌ Error: ${error.message}`);
      }
    });
  }
  
  if (scenarioSelect) {
    scenarioSelect.addEventListener('change', function() {
      const scenarioId = this.value;
      console.log(`🎭 Escenario seleccionado: ${scenarioId}`);
      
      if (!scenarioId) {
        if (themeSelect) themeSelect.innerHTML = `<option value="">${t('selectTheme')}</option>`;
        return;
      }
      
      if (themeSelect) populateThemes(scenarioId);
      updateStandardsPanel();
    });
  }
  
  if (themeSelect) {
    themeSelect.addEventListener('change', updateStandardsPanel);
  }
  
  // Conectar botones principales
  const buttons = {
    'genPreview': generateMarkdownPreview,
    'exportThemeDOC': () => alert('⚠️ Exportación DOCX - Próximamente'),
    'exportLessonDOC': () => alert('⚠️ Exportación Lessons DOCX - Próximamente'),
    'exportThemePDF': () => alert('⚠️ Exportación PDF - Próximamente'),
    'exportLessonPDF': () => alert('⚠️ Exportación Lessons PDF - Próximamente')
  };
  
  for (const [id, handler] of Object.entries(buttons)) {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener('click', handler);
      console.log(`✅ Botón "${id}" conectado`);
    } else {
      console.warn(`⚠️ Botón "${id}" no encontrado`);
    }
  }
  
  console.log('🚀 Aplicación inicializada');
});