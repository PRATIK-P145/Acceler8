import type { Roadmap, RoadmapDay } from "@/hooks/useAssessment";
import { getLearningResourcesForGaps } from "@/data/learningResourceData";

type Gap = { competency: string; category: string; currentLevel: number; requiredLevel: number; gap: number };

export function buildPersonalizedRoadmap(role: string, gaps: Gap[]): Roadmap {
  const priorityGaps = [...gaps].filter((item) => item.gap > 0).sort((a, b) => b.gap - a.gap || b.requiredLevel - a.requiredLevel).slice(0, 5);
  const resources = getLearningResourcesForGaps(priorityGaps, 1);

  const days: RoadmapDay[] = priorityGaps.map((gap, index) => {
    const resource = resources.find((item) => item.competency === gap.competency);
    return {
      day: index + 1,
      title: "Build " + gap.competency,
      goals: [
        "Move " + gap.competency + " from Level " + gap.currentLevel + " toward Level " + gap.requiredLevel + ".",
        "Connect the competency to practical work in the " + role + " role.",
      ],
      activities: [
        resource ? "Complete the " + resource.title + " (" + resource.duration + ")." : "Study role-relevant material for " + gap.competency + ".",
        "Write down three practical takeaways and one question you still need to resolve.",
      ],
      resources: resource ? [{ title: resource.title, url: resource.url, type: "documentation" as const }] : [],
      practice: "Apply " + gap.competency + " to one realistic official-statistics scenario and record the approach, assumptions, and result.",
    };
  });

  if (days.length === 0) {
    days.push({
      day: 1,
      title: "Maintain your competency profile",
      goals: ["Review the competencies already meeting the role requirement.", "Choose one competency to deepen through advanced practice."],
      activities: ["Review recent work and identify one opportunity for deeper application.", "Record evidence that can be used during the next reassessment."],
      resources: [{ title: "Explore relevant learning on iGOT Karmayogi", url: "https://igotkarmayogi.gov.in/", type: "documentation" }],
      practice: "Select one recent work task and document how the competency was applied.",
    });
  }

  return {
    title: role + " — Personalized 5-Day Learning Path",
    overview: priorityGaps.length > 0
      ? "A focused learning path built from your assessment gaps. The plan prioritizes the " + priorityGaps.length + " highest-gap competencies and links each one to a competency-targeted iGOT learning entry point."
      : "Your assessment currently meets the defined role requirements. Use this short path to consolidate and document your existing capability.",
    days,
    tips: [
      "Work through one priority competency at a time rather than trying to close every gap simultaneously.",
      "Keep evidence of completed learning and practical application for the next reassessment.",
      "Reassess after completing the highest-priority learning activities so the competency profile can be updated.",
    ],
  };
}
