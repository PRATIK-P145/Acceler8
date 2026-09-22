import type { CompetencyCategory } from "@/types/igot";

export interface LearningResource {
  id: string;
  title: string;
  competency: string;
  category: CompetencyCategory;
  level: number;
  type: "iGOT learning" | "Practice guide";
  provider: string;
  duration: string;
  description: string;
  url: string;
}

const resource = (
  id: string,
  competency: string,
  category: CompetencyCategory,
  title: string,
  level: number,
  duration: string,
  description: string,
): LearningResource => ({
  id,
  title,
  competency,
  category,
  level,
  type: "iGOT learning",
  provider: "iGOT Karmayogi",
  duration,
  description,
  url: "https://igotkarmayogi.gov.in/",
});

/**
 * MVP resource map.
 * These are competency-targeted iGOT catalogue entry points, not claims that
 * the exact title below is a currently published iGOT course. A future
 * catalogue/API integration can replace each URL with a verified course URL.
 */
export const LEARNING_RESOURCES: LearningResource[] = [
  resource("survey-design-001", "Survey Design", "Statistical", "Survey Design learning path", 3, "2–3 hours", "Focus on survey objectives, target populations, questionnaire design, and collection planning."),
  resource("sampling-001", "Sampling", "Statistical", "Sampling methods learning path", 3, "2–3 hours", "Build practical understanding of sampling designs, strata, allocation, and representation."),
  resource("data-quality-001", "Data Quality", "Statistical", "Data quality and validation learning path", 3, "2 hours", "Practice completeness, consistency, validation rules, anomaly handling, and quality assurance."),
  resource("descriptive-statistics-001", "Descriptive Statistics", "Statistical", "Descriptive statistics learning path", 3, "2 hours", "Strengthen summaries, distributions, variability, outliers, and interpretation."),
  resource("statistical-inference-001", "Statistical Inference", "Statistical", "Statistical inference learning path", 4, "3 hours", "Review estimation, confidence intervals, hypothesis testing, and uncertainty."),
  resource("statistical-modeling-001", "Statistical Modeling", "Statistical", "Statistical modelling learning path", 4, "3 hours", "Practice model specification, diagnostics, assumptions, and interpretation."),
  resource("official-statistics-indicators-001", "Official Statistics & Indicators", "Statistical", "Official statistics and indicators learning path", 3, "2 hours", "Understand indicator definitions, classifications, comparability, and production methodology."),
  resource("research-methodology-001", "Research Methodology", "Statistical", "Research methodology learning path", 4, "3 hours", "Strengthen study design, evidence evaluation, benchmarking, and methodological justification."),
  resource("python-data-analysis-001", "Python for Data Analysis", "Technical", "Python for data analysis learning path", 3, "3 hours", "Build repeatable workflows for data preparation, analysis, automation, and reporting."),
  resource("sql-data-management-001", "SQL & Data Management", "Technical", "SQL and data management learning path", 3, "3 hours", "Practice querying, joins, aggregation, validation, and structured data management."),
  resource("data-visualization-001", "Data Visualization", "Technical", "Data visualization learning path", 3, "2 hours", "Practice clear charts, labels, scales, dashboards, and evidence-focused visual communication."),
  resource("data-architecture-001", "Data Architecture", "Technical", "Data architecture learning path", 4, "3 hours", "Review ingestion, validation, curated storage, interfaces, lineage, and analytical architecture."),
  resource("data-integration-apis-001", "Data Integration & APIs", "Technical", "Data integration and APIs learning path", 4, "3 hours", "Practice API contracts, schemas, identifiers, validation, and reliable ingestion."),
  resource("cloud-fundamentals-001", "Cloud Fundamentals", "Technical", "Cloud fundamentals learning path", 3, "2 hours", "Review compute, storage, identity, monitoring, deployment, and scaling fundamentals."),
  resource("reproducible-computing-001", "Reproducible Computing", "Technical", "Reproducible computing learning path", 4, "2 hours", "Practice versioning, documented workflows, assumptions, and repeatable computational processes."),
  resource("data-privacy-001", "Data Privacy", "Digital Governance", "Data privacy learning path", 3, "2 hours", "Strengthen data minimization, classification, access, purpose limitation, and responsible handling."),
  resource("cybersecurity-001", "Cybersecurity", "Digital Governance", "Cybersecurity learning path", 4, "2 hours", "Build secure handling, authorization, account protection, and operational risk awareness."),
  resource("metadata-standards-001", "Metadata & Data Standards", "Digital Governance", "Metadata and data standards learning path", 3, "2 hours", "Practice metadata, classifications, schemas, identifiers, and interoperability."),
  resource("digital-service-governance-001", "Digital Service Governance", "Digital Governance", "Digital service governance learning path", 4, "2 hours", "Review ownership, access controls, service standards, monitoring, and feedback."),
  resource("information-management-001", "Information Management", "Digital Governance", "Information management learning path", 3, "2 hours", "Practice information lifecycle, naming, retention, access, versioning, and controlled repositories."),
  resource("analytical-thinking-001", "Analytical Thinking", "Behavioural & Managerial", "Analytical thinking learning path", 4, "2 hours", "Practice decomposing evidence, assumptions, anomalies, and alternative explanations."),
  resource("communication-001", "Communication", "Behavioural & Managerial", "Communication for evidence and statistics learning path", 4, "2 hours", "Practice explaining findings, uncertainty, limitations, and implications clearly."),
  resource("decision-making-001", "Decision Making", "Behavioural & Managerial", "Evidence-based decision making learning path", 3, "2 hours", "Practice decisions that account for evidence, uncertainty, risks, and constraints."),
  resource("stakeholder-management-001", "Stakeholder Management", "Behavioural & Managerial", "Stakeholder management learning path", 4, "2 hours", "Practice clarifying needs, responsibilities, decision rights, feedback, and shared outcomes."),
  resource("project-management-001", "Project Management", "Behavioural & Managerial", "Project management learning path", 4, "2–3 hours", "Practice milestones, dependencies, risks, owners, and delivery tracking."),
  resource("research-communication-001", "Research Communication", "Behavioural & Managerial", "Research communication learning path", 4, "2 hours", "Practice communicating evidence, assumptions, performance, limitations, and appropriate use conditions."),
];

export function getLearningResourcesForGaps(
  gaps: Array<{ competency: string; currentLevel: number; requiredLevel: number; gap: number }>,
  limitPerCompetency = 2,
): LearningResource[] {
  return gaps
    .filter((gap) => gap.gap > 0)
    .slice(0, 5)
    .flatMap((gap) => {
      const resources = LEARNING_RESOURCES
        .filter((item) => item.competency === gap.competency)
        .sort(
          (a, b) =>
            Math.abs(a.level - gap.currentLevel) - Math.abs(b.level - gap.currentLevel),
        )
        .slice(0, limitPerCompetency);
      return resources;
    });
}
