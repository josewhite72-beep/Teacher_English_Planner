# MEDUCA English Planner (PWA)
Archivos listos:
- index.html (interfaz)
- app.js (Scope por grado, vocabulario dinámico, generador Markdown)
- vocab_map.json (vocabulario por Scenario|Theme)
- md2doc.js (exportar a Word .doc)
- md2pdf.js (exportar a PDF vía impresión)
- service-worker.js (offline cache)
- manifest.json (config PWA)
- icons/icon-192.png, icon-512.png (íconos)

## Cómo desplegar en GitHub Pages
1) Sube todos los archivos a la raíz del repositorio.
2) Activa Pages: Settings → Pages → Branch: main → Folder: /root.
3) Abre el sitio, recarga. Si no ves cambios, sube una nueva versión del SW cambiando CACHE_VERSION.
