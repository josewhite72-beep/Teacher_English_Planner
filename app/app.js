
(function(){
  const qs = s=>document.querySelector(s);
  const gradeSel=qs('#grade'), scenarioSel=qs('#scenario'), themeSel=qs('#theme');
  const langSelect=qs('#langSelect');
  const logoFile=qs('#logoFile'); const logoPreview=document.createElement('img'); logoPreview.style.width='64px'; logoPreview.style.height='64px';
  const uploadLabel=qs('#uploadLogoLabel');

  // Theme toggle
  const themeToggle = qs('#themeToggle');
  document.body.setAttribute('data-theme', localStorage.getItem('planner.theme')||'dark');
  themeToggle.textContent = (localStorage.getItem('planner.theme')||'dark')==='dark'?'Modo claro':'Modo oscuro';
  themeToggle.onclick = ()=>{ const next = document.body.getAttribute('data-theme')==='dark'?'light':'dark'; document.body.setAttribute('data-theme', next); localStorage.setItem('planner.theme', next); themeToggle.textContent = next==='dark'?'Modo claro':'Modo oscuro'; };

  // Lang
  const t = { es:{uploadLogo:'Subir logo'}, en:{uploadLogo:'Upload logo'} };
  langSelect.value = localStorage.getItem('planner.lang')||'es';
  uploadLabel.textContent = t[langSelect.value].uploadLogo;
  langSelect.onchange = ()=>{ localStorage.setItem('planner.lang', langSelect.value); uploadLabel.textContent = t[langSelect.value].uploadLogo; };

  // Logo
  const header = document.querySelector('header'); header.appendChild(logoPreview);
  const logoData = localStorage.getItem('planner.logo'); if(logoData) logoPreview.src = logoData;
  logoFile.onchange = e=>{ const f=e.target.files[0]; if(!f) return; const r=new FileReader(); r.onload=()=>{ localStorage.setItem('planner.logo', r.result); logoPreview.src=r.result; }; r.readAsDataURL(f); };

  // Config save/load
  function getCfg(){ return { school:qs('#school').value, teacher:qs('#teacher').value, year:qs('#year').value, term:qs('#term').value, weeklyHours:qs('#weeklyHours').value, weeks:qs('#weeks').value, cefr:qs('#cefr').value, context:qs('#context').value }; }
  function setCfg(c){ qs('#school').value=c.school||''; qs('#teacher').value=c.teacher||''; qs('#year').value=c.year||''; qs('#term').value=c.term||''; qs('#weeklyHours').value=c.weeklyHours||''; qs('#weeks').value=c.weeks||''; qs('#cefr').value=c.cefr||''; qs('#context').value=c.context||''; }
  qs('#saveCfg').onclick = ()=>{ localStorage.setItem('planner.cfg', JSON.stringify(getCfg())); alert('Configuración guardada'); };
  qs('#loadCfg').onclick = ()=>{ const cfg = JSON.parse(localStorage.getItem('planner.cfg')||'{}'); setCfg(cfg); };
  qs('#clearSW').onclick = async ()=>{ if('caches' in window){ const names = await caches.keys(); await Promise.all(names.map(n=>caches.delete(n))); } location.reload(); };

  // Lesson schedule
  const tbl=qs('#lessonTable');
  function renderTable(){ tbl.innerHTML=''; for(let i=1;i<=5;i++){ const tr=document.createElement('tr'); tr.innerHTML=`<td>Lesson ${i}</td><td><input type="date" id="date_${i}"></td><td><input type="number" id="time_${i}" min="15" step="5" value="40"></td>`; tbl.appendChild(tr);} const saved=JSON.parse(localStorage.getItem('planner.schedule')||'{}'); for(let i=1;i<=5;i++){ qs(`#date_${i}`).value=saved[`date_${i}`]||''; qs(`#time_${i}`).value=saved[`time_${i}`]||40; qs(`#date_${i}`).addEventListener('change', saveSchedule); qs(`#time_${i}`).addEventListener('change', saveSchedule); } }
  function saveSchedule(){ const s={}; for(let i=1;i<=5;i++){ s[`date_${i}`]=qs(`#date_${i}`).value; s[`time_${i}`]=qs(`#time_${i}`).value; } localStorage.setItem('planner.schedule', JSON.stringify(s)); }
  renderTable();

  // Status
  const statusEl = qs('#jsonStatus');

  // Scope data exact mapping based on provided JSON structure
  let scopeData = null;
  async function loadScope(){
    try{ const res = await fetch('scope_sequence_pk6.json'); if(!res.ok) throw new Error(res.statusText); scopeData = await res.json(); statusEl.textContent = '✔ scope_sequence_pk6.json cargado'; }
    catch(e){ statusEl.textContent = '✖ scope_sequence_pk6.json no disponible'; scopeData = {}; }
    initGrade();
  }

  const GRADE_LABELS = [
    {label:'Pre-Kinder', key:'Pre-K'}, {label:'Kinder', key:'K'},
    {label:'Grade 1', key:'1'}, {label:'Grade 2', key:'2'}, {label:'Grade 3', key:'3'}, {label:'Grade 4', key:'4'}, {label:'Grade 5', key:'5'}, {label:'Grade 6', key:'6'}
  ];

  function initGrade(){
    gradeSel.innerHTML='';
    GRADE_LABELS.forEach(g=>{ if(scopeData[g.key]){ const o=document.createElement('option'); o.value=g.key; o.textContent=g.label; gradeSel.appendChild(o); } });
    gradeSel.onchange = onGradeChange; onGradeChange();
  }

  function onGradeChange(){
    scenarioSel.innerHTML=''; themeSel.innerHTML='';
    const gradeKey = gradeSel.value;
    const scenariosObj = scopeData[gradeKey] || {};
    Object.keys(scenariosObj).forEach(name=>{ const o=document.createElement('option'); o.value=name; o.textContent=name; scenarioSel.appendChild(o); });
    scenarioSel.onchange = onScenarioChange; onScenarioChange();
  }

  function onScenarioChange(){
    themeSel.innerHTML='';
    const gradeKey = gradeSel.value; const scenarioName = scenarioSel.value;
    const themesArray = (scopeData[gradeKey] && scopeData[gradeKey][scenarioName]) || [];
    themesArray.forEach(t=>{ const o=document.createElement('option'); o.value=t; o.textContent=t; themeSel.appendChild(o); });
  }

  // Markdown preview (simple)
  qs('#genPreview').onclick = ()=>{
    const cfg=getCfg();
    const md = `# Teacher English Lesson Plan

## General Information
**School:** ${cfg.school}
**Teacher:** ${cfg.teacher}
**Subject:** English
**Grade:** ${GRADE_LABELS.find(x=>x.key===gradeSel.value)?.label||''}
**School Year:** ${cfg.year}
**Term:** ${cfg.term}

## Curricular Focus
**Scenario:** ${scenarioSel.value}
**Theme:** ${themeSel.value}

## Context
${cfg.context}
`;
    qs('#mdPreview').value = md;
  };

  // Export bridge
  function collect(){ return { cfg:getCfg(), grade: GRADE_LABELS.find(x=>x.key===gradeSel.value)?.label||'', scenario: scenarioSel.value||'', theme: themeSel.value||'', schedule: JSON.parse(localStorage.getItem('planner.schedule')||'{}'), logo: localStorage.getItem('planner.logo')||'' }; }
  async function exportDOC(kind){ const ctx=collect(); const tplUrl = kind==='theme' ? 'agents/english_agent/templates/theme_planner_template.html' : 'agents/english_agent/templates/lesson_planner_template.html'; const res=await fetch(tplUrl); const tpl=await res.text(); const html = tpl.replaceAll('{{LOGO}}', ctx.logo?`<img src="${ctx.logo}" style="width:80px;height:80px;object-fit:contain;"/>`: '') .replaceAll('{{SCHOOL}}', ctx.cfg.school||'') .replaceAll('{{TEACHER}}', ctx.cfg.teacher||'') .replaceAll('{{YEAR}}', ctx.cfg.year||'') .replaceAll('{{TERM}}', ctx.cfg.term||'') .replaceAll('{{GRADE}}', ctx.grade||'') .replaceAll('{{SCENARIO}}', ctx.scenario||'') .replaceAll('{{THEME}}', ctx.theme||'') .replaceAll('{{DATE_1}}', ctx.schedule.date_1||'') .replaceAll('{{DATE_2}}', ctx.schedule.date_2||'') .replaceAll('{{DATE_3}}', ctx.schedule.date_3||'') .replaceAll('{{DATE_4}}', ctx.schedule.date_4||'') .replaceAll('{{DATE_5}}', ctx.schedule.date_5||'') .replaceAll('{{TIME_1}}', ctx.schedule.time_1||'') .replaceAll('{{TIME_2}}', ctx.schedule.time_2||'') .replaceAll('{{TIME_3}}', ctx.schedule.time_3||'') .replaceAll('{{TIME_4}}', ctx.schedule.time_4||'') .replaceAll('{{TIME_5}}', ctx.schedule.time_5||''); const blob=new Blob([html], {type:'application/msword'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download = kind==='theme' ? 'Theme_Planner.doc' : 'Lesson_Planners_1-5.doc'; a.click(); }
  async function exportPDF(kind){ const ctx=collect(); const res=await fetch(kind==='theme' ? 'agents/english_agent/templates/theme_planner_template.html' : 'agents/english_agent/templates/lesson_planner_template.html'); const tpl=await res.text(); const html = tpl.replaceAll('{{LOGO}}', ctx.logo?`<img src="${ctx.logo}" style="width:80px;height:80px;object-fit:contain;"/>`: '') .replaceAll('{{SCHOOL}}', ctx.cfg.school||'') .replaceAll('{{TEACHER}}', ctx.cfg.teacher||'') .replaceAll('{{YEAR}}', ctx.cfg.year||'') .replaceAll('{{TERM}}', ctx.cfg.term||'') .replaceAll('{{GRADE}}', ctx.grade||'') .replaceAll('{{SCENARIO}}', ctx.scenario||'') .replaceAll('{{THEME}}', ctx.theme||'') .replaceAll('{{DATE_1}}', ctx.schedule.date_1||'') .replaceAll('{{DATE_2}}', ctx.schedule.date_2||'') .replaceAll('{{DATE_3}}', ctx.schedule.date_3||'') .replaceAll('{{DATE_4}}', ctx.schedule.date_4||'') .replaceAll('{{DATE_5}}', ctx.schedule.date_5||'') .replaceAll('{{TIME_1}}', ctx.schedule.time_1||'') .replaceAll('{{TIME_2}}', ctx.schedule.time_2||'') .replaceAll('{{TIME_3}}', ctx.schedule.time_3||'') .replaceAll('{{TIME_4}}', ctx.schedule.time_4||'') .replaceAll('{{TIME_5}}', ctx.schedule.time_5||''); const w=window.open('', '_blank'); w.document.write(html); w.document.close(); w.focus(); w.print(); }
  qs('#exportThemeDOC').onclick = ()=>exportDOC('theme');
  qs('#exportThemePDF').onclick = ()=>exportPDF('theme');
  qs('#exportLessonDOC').onclick = ()=>exportDOC('lesson');
  qs('#exportLessonPDF').onclick = ()=>exportPDF('lesson');

  loadScope();
})();
