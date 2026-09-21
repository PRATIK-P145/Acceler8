import { useState } from "react";
import type { AssessmentQuestion } from "@/types/igot";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Send, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  questions: AssessmentQuestion[];
  onSubmit: (answers: string[]) => void;
  loading: boolean;
  topic: string;
}

export default function QuizView({ questions, onSubmit, loading, topic }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(""));

  const current = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const allAnswered = answers.every(a => a !== "");

  const selectAnswer = (letter: string) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = letter;
    setAnswers(newAnswers);
  };

  const optionLetter = (idx: number) => ["A", "B", "C", "D"][idx];

  return (
    <div className="min-h-screen gradient-surface p-4">
      <div className="max-w-2xl mx-auto pt-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-display font-bold text-lg text-foreground">{topic}</h2>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {currentIndex + 1} / {questions.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="shadow-lg border-border/50 mb-6">
          <CardHeader>
            <CardTitle className="font-display text-xl leading-relaxed">
              {current.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {current.options.map((opt, i) => {
              const letter = optionLetter(i);
              const isSelected = answers[currentIndex] === letter;
              return (
                <button
                  key={i}
                  onClick={() => selectAnswer(letter)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border-2 transition-all duration-200",
                    "hover:border-primary/50 hover:shadow-md",
                    isSelected
                      ? "border-primary bg-primary/5 shadow-glow"
                      : "border-border bg-card"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span className={cn(
                      "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-colors",
                      isSelected
                        ? "gradient-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}>
                      {letter}
                    </span>
                    <span className="text-foreground pt-1">{opt.replace(/^[A-D]\)\s*/, "")}</span>
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Previous
          </Button>

          {currentIndex < questions.length - 1 ? (
            <Button onClick={() => setCurrentIndex(i => i + 1)}>
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={() => onSubmit(answers)}
              disabled={!allAnswered || loading}
              className="gradient-primary text-primary-foreground"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Evaluating...
                </span>
              ) : (
                <>Submit <Send className="w-4 h-4 ml-1" /></>
              )}
            </Button>
          )}
        </div>

        {/* Question dots */}
        <div className="flex justify-center gap-2 mt-6">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={cn(
                "w-3 h-3 rounded-full transition-all",
                i === currentIndex ? "gradient-primary scale-125" : answers[i] ? "bg-primary/40" : "bg-border"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
