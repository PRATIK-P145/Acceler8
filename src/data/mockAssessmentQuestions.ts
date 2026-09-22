import type { AssessmentQuestion, CompetencyCategory } from "@/types/igot";
import { getCompetencyById } from "@/data/roleCompetencyData";
import type { RoleCompetency } from "@/types/skillFoundation";

const CATEGORIES: CompetencyCategory[] = [
  "Statistical",
  "Technical",
  "Digital Governance",
  "Behavioural & Managerial",
];

type QuestionSpec = Omit<AssessmentQuestion, "competency" | "category" | "requiredLevel">;

const QUESTION_BANK: Record<string, QuestionSpec> = {
  "Survey Design": {
    question: "A state statistical office is planning a household survey to estimate employment conditions. Which first step most directly improves the validity of the survey design?",
    options: [
      "Define the target population, survey objectives, concepts, and measurement requirements",
      "Choose a dashboard tool before defining the variables",
      "Collect responses from the easiest households to reach",
      "Publish preliminary percentages before checking the questionnaire",
    ],
    correct_answer: "A",
    reasoning: "A clear target population, purpose, concepts, and measurement plan provides the foundation for the questionnaire, sampling, and collection strategy.",
    difficulty: "Medium",
  },
  Sampling: {
    question: "An official statistics team needs an estimate for rural and urban households, but rural households are a smaller share of the population. Which design can ensure adequate representation of both groups?",
    options: [
      "Stratified sampling with an appropriate allocation across rural and urban strata",
      "Only surveying households closest to the district office",
      "Selecting respondents entirely by alphabetical order",
      "Removing rural households from the sampling frame",
    ],
    correct_answer: "A",
    reasoning: "Stratification separates important population groups and allows the sample to deliberately represent each group.",
    difficulty: "Medium",
  },
  "Data Quality": {
    question: "During validation of an administrative dataset, one district reports impossible negative values for household size. What is the most appropriate first response?",
    options: [
      "Flag the records using a validation rule and investigate the source and correction process",
      "Silently replace every negative value with zero",
      "Delete the entire district from the dataset",
      "Ignore the values because the final dashboard is only descriptive",
    ],
    correct_answer: "A",
    reasoning: "A controlled validation rule identifies the anomaly while preserving an audit trail and allowing the source process to be investigated.",
    difficulty: "Medium",
  },
  "Descriptive Statistics": {
    question: "A department wants to compare the distribution of monthly household expenditure across districts with strong outliers. Which summary is generally more robust to extreme values?",
    options: [
      "Median and interquartile range",
      "Maximum value alone",
      "A list of only the smallest observations",
      "The number of columns in the dataset",
    ],
    correct_answer: "A",
    reasoning: "Median and interquartile range describe the centre and spread while being less sensitive to extreme observations than the mean and standard deviation.",
    difficulty: "Medium",
  },
  "Statistical Inference": {
    question: "A survey estimates the proportion of households using a public service. What does a 95% confidence interval primarily communicate?",
    options: [
      "The uncertainty associated with the estimated population parameter under the sampling procedure",
      "That 95% of sampled households gave identical answers",
      "That the estimate has no sampling error",
      "That every future sample must produce the same interval",
    ],
    correct_answer: "A",
    reasoning: "A confidence interval quantifies sampling uncertainty around an estimate under the assumptions of the statistical procedure used.",
    difficulty: "Medium",
  },
  "Statistical Modeling": {
    question: "An analyst models district-level service uptake using population characteristics and income indicators. What should be checked before interpreting model coefficients?",
    options: [
      "Model assumptions, variable definitions, diagnostics, and the suitability of the specification",
      "Only whether the chart uses the department's preferred font",
      "Whether every coefficient is positive",
      "Whether the model has the largest possible number of predictors",
    ],
    correct_answer: "A",
    reasoning: "Interpretation depends on an appropriate specification and reasonable assumptions, supported by diagnostics and clear variable definitions.",
    difficulty: "Medium",
  },
  "Official Statistics & Indicators": {
    question: "A ministry publishes an official indicator for school completion. What is most important when comparing the indicator across years?",
    options: [
      "Use a consistent definition, classification, population base, and documented production methodology",
      "Compare only the largest annual value",
      "Change the denominator whenever the result looks unusual",
      "Treat every revision as an error without checking methodology",
    ],
    correct_answer: "A",
    reasoning: "Comparability depends on stable concepts, definitions, classifications, denominators, and transparent methodological documentation.",
    difficulty: "Medium",
  },
  "Research Methodology": {
    question: "A methodology unit is testing a new estimation method for an official indicator. Which approach provides the strongest evidence before adoption?",
    options: [
      "Compare the method against an appropriate benchmark using reproducible experiments and documented limitations",
      "Adopt it because it produces the highest estimate",
      "Test it only on one convenient dataset",
      "Avoid documenting assumptions to keep the method simple",
    ],
    correct_answer: "A",
    reasoning: "A benchmarked, reproducible evaluation reveals performance, sensitivity, assumptions, and limitations before a method is operationalized.",
    difficulty: "Medium",
  },
  "Python for Data Analysis": {
    question: "An analyst receives monthly CSV files from multiple districts with the same schema. What is the most maintainable Python workflow?",
    options: [
      "Build a repeatable script that validates, transforms, combines, and logs the files",
      "Manually edit every CSV before each analysis",
      "Copy values into screenshots for the final report",
      "Run transformations only once and discard the code",
    ],
    correct_answer: "A",
    reasoning: "A repeatable script reduces manual error and makes the data preparation process auditable and reproducible.",
    difficulty: "Medium",
  },
  "SQL & Data Management": {
    question: "A statistical database contains millions of transaction records. A report needs totals grouped by district and month. Which approach is appropriate?",
    options: [
      "Use SQL aggregation with appropriate grouping and validated date and district fields",
      "Export every row to a spreadsheet before calculating totals manually",
      "Delete duplicate-looking rows without defining duplication rules",
      "Use only the first 100 records as the estimate",
    ],
    correct_answer: "A",
    reasoning: "Database-side aggregation is efficient and auditable when grouping fields and data definitions are validated.",
    difficulty: "Medium",
  },
  "Data Visualization": {
    question: "A public dashboard compares unemployment rates across states over five years. Which visualization choice best supports comparison?",
    options: [
      "Use a consistent scale, clear labels, and a chart suited to comparing trends across states",
      "Use a separate random scale for each state",
      "Remove the time axis to reduce visual complexity",
      "Use decorative 3D effects to emphasize selected states",
    ],
    correct_answer: "A",
    reasoning: "Consistent scales, labels, and an appropriate trend visualization make comparisons interpretable and reduce misleading visual emphasis.",
    difficulty: "Medium",
  },
  "Data Architecture": {
    question: "A department needs a platform that receives survey data, validates it, stores curated datasets, and serves indicators to analysts. Which architecture principle is most important?",
    options: [
      "Separate ingestion, validation, curated storage, and consumption concerns with clear interfaces",
      "Store every stage in one uncontrolled spreadsheet",
      "Allow dashboards to directly modify raw source records",
      "Duplicate the same dataset independently in every application",
    ],
    correct_answer: "A",
    reasoning: "Clear layers and interfaces improve maintainability, lineage, validation, and controlled access across the data lifecycle.",
    difficulty: "Medium",
  },
  "Data Integration & APIs": {
    question: "Two government systems exchange district-level statistics through an API. What should the integration layer validate before loading data?",
    options: [
      "Schema, required fields, data types, identifiers, and expected response status",
      "Only the API logo shown in the documentation",
      "Only whether the response contains more than 10 rows",
      "Whether the receiving screen uses the same font as the source system",
    ],
    correct_answer: "A",
    reasoning: "Contract and data validation catches structural and semantic problems before they contaminate downstream systems.",
    difficulty: "Medium",
  },
  "Cloud Fundamentals": {
    question: "A statistical application must store datasets and run analysis jobs without maintaining physical servers. Which cloud concepts are most directly relevant?",
    options: [
      "Managed storage, compute resources, access control, monitoring, and scalable deployment",
      "Only changing the application's color palette",
      "Printing all datasets before deployment",
      "Removing authentication so cloud services are easier to access",
    ],
    correct_answer: "A",
    reasoning: "Cloud deployments require suitable compute and storage plus identity, security, observability, and scaling considerations.",
    difficulty: "Medium",
  },
  "Reproducible Computing": {
    question: "A methodology team needs another analyst to reproduce an annual statistical estimate six months later. What practice is most useful?",
    options: [
      "Version the code and inputs, document the workflow, and record the environment and assumptions",
      "Keep only the final spreadsheet and delete intermediate code",
      "Rely on memory of the steps taken",
      "Change the calculation manually each year without recording the change",
    ],
    correct_answer: "A",
    reasoning: "Versioning, documentation, and recorded assumptions make computational results repeatable and auditable.",
    difficulty: "Medium",
  },
  "Data Privacy": {
    question: "A team preparing an official dataset for analysis does not need individual phone numbers. What is the appropriate privacy practice?",
    options: [
      "Minimize collection or exposure of personal data that is not necessary for the stated purpose",
      "Publish the phone numbers to make the dataset more transparent",
      "Copy personal identifiers into every analytical table",
      "Share the full raw dataset with all users by default",
    ],
    correct_answer: "A",
    reasoning: "Data minimization reduces unnecessary exposure and aligns data handling with the legitimate purpose of processing.",
    difficulty: "Medium",
  },
  Cybersecurity: {
    question: "An officer receives a request to upload a sensitive statistical extract to an unknown external service for quick analysis. What should happen first?",
    options: [
      "Verify authorization, security requirements, data classification, and approved handling channels",
      "Upload it immediately because the service is convenient",
      "Remove only the filename and upload the full extract",
      "Share the account password with the service provider",
    ],
    correct_answer: "A",
    reasoning: "Sensitive data should only be handled through authorized channels after security and access requirements are verified.",
    difficulty: "Medium",
  },
  "Metadata & Data Standards": {
    question: "Two departments use different names for the same district classification. What would most improve interoperability?",
    options: [
      "Use shared metadata, standard classifications, stable identifiers, and documented mappings",
      "Let every system invent its own identifiers",
      "Remove district information from both datasets",
      "Rename fields randomly until the files look similar",
    ],
    correct_answer: "A",
    reasoning: "Shared standards and identifiers allow systems to interpret and exchange data consistently.",
    difficulty: "Medium",
  },
  "Digital Service Governance": {
    question: "A public statistical portal is being redesigned. Which governance practice best supports accountable digital service delivery?",
    options: [
      "Define ownership, service standards, access controls, monitoring, and mechanisms for user feedback",
      "Allow any application to change production data without approval",
      "Measure success only by visual appearance",
      "Hide service limitations from users",
    ],
    correct_answer: "A",
    reasoning: "Clear ownership, controls, monitoring, standards, and feedback mechanisms support reliable and accountable public digital services.",
    difficulty: "Medium",
  },
  "Information Management": {
    question: "A statistical office stores survey documentation, approvals, datasets, and final reports across many teams. What practice best supports retrieval and accountability?",
    options: [
      "Apply a documented information lifecycle with naming, access, retention, versioning, and controlled repositories",
      "Store everything in personal folders without naming conventions",
      "Delete source documentation after publication",
      "Keep multiple untracked copies on individual devices",
    ],
    correct_answer: "A",
    reasoning: "Lifecycle controls make information easier to retrieve, protect, version, retain, and audit.",
    difficulty: "Medium",
  },
  "Analytical Thinking": {
    question: "A district reports a sudden 40% fall in a key indicator. What is the strongest analytical first step?",
    options: [
      "Break the result into definitions, source data, comparison periods, and possible process changes before concluding",
      "Immediately declare that the underlying population has fallen by 40%",
      "Remove the district from the report",
      "Choose the explanation that sounds most plausible and publish it",
    ],
    correct_answer: "A",
    reasoning: "Decomposing the claim and checking definitions, data, comparators, and process changes helps distinguish real changes from data or methodological issues.",
    difficulty: "Medium",
  },
  Communication: {
    question: "A statistical analyst must brief senior officials who are not statisticians about an uncertain estimate. What is the clearest approach?",
    options: [
      "Explain the finding in plain language, show the uncertainty, and state the key limitation and implication",
      "Use technical terminology without interpretation",
      "Hide uncertainty to make the message more decisive",
      "Present every intermediate calculation without a conclusion",
    ],
    correct_answer: "A",
    reasoning: "Decision-makers need an accurate plain-language interpretation that includes uncertainty and material limitations.",
    difficulty: "Medium",
  },
  "Decision Making": {
    question: "Two policy options have similar estimated benefits, but one relies on a dataset with greater uncertainty. What should an evidence-based decision process do?",
    options: [
      "Consider the uncertainty, assumptions, risks, and decision context alongside the estimated benefits",
      "Ignore uncertainty because the point estimate is sufficient",
      "Always choose the option with the larger displayed number",
      "Replace the uncertain estimate with an unsupported assumption",
    ],
    correct_answer: "A",
    reasoning: "Sound decisions incorporate uncertainty and risk rather than treating estimates as exact facts.",
    difficulty: "Medium",
  },
  "Stakeholder Management": {
    question: "A survey modernization project has analysts, IT staff, and field officers with conflicting requirements. What should the project lead do first?",
    options: [
      "Clarify stakeholder needs, constraints, decision rights, and shared outcomes before agreeing the implementation plan",
      "Let the loudest stakeholder decide all requirements",
      "Ignore field staff because they do not write software",
      "Build the system first and ask for requirements after launch",
    ],
    correct_answer: "A",
    reasoning: "Clarifying needs, constraints, roles, and shared outcomes reduces conflict and creates a basis for coordinated delivery.",
    difficulty: "Medium",
  },
  "Project Management": {
    question: "A statistical production project has a fixed publication deadline and several dependent data-processing tasks. Which practice most directly supports delivery?",
    options: [
      "Track milestones, dependencies, risks, owners, and progress against the publication date",
      "Wait until the deadline to discover blocked tasks",
      "Assign every task to the same person regardless of workload",
      "Remove quality checks whenever a task is late",
    ],
    correct_answer: "A",
    reasoning: "Dependency and risk tracking makes schedule threats visible and supports timely corrective action.",
    difficulty: "Medium",
  },
  "Research Communication": {
    question: "A methodology report recommends a new estimator that performs well but has limitations for small samples. How should the finding be communicated?",
    options: [
      "State the evidence, assumptions, performance, limitations, and conditions under which the method is appropriate",
      "Report only the strongest performance result",
      "Omit limitations because they may confuse readers",
      "Claim the estimator is universally superior",
    ],
    correct_answer: "A",
    reasoning: "Research communication should make evidence and limitations explicit so readers can interpret the methodological recommendation appropriately.",
    difficulty: "Medium",
  },
};

function buildQuestion(roleCompetency: RoleCompetency): AssessmentQuestion {
  const competency = getCompetencyById(roleCompetency.competency);
  if (!competency) {
    throw new Error(`Unknown competency in assessment generation: ${roleCompetency.competency}`);
  }

  const spec = QUESTION_BANK[competency.name];
  if (!spec) {
    throw new Error(`No deterministic assessment question defined for competency: ${competency.name}`);
  }

  return {
    competency: competency.name,
    category: competency.category,
    requiredLevel: roleCompetency.requiredLevel,
    ...spec,
  };
}

export function generateMockAssessmentQuestions(
  competencies: RoleCompetency[],
): AssessmentQuestion[] {
  const questions = competencies.map(buildQuestion);
  const counts = Object.fromEntries(
    CATEGORIES.map((category) => [
      category,
      questions.filter((question) => question.category === category).length,
    ]),
  ) as Record<CompetencyCategory, number>;

  if (questions.length !== 12 || CATEGORIES.some((category) => counts[category] !== 3)) {
    throw new Error(
      `Invalid local assessment: expected 12 questions with 3 per category, received ${questions.length} (${CATEGORIES.map((category) => `${category}: ${counts[category]}`).join(", ")}).`,
    );
  }

  return questions;
}
