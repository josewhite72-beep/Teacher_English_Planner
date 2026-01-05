// app/app.js - VERSIÓN PARA VER ESTRUCTURA REAL

// --- Función principal MUY SIMPLE ---
async function loadGradeData(gradeKey) {
  try {
    alert(`🔍 Cargando: ${gradeKey}`);
    
    // Ruta correcta según lo visto
    let fileName = `grade_${gradeKey}.json`;
    if (gradeKey === 'pre-k') fileName = 'grade_pre-k.json';
    if (gradeKey === 'K') fileName = 'grade_K.json';
    
    const url = `data/${fileName}`;
    console.log("URL:", url);
    
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Error ${response.status}`);
    
    const data = await response.json();
    console.log("📦 Datos completos:", data);
    
    // MOSTRAR ESTRUCTURA COMPLETA
    if (Array.isArray(data) && data.length > 0) {
      alert(`✅ ${data.length} elementos cargados\n\n🔍 Primer elemento:\n${JSON.stringify(data[0], null, 2).substring(0, 500)}...`);
      
      // Guardar para diagnóstico
      localStorage.setItem('debug_theme_structure', JSON.stringify(data[0]));
    }
    
    return data;
    
  } catch (error) {
    alert(`❌ Error: ${error.message}`);
    return [];
  }
}

// --- Función para VER estructura ---
function debugShowStructure(themes) {
  if (!themes || themes.length === 0) {
    alert("⚠️ No hay temas para analizar");
    return;
  }
  
  const firstTheme = themes[0];
  console.log("🔍 TEMA COMPLETO:", firstTheme);
  
  // Crear mensaje detallado
  let message = `🔬 ANÁLISIS DE ESTRUCTURA\n\n`;
  message += `📊 Total temas: ${themes.length}\n\n`;
  
  // Mostrar TODAS las propiedades del primer tema
  message += `📋 PROPIEDADES del primer tema:\n`;
  const keys = Object.keys(firstTheme);
  keys.forEach((key, index) => {
    const value = firstTheme[key];
    message += `${index + 1}. "${key}": `;
    
    if (value === null) message += "null";
    else if (Array.isArray(value)) message += `Array[${value.length}]`;
    else if (typeof value === 'object') message += `Object (${Object.keys(value).length} props)`;
    else if (typeof value === 'string') message += `"${value.substring(0, 30)}${value.length > 30 ? '...' : ''}"`;
    else message += value;
    
    message += '\n';
  });
  
  // Buscar escenario específicamente
  message += `\n🔍 BUSCANDO ESCENARIO...\n`;
  
  let foundScenario = false;
  for (const key in firstTheme) {
    const value = firstTheme[key];
    if (value && typeof value === 'object') {
      // Buscar propiedades que parezcan escenario
      if (value.id && (value.name || value.name_en || value.name_es)) {
        message += `✅ Posible escenario en "${key}": ${value.name || value.name_en || value.id}\n`;
        foundScenario = true;
      }
    }
  }
  
  if (!foundScenario) {
    message += `❌ No se encontró estructura de escenario\n`;
    message += `⚠️ El archivo puede tener estructura diferente`;
  }
  
  alert(message);
  
  // También mostrar en consola para copiar
  console.log("📋 PARA COPIAR Y PEGAR:");
  console.log("Estructura completa del primer tema:", JSON.stringify(firstTheme, null, 2));
}

// --- Función SIMPLE para escenarios ---
function findScenariosInThemes(themes) {
  const scenarios = [];
  
  themes.forEach(theme => {
    // Buscar objeto que tenga propiedades de escenario
    for (const key in theme) {
      const value = theme[key];
      if (value && typeof value === 'object' && value.id) {
        // Si parece un escenario
        if (value.name || value.name_en || value.name_es || value.description) {
          const scenarioId = `${key}_${value.id}`;
          
          // Verificar si ya existe
          if (!scenarios.find(s => s.id === scenarioId)) {
            scenarios.push({
              id: scenarioId,
              key: key,
              name: value.name || value.name_en || value.name_es || `Escenario ${value.id}`,
              data: value
            });
          }
        }
      }
    }
  });
  
  return scenarios;
}

// --- Poblar selectores SIMPLE ---
function populateScenariosSimple(themes, scenarioSelect) {
  scenarioSelect.innerHTML = '<option value="">Seleccionar Escenario</option>';
  
  const scenarios = findScenariosInThemes(themes);
  
  if (scenarios.length === 0) {
    // Mostrar opción genérica
    const option = document.createElement('option');
    option.value = "general";
    option.textContent = "Escenario General";
    scenarioSelect.appendChild(option);
    
    alert(`⚠️ No se encontraron escenarios\nSe usará "Escenario General"`);
  } else {
    scenarios.forEach(scenario => {
      const option = document.createElement('option');
      option.value = scenario.id;
      option.textContent = scenario.name;
      scenarioSelect.appendChild(option);
    });
    
    alert(`✅ ${scenarios.length} escenarios encontrados`);
  }
}

function populateThemesSimple(themes, themeSelect, scenarioId) {
  themeSelect.innerHTML = '<option value="">Seleccionar Tema</option>';
  
  // Si es "general", mostrar todos los temas
  if (scenarioId === "general") {
    themes.forEach((theme, index) => {
      const option = document.createElement('option');
      option.value = `theme_${index}`;
      
      // Intentar encontrar nombre
      let themeName = `Tema ${index + 1}`;
      for (const key in theme) {
        if (key.includes('name') || key.includes('title') || key.includes('theme')) {
          const value = theme[key];
          if (typeof value === 'string' && value.trim().length > 0) {
            themeName = value;
            break;
          }
        }
      }
      
      option.textContent = themeName;
      themeSelect.appendChild(option);
    });
    
    alert(`✅ ${themes.length} temas cargados`);
    return;
  }
  
  // Para escenarios específicos (simplificado por ahora)
  themes.forEach((theme, index) => {
    const option = document.createElement('option');
    option.value = `theme_${index}`;
    option.textContent = `Tema ${index + 1}`;
    themeSelect.appendChild(option);
  });
  
  alert(`✅ Temas cargados para escenario`);
}

// --- Código principal ---
let currentThemes = [];

document.addEventListener('DOMContentLoaded', () => {
  console.log("🔧 Sistema iniciado");
  
  const gradeSelect = document.getElementById('grade');
  const scenarioSelect = document.getElementById('scenario');
  const themeSelect = document.getElementById('theme');
  
  // Cargar grados
  gradeSelect.innerHTML = '<option value="">Seleccionar Grado</option>';
  [
    { key: "pre-k", label: "Pre-K" },
    { key: "K", label: "Kindergarten" },
    { key: "1", label: "Grade 1" },
    { key: "2", label: "Grade 2" },
    { key: "3", label: "Grade 3" },
    { key: "4", label: "Grade 4" },
    { key: "5", label: "Grade 5" },
    { key: "6", label: "Grade 6" }
  ].forEach(g => {
    const option = document.createElement('option');
    option.value = g.key;
    option.textContent = g.label;
    gradeSelect.appendChild(option);
  });
  
  // Evento: Cambio de grado
  gradeSelect.addEventListener('change', async () => {
    const gradeKey = gradeSelect.value;
    if (!gradeKey) return;
    
    try {
      currentThemes = await loadGradeData(gradeKey);
      
      if (currentThemes.length === 0) {
        alert("❌ Archivo vacío");
        return;
      }
      
      // MOSTRAR ESTRUCTURA COMPLETA
      debugShowStructure(currentThemes);
      
      // Poblar escenarios
      populateScenariosSimple(currentThemes, scenarioSelect);
      themeSelect.innerHTML = '<option value="">Seleccionar Tema</option>';
      
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  });
  
  // Evento: Cambio de escenario
  scenarioSelect.addEventListener('change', () => {
    const scenarioId = scenarioSelect.value;
    if (!scenarioId || currentThemes.length === 0) return;
    
    populateThemesSimple(currentThemes, themeSelect, scenarioId);
  });
  
  // Botón especial para ver estructura
  const debugBtn = document.createElement('button');
  debugBtn.textContent = "🔍 Ver Estructura";
  debugBtn.style.cssText = `
    position: fixed;
    bottom: 60px;
    right: 10px;
    background: #9C27B0;
    color: white;
    border: none;
    padding: 10px;
    border-radius: 20px;
    z-index: 9999;
    font-size: 12px;
  `;
  debugBtn.onclick = () => {
    if (currentThemes.length > 0) {
      debugShowStructure(currentThemes);
    } else {
      alert("Primero selecciona un grado");
    }
  };
  document.body.appendChild(debugBtn);
  
  // Botón de vista previa simple
  document.getElementById('genPreview')?.addEventListener('click', () => {
    const grade = gradeSelect.value ? gradeSelect.options[gradeSelect.selectedIndex].text : "No seleccionado";
    const scenario = scenarioSelect.value ? scenarioSelect.options[scenarioSelect.selectedIndex].text : "No seleccionado";
    const theme = themeSelect.value ? themeSelect.options[themeSelect.selectedIndex].text : "No seleccionado";
    
    document.getElementById('mdPreview').value = `Grado: ${grade}\nEscenario: ${scenario}\nTema: ${theme}`;
    alert("Vista previa actualizada");
  });
  
  alert("✅ Sistema listo\n\n🔍 Selecciona 'Grade 1' y mira el análisis de estructura");
});