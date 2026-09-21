import { EvaluationResult } from "@/hooks/useAssessment";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Award, CheckCircle2, CircleAlert, Target, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  data: EvaluationResult;
  onGenerateRoadmap: () => void;
  loading: boolean;
}

const CATEGORIES = ["Statistical", "Technical", "Digital Governance", "Behavioural & Managerial"];

const CATEGORY_META: Record<string, string> = {
  Statistical: "Official statistics & methodology",
  Technical: "Tools, data & technology",
  "Digital Governance": "Secure & compliant digital practice",
  "Behavioural & Managerial": "Leadership & professional practice",
};

function getStatus(gap: number) {
  if (gap === 0) return { label: "Meets requirement", className: "border-success/20 bg-success/10 text-success", Icon: CheckCircle2 };
  if (gap >= 2) return { label: "Priority gap", className: "border-destructive/20 bg-destructive/10 text-destructive", Icon: CircleAlert };
  return { label: "Development needed", className: "border-warning/20 bg-warning/10 text-warning", Icon: Target };
}

export default function ResultsView({ data, onGenerateRoadmap, loading }: Props) {
  const competencyResults = data.competencyResults ?? [];
  const categorySummaries = data.categorySummaries ?? [];
  const priorityGaps = data.priorityGaps ?? competencyResults.filter((item) => item.gap > 0);

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:py-10">
        <header className="mb-8">
          <div className="flex items-start gap-4">
            <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:flex">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Competency Intelligence</p>
              <h1 className="mt-1 text-3xl font-display font-bold tracking-tight text-foreground md:text-4xl">Your Competency Profile</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground md:text-base">
                A role-aligned view of current capability, required proficiency, and development priorities across the official statistical system.
              </p>
            </div>
          </div>
        </header>

        <Card className="mb-6 border-border/60 bg-background shadow-sm">
          <CardContent className="p-5 md:p-6">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Name", data.userInfo?.name],
                ["Designation", data.userInfo?.designation],
                ["Department", data.userInfo?.department],
                ["Role", data.userInfo?.role],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
                  <p className="mt-1 font-semibold text-foreground">{value || "—"}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <section className="mb-8">
          <div className="mb-4">
            <h2 className="text-lg font-display font-semibold text-foreground">Competency Overview</h2>
            <p className="text-sm text-muted-foreground">Current proficiency by competency category</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {CATEGORIES.map((category) => {
              const summary = categorySummaries.find((item) => item.category === category);
              return (
                <Card key={category} className="border-border/60 bg-background shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold">{category}</CardTitle>
                    <p className="text-xs text-muted-foreground">{CATEGORY_META[category]}</p>
                  </CardHeader>
                  <CardContent>
                    {summary ? (
                      <>
                        <div className="flex items-end justify-between gap-3">
                          <span className="text-3xl font-bold text-foreground">Level {summary.currentLevel}</span>
                          <span className="text-xs text-muted-foreground">{summary.performance}% performance</span>
                        </div>
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                          <div className="h-full rounded-full bg-primary transition-all" style={{ width: Math.min(summary.currentLevel * 20, 100) + "%" }} />
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">{summary.competenciesAssessed} competencies assessed</p>
                      </>
                    ) : (
                      <p className="py-4 text-sm text-muted-foreground">Not assessed</p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="mb-8">
          <div className="mb-4">
            <h2 className="text-lg font-display font-semibold text-foreground">Competency Gap Analysis</h2>
            <p className="text-sm text-muted-foreground">Current level compared with the level required for the selected role</p>
          </div>
          <Card className="overflow-hidden border-border/60 bg-background shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-sm">
                <thead className="border-b border-border bg-muted/50">
                  <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-5 py-3 font-semibold">Competency</th>
                    <th className="px-5 py-3 font-semibold">Category</th>
                    <th className="px-5 py-3 font-semibold">Current</th>
                    <th className="px-5 py-3 font-semibold">Required</th>
                    <th className="px-5 py-3 font-semibold">Gap</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {competencyResults.map((item) => {
                    const status = getStatus(item.gap);
                    const StatusIcon = status.Icon;
                    return (
                      <tr key={item.competency} className="hover:bg-muted/20">
                        <td className="px-5 py-4 font-medium text-foreground">{item.competency}</td>
                        <td className="px-5 py-4 text-muted-foreground">{item.category}</td>
                        <td className="px-5 py-4 font-semibold">{item.currentLevel}/5</td>
                        <td className="px-5 py-4 font-semibold">{item.requiredLevel}/5</td>
                        <td className="px-5 py-4">
                          <span className={cn("font-semibold", item.gap === 0 ? "text-success" : item.gap >= 2 ? "text-destructive" : "text-warning")}>{item.gap}</span>
                        </td>
                        <td className="px-5 py-4">
                          <Badge variant="outline" className={cn("gap-1.5 font-medium", status.className)}>
                            <StatusIcon className="h-3.5 w-3.5" />
                            {status.label}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {competencyResults.length === 0 && <div className="p-10 text-center text-sm text-muted-foreground">No competency results are available yet.</div>}
            </div>
          </Card>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.35fr]">
          <Card className="border-border/60 bg-background shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg"><Target className="h-5 w-5 text-primary" />Priority Skill Gaps</CardTitle>
              <p className="text-sm text-muted-foreground">Competencies with the largest development gaps.</p>
            </CardHeader>
            <CardContent>
              {priorityGaps.length > 0 ? (
                <div className="space-y-3">
                  {priorityGaps.slice(0, 5).map((item) => (
                    <div key={item.competency} className="flex items-center justify-between gap-4 rounded-lg border border-border p-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">{item.competency}</p>
                        <p className="text-xs text-muted-foreground">{item.category} · Current {item.currentLevel}/5 · Required {item.requiredLevel}/5</p>
                      </div>
                      <Badge variant="outline" className="shrink-0 border-destructive/20 bg-destructive/10 text-destructive">Gap {item.gap}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-success/20 bg-success/5 p-4 text-sm text-success">All assessed competencies currently meet the defined role requirement.</div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-background shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg"><TrendingUp className="h-5 w-5 text-primary" />AI Development Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-7 text-muted-foreground">{data.overallCompetencySummary || data.evaluation.summary}</p>
              {data.evaluation.suggestions?.length > 0 && (
                <div className="mt-5 border-t border-border pt-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Development focus</p>
                  <ul className="mt-2 space-y-2">
                    {data.evaluation.suggestions.slice(0, 3).map((suggestion, index) => <li key={index} className="text-sm text-foreground">• {suggestion}</li>)}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 sm:flex-row">
          <div>
            <p className="text-sm font-semibold text-foreground">Ready to address the identified gaps?</p>
            <p className="text-xs text-muted-foreground">Generate a personalized learning pathway from this profile.</p>
          </div>
          <Button onClick={onGenerateRoadmap} disabled={loading} className="gradient-primary text-primary-foreground">
            {loading ? <><span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />Generating Roadmap...</> : <>Generate Learning Roadmap<ArrowRight className="ml-2 h-4 w-4" /></>}
          </Button>
        </div>
      </div>
    </div>
  );
}
