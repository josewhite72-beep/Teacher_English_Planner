/**
 * Teacher English Planner – Autorrelleno (stub)
 * Recibe themeObj + institutional y vuelca datos en la UI.
 * Ajusta los selectores (#ids / .clases) a tu HTML.
 */

export function fillThemePlanner(themeObj, institutional) {
  if (!themeObj) return;
  // Ejemplos de volcado. Cambia selectores a los de tu formulario.
  setText('#grade_label', `${themeObj.grade_label_es} / ${themeObj.grade_label_en}`);
  setText('#scenario_name', `${themeObj.scenario.name_es} / ${themeObj.scenario.name_en}`);
  setText('#theme_name', `${themeObj.theme.name_es} / ${themeObj.theme.name_en}`);

  // Standards institucionales (si vienen como objeto con keys por habilidad)
  const std = (institutional && institutional.standards) ? institutional.standards : institutional;
  setList('#std_listening', std?.listening || []);
  setList('#std_reading', std?.reading || []);
  setList('#std_speaking', std?.speaking || []);
  setList('#std_writing', std?.writing || []);
  setList('#std_mediation', std?.mediation || []);

  // Learning outcomes del objeto del theme
  setText('#lo_listening', themeObj.learning_outcomes?.listening || '');
  setText('#lo_reading', themeObj.learning_outcomes?.reading || '');
  setText('#lo_speaking', themeObj.learning_outcomes?.speaking || '');
  setText('#lo_writing', themeObj.learning_outcomes?.writing || '');
  setText('#lo_mediation', themeObj.learning_outcomes?.mediation || '');
}

export function fillLessonPlanners(themeObj) {
  if (!themeObj) return;
  // Ejemplo: rellenar micro-tareas L1..L5 en las 6 etapas.
  const tasks = themeObj.project_21st?.micro_tasks || [];
  for (let i = 0; i < 5; i++) {
    setText(`#lesson${i+1}_task`, tasks[i] || '');
  }
}

function setText(selector, text) {
  const el = document.querySelector(selector);
  if (el) el.textContent = text;
}

function setList(selector, arr) {
  const el = document.querySelector(selector);
  if (!el) return;
  el.innerHTML = '';
  (arr || []).forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    el.appendChild(li);
  });
}
