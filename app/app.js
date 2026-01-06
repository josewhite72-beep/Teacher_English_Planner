// app/app.js - VERSIÓN CORREGIDA PARA EL CURRÍCULO DE MEDUCA
console.log("🚀 Teacher English Planner - Versión corregida para 8 scenarios y 2 themes");

// ===== VARIABLES GLOBALES =====
let currentData = null;
let currentScenarios = [];
let currentLang = 'es';

// ===== I18N (MANTENIDO) =====
const i18n = {
  es: {
    selectGrade: 'Seleccionar Grado',
    selectScenario: 'Seleccionar Escenario',
    selectTheme: 'Seleccionar Tema',
    meducaHeader: "REPUBLICA DE PANAMA\nMINISTERIO DE EDUCACION - MEDUCA",
    themePlannerTitle: 'PLANEADOR DE TEMA',
    lessonsPlannerTitle: 'PLANIFICADOR DE LECCIONES',
    // ... (mantener todo el objeto i18n como está)
  },
  en: {
    // ... (mantener todo el objeto i18n como está)
  }
};

function t(key) { return i18n[currentLang][key] || key; }

// ===== 1. FUNCIONES DE CARGA CORREGIDAS =====

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
    let fileName = `grade_${gradeKey}.json`;
    if (gradeKey === 'pre-k') fileName = 'grade_pre-k.json';
    if (gradeKey === 'K') fileName = 'grade_K.json';

    console.log(`📂 Cargando datos para: ${gradeKey} desde: data/${fileName}`);
    
    const url = `data/${fileName}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Archivo no encontrado: ${fileName}`);
    }

    const data = await response.json();
    console.log(`✅ Datos cargados para ${gradeKey}:`, data);
    
    return normalizeGradeData(data);

  } catch (error) {
    console.error("Error cargando grado:", error);
    alert(`❌ Error cargando datos: ${error.message}`);
    return null;
  }
}

function normalizeGradeData(rawData) {
  // Si ya es un array, devolverlo
  if (Array.isArray(rawData)) {
    console.log("📊 Datos ya en formato array:", rawData.length, "elementos");
    return rawData;
  }

  // Si es objeto, buscar el array dentro
  if (rawData && typeof rawData === 'object') {
    // Prioridad: scenarios -> themes -> data -> lessons
    if (Array.isArray(rawData.scenarios)) {
      console.log("📊 Datos en formato scenarios:", rawData.scenarios.length, "scenarios");
      return rawData.scenarios;
    }
    if (Array.isArray(rawData.themes)) {
      console.log("📊 Datos en formato themes:", rawData.themes.length, "temas");
      return rawData.themes;
    }
    if (Array.isArray(rawData.data)) {
      console.log("📊 Datos en formato data:", rawData.data.length, "elementos");
      return rawData.data;
    }
    if (Array.isArray(rawData.lessons)) {
      console.log("📊 Datos en formato lessons:", rawData.lessons.length, "lecciones");
      return rawData.lessons;
    }
    
    // Si no tiene array, crear uno con el objeto
    console.log("📊 Datos como objeto único, convirtiendo a array");
    return [rawData];
  }

  console.warn("⚠️ Formato de datos desconocido:", rawData);
  return [];
}

// ===== 2. EXTRACCIÓN DE SCENARIOS CORREGIDA =====

function extractScenarios(data) {
  console.log("🔍 Extrayendo scenarios de:", data);
  
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn("⚠️ No hay datos para extraer scenarios");
    return [];
  }

  const scenariosMap = new Map();
  
  // CORRECCIÓN PRINCIPAL: Manejo correcto de estructura de datos
  data.forEach((item, index) => {
    let scenarioId, scenarioName;
    
    // Caso 1: Estructura específica para currículo Meduca (8 scenarios)
    if (item.scenario_id || item.scenario_number) {
      scenarioId = item.scenario_id || `scenario_${item.scenario_number || (index + 1)}`;
      scenarioName = item.scenario_name || 
                    item.name || 
                    (currentLang === 'es' ? item.name_es : item.name_en) ||
                    `Escenario ${item.scenario_number || (index + 1)}`;
    }
    // Caso 2: Estructura anidada { scenario: { id, name } }
    else if (item.scenario && typeof item.scenario === 'object') {
      scenarioId = item.scenario.id || `scenario_${index}`;
      scenarioName = (currentLang === 'es' ? item.scenario.name_es : item.scenario.name_en) ||
                     item.scenario.name_en || item.scenario.name_es ||
                     item.scenario.name || `Scenario ${index + 1}`;
    }
    // Caso 3: Escenario como string
    else if (typeof item.scenario === 'string') {
      scenarioId = `scenario_${index}`;
      scenarioName = item.scenario;
    }
    // Caso 4: Usar número de scenario si existe
    else if (item.scenario_number !== undefined) {
      scenarioId = `scenario_${item.scenario_number}`;
      scenarioName = `Escenario ${item.scenario_number}`;
    }
    // Caso 5: Último recurso
    else {
      // Para currículo Meduca con 8 scenarios fijos
      const scenarioNum = (index % 8) + 1;
      scenarioId = `scenario_${scenarioNum}`;
      scenarioName = `Escenario ${scenarioNum}`;
    }
    
    // Extraer información del tema
    let themeId, themeName;
    
    if (item.theme && typeof item.theme === 'object') {
      themeId = item.theme.id || item.theme.theme_id || `theme_${index}`;
      themeName = (currentLang === 'es' ? item.theme.name_es : item.theme.name_en) ||
                  item.theme.name_en || item.theme.name_es ||
                  item.theme.name || item.theme.title ||
                  (item.theme_number ? `Theme ${item.theme_number}` : `Tema ${index + 1}`);
    } else if (item.theme_id || item.theme_number) {
      themeId = item.theme_id || `theme_${item.theme_number}`;
      themeName = item.theme_name || `Theme ${item.theme_number}`;
    } else {
      themeId = `theme_${index}`;
      themeName = item.name || item.title || `Tema ${index + 1}`;
    }
    
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
    
    // Verificar si el tema ya existe en este scenario
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
  
  // Convertir Map a array y ordenar por ID de scenario
  const scenarios = Array.from(scenariosMap.values());
  
  // Ordenar por número de scenario si es posible
  scenarios.sort((a, b) => {
    const numA = parseInt(a.id.replace('scenario_', ''));
    const numB = parseInt(b.id.replace('scenario_', ''));
    return numA - numB;
  });
  
  console.log("📊 Scenarios extraídos:", scenarios.length, "scenarios");
  scenarios.forEach((s, i) => {
    console.log(`  ${i+1}. ${s.name} - ${s.themes.length} temas`);
  });
  
  return scenarios;
}

// ===== 3. FUNCIONES DE INTERFAZ CORREGIDAS =====

function populateScenarios(scenarios) {
  const scenarioSelect = document.getElementById('scenario');
  if (!scenarioSelect) return;

  scenarioSelect.innerHTML = `<option value="">${t('selectScenario')}</option>`;

  // Mostrar solo los 8 scenarios esperados (o menos si hay menos datos)
  const maxScenarios = Math.min(scenarios.length, 8);
  
  for (let i = 0; i < maxScenarios; i++) {
    const scenario = scenarios[i];
    const option = document.createElement('option');
    option.value = scenario.id;
    // Mostrar nombre completo del scenario (ej: "Scenario 1: My School")
    option.textContent = `${scenario.name}`;
    scenarioSelect.appendChild(option);
  }
  
  console.log(`✅ ${maxScenarios} scenarios cargados en el selector`);
}

function populateThemes(scenarioId) {
  const themeSelect = document.getElementById('theme');
  if (!themeSelect) return;

  themeSelect.innerHTML = `<option value="">${t('selectTheme')}</option>`;

  const scenario = currentScenarios.find(s => s.id === scenarioId);
  if (!scenario || !scenario.themes || scenario.themes.length === 0) {
    console.warn(`⚠️ No hay temas para el scenario ${scenarioId}`);
    return;
  }

  // Mostrar máximo 2 temas por scenario (como especifica el currículo)
  const maxThemes = Math.min(scenario.themes.length, 2);
  
  for (let i = 0; i < maxThemes; i++) {
    const theme = scenario.themes[i];
    const option = document.createElement('option');
    option.value = theme.id;
    option.textContent = theme.name;
    themeSelect.appendChild(option);
    console.log(`  ✅ Tema ${i+1}: ${theme.name}`);
  }
  
  console.log(`✅ ${maxThemes} temas cargados para scenario ${scenario.name}`);
}

function generateLessonTable() {
  const lessonTable = document.getElementById('lessonTable');
  if (!lessonTable) return;

  lessonTable.innerHTML = '';

  // Crear 5 lecciones por scenario
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
    timeInput.max = '120';
    timeCell.appendChild(timeInput);
    row.appendChild(timeCell);

    lessonTable.appendChild(row);
  }
  
  console.log("✅ Tabla de 5 lecciones generada");
}

// ===== 4. FUNCIÓN PARA OBTENER DATOS DEL PLAN CORREGIDA =====

function getCompletePlanData() {
  const gradeSelect = document.getElementById('grade');
  const scenarioSelect = document.getElementById('scenario');
  const themeSelect = document.getElementById('theme');

  const gradeKey = gradeSelect?.value;
  const scenarioId = scenarioSelect?.value;
  const themeId = themeSelect?.value;

  if (!gradeKey || !scenarioId || !themeId) {
    throw new Error(t('errSelectAll'));
  }

  const selectedScenario = currentScenarios.find(s => s.id === scenarioId);
  const selectedTheme = selectedScenario?.themes.find(t => t.id === themeId);

  if (!selectedTheme) {
    throw new Error(t('errThemeNotFound'));
  }

  // Recoger datos de las lecciones
  const lessons = [];
  for (let i = 1; i <= 5; i++) {
    const dateInput = document.getElementById(`lesson-date-${i}`);
    const timeInput = document.getElementById(`lesson-time-${i}`);
    
    lessons.push({
      number: i,
      date: dateInput?.value || '',
      time: timeInput?.value || '45'
    });
  }

  // Obtener datos institucionales del formulario
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

// ===== 5. FUNCIONES DE EXPORTACIÓN DOCX CORREGIDAS =====

async function exportThemeDocx() {
  try {
    console.log("📝 Iniciando exportación DOCX de Theme Planner...");
    const planData = getCompletePlanData();

    if (typeof window.docx === 'undefined') {
      console.error("❌ Librería docx no cargada");
      throw new Error(t('errDocxLib'));
    }

    const { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, ImageRun } = window.docx;
    
    const docChildren = [];

    // Logo
    const logoBuffer = await loadLogoAsArrayBuffer();
    if (logoBuffer) {
      docChildren.push(
        new Paragraph({
          children: [
            new ImageRun({
              data: logoBuffer,
              transformation: { width: 100, height: 100 },
            })
          ],
          alignment: AlignmentType.CENTER
        })
      );
    }

    // Encabezado MEDUCA
    docChildren.push(
      new Paragraph({
        children: [
          new TextRun({
            text: t('meducaHeader'),
            bold: true,
            size: 16,
          }),
        ],
        alignment: AlignmentType.CENTER,
      }),
      new Paragraph({ children: [new TextRun({ text: " " })] }),
      new Paragraph({ children: [new TextRun({ text: " " })] })
    );

    // Título del documento
    docChildren.push(
      new Paragraph({
        children: [new TextRun({ 
          text: t('themePlannerTitle'), 
          bold: true, 
          size: 28,
          color: "2c3e50"
        })],
        alignment: AlignmentType.CENTER,
        heading: HeadingLevel.TITLE,
      }),
      new Paragraph({ children: [new TextRun({ text: " " })] })
    );

    // Información institucional
    docChildren.push(
      new Paragraph({
        children: [new TextRun({ 
          text: t('institutionalInfo'), 
          bold: true,
          size: 20 
        })],
        heading: HeadingLevel.HEADING_1,
      })
    );

    docChildren.push(
      new Paragraph({
        children: [new TextRun({ 
          text: `${t('school')}: ${planData.institutional.school}`,
          bold: true
        })],
      }),
      new Paragraph({
        children: [new TextRun({ 
          text: `${t('teacher')}: ${planData.institutional.teacher}`
        })],
      }),
      new Paragraph({
        children: [new TextRun({ 
          text: `${t('grade')}: ${planData.curricular.grade}`
        })],
      }),
      new Paragraph({
        children: [new TextRun({ 
          text: `${t('schoolYear')}: ${planData.institutional.year}`
        })],
      })
    );

    // Información curricular
    docChildren.push(
      new Paragraph({
        children: [new TextRun({ text: " " })]
      }),
      new Paragraph({
        children: [new TextRun({ 
          text: t('curricularInfo'), 
          bold: true,
          size: 20 
        })],
        heading: HeadingLevel.HEADING_1,
      }),
      new Paragraph({
        children: [new TextRun({ 
          text: `${t('scenario')}: ${planData.curricular.scenario}`,
          bold: true
        })],
      }),
      new Paragraph({
        children: [new TextRun({ 
          text: `${t('theme')}: ${planData.curricular.theme}`,
          bold: true
        })],
      })
    );

    // Estándares curriculares
    if (planData.rawData.standards) {
      docChildren.push(
        new Paragraph({
          children: [new TextRun({ text: " " })]
        }),
        new Paragraph({
          children: [new TextRun({ 
            text: t('standardsTitle'), 
            bold: true,
            size: 18 
          })],
          heading: HeadingLevel.HEADING_2,
        })
      );

      Object.entries(planData.rawData.standards).forEach(([key, value]) => {
        docChildren.push(
          new Paragraph({
            children: [new TextRun({
              text: `• ${key}: ${Array.isArray(value) ? value.join('; ') : value}`,
              size: 12
            })],
          })
        );
      });
    }

    // Resultados de aprendizaje
    if (planData.rawData.learning_outcomes) {
      docChildren.push(
        new Paragraph({
          children: [new TextRun({ text: " " })]
        }),
        new Paragraph({
          children: [new TextRun({ 
            text: t('learningOutcomesTitle'), 
            bold: true,
            size: 18 
          })],
          heading: HeadingLevel.HEADING_2,
        })
      );

      Object.entries(planData.rawData.learning_outcomes).forEach(([key, value]) => {
        docChildren.push(
          new Paragraph({
            children: [new TextRun({
              text: `✓ ${value}`,
              size: 12
            })],
          })
        );
      });
    }

    // Competencias comunicativas
    if (planData.rawData.communicative_competences) {
      docChildren.push(
        new Paragraph({
          children: [new TextRun({ text: " " })]
        }),
        new Paragraph({
          children: [new TextRun({ 
            text: t('communicativeCompetencesTitle'), 
            bold: true,
            size: 18 
          })],
          heading: HeadingLevel.HEADING_2,
        })
      );

      Object.entries(planData.rawData.communicative_competences).forEach(([key, value]) => {
        const displayValue = typeof value === 'object' 
          ? Object.entries(value).map(([k, v]) => `${k}: ${v}`).join('; ')
          : value;
        
        docChildren.push(
          new Paragraph({
            children: [new TextRun({
              text: `• ${key}: ${displayValue}`,
              size: 12
            })],
          })
        );
      });
    }

    // Ideas de evaluación
    if (planData.rawData.assessment_ideas) {
      docChildren.push(
        new Paragraph({
          children: [new TextRun({ text: " " })]
        }),
        new Paragraph({
          children: [new TextRun({ 
            text: t('assessmentIdeasTitle'), 
            bold: true,
            size: 18 
          })],
          heading: HeadingLevel.HEADING_2,
        })
      );

      // Evaluación formativa
      if (planData.rawData.assessment_ideas.formative && 
          Array.isArray(planData.rawData.assessment_ideas.formative)) {
        docChildren.push(
          new Paragraph({
            children: [new TextRun({
              text: `${t('formative')}:`,
              bold: true,
              size: 14
            })],
          })
        );
        
        planData.rawData.assessment_ideas.formative.forEach(idea => {
          docChildren.push(
            new Paragraph({
              children: [new TextRun({
                text: `  ◦ ${idea}`,
                size: 12
              })],
            })
          );
        });
      }

      // Evaluación sumativa
      if (planData.rawData.assessment_ideas.summative && 
          Array.isArray(planData.rawData.assessment_ideas.summative)) {
        docChildren.push(
          new Paragraph({
            children: [new TextRun({
              text: `${t('summative')}:`,
              bold: true,
              size: 14
            })],
          })
        );
        
        planData.rawData.assessment_ideas.summative.forEach(idea => {
          docChildren.push(
            new Paragraph({
              children: [new TextRun({
                text: `  ◦ ${idea}`,
                size: 12
              })],
            })
          );
        });
      }
    }

    // Crear documento
    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: {
              top: 100,
              right: 100,
              bottom: 100,
              left: 100,
            }
          }
        },
        children: docChildren,
      }],
    });

    // Exportar
    const blob = await window.docx.Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Theme_Planner_${planData.curricular.grade}_${sanitizeFileName(planData.curricular.theme)}.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log("✅ Theme DOCX exportado correctamente");
    alert(`${t('themeDocOK')}: ${a.download}`);

  } catch (error) {
    console.error("❌ Error exportando Theme DOCX:", error);
    alert(`❌ Error exportando DOCX: ${error.message}`);
  }
}

// ===== 6. AYUDAS =====

async function loadLogoAsArrayBuffer() {
  try {
    const res = await fetch('assets/logo.png');
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch (e) {
    console.warn('⚠️ Logo no disponible:', e);
    return null;
  }
}

function sanitizeFileName(name) {
  return String(name || '').replace(/[^a-z0-9áéíóúñüÁÉÍÓÚÑÜ\s]/gi, '_').replace(/\s+/g, '_');
}

// ===== 7. INICIALIZACIÓN =====

document.addEventListener('DOMContentLoaded', function () {
  console.log("✅ DOM cargado - Iniciando aplicación corregida");

  // Inicializar componentes
  loadAvailableGrades();
  generateLessonTable();

  // Event listeners
  const gradeSelect = document.getElementById('grade');
  const scenarioSelect = document.getElementById('scenario');
  const themeSelect = document.getElementById('theme');

  if (gradeSelect) {
    gradeSelect.addEventListener('change', async function () {
      const gradeKey = this.value;
      if (!gradeKey) {
        scenarioSelect.innerHTML = `<option value="">${t('selectScenario')}</option>`;
        themeSelect.innerHTML = `<option value="">${t('selectTheme')}</option>`;
        document.getElementById('standardsPanel').innerHTML = '';
        return;
      }

      try {
        console.log(`📥 Cargando datos para grado: ${gradeKey}`);
        currentData = await loadGradeData(gradeKey);

        if (!currentData || currentData.length === 0) {
          alert(t('alertNoData'));
          return;
        }

        currentScenarios = extractScenarios(currentData);

        if (currentScenarios.length === 0) {
          alert(t('alertNoScenarios'));
          return;
        }

        populateScenarios(currentScenarios);
        themeSelect.innerHTML = `<option value="">${t('selectTheme')}</option>`;

        console.log(`✅ ${currentScenarios.length} scenarios cargados`);
        
      } catch (error) {
        console.error("❌ Error:", error);
        alert(`❌ Error: ${error.message}`);
      }
    });
  }

  if (scenarioSelect) {
    scenarioSelect.addEventListener('change', function () {
      const scenarioId = this.value;
      if (!scenarioId) {
        themeSelect.innerHTML = `<option value="">${t('selectTheme')}</option>`;
        return;
      }
      populateThemes(scenarioId);
      updateStandardsPanel();
    });
  }

  if (themeSelect) {
    themeSelect.addEventListener('change', updateStandardsPanel);
  }

  // Conectar botones de exportación (MANTENIENDO LAS FUNCIONES ORIGINALES)
  const buttons = {
    'genPreview': generateMarkdownPreview,
    'exportThemeDOC': exportThemeDocx,
    'exportLessonDOC': exportLessonsDocx,
    'exportThemePDF': exportThemePDF,
    'exportLessonPDF': exportLessonsPDF,
    // ... mantener los demás botones
  };

  for (const [id, handler] of Object.entries(buttons)) {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener('click', handler);
      console.log(`✅ Botón "${id}" conectado`);
    }
  }

  console.log("🚀 Aplicación inicializada correctamente");
});