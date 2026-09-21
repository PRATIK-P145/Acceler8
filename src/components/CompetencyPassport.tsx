import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Award, BookOpen, ClipboardCheck, RefreshCw, Target, TrendingUp } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface Props {
  onGenerateRoadmap?: () => void;
}

const DEMO_DATA = [
  { competency: "Sampling", initial: 2, learning: 3, reassessed: 3, target: 4 },
  { competency: "SQL", initial: 2, learning: 3, reassessed: 3, target: 3 },
  { competency: "Data Visualization", initial: 3, learning: 4, reassessed: 4, target: 4 },
];

const timeline = [
  { title: "Initial Assessment", description: "Establish current competency levels.", Icon: ClipboardCheck },
  { title: "Learning Pathway", description: "Complete targeted learning based on identified gaps.", Icon: BookOpen },
  { title: "Reassessment", description: "Measure competency after learning.", Icon: RefreshCw },
  { title: "Updated Competency", description: "Refresh the competency profile and identify the next gap.", Icon: TrendingUp },
];

export default function CompetencyPassport({ onGenerateRoadmap }: Props) {
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
            <Badge variant="outline" className="w-fit border-warning/30 bg-warning/10 text-warning">
              Demo progression
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-7 p-5 md:p-6">
          <div className="rounded-lg border border-warning/20 bg-warning/5 p-3 text-xs leading-5 text-muted-foreground">
            <strong className="text-foreground">Demo / historical values:</strong> The progression below is illustrative for the MVP presentation. It is not retrieved from a previous assessment or historical database.
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
                <h3 className="text-base font-semibold text-foreground">Illustrative competency progression</h3>
                <p className="text-xs text-muted-foreground">Level 1 = foundational · Level 5 = advanced</p>
              </div>
              <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
                <Target className="h-3.5 w-3.5" /> Target level
              </div>
            </div>

            <div className="space-y-4">
              {DEMO_DATA.map((item) => (
                <div key={item.competency} className="rounded-lg border border-border p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-foreground">{item.competency}</span>
                    <span className="text-xs text-muted-foreground">
                      Level {item.initial} → {item.reassessed} · Target {item.target}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: (item.reassessed * 20) + "%" }} />
                  </div>
                  <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
                    <span>Initial: L{item.initial}</span>
                    <span>After learning: L{item.learning}</span>
                    <span>Reassessment: L{item.reassessed}</span>
                    <span>Target: L{item.target}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[
                  { stage: "Initial", Sampling: 2, SQL: 2, "Data Visualization": 3 },
                  { stage: "Reassessment", Sampling: 3, SQL: 3, "Data Visualization": 4 },
                  { stage: "Target", Sampling: 4, SQL: 3, "Data Visualization": 4 },
                ]}>
                  <XAxis dataKey="stage" />
                  <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="Sampling" stroke="hsl(var(--primary))" strokeWidth={2} dot />
                  <Line type="monotone" dataKey="SQL" stroke="hsl(var(--accent))" strokeWidth={2} dot />
                  <Line type="monotone" dataKey="Data Visualization" stroke="hsl(var(--success))" strokeWidth={2} dot />
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
