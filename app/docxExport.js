
// app/docxExport.js
import { Document, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, AlignmentType, PageBreak, BorderStyle } from "docx";

export async function exportDocx(enriched, filename) {
  // Create the document structure
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Header with MEDUCA branding
        new Paragraph({
          children: [
            new TextRun({
              text: "REPUBLICA DE PANAMA",
              bold: true,
              size: 20,
            }),
          ],
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "MINISTERIO DE EDUCACION - MEDUCA",
              bold: true,
              size: 18,
            }),
          ],
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `GRADO: ${enriched.grade_label_en}`,
              bold: true,
              size: 16,
            }),
          ],
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({ children: [new TextRun({ text: " " })] }), // Empty line

        // Theme Planner Section
        new Paragraph({
          children: [new TextRun({ text: "PLANEADOR DE TEMA", bold: true, size: 24 })],
          heading: HeadingLevel.HEADING_1,
        }),
        new Paragraph({
          children: [new TextRun({ text: `Tema: ${enriched.theme.name_en}`, bold: true })],
        }),

        // Scenario
        new Paragraph({
          children: [new TextRun({ text: `Escenario: ${enriched.scenario.name_en}` })],
        }),

        // Standards
        new Paragraph({
          children: [new TextRun({ text: "ESTANDARES CURRICULARES", bold: true })],
          heading: HeadingLevel.HEADING_2,
        }),
        new Paragraph({ children: [new TextRun(`Escucha: ${enriched.standards.listening?.join(', ') || 'N/A'}`)] }),
        new Paragraph({ children: [new TextRun(`Lectura: ${enriched.standards.reading?.join(', ') || 'N/A'}`)] }),
        new Paragraph({ children: [new TextRun(`Habla: ${enriched.standards.speaking?.join(', ') || 'N/A'}`)] }),
        new Paragraph({ children: [new TextRun(`Escritura: ${enriched.standards.writing?.join(', ') || 'N/A'}`)] }),
        new Paragraph({ children: [new TextRun(`Mediación: ${enriched.standards.mediation?.join(', ') || 'N/A'}`)] }),

        // Learning Outcomes
        new Paragraph({
          children: [new TextRun({ text: "RESULTADOS DE APRENDIZAJE", bold: true })],
          heading: HeadingLevel.HEADING_2,
        }),
        new Paragraph({ children: [new TextRun(`Escucha: ${enriched.learning_outcomes.listening || 'N/A'}`)] }),
        new Paragraph({ children: [new TextRun(`Lectura: ${enriched.learning_outcomes.reading || 'N/A'}`)] }),
        new Paragraph({ children: [new TextRun(`Habla: ${enriched.learning_outcomes.speaking || 'N/A'}`)] }),
        new Paragraph({ children: [new TextRun(`Escritura: ${enriched.learning_outcomes.writing || 'N/A'}`)] }),
        new Paragraph({ children: [new TextRun(`Mediación: ${enriched.learning_outcomes.mediation || 'N/A'}`)] }),

        // Communicative Competences
        new Paragraph({
          children: [new TextRun({ text: "COMPETENCIAS COMUNICATIVAS", bold: true })],
          heading: HeadingLevel.HEADING_2,
        }),
        new Paragraph({ children: [new TextRun(`Gramática: ${enriched.communicative_competences.linguistic.grammar?.join(', ') || 'N/A'}`)] }),
        new Paragraph({ children: [new TextRun(`Vocabulario: ${enriched.communicative_competences.linguistic.vocabulary?.join(', ') || 'N/A'}`)] }),

        // SMART Objectives
        new Paragraph({
          children: [new TextRun({ text: "OBJETIVOS SMART", bold: true })],
          heading: HeadingLevel.HEADING_2,
        }),
        ...enriched.smart_objectives.map(obj => new Paragraph({ 
          children: [new TextRun(`• ${obj}`)], 
          spacing: { before: 120 } 
        })),

        // 21st Century Project
        new Paragraph({
          children: [new TextRun({ text: "PROYECTO DEL SIGLO XXI", bold: true })],
          heading: HeadingLevel.HEADING_2,
        }),
        new Paragraph({ children: [new TextRun(`Título: ${enriched.project_21st.title}`)] }),
        new Paragraph({ children: [new TextRun(`Descripción: ${enriched.project_21st.description}`)] }),
        new Paragraph({ children: [new TextRun(`Evidencia: ${enriched.project_21st.evidence?.join(', ') || 'N/A'}`)] }),
        new Paragraph({ children: [new TextRun("Micro-tareas:")] }),
        ...enriched.project_21st.micro_tasks.map(task => new Paragraph({ 
          children: [new TextRun(`• ${task}`)], 
          spacing: { before: 120 } 
        })),

        // Assessment Ideas
        new Paragraph({
          children: [new TextRun({ text: "IDEAS DE EVALUACIÓN", bold: true })],
          heading: HeadingLevel.HEADING_2,
        }),
        new Paragraph({ children: [new TextRun(`Formativa: ${enriched.assessment_ideas.formative?.join(', ') || 'N/A'}`)] }),
        new Paragraph({ children: [new TextRun(`Sumativa: ${enriched.assessment_ideas.summative?.join(', ') || 'N/A'}`)] }),
        new Paragraph({ children: [new TextRun(`Tarea: ${enriched.assessment_ideas.homework?.join(', ') || 'N/A'}`)] }),

        // Vocabulary Bank
        new Paragraph({
          children: [new TextRun({ text: "BANCO DE VOCABULARIO", bold: true })],
          heading: HeadingLevel.HEADING_2,
        }),
        new Paragraph({ children: [new TextRun(`${enriched.vocabulary_bank?.join(', ') || 'N/A'}`)] }),

        // Rubric
        new Paragraph({
          children: [new TextRun({ text: "RÚBRICA DE EVALUACIÓN", bold: true })],
          heading: HeadingLevel.HEADING_2,
        }),
        ...createRubricTable(enriched.rubric),

        // Page break before lessons
        new PageBreak(),

        // Lessons Section
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
      ],
    }],
  });

  // Generate Blob and download
  const blob = await window.docx.Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.replace(/[^a-zA-Z0-9_\-\.]/g, '_'); // Clean filename
  link.click();
  URL.revokeObjectURL(url);
}

// Helper function to create rubric table
function createRubricTable(rubric) {
  if (!rubric || !rubric.criteria) return [new Paragraph({ children: [new TextRun("No rubric data available")] })];

  const tableRows = [];

  // Header row
  tableRows.push(
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({ children: [new TextRun("Criterio")] })],
          width: { size: 3000, type: WidthType.DXA },
        }),
        ...rubric.criteria[0].levels.map(level => 
          new TableCell({
            children: [new Paragraph({ children: [new TextRun(level)] })],
            width: { size: 2000, type: WidthType.DXA },
          })
        ),
      ],
    })
  );

  // Data rows
  rubric.criteria.forEach(criterion => {
    tableRows.push(
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ children: [new TextRun(criterion.name)] })],
          }),
          ...criterion.levels.map(level => 
            new TableCell({
              children: [new Paragraph({ children: [new TextRun("")] })], // Empty cells for now
            })
          ),
        ],
      })
    );
  });

  return [new Table({
    rows: tableRows,
  })];
}
