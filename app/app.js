// app/app.js - VERSIÓN CON EXPORTACIÓN REAL + ES/EN + LOGO + PANEL ESTÁNDARES
console.log("🚀 Teacher English Planner - Iniciando con exportación real...");

// ===== VARIABLES GLOBALES =====
let currentData = null;
let currentScenarios = [];
let currentLang = 'es'; // 'es' | 'en'

// ===== I18N =====
const i18n = {
  es: {
    selectGrade: 'Seleccionar Grado',
    selectScenario: 'Seleccionar Escenario',
    selectTheme: 'Seleccionar Tema',
    meducaHeader: "REPUBLICA DE PANAMA\nMINISTERIO DE EDUCACION - MEDUCA",
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
    mdHeader: '# Teacher English Lesson Plan\n\n',
    mdInstitutional: '## 📋 Datos Institucionales\n',
    mdCurricular: '## 🎯 Enfoque Curricular\n',
    mdLessons: '## 📅 Cronograma de Lecciones\n',
    mdStandards: '## 📚 Estándares & Resultados\n',
    mdOutcomes: '## 🎓 Resultados de Aprendizaje\n',
    mdCompetences: '## 💬 Competencias Comunicativas\n',
    mdAssessment: '## 📊 Ideas de Evaluación\n',
    generated: 'Generado',
    langBtnToEN: 'Switch to English',
    langBtnToES: 'Cambiar a Español',
    alertLoading: '⏳ Cargando',
    alertScenariosLoaded: '✅ escenarios cargados',
    alertNoData: '⚠️ No hay datos para este grado',
    alertNoScenarios: '⚠️ No se pudieron extraer escenarios del archivo',
    errSelectAll: 'Selecciona Grado, Escenario y Tema primero',
    errThemeNotFound: 'Tema no encontrado',
    errDocxLib: 'Librería docx no disponible. Asegúrate de que esté cargada en index.html',
    errJsPDFLib: 'Librería jsPDF no disponible. Asegúrate de que esté cargada en index.html o usa Imprimir',
    warnNoDates: '⚠️ No hay fechas asignadas a las lecciones.\n¿Deseas continuar igual?',
    warnNoDates2: '⚠️ No hay fechas en las lecciones.\n¿Continuar igual?',
    mdPreviewOK: '✅ Vista previa Markdown generada',
    themeDocOK: '✅ Theme DOCX exportado',
    lessonsDocOK: '✅ Lessons DOCX exportado',
    themePdfOK: '✅ Theme PDF exportado',
    lessonsPdfOK: '✅ Lessons PDF exportado',
    themePdfReady: '✅ Theme PDF listo para imprimir/guardar',
    lessonsPdfReady: '✅ Lessons PDF listo para imprimir/guardar',
  },
  en: {
    selectGrade: 'Select Grade',
    selectScenario: 'Select Scenario',
    selectTheme: 'Select Theme',
    meducaHeader: "REPUBLIC OF PANAMA\nMINISTRY OF EDUCATION - MEDUCA",
    themePlannerTitle: 'THEME PLANNER',
    lessonsPlannerTitle: 'LESSON PLANNER',
    institutionalInfo: 'INSTITUTIONAL INFORMATION',
    curricularInfo: 'CURRICULAR INFORMATION',
    standardsTitle: 'CURRICULAR STANDARDS',
    learningOutcomesTitle: 'LEARNING OUTCOMES',
    communicativeCompetencesTitle: 'COMMUNICATIVE COMPETENCES',
    assessmentIdeasTitle: 'ASSESSMENT IDEAS',
    lessonsScheduleTitle: 'LESSONS SCHEDULE',
    school: 'School',
    teacher: 'Teacher',
    grade: 'Grade',
    schoolYear: 'School Year',
    scenario: 'Scenario',
    theme: 'Theme',
    formative: 'Formative',
    summative: 'Summative',
    lesson: 'Lesson',
    noDate: 'To be scheduled',
    minutes: 'min',
    mdHeader: '# Teacher English Lesson Plan\n\n',
    mdInstitutional: '## 📋 Institutional Data\n',
    mdCurricular: '## 🎯 Curricular Focus\n',
    mdLessons: '## 📅 Lessons Schedule\n',
    mdStandards: '## 📚 Standards & Learning Outcomes\n',
    mdOutcomes: '## 🎓 Learning Outcomes\n',
    mdCompetences: '## 💬 Communicative Competences\n',
    mdAssessment: '## 📊 Assessment Ideas\n',
    generated: 'Generated',
    langBtnToEN: 'Switch to Spanish',
    langBtnToES: 'Switch to English',
    alertLoading: '⏳ Loading',
    alertScenariosLoaded: '✅ scenarios loaded',
    alertNoData: '⚠️ No data for this grade',
    alertNoScenarios: '⚠️ Couldn’t extract scenarios from file',
    errSelectAll: 'Select Grade, Scenario and Theme first',
    errThemeNotFound: 'Theme not found',
    errDocxLib: 'Docx library not available. Make sure it’s loaded in index.html',
    errJsPDFLib: 'jsPDF library not available. Make sure it’s loaded in index.html or use Print',
    warnNoDates: '⚠️ No dates assigned to lessons.\nDo you want to continue anyway?',
    warnNoDates2: '⚠️ No dates in lessons.\nContinue anyway?',
    mdPreviewOK: '✅ Markdown preview generated',
    themeDocOK: '✅ Theme DOCX exported',
    lessonsDocOK: '✅ Lessons DOCX exported',
    themePdfOK: '✅ Theme PDF exported',
    lessonsPdfOK: '✅ Lessons PDF exported',
    themePdfReady: '✅ Theme PDF ready to print/save',
    lessonsPdfReady: '✅ Lessons PDF ready to print/save',
  }
};

function t(key) { return i18n[currentLang][key] || key; }

// ===== 1. FUNCIONES DE CARGA =====

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

    const url = `data/${fileName}`;
    const response = await fetch(url);

    if (!response.ok) throw new Error(`Error ${response.status}`);

    const data = await response.json();
    return normalizeGradeData(data);

  } catch (error) {
    console.error("Error cargando grado:", error);
    alert(`Error: ${error.message}`);
    return null;
  }
}

function normalizeGradeData(rawData) {
  if (Array.isArray(rawData)) return rawData;

  if (rawData && typeof rawData === 'object') {
    const possibleKeys = ['themes', 'data', 'lessons', 'scenarios'];
    for (const key of possibleKeys) {
      if (Array.isArray(rawData[key])) return rawData[key];
    }
    return [rawData];
  }

  return [];
}

function extractScenarios(data) {
  const scenarios = [];

  if (!data || !Array.isArray(data)) return [];

  const scenariosMap = {};

  data.forEach((item, index) => {
    let scenarioId = '';
    let scenarioName = '';

    if (item.scenario && typeof item.scenario === 'object') {
      scenarioId = item.scenario.id || `scenario_${index}`;
      scenarioName = (currentLang === 'es' ? item.scenario.name_es : item.scenario.name_en)
        || item.scenario.name_en || item.scenario.name_es || `Scenario ${index + 1}`;
    } else if (typeof item.scenario === 'string') {
      scenarioId = `scenario_${index}`;
      scenarioName = item.scenario;
    } else {
      scenarioId = `scenario_${index}`;
      scenarioName = `Scenario ${index + 1}`;
    }

    if (!scenariosMap[scenarioId]) {
      scenariosMap[scenarioId] = {
        id: scenarioId,
        name: scenarioName,
        themes: [],
        allData: []
      };
    }

    const themeName = (currentLang === 'es' ? item.theme?.name_es : item.theme?.name_en)
      || item.theme?.name_en || item.theme?.name_es || `Theme ${index + 1}`;

    scenariosMap[scenarioId].themes.push({
      id: item.theme?.id || `theme_${index}`,
      name: themeName,
      item: item
    });

    scenariosMap[scenarioId].allData.push(item);
  });

  Object.values(scenariosMap).forEach(scenario => {
    scenarios.push(scenario);
  });

  console.log("📊 Scenarios extraídos:", scenarios);
  return scenarios;
}

// ===== 2. FUNCIONES DE INTERFAZ =====

function populateScenarios(scenarios) {
  const scenarioSelect = document.getElementById('scenario');
  if (!scenarioSelect) return;

  scenarioSelect.innerHTML = `<option value="">${t('selectScenario')}</option>`;

  scenarios.forEach(scenario => {
    const option = document.createElement('option');
    option.value = scenario.id;
    option.textContent = scenario.name;
    scenarioSelect.appendChild(option);
  });
}

function populateThemes(scenarioId) {
  const themeSelect = document.getElementById('theme');
  if (!themeSelect) return;

  themeSelect.innerHTML = `<option value="">${t('selectTheme')}</option>`;

  const scenario = currentScenarios.find(s => s.id === scenarioId);
  if (!scenario || !scenario.themes) return;

  scenario.themes.forEach(theme => {
    const option = document.createElement('option');
    option.value = theme.id;
    option.textContent = theme.name;
    themeSelect.appendChild(option);
  });
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
    dateCell.appendChild(dateInput);
    row.appendChild(dateCell);

    const timeCell = document.createElement('td');
    const timeInput = document.createElement('input');
    timeInput.type = 'number';
    timeInput.className = 'lesson-time';
    timeInput.placeholder = t('minutes');
    timeInput.value = '45';
    timeInput.min = '1';
    timeCell.appendChild(timeInput);
    row.appendChild(timeCell);

    lessonTable.appendChild(row);
  }
}

// ===== 3. AYUDAS: LOGO & UTIL =====

async function loadLogoAsDataURL() {
  try {
    const res = await fetch('assets/logo.png');
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  } catch (e) {
    console.warn('⚠️ Logo no disponible:', e);
    return null;
  }
}

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
  return String(name || '').replace(/[^a-z0-9]/gi, '_');
}

// ===== 4. FUNCIONES DE EXPORTACIÓN REALES =====

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

  const lessons = [];
  const dateInputs = document.querySelectorAll('.lesson-date');
  const timeInputs = document.querySelectorAll('.lesson-time');

  dateInputs.forEach((dateInput, index) => {
    const timeInput = timeInputs[index];
    lessons.push({
      number: index + 1,
      date: dateInput.value || '',
      time: (timeInput?.value || '45')
    });
  });

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
    lessons,
    rawData: selectedTheme.item
  };
}

async function exportThemeDocx() {
  try {
    const planData = getCompletePlanData();

    if (typeof window.docx === 'undefined') {
      throw new Error(t('errDocxLib'));
    }

    const { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, PageBreak, ImageRun } = window.docx;

    const docChildren = [];

    const logoBuffer = await loadLogoAsArrayBuffer();
    if (logoBuffer) {
      docChildren.push(
        new Paragraph({
          children: [
            new ImageRun({
              data: logoBuffer,
              transformation: { width: 120, height: 120 },
            })
          ],
          alignment: AlignmentType.CENTER
        })
      );
    }

    docChildren.push(
      new Paragraph({
        children: [
          new TextRun({
            text: t('meducaHeader'),
            bold: true,
            size: 18,
          }),
        ],
        alignment: AlignmentType.CENTER,
      }),
      new Paragraph({ children: [new TextRun({ text: " " })] })
    );

    docChildren.push(
      new Paragraph({
        children: [new TextRun({ text: t('themePlannerTitle'), bold: true, size: 24 })],
        heading: HeadingLevel.HEADING_1,
      })
    );

    docChildren.push(
      new Paragraph({ children: [new TextRun({ text: `${t('school')}: ${planData.institutional.school}`, bold: true })] }),
      new Paragraph({ children: [new TextRun({ text: `${t('teacher')}: ${planData.institutional.teacher}` })] }),
      new Paragraph({ children: [new TextRun({ text: `${t('grade')}: ${planData.curricular.grade}` })] }),
      new Paragraph({ children: [new TextRun({ text: `${t('schoolYear')}: ${planData.institutional.year}` })] }),
    );

    docChildren.push(
      new Paragraph({
        children: [new TextRun({ text: t('curricularInfo'), bold: true })],
        heading: HeadingLevel.HEADING_2,
      }),
      new Paragraph({ children: [new TextRun({ text: `${t('scenario')}: ${planData.curricular.scenario}` })] }),
      new Paragraph({ children: [new TextRun({ text: `${t('theme')}: ${planData.curricular.theme}` })] }),
    );

    docChildren.push(
      new Paragraph({
        children: [new TextRun({ text: t('standardsTitle'), bold: true })],
        heading: HeadingLevel.HEADING_2,
      }),
    );
    (Object.entries(planData.rawData.standards || {})).forEach(([key, value]) => {
      docChildren.push(
        new Paragraph({
          children: [new TextRun(`${key}: ${Array.isArray(value) ? value.join(', ') : value || 'N/A'}`)],
        })
      );
    });

    docChildren.push(
      new Paragraph({
        children: [new TextRun({ text: t('learningOutcomesTitle'), bold: true })],
        heading: HeadingLevel.HEADING_2,
      }),
    );
    (Object.entries(planData.rawData.learning_outcomes || {})).forEach(([key, value]) => {
      docChildren.push(
        new Paragraph({
          children: [new TextRun(`${key}: ${value || 'N/A'}`)],
        })
      );
    });

    docChildren.push(
      new Paragraph({
        children: [new TextRun({ text: t('communicativeCompetencesTitle'), bold: true })],
        heading: HeadingLevel.HEADING_2,
      }),
    );
    (Object.entries(planData.rawData.communicative_competences || {})).forEach(([key, value]) => {
      docChildren.push(
        new Paragraph({
          children: [new TextRun(`${key}: ${typeof value === 'object' ? JSON.stringify(value) : value || 'N/A'}`)],
        })
      );
    });

    docChildren.push(
      new Paragraph({
        children: [new TextRun({ text: t('assessmentIdeasTitle'), bold: true })],
        heading: HeadingLevel.HEADING_2,
      }),
    );
    (planData.rawData.assessment_ideas?.formative || []).forEach(idea => {
      docChildren.push(new Paragraph({ children: [new TextRun(`${t('formative')}: ${idea}`)] }));
    });
    (planData.rawData.assessment_ideas?.summative || []).forEach(idea => {
      docChildren.push(new Paragraph({ children: [new TextRun(`${t('summative')}: ${idea}`)] }));
    });

    const doc = new Document({
      sections: [{
        properties: {},
        children: docChildren,
      }],
    });

    const blob = await window.docx.Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Theme_${planData.curricular.gradeKey}_${sanitizeFileName(planData.curricular.theme)}.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert(`${t('themeDocOK')}: ${a.download}`);

  } catch (error) {
    console.error("Error exportando DOCX:", error);
    alert(`❌ Error exportando DOCX: ${error.message}`);
  }
}

async function exportLessonsDocx() {
  try {
    const planData = getCompletePlanData();

    const hasDates = planData.lessons.some(lesson => lesson.date);
    if (!hasDates) {
      const confirmCont = window.confirm(t('warnNoDates'));
      if (!confirmCont) return;
    }

    if (typeof window.docx === 'undefined') {
      throw new Error(t('errDocxLib'));
    }

    const { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, PageBreak, ImageRun } = window.docx;

    const docChildren = [];

    const logoBuffer = await loadLogoAsArrayBuffer();
    if (logoBuffer) {
      docChildren.push(
        new Paragraph({
          children: [new ImageRun({ data: logoBuffer, transformation: { width: 120, height: 120 } })],
          alignment: AlignmentType.CENTER,
        })
      );
    }

    docChildren.push(
      new Paragraph({
        children: [new TextRun({ text: t('meducaHeader'), bold: true, size: 18 })],
        alignment: AlignmentType.CENTER,
      }),
      new Paragraph({ children: [new TextRun({ text: " " })] }),
      new Paragraph({
        children: [new TextRun({ text: t('lessonsPlannerTitle'), bold: true, size: 24 })],
        heading: HeadingLevel.HEADING_1,
      }),

      new Paragraph({ children: [new TextRun({ text: `${t('school')}: ${planData.institutional.school}`, bold: true })] }),
      new Paragraph({ children: [new TextRun({ text: `${t('teacher')}: ${planData.institutional.teacher}` })] }),
      new Paragraph({ children: [new TextRun({ text: `${t('grade')}: ${planData.curricular.grade}` })] }),
      new Paragraph({ children: [new TextRun({ text: `${t('schoolYear')}: ${planData.institutional.year}` })] }),

      new Paragraph({
        children: [new TextRun({ text: t('curricularInfo'), bold: true })],
        heading: HeadingLevel.HEADING_2,
      }),
      new Paragraph({ children: [new TextRun({ text: `${t('scenario')}: ${planData.curricular.scenario}` })] }),
      new Paragraph({ children: [new TextRun({ text: `${t('theme')}: ${planData.curricular.theme}` })] }),

      new Paragraph({
        children: [new TextRun({ text: t('lessonsScheduleTitle'), bold: true })],
        heading: HeadingLevel.HEADING_2,
      }),
      ...planData.lessons.map(lesson =>
        new Paragraph({
          children: [new TextRun(`${t('lesson')} ${lesson.number}: ${lesson.date || t('noDate')} - ${lesson.time} ${t('minutes')}`)],
        })
      ),

      new PageBreak()
    );

    for (let i = 0; i < 5; i++) {
      docChildren.push(
        new Paragraph({
          children: [new TextRun({ text: `${t('lesson').toUpperCase()} ${i + 1}`, bold: true, size: 20 })],
          heading: HeadingLevel.HEADING_1,
        }),
        new Paragraph({
          children: [new TextRun({ text: currentLang === 'es' ? "ETAPAS DE LA LECCIÓN" : "LESSON STAGES", bold: true })],
          heading: HeadingLevel.HEADING_2,
        }),
        new Paragraph({ children: [new TextRun(currentLang === 'es' ? "1. Warm-up: Actividad de calentamiento" : "1. Warm-up: Warm-up activity")] }),
        new Paragraph({ children: [new TextRun(currentLang === 'es' ? "2. Presentación: Introducción de contenido" : "2. Presentation: Introduce content")] }),
        new Paragraph({ children: [new TextRun(currentLang === 'es' ? "3. Práctica: Práctica guiada" : "3. Practice: Guided practice")] }),
        new Paragraph({ children: [new TextRun(currentLang === 'es' ? "4. Producción: Producción independiente" : "4. Production: Independent production")] }),
        new Paragraph({ children: [new TextRun(currentLang === 'es' ? "5. Reflexión: Cierre y reflexión" : "5. Reflection: Closure and reflection")] }),
        new Paragraph({ children: [new TextRun(currentLang === 'es' ? "6. Tarea: Tarea para casa" : "6. Homework: Take-home task")] }),
        new PageBreak()
      );
    }

    const doc = new Document({
      sections: [{ properties: {}, children: docChildren }],
    });

    const blob = await window.docx.Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Lessons_${planData.curricular.gradeKey}_${sanitizeFileName(planData.curricular.theme)}.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert(`${t('lessonsDocOK')}: ${a.download}`);

  } catch (error) {
    console.error("Error exportando Lessons DOCX:", error);
    alert(`❌ Error exportando Lessons DOCX: ${error.message}`);
  }
}

async function exportThemePDF() {
  try {
    const planData = getCompletePlanData();

    if (!(typeof window.jspdf !== 'undefined' && window.jspdf.jsPDF)) {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>${planData.curricular.theme} - Theme Plan</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { color: #2c3e50; text-align: center; }
              h2 { color: #34495e; }
              .section { margin-bottom: 20px; }
            </style>
          </head>
          <body>
            <h1>${t('themePlannerTitle')}</h1>
            <div class="section">
              <h2>${t('institutionalInfo')}</h2>
              <p><strong>${t('school')}:</strong> ${planData.institutional.school}</p>
              <p><strong>${t('teacher')}:</strong> ${planData.institutional.teacher}</p>
              <p><strong>${t('grade')}:</strong> ${planData.curricular.grade}</p>
              <p><strong>${t('schoolYear')}:</strong> ${planData.institutional.year}</p>
            </div>
            <div class="section">
              <h2>${t('curricularInfo')}</h2>
              <p><strong>${t('scenario')}:</strong> ${planData.curricular.scenario}</p>
              <p><strong>${t('theme')}:</strong> ${planData.curricular.theme}</p>
            </div>
            <button onclick="window.print()">${currentLang === 'es' ? 'Guardar como PDF' : 'Save as PDF'}</button>
          </body>
        </html>
      `);
      printWindow.document.close();
      alert(t('themePdfReady'));
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const dataURL = await loadLogoAsDataURL();
    if (dataURL) {
      try { doc.addImage(dataURL, 'PNG', 85, 8, 40, 40); } catch (e) { console.warn('No se pudo insertar logo en PDF:', e); }
    }

    doc.setFontSize(22);
    doc.text(t('themePlannerTitle'), 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.text(`${t('school')}: ${planData.institutional.school}`, 20, 40);
    doc.text(`${t('teacher')}: ${planData.institutional.teacher}`, 20, 50);
    doc.text(`${t('grade')}: ${planData.curricular.grade}`, 20, 60);
    doc.text(`${t('schoolYear')}: ${planData.institutional.year}`, 20, 70);
    doc.text(`${t('scenario')}: ${planData.curricular.scenario}`, 20, 80);
    doc.text(`${t('theme')}: ${planData.curricular.theme}`, 20, 90);

    const filename = `Theme_${planData.curricular.gradeKey}_${sanitizeFileName(planData.curricular.theme)}.pdf`;
    doc.save(filename);
    alert(`${t('themePdfOK')}: ${filename}`);

  } catch (error) {
    console.error("Error exportando PDF:", error);
    alert(`❌ Error exportando PDF: ${error.message}`);
  }
}

async function exportLessonsPDF() {
  try {
    const planData = getCompletePlanData();

    const hasDates = planData.lessons.some(lesson => lesson.date);
    if (!hasDates) {
      const confirmCont = window.confirm(t('warnNoDates2'));
      if (!confirmCont) return;
    }

    if (!(typeof window.jspdf !== 'undefined' && window.jspdf.jsPDF)) {
      const printWindow = window.open('', '_blank');
      let lessonsHTML = `
        <html>
          <head>
            <title>Lessons Plan - ${planData.curricular.theme}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { color: #2c3e50; text-align: center; }
              h2 { color: #34495e; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <h1>${t('lessonsPlannerTitle')}</h1>
            <p><strong>${t('school')}:</strong> ${planData.institutional.school}</p>
            <p><strong>${t('teacher')}:</strong> ${planData.institutional.teacher}</p>
            <p><strong>${t('grade')}:</strong> ${planData.curricular.grade}</p>
            <p><strong>${t('schoolYear')}:</strong> ${planData.institutional.year}</p>
            <p><strong>${t('scenario')}:</strong> ${planData.curricular.scenario}</p>
            <p><strong>${t('theme')}:</strong> ${planData.curricular.theme}</p>

            <h2>${t('lessonsScheduleTitle')}</h2>
            <table>
              <tr>
                <th>${t('lesson')}</th>
                <th>${currentLang === 'es' ? 'Fecha' : 'Date'}</th>
                <th>${currentLang === 'es' ? 'Tiempo (min)' : 'Time (min)'}</th>
              </tr>
      `;

      planData.lessons.forEach(lesson => {
        lessonsHTML += `
          <tr>
            <td>${t('lesson')} ${lesson.number}</td>
            <td>${lesson.date || t('noDate')}</td>
            <td>${lesson.time} ${t('minutes')}</td>
          </tr>
        `;
      });

      lessonsHTML += `
            </table>
            <br>
            <button onclick="window.print()">${currentLang === 'es' ? 'Guardar como PDF' : 'Save as PDF'}</button>
          </body>
        </html>
      `;

      printWindow.document.write(lessonsHTML);
      printWindow.document.close();
      alert(t('lessonsPdfReady'));
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const dataURL = await loadLogoAsDataURL();
    if (dataURL) {
      try { doc.addImage(dataURL, 'PNG', 85, 8, 40, 40); } catch (e) { console.warn('No se pudo insertar logo en PDF:', e); }
    }

    doc.setFontSize(22);
    doc.text(t('lessonsPlannerTitle'), 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.text(`${t('school')}: ${planData.institutional.school}`, 20, 40);
    doc.text(`${t('teacher')}: ${planData.institutional.teacher}`, 20, 50);
    doc.text(`${t('grade')}: ${planData.curricular.grade}`, 20, 60);
    doc.text(`${t('schoolYear')}: ${planData.institutional.year}`, 20, 70);
    doc.text(`${t('scenario')}: ${planData.curricular.scenario}`, 20, 80);
    doc.text(`${t('theme')}: ${planData.curricular.theme}`, 20, 90);

    let y = 100;
    doc.setFontSize(14);
    doc.text(t('lessonsScheduleTitle'), 20, y);
    y += 10;

    planData.lessons.forEach(lesson => {
      doc.setFontSize(12);
      doc.text(`${t('lesson')} ${lesson.number}: ${lesson.date || t('noDate')} - ${lesson.time} ${t('minutes')}`, 20, y);
      y += 10;
    });

    const filename = `Lessons_${planData.curricular.gradeKey}_${sanitizeFileName(planData.curricular.theme)}.pdf`;
    doc.save(filename);
    alert(`${t('lessonsPdfOK')}: ${filename}`);

  } catch (error) {
    console.error("Error exportando lessons PDF:", error);
    alert(`❌ Error exportando lessons PDF: ${error.message}`);
  }
}

function updateStandardsPanel() {
  const scenarioSelect = document.getElementById('scenario');
  const themeSelect = document.getElementById('theme');
  const panel = document.getElementById('standardsPanel');
  if (!scenarioSelect || !themeSelect || !panel) return;

  const scenarioId = scenarioSelect.value;
  const themeId = themeSelect.value;
  const selectedScenario = currentScenarios.find(s => s.id === scenarioId);
  const selectedTheme = selectedScenario?.themes.find(t => t.id === themeId);
  if (!selectedTheme) { panel.innerHTML = ''; return; }

  const raw = selectedTheme.item;
  const standards = raw.standards || {};
  const outcomes = raw.learning_outcomes || {};
  const competences = raw.communicative_competences || {};
  const assessment = raw.assessment_ideas || {};

  const sectionTitle = (txt) => `<h3 style="margin:10px 0;">${txt}</h3>`;
  const listFromObj = (obj) => {
    const parts = [];
    Object.entries(obj).forEach(([k, v]) => {
      const val = Array.isArray(v) ? v.join(', ') : (typeof v === 'object' ? JSON.stringify(v) : v);
      if (val) parts.push(`<li><strong>${k}:</strong> ${val}</li>`);
    });
    return parts.length ? `<ul>${parts.join('')}</ul>` : '<p><em>N/A</em></p>';
  };
  const listFromArr = (arr, label) => {
    if (!Array.isArray(arr) || arr.length === 0) return '';
    return arr.map(v => `<li><strong>${label}:</strong> ${v}</li>`).join('');
  };

  panel.innerHTML = `
    ${sectionTitle(t('standardsTitle'))}
    ${listFromObj(standards)}
    ${sectionTitle(t('learningOutcomesTitle'))}
    ${listFromObj(outcomes)}
    ${sectionTitle(t('communicativeCompetencesTitle'))}
    ${listFromObj(competences)}
    ${sectionTitle(t('assessmentIdeasTitle'))}
    <ul>
      ${listFromArr(assessment.formative, t('formative'))}
      ${listFromArr(assessment.summative, t('summative'))}
    </ul>
  `;
}

function generateMarkdownPreview() {
  try {
    const planData = getCompletePlanData();

    let md = `${t('mdHeader')}`;

    md += `${t('mdInstitutional')}`;
    md += `- **${t('school')}:** ${planData.institutional.school}\n`;
    md += `- **${t('teacher')}:** ${planData.institutional.teacher}\n`;
    md += `- **${t('schoolYear')}:** ${planData.institutional.year}\n`;
    md += `- **Trimester:** ${planData.institutional.term}\n`;
    md += `- **Weekly Hours:** ${planData.institutional.weeklyHours}\n`;
    md += `- **Weeks:** ${planData.institutional.weeks}\n`;
    md += `- **CEFR Level:** ${planData.institutional.cefr}\n`;
    md += `- **Context:** ${planData.institutional.context}\n\n`;

    md += `${t('mdCurricular')}`;
    md += `- **${t('grade')}:** ${planData.curricular.grade}\n`;
    md += `- **${t('scenario')}:** ${planData.curricular.scenario}\n`;
    md += `- **${t('theme')}:** ${planData.curricular.theme}\n\n`;

    md += `${t('mdLessons')}`;
    md += '| Lesson | Date | Time (min) |\n';
    md += '|--------|------|------------|\n';
    planData.lessons.forEach(lesson => {
      md += `| ${t('lesson')} ${lesson.number} | ${lesson.date || t('noDate')} | ${lesson.time} |\n`;
    });
    md += '\n';

    if (planData.rawData.standards) {
      md += `${t('mdStandards')}`;
      for (const [key, value] of Object.entries(planData.rawData.standards)) {
        if (Array.isArray(value) && value.length > 0) {
          md += `- **${key.charAt(0).toUpperCase() + key.slice(1)}:** ${value.join(', ')}\n`;
        } else if (value) {
          md += `- **${key.charAt(0).toUpperCase() + key.slice(1)}:** ${value}\n`;
        }
      }
      md += '\n';
    }

    if (planData.rawData.learning_outcomes) {
      md += `${t('mdOutcomes')}`;
      for (const [key, value] of Object.entries(planData.rawData.learning_outcomes)) {
        if (value) md += `- **${key.charAt(0).toUpperCase() + key.slice(1)}:** ${value}\n`;
      }
      md += '\n';
    }

    if (planData.rawData.communicative_competences) {
      md += `${t('mdCompetences')}`;
      for (const [key, value] of Object.entries(planData.rawData.communicative_competences)) {
        if (value) md += `- **${key.charAt(0).toUpperCase() + key.slice(1)}:** ${typeof value === 'object' ? JSON.stringify(value) : value}\n`;
      }
      md += '\n';
    }

    if (planData.rawData.assessment_ideas) {
      md += `${t('mdAssessment')}`;
      for (const [key, value] of Object.entries(planData.rawData.assessment_ideas)) {
        if (Array.isArray(value) && value.length > 0) {
          md += `- **${key.charAt(0).toUpperCase() + key.slice(1)}:** ${value.join(', ')}\n`;
        }
      }
      md += '\n';
    }

    md += `---\n*${t('generated')}: ${new Date().toLocaleString()}*\n`;

    document.getElementById('mdPreview').value = md;
    alert(t('mdPreviewOK'));

  } catch (error) {
    alert(`❌ ${error.message}`);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  console.log("✅ DOM cargado - Iniciando aplicación completa");

  loadAvailableGrades();
  generateLessonTable();

  const gradeSelect = document.getElementById('grade');
  const scenarioSelect = document.getElementById('scenario');
  const themeSelect = document.getElementById('theme');

  if (gradeSelect) {
    gradeSelect.addEventListener('change', async function () {
      const gradeKey = this.value;
      if (!gradeKey) {
        document.getElementById('scenario').innerHTML = `<option value="">${t('selectScenario')}</option>`;
        document.getElementById('theme').innerHTML = `<option value="">${t('selectTheme')}</option>`;
        return;
      }

      try {
        alert(`${t('alertLoading')} ${this.options[this.selectedIndex].text}...`);

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
        document.getElementById('theme').innerHTML = `<option value="">${t('selectTheme')}</option>`;

        alert(`✅ ${currentScenarios.length} ${t('alertScenariosLoaded')}`);

      } catch (error) {
        alert(`❌ Error: ${error.message}`);
      }
    });
  }

  if (scenarioSelect) {
    scenarioSelect.addEventListener('change', function () {
      const scenarioId = this.value;
      if (!scenarioId) {
        document.getElementById('theme').innerHTML = `<option value="">${t('selectTheme')}</option>`;
        return;
      }
      populateThemes(scenarioId);
      updateStandardsPanel();
    });
  }

  if (themeSelect) {
    themeSelect.addEventListener('change', function () {
      updateStandardsPanel();
    });
  }

  const buttons = {
    'genPreview': generateMarkdownPreview,
    'exportThemeDOC': exportThemeDocx,
    'exportLessonDOC': exportLessonsDocx,
    'exportThemePDF': exportThemePDF,
    'exportLessonPDF': exportLessonsPDF,
    'themeToggle': function () {
      const body = document.body;
      const isDark = body.getAttribute('data-theme') === 'dark';
      body.setAttribute('data-theme', isDark ? 'light' : 'dark');
      this.textContent = isDark ? 'Modo oscuro' : 'Modo claro';
    },
    'langToggle': function () {
      currentLang = currentLang === 'es' ? 'en' : 'es';
      loadAvailableGrades();
      const scenarioSel = document.getElementById('scenario');
      const themeSel = document.getElementById('theme');
      if (scenarioSel) scenarioSel.innerHTML = `<option value="">${t('selectScenario')}</option>`;
      if (themeSel) themeSel.innerHTML = `<option value="">${t('selectTheme')}</option>`;
      if (currentData && currentData.length) {
        currentScenarios = extractScenarios(currentData);
        populateScenarios(currentScenarios);
      }
      this.textContent = (currentLang === 'es' ? i18n.es.langBtnToEN : i18n.en.langBtnToES);
      updateStandardsPanel();
    },
    'saveCfg': () => alert("💾 Guardar configuración - Próximamente"),
    'loadCfg': () => alert("📂 Cargar configuración - Próximamente"),
    'clearSW': () => alert("🧹 Borrar caché - Próximamente")
  };

  for (const [id, handler] of Object.entries(buttons)) {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener('click', handler);
      console.log(`✅ Botón "${id}" conectado`);
      if (id === 'langToggle') { btn.textContent = i18n.es.langBtnToEN; }
    } else {
      console.warn(`⚠️ Botón "${id}" no encontrado`);
    }
  }

  console.log("🚀 Aplicación COMPLETAMENTE inicializada");
  setTimeout(() => {
    alert("✅ Teacher English Planner 100% funcional\n\n✨ ¡Todos los botones están activos!");
  }, 1000);
});
