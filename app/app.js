
(function(){
  const t = {
    es: {uploadLogo:'Subir logo', saveCfg:'Guardar configuración', loadCfg:'Cargar configuración', clearSW:'Borrar caché del SW',
      instData:'Datos institucionales', school:'Escuela', teacher:'Docente', year:'Año', term:'Trimestre', hours:'Horas/semana', weeks:'Semanas',
      selection:'Selección', grade:'Grado', schedule:'Fechas y tiempos por lección'},
    en: {uploadLogo:'Upload logo', saveCfg:'Save settings', loadCfg:'Load settings', clearSW:'Clear SW cache',
      instData:'Institutional data', school:'School', teacher:'Teacher', year:'Year', term:'Term', hours:'Hours/week', weeks:'Weeks',
      selection:'Selection', grade:'Grade', schedule:'Dates & times per lesson'}
  };
  const DEFAULT_GRADES = ['Prekinder','Kinder','Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6'];
  const qs = s=>document.querySelector(s);
  const langSelect = qs('#langSelect');
  function applyLang(lang){
    const L=t[lang];
    qs('#uploadLogoLabel').textContent=L.uploadLogo; qs('#saveCfg').textContent=L.saveCfg; qs('#loadCfg').textContent=L.loadCfg; qs('#clearSW').textContent=L.clearSW;
    qs('#instDataTitle').textContent=L.instData; qs('#schoolLabel').textContent=L.school; qs('#teacherLabel').textContent=L.teacher; qs('#yearLabel').textContent=L.year;
    qs('#termLabel').textContent=L.term; qs('#hoursLabel').textContent=L.hours; qs('#weeksLabel').textContent=L.weeks; qs('#selectionTitle').textContent=L.selection;
    qs('#gradeLabel').textContent=L.grade; qs('#scheduleTitle').textContent=L.schedule; localStorage.setItem('planner.lang', lang);
  }
  langSelect.value = localStorage.getItem('planner.lang')||'es'; applyLang(langSelect.value); langSelect.addEventListener('change', e=>applyLang(e.target.value));
  const logoFile=qs('#logoFile'), logoPreview=qs('#logoPreview');
  function loadLogo(){ const d=localStorage.getItem('planner.logo'); if(d) logoPreview.src=d; else logoPreview.removeAttribute('src'); }
  loadLogo(); logoFile.addEventListener('change', e=>{ const f=e.target.files[0]; if(!f) return; const r=new FileReader(); r.onload=()=>{localStorage.setItem('planner.logo', r.result); loadLogo();}; r.readAsDataURL(f); });

  function getCfg(){ return { school:qs('#school').value, teacher:qs('#teacher').value, year:qs('#year').value, term:qs('#term').value, weeklyHours:qs('#weeklyHours').value, weeks:qs('#weeks').value, cefr:qs('#cefr').value }; }
  function setCfg(c){ qs('#school').value=c.school||''; qs('#teacher').value=c.teacher||''; qs('#year').value=c.year||''; qs('#term').value=c.term||''; qs('#weeklyHours').value=c.weeklyHours||''; qs('#weeks').value=c.weeks||''; qs('#cefr').value=c.cefr||'A1'; }
  qs('#saveCfg').addEventListener('click', ()=>{ localStorage.setItem('planner.cfg', JSON.stringify(getCfg())); alert('Configuración guardada'); });
  qs('#loadCfg').addEventListener('click', ()=>{ const c=JSON.parse(localStorage.getItem('planner.cfg')||'{}'); setCfg(c); });
  qs('#clearSW').addEventListener('click', async ()=>{ if('caches' in window){ const names=await caches.keys(); await Promise.all(names.map(n=>caches.delete(n))); } location.reload(); });

  const statusEl=qs('#jsonStatus'); const state={};
  const files=['scope_sequence_pk6.json','can_do_pk6.json','functions_grammar_pk6.json','vocab_map.json','standards_pk6.json'];
  async function loadJSON(name){ try{ const res=await fetch(name); if(!res.ok) throw new Error(res.statusText); const data=await res.json(); state[name]=data; statusEl.innerHTML += `✅ ${name}<br>`; } catch(e){ statusEl.innerHTML += `❌ ${name} (${e.message})<br>`; } }
  (async()=>{ for(const f of files) await loadJSON(f); initSelectors(); })();

  function normalize(data){
    const result={grades:[], scenarios:{}, themes:{}};
    if(!data){ result.grades = DEFAULT_GRADES.slice(); return result; }
    // Grades may come as: ['Prekinder','Kinder','Grade 1',...] or ['PK','K','1',...] or omitted
    if(Array.isArray(data.grades) && data.grades.length){
      result.grades = data.grades.map(g=>{
        // map common aliases
        if(/^pk|prek/i.test(g)) return 'Prekinder';
        if(/^k(inder)?$/i.test(g)) return 'Kinder';
        if(/^\d+$/.test(g)) return `Grade ${g}`;
        return String(g);
      });
    } else {
      // Infer from scenarios/themes keys or fallback to DEFAULT
      const keys = new Set([...(data.scenarios?Object.keys(data.scenarios):[]), ...(data.themes?Object.keys(data.themes):[])]);
      result.grades = keys.size? Array.from(keys) : DEFAULT_GRADES.slice();
    }
    // Scenarios per grade
    for(const g of result.grades){
      const raw = (data.scenarios && data.scenarios[g]) || (data.scenarios && data.scenarios[g.replace('Grade ','')] ) || [];
      let list=[];
      if(Array.isArray(raw)) list = raw.map(x=> typeof x==='string' ? {id:x, name:x} : {id:x.id||x.name, name:x.name||x.id});
      else if(typeof raw==='object' && raw){ list = Object.keys(raw).map(k=> ({id:k, name:raw[k].name||raw[k].title||k})); }
      // Helpful fallback
      if(list.length===0 && /Grade 3/i.test(g)) list=[{id:'places_i_can_go', name:'Places I Can Go'}];
      result.scenarios[g]=list;
    }
    // Themes nested grade→scenario
    for(const g of result.grades){
      result.themes[g] = result.themes[g] || {};
      const scenList = result.scenarios[g]||[];
      for(const s of scenList){
        const raw = (data.themes && data.themes[g] && (data.themes[g][s.id] || data.themes[g][s.name]))
                  || (data.themes && data.themes[g.replace('Grade ','')] && (data.themes[g.replace('Grade ','')][s.id] || data.themes[g.replace('Grade ','')][s.name]))
                  || [];
        let list=[];
        if(Array.isArray(raw)) list = raw.map(x=> typeof x==='string' ? {id:x, name:x} : {id:x.id||x.name, name:x.name||x.id});
        else if(typeof raw==='object' && raw) list = Object.keys(raw).map(k=> ({id:k, name:raw[k].name||raw[k].title||k}));
        if(list.length===0 && /Grade 3/i.test(g) && (s.id==='places_i_can_go' || s.name==='Places I Can Go')) list=[{id:'im_at_school', name:"I'm at School"}, {id:'in_my_community', name:'In My Community'}];
        result.themes[g][s.id] = list;
      }
    }
    return result;
  }

  const gradeSel=qs('#grade'), scenarioSel=qs('#scenario'), themeSel=qs('#theme');
  let model={grades:[],scenarios:{},themes:{}};
  function initSelectors(){
    model = normalize(state['scope_sequence_pk6.json']);
    gradeSel.innerHTML='';
    (model.grades.length?model.grades:DEFAULT_GRADES).forEach(g=>{ const o=document.createElement('option'); o.value=g; o.textContent=g; gradeSel.appendChild(o); });
    gradeSel.onchange = onGrade; // replace listener
    onGrade();
  }
  function onGrade(){
    const g = gradeSel.value || (model.grades[0]||DEFAULT_GRADES[0]);
    scenarioSel.innerHTML='';
    (model.scenarios[g]||[]).forEach(s=>{ const o=document.createElement('option'); o.value=s.id; o.textContent=s.name; scenarioSel.appendChild(o); });
    scenarioSel.onchange = onScenario;
    onScenario();
  }
  function onScenario(){
    const g = gradeSel.value || (model.grades[0]||DEFAULT_GRADES[0]); const sId = scenarioSel.value;
    themeSel.innerHTML='';
    (model.themes[g]?.[sId]||[]).forEach(th=>{ const o=document.createElement('option'); o.value=th.id; o.textContent=th.name; themeSel.appendChild(o); });
  }

  // Lesson schedule table
  const tbl=qs('#lessonTable');
  function renderTable(){ tbl.innerHTML=''; for(let i=1;i<=5;i++){ const tr=document.createElement('tr'); tr.innerHTML=`<td>Lesson ${i}</td><td><input type="date" id="date_${i}"></td><td><input type="number" id="time_${i}" min="15" step="5" value="40"></td>`; tbl.appendChild(tr);} const saved=JSON.parse(localStorage.getItem('planner.schedule')||'{}'); for(let i=1;i<=5;i++){ qs(`#date_${i}`).value=saved[`date_${i}`]||''; qs(`#time_${i}`).value=saved[`time_${i}`]||40; qs(`#date_${i}`).addEventListener('change', saveSchedule); qs(`#time_${i}`).addEventListener('change', saveSchedule); } }
  function saveSchedule(){ const s={}; for(let i=1;i<=5;i++){ s[`date_${i}`]=qs(`#date_${i}`).value; s[`time_${i}`]=qs(`#time_${i}`).value; } localStorage.setItem('planner.schedule', JSON.stringify(s)); }
  renderTable();

  // Standards panel
  const standardsPanel=qs('#standardsPanel');
  qs('#standardsFile').addEventListener('change', async e=>{ const f=e.target.files[0]; if(!f) return; const text=await f.text(); try{ state['institutional_standards.json']=JSON.parse(text); renderStandards(); }catch{ standardsPanel.textContent='Error al leer JSON institucional'; }});
  function renderStandards(){ const g=gradeSel.value; const s=scenarioSel.value; const th=themeSel.value; const src=state['institutional_standards.json']||state['standards_pk6.json']; if(!src){ standardsPanel.textContent='Sin estándares cargados'; return; } const items=(src?.[g]?.[s]?.[th])||[]; standardsPanel.innerHTML = items.length? '<ul>'+items.map(x=>`<li>${x.code||''} ${x.text||x}</li>`).join('')+'</ul>' : 'Sin estándares específicos para esta selección'; }
  scenarioSel.addEventListener('change', renderStandards); themeSel.addEventListener('change', renderStandards); gradeSel.addEventListener('change', renderStandards);

  function collect(){ return { cfg:getCfg(), grade:gradeSel.value, scenario:scenarioSel.selectedOptions[0]?.textContent||'', theme:themeSel.selectedOptions[0]?.textContent||'', schedule:JSON.parse(localStorage.getItem('planner.schedule')||'{}'), logo:localStorage.getItem('planner.logo')||'' }; }
  async function exportDOC(kind){ const ctx=collect(); const html=await window.templates.render(kind, ctx); const blob=new Blob([html], {type:'application/msword'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=kind==='theme'?'Theme_Planner.doc':'Lesson_Planners_1-5.doc'; a.click(); }
  async function exportPDF(kind){ const ctx=collect(); const html=await window.templates.render(kind, ctx); const w=window.open('', '_blank'); w.document.write(html); w.document.close(); w.focus(); w.print(); }
  qs('#exportThemeDOC').addEventListener('click', ()=>exportDOC('theme')); qs('#exportThemePDF').addEventListener('click', ()=>exportPDF('theme')); qs('#exportLessonDOC').addEventListener('click', ()=>exportDOC('lesson')); qs('#exportLessonPDF').addEventListener('click', ()=>exportPDF('lesson'));

  window.templates = { async render(kind, ctx){ const url = kind==='theme'? 'agents/english_agent/templates/theme_planner_template.html' : 'agents/english_agent/templates/lesson_planner_template.html'; const res=await fetch(url); const tpl=await res.text(); return tpl.replaceAll('{{LOGO}}', ctx.logo?`<img src="${ctx.logo}" style="width:80px;height:80px;object-fit:contain;"/>`: '') .replaceAll('{{SCHOOL}}', ctx.cfg.school||'') .replaceAll('{{TEACHER}}', ctx.cfg.teacher||'') .replaceAll('{{YEAR}}', ctx.cfg.year||'') .replaceAll('{{TERM}}', ctx.cfg.term||'') .replaceAll('{{GRADE}}', ctx.grade||'') .replaceAll('{{SCENARIO}}', ctx.scenario||'') .replaceAll('{{THEME}}', ctx.theme||'') .replaceAll('{{DATE_1}}', ctx.schedule.date_1||'') .replaceAll('{{DATE_2}}', ctx.schedule.date_2||'') .replaceAll('{{DATE_3}}', ctx.schedule.date_3||'') .replaceAll('{{DATE_4}}', ctx.schedule.date_4||'') .replaceAll('{{DATE_5}}', ctx.schedule.date_5||'') .replaceAll('{{TIME_1}}', ctx.schedule.time_1||'') .replaceAll('{{TIME_2}}', ctx.schedule.time_2||'') .replaceAll('{{TIME_3}}', ctx.schedule.time_3||'') .replaceAll('{{TIME_4}}', ctx.schedule.time_4||'') .replaceAll('{{TIME_5}}', ctx.schedule.time_5||''); } };
})();
