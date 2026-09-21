import { useState, useCallback } from "react";

import type { AssessmentQuestion, OfficialProfile } from "@/types/igot";


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

export interface EvaluationResult {
  results: QuestionResult[];
  score: number;
  correct: number;
  total: number;
  evaluation: Evaluation;
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
      const data = await callFunction("generate-questions", info);
      setQuestions(data.questions);
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
        score: evaluationResult.score,
        weaknesses: evaluationResult.evaluation.weaknesses,
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
