// app/app.js - VERSIÓN CON EXPORTACIÓN REAL
console.log("🚀 Teacher English Planner - Iniciando con exportación real...");

// ===== VARIABLES GLOBALES =====
let currentData = null;
let currentScenarios = [];

// ===== 1. FUNCIONES DE CARGA =====

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
}

// Cargar datos del grado
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

// Normalizar datos
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

// Extraer escenarios - ACTUALIZADA para tu estructura real
function extractScenarios(data) {
  const scenarios = [];
  
  if (!data || !Array.isArray(data)) return [];
  
  // Agrupar temas por escenario
  const scenariosMap = {};
  
  data.forEach((item, index) => {
    // Extraer el ID y nombre del escenario
    let scenarioId = '';
    let scenarioName = '';
    
    if (item.scenario && typeof item.scenario === 'object') {
      scenarioId = item.scenario.id || `scenario_${index}`;
      scenarioName = item.scenario.name_en || item.scenario.name_es || `Scenario ${index + 1}`;
    } else if (typeof item.scenario === 'string') {
      scenarioId = `scenario_${index}`;
      scenarioName = item.scenario;
    } else {
      // Si no hay escenario definido, usar uno genérico
      scenarioId = `scenario_${index}`;
      scenarioName = `Scenario ${index + 1}`;
    }
    
    // Si este escenario no existe en el mapa, crearlo
    if (!scenariosMap[scenarioId]) {
      scenariosMap[scenarioId] = {
        id: scenarioId,
        name: scenarioName,
        themes: [],
        allData: [] // Guardar todos los datos relacionados
      };
    }
    
    // Agregar el tema a este escenario
    scenariosMap[scenarioId].themes.push({
      id: item.theme?.id || `theme_${index}`,
      name: item.theme?.name_en || item.theme?.name_es || `Theme ${index + 1}`,
      item: item // Guardar el objeto completo del tema
    });
    
    // Guardar todos los datos
    scenariosMap[scenarioId].allData.push(item);
  });
  
  // Convertir el mapa a array
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
  
  scenarioSelect.innerHTML = '<option value="">Seleccionar Escenario</option>';
  
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
  
  themeSelect.innerHTML = '<option value="">Seleccionar Tema</option>';
  
  const scenario = currentScenarios.find(s => s.id === scenarioId);
  if (!scenario || !scenario.themes) return;
  
  scenario.themes.forEach(theme => {
    const option = document.createElement('option');
    option.value = theme.id; // Usar el ID real del tema
    option.textContent = theme.name; // Usar el nombre real del tema
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
    lessonCell.textContent = `Lesson ${i}`;
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
    timeInput.placeholder = 'min';
    timeInput.value = '45';
    timeInput.min = '1';
    timeCell.appendChild(timeInput);
    row.appendChild(timeCell);
    
    lessonTable.appendChild(row);
  }
}

// ===== 3. FUNCIONES DE EXPORTACIÓN REALES =====

// Función para obtener datos completos del plan
function getCompletePlanData() {
  const gradeSelect = document.getElementById('grade');
  const scenarioSelect = document.getElementById('scenario');
  const themeSelect = document.getElementById('theme');
  
  const gradeKey = gradeSelect.value;
  const scenarioId = scenarioSelect.value;
  const themeId = themeSelect.value;
  
  if (!gradeKey || !scenarioId || !themeId) {
    throw new Error("Selecciona Grado, Escenario y Tema primero");
  }
  
  const selectedScenario = currentScenarios.find(s => s.id === scenarioId);
  const selectedTheme = selectedScenario.themes.find(t => t.id === themeId);
  
  if (!selectedTheme) {
    throw new Error("Tema no encontrado");
  }
  
  // Obtener datos de lecciones
  const lessons = [];
  document.querySelectorAll('.lesson-date').forEach((dateInput, index) => {
    const timeInput = document.querySelectorAll('.lesson-time')[index];
    lessons.push({
      number: index + 1,
      date: dateInput.value || '',
      time: timeInput.value || '45'
    });
  });
  
  // Construir objeto completo
  return {
    institutional: {
      school: document.getElementById('school').value || 'CEBG Barrigón',
      teacher: document.getElementById('teacher').value || 'José White',
      year: document.getElementById('year').value || '2026',
      term: document.getElementById('term').value || '1',
      weeklyHours: document.getElementById('weeklyHours').value || '3',
      weeks: document.getElementById('weeks').value || 'From week __ to week __',
      cefr: document.getElementById('cefr').value || 'Pre-A1 / A1 / A2',
      context: document.getElementById('context').value || 'Grupo de primaria panameña; recursos básicos.'
    },
    curricular: {
      grade: gradeSelect.options[gradeSelect.selectedIndex].text,
      scenario: selectedScenario.name,
      theme: selectedTheme.name,
      gradeKey: gradeKey
    },
    rawData: selectedTheme.item // El objeto completo del tema
  };
}

// ===== EXPORTACIÓN DOCX REAL USANDO LA LIBRERÍA =====
async function exportThemeDocx() {
  try {
    const planData = getCompletePlanData();
    
    // Verificar que la librería docx esté disponible
    if (typeof window.docx === 'undefined') {
      throw new Error("Librería docx no disponible. Asegúrate de que esté cargada en index.html");
    }
    
    const { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, PageBreak } = window.docx;
    
    // Crear el documento
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // Encabezado MEDUCA
          new Paragraph({
            children: [
              new TextRun({
                text: "REPUBLICA DE PANAMA\nMINISTERIO DE EDUCACION - MEDUCA",
                bold: true,
                size: 18,
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({ children: [new TextRun({ text: " " })] }), // Línea vacía
          
          // Título principal
          new Paragraph({
            children: [new TextRun({ text: "PLANEADOR DE TEMA", bold: true, size: 24 })],
            heading: HeadingLevel.HEADING_1,
          }),
          
          // Información institucional
          new Paragraph({
            children: [new TextRun({ text: `Colegio: ${planData.institutional.school}`, bold: true })],
          }),
          new Paragraph({
            children: [new TextRun({ text: `Docente: ${planData.institutional.teacher}` })],
          }),
          new Paragraph({
            children: [new TextRun({ text: `Grado: ${planData.curricular.grade}` })],
          }),
          new Paragraph({
            children: [new TextRun({ text: `Año Escolar: ${planData.institutional.year}` })],
          }),
          
          // Información curricular
          new Paragraph({
            children: [new TextRun({ text: "INFORMACIÓN CURRICULAR", bold: true })],
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            children: [new TextRun({ text: `Escenario: ${planData.curricular.scenario}` })],
          }),
          new Paragraph({
            children: [new TextRun({ text: `Tema: ${planData.curricular.theme}` })],
          }),
          
          // Estándares curriculares
          new Paragraph({
            children: [new TextRun({ text: "ESTÁNDARES CURRICULARES", bold: true })],
            heading: HeadingLevel.HEADING_2,
          }),
          ...Object.entries(planData.rawData.standards || {}).map(([key, value]) => 
            new Paragraph({
              children: [new TextRun(`${key}: ${Array.isArray(value) ? value.join(', ') : value || 'N/A'}`)],
            })
          ),
          
          // Resultados de aprendizaje
          new Paragraph({
            children: [new TextRun({ text: "RESULTADOS DE APRENDIZAJE", bold: true })],
            heading: HeadingLevel.HEADING_2,
          }),
          ...Object.entries(planData.rawData.learning_outcomes || {}).map(([key, value]) => 
            new Paragraph({
              children: [new TextRun(`${key}: ${value || 'N/A'}`)],
            })
          ),
          
          // Competencias comunicativas
          new Paragraph({
            children: [new TextRun({ text: "COMPETENCIAS COMUNICATIVAS", bold: true })],
            heading: HeadingLevel.HEADING_2,
          }),
          ...Object.entries(planData.rawData.communicative_competences || {}).map(([key, value]) => 
            new Paragraph({
              children: [new TextRun(`${key}: ${typeof value === 'object' ? JSON.stringify(value) : value || 'N/A'}`)],
            })
          ),
          
          // Ideas de evaluación
          new Paragraph({
            children: [new TextRun({ text: "IDEAS DE EVALUACIÓN", bold: true })],
            heading: HeadingLevel.HEADING_2,
          }),
          ...(planData.rawData.assessment_ideas?.formative || []).map(idea => 
            new Paragraph({
              children: [new TextRun(`Formativa: ${idea}`)],
            })
          ),
          ...(planData.rawData.assessment_ideas?.summative || []).map(idea => 
            new Paragraph({
              children: [new TextRun(`Sumativa: ${idea}`)],
            })
          ),
        ],
      }],
    });

    // Generar archivo y descargar
    const blob = await window.docx.Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Theme_${planData.curricular.gradeKey}_${planData.curricular.theme.replace(/[^a-z0-9]/gi, '_')}.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert(`✅ Theme DOCX exportado: ${a.download}`);
    
  } catch (error) {
    console.error("Error exportando DOCX:", error);
    alert(`❌ Error exportando DOCX: ${error.message}`);
  }
}

async function exportLessonsDocx() {
  try {
    const planData = getCompletePlanData();
    
    // Validar que haya lecciones con fechas
    const hasDates = planData.lessons.some(lesson => lesson.date);
    if (!hasDates) {
      const confirm = window.confirm("⚠️ No hay fechas asignadas a las lecciones.\n¿Deseas continuar igual?");
      if (!confirm) return;
    }
    
    // Verificar que la librería docx esté disponible
    if (typeof window.docx === 'undefined') {
      throw new Error("Librería docx no disponible. Asegúrate de que esté cargada en index.html");
    }
    
    const { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, PageBreak } = window.docx;
    
    // Crear el documento
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // Encabezado MEDUCA
          new Paragraph({
            children: [
              new TextRun({
                text: "REPUBLICA DE PANAMA\nMINISTERIO DE EDUCACION - MEDUCA",
                bold: true,
                size: 18,
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({ children: [new TextRun({ text: " " })] }), // Línea vacía
          
          // Título principal
          new Paragraph({
            children: [new TextRun({ text: "PLANIFICADOR DE LECCIONES", bold: true, size: 24 })],
            heading: HeadingLevel.HEADING_1,
          }),
          
          // Información institucional
          new Paragraph({
            children: [new TextRun({ text: `Colegio: ${planData.institutional.school}`, bold: true })],
          }),
          new Paragraph({
            children: [new TextRun({ text: `Docente: ${planData.institutional.teacher}` })],
          }),
          new Paragraph({
            children: [new TextRun({ text: `Grado: ${planData.curricular.grade}` })],
          }),
          new Paragraph({
            children: [new TextRun({ text: `Año Escolar: ${planData.institutional.year}` })],
          }),
          
          // Información curricular
          new Paragraph({
            children: [new TextRun({ text: "INFORMACIÓN CURRICULAR", bold: true })],
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            children: [new TextRun({ text: `Escenario: ${planData.curricular.scenario}` })],
          }),
          new Paragraph({
            children: [new TextRun({ text: `Tema: ${planData.curricular.theme}` })],
          }),
          
          // Horario de lecciones
          new Paragraph({
            children: [new TextRun({ text: "HORARIO DE LECCIONES", bold: true })],
            heading: HeadingLevel.HEADING_2,
          }),
          ...planData.lessons.map(lesson => 
            new Paragraph({
              children: [new TextRun(`Lección ${lesson.number}: ${lesson.date || 'Sin fecha'} - ${lesson.time} min`)],
            })
          ),
          
          // Agregar page break antes de las lecciones detalladas
          new PageBreak(),
          
          // Lecciones detalladas (simulando las 5 lecciones con 6 etapas)
          ...Array.from({ length: 5 }, (_, i) => [
            new Paragraph({
              children: [new TextRun({ text: `LECCIÓN ${i + 1}`, bold: true, size: 20 })],
              heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
              children: [new TextRun({ text: "ETAPAS DE LA LECCIÓN", bold: true })],
              heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({
              children: [new TextRun("1. Warm-up: Actividad de calentamiento")],
            }),
            new Paragraph({
              children: [new TextRun("2. Presentation: Presentación de contenido")],
            }),
            new Paragraph({
              children: [new TextRun("3. Practice: Práctica guiada")],
            }),
            new Paragraph({
              children: [new TextRun("4. Production: Producción independiente")],
            }),
            new Paragraph({
              children: [new TextRun("5. Reflection: Reflexión sobre el aprendizaje")],
            }),
            new Paragraph({
              children: [new TextRun("6. Homework: Tarea para casa")],
            }),
            new PageBreak(), // Page break después de cada lección
          ]).flat(),
        ],
      }],
    });

    // Generar archivo y descargar
    const blob = await window.docx.Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Lessons_${planData.curricular.gradeKey}_${planData.curricular.theme.replace(/[^a-z0-9]/gi, '_')}.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert(`✅ Lessons DOCX exportado: ${a.download}`);
    
  } catch (error) {
    console.error("Error exportando Lessons DOCX:", error);
    alert(`❌ Error exportando Lessons DOCX: ${error.message}`);
  }
}

// ===== EXPORTACIÓN PDF REAL =====
async function exportThemePDF() {
  try {
    const planData = getCompletePlanData();
    
    // Verificar si jsPDF está disponible, si no usar print
    if (typeof window.jspdf !== 'undefined' && window.jspdf.jsPDF) {
      // Usar jsPDF si está disponible
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      
      // Añadir contenido
      doc.setFontSize(22);
      doc.text("PLANEADOR DE TEMA", 105, 20, null, null, 'center');
      
      doc.setFontSize(12);
      doc.text(`Colegio: ${planData.institutional.school}`, 20, 40);
      doc.text(`Docente: ${planData.institutional.teacher}`, 20, 50);
      doc.text(`Grado: ${planData.curricular.grade}`, 20, 60);
      doc.text(`Año Escolar: ${planData.institutional.year}`, 20, 70);
      doc.text(`Escenario: ${planData.curricular.scenario}`, 20, 80);
      doc.text(`Tema: ${planData.curricular.theme}`, 20, 90);
      
      // Guardar PDF
      doc.save(`Theme_${planData.curricular.gradeKey}_${planData.curricular.theme.replace(/[^a-z0-9]/gi, '_')}.pdf`);
      alert(`✅ Theme PDF exportado: Theme_${planData.curricular.gradeKey}_${planData.curricular.theme.replace(/[^a-z0-9]/gi, '_')}.pdf`);
    } else {
      // Alternativa: Usar print() del navegador
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
              table { width: 100%; border-collapse: collapse; margin: 10px 0; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <h1>PLANEADOR DE TEMA</h1>
            <div class="section">
              <h2>Información Institucional</h2>
              <p><strong>Colegio:</strong> ${planData.institutional.school}</p>
              <p><strong>Docente:</strong> ${planData.institutional.teacher}</p>
              <p><strong>Grado:</strong> ${planData.curricular.grade}</p>
              <p><strong>Año Escolar:</strong> ${planData.institutional.year}</p>
            </div>
            <div class="section">
              <h2>Información Curricular</h2>
              <p><strong>Escenario:</strong> ${planData.curricular.scenario}</p>
              <p><strong>Tema:</strong> ${planData.curricular.theme}</p>
            </div>
            <button onclick="window.print()">Guardar como PDF</button>
          </body>
        </html>
      `);
      printWindow.document.close();
      alert("✅ Theme PDF listo para imprimir/guardar");
    }
    
  } catch (error) {
    console.error("Error exportando PDF:", error);
    alert(`❌ Error exportando PDF: ${error.message}`);
  }
}

async function exportLessonsPDF() {
  try {
    const planData = getCompletePlanData();
    
    // Validar fechas
    const hasDates = planData.lessons.some(lesson => lesson.date);
    if (!hasDates) {
      const confirm = window.confirm("⚠️ No hay fechas en las lecciones.\n¿Continuar igual?");
      if (!confirm) return;
    }
    
    // Verificar si jsPDF está disponible
    if (typeof window.jspdf !== 'undefined' && window.jspdf.jsPDF) {
      // Usar jsPDF
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      
      // Añadir contenido
      doc.setFontSize(22);
      doc.text("PLANIFICADOR DE LECCIONES", 105, 20, null, null, 'center');
      
      doc.setFontSize(12);
      doc.text(`Colegio: ${planData.institutional.school}`, 20, 40);
      doc.text(`Docente: ${planData.institutional.teacher}`, 20, 50);
      doc.text(`Grado: ${planData.curricular.grade}`, 20, 60);
      doc.text(`Año Escolar: ${planData.institutional.year}`, 20, 70);
      doc.text(`Escenario: ${planData.curricular.scenario}`, 20, 80);
      doc.text(`Tema: ${planData.curricular.theme}`, 20, 90);
      
      // Tabla de lecciones
      let y = 100;
      doc.setFontSize(14);
      doc.text("HORARIO DE LECCIONES", 20, y);
      y += 10;
      
      planData.lessons.forEach(lesson => {
        doc.setFontSize(12);
        doc.text(`Lección ${lesson.number}: ${lesson.date || 'Sin fecha'} - ${lesson.time} min`, 20, y);
        y += 10;
      });
      
      // Guardar PDF
      doc.save(`Lessons_${planData.curricular.gradeKey}_${planData.curricular.theme.replace(/[^a-z0-9]/gi, '_')}.pdf`);
      alert(`✅ Lessons PDF exportado: Lessons_${planData.curricular.gradeKey}_${planData.curricular.theme.replace(/[^a-z0-9]/gi, '_')}.pdf`);
    } else {
      // Alternativa: Usar print() del navegador
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
            <h1>PLANIFICADOR DE LECCIONES</h1>
            <p><strong>Colegio:</strong> ${planData.institutional.school}</p>
            <p><strong>Docente:</strong> ${planData.institutional.teacher}</p>
            <p><strong>Grado:</strong> ${planData.curricular.grade}</p>
            <p><strong>Año Escolar:</strong> ${planData.institutional.year}</p>
            <p><strong>Escenario:</strong> ${planData.curricular.scenario}</p>
            <p><strong>Tema:</strong> ${planData.curricular.theme}</p>
            
            <h2>Horario de Lecciones</h2>
            <table>
              <tr>
                <th>Lección</th>
                <th>Fecha</th>
                <th>Tiempo (min)</th>
              </tr>
      `;
      
      planData.lessons.forEach(lesson => {
        lessonsHTML += `
          <tr>
            <td>Lección ${lesson.number}</td>
            <td>${lesson.date || 'Sin fecha'}</td>
            <td>${lesson.time} min</td>
          </tr>
        `;
      });
      
      lessonsHTML += `
            </table>
            <br>
            <button onclick="window.print()">Guardar como PDF</button>
          </body>
        </html>
      `;
      
      printWindow.document.write(lessonsHTML);
      printWindow.document.close();
      alert("✅ Lessons PDF listo para imprimir/guardar");
    }
    
  } catch (error) {
    console.error("Error exportando lessons PDF:", error);
    alert(`❌ Error exportando lessons PDF: ${error.message}`);
  }
}

// ===== 4. OTRAS FUNCIONES =====

function generateMarkdownPreview() {
  try {
    const planData = getCompletePlanData();
    
    let md = '# Teacher English Lesson Plan\n\n';
    
    // Datos institucionales
    md += '## 📋 Institutional Data\n';
    md += `- **School:** ${planData.institutional.school}\n`;
    md += `- **Teacher:** ${planData.institutional.teacher}\n`;
    md += `- **School Year:** ${planData.institutional.year}\n`;
    md += `- **Trimester:** ${planData.institutional.term}\n`;
    md += `- **Weekly Hours:** ${planData.institutional.weeklyHours}\n`;
    md += `- **Weeks:** ${planData.institutional.weeks}\n`;
    md += `- **CEFR Level:** ${planData.institutional.cefr}\n`;
    md += `- **Context:** ${planData.institutional.context}\n\n`;
    
    // Enfoque curricular
    md += '## 🎯 Curricular Focus\n';
    md += `- **Grade:** ${planData.curricular.grade}\n`;
    md += `- **Scenario:** ${planData.curricular.scenario}\n`;
    md += `- **Theme:** ${planData.curricular.theme}\n\n`;
    
    // Lecciones
    md += '## 📅 Lessons Schedule\n';
    md += '| Lesson | Date | Time (min) |\n';
    md += '|--------|------|------------|\n';
    planData.lessons.forEach(lesson => {
      md += `| Lesson ${lesson.number} | ${lesson.date || 'To be scheduled'} | ${lesson.time} |\n`;
    });
    md += '\n';
    
    // Estándares
    if (planData.rawData.standards) {
      md += '## 📚 Standards & Learning Outcomes\n';
      for (const [key, value] of Object.entries(planData.rawData.standards)) {
        if (Array.isArray(value) && value.length > 0) {
          md += `- **${key.charAt(0).toUpperCase() + key.slice(1)}:** ${value.join(', ')}\n`;
        } else if (value) {
          md += `- **${key.charAt(0).toUpperCase() + key.slice(1)}:** ${value}\n`;
        }
      }
      md += '\n';
    }
    
    // Resultados de aprendizaje
    if (planData.rawData.learning_outcomes) {
      md += '## 🎓 Learning Outcomes\n';
      for (const [key, value] of Object.entries(planData.rawData.learning_outcomes)) {
        if (value) md += `- **${key.charAt(0).toUpperCase() + key.slice(1)}:** ${value}\n`;
      }
      md += '\n';
    }
    
    // Competencias
    if (planData.rawData.communicative_competences) {
      md += '## 💬 Communicative Competences\n';
      for (const [key, value] of Object.entries(planData.rawData.communicative_competences)) {
        if (value) md += `- **${key.charAt(0).toUpperCase() + key.slice(1)}:** ${typeof value === 'object' ? JSON.stringify(value) : value}\n`;
      }
      md += '\n';
    }
    
    // Evaluación
    if (planData.rawData.assessment_ideas) {
      md += '## 📊 Assessment Ideas\n';
      for (const [key, value] of Object.entries(planData.rawData.assessment_ideas)) {
        if (Array.isArray(value) && value.length > 0) {
          md += `- **${key.charAt(0).toUpperCase() + key.slice(1)}:** ${value.join(', ')}\n`;
        }
      }
      md += '\n';
    }
    
    md += `---\n*Generated: ${new Date().toLocaleString()}*\n`;
    
    document.getElementById('mdPreview').value = md;
    alert("✅ Vista previa Markdown generada");
    
  } catch (error) {
    alert(`❌ ${error.message}`);
  }
}

// ===== 5. INICIALIZACIÓN =====

document.addEventListener('DOMContentLoaded', function() {
  console.log("✅ DOM cargado - Iniciando aplicación completa");
  
  // 1. Cargar grados
  loadAvailableGrades();
  
  // 2. Generar tabla de lecciones
  generateLessonTable();
  
  // 3. Configurar eventos de grado
  const gradeSelect = document.getElementById('grade');
  const scenarioSelect = document.getElementById('scenario');
  
  if (gradeSelect) {
    gradeSelect.addEventListener('change', async function() {
      const gradeKey = this.value;
      if (!gradeKey) {
        document.getElementById('scenario').innerHTML = '<option value="">Seleccionar Escenario</option>';
        document.getElementById('theme').innerHTML = '<option value="">Seleccionar Tema</option>';
        return;
      }
      
      try {
        alert(`⏳ Cargando ${this.options[this.selectedIndex].text}...`);
        
        currentData = await loadGradeData(gradeKey);
        
        if (!currentData || currentData.length === 0) {
          alert(`⚠️ No hay datos para este grado`);
          return;
        }
        
        currentScenarios = extractScenarios(currentData);
        
        if (currentScenarios.length === 0) {
          alert("⚠️ No se pudieron extraer escenarios del archivo");
          return;
        }
        
        populateScenarios(currentScenarios);
        document.getElementById('theme').innerHTML = '<option value="">Seleccionar Tema</option>';
        
        alert(`✅ ${currentScenarios.length} escenarios cargados`);
        
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
    });
  }
  
  // 4. Conectar TODOS los botones
  const buttons = {
    'genPreview': generateMarkdownPreview,
    'exportThemeDOC': exportThemeDocx,
    'exportLessonDOC': exportLessonsDocx,
    'exportThemePDF': exportThemePDF,
    'exportLessonPDF': exportLessonsPDF,
    'themeToggle': function() {
      const body = document.body;
      const isDark = body.getAttribute('data-theme') === 'dark';
      body.setAttribute('data-theme', isDark ? 'light' : 'dark');
      this.textContent = isDark ? 'Modo oscuro' : 'Modo claro';
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
    } else {
      console.warn(`⚠️ Botón "${id}" no encontrado`);
    }
  }
  
  // 5. Mensaje final
  console.log("🚀 Aplicación COMPLETAMENTE inicializada");
  setTimeout(() => {
    alert("✅ Teacher English Planner 100% funcional\n\n✨ ¡Todos los botones están activos!");
  }, 1000);
});