// app/docxExport.js
import { Document, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, AlignmentType, PageBreak } from "docx";

export async function exportDocx(enriched, filename, isThemeOnly = false) {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Header MEDUCA
        new Paragraph({
          children: [new TextRun({
            text: "REPUBLICA DE PANAMA\nMINISTERIO DE EDUCACION - MEDUCA",
            bold: true,
            size: 18,
          })],
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({ children: [new TextRun({ text: " " })] }), // Empty line

        // Theme Planner
        new Paragraph({
          children: [new TextRun({ text: "PLANEADOR DE TEMA", bold: true, size: 24 })],
          heading: HeadingLevel.HEADING_1,
        }),
        new Paragraph({
          children: [new TextRun({ text: `Tema: ${enriched.theme.name_en}`, bold: true })],
        }),
        new Paragraph({
          children: [new TextRun({ text: `Escenario: ${enriched.scenario.name_en}` })],
        }),
        
        // Standards
        new Paragraph({
          children: [new TextRun({ text: "ESTANDARES CURRICULARES", bold: true })],
          heading: HeadingLevel.HEADING_2,
        }),
        ...["listening", "reading", "speaking", "writing", "mediation"].map(key => 
          new Paragraph({ children: [new TextRun(`${key}: ${enriched.standards[key]?.join(', ') || 'N/A'}`)] })
        ),
        
        // SMART Objectives
        new Paragraph({
          children: [new TextRun({ text: "OBJETIVOS SMART", bold: true })],
          heading: HeadingLevel.HEADING_2,
        }),
        ...enriched.smart_objectives.map(obj => new Paragraph({ 
          children: [new TextRun(`• ${obj}`)], 
          spacing: { before: 120 } 
        })),

        // Only add lessons if not theme-only
        ...(isThemeOnly ? [] : [
          new PageBreak(),
          ...enriched.lessons.map((lesson, idx) => [
            new Paragraph({
              children: [new TextRun({ 
                text: `LECCIÓN ${lesson.lessonNumber}: ${enriched.theme.name_en}`, 
                bold: true, 
                size: 20 
              })],
              heading: HeadingLevel.HEADING_1,
            }),
            ...lesson.stages.map(stage => [
              new Paragraph({
                children: [new TextRun({ text: `${stage.name}:`, bold: true })],
              }),
              new Paragraph({ 
                children: [new TextRun(stage.content)], 
                spacing: { before: 120 } 
              }),
            ]).flat(),
            new PageBreak(), // Page break after each lesson
          ]).flat(),
        ])
      ],
    }],
  });

  const blob = await window.docx.Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.replace(/[^a-zA-Z0-9_\-\.]/g, '_'); // Clean filename
  link.click();
  URL.revokeObjectURL(url);
}