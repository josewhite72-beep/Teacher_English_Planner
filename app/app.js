// app/app.js - VERSIÓN SIMPLIFICADA Y FUNCIONAL

// --- Funciones básicas ---
async function loadGradeData(gradeKey) {
  try {
    // Mostrar que estamos intentando
    alert(`Intentando cargar grado: ${gradeKey}`);
    
    // Opción 1: Ruta normal
    const url1 = `../data/grade_${gradeKey}.json`;
    console.log("Probando ruta 1:", url1);
    
    // Opción 2: Ruta alternativa
    const url2 = `data/grade_${gradeKey}.json`;
    console.log("Probando ruta 2:", url2);
    
    // Opción 3: Para pre-k y K
    let fileName = `grade_${gradeKey}.json`;
    if (gradeKey === 'pre-k') fileName = 'grade_pre-k.json';
    if (gradeKey === 'K') fileName = 'grade_K.json';
    const url3 = `../data/${fileName}`;
    console.log("Probando ruta 3:", url3);
    
    // Intentar todas las rutas
    let response;
    let usedUrl = '';
    
    // Probar URL1
    try {
      response = await fetch(url1);
      if (response.ok) {
        usedUrl = url1;
      }
    } catch (e1) {
      console.log("URL1 falló:", e1);
    }
    
    // Si URL1 falló, probar URL2
    if (!response || !response.ok) {
      try {
        response = await fetch(url2);
        if (response.ok) {
          usedUrl = url2;
        }
      } catch (e2) {
        console.log("URL2 falló:", e2);
      }
    }
    
    // Si URL2 falló, probar URL3
    if (!response || !response.ok) {
      try {
        response = await fetch(url3);
        if (response.ok) {
          usedUrl = url3;
        }
      } catch (e3) {
        console.log("URL3 falló:", e3);
      }
    }
    
    // Si ninguna funcionó, mostrar error
    if (!response || !response.ok) {
      alert(`ERROR: No se pudo cargar el archivo JSON para ${gradeKey}\n\nProbé:\n1. ${url1}\n2. ${url2}\n3. ${url3}`);
      return [];
    }
    
    console.log(`✅ Archivo encontrado en: ${usedUrl}`);
    const data = await response.json();
    alert(`✅ Archivo cargado: ${Object.keys(data).length} elementos`);
    
    // Procesar datos
    if (Array.isArray(data)) {
      return data;
    } else if (data.themes && Array.isArray(data.themes)) {
      return data.themes;
    } else if (data.data && Array.isArray(data.data)) {
      return data.data;
    } else {
      alert("⚠️ Estructura de datos no reconocida");
      return [];
    }
    
  } catch (error) {
    console.error("Error:", error);
    alert(`Error al cargar: ${error.message}`);
    return [];
  }
}

function populateScenarios(themes, scenarioSelect) {
  scenarioSelect.innerHTML = '<option value="">Seleccionar Escenario</option>';
  
  if (!themes || themes.length === 0) {
    alert("No hay temas para mostrar escenarios");
    return;
  }
  
  // Agrupar escenarios únicos
  const scenariosMap = {};
  themes.forEach(theme => {
    if (theme.scenario && theme.scenario.id) {
      scenariosMap[theme.scenario.id] = theme.scenario;
    }
  });
  
  // Agregar opciones
  Object.values(scenariosMap).forEach(scenario => {
    const option = document.createElement('option');
    option.value = scenario.id;
    option.textContent = scenario.name_en || scenario.name_es || `Escenario ${scenario.id}`;
    scenarioSelect.appendChild(option);
  });
  
  alert(`✅ ${Object.keys(scenariosMap).length} escenarios cargados`);
}

function populateThemes(themes, themeSelect, scenarioId) {
  themeSelect.innerHTML = '<option value="">Seleccionar Tema</option>';
  
  const filtered = themes.filter(t => t.scenario && t.scenario.id === scenarioId);
  
  filtered.forEach(theme => {
    const option = document.createElement('option');
    option.value = theme.theme.id;
    option.textContent = theme.theme.name_en || theme.theme.name_es || `Tema ${theme.theme.id}`;
    themeSelect.appendChild(option);
  });
  
  alert(`✅ ${filtered.length} temas cargados`);
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
  
  grades.forEach(g => {
    const option = document.createElement('option');
    option.value = g.key;
    option.textContent = g.label;
    selectElement.appendChild(option);
  });
}

// --- Variables globales ---
let currentThemes = [];

// --- Inicialización ---
document.addEventListener('DOMContentLoaded', () => {
  console.log("🚀 Aplicación iniciada");
  
  const gradeSelect = document.getElementById('grade');
  const scenarioSelect = document.getElementById('scenario');
  const themeSelect = document.getElementById('theme');
  
  // Cargar lista de grados
  loadAvailableGrades(gradeSelect);
  
  // Cuando se selecciona un grado
  gradeSelect.addEventListener('change', async () => {
    const gradeKey = gradeSelect.value;
    if (!gradeKey) return;
    
    alert(`⏳ Cargando grado: ${gradeKey}`);
    
    try {
      // Cargar datos del grado
      currentThemes = await loadGradeData(gradeKey);
      
      if (currentThemes.length === 0) {
        alert("⚠️ No se encontraron temas en este grado");
        return;
      }
      
      // Mostrar escenarios
      populateScenarios(currentThemes, scenarioSelect);
      themeSelect.innerHTML = '<option value="">Seleccionar Tema</option>';
      
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    }
  });
  
  // Cuando se selecciona un escenario
  scenarioSelect.addEventListener('change', () => {
    const scenarioId = scenarioSelect.value;
    if (!scenarioId || currentThemes.length === 0) return;
    
    populateThemes(currentThemes, themeSelect, scenarioId);
  });
  
  // Función simple de vista previa
  document.getElementById('genPreview')?.addEventListener('click', () => {
    const school = document.getElementById('school').value || 'CEBG Barrigón';
    const teacher = document.getElementById('teacher').value || 'José White';
    const year = document.getElementById('year').value || '2026';
    
    const preview = `# Plan de Clases - Inglés

**Escuela:** ${school}
**Profesor:** ${teacher}
**Año:** ${year}

## Grado: ${gradeSelect.options[gradeSelect.selectedIndex]?.text || 'No seleccionado'}
## Escenario: ${scenarioSelect.options[scenarioSelect.selectedIndex]?.text || 'No seleccionado'}
## Tema: ${themeSelect.options[themeSelect.selectedIndex]?.text || 'No seleccionado'}

---

*Selecciona Grado, Escenario y Tema para generar el plan completo.*`;
    
    document.getElementById('mdPreview').value = preview;
    alert("✅ Vista previa generada");
  });
  
  // Otras funciones básicas
  document.getElementById('exportThemeDOC')?.addEventListener('click', () => {
    alert("Exportación DOCX - En desarrollo");
  });
  
  document.getElementById('exportLessonDOC')?.addEventListener('click', () => {
    alert("Exportación DOCX de lecciones - En desarrollo");
  });
  
  console.log("✅ Listo para usar");
});