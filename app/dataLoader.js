/**
 * Teacher English Planner – Data Loader
 * Carga JSON curriculares por grado y estándares institucionales.
 * Autor: José + M365 Copilot
 */

const DATA_DIR = './data'; // Cambia si usas otra carpeta (p.ej., './contenido_institucional')

// --- Tabla de archivos por grado ---
const FILES_BY_GRADE = {
  'pre-k': {
    grade: 'grade_pre-k.json',
    institutional: 'grade_pre-k_institutional_standards.json'
  },
  'k': {
    grade: 'grade_K.json',
    institutional: 'grade_K_institutional_standards.json'
  },
  '1': {
    grade: 'grade_1.json',
    institutional: 'grade_1_institutional_standards.json'
  },
  '2': {
    grade: 'grade_2.json',
    institutional: 'grade_2_institutional_standards.json'
  },
  '3': {
    grade: 'grade_3.json',
    institutional: 'grade_3_institutional_standards.json'
  },
  '4': {
    grade: 'grade_4.json',
    institutional: 'grade_4_institutional_standards.json'
  },
  '5': {
    grade: 'grade_5.json',
    institutional: 'grade_5_institutional_standards.json'
  },
  '6': {
    grade: 'grade_6.json',
    institutional: 'grade_6_institutional_standards.json'
  }
};

// --- Caché en memoria para evitar múltiples lecturas ---
const memoryCache = new Map();

/**
 * Carga un JSON desde /data con caché en memoria.
 * @param {string} fileName Nombre del archivo (ej: 'grade_3.json')
 * @returns {Promise<any>} Objeto JSON parseado
 */
async function loadJson(fileName) {
  const url = `${DATA_DIR}/${fileName}`;

  if (memoryCache.has(url)) {
    return memoryCache.get(url);
  }

  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Error ${res.status} al cargar ${url}`);
  }

  const json = await res.json();
  memoryCache.set(url, json);
  return json;
}

/**
 * Obtiene el JSON principal por grado (escenarios + themes).
 * @param {'pre-k'|'k'|'1'|'2'|'3'|'4'|'5'|'6'} gradeKey
 */
export async function getGradeData(gradeKey) {
  const files = FILES_BY_GRADE[gradeKey];
  if (!files) throw new Error(`Grade '${gradeKey}' no está configurado en FILES_BY_GRADE`);
  return loadJson(files.grade);
}

/**
 * Obtiene los estándares institucionales por grado.
 * @param {'pre-k'|'k'|'1'|'2'|'3'|'4'|'5'|'6'} gradeKey
 */
export async function getInstitutionalStandards(gradeKey) {
  const files = FILES_BY_GRADE[gradeKey];
  if (!files) throw new Error(`Grade '${gradeKey}' no está configurado en FILES_BY_GRADE`);
  return loadJson(files.institutional);
}

/**
 * Lista rápida de escenarios (name_en/es, id) por grado.
 * @param {any[]} gradeJson Array con objetos por Theme
 */
export function listScenarios(gradeJson) {
  const seen = new Set();
  const scenarios = [];
  for (const item of gradeJson) {
    const s = item.scenario || {};
    if (!s.id) continue;
    if (seen.has(s.id)) continue;
    seen.add(s.id);
    scenarios.push({ id: s.id, name_en: s.name_en, name_es: s.name_es });
  }
  return scenarios;
}

/**
 * Lista los themes disponibles por escenario.
 * @param {any[]} gradeJson
 * @param {string} scenarioId
 */
export function listThemesForScenario(gradeJson, scenarioId) {
  return gradeJson
    .filter(item => item?.scenario?.id === scenarioId)
    .map(item => item.theme)
    .filter(Boolean);
}

/**
 * Encuentra un objeto exacto por scenarioId y themeId.
 * @param {any[]} gradeJson
 * @param {string} scenarioId
 * @param {string} themeId
 */
export function findThemeObject(gradeJson, scenarioId, themeId) {
  return gradeJson.find(
    item => item?.scenario?.id === scenarioId && item?.theme?.id === themeId
  ) || null;
}

/**
 * Carga todo lo necesario para autorrellenar el Planner.
 * @param {'pre-k'|'k'|'1'|'2'|'3'|'4'|'5'|'6'} gradeKey
 */
export async function loadPlannerData(gradeKey) {
  const [gradeData, institutional] = await Promise.all([
    getGradeData(gradeKey),
    getInstitutionalStandards(gradeKey)
  ]);

  return {
    gradeKey,
    gradeData,
    institutional
  };
}

/** Limpia el caché */
export function clearCache() {
  memoryCache.clear();
}
