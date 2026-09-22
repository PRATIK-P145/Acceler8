import { useState, useCallback } from "react";

import type { AssessmentQuestion, OfficialProfile } from "@/types/igot";
import { getCompetenciesForRole } from "@/data/competencyFramework";
import { generateMockAssessmentQuestions } from "@/data/mockAssessmentQuestions";
import { buildPersonalizedRoadmap } from "@/data/learningRoadmap";


export interface QuestionResult extends AssessmentQuestion {
  user_answer: string;
  is_correct: boolean;
}

export interface Evaluation {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export interface CompetencyResult {
  competency: string;
  category: string;
  currentLevel: number;
  requiredLevel: number;
  gap: number;
}

export interface CategorySummary {
  category: string;
  performance: number;
  currentLevel: number;
  competenciesAssessed: number;
}

export interface AssessmentSnapshot {
  assessedAt: string;
  competencyResults: CompetencyResult[];
}

export interface EvaluationResult {
  userInfo: OfficialProfile;
  results: QuestionResult[];
  score: number;
  correct: number;
  total: number;
  evaluation: Evaluation;
  competencyResults: CompetencyResult[];
  categorySummaries: CategorySummary[];
  strengths: string[];
  priorityGaps: CompetencyResult[];
  overallCompetencySummary: string;
}

export interface RoadmapResource {
  title: string;
  url: string;
  type: "video" | "article" | "documentation";
}

export interface RoadmapDay {
  day: number;
  title: string;
  goals: string[];
  activities: string[];
  resources: RoadmapResource[];
  practice: string;
}

export interface Roadmap {
  title: string;
  overview: string;
  days: RoadmapDay[];
  tips: string[];
}

type Step = "form" | "quiz" | "results" | "roadmap" | "reassessment";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export function useAssessment() {
  const [step, setStep] = useState<Step>("form");
  const [userInfo, setUserInfo] = useState<OfficialProfile | null>(null);
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [assessmentHistory, setAssessmentHistory] = useState<AssessmentSnapshot[]>([]);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callFunction = useCallback(async (name: string, body: any) => {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/${name}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Request failed" }));
      throw new Error(err.error || `Error ${res.status}`);
    }
    return res.json();
  }, []);

  const startAssessment = useCallback(async (info: OfficialProfile) => {
    setLoading(true);
    setError(null);
    try {
      setUserInfo(info);

      const competencies = getCompetenciesForRole(info.role);
      if (competencies.length === 0) {
        throw new Error("This role is not supported by the competency framework.");
      }

      const generatedQuestions = generateMockAssessmentQuestions(competencies);

      const categories = [
        "Statistical",
        "Technical",
        "Digital Governance",
        "Behavioural & Managerial",
      ] as const;

      const validAssessment =
        generatedQuestions.length === 12 &&
        categories.every(
          (category) =>
            generatedQuestions.filter((question) => question.category === category).length === 3,
        ) &&
        generatedQuestions.every(
          (question) =>
            typeof question.question === "string" &&
            Array.isArray(question.options) &&
            question.options.length === 4 &&
            ["A", "B", "C", "D"].includes(question.correct_answer) &&
            typeof question.competency === "string" &&
            typeof question.requiredLevel === "number" &&
            typeof question.reasoning === "string" &&
            typeof question.difficulty === "string",
        );

      if (!validAssessment) {
        throw new Error("Local assessment generation returned an invalid question set. Please retry.");
      }

      setQuestions(generatedQuestions);
      setStep("quiz");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);
  
  const submitAnswers = useCallback(async (userAnswers: string[]) => {
    if (!userInfo) return;
    setLoading(true);
    setError(null);

    try {
      const results: QuestionResult[] = questions.map((question, index) => ({
        ...question,
        user_answer: userAnswers[index] ?? "",
        is_correct: (userAnswers[index] ?? "") === question.correct_answer,
      }));

      const correct = results.filter((result) => result.is_correct).length;
      const total = results.length;
      const score = total > 0 ? Math.round((correct / total) * 100) : 0;

      const levelFromPerformance = (performance: number): number => {
        if (performance >= 0.9) return 5;
        if (performance >= 0.75) return 4;
        if (performance >= 0.5) return 3;
        if (performance >= 0.25) return 2;
        return 1;
      };

      const competencyResults: CompetencyResult[] = Array.from(
        new Set(questions.map((question) => question.competency)),
      ).map((competency) => {
        const competencyQuestions = results.filter((question) => question.competency === competency);
        const competencyCorrect = competencyQuestions.filter((question) => question.is_correct).length;
        const performance =
          competencyQuestions.length > 0 ? competencyCorrect / competencyQuestions.length : 0;
        const currentLevel = levelFromPerformance(performance);
        const requiredLevel = competencyQuestions[0]?.requiredLevel ?? 1;

        return {
          competency,
          category: competencyQuestions[0]?.category ?? "Statistical",
          currentLevel,
          requiredLevel,
          gap: Math.max(requiredLevel - currentLevel, 0),
        };
      });

      const categorySummaries: CategorySummary[] = [
        "Statistical",
        "Technical",
        "Digital Governance",
        "Behavioural & Managerial",
      ].map((category) => {
        const categoryQuestions = results.filter((question) => question.category === category);
        const categoryCorrect = categoryQuestions.filter((question) => question.is_correct).length;
        const performance =
          categoryQuestions.length > 0 ? categoryCorrect / categoryQuestions.length : 0;

        return {
          category,
          performance: Math.round(performance * 100),
          currentLevel: levelFromPerformance(performance),
          competenciesAssessed: new Set(
            categoryQuestions.map((question) => question.competency),
          ).size,
        };
      });

      const strengths = competencyResults
        .filter((item) => item.gap === 0)
        .map((item) => item.competency);

      const priorityGaps = [...competencyResults]
        .filter((item) => item.gap > 0)
        .sort((a, b) => b.gap - a.gap || b.requiredLevel - a.requiredLevel);

      const overallCompetencySummary =
        priorityGaps.length === 0
          ? "Your current assessed proficiency meets the defined role requirements across all assessed competencies."
          : `The assessment identified ${priorityGaps.length} competency gap${priorityGaps.length === 1 ? "" : "s"} requiring development attention.`;

      const evaluation: Evaluation = {
        summary: overallCompetencySummary,
        strengths,
        weaknesses: priorityGaps.map((item) => item.competency),
        suggestions: priorityGaps.slice(0, 5).map(
          (item) =>
            `Develop ${item.competency} from Level ${item.currentLevel} toward the required Level ${item.requiredLevel}.`,
        ),
      };

      const data: EvaluationResult = {
        userInfo,
        results,
        score,
        correct,
        total,
        evaluation,
        competencyResults,
        categorySummaries,
        strengths,
        priorityGaps,
        overallCompetencySummary,
      };

      setEvaluationResult(data);
      setAssessmentHistory((previous) => [
        ...previous,
        { assessedAt: new Date().toISOString(), competencyResults: data.competencyResults },
      ]);
      setStep("results");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [questions, userInfo]);

  const startReassessment = useCallback(() => {
    if (!userInfo) return;
    setError(null);
    const competencies = getCompetenciesForRole(userInfo.role);
    const reassessmentQuestions = generateMockAssessmentQuestions(competencies);
    setQuestions(reassessmentQuestions);
    setStep("reassessment");
  }, [userInfo]);

  const backToResults = useCallback(() => {
    if (evaluationResult) setStep("results");
  }, [evaluationResult]);

  const generateRoadmap = useCallback(async () => {
    if (!userInfo || !evaluationResult) return;
    setLoading(true);
    setError(null);
    try {
      const generatedRoadmap = buildPersonalizedRoadmap(userInfo.role, evaluationResult.priorityGaps);
      setRoadmap(generatedRoadmap);
      setStep("roadmap");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [userInfo, evaluationResult]);
  const restart = useCallback(() => {
    setStep("form");
    setUserInfo(null);
    setQuestions([]);
    setEvaluationResult(null);
    setAssessmentHistory([]);
    setRoadmap(null);
    setError(null);
  }, []);

  return {
    step,
    userInfo,
    questions,
    evaluationResult,
    assessmentHistory,
    roadmap,
    loading,
    error,
    startAssessment,
    submitAnswers,
    generateRoadmap,
    startReassessment,
    backToResults,
    restart,
  };
}
