// app/app.js - VERSIÓN QUE LEE CUALQUIER ESTRUCTURA JSON

// --- Función UNIVERSAL para cargar datos ---
async function loadGradeData(gradeKey) {
  try {
    alert(`⏳ Cargando grado: ${gradeKey}`);
    
    // Determinar nombre de archivo
    let fileName = `grade_${gradeKey}.json`;
    if (gradeKey === 'pre-k') fileName = 'grade_pre-k.json';
    if (gradeKey === 'K') fileName = 'grade_K.json';
    
    // Intentar diferentes rutas
    const urls = [
      `../data/${fileName}`,
      `data/${fileName}`,
      `./data/${fileName}`,
      `/${fileName}`
    ];
    
    let response;
    let data;
    
    for (const url of urls) {
      try {
        console.log(`🔍 Probando: ${url}`);
        response = await fetch(url);
        if (response.ok) {
          console.log(`✅ Encontrado en: ${url}`);
          data = await response.json();
          alert(`✅ Archivo encontrado: ${url}`);
          break;
        }
      } catch (e) {
        console.log(`❌ Falló: ${url}`);
      }
    }
    
    if (!data) {
      alert(`❌ No se pudo cargar ${fileName}`);
      return [];
    }
    
    console.log("📊 Datos crudos:", data);
    alert(`📊 Estructura recibida: ${JSON.stringify(Object.keys(data)).substring(0, 100)}...`);
    
    // BUSCAR TEMAS EN CUALQUIER ESTRUCTURA
    let themesArray = findThemesInData(data);
    
    if (themesArray.length === 0) {
      alert(`⚠️ No se encontraron temas. Estructura completa:\n${JSON.stringify(data).substring(0, 200)}...`);
    }
    
    alert(`✅ ${themesArray.length} temas encontrados`);
    return themesArray;
    
  } catch (error) {
    alert(`❌ Error: ${error.message}`);
    return [];
  }
}

// --- Función INTELIGENTE que busca temas en cualquier estructura ---
function findThemesInData(data) {
  console.log("🔍 Buscando temas en estructura:", typeof data);
  
  // Si es array, usarlo directamente
  if (Array.isArray(data)) {
    console.log("📦 Es array directo");
    return data;
  }
  
  // Si es objeto, buscar propiedades que sean arrays
  if (data && typeof data === 'object') {
    console.log("📦 Es objeto. Keys:", Object.keys(data));
    
    // Buscar arrays comunes
    const possibleKeys = ['themes', 'data', 'lessons', 'units', 'items', 'content'];
    
    for (const key of possibleKeys) {
      if (Array.isArray(data[key])) {
        console.log(`✅ Encontrado en propiedad: "${key}"`);
        return data[key];
      }
    }
    
    // Buscar CUALQUIER array en el objeto
    for (const key in data) {
      if (Array.isArray(data[key])) {
        console.log(`✅ Encontrado array en: "${key}"`);
        return data[key];
      }
    }
    
    // Si tiene una propiedad que es objeto, buscar dentro
    for (const key in data) {
      if (data[key] && typeof data[key] === 'object') {
        const found = findThemesInData(data[key]);
        if (found.length > 0) {
          console.log(`✅ Encontrado dentro de: "${key}"`);
          return found;
        }
      }
    }
  }
  
  console.log("❌ No se encontró ningún array de temas");
  return [];
}

// --- Función para extraer escenarios ---
function extractScenariosFromThemes(themes) {
  const scenarios = {};
  
  themes.forEach(theme => {
    // Diferentes estructuras posibles
    let scenario = null;
    
    if (theme.scenario) {
      scenario = theme.scenario;
    } else if (theme.context) {
      scenario = theme.context;
    } else if (theme.scenarioData) {
      scenario = theme.scenarioData;
    }
    
    if (scenario && scenario.id) {
      if (!scenarios[scenario.id]) {
        scenarios[scenario.id] = {
          id: scenario.id,
          name: scenario.name_en || scenario.name_es || scenario.name || `Escenario ${scenario.id}`,
          description: scenario.description || ''
        };
      }
    }
  });
  
  return Object.values(scenarios);
}

// --- Función para extraer temas ---
function extractThemesFromData(themes, scenarioId) {
  return themes.filter(theme => {
    let themeScenarioId = '';
    
    if (theme.scenario && theme.scenario.id) {
      themeScenarioId = theme.scenario.id;
    } else if (theme.scenarioData && theme.scenarioData.id) {
      themeScenarioId = theme.scenarioData.id;
    } else if (theme.context && theme.context.id) {
      themeScenarioId = theme.context.id;
    }
    
    return themeScenarioId === scenarioId;
  });
}

// --- Poblar selectores ---
function populateScenarios(themes, scenarioSelect) {
  scenarioSelect.innerHTML = '<option value="">Seleccionar Escenario</option>';
  
  const scenarios = extractScenariosFromThemes(themes);
  
  if (scenarios.length === 0) {
    alert("⚠️ No se encontraron escenarios en los temas");
    console.log("Temas disponibles:", themes);
    return;
  }
  
  scenarios.forEach(scenario => {
    const option = document.createElement('option');
    option.value = scenario.id;
    option.textContent = scenario.name;
    scenarioSelect.appendChild(option);
  });
  
  alert(`✅ ${scenarios.length} escenarios cargados`);
}

function populateThemes(themes, themeSelect, scenarioId) {
  themeSelect.innerHTML = '<option value="">Seleccionar Tema</option>';
  
  const filteredThemes = extractThemesFromData(themes, scenarioId);
  
  filteredThemes.forEach(theme => {
    const option = document.createElement('option');
    option.value = theme.id || theme.theme?.id || Math.random().toString(36);
    
    // Extraer nombre del tema
    let themeName = 'Tema sin nombre';
    if (theme.theme && theme.theme.name_en) themeName = theme.theme.name_en;
    else if (theme.theme && theme.theme.name_es) themeName = theme.theme.name_es;
    else if (theme.name_en) themeName = theme.name_en;
    else if (theme.name_es) themeName = theme.name_es;
    else if (theme.title) themeName = theme.title;
    
    option.textContent = themeName;
    themeSelect.appendChild(option);
  });
  
  alert(`✅ ${filteredThemes.length} temas para este escenario`);
}

// --- Código principal ---
let currentThemes = [];

document.addEventListener('DOMContentLoaded', () => {
  console.log("🚀 Aplicación iniciada");
  
  const gradeSelect = document.getElementById('grade');
  const scenarioSelect = document.getElementById('scenario');
  const themeSelect = document.getElementById('theme');
  
  // Cargar grados disponibles
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
  
  grades.forEach(g => {
    const option = document.createElement('option');
    option.value = g.key;
    option.textContent = g.label;
    gradeSelect.appendChild(option);
  });
  
  // Cuando se selecciona un grado
  gradeSelect.addEventListener('change', async () => {
    const gradeKey = gradeSelect.value;
    if (!gradeKey) return;
    
    try {
      currentThemes = await loadGradeData(gradeKey);
      
      if (currentThemes.length === 0) {
        alert("❌ No se pudieron cargar temas");
        return;
      }
      
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
  
  // Botón de vista previa
  document.getElementById('genPreview')?.addEventListener('click', () => {
    const gradeText = gradeSelect.options[gradeSelect.selectedIndex]?.text || 'No seleccionado';
    const scenarioText = scenarioSelect.options[scenarioSelect.selectedIndex]?.text || 'No seleccionado';
    const themeText = themeSelect.options[themeSelect.selectedIndex]?.text || 'No seleccionado';
    
    const preview = `# Plan de Clases - Inglés
**Grado:** ${gradeText}
**Escenario:** ${scenarioText}
**Tema:** ${themeText}

## Temas disponibles: ${currentThemes.length}
## ¡Sistema funcionando!`;
    
    document.getElementById('mdPreview').value = preview;
    alert("✅ Vista previa generada");
  });
  
  console.log("✅ Aplicación lista");
});