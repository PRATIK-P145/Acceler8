import type { Competency } from "@/types/igot";
import { ROLE_PROFILES } from "./roleCompetencyData";

/**
 * Backwards-compatible adapter for older consumers.
 * The canonical role/competency source is roleCompetencyData.ts.
 */
export function getCompetenciesForRole(role: string): Competency[] {
  const profile = ROLE_PROFILES.find((item) => item.name === role);
  if (!profile) return [];

  return profile.competencies.map((item) => ({
    name: item.competency,
    category: item.category,
    requiredLevel: item.requiredLevel,
  }));
}

export function getSupportedRoles(): string[] {
  return ROLE_PROFILES.map((item) => item.name);
}
