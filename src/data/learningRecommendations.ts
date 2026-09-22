import type { CompetencyCategory } from "@/types/igot";

export interface LearningRecommendation {
  competency: string;
  category: CompetencyCategory;
  currentLevel: number;
  requiredLevel: number;
  gap: number;
  focus: string;
  action: string;
  iGotUrl: string;
}

const CATEGORY_FOCUS: Record<CompetencyCategory, string> = {
  Statistical: "Build stronger statistical concepts, methodology, and interpretation through role-relevant official-statistics learning.",
  Technical: "Strengthen the tools and data practices needed to apply the competency in a repeatable public-sector workflow.",
  "Digital Governance": "Develop secure, standards-based, accountable digital practices for official data and services.",
  "Behavioural & Managerial": "Improve professional judgement, communication, collaboration, and delivery in government work.",
};

const COMPETENCY_ACTIONS: Record<string, string> = {
  "Survey Design": "Review survey objectives, target population, concepts, questionnaire design, and collection strategy.",
  Sampling: "Practice selecting and evaluating sampling designs for different official-statistics populations.",
  "Data Quality": "Work through validation, completeness, consistency, accuracy, and anomaly-investigation scenarios.",
  "Descriptive Statistics": "Practice choosing appropriate summaries and interpreting distributions, outliers, and variability.",
  "Statistical Inference": "Strengthen estimation, confidence intervals, hypothesis testing, and uncertainty interpretation.",
  "Statistical Modeling": "Practice model specification, diagnostics, assumptions, interpretation, and limitations.",
  "Official Statistics & Indicators": "Study indicator definitions, classifications, comparability, revisions, and production methodology.",
  "Research Methodology": "Practice research design, benchmarking, evidence evaluation, assumptions, and methodological justification.",
  "Python for Data Analysis": "Build a repeatable Python workflow for validation, transformation, analysis, and reporting.",
  "SQL & Data Management": "Practice SQL filtering, joins, aggregation, validation, and structured data management.",
  "Data Visualization": "Practice selecting clear charts, consistent scales, labels, and dashboard views for official statistics.",
  "Data Architecture": "Review ingestion, validation, curated storage, interfaces, lineage, and analytical data architecture.",
  "Data Integration & APIs": "Practice API contracts, schema validation, identifiers, error handling, and reliable ingestion.",
  "Cloud Fundamentals": "Review cloud compute, storage, identity, monitoring, deployment, and scaling fundamentals.",
  "Reproducible Computing": "Practice versioning code and inputs, documenting workflows, and recording assumptions and environments.",
  "Data Privacy": "Review data minimization, access, classification, purpose limitation, and responsible handling practices.",
  Cybersecurity: "Strengthen secure handling, authorization, account protection, and operational risk awareness.",
  "Metadata & Data Standards": "Practice metadata, classifications, schemas, identifiers, and interoperability patterns.",
  "Digital Service Governance": "Review ownership, access controls, service standards, monitoring, and user-feedback mechanisms.",
  "Information Management": "Practice information lifecycle, naming, retention, access, versioning, and controlled repositories.",
  "Analytical Thinking": "Practice decomposing evidence, definitions, assumptions, anomalies, and alternative explanations.",
  Communication: "Practice explaining statistical findings, uncertainty, limitations, and implications to non-specialists.",
  "Decision Making": "Practice evidence-based decisions that account for uncertainty, risks, constraints, and context.",
  "Stakeholder Management": "Practice clarifying stakeholder needs, constraints, responsibilities, decision rights, and shared outcomes.",
  "Project Management": "Practice tracking milestones, dependencies, risks, owners, and delivery against fixed deadlines.",
  "Research Communication": "Practice communicating evidence, assumptions, performance, limitations, and appropriate use conditions.",
};

export function getLearningRecommendations(
  gaps: Array<{
    competency: string;
    category: CompetencyCategory | string;
    currentLevel: number;
    requiredLevel: number;
    gap: number;
  }>,
): LearningRecommendation[] {
  return gaps
    .filter((item) => item.gap > 0)
    .sort((a, b) => b.gap - a.gap || b.requiredLevel - a.requiredLevel)
    .slice(0, 5)
    .map((item) => {
      const category = item.category as CompetencyCategory;
      return {
        competency: item.competency,
        category,
        currentLevel: item.currentLevel,
        requiredLevel: item.requiredLevel,
        gap: item.gap,
        focus: CATEGORY_FOCUS[category] ?? "Build role-relevant capability through targeted learning.",
        action:
          COMPETENCY_ACTIONS[item.competency] ??
          `Develop the ${item.competency} competency through role-relevant learning and practice.`,
        iGotUrl: "https://igotkarmayogi.gov.in/",
      };
    });
}
