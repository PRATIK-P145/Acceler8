import { Roadmap } from "@/hooks/useAssessment";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Map, Play, FileText, BookOpen, Lightbulb, RotateCcw, ExternalLink, ArrowLeft, RefreshCw } from "lucide-react";

interface Props {
  roadmap: Roadmap;
  onRestart: () => void;
  onBackToResults: () => void;
  onStartReassessment: () => void;
}

const resourceIcon = (type: string) => {
  switch (type) {
    case "video": return <Play className="w-3.5 h-3.5" />;
    case "article": return <FileText className="w-3.5 h-3.5" />;
    default: return <BookOpen className="w-3.5 h-3.5" />;
  }
};

const resourceBadgeClass = (type: string) => {
  switch (type) {
    case "video": return "bg-destructive/10 text-destructive border-destructive/20";
    case "article": return "bg-success/10 text-success border-success/20";
    default: return "bg-primary/10 text-primary border-primary/20";
  }
};

export default function RoadmapView({ roadmap, onRestart, onBackToResults, onStartReassessment }: Props) {
  return (
    <div className="min-h-screen gradient-surface p-4">
      <div className="max-w-3xl mx-auto pt-8 space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl gradient-accent mb-4">
            <Map className="w-7 h-7 text-accent-foreground" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground">{roadmap.title}</h1>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">{roadmap.overview}</p>
        </div>

        {/* Days */}
        {roadmap.days.map((day) => (
          <Card key={day.day} className="shadow-md border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="font-display flex items-center gap-3">
                <span className="flex-shrink-0 w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
                  D{day.day}
                </span>
                {day.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Goals */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">🎯 Goals</h4>
                <ul className="space-y-1">
                  {day.goals.map((g, i) => (
                    <li key={i} className="text-sm text-muted-foreground pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-primary">{g}</li>
                  ))}
                </ul>
              </div>

              {/* Activities */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">📚 Activities</h4>
                <ul className="space-y-1">
                  {day.activities.map((a, i) => (
                    <li key={i} className="text-sm text-muted-foreground pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-accent">{a}</li>
                  ))}
                </ul>
              </div>

              {/* Resources */}
              {day.resources.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">🔗 Resources</h4>
                  <div className="space-y-2">
                    {day.resources.map((r, i) => (
                      <a
                        key={i}
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                      >
                        <Badge variant="outline" className={resourceBadgeClass(r.type)}>
                          {resourceIcon(r.type)}
                        </Badge>
                        <span className="flex-1 text-sm text-foreground group-hover:text-primary transition-colors">{r.title}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Practice */}
              {day.practice && (
                <div className="bg-primary/5 border border-primary/10 rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-primary mb-1">✏️ Practice</h4>
                  <p className="text-sm text-muted-foreground">{day.practice}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {/* Tips */}
        {roadmap.tips.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 font-display">
                <Lightbulb className="w-4 h-4 text-warning" /> Pro Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-2">
                {roadmap.tips.map((tip, i) => (
                  <li key={i} className="text-sm text-muted-foreground bg-warning/5 border border-warning/10 p-3 rounded-lg">💡 {tip}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex flex-col items-center justify-center gap-3 border-t border-border pt-6 pb-8 sm:flex-row">
          <Button onClick={onBackToResults} variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Competency Profile
          </Button>
          <Button onClick={onStartReassessment} className="gap-2 gradient-primary text-primary-foreground">
            <RefreshCw className="w-4 h-4" /> Start Reassessment
          </Button>
          <Button onClick={onRestart} variant="ghost" className="gap-2">
            <RotateCcw className="w-4 h-4" /> Take Another Assessment
          </Button>
        </div>
      </div>
    </div>
  );
}
