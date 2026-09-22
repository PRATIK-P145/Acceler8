import type {
  Competency,
  CompetencyCategory,
  ProficiencyLevel,
  Role,
  RoleCompetency,
  RoleProfile,
} from "@/types/skillFoundation";

const competency = (
  id: string,
  name: string,
  category: CompetencyCategory,
  description: string,
  tags: string[],
): Competency => ({ id, name, category, description, tags });

/**
 * Canonical competency dictionary for the PS26101 MVP.
 * Role profiles reference these IDs rather than redefining competency names.
 */
export const COMPETENCY_CATALOG: Competency[] = [
  competency("survey-design", "Survey Design", "Statistical", "Design surveys with clear objectives, populations, instruments, and collection strategies.", ["survey", "questionnaire", "data-collection"]),
  competency("sampling", "Sampling", "Statistical", "Select and evaluate sampling designs appropriate to official statistical requirements.", ["sampling", "sample-design", "survey"]),
  competency("data-quality", "Data Quality", "Statistical", "Assess completeness, consistency, accuracy, timeliness, and fitness of statistical data.", ["quality", "validation", "data-quality"]),
  competency("descriptive-statistics", "Descriptive Statistics", "Statistical", "Summarize datasets using appropriate measures, distributions, and statistical tables.", ["statistics", "analysis", "summarization"]),
  competency("statistical-inference", "Statistical Inference", "Statistical", "Apply estimation, confidence intervals, hypothesis testing, and uncertainty concepts.", ["inference", "estimation", "hypothesis-testing"]),
  competency("statistical-modeling", "Statistical Modeling", "Statistical", "Build and interpret statistical models for explanation, estimation, and prediction.", ["modeling", "regression", "prediction"]),
  competency("official-statistics-indicators", "Official Statistics & Indicators", "Statistical", "Interpret official statistical indicators, classifications, and indicator production workflows.", ["official-statistics", "indicators", "SDG"]),
  competency("research-methodology", "Research Methodology", "Statistical", "Plan rigorous quantitative research, including study design, evidence synthesis, and methodological justification.", ["research", "methodology", "study-design"]),
  competency("python-data-analysis", "Python for Data Analysis", "Technical", "Use Python for data preparation, statistical analysis, automation, and reproducible workflows.", ["python", "pandas", "automation"]),
  competency("sql-data-management", "SQL & Data Management", "Technical", "Query, transform, validate, and manage structured datasets using SQL and sound data practices.", ["sql", "databases", "data-management"]),
  competency("data-visualization", "Data Visualization", "Technical", "Create clear analytical charts and dashboards that support evidence-based interpretation.", ["visualization", "dashboards", "charts"]),
  competency("data-architecture", "Data Architecture", "Technical", "Design maintainable data structures, pipelines, interfaces, and analytical data architecture.", ["architecture", "data-platforms", "pipelines"]),
  competency("data-integration-apis", "Data Integration & APIs", "Technical", "Integrate data across systems using APIs, exchange formats, and reliable ingestion patterns.", ["api", "integration", "etl"]),
  competency("cloud-fundamentals", "Cloud Fundamentals", "Technical", "Understand core cloud concepts relevant to hosting, storage, compute, and data workloads.", ["cloud", "infrastructure", "deployment"]),
  competency("reproducible-computing", "Reproducible Computing", "Technical", "Use versioning, documented workflows, and repeatable computational practices for statistical work.", ["reproducibility", "version-control", "documentation"]),
  competency("data-privacy", "Data Privacy", "Digital Governance", "Handle official and personal data according to privacy, minimization, access, and responsible-use principles.", ["privacy", "personal-data", "responsible-data"]),
  competency("cybersecurity", "Cybersecurity", "Digital Governance", "Apply baseline security practices for systems, accounts, data, and operational workflows.", ["security", "cybersecurity", "risk"]),
  competency("metadata-standards", "Metadata & Data Standards", "Digital Governance", "Use metadata, classifications, schemas, and standards to make statistical data discoverable and interoperable.", ["metadata", "standards", "interoperability"]),
  competency("digital-service-governance", "Digital Service Governance", "Digital Governance", "Apply governance principles for reliable, accountable, user-centred digital public services.", ["digital-governance", "public-services", "governance"]),
  competency("information-management", "Information Management", "Digital Governance", "Organize, preserve, retrieve, and share information through controlled lifecycle practices.", ["records", "information-management", "knowledge"]),
  competency("analytical-thinking", "Analytical Thinking", "Behavioural & Managerial", "Break complex problems into evidence-based questions, assumptions, and actionable analytical steps.", ["problem-solving", "analysis", "reasoning"]),
  competency("communication", "Communication", "Behavioural & Managerial", "Explain technical and statistical findings clearly to specialist and non-specialist stakeholders.", ["communication", "presentation", "writing"]),
  competency("decision-making", "Decision Making", "Behavioural & Managerial", "Use evidence, uncertainty, constraints, and stakeholder context to make sound decisions.", ["decision-making", "evidence", "judgement"]),
  competency("stakeholder-management", "Stakeholder Management", "Behavioural & Managerial", "Coordinate expectations, requirements, feedback, and collaboration across stakeholders.", ["stakeholders", "collaboration", "coordination"]),
  competency("project-management", "Project Management", "Behavioural & Managerial", "Plan and monitor work, risks, dependencies, milestones, and delivery responsibilities.", ["project-management", "planning", "delivery"]),
  competency("research-communication", "Research Communication", "Behavioural & Managerial", "Communicate methodological choices, evidence, limitations, and conclusions in research settings.", ["research", "communication", "reporting"]),
];

const C = new Map(COMPETENCY_CATALOG.map((item) => [item.id, item]));

const roleCompetency = (
  id: string,
  requiredLevel: ProficiencyLevel,
  importance: RoleCompetency["importance"],
): RoleCompetency => {
  const item = C.get(id);
  if (!item) throw new Error(`Unknown competency ID in role dataset: ${id}`);
  return {
    competency: item.id,
    category: item.category,
    requiredLevel,
    importance,
    tags: item.tags,
  };
};

const role = (
  id: string,
  name: string,
  description: string,
  requirements: Array<[string, ProficiencyLevel, RoleCompetency["importance"]]>,
): RoleProfile => ({
  id,
  name,
  description,
  competencies: requirements.map(([competencyId, level, importance]) =>
    roleCompetency(competencyId, level, importance),
  ),
});

export const ROLE_PROFILES: Role[] = [
  role(
    "statistical-data-analyst",
    "Statistical Data Analyst",
    "Analyses statistical datasets, validates quality, produces indicators and communicates evidence for official statistics.",
    [
      ["survey-design", 3, "High"],
      ["sampling", 4, "Core"],
      ["data-quality", 5, "Core"],
      ["python-data-analysis", 4, "Core"],
      ["sql-data-management", 4, "Core"],
      ["data-visualization", 4, "High"],
      ["data-privacy", 3, "High"],
      ["metadata-standards", 3, "Supporting"],
      ["information-management", 3, "Supporting"],
      ["analytical-thinking", 4, "Core"],
      ["communication", 4, "High"],
      ["decision-making", 3, "High"],
    ],
  ),
  role(
    "statistical-officer",
    "Statistical Officer",
    "Coordinates statistical production, survey operations, quality assurance, reporting, and evidence-based administrative decisions.",
    [
      ["survey-design", 4, "Core"],
      ["sampling", 4, "Core"],
      ["data-quality", 5, "Core"],
      ["sql-data-management", 3, "High"],
      ["data-visualization", 3, "High"],
      ["python-data-analysis", 3, "Supporting"],
      ["data-privacy", 4, "High"],
      ["cybersecurity", 5, "Core"],
      ["metadata-standards", 4, "High"],
      ["information-management", 4, "High"],
      ["communication", 4, "High"],
      ["project-management", 4, "Core"],
    ],
  ),
  role(
    "data-it-systems-officer",
    "Data / IT Systems Officer",
    "Supports data platforms and digital systems, including architecture, integration, security, governance, and operational delivery.",
    [
      ["official-statistics-indicators", 3, "Supporting"],
      ["data-quality", 3, "Supporting"],
      ["descriptive-statistics", 3, "Supporting"],
      ["data-architecture", 4, "High"],
      ["data-integration-apis", 4, "Core"],
      ["cloud-fundamentals", 4, "High"],
      ["data-privacy", 4, "Core"],
      ["cybersecurity", 5, "Core"],
      ["digital-service-governance", 4, "High"],
      ["stakeholder-management", 4, "High"],
      ["project-management", 4, "Core"],
      ["communication", 4, "High"],
    ],
  ),
  role(
    "statistical-research-methodology-officer",
    "Statistical Research / Methodology Officer",
    "Develops and evaluates statistical methods, research designs, models, and methodological guidance for official statistics.",
    [
      ["survey-design", 5, "Core"],
      ["sampling", 5, "Core"],
      ["statistical-inference", 5, "Core"],
      ["python-data-analysis", 4, "High"],
      ["reproducible-computing", 4, "High"],
      ["data-visualization", 3, "Supporting"],
      ["data-privacy", 3, "Supporting"],
      ["metadata-standards", 4, "High"],
      ["information-management", 3, "Supporting"],
      ["analytical-thinking", 5, "Core"],
      ["research-communication", 5, "Core"],
      ["stakeholder-management", 3, "Supporting"],
    ],
  ),
];

export const ROLE_COMPETENCY_DATA = ROLE_PROFILES;

export function getRoleById(roleId: string): Role | undefined {
  return ROLE_PROFILES.find((item) => item.id === roleId);
}

export function getRoleCompetencies(roleId: string): RoleCompetency[] {
  return getRoleById(roleId)?.competencies ?? [];
}

export function getCompetenciesByCategory(
  category: CompetencyCategory,
  roleId?: string,
): Competency[] {
  const source = roleId
    ? getRoleCompetencies(roleId).map((item) => C.get(item.competency)).filter(Boolean) as Competency[]
    : COMPETENCY_CATALOG;

  return source.filter((item) => item.category === category);
}

export function getCompetencyById(competencyId: string): Competency | undefined {
  return C.get(competencyId);
}

function validateRoleDataset(): void {
  const ids = new Set<string>();

  for (const item of COMPETENCY_CATALOG) {
    if (ids.has(item.id)) throw new Error(`Duplicate competency ID: ${item.id}`);
    ids.add(item.id);
    if (!item.id || !item.name) throw new Error("Competency ID and name are required");
    if (!item.tags.length) throw new Error(`Competency has no tags: ${item.id}`);
  }

  for (const profile of ROLE_PROFILES) {
    const seen = new Set<string>();

    for (const item of profile.competencies) {
      if (seen.has(item.competency)) {
        throw new Error(`Duplicate competency ${item.competency} in role ${profile.id}`);
      }
      seen.add(item.competency);

      const canonical = C.get(item.competency);
      if (!canonical) throw new Error(`Unknown competency ${item.competency} in role ${profile.id}`);
      if (canonical.category !== item.category) {
        throw new Error(`Category mismatch for ${item.competency} in role ${profile.id}`);
      }
      if (item.requiredLevel < 1 || item.requiredLevel > 5) {
        throw new Error(`Invalid requiredLevel for ${item.competency} in role ${profile.id}`);
      }
    }
  }
}

validateRoleDataset();
