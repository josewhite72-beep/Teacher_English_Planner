// Exportar a PDF usando print del navegador
function mdToPrintableHtml(md){
  const esc = s => s.replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
  const lines = md.split('
');
  const body = lines.map(line => {
    if(line.startsWith('# ')) return `<h1>${esc(line.replace('# ', ''))}</h1>`;
    if(line.startsWith('## ')) return `<h2>${esc(line.replace('## ', ''))}</h2>`;
    if(line.startsWith('### ')) return `<h3>${esc(line.replace('### ', ''))}</h3>`;
    if(line.startsWith('- ')) return `<li>${esc(line.replace('- ', ''))}</li>`;
    if(line.trim()==='') return '<br/>';
    return `<p>${esc(line)}</p>`;
  }).join('
');
  const html = `<!DOCTYPE html><html><head><meta charset='utf-8'>
`+
    `<title>Plan MEDUCA – PDF</title>
`+
    `<style> @page{margin:20mm} body{font-family:Calibri,Arial,sans-serif} h1{font-size:18pt} h2{font-size:14pt} h3{font-size:12pt} p,li{font-size:11pt} ul{margin:6px 0 12px 18px}</style>`+
    `</head><body>${body}</body></html>`;
  return html;
}
function exportToPDF(md){ const html = mdToPrintableHtml(md); const w = window.open('', '_blank'); w.document.open(); w.document.write(html); w.document.close(); setTimeout(()=>{ w.print(); }, 300); }
