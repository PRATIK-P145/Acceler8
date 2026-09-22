import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const CATEGORIES = [
  "Statistical",
  "Technical",
  "Digital Governance",
  "Behavioural & Managerial",
];

type CompetencyRequirement = {
  name: string;
  category: string;
  requiredLevel: number;
};

type Question = {
  competency: string;
  category: string;
  requiredLevel: number;
  question: string;
  options: string[];
  correct_answer: string;
  reasoning: string;
  difficulty: string;
};

function buildFallbackQuestions(competencies: CompetencyRequirement[]): Question[] {
  return CATEGORIES.flatMap((category) => {
    const categoryCompetencies = competencies.filter((c) => c.category === category).slice(0, 3);
    return categoryCompetencies.map((competency, index) => ({
      competency: competency.name,
      category: competency.category,
      requiredLevel: competency.requiredLevel,
      question: `Which approach best demonstrates practical competence in "${competency.name}" for an official statistical workflow?`,
      options: [
        "Apply the documented method, validate the result, and record assumptions.",
        "Skip validation when the result looks plausible.",
        "Use an unrelated method without documenting the choice.",
        "Rely only on intuition instead of evidence.",
      ],
      correct_answer: "A",
      reasoning: `The documented method with validation and explicit assumptions is the most appropriate evidence-based practice for ${competency.name}.`,
      difficulty: competency.requiredLevel >= 4 ? "Advanced" : index === 0 ? "Intermediate" : "Foundational",
    }));
  });
}

function validateQuestions(
  questions: unknown,
  competencies: CompetencyRequirement[],
): questions is Question[] {
  if (!Array.isArray(questions) || questions.length !== 12) return false;

  const validCompetencies = new Map(competencies.map((c) => [c.name, c]));

  for (const question of questions) {
    if (!question || typeof question !== "object") return false;
    const q = question as Question;
    const requirement = validCompetencies.get(q.competency);

    if (
      !requirement ||
      q.category !== requirement.category ||
      q.requiredLevel !== requirement.requiredLevel ||
      typeof q.question !== "string" ||
      !Array.isArray(q.options) ||
      q.options.length !== 4 ||
      typeof q.correct_answer !== "string" ||
      !["A", "B", "C", "D"].includes(q.correct_answer) ||
      typeof q.reasoning !== "string"
    ) {
      return false;
    }
  }

  return CATEGORIES.every(
    (category) => questions.filter((q) => q.category === category).length === 3,
  );
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { profile, role, competencies } = await req.json();
    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");

    if (!profile || !role || !Array.isArray(competencies) || competencies.length === 0) {
      throw new Error("Official profile, role, and role competency requirements are required");
    }

    const requirements = competencies as CompetencyRequirement[];

    if (CATEGORIES.some((category) => requirements.filter((c) => c.category === category).length < 3)) {
      throw new Error("Selected role does not have at least three competencies in every assessment category");
    }

    const competencyRequirements = requirements
      .map((c) => "- " + c.name + " | Category: " + c.category + " | Required level: " + c.requiredLevel)
      .join("\n");

    const prompt = [
      "You are an expert in India's official statistical system and competency-based public-sector assessment.",
      "",
      "Generate exactly 12 multiple-choice questions.",
      "The 12 questions MUST contain exactly 3 Statistical, 3 Technical, 3 Digital Governance, and 3 Behavioural & Managerial questions.",
      "",
      "AUTHORITATIVE SELECTED-ROLE COMPETENCY LIST:",
      competencyRequirements,
      "",
      "The supplied competency list is the ONLY source of truth.",
      "Select competency names ONLY from this list, using the exact spelling.",
      "Never invent, rename, merge, split, or add a competency.",
      "For every question, copy category and requiredLevel exactly from the matching supplied competency.",
      "Do NOT decide or infer requiredLevel yourself.",
      "",
      "Return ONLY a JSON array. No markdown or extra text.",
      "Each object must contain: question, options, correct_answer, reasoning, competency, category, requiredLevel, difficulty.",
      "Each question must have exactly four options labeled A, B, C, D.",
      "correct_answer must be A, B, C, or D.",
      "Use realistic official-statistics and public-sector scenarios.",
    ].join("\n");

    let questions: Question[] | null = null;

    if (GROQ_API_KEY) {
      for (let attempts = 0; attempts < 3 && !questions; attempts++) {
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
                { role: "user", content: prompt },
              ],
              temperature: 0.4,
              max_tokens: 5000,
            }),
          });

          if (!response.ok) continue;

          const data = await response.json();
          let content = data.choices?.[0]?.message?.content?.trim();
          if (!content) continue;

          content = content.replace(/^\`\`\`(?:json)?\s*/i, '').replace(/\s*\`\`\`$/i, '');
          const parsed = JSON.parse(content);

          if (validateQuestions(parsed, requirements)) {
            questions = parsed;
          }
        } catch (error) {
          console.error("Question generation attempt failed:", error);
        }
      }
    }

    if (!questions) {
      questions = buildFallbackQuestions(requirements);
    }

    if (!validateQuestions(questions, requirements)) {
      throw new Error("Unable to produce a valid 12-question role-scoped assessment");
    }

    return new Response(JSON.stringify({ questions }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-questions error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
