import type { Competency } from "@/types/igot";
import { getRoleById } from "./roleCompetencyData";

/**
 * Backwards-compatible adapter for older consumers.
 * The canonical role/competency source is roleCompetencyData.ts.
 */
export function getCompetenciesForRole(role: string): Competency[] {
  const profile = Object.values({
    "Statistical Data Analyst": "statistical-data-analyst",
    "Statistical Officer": "statistical-officer",
    "Data / IT Systems Officer": "data-it-systems-officer",
    "Statistical Research / Methodology Officer": "statistical-research-methodology-officer",
  }).map((roleId) => getRoleById(roleId)).find((item) => item?.name === role);

  if (!profile) return [];

  return profile.competencies.map((item) => ({
    name: item.competency,
    category: item.category,
    requiredLevel: item.requiredLevel,
  }));
}

export function getSupportedRoles(): string[] {
  return [
    "Statistical Data Analyst",
    "Statistical Officer",
    "Data / IT Systems Officer",
    "Statistical Research / Methodology Officer",
  ];
}
