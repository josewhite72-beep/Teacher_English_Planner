// app/curriculumLoader.js
export async function loadGradeData(gradeKey) {
  try {
    const response = await fetch(`./data/grade_${gradeKey}.json`);
    if (!response.ok) throw new Error(`Failed to load grade ${gradeKey}`);
    
    const data = await response.json();
    
    // Normalizar estructura (si es objeto con .themes o .data)
    if (Array.isArray(data)) {
      return data;
    }
    if (data && typeof data === 'object' && Array.isArray(data.themes)) {
      return data.themes;
    }
    if (data && typeof data === 'object' && Array.isArray(data.data)) {
      return data.data;
    }
    
    console.warn("Grade data structure unrecognized:", data);
    return [];
  } catch (error) {
    console.error("Error loading grade data:", error);
    return [];
  }
}

export function populateScenarios(scenarios, scenarioSelect) {
  scenarioSelect.innerHTML = '<option value="">Seleccionar Escenario</option>';
  
  // Agrupar por ID único
  const uniqueScenarios = {};
  scenarios.forEach(theme => {
    const scenarioId = theme.scenario.id;
    if (!uniqueScenarios[scenarioId]) {
      uniqueScenarios[scenarioId] = theme.scenario;
    }
  });
  
  Object.values(uniqueScenarios).forEach(scenario => {
    const option = document.createElement('option');
    option.value = scenario.id;
    option.textContent = scenario.name_en || scenario.name_es;
    scenarioSelect.appendChild(option);
  });
}

export function populateThemes(themes, themeSelect, selectedScenarioId) {
  themeSelect.innerHTML = '<option value="">Seleccionar Tema</option>';
  
  const filteredThemes = themes.filter(theme => theme.scenario.id === selectedScenarioId);
  
  filteredThemes.forEach(theme => {
    const option = document.createElement('option');
    option.value = theme.theme.id;
    option.textContent = theme.theme.name_en || theme.theme.name_es;
    themeSelect.appendChild(option);
  });
}