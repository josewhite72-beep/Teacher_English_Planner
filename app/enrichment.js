// app/enrichment.js
export function enrichTheme(themeObj, institutionalStandards = {}) {
  const enriched = { ...themeObj };

  // SMART Objectives
  if (!enriched.smart_objectives) {
    enriched.smart_objectives = [
      `Students will identify 5 vocabulary words related to "${themeObj.theme.name_en}" with 80% accuracy.`,
      `Students will create a short dialogue using target grammar structures within 10 minutes.`,
      `Students will demonstrate understanding of the theme through a creative project.`
    ];
  }

  // 21st-Century Project
  if (!enriched.project_21st) {
    enriched.project_21st = {
      title: `${themeObj.theme.name_en} Challenge`,
      description: `Students will create a presentation or poster showing how they apply the theme in real life.`,
      evidence: ["Presentation video", "Poster", "Written reflection"],
      micro_tasks: [
        "L1: Brainstorm ideas and vocabulary",
        "L2: Draft outline of project",
        "L3: Create visual elements",
        "L4: Practice oral presentation",
        "L5: Present & reflect"
      ]
    };
  }

  // Rubric
  if (!enriched.rubric) {
    enriched.rubric = {
      criteria: [
        { name: "Understanding", levels: ["Emerging", "Developing", "Achieved"] },
        { name: "Oral/Written Production", levels: ["Emerging", "Developing", "Achieved"] },
        { name: "Project Product", levels: ["Emerging", "Developing", "Achieved"] }
      ]
    };
  }

  // 6 Stages per lesson
  if (!enriched.lessons) {
    enriched.lessons = Array.from({ length: 5 }, (_, i) => ({
      lessonNumber: i + 1,
      stages: [
        { name: "Warm-up", content: "Review prior knowledge or activate schema." },
        { name: "Presentation", content: "Introduce new vocabulary/grammar through context." },
        { name: "Practice", content: "Guided exercises with teacher support." },
        { name: "Production", content: `Apply skills via ${enriched.project_21st.micro_tasks[i]}` },
        { name: "Reflection", content: "Discuss what was learned and challenges faced." },
        { name: "Homework", content: "Complete worksheet or prepare next step of project." }
      ]
    }));
  }

  return enriched;
}