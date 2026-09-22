import type { Course } from "@/types/skillFoundation";
import { COMPETENCY_CATALOG, getCompetencyById } from "./roleCompetencyData";

const IGOT_ALIGNED = "iGOT-aligned learning resource" as const;

const course = (
  id: string,
  title: string,
  description: string,
  competencies: string[],
  category: Course["category"],
  tags: string[],
  level: Course["level"],
  duration: string,
  type: Course["type"] = "Course",
): Course => ({
  id,
  title,
  provider: "Curated MVP catalogue",
  description,
  competencies,
  category,
  tags,
  level,
  duration,
  type,
  url: "https://igotkarmayogi.gov.in/",
  catalogueLabel: IGOT_ALIGNED,
});

export const MOCK_IGOT_COURSES: Course[] = [
  course("stat-survey-foundations", "Survey Design for Official Statistics", "iGOT-aligned learning resource covering survey objectives, questionnaire design, collection modes, and quality considerations.", ["survey-design", "data-quality"], "Statistical", ["survey", "questionnaire", "official-statistics"], 3, "3h 30m"),
  course("stat-sampling-practice", "Sampling Methods and Sample Design", "iGOT-aligned learning resource on probability sampling, sample frames, allocation, and sampling error.", ["sampling", "survey-design"], "Statistical", ["sampling", "sample-design", "survey"], 4, "4h"),
  course("stat-data-quality", "Data Quality for Official Statistics", "Curated MVP catalogue resource for quality dimensions, validation rules, anomaly checks, and quality reporting.", ["data-quality", "metadata-standards"], "Statistical", ["data-quality", "validation", "quality-framework"], 4, "3h"),
  course("stat-descriptive", "Descriptive Statistics and Statistical Tables", "Curated MVP catalogue resource for distributions, summary measures, tables, and interpretation.", ["descriptive-statistics"], "Statistical", ["statistics", "tables", "analysis"], 3, "2h 30m"),
  course("stat-inference", "Statistical Inference and Uncertainty", "iGOT-aligned learning resource covering estimation, confidence intervals, hypothesis tests, and uncertainty.", ["statistical-inference", "analytical-thinking"], "Statistical", ["inference", "estimation", "uncertainty"], 5, "5h"),
  course("stat-modeling", "Applied Statistical Modelling", "Curated MVP catalogue resource on regression, model interpretation, assumptions, and predictive use.", ["statistical-modeling", "statistical-inference"], "Statistical", ["regression", "modeling", "prediction"], 5, "5h 30m"),
  course("stat-indicators", "Official Statistics and Indicator Production", "iGOT-aligned learning resource for indicator definitions, production workflows, quality, and interpretation.", ["official-statistics-indicators", "metadata-standards"], "Statistical", ["official-statistics", "indicators", "SDG"], 4, "3h"),
  course("stat-methodology", "Research Methodology for Statistical Studies", "Curated MVP catalogue resource on study design, research questions, evidence, and methodological justification.", ["research-methodology", "analytical-thinking"], "Statistical", ["research", "methodology", "study-design"], 5, "4h 30m"),
  course("tech-python", "Python for Statistical Data Analysis", "iGOT-aligned learning resource for Python-based data cleaning, analysis, automation, and reporting.", ["python-data-analysis", "reproducible-computing"], "Technical", ["python", "pandas", "analysis"], 4, "6h"),
  course("tech-sql", "SQL for Data Management and Analysis", "Curated MVP catalogue resource for querying, joins, transformations, validation, and structured data management.", ["sql-data-management", "data-quality"], "Technical", ["sql", "databases", "data-management"], 4, "5h"),
  course("tech-viz", "Data Visualization for Evidence-Based Reporting", "iGOT-aligned learning resource on analytical charts, dashboards, storytelling, and responsible visual communication.", ["data-visualization", "communication"], "Technical", ["visualization", "dashboards", "reporting"], 4, "4h"),
  course("tech-architecture", "Data Architecture Fundamentals", "Curated MVP catalogue resource covering data layers, schemas, pipelines, storage, and maintainable architecture.", ["data-architecture", "metadata-standards"], "Technical", ["architecture", "data-platform", "schemas"], 5, "5h"),
  course("tech-apis", "Data Integration and API Fundamentals", "iGOT-aligned learning resource for API concepts, data exchange, ingestion, validation, and integration patterns.", ["data-integration-apis", "data-architecture"], "Technical", ["api", "integration", "etl"], 5, "4h 30m"),
  course("tech-cloud", "Cloud Fundamentals for Data Workloads", "Curated MVP catalogue resource covering cloud compute, storage, networking, identity, and deployment concepts.", ["cloud-fundamentals", "data-architecture"], "Technical", ["cloud", "storage", "compute"], 4, "4h"),
  course("tech-repro", "Reproducible Statistical Computing", "iGOT-aligned learning resource on version control, documented analysis, repeatable pipelines, and research traceability.", ["reproducible-computing", "python-data-analysis"], "Technical", ["reproducibility", "version-control", "documentation"], 4, "3h 30m"),
  course("gov-privacy", "Data Privacy and Responsible Data Handling", "iGOT-aligned learning resource on privacy-aware collection, minimization, access controls, and responsible use of official data.", ["data-privacy", "information-management"], "Digital Governance", ["privacy", "data-protection", "responsible-data"], 4, "3h"),
  course("gov-cyber", "Cybersecurity Essentials for Government Systems", "iGOT-aligned learning resource for identity, access, common threats, secure practices, and incident awareness.", ["cybersecurity", "data-privacy"], "Digital Governance", ["cybersecurity", "security", "risk"], 5, "4h"),
  course("gov-metadata", "Metadata and Data Standards", "Curated MVP catalogue resource on metadata, classifications, schemas, interoperability, and statistical data discovery.", ["metadata-standards", "information-management"], "Digital Governance", ["metadata", "standards", "interoperability"], 4, "3h 30m"),
  course("gov-digital", "Digital Governance and Public Service Delivery", "iGOT-aligned learning resource covering governance principles, accountability, service reliability, and digital public services.", ["digital-service-governance", "stakeholder-management"], "Digital Governance", ["digital-governance", "public-services", "accountability"], 4, "3h"),
  course("gov-information", "Information and Records Management", "Curated MVP catalogue resource for information lifecycle, records, retrieval, controlled sharing, and knowledge practices.", ["information-management", "metadata-standards"], "Digital Governance", ["records", "information-management", "knowledge"], 4, "3h"),
  course("beh-analytical", "Analytical Thinking for Public Sector Decisions", "iGOT-aligned learning resource on problem framing, evidence evaluation, assumptions, and structured reasoning.", ["analytical-thinking", "decision-making"], "Behavioural & Managerial", ["problem-solving", "evidence", "reasoning"], 4, "2h 30m"),
  course("beh-communication", "Communicating Data and Statistical Insights", "Curated MVP catalogue resource for concise technical writing, presentations, stakeholder-friendly explanations, and visual evidence.", ["communication", "research-communication"], "Behavioural & Managerial", ["communication", "presentation", "writing"], 4, "3h"),
  course("beh-decision", "Evidence-Based Decision Making", "iGOT-aligned learning resource for weighing evidence, uncertainty, constraints, and implementation context.", ["decision-making", "analytical-thinking"], "Behavioural & Managerial", ["decision-making", "evidence", "judgement"], 4, "2h 30m"),
  course("beh-stakeholders", "Stakeholder Management and Collaboration", "Curated MVP catalogue resource for requirements, coordination, feedback, conflict-aware collaboration, and stakeholder communication.", ["stakeholder-management", "communication"], "Behavioural & Managerial", ["stakeholders", "collaboration", "coordination"], 4, "3h"),
  course("beh-project", "Project Management for Digital and Data Initiatives", "iGOT-aligned learning resource on planning, milestones, risks, dependencies, delivery, and project monitoring.", ["project-management", "stakeholder-management"], "Behavioural & Managerial", ["project-management", "planning", "delivery"], 4, "4h"),
  course("beh-research", "Research Communication and Methodological Reporting", "Curated MVP catalogue resource for communicating methods, limitations, findings, and evidence in research reports.", ["research-communication", "research-methodology"], "Behavioural & Managerial", ["research", "reporting", "methods"], 5, "3h 30m"),
];

export function getCoursesForCompetency(competencyId: string): Course[] {
  return MOCK_IGOT_COURSES.filter((item) => item.competencies.includes(competencyId));
}

function validateCourseDataset(): void {
  const competencyIds = new Set(COMPETENCY_CATALOG.map((item) => item.id));
  const courseIds = new Set<string>();

  for (const item of MOCK_IGOT_COURSES) {
    if (courseIds.has(item.id)) throw new Error(`Duplicate course ID: ${item.id}`);
    courseIds.add(item.id);

    if (!item.competencies.length) {
      throw new Error(`Course has no competency mapping: ${item.id}`);
    }

    for (const competencyId of item.competencies) {
      if (!competencyIds.has(competencyId) || !getCompetencyById(competencyId)) {
        throw new Error(`Course ${item.id} references unknown competency: ${competencyId}`);
      }
    }

    if (item.level < 1 || item.level > 5) {
      throw new Error(`Invalid course level: ${item.id}`);
    }

    const canonicalCategories = new Set(COMPETENCY_CATALOG.filter((c) =>
      item.competencies.includes(c.id),
    ).map((c) => c.category));

    if (!canonicalCategories.has(item.category)) {
      throw new Error(`Course category mismatch: ${item.id}`);
    }
  }
}

validateCourseDataset();
