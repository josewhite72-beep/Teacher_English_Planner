
// app/app.js — MEDUCA v3 Enhancements
(function(){
  const STATUS = [];
  function pushStatus(ok, label){ STATUS.push({ok, label}); const li=document.createElement('li'); li.innerHTML = ok? `<span class='ok'>✔</span> ${label}` : `<span class='fail'>✖</span> ${label}`; document.getElementById('statusList').appendChild(li); }

  const STATE = { grade:'3', scenario:'', theme:'', scope:{}, canDo:{}, funGram:{}, vocabMap:{}, standards:{}, lessonMeta:[] };
  async function loadJSON(url){ try{ const r=await fetch(url); if(!r.ok) throw new Error(r.status); const j=await r.json(); pushStatus(true, `Cargado: ${url}`); return j; } catch(e){ pushStatus(false, `Fallo: ${url} (${e})`); throw e; } }
  async function initData(){
    STATE.scope   = await loadJSON('./scope_sequence_pk6.json');
    STATE.canDo   = await loadJSON('./can_do_pk6.json');
    STATE.funGram = await loadJSON('./functions_grammar_pk6.json');
    try { STATE.vocabMap = await loadJSON('./vocab_map.json'); } catch(e){ STATE.vocabMap = {}; }
    try { STATE.standards = await loadJSON('./standards_pk6.json'); } catch(e){ STATE.standards = {}; }
  }

  function initSelectors(){
    const gSel=document.getElementById('grade');
    const sSel=document.getElementById('scenario');
    const tSel=document.getElementById('theme');
    function refreshScenarios(){ sSel.innerHTML=''; tSel.innerHTML=''; const g=gSel.value; Object.keys(STATE.scope[g]||{}).forEach(sc=>{ const o=document.createElement('option'); o.value=sc; o.textContent=sc; sSel.appendChild(o); }); refreshThemes(); }
    function refreshThemes(){ tSel.innerHTML=''; const g=gSel.value, sc=sSel.value; (STATE.scope[g]?.[sc]||[]).forEach(th=>{ const o=document.createElement('option'); o.value=th; o.textContent=th; tSel.appendChild(o); }); STATE.grade=g; STATE.scenario=sc; STATE.theme=tSel.value||''; }
    gSel.addEventListener('change',refreshScenarios);
    sSel.addEventListener('change',refreshThemes);
    tSel.addEventListener('change',()=>STATE.theme=tSel.value);
    refreshScenarios();
  }

  function getDefaults(){ return { school:val('school'), teacher:val('teacher'), schoolYear:val('schoolYear'), term:val('term'), weeklyHours:val('weeklyHours'), weeks:val('weeks'), cefr:val('cefr') }; }
  function val(id){ return document.getElementById(id).value||''; }
  function buildOutcomes(g){ const cd = STATE.canDo[g]||{}; return { Listening:(cd.Listening||[])[0]||'', Speaking:(cd.Speaking||[])[0]||'', Reading:(cd.Reading||[])[0]||'', Writing:(cd.Writing||[])[0]||'', Mediation:(cd.Mediation||[])[0]||'Explains task to peers.' }; }
  function buildStandards(g){ const st = STATE.standards[g]||{}; return { Listening:(st.Listening||'').trim(), Speaking:(st.Speaking||'').trim(), Reading:(st.Reading||'').trim(), Writing:(st.Writing||'').trim(), Mediation:(st.Mediation||'').trim() }; }
  function buildVocab(sc,th){ const key=`${sc}|${th}`; return STATE.vocabMap[key]||[]; }
  function buildGrammar(g){ return STATE.funGram[g]?.grammar||[]; }
  function getLessonMeta(){
    const meta=[]; for(let i=1;i<=5;i++){ meta.push({date: val(`L${i}_date`), time: val(`L${i}_time`)}); } return meta;
  }
  function buildLessons(oc){ return ['Listening',' Speaking',' Reading',' Writing',' Mediation'].map(name=>name.trim()).map(n=>({ outcome: oc[n]||'', warmup: 'Engagement, Modeling and Clarification', presentation: 'Target language input', preparation: 'Guided practice setup', performance: 'Short performance / main task', assessment: 'Checklist / Post-task', reflection: 'Reflection / Exit ticket' })); }
  function buildState(){ const info=getDefaults(); const g=STATE.grade, sc=STATE.scenario, th=STATE.theme; const oc=buildOutcomes(g); const st=buildStandards(g); const vocab=buildVocab(sc,th); const gram=buildGrammar(g); const lessons=buildLessons(oc); const lessonMeta = getLessonMeta(); STATE.lessonMeta = lessonMeta; return { ...info, grade:g, scenario:sc, theme:th, context:val('context'), outcomes:oc, standards:st, vocabList:vocab, grammarList:gram, lessons:lessons, lessonMeta: lessonMeta };
  }

  function buildPreview(){ const S=buildState(); const md=[ '# Teacher English Lesson Plan', `\n## General Information\n**School:** ${S.school}\n**Teacher:** ${S.teacher}\n**Grade:** ${S.grade}\n**Scenario:** ${S.scenario}\n**Theme:** ${S.theme}\n**Year/Trimester:** ${S.schoolYear}/${S.term}\n**Weeks/Hours:** ${S.weeks} / ${S.weeklyHours}\n**CEFR:** ${S.cefr}`, `\n## Outcomes\n- (L) ${S.outcomes.Listening}\n- (S) ${S.outcomes.Speaking}\n- (R) ${S.outcomes.Reading}\n- (W) ${S.outcomes.Writing}\n- (M) ${S.outcomes.Mediation}`, `\n## Standards\n- (L) ${S.standards.Listening}\n- (S) ${S.standards.Speaking}\n- (R) ${S.standards.Reading}\n- (W) ${S.standards.Writing}\n- (M) ${S.standards.Mediation}`, `\n## Schedule\n${STATE.lessonMeta.map((m,i)=>`- Lesson ${i+1}: ${m.date} (${m.time} min)`).join('\n')}` ].join('\n'); document.getElementById('output').value=md; document.getElementById('preview').textContent=md; return S; }

  function wire(){
    document.getElementById('generate').addEventListener('click', buildPreview);
    document.getElementById('exportThemeDoc').addEventListener('click', async()=>{ const S=buildPreview(); if(typeof exportThemePlannerDocFromState==='function'){ await exportThemePlannerDocFromState(S,'theme_planner_official.doc'); } else alert('md2doc_official.js no cargado'); });
    document.getElementById('exportThemePdf').addEventListener('click', async()=>{ const S=buildPreview(); if(typeof exportThemePlannerPdfFromState==='function'){ await exportThemePlannerPdfFromState(S,'theme_planner_official'); } else alert('md2doc_official.js no cargado'); });
    document.getElementById('exportLessonsDoc').addEventListener('click', async()=>{ const S=buildPreview(); if(typeof exportLessonPlannerDocFromState==='function'){ await exportLessonPlannerDocFromState(S,'lesson_planner_1_5_official.doc'); } else alert('md2doc_official.js no cargado'); });
    document.getElementById('exportLessonsPdf').addEventListener('click', async()=>{ const S=buildPreview(); if(typeof exportLessonPlannerPdfFromState==='function'){ await exportLessonPlannerPdfFromState(S,'lesson_planner_1_5_official'); } else alert('md2doc_official.js no cargado'); });

    // Save / Load defaults
    document.getElementById('saveDefaults').addEventListener('click',()=>{ ['school','teacher','schoolYear','term','weeklyHours','weeks','cefr'].forEach(id=>localStorage.setItem(id, val(id))); alert('Configuración guardada'); });
    document.getElementById('loadDefaults').addEventListener('click',()=>{ ['school','teacher','schoolYear','term','weeklyHours','weeks','cefr'].forEach(id=>{ const v=localStorage.getItem(id); if(v) document.getElementById(id).value=v; }); alert('Configuración cargada'); });
    document.getElementById('clearCache').addEventListener('click', async ()=>{ try{ const names = await caches.keys(); await Promise.all(names.map(n=>caches.delete(n))); alert('Caché del Service Worker borrada. Recarga la página.'); }catch(e){ alert('No se pudo borrar caché: '+e.message); } });
  }

  window.addEventListener('DOMContentLoaded', async()=>{ await initData(); initSelectors(); wire(); });
})();
