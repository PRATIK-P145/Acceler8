import { useState } from "react";
import type { AssessmentQuestion, CompetencyCategory } from "@/types/igot";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  questions: AssessmentQuestion[];
  onSubmit: (answers: string[]) => void;
  loading: boolean;
  topic: string;
}

const CATEGORIES: CompetencyCategory[] = [
  "Statistical",
  "Technical",
  "Digital Governance",
  "Behavioural & Managerial",
];

const categoryNumber = (category: CompetencyCategory) =>
  String(CATEGORIES.indexOf(category) + 1).padStart(2, "0");

export default function QuizView({ questions, onSubmit, loading, topic }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(""));

  const current = questions[currentIndex];
  if (!current) return null;

  const categoryQuestions = questions.filter(q => q.category === current.category);
  const positionInCategory = categoryQuestions.findIndex((q) => q === current) + 1;
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const allAnswered = answers.length === questions.length && answers.every(a => a !== "");

  const selectAnswer = (letter: string) => {
    setAnswers(prev => {
      const next = [...prev];
      next[currentIndex] = letter;
      return next;
    });
  };

  const optionLetter = (idx: number) => ["A", "B", "C", "D"][idx];

  return (
    <div className="min-h-screen gradient-surface p-4">
      <div className="max-w-3xl mx-auto pt-8">
        <div className="mb-6">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div>
              <p className="text-xs font-semibold text-primary tracking-widest">
                {categoryNumber(current.category)} / 04
              </p>
              <h2 className="font-display font-bold text-lg text-foreground">{current.category} Competencies</h2>
            </div>
            <span className="text-sm text-muted-foreground">
              Question {positionInCategory} of {categoryQuestions.length}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-3">
            {CATEGORIES.map(category => {
              const categoryQuestions = questions.filter(q => q.category === category);
              const answered = categoryQuestions.filter(q => {
                const index = questions.indexOf(q);
                return answers[index];
              }).length;
              const active = current.category === category;
              return (
                <div key={category} className={cn(
                  "rounded-lg border px-2 py-2 text-center text-xs transition-colors",
                  active ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground"
                )}>
                  <div className="font-semibold">{categoryNumber(category)}</div>
                  <div className="truncate">{category}</div>
                  <div className="mt-1">{answered}/3</div>
                </div>
              );
            })}
          </div>

          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full gradient-primary transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-muted-foreground mt-2">{currentIndex + 1} of 12 questions</p>
        </div>

        <Card className="shadow-lg border-border/50 mb-6">
          <CardHeader>
            <CardTitle className="font-display text-xl leading-relaxed">{current.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {current.options.map((opt, i) => {
              const letter = optionLetter(i);
              const isSelected = answers[currentIndex] === letter;
              return (
                <button
                  type="button"
                  key={i}
                  onClick={() => selectAnswer(letter)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 hover:border-primary/50 hover:shadow-md",
                    isSelected ? "border-primary bg-primary/5 shadow-glow" : "border-border bg-card"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span className={cn(
                      "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold",
                      isSelected ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}>{letter}</span>
                    <span className="text-foreground pt-1">{opt.replace(/^[A-D])\s*/, "")}</span>
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setCurrentIndex(i => Math.max(0, i - 1))} disabled={currentIndex === 0}>
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </Button>

          {currentIndex < questions.length - 1 ? (
            <Button onClick={() => setCurrentIndex(i => i + 1)}>
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={() => onSubmit(answers)} disabled={!allAnswered || loading} className="gradient-primary text-primary-foreground">
              {loading ? "Evaluating..." : <>Submit <Send className="w-4 h-4 ml-1" /></>}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
