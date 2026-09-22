export const COMPETENCY_CATEGORIES = [
  "Statistical",
  "Technical",
  "Digital Governance",
  "Behavioural & Managerial",
] as const;

export type CompetencyCategory = (typeof COMPETENCY_CATEGORIES)[number];

export type ProficiencyLevel = 1 | 2 | 3 | 4 | 5;

export type CourseType = "Course" | "Learning Path" | "Video Series" | "Reading Material" | "Workshop";

export interface Competency {
  id: string;
  name: string;
  category: CompetencyCategory;
  description: string;
  tags: string[];
}

export interface RoleCompetency {
  competency: string;
  category: CompetencyCategory;
  requiredLevel: ProficiencyLevel;
  importance: "Core" | "High" | "Supporting";
  tags: string[];
}

export interface RoleProfile {
  id: string;
  name: string;
  description: string;
  competencies: RoleCompetency[];
}

export type Role = RoleProfile;

export interface Course {
  id: string;
  title: string;
  provider: string;
  description: string;
  competencies: string[];
  category: CompetencyCategory;
  tags: string[];
  level: ProficiencyLevel;
  duration: string;
  type: CourseType;
  url: string;
  catalogueLabel: "iGOT-aligned learning resource" | "Curated MVP catalogue";
}
