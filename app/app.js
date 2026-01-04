
// app.js — Official export integration with preloaded STATE
const STATE = { grade:'3', scenario:'', theme:'', scope:{}, canDo:{}, funGram:{}, vocabMap:{}, rubrics:{} };

async function loadJSON(url){ const r=await fetch(url); if(!r.ok) throw new Error('Failed '+url); return r.json(); }
async function initData(){
  STATE.scope   = await loadJSON('scope_sequence_pk6.json');
  STATE.canDo   = await loadJSON('can_do_pk6.json');
  STATE.funGram = await loadJSON('functions_grammar_pk6.json');
  try { STATE.vocabMap = await loadJSON('vocab_map.json'); } catch(e){ STATE.vocabMap = {}; }
  try { STATE.rubrics  = await loadJSON('rubrics_pk6.json'); } catch(e){ STATE.rubrics = {}; }
}

function initSelectors(){
  const gSel=document.getElementById('grade'), sSel=document.getElementById('scenario'), tSel=document.getElementById('theme');
  function refreshScenarios(){ sSel.innerHTML=''; tSel.innerHTML=''; const g=gSel.value; Object.keys(STATE.scope[g]||{}).forEach(sc=>{const o=document.createElement('option'); o.value=sc; o.textContent=sc; sSel.appendChild(o);}); refreshThemes(); }
  function refreshThemes(){ tSel.innerHTML=''; const g=gSel.value, sc=sSel.value; (STATE.scope[g]?.[sc]||[]).forEach(th=>{const o=document.createElement('option'); o.value=th; o.textContent=th; tSel.appendChild(o);}); STATE.grade=g; STATE.scenario=sc; STATE.theme=tSel.value||''; }
  gSel.addEventListener('change',refreshScenarios); sSel.addEventListener('change',refreshThemes); tSel.addEventListener('change',()=>STATE.theme=tSel.value);
  refreshScenarios();
}

function getInstitutionDefaults(){
  const school = document.getElementById('school').value || localStorage.getItem('school') || 'CEBG Barrigón';
  const teacher= document.getElementById('teacher').value|| localStorage.getItem('teacher')|| 'José White';
  const schoolYear=document.getElementById('schoolYear').value|| localStorage.getItem('schoolYear')|| '2026';
  const term=document.getElementById('term').value|| localStorage.getItem('term')|| '1';
  return { school, teacher, schoolYear, term };
}

function buildOutcomes(g){
  const cd = STATE.canDo[g];
  if(!cd) return {Listening:'',Speaking:'',Reading:'',Writing:'',Mediation:''};
  const L = Array.isArray(cd.Listening)? cd.Listening[0] : (cd.Listening||'');
  const S = Array.isArray(cd.Speaking)?  cd.Speaking[0]  : (cd.Speaking||'');
  const R = Array.isArray(cd.Reading)?   cd.Reading[0]   : (cd.Reading||'');
  const W = Array.isArray(cd.Writing)?   cd.Writing[0]   : (cd.Writing||'');
  const M = (cd.Mediation && Array.isArray(cd.Mediation)) ? cd.Mediation[0] : (cd.Mediation||'Explains task to peers.');
  return {Listening:L, Speaking:S, Reading:R, Writing:W, Mediation:M};
}

function buildVocab(sc, th){ const key=`${sc}|${th}`; return STATE.vocabMap[key]||[]; }
function buildGrammar(g){ return (STATE.funGram[g]?.grammar)||[]; }
function buildLessons(outcomes){
  const names=['Listening','Speaking','Reading','Writing','Mediation'];
  return names.map(n=>({
    outcome: outcomes[n]||'',
    warmup:  n==='Listening'?'TPR':'Quick routine',
    presentation: 'Target language input',
    practice: 'Guided practice',
    production: 'Short task',
    assessment: 'Checklist',
    closure: 'Exit ticket'
  }));
}

function buildMarkdown(){
  const info = getInstitutionDefaults();
  const g=STATE.grade, sc=STATE.scenario, th=STATE.theme;
  const outcomes = buildOutcomes(g);
  const vocab = buildVocab(sc, th);
  const grammar = buildGrammar(g);
  const lessons = buildLessons(outcomes);
  const md=[
    '# Teacher English Lesson Plan',
    `\n## General Information\n**School:** ${info.school}\n**Teacher:** ${info.teacher}\n**Subject:** English\n**Grade:** ${g}\n**School Year:** ${info.schoolYear}\n**Term:** ${info.term}`,
    `\n## Curricular Focus\n**Scenario:** ${sc}\n**Theme:** ${th}`,
    `\n## Context\n${document.getElementById('context').value || 'Panamanian primary group; basic resources.'}`,
    `\n## SMART Objective\nBy the end of the unit, students will achieve target outcomes using vocabulary, functions, and structures with 80% accuracy in guided practice.`,
    `\n## Learning Outcomes\n- (L) ${outcomes.Listening}\n- (S) ${outcomes.Speaking}\n- (R) ${outcomes.Reading}\n- (W) ${outcomes.Writing}\n- (M) ${outcomes.Mediation}`,
    `\n## Linguistic Content\n**Vocabulary**\n${(vocab.length?vocab:['sample','words']).map(v=>`- ${v}`).join('\n')}\n\n**Grammar**\n${(grammar.length?grammar:['Can/Can\'t','There is/There are']).map(gm=>`- ${gm}`).join('\n')}`,
    `\n## Lessons 1–5\n${lessons.map((L,i)=>`### Lesson ${i+1}\n- Learning outcome: ${L.outcome}\n- Warm-up: ${L.warmup}\n- Presentation: ${L.presentation}\n- Practice: ${L.practice}\n- Production: ${L.production}\n- Assessment: ${L.assessment}\n- Closure: ${L.closure}`).join('\n\n')}`,
    `\n## Final Project\n**Title:** Class mini‑project\nProduct showcasing key vocabulary and functions.`,
    `\n## Assessment Tools\n- Checklist\n- Oral rubric\n- Exit tickets`
  ].join('\n');
  const out=document.getElementById('output'); out.value=md; return md;
}

function refreshPreview(){ document.getElementById('preview').textContent = document.getElementById('output').value || ''; }

function buildStateForOfficial(){
  const info = getInstitutionDefaults();
  const g=STATE.grade, sc=STATE.scenario, th=STATE.theme;
  const outcomes = buildOutcomes(g);
  const vocab = buildVocab(sc, th);
  const grammar = buildGrammar(g);
  const lessons = buildLessons(outcomes);
  return {
    school: info.school,
    teacher: info.teacher,
    grade: g,
    schoolYear: info.schoolYear,
    term: info.term,
    scenario: sc,
    theme: th,
    context: document.getElementById('context').value || 'Panamanian primary group; basic resources.',
    objectiveSMART: 'By the end of the unit, students will achieve target outcomes with 80% accuracy.',
    outcomes,
    vocabList: vocab,
    grammarList: grammar,
    lessons,
    projectTitle: 'Class mini‑project',
    projectDescription: 'Product showcasing key vocabulary and functions.',
    assessmentTools: ['Checklist','Oral rubric','Exit tickets']
  };
}

function wireUI(){
  document.getElementById('generate').addEventListener('click',()=>{ buildMarkdown(); refreshPreview(); });
  document.getElementById('copyBtn').addEventListener('click', async ()=>{ const md=buildMarkdown(); try{ await navigator.clipboard.writeText(md); alert('Markdown copiado'); }catch(e){ alert('No se pudo copiar'); }});
  document.getElementById('downloadBtn').addEventListener('click', ()=>{ const md=buildMarkdown(); const blob=new Blob([md],{type:'text/markdown'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='teacher_english_planner.md'; a.click(); URL.revokeObjectURL(a.href); });
  document.getElementById('docBtn').addEventListener('click', ()=>{ const md=buildMarkdown(); if(typeof exportToDoc==='function'){ exportToDoc(md,'teacher_english_planner.doc'); } else { alert('md2doc.js no cargado'); } });
  document.getElementById('pdfBtn').addEventListener('click', ()=>{ const md=buildMarkdown(); const html = `<!DOCTYPE html><html><head><meta charset='utf-8'><title>Teacher English Planner – PDF</title><style>@page{margin:20mm} body{font-family:Calibri,Arial,sans-serif} h1{font-size:18pt} h2{font-size:14pt} h3{font-size:12pt} p,li{font-size:11pt} ul{margin:6px 0 12px 18px}</style></head><body>${md.replace(/\n/g,'<br/>')}</body></html>`; const w=window; w.document.open('text/html','replace'); w.document.write(html); w.document.close(); setTimeout(()=>{ w.print(); }, 250); });
  document.getElementById('officialBtn').addEventListener('click', async ()=>{
    try{
      const S = buildStateForOfficial();
      if(typeof exportOfficialDocFromState==='function'){
        await exportOfficialDocFromState(S, 'teacher_english_planner_official.doc');
      } else {
        alert('No se encontró agents/english_agent/templates/md2doc_official.js');
      }
    }catch(e){ alert('Error exportando formato oficial: '+e.message); }
  });
}

window.addEventListener('DOMContentLoaded', async ()=>{
  await initData(); initSelectors(); buildMarkdown(); refreshPreview(); wireUI();
});
