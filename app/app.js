// app/app.js - VERSIÓN CORREGIDA ESPECÍFICA PARA ESTRUCTURA VISUALIZADA
console.log("🚀 Teacher English Planner - Corrección para estructura Meduca");

// ===== VARIABLES GLOBALES =====
let currentData = null;
let currentScenarios = [];
let currentLang = 'es';

// ===== I18N =====
const i18n = {
  es: {
    selectGrade: 'Seleccionar Grado',
    selectScenario: 'Seleccionar Escenario',
    selectTheme: 'Seleccionar Tema',
    meducaHeader: "REPÚBLICA DE PANAMÁ\nMINISTERIO DE EDUCACIÓN - MEDUCA",
    themePlannerTitle: 'PLANEADOR DE TEMA',
    lessonsPlannerTitle: 'PLANIFICADOR DE LECCIONES',
    institutionalInfo: 'INFORMACIÓN INSTITUCIONAL',
    curricularInfo: 'INFORMACIÓN CURRICULAR',
    standardsTitle: 'ESTÁNDARES CURRICULARES',
    learningOutcomesTitle: 'RESULTADOS DE APRENDIZAJE',
    communicativeCompetencesTitle: 'COMPETENCIAS COMUNICATIVAS',
    assessmentIdeasTitle: 'IDEAS DE EVALUACIÓN',
    lessonsScheduleTitle: 'HORARIO DE LECCIONES',
    school: 'Colegio',
    teacher: 'Docente',
    grade: 'Grado',
    schoolYear: 'Año Escolar',
    scenario: 'Escenario',
    theme: 'Tema',
    formative: 'Formativa',
    summative: 'Sumativa',
    lesson: 'Lección',
    noDate: 'Sin fecha',
    minutes: 'min',
    // ... resto de traducciones
  },
  en: {
    // ... traducciones en inglés
  }
};

function t(key) { return i18n[currentLang][key] || key; }

// ===== 1. ESTRUCTURA DE DATOS ESPECÍFICA PARA MEDUCA =====

// Scenarios por grado según las imágenes
const MEDUCA_SCENARIOS = {
  '1': [
    { id: 'scenario_1', name_es: 'Scenario 1: All Week Long!', name_en: 'Scenario 1: All Week Long!' },
    { id: 'scenario_2', name_es: 'Scenario 2: Nice Weather Today!', name_en: 'Scenario 2: Nice Weather Today!' },
    { id: 'scenario_3', name_es: 'Scenario 3: Colors in Our World', name_en: 'Scenario 3: Colors in Our World' },
    { id: 'scenario_4', name_es: 'Scenario 4: My Family and I', name_en: 'Scenario 4: My Family and I' },
    { id: 'scenario_5', name_es: 'Scenario 5: Colors of Things that Go', name_en: 'Scenario 5: Colors of Things that Go' },
    { id: 'scenario_6', name_es: 'Scenario 6: Shapes Around Us', name_en: 'Scenario 6: Shapes Around Us' },
    { id: 'scenario_7', name_es: 'Scenario 7: Shapes on Our Plates', name_en: 'Scenario 7: Shapes on Our Plates' },
    { id: 'scenario_8', name_es: "Scenario 8: It's Our Garden", name_en: "Scenario 8: It's Our Garden" }
  ],
  '6': [
    { id: 'scenario_1', name_es: 'Escenario 1', name_en: 'Scenario 1' },
    { id: 'scenario_2', name_es: 'Escenario 2', name_en: 'Scenario 2' },
    { id: 'scenario_3', name_es: 'Escenario 3', name_en: 'Scenario 3' },
    { id: 'scenario_4', name_es: 'Escenario 4', name_en: 'Scenario 4' },
    { id: 'scenario_5', name_es: 'Escenario 5', name_en: 'Scenario 5' },
    { id: 'scenario_6', name_es: 'Escenario 6', name_en: 'Scenario 6' },
    { id: 'scenario_7', name_es: 'Escenario 7', name_en: 'Scenario 7' },
    { id: 'scenario_8', name_es: 'Escenario 8', name_en: 'Scenario 8' }
  ]
};

// Temas por scenario según las imágenes
const MEDUCA_THEMES = {
  'scenario_1': [
    { id: 'theme_1', name_es: 'Tema 1: Días de la semana', name_en: 'Theme 1: Days of the Week' },
    { id: 'theme_2', name_es: 'Tema 2: Actividades diarias', name_en: 'Theme 2: Daily Activities' }
  ],
  'scenario_2': [
    { id: 'theme_1', name_es: 'Tema 1: Tipos de clima', name_en: 'Theme 1: Weather Types' },
    { id: 'theme_2', name_es: 'Tema 2: Vestimenta apropiada', name_en: 'Theme 2: Appropriate Clothing' }
  ],
  'scenario_3': [
    { id: 'theme_1', name_es: 'Tema 1: Colores básicos', name_en: 'Theme 1: Basic Colors' },
    { id: 'theme_2', name_es: 'Tema 2: Objetos coloridos', name_en: 'Theme 2: Colorful Objects' }
  ],
  'scenario_4': [
    { id: 'theme_1', name_es: 'Tema 1: Miembros de la familia', name_en: 'Theme 1: Family Members' },
    { id: 'theme_2', name_es: 'Tema 2: Sentimientos familiares', name_en: 'Theme 2: Family Feelings' }
  ],
  'scenario_5': [
    { id: 'theme_1', name_es: 'Tema 1: Medios de transporte', name_en: 'Theme 1: Means of Transport' },
    { id: 'theme_2', name_es: 'Tema 2: Colores de vehículos', name_en: 'Theme 2: Vehicle Colors' }
  ],
  'scenario_6': [
    { id: 'theme_1', name_es: 'Tema 1: Formas geométricas', name_en: 'Theme 1: Geometric Shapes' },
    { id: 'theme_2', name_es: 'Tema 2: Formas en la naturaleza', name_en: 'Theme 2: Shapes in Nature' }
  ],
  'scenario_7': [
    { id: 'theme_1', name_es: 'Tema 1: Formas de alimentos', name_en: 'Theme 1: Food Shapes' },
    { id: 'theme_2', name_es: 'Tema 2: Comida saludable', name_en: 'Theme 2: Healthy Food' }
  ],
  'scenario_8': [
    { id: 'theme_1', name_es: 'Tema 1: Plantas del jardín', name_en: 'Theme 1: Garden Plants' },
    { id: 'theme_2', name_es: 'Tema 2: Cuidado del jardín', name_en: 'Theme 2: Garden Care' }
  ]
};

// ===== 2. FUNCIONES DE CARGA SIMPLIFICADAS =====

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
  try {
    // Primero intentar cargar desde archivo JSON
    let fileName = `data/grade_${gradeKey}.json`;
    console.log(`📂 Intentando cargar: ${fileName}`);
    
    const response = await fetch(fileName);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Datos cargados desde JSON para grado ${gradeKey}:`, data);
      return data;
    }
    
    // Si no hay archivo JSON, usar datos de ejemplo
    console.log(`ℹ️ No se encontró archivo JSON, usando datos de ejemplo para grado ${gradeKey}`);
    
    // Crear datos de ejemplo basados en las imágenes
    const exampleData = [];
    const scenarios = MEDUCA_SCENARIOS[gradeKey] || MEDUCA_SCENARIOS['1'];
    
    scenarios.forEach(scenario => {
      const themes = MEDUCA_THEMES[scenario.id] || [
        { id: 'theme_1', name_es: 'Tema 1', name_en: 'Theme 1' },
        { id: 'theme_2', name_es: 'Tema 2', name_en: 'Theme 2' }
      ];
      
      themes.forEach(theme => {
        exampleData.push({
          scenario_id: scenario.id,
          scenario_name_es: scenario.name_es,
          scenario_name_en: scenario.name_en,
          theme_id: theme.id,
          theme_name_es: theme.name_es,
          theme_name_en: theme.name_en,
          standards: {
            linguistic: `Estándar lingüístico para ${scenario.id} - ${theme.id}`,
            sociolinguistic: `Estándar sociolingüístico para ${scenario.id} - ${theme.id}`,
            pragmatic: `Estándar pragmático para ${scenario.id} - ${theme.id}`
          },
          learning_outcomes: {
            listening: `El estudiante podrá entender...`,
            speaking: `El estudiante podrá expresar...`,
            reading: `El estudiante podrá leer...`,
            writing: `El estudiante podrá escribir...`
          },
          communicative_competences: {
            oral: 'Competencia oral desarrollada',
            written: 'Competencia escrita desarrollada',
            interactive: 'Competencia interactiva desarrollada'
          },
          assessment_ideas: {
            formative: [
              'Observación en clase',
              'Preguntas y respuestas',
              'Actividades en parejas'
            ],
            summative: [
              'Prueba escrita',
              'Presentación oral',
              'Proyecto final'
            ]
          }
        });
      });
    });
    
    return exampleData;
    
  } catch (error) {
    console.warn("⚠️ Error cargando datos, usando datos de ejemplo:", error);
    
    // Datos de emergencia
    const emergencyData = [];
    for (let i = 1; i <= 8; i++) {
      emergencyData.push({
        scenario_id: `scenario_${i}`,
        scenario_name_es: `Escenario ${i}`,
        scenario_name_en: `Scenario ${i}`,
        theme_id: `theme_1`,
        theme_name_es: `Tema ${i}`,
        theme_name_en: `Theme ${i}`,
        standards: { basic: 'Estándar básico' },
        learning_outcomes: { basic: 'Resultado básico' }
      });
    }
    return emergencyData;
  }
}

// ===== 3. EXTRACCIÓN DE SCENARIOS CORREGIDA =====

function extractScenarios(data) {
  console.log("🔍 Extrayendo scenarios de:", data);
  
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn("⚠️ No hay datos para extraer scenarios");
    return [];
  }

  const scenariosMap = new Map();
  
  data.forEach((item, index) => {
    // Extraer información del scenario
    let scenarioId = item.scenario_id || 
                    item.scenario?.id || 
                    `scenario_${item.scenario_number || Math.floor(index / 2) + 1}`;
    
    let scenarioName = currentLang === 'es' 
      ? (item.scenario_name_es || item.scenario?.name_es || item.scenario_name || `Escenario ${scenarioId.split('_')[1]}`)
      : (item.scenario_name_en || item.scenario?.name_en || item.scenario_name || `Scenario ${scenarioId.split('_')[1]}`);
    
    // Extraer información del tema
    let themeId = item.theme_id || 
                 item.theme?.id || 
                 `theme_${item.theme_number || ((index % 2) + 1)}`;
    
    let themeName = currentLang === 'es'
      ? (item.theme_name_es || item.theme?.name_es || item.theme_name || `Tema ${themeId.split('_')[1]}`)
      : (item.theme_name_en || item.theme?.name_en || item.theme_name || `Theme ${themeId.split('_')[1]}`);
    
    // Agrupar por scenario
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
  
  // Ordenar por número de scenario
  scenarios.sort((a, b) => {
    const numA = parseInt(a.id.replace('scenario_', '')) || 0;
    const numB = parseInt(b.id.replace('scenario_', '')) || 0;
    return numA - numB;
  });
  
  console.log(`📊 Extraídos ${scenarios.length} scenarios:`);
  scenarios.forEach(s => {
    console.log(`  • ${s.name} (${s.themes.length} temas)`);
  });
  
  return scenarios;
}

// ===== 4. FUNCIONES DE INTERFAZ CORREGIDAS =====

function populateScenarios(scenarios) {
  const scenarioSelect = document.getElementById('scenario');
  if (!scenarioSelect) {
    console.error("❌ No se encontró el elemento #scenario");
    return;
  }

  scenarioSelect.innerHTML = `<option value="">${t('selectScenario')}</option>`;

  // Mostrar máximo 8 scenarios
  const scenariosToShow = scenarios.slice(0, 8);
  
  scenariosToShow.forEach(scenario => {
    const option = document.createElement('option');
    option.value = scenario.id;
    // CORRECCIÓN: Mostrar nombre completo del scenario
    option.textContent = scenario.name;
    scenarioSelect.appendChild(option);
  });
  
  console.log(`✅ ${scenariosToShow.length} scenarios cargados en el selector`);
}

function populateThemes(scenarioId) {
  const themeSelect = document.getElementById('theme');
  if (!themeSelect) {
    console.error("❌ No se encontró el elemento #theme");
    return;
  }

  themeSelect.innerHTML = `<option value="">${t('selectTheme')}</option>`;

  const scenario = currentScenarios.find(s => s.id === scenarioId);
  if (!scenario || !scenario.themes || scenario.themes.length === 0) {
    console.warn(`⚠️ No hay temas para el scenario ${scenarioId}`);
    
    // Intentar cargar temas predeterminados
    const defaultThemes = MEDUCA_THEMES[scenarioId];
    if (defaultThemes) {
      defaultThemes.forEach(theme => {
        const option = document.createElement('option');
        option.value = theme.id;
        option.textContent = currentLang === 'es' ? theme.name_es : theme.name_en;
        themeSelect.appendChild(option);
      });
      console.log(`✅ Temas predeterminados cargados para ${scenarioId}`);
    }
    return;
  }

  // Mostrar máximo 2 temas
  const themesToShow = scenario.themes.slice(0, 2);
  
  themesToShow.forEach(theme => {
    const option = document.createElement('option');
    option.value = theme.id;
    option.textContent = theme.name;
    themeSelect.appendChild(option);
    console.log(`  ✅ Tema disponible: ${theme.name}`);
  });
  
  console.log(`✅ ${themesToShow.length} temas cargados para ${scenario.name}`);
}

// ===== 5. GENERATE MARKDOWN PREVIEW CORREGIDO =====

function generateMarkdownPreview() {
  try {
    console.log("📝 Generando vista previa Markdown...");
    
    // Obtener datos del formulario
    const gradeSelect = document.getElementById('grade');
    const scenarioSelect = document.getElementById('scenario');
    const themeSelect = document.getElementById('theme');
    
    if (!gradeSelect || !scenarioSelect || !themeSelect) {
      throw new Error("No se encontraron los selectores del formulario");
    }
    
    const gradeKey = gradeSelect.value;
    const scenarioId = scenarioSelect.value;
    const themeId = themeSelect.value;
    
    if (!gradeKey || !scenarioId || !themeId) {
      throw new Error(t('errSelectAll'));
    }
    
    // Buscar datos
    const selectedScenario = currentScenarios.find(s => s.id === scenarioId);
    const selectedTheme = selectedScenario?.themes.find(t => t.id === themeId);
    
    if (!selectedTheme) {
      throw new Error(t('errThemeNotFound'));
    }
    
    // Recoger datos de las lecciones
    const lessons = [];
    for (let i = 1; i <= 5; i++) {
      const dateInput = document.querySelector(`#lesson-date-${i}`) || 
                       document.querySelectorAll('.lesson-date')[i-1];
      const timeInput = document.querySelector(`#lesson-time-${i}`) || 
                       document.querySelectorAll('.lesson-time')[i-1];
      
      lessons.push({
        number: i,
        date: dateInput?.value || '',
        time: timeInput?.value || '45'
      });
    }
    
    // Obtener datos institucionales
    const school = document.getElementById('school')?.value || 'CEBG Barrigón';
    const teacher = document.getElementById('teacher')?.value || 'José White';
    const year = document.getElementById('year')?.value || '2026';
    
    // Construir Markdown
    let md = `# Teacher English Lesson Plan\n\n`;
    
    md += `## 📋 Datos Institucionales\n`;
    md += `- **Colegio:** ${school}\n`;
    md += `- **Docente:** ${teacher}\n`;
    md += `- **Año Escolar:** ${year}\n`;
    md += `- **Grado:** ${gradeSelect.options[gradeSelect.selectedIndex].text}\n\n`;
    
    md += `## 🎯 Enfoque Curricular\n`;
    md += `- **Escenario:** ${selectedScenario.name}\n`;
    md += `- **Tema:** ${selectedTheme.name}\n\n`;
    
    md += `## 📅 Cronograma de Lecciones\n`;
    md += `| Lección | Fecha | Tiempo (min) |\n`;
    md += `|---------|-------|--------------|\n`;
    lessons.forEach(lesson => {
      md += `| Lección ${lesson.number} | ${lesson.date || 'Sin fecha'} | ${lesson.time} |\n`;
    });
    md += `\n`;
    
    // Añadir estándares si existen
    if (selectedTheme.item.standards) {
      md += `## 📚 Estándares Curriculares\n`;
      Object.entries(selectedTheme.item.standards).forEach(([key, value]) => {
        md += `- **${key}:** ${value}\n`;
      });
      md += `\n`;
    }
    
    // Añadir resultados de aprendizaje si existen
    if (selectedTheme.item.learning_outcomes) {
      md += `## 🎓 Resultados de Aprendizaje\n`;
      Object.entries(selectedTheme.item.learning_outcomes).forEach(([key, value]) => {
        md += `- **${key}:** ${value}\n`;
      });
      md += `\n`;
    }
    
    md += `---\n*Generado: ${new Date().toLocaleString()}*\n`;
    
    // Mostrar en el textarea
    const previewTextarea = document.getElementById('mdPreview');
    if (previewTextarea) {
      previewTextarea.value = md;
      previewTextarea.style.height = 'auto';
      previewTextarea.style.height = (previewTextarea.scrollHeight) + 'px';
      console.log("✅ Vista previa Markdown generada");
      alert("✅ Vista previa Markdown generada correctamente");
    } else {
      // Si no hay textarea, mostrar en alert
      console.log("✅ Markdown generado:", md);
      alert("✅ Markdown generado. Consola para ver el contenido.");
    }
    
  } catch (error) {
    console.error("❌ Error generando Markdown:", error);
    alert(`❌ Error: ${error.message}`);
  }
}

// ===== 6. FUNCIONES AUXILIARES =====

function generateLessonTable() {
  const lessonTable = document.getElementById('lessonTable');
  if (!lessonTable) {
    console.error("❌ No se encontró #lessonTable");
    return;
  }

  lessonTable.innerHTML = '';

  for (let i = 1; i <= 5; i++) {
    const row = document.createElement('tr');

    // Celda de lección
    const lessonCell = document.createElement('td');
    lessonCell.textContent = `${t('lesson')} ${i}`;
    row.appendChild(lessonCell);

    // Celda de fecha
    const dateCell = document.createElement('td');
    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.className = 'lesson-date';
    dateInput.id = `lesson-date-${i}`;
    dateCell.appendChild(dateInput);
    row.appendChild(dateCell);

    // Celda de tiempo
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
  
  console.log("✅ Tabla de 5 lecciones generada");
}

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
  
  let html = `<h3>${selectedScenario.name} - ${selectedTheme.name}</h3>`;
  
  if (raw.standards) {
    html += `<h4>${t('standardsTitle')}</h4><ul>`;
    Object.entries(raw.standards).forEach(([key, value]) => {
      html += `<li><strong>${key}:</strong> ${value}</li>`;
    });
    html += `</ul>`;
  }
  
  if (raw.learning_outcomes) {
    html += `<h4>${t('learningOutcomesTitle')}</h4><ul>`;
    Object.entries(raw.learning_outcomes).forEach(([key, value]) => {
      html += `<li><strong>${key}:</strong> ${value}</li>`;
    });
    html += `</ul>`;
  }
  
  panel.innerHTML = html;
}

// ===== 7. INICIALIZACIÓN CORREGIDA =====

document.addEventListener('DOMContentLoaded', function () {
  console.log("✅ DOM cargado - Iniciando aplicación corregida");

  // Inicializar componentes
  loadAvailableGrades();
  generateLessonTable();

  // Configurar event listeners
  const gradeSelect = document.getElementById('grade');
  const scenarioSelect = document.getElementById('scenario');
  const themeSelect = document.getElementById('theme');

  if (gradeSelect) {
    gradeSelect.addEventListener('change', async function () {
      const gradeKey = this.value;
      console.log(`🎓 Grado seleccionado: ${gradeKey}`);
      
      if (!gradeKey) {
        if (scenarioSelect) scenarioSelect.innerHTML = `<option value="">${t('selectScenario')}</option>`;
        if (themeSelect) themeSelect.innerHTML = `<option value="">${t('selectTheme')}</option>`;
        return;
      }

      try {
        console.log(`📥 Cargando datos para grado: ${gradeKey}`);
        currentData = await loadGradeData(gradeKey);

        if (!currentData || currentData.length === 0) {
          alert("⚠️ No hay datos disponibles para este grado");
          return;
        }

        currentScenarios = extractScenarios(currentData);

        if (currentScenarios.length === 0) {
          alert("⚠️ No se pudieron extraer los escenarios");
          return;
        }

        if (scenarioSelect) {
          populateScenarios(currentScenarios);
        }
        
        if (themeSelect) {
          themeSelect.innerHTML = `<option value="">${t('selectTheme')}</option>`;
        }

        console.log(`✅ ${currentScenarios.length} escenarios cargados`);
        
      } catch (error) {
        console.error("❌ Error:", error);
        alert(`❌ Error: ${error.message}`);
      }
    });
  }

  if (scenarioSelect) {
    scenarioSelect.addEventListener('change', function () {
      const scenarioId = this.value;
      console.log(`🎭 Escenario seleccionado: ${scenarioId}`);
      
      if (!scenarioId) {
        if (themeSelect) themeSelect.innerHTML = `<option value="">${t('selectTheme')}</option>`;
        return;
      }
      
      if (themeSelect) {
        populateThemes(scenarioId);
      }
      
      updateStandardsPanel();
    });
  }

  if (themeSelect) {
    themeSelect.addEventListener('change', function () {
      console.log(`🎨 Tema seleccionado: ${this.value}`);
      updateStandardsPanel();
    });
  }

  // Conectar botones
  const genPreviewBtn = document.getElementById('genPreview');
  if (genPreviewBtn) {
    genPreviewBtn.addEventListener('click', generateMarkdownPreview);
    console.log("✅ Botón 'Generate Preview Markdown' conectado");
  } else {
    console.error("❌ No se encontró el botón #genPreview");
  }

  // Conectar otros botones (manteniendo funciones originales)
  const buttons = {
    'exportThemeDOC': exportThemeDocx,
    'exportLessonDOC': exportLessonsDocx,
    'exportThemePDF': exportThemePDF,
    'exportLessonPDF': exportLessonsPDF,
    'themeToggle': function() {
      document.body.classList.toggle('dark-theme');
      this.textContent = document.body.classList.contains('dark-theme') 
        ? 'Modo claro' 
        : 'Modo oscuro';
    },
    'langToggle': function() {
      currentLang = currentLang === 'es' ? 'en' : 'es';
      loadAvailableGrades();
      if (currentData && currentData.length) {
        currentScenarios = extractScenarios(currentData);
        populateScenarios(currentScenarios);
      }
      this.textContent = currentLang === 'es' ? 'Switch to English' : 'Cambiar a Español';
    }
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

  console.log("🚀 Aplicación inicializada correctamente");
  
  // Cargar datos iniciales si hay un grado seleccionado por defecto
  if (gradeSelect && gradeSelect.value) {
    gradeSelect.dispatchEvent(new Event('change'));
  }
});

// ===== 8. FUNCIONES DE EXPORTACIÓN (mantener versiones originales corregidas) =====

// Las funciones exportThemeDocx, exportLessonsDocx, exportThemePDF, exportLessonsPDF
// se mantienen como en tu versión original, pero asegúrate de que:
// 1. Usen getCompletePlanData() (que necesita ser definida)
// 2. Manejen correctamente los datos de las imágenes

// Añadir esta función para compatibilidad
function getCompletePlanData() {
  // Similar a generateMarkdownPreview pero devuelve objeto estructurado
  const gradeSelect = document.getElementById('grade');
  const scenarioSelect = document.getElementById('scenario');
  const themeSelect = document.getElementById('theme');
  
  const gradeKey = gradeSelect.value;
  const scenarioId = scenarioSelect.value;
  const themeId = themeSelect.value;
  
  if (!gradeKey || !scenarioId || !themeId) {
    throw new Error(t('errSelectAll'));
  }
  
  const selectedScenario = currentScenarios.find(s => s.id === scenarioId);
  const selectedTheme = selectedScenario?.themes.find(t => t.id === themeId);
  
  // Recoger lecciones
  const lessons = [];
  for (let i = 1; i <= 5; i++) {
    const dateInput = document.querySelector(`#lesson-date-${i}`);
    const timeInput = document.querySelector(`#lesson-time-${i}`);
    lessons.push({
      number: i,
      date: dateInput?.value || '',
      time: timeInput?.value || '45'
    });
  }
  
  return {
    institutional: {
      school: document.getElementById('school')?.value || 'CEBG Barrigón',
      teacher: document.getElementById('teacher')?.value || 'José White',
      year: document.getElementById('year')?.value || '2026',
      term: document.getElementById('term')?.value || '1',
      weeklyHours: document.getElementById('weeklyHours')?.value || '3',
      weeks: document.getElementById('weeks')?.value || 'From week __ to week __',
      cefr: document.getElementById('cefr')?.value || 'Pre-A1 / A1 / A2',
      context: document.getElementById('context')?.value || 'Grupo de primaria panameña; recursos básicos.'
    },
    curricular: {
      grade: gradeSelect.options[gradeSelect.selectedIndex].text,
      scenario: selectedScenario.name,
      theme: selectedTheme.name,
      gradeKey: gradeKey
    },
    lessons: lessons,
    rawData: selectedTheme.item
  };
}