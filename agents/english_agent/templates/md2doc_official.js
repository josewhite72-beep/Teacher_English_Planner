
// md2doc_official.js — Official HTML template exporter
async function loadTemplate(){
  const [htmlRes, cssRes] = await Promise.all([
    fetch('agents/english_agent/templates/official_template.html'),
    fetch('agents/english_agent/templates/official_styles.css')
  ]);
  return { html: await htmlRes.text(), css: await cssRes.text() };
}
function fillTemplate(html, data){ let out=html; Object.entries(data).forEach(([k,v])=>{ out = out.replaceAll(`{{${k}}}`, v ?? ''); }); return out; }
function blobDoc(html){ return new Blob([html], {type:'application/msword'}); }
function buildDataFromState(STATE){
  const vocabHtml = (STATE.vocabList||[]).map(v=>`<li>${v}</li>`).join('\n');
  const grammarHtml = (STATE.grammarList||[]).map(g=>`<li>${g}</li>`).join('\n');
  const assessHtml = (STATE.assessmentTools||[]).map(a=>`<li>${a}</li>`).join('\n');
  const lessonsHtml = (STATE.lessons||[]).map((L,i)=>[
    `<h3>Lesson ${i+1}</h3>`,
    `<p><strong>Learning outcome:</strong> ${L.outcome||''}</p>`,
    `<p><strong>Warm-up:</strong> ${L.warmup||''}</p>`,
    `<p><strong>Presentation:</strong> ${L.presentation||''}</p>`,
    `<p><strong>Practice:</strong> ${L.practice||''}</p>`,
    `<p><strong>Production:</strong> ${L.production||''}</p>`,
    `<p><strong>Assessment:</strong> ${L.assessment||''}</p>`,
    `<p><strong>Closure:</strong> ${L.closure||''}</p>`
  ].join('\n')).join('\n');
  return {
    School: STATE.school||'', Teacher: STATE.teacher||'', Subject:'English', Grade: STATE.grade||'', SchoolYear: STATE.schoolYear||'', Term: STATE.term||'', Scenario: STATE.scenario||'', Theme: STATE.theme||'', Context: STATE.context||'', ObjectiveSMART: STATE.objectiveSMART||'', LO_Listening: (STATE.outcomes?.Listening)||'', LO_Speaking: (STATE.outcomes?.Speaking)||'', LO_Reading: (STATE.outcomes?.Reading)||'', LO_Writing: (STATE.outcomes?.Writing)||'', LO_Mediation: (STATE.outcomes?.Mediation)||'', VocabularyList: vocabHtml, GrammarList: grammarHtml, LessonsBlocks: lessonsHtml, ProjectTitle: STATE.projectTitle||'', ProjectDescription: STATE.projectDescription||'', AssessmentTools: assessHtml };
}
async function exportOfficialDocFromState(STATE, filename='teacher_english_planner_official.doc'){
  const tpl = await loadTemplate();
  const data = buildDataFromState(STATE);
  const html = `<!DOCTYPE html><html><head><meta charset=\"utf-8\"><style>${tpl.css}</style></head><body>${fillTemplate(tpl.html, data)}</body></html>`;
  const a=document.createElement('a'); a.href=URL.createObjectURL(blobDoc(html)); a.download=filename; document.body.appendChild(a); a.click(); setTimeout(()=>{URL.revokeObjectURL(a.href); a.remove();},500);
}
