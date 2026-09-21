import type { Competency } from "@/types/igot";

const ROLE_COMPETENCY_MAP: Record<string, Competency[]> = {
  "Statistical Data Analyst": [
    { name: "Survey Design", category: "Statistical", requiredLevel: 4 },
    { name: "Sampling", category: "Statistical", requiredLevel: 4 },
    { name: "Data Quality", category: "Statistical", requiredLevel: 4 },
    { name: "SDG Indicators", category: "Statistical", requiredLevel: 3 },
    { name: "Python", category: "Technical", requiredLevel: 3 },
    { name: "SQL", category: "Technical", requiredLevel: 3 },
    { name: "Data Visualization", category: "Technical", requiredLevel: 4 },
    { name: "Data Privacy", category: "Digital Governance", requiredLevel: 3 },
    { name: "Cybersecurity", category: "Digital Governance", requiredLevel: 3 },
    { name: "Communication", category: "Behavioural & Managerial", requiredLevel: 4 },
    { name: "Decision Making", category: "Behavioural & Managerial", requiredLevel: 3 },
  ],
};

/**
 * Returns the deterministic competency requirements for a given role.
 * Add new role entries to ROLE_COMPETENCY_MAP as the MVP framework expands.
 */
export function getCompetenciesForRole(role: string): Competency[] {
  return ROLE_COMPETENCY_MAP[role] ?? [];
}

export function getSupportedRoles(): string[] {
  return Object.keys(ROLE_COMPETENCY_MAP);
}
