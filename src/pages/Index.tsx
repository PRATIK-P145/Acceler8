import { useAssessment } from "@/hooks/useAssessment";
import UserInfoForm from "@/components/UserInfoForm";
import QuizView from "@/components/QuizView";
import ResultsView from "@/components/ResultsView";
import RoadmapView from "@/components/RoadmapView";
import { toast } from "sonner";
import { useEffect } from "react";

const Index = () => {
  const {
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
  } = useAssessment();

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  switch (step) {
    case "form":
      return <UserInfoForm onSubmit={startAssessment} loading={loading} />;
    case "quiz":
      return <QuizView questions={questions} onSubmit={submitAnswers} loading={loading} topic={userInfo?.role || ""} />;
    case "results":
      return evaluationResult ? (
        <ResultsView data={evaluationResult} onGenerateRoadmap={generateRoadmap} loading={loading} />
      ) : null;
    case "roadmap":
      return roadmap ? <RoadmapView roadmap={roadmap} onRestart={restart} /> : null;
    default:
      return null;
  }
};

export default Index;
