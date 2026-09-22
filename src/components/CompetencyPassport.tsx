import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Award, BookOpen, ClipboardCheck, RefreshCw, Target, TrendingUp } from "lucide-react";
import type { CompetencyResult, EvaluationResult } from "@/hooks/useAssessment";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface AssessmentSnapshot {
  assessedAt: string;
  competencyResults: CompetencyResult[];
}

interface Props {
  currentResults: EvaluationResult;
  history: AssessmentSnapshot[];
}

const timeline = [
  { title: "Initial Assessment", description: "Establish current competency levels.", Icon: ClipboardCheck },
  { title: "Learning Pathway", description: "Complete targeted learning based on identified gaps.", Icon: BookOpen },
  { title: "Reassessment", description: "Measure competency after learning.", Icon: RefreshCw },
  { title: "Updated Competency", description: "Refresh the competency profile and identify the next gap.", Icon: TrendingUp },
];

export default function CompetencyPassport({ currentResults, history }: Props) {
  const current = currentResults.competencyResults ?? [];
  const previous = history.length > 1 ? history[history.length - 2]?.competencyResults ?? [] : [];
  const previousByCompetency = new Map(previous.map((item) => [item.competency, item]));
  const hasPrevious = previous.length > 0;
  const improvedCount = hasPrevious
    ? current.filter((item) => item.currentLevel > (previousByCompetency.get(item.competency)?.currentLevel ?? item.currentLevel)).length
    : 0;
  const meetingRequirementCount = current.filter((item) => item.gap === 0).length;

  return (
    <section className="mt-8">
      <Card className="overflow-hidden border-border/60 bg-background shadow-sm">
        <CardHeader className="border-b border-border bg-muted/20">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl font-display">Competency Passport</CardTitle>
              </div>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                A continuous development view showing how competency levels can be updated as an official learns and is reassessed.
              </p>
            </div>
            <Badge variant="outline" className="w-fit border-primary/20 bg-primary/5 text-primary">
              {hasPrevious ? "Live progress" : "Baseline profile"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-7 p-5 md:p-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-border p-4"><p className="text-xs uppercase tracking-wide text-muted-foreground">Assessments</p><p className="mt-1 text-2xl font-bold text-foreground">{history.length}</p><p className="text-xs text-muted-foreground">Recorded in this session</p></div>
            <div className="rounded-lg border border-border p-4"><p className="text-xs uppercase tracking-wide text-muted-foreground">Meeting requirement</p><p className="mt-1 text-2xl font-bold text-foreground">{meetingRequirementCount}/{current.length}</p><p className="text-xs text-muted-foreground">Current competencies</p></div>
            <div className="rounded-lg border border-border p-4"><p className="text-xs uppercase tracking-wide text-muted-foreground">Improved</p><p className="mt-1 text-2xl font-bold text-foreground">{improvedCount}</p><p className="text-xs text-muted-foreground">{hasPrevious ? "Since previous assessment" : "Available after reassessment"}</p></div>
          </div>

          <div className="grid gap-3 md:grid-cols-4">
            {timeline.map((item, index) => (
              <div key={item.title} className="relative">
                <div className="flex items-start gap-3 rounded-lg border border-border p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <item.Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                {index < timeline.length - 1 && (
                  <ArrowRight className="absolute -right-3 top-1/2 z-10 hidden h-5 w-5 -translate-y-1/2 bg-background text-muted-foreground md:block" />
                )}
              </div>
            ))}
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-foreground">Current competency profile</h3>
                <p className="text-xs text-muted-foreground">Level 1 = foundational · Level 5 = advanced · {history.length} assessment{history.length === 1 ? "" : "s"} recorded</p>
              </div>
              <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
                <Target className="h-3.5 w-3.5" /> Target level
              </div>
            </div>

            <div className="space-y-4">
              {current.map((item) => {
                const previousItem = previousByCompetency.get(item.competency);
                const change = previousItem ? item.currentLevel - previousItem.currentLevel : 0;
                return (
                  <div key={item.competency} className="rounded-lg border border-border p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <span className="text-sm font-semibold text-foreground">{item.competency}</span>
                        <p className="text-xs text-muted-foreground">{item.category} · Required L{item.requiredLevel} · Gap {item.gap}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-foreground">Level {item.currentLevel}/5</span>
                        {hasPrevious && previousItem && <p className={change > 0 ? "text-xs font-semibold text-success" : change < 0 ? "text-xs font-semibold text-destructive" : "text-xs text-muted-foreground"}>{change > 0 ? "↑ +" + change : change < 0 ? "↓ " + change : "→ Maintained"}</p>}
                      </div>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary transition-all" style={{ width: item.currentLevel * 20 + "%" }} />
                    </div>
                    <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
                      <span>{previousItem ? "Previous: L" + previousItem.currentLevel : "Baseline assessment"}</span>
                      <span>Current: L{item.currentLevel}</span>
                      <span>Required: L{item.requiredLevel}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[
                  { stage: "Initial", ...Object.fromEntries((history[0]?.competencyResults ?? []).slice(0, 3).map((item) => [item.competency, item.currentLevel])) },
                  { stage: "Current", ...Object.fromEntries(current.slice(0, 3).map((item) => [item.competency, item.currentLevel])) },
                  { stage: "Required", ...Object.fromEntries(current.slice(0, 3).map((item) => [item.competency, item.requiredLevel])) },
                ]}>
                  <XAxis dataKey="stage" />
                  <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} />
                  <Tooltip />
                  {current.slice(0, 3).map((item) => (
                    <Line key={item.competency} type="monotone" dataKey={item.competency} stroke="hsl(var(--primary))" strokeWidth={2} dot />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border border-primary/15 bg-primary/5 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Continuous competency development</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  ASSESS → IDENTIFY GAP → LEARN → REASSESS → UPDATE PROFILE
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
