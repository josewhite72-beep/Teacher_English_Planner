// Registro del Service Worker
if ('serviceWorker' in navigator) { window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js')); }

let VOCAB = {}; // se llenará desde vocab_map.json al iniciar
async function loadVocab() {
  try { const resp = await fetch('vocab_map.json'); VOCAB = await resp.json(); console.log('VOCAB cargado:', Object.keys(VOCAB).length, 'combinaciones'); }
  catch(e){ console.warn('No se pudo cargar vocab_map.json. Se usará vocabulario genérico.', e); VOCAB = {}; }
}

const SCOPE = {
  '1': [
    {scenario:'Meeting New Friends', themes:['This Is Me!','My Family']},
    {scenario:"It's a School Day!", themes:["Let's Listen!",'Stand Up!']},
    {scenario:'All Week Long!', themes:['Today Is Tuesday!','It's the Weekend.']},
    {scenario:'School Days', themes:["I'm at School.","I'm at the Market."]},
    {scenario:'Places I Can Go', themes:['This Is My Favorite.','It's the Best!']},
    {scenario:'Following Instructions at School', themes:['First, I Cut the Paper.','Let's Make a Poster!']},
    {scenario:'Me and My Family', themes:['Hold Up 10 Fingers!','Colors in Our World']},
    {scenario:'All About the Weather', themes:['A Perfect Day!','Dress for the Weather.']}
  ],
  '2': [
    {scenario:'Discovering Our Classroom', themes:["What's in Your Bag?","The Book Is on the Table."]},
    {scenario:'Shopping at the Market', themes:['How Much Is the Pineapple?','I Need Two Papayas, Please?']},
    {scenario:'The Local Farm Stand', themes:['How Much Are the Bananas?','I Need a Lot of Books!']},
    {scenario:'In the Library', themes:['How do I find a book in the library?','My Favorite Legend']},
    {scenario:'Legends of Panama', themes:['Once upon a Time…','My Favorite Movie Is... Because...']},
    {scenario:'Renewable Energy in Panama', themes:['What Is Renewable Energy?','Why Is Renewable Energy Important for Panama?']},
    {scenario:'Study Habits for Success', themes:['Learning to Manage Time','How I Learned to Focus']},
    {scenario:'Managing Stress in Changing Times', themes:['Breathing to Relax','Forest Bathing and Other Biohacks']}
  ],
  '3': [
    {scenario:'A Walk in the Neighborhood', themes:['Places I Can Go','A Trip to the Beach']},
    {scenario:'Exploring My Community', themes:["Let's Go Shopping!",'Time for Exercise']},
    {scenario:'Our Amazing Community', themes:['The Town Square','Career Goals']},
    {scenario:'Transportation in Panama', themes:["Where Is It?","Planning for a Friend's Visit"]},
    {scenario:'Panama's Role in the World', themes:['International Communication','Exploring Our Global Community']},
    {scenario:'Numbers Around Me', themes:['Let's Count to Five!','How Many?']},
    {scenario:"What's that Sound?", themes:['The Cat Says "Meow".','That's a Rooster!']},
    {scenario:'Colors of Things that Go', themes:['That's a Blue Bus.','That's a Red Bike. Because...']}
  ],
  '4': [
    {scenario:'Exploring Our Classroom', themes:['Things in My Classroom','Colors in My Classroom']},
    {scenario:'Our Routines', themes:['First, I Sit Down.','Pick It Up!']},
    {scenario:'Nice Weather Today!', themes:["It's Sunny!","It's Raining."]},
    {scenario:'School Life Adventures', themes:["That's a Big Book!","That's a Small, Brown, Bag."]},
    {scenario:'A Polite Request', themes:['Can I Have a Pencil?','Sorry, I Can't Help You.']},
    {scenario:'Helping in the Garden', themes:['The Tomatoes Grow Quickly.','These Plants Are from Panama.']},
    {scenario:'Taking Care of Our Classroom', themes:['We Are Sweeping the Floors.','Let's Arrange the Chairs.']},
    {scenario:'Keeping Our Communities Clean', themes:['We Should Clean the Classroom on Friday.','Who Will Bring the Cleaning Supplies?']}
  ],
  '5': [
    {scenario:'Panama's Wildlife', themes:['The Habitat of Wildlife','The Daily Habits of Animals']},
    {scenario:'The Power of Education', themes:['This Trimester, I Am Learning About...','Next Trimester, I Plan to Learn...']},
    {scenario:'Technology in Education', themes:['The Use of Technology in School','When It's Better To Ignore Technology']},
    {scenario:'Advice for Success', themes:['Academic Achievement and Skill Development: How?','My Advice for a Ninth Grader Is...']},
    {scenario:'Our Changing Forests', themes:['I Explored the Ecological History Of…','Saving for Future Goals!']},
    {scenario:'A Guide to Panama', themes:['Our Historical Sites','Take a Trip to the Panama Canal']},
    {scenario:'Cultural Connections', themes:['I Celebrate This Tradition Because...','In This Region, They Have a Custom Of...']},
    {scenario:'Our Community News', themes:['Reporting From the School!','Our Community Is Famous For…']}
  ],
  '6': [
    {scenario:"Let's Start a Club!", themes:['There Are So Many Types of Clubs!','Learning to Manage a Club']},
    {scenario:'Our Town Council', themes:['How Our Town Operates','How We Share Our Voice in the Community']},
    {scenario:'Supporting Our Community', themes:['How Does the Government Support Communities?','Volunteering in Our Community']},
    {scenario:'Sustainable Living', themes:['The Importance of Water','You Can Save Water By...']},
    {scenario:'Our Indigenous Heritage', themes:['Learning to Research History','Preserving Our Heritage']},
    {scenario:'International Communication', themes:['Introducing Panama to the World','Communicating Panama's Importance']},
    {scenario:'Robots on Earth and in Space', themes:["Advice for a Friend's Visit (Plan)","Technology & Society"]},
    {scenario:'Career Goals & Planning', themes:['Saving for Future Goals!','My Personal Success Story']}
  ]
};

function getScopeForGrade(grade){ return SCOPE[grade] || []; }
function populateScenarios(){
  const grade = document.getElementById('grade').value.trim();
  const scenarioSel = document.getElementById('scenario');
  const themeSel = document.getElementById('theme');
  scenarioSel.innerHTML = ''; themeSel.innerHTML = '';
  const list = getScopeForGrade(grade);
  list.forEach(item => { const opt = document.createElement('option'); opt.value = item.scenario; opt.textContent = item.scenario; scenarioSel.appendChild(opt); });
  if(list.length){ populateThemes(); }
}
function populateThemes(){
  const grade = document.getElementById('grade').value.trim();
  const scenario = document.getElementById('scenario').value;
  const themeSel = document.getElementById('theme'); themeSel.innerHTML = '';
  const list = getScopeForGrade(grade); const found = list.find(i => i.scenario === scenario);
  (found?.themes || []).forEach(t => { const opt = document.createElement('option'); opt.value = t; opt.textContent = t; themeSel.appendChild(opt); });
}

const grammarDefault = ['Present simple (SVO)','There is/There are','Prepositions (near, next to, across)','Adjectives (big/small)','Linker: because'];
function grammarByScenario(scenario){ if(scenario==='A Guide to Panama') return ['Past simple (facts)','Present simple (descriptions)','Linkers (first, then, finally; because; so)','Comparatives (older than)']; return grammarDefault; }

function generateMarkdown(){
  const school = document.getElementById('school').value||'CEBG Barrigón';
  const teacher = document.getElementById('teacher').value||'José White';
  const grade = document.getElementById('grade').value||'3';
  const year = document.getElementById('year').value||'2026';
  const term = document.getElementById('term').value||'Trimester 1';
  const level = document.getElementById('level').value;
  const scenario = document.getElementById('scenario').value;
  const theme = document.getElementById('theme').value;
  const context = document.getElementById('context').value||'Grupo de primaria en contexto panameño; recursos básicos; enfoque comunicativo y proyectos.';

  const key = `${scenario}|${theme}`;
  const vocab = VOCAB[key] || ['community','place','favorite','near','because','visit'];
  const grammar = grammarByScenario(scenario);

  const productionNote = level==='Básico' ? 'Producciones guiadas con plantillas y apoyos visuales; frases modelo.' : level==='Enriquecido' ? 'Mayor complejidad; reflexión crítica y extensión del producto final.' : 'Autonomía progresiva; producciones breves funcionales.';

  const md = `# MEDUCA English Planning (${grade})

`+
    `## 1. General Information
`+
    `- **School:** ${school}
- **Teacher:** ${teacher}
- **Subject:** English
- **Grade:** ${grade}
- **School year:** ${year}
- **Term:** ${term}

`+
    `## 2. Curricular Focus
`+
    `- **Scenario:** ${scenario}
- **Theme:** ${theme}

`+
    `## 3. Context
${context}

`+
    `## 4. General Objective (SMART)
`+
    `En 5 sesiones, los estudiantes identificarán y comunicarán contenidos del Scenario/Theme mediante oraciones simples y producciones breves, alcanzando ≥80% en instrumentos alineados (rúbricas/listas de cotejo).

`+
    `## 5. Learning Outcomes
`+
    `- **Listening:** Reconoce vocabulario e ideas clave del Scenario/Theme (≥80%).
`+
    `- **Speaking:** Expresa preferencias/ideas en oraciones simples con conectores básicos.
`+
    `- **Reading:** Localiza información específica en textos breves (50–150 palabras).
`+
    `- **Writing:** Redacta entre 5–6 oraciones (Gr.1–4) o 120–150 palabras (Gr.5–6) de forma organizada.
`+
    `- **Mediation:** Parafrasea información ES→EN en 2–5 oraciones manteniendo la idea central.

`+
    `## 6. Linguistic Content
`+
    `- **Key vocabulary:** ${vocab.join(', ')}
`+
    `- **Grammar structures:** ${grammar.join(', ')}

`+
    `## 7. Lessons (1–5)
`+
    `### Lesson 1 – Listening
- **LO específico:** Identificar vocabulario e ideas clave en audio/imagen (≥80%).
- **Warm-up:** Activación de conocimientos con soportes visuales.
- **Presentation:** Modelado del lenguaje y/o insumo (audio/imagen) del Scenario/Theme.
- **Practice:** Práctica guiada (señalar/parear).
- **Production:** Resumen oral en parejas (20–40 s). ${productionNote}
- **Assessment:** Lista de cotejo.
- **Closure:** Metacognición ("one fact").

`+
    `### Lesson 2 – Speaking
- **LO específico:** Expresar preferencias/ideas usando conectores básicos.
- **Warm-up:** Activación con imágenes/gestos.
- **Presentation:** Marcos de frase (My favorite ... because ...).
- **Practice:** Role-play de 30–60 s.
- **Production:** Mini presentación. ${productionNote}
- **Assessment:** Rúbrica simple.
- **Closure:** Palabra nueva.

`+
    `### Lesson 3 – Reading
- **LO específico:** Extraer datos específicos de un texto breve.
- **Warm-up:** Predicción por títulos.
- **Presentation:** Lectura guiada.
- **Practice:** Organizador Who/Where/What.
- **Production:** Preguntas y respuestas. ${productionNote}
- **Assessment:** Ítems de comprensión.
- **Closure:** Hecho sorprendente.

`+
    `### Lesson 4 – Writing
- **LO específico:** Producir texto acorde al grado con estructura básica.
- **Warm-up:** Banco de palabras/conectores.
- **Presentation:** Modelo de texto.
- **Practice:** Borrador guiado.
- **Production:** Póster o folleto. ${productionNote}
- **Assessment:** Lista de cotejo.
- **Closure:** Galería rápida.

`+
    `### Lesson 5 – Mediation
- **LO específico:** Parafrasear ES→EN de manera clara.
- **Warm-up:** Estrategias de mediación.
- **Presentation:** Ejemplos de paráfrasis.
- **Practice:** Duplas (reformulación).
- **Production:** Guion "Tourist welcome" (45–60 s). ${productionNote}
- **Assessment:** Rúbrica de mediación.
- **Closure:** Dos estrellas y un deseo.

`+
    `## 8. Final Project (21st Century Project)
- **Title:** Proyecto integrador del Scenario/Theme
- **Description:** Producto bilingüe (póster/folleto/audio con QR) que integre habilidades y competencias del siglo XXI.

`+
    `## 9. Assessment Tools
- Listas de cotejo por habilidad
- Rúbrica del proyecto (contenido, lenguaje, organización, colaboración)
- Observación guiada (participación, uso del inglés)
`;

  document.getElementById('preview').textContent = md; return md;
}

function download(md){ const blob = new Blob([md], {type:'text/markdown'}); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'plan_meduca_english.md'; a.click(); URL.revokeObjectURL(a.href); }

document.getElementById('generate').addEventListener('click', ()=>{ generateMarkdown(); });
document.getElementById('copyBtn').addEventListener('click', async ()=>{ const md = generateMarkdown(); try{ await navigator.clipboard.writeText(md); alert('Markdown copiado al portapapeles'); } catch(e){ alert('No se pudo copiar.'); } });
document.getElementById('downloadBtn').addEventListener('click', ()=>{ const md = generateMarkdown(); download(md); });
const docBtn = document.getElementById('docBtn'); if(docBtn){ docBtn.addEventListener('click', ()=>{ const md = generateMarkdown(); exportToDoc(md); }); }
const pdfBtn = document.getElementById('pdfBtn'); if(pdfBtn){ pdfBtn.addEventListener('click', ()=>{ const md = generateMarkdown(); exportToPDF(md); }); }

window.addEventListener('DOMContentLoaded', async () => { await loadVocab(); populateScenarios(); document.getElementById('grade').addEventListener('input', populateScenarios); document.getElementById('scenario').addEventListener('change', populateThemes); });
