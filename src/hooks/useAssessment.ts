import { useState, useCallback } from "react";

import type { AssessmentQuestion, OfficialProfile } from "@/types/igot";
import { getCompetenciesForRole } from "@/data/competencyFramework";


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

type Step = "form" | "quiz" | "results" | "roadmap";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export function useAssessment() {
  const [step, setStep] = useState<Step>("form");
  const [userInfo, setUserInfo] = useState<OfficialProfile | null>(null);
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
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
        throw new Error("This role is not yet supported by the competency framework. Please select Statistical Data Analyst.");
      }
      const data = await callFunction("generate-questions", {
        profile: info,
        role: info.role,
        competencies,
      });

      const generatedQuestions = Array.isArray(data.questions) ? data.questions : [];
      const categories = ["Statistical", "Technical", "Digital Governance", "Behavioural & Managerial"];
      const validAssessment =
        generatedQuestions.length === 12 &&
        categories.every((category) => generatedQuestions.filter((q: AssessmentQuestion) => q.category === category).length === 3) &&
        generatedQuestions.every((q: AssessmentQuestion) =>
          typeof q.question === "string" &&
          Array.isArray(q.options) &&
          q.options.length === 4 &&
          ["A", "B", "C", "D"].includes(q.correct_answer) &&
          typeof q.competency === "string" &&
          typeof q.requiredLevel === "number"
        );

      if (!validAssessment) {
        throw new Error("Assessment generation returned an incomplete or invalid question set. Please retry.");
      }

      setQuestions(generatedQuestions);
      setStep("quiz");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [callFunction]);

  const submitAnswers = useCallback(async (userAnswers: string[]) => {
    if (!userInfo) return;
    setLoading(true);
    setError(null);
    try {
      const data = await callFunction("evaluate-answers", {
        questions,
        userAnswers,
        userInfo,
      });
      setEvaluationResult(data);
      setStep("results");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [callFunction, questions, userInfo]);

  const generateRoadmap = useCallback(async () => {
    if (!userInfo || !evaluationResult) return;
    setLoading(true);
    setError(null);
    try {
      const data = await callFunction("generate-roadmap", {
        userInfo,
        competencyResults: evaluationResult.competencyResults,
        priorityGaps: evaluationResult.priorityGaps,
        evaluation: evaluationResult.evaluation,
      });
      setRoadmap(data.roadmap);
      setStep("roadmap");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [callFunction, userInfo, evaluationResult]);

  const restart = useCallback(() => {
    setStep("form");
    setUserInfo(null);
    setQuestions([]);
    setEvaluationResult(null);
    setRoadmap(null);
    setError(null);
  }, []);

  return {
    step,
    userInfo,
    questions,
    evaluationResult,
    roadmap,
    loading,
    error,
    startAssessment,
    submitAnswers,
    generateRoadmap,
    restart,
  };
}
