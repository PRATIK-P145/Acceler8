import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

type CompetencyAggregate = {
  competency: string;
  category: string;
  correct: number;
  total: number;
  performance: number;
  currentLevel: number;
  requiredLevel: number;
  gap: number;
};

const performanceToLevel = (performance: number): number => {
  if (performance >= 0.9) return 5;
  if (performance >= 0.75) return 4;
  if (performance >= 0.5) return 3;
  if (performance >= 0.25) return 2;
  return 1;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { questions, userAnswers, userInfo } = await req.json();
    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
    if (!GROQ_API_KEY) throw new Error("GROQ_API_KEY is not configured");

    if (!Array.isArray(questions) || !Array.isArray(userAnswers) || questions.length === 0) {
      throw new Error("Questions and user answers are required");
    }

    const results = questions.map((q: any, i: number) => ({
      question: q.question,
      competency: q.competency,
      category: q.category,
      requiredLevel: q.requiredLevel,
      options: q.options,
      correct_answer: q.correct_answer,
      user_answer: userAnswers[i] || "",
      is_correct: (userAnswers[i] || "") === q.correct_answer,
      reasoning: q.reasoning,
    }));

    const competencyMap = new Map<string, CompetencyAggregate>();

    for (const result of results) {
      const key = result.competency;
      const existing = competencyMap.get(key);
      if (existing) {
        existing.total += 1;
        if (result.is_correct) existing.correct += 1;
      } else {
        competencyMap.set(key, {
          competency: result.competency,
          category: result.category,
          correct: result.is_correct ? 1 : 0,
          total: 1,
          performance: 0,
          currentLevel: 1,
          requiredLevel: result.requiredLevel,
          gap: 0,
        });
      }
    }

    const competencyResults = Array.from(competencyMap.values()).map((item) => {
      const performance = item.correct / item.total;
      const currentLevel = performanceToLevel(performance);
      return {
        competency: item.competency,
        category: item.category,
        currentLevel,
        requiredLevel: item.requiredLevel,
        gap: Math.max(item.requiredLevel - currentLevel, 0),
      };
    });

    const categoryMap = new Map<string, { category: string; correct: number; total: number; competencies: number }>();
    for (const result of results) {
      const existing = categoryMap.get(result.category);
      if (existing) {
        existing.total += 1;
        if (result.is_correct) existing.correct += 1;
        existing.competencies += existing.total === 1 ? 1 : 0;
      } else {
        categoryMap.set(result.category, {
          category: result.category,
          correct: result.is_correct ? 1 : 0,
          total: 1,
          competencies: 1,
        });
      }
    }

    const categorySummaries = Array.from(categoryMap.values()).map((item) => ({
      category: item.category,
      performance: Math.round((item.correct / item.total) * 100),
      currentLevel: performanceToLevel(item.correct / item.total),
      competenciesAssessed: item.competencies,
    }));

    const strengths = competencyResults
      .filter((item) => item.gap === 0)
      .map((item) => item.competency);

    const priorityGaps = [...competencyResults]
      .filter((item) => item.gap > 0)
      .sort((a, b) => b.gap - a.gap || b.requiredLevel - a.requiredLevel)
      .map((item) => ({
        competency: item.competency,
        category: item.category,
        currentLevel: item.currentLevel,
        requiredLevel: item.requiredLevel,
        gap: item.gap,
      }));

    const evalPrompt = [
      "You are an expert in competency development for India's official statistical system.",
      "",
      "Evaluate the official's assessment qualitatively. The deterministic competency levels below are authoritative; do not recalculate, change, rank, or invent competency levels.",
      "",
      "Official: " + (userInfo?.name ?? ""),
      "Designation: " + (userInfo?.designation ?? ""),
      "Department / Organization: " + (userInfo?.department ?? ""),
      "Role: " + (userInfo?.role ?? ""),
      "Current Assignment: " + (userInfo?.currentAssignment ?? ""),
      "",
      "Competency profile:",
      JSON.stringify(competencyResults, null, 2),
      "",
      "Questions answered incorrectly:",
      results.filter((r: any) => !r.is_correct).map((r: any, i: number) =>
        (i + 1) + ". [" + r.category + " / " + r.competency + "] " + r.question
      ).join("\n"),
      "",
      "Return ONLY valid JSON:",
      JSON.stringify({
        summary: "2-3 sentence overall competency development summary",
        strengths: ["specific competency strengths"],
        weaknesses: ["specific competency development areas"],
        suggestions: ["3-5 practical development suggestions"]
      }, null, 2),
      "Do not claim scientific validity for the 1-5 scale."
    ].join("\n");

    let evaluation: any = {
      summary: "Qualitative evaluation could not be generated.",
      strengths: [],
      weaknesses: [],
      suggestions: [],
    };

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + GROQ_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta-llama/llama-4-scout-17b-16e-instruct",
          messages: [
            { role: "system", content: "You are a JSON-only response bot." },
            { role: "user", content: evalPrompt },
          ],
          temperature: 0.5,
          max_tokens: 2048,
        }),
      });

      if (!response.ok) {
        console.error("Groq eval error:", response.status, await response.text());
      } else {
        const data = await response.json();
        let content = data.choices?.[0]?.message?.content?.trim() || "{}";
        content = content.replace(/^\`\`\`(?:json)?\s*/i, '').replace(/\s*\`\`\`$/i, '');
        try {
          evaluation = JSON.parse(content);
        } catch {
          console.error("Groq evaluation JSON parse failed");
        }
      }
    } catch (error) {
      console.error("Groq qualitative evaluation failed:", error);
    }

    const overallCorrect = results.filter((r: any) => r.is_correct).length;
    const overallPerformance = overallCorrect / results.length;

    return new Response(JSON.stringify({
      results,
      correct: overallCorrect,
      total: results.length,
      score: Math.round(overallPerformance * 100),
      competencyResults,
      categorySummaries,
      strengths,
      priorityGaps,
      overallCompetencySummary: evaluation.summary,
      evaluation,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("evaluate-answers error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
