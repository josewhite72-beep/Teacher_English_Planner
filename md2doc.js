// Exportar a Word (.doc) sin librerías externas.
function mdToHtml(md){
  const esc = s => s.replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
  const lines = md.split('
'); let inList = false; const out = [];
  for (const line of lines) {
    if(line.startsWith('# ')) { if(inList){ out.push('</ul>'); inList=false; } out.push(`<h1>${esc(line.replace('# ', ''))}</h1>`); }
    else if(line.startsWith('## ')) { if(inList){ out.push('</ul>'); inList=false; } out.push(`<h2>${esc(line.replace('## ', ''))}</h2>`); }
    else if(line.startsWith('### ')) { if(inList){ out.push('</ul>'); inList=false; } out.push(`<h3>${esc(line.replace('### ', ''))}</h3>`); }
    else if(line.startsWith('- ')) { if(!inList){ out.push('<ul>'); inList=true; } out.push(`<li>${esc(line.replace('- ', ''))}</li>`); }
    else if(line.trim()==='') { if(inList){ out.push('</ul>'); inList=false; } out.push('<br/>'); }
    else { if(inList){ out.push('</ul>'); inList=false; } out.push(`<p>${esc(line)}</p>`); }
  }
  if(inList){ out.push('</ul>'); } return out.join('
');
}
function exportToDoc(md){
  const htmlContent = mdToHtml(md);
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
`+
    `<style>body{font-family:Calibri,Arial,sans-serif} h1{font-size:20pt} h2{font-size:16pt} h3{font-size:13pt} p,li{font-size:11pt} ul{margin:6px 0 12px 18px}</style>`+
    `</head><body>${htmlContent}</body></html>`;
  const blob = new Blob([html], {type:'application/msword'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'plan_meduca_english.doc'; a.click(); URL.revokeObjectURL(a.href);
}
