export type CompetencyCategory =
  | "Statistical"
  | "Technical"
  | "Digital Governance"
  | "Behavioural & Managerial";

export interface OfficialProfile {
  name: string;
  designation: string;
  department: string;
  role: string;
  currentAssignment: string;
  qualification: string;
  experienceYears: number;
  previousTraining: string;
}

export interface Competency {
  name: string;
  category: CompetencyCategory;
  requiredLevel: number;
}

export interface AssessmentQuestion {
  competency: string;
  category: CompetencyCategory;
  requiredLevel: number;
  question: string;
  options: string[];
  correct_answer: string;
  reasoning: string;
  difficulty: string;
}

export interface CompetencyResult {
  competency: string;
  category: CompetencyCategory;
  currentLevel: number;
  requiredLevel: number;
  gap: number;
}

export interface LearningResource {
  competency: string;
  title: string;
  provider: string;
  type: string;
  duration: string;
  description: string;
  url: string;
  reason: string;
}
