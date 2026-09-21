import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { profile, role, competencies } = await req.json();
    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
    if (!GROQ_API_KEY) throw new Error("GROQ_API_KEY is not configured");
    if (!profile || !role || !Array.isArray(competencies) || competencies.length === 0) {
      throw new Error("Official profile, role, and role competency requirements are required");
    }

    const count = 11;
    const competencyRequirements = competencies
      .map((c: { name: string; category: string; requiredLevel: number }) =>
        "- " + c.name + " | Category: " + c.category + " | Required level: " + c.requiredLevel
      ).join("\n");

    const prompt = [
      "You are an expert in India's official statistical system, public-sector capacity building, and competency-based assessment.",
      "",
      "Generate exactly " + count + " multiple-choice questions for a government statistical official.",
      "",
      "OFFICIAL PROFILE:",
      "- Name: " + (profile.name ?? ""),
      "- Designation: " + (profile.designation ?? ""),
      "- Department / Organization: " + (profile.department ?? ""),
      "- Job Role: " + role,
      "- Current Assignment: " + (profile.currentAssignment ?? ""),
      "- Highest Qualification: " + (profile.qualification ?? ""),
      "- Years of Experience: " + (profile.experienceYears ?? 0),
      "- Previous Training: " + (profile.previousTraining ?? ""),
      "",
      "DETERMINISTIC ROLE COMPETENCY REQUIREMENTS:",
      competencyRequirements,
      "",
      "The competency list above is authoritative. Do NOT invent, rename, merge, or add competencies. Every question MUST map to exactly one competency from that list and use its exact category and requiredLevel.",
      "",
      "Return ONLY valid JSON — no markdown, no extra text, no code fences. The response must be a JSON array.",
      "Each object must contain: competency, category, requiredLevel, question, options, correct_answer, reasoning, difficulty.",
      "",
      "Rules:",
      "- Generate exactly " + count + " questions.",
      "- Each question must have exactly 4 options labeled A, B, C, D.",
      "- correct_answer must be one of A, B, C, D.",
      "- competency, category, and requiredLevel must exactly match a supplied competency requirement.",
      "- Cover all four competency categories.",
      "- Prioritize competencies with higher required levels while ensuring all four categories are represented.",
      "- Questions must assess practical competency, not student-level textbook recall.",
      "- Use realistic public-sector scenarios involving surveys, sampling, official statistics, data quality, statistical databases, privacy, cybersecurity, government data, data visualization, communication, and decision making.",
      "- Adapt context to the official's designation, department, assignment, experience, and training where useful.",
      "- Higher required levels should generally use more analytical or scenario-based questions."
    ].join("\n");

    let attempts = 0;
    let questions = null;

    while (attempts < 3 && !questions) {
      attempts++;
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + GROQ_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta-llama/llama-4-scout-17b-16e-instruct",
          messages: [
            { role: "system", content: "You are a JSON-only response bot. Never include markdown or extra text." },
            { role: "user", content: prompt },
          ],
          temperature: 0.7,
          max_tokens: 4096,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("Groq API error (attempt " + attempts + "):", response.status, errText);
        if (attempts >= 3) throw new Error("Groq API error: " + response.status);
        continue;
      }

      const data = await response.json();
      let responseContent = data.choices?.[0]?.message?.content?.trim();
      if (!responseContent) continue;
      responseContent = responseContent.replace(/^\`\`\`(?:json)?\s*/i, '').replace(/\s*\`\`\`$/i, '');

      try {
        const parsed = JSON.parse(responseContent);
        if (!Array.isArray(parsed) || parsed.length !== count) continue;

        const validCompetencies = new Map(
          competencies.map((c: { name: string; category: string; requiredLevel: number }) => [c.name, c])
        );

        let valid = true;
        for (const q of parsed) {
          const requirement = validCompetencies.get(q.competency);
          if (
            !requirement ||
            q.category !== requirement.category ||
            q.requiredLevel !== requirement.requiredLevel ||
            !q.question ||
            !Array.isArray(q.options) ||
            q.options.length !== 4 ||
            !q.correct_answer ||
            !["A", "B", "C", "D"].includes(q.correct_answer) ||
            !q.reasoning ||
            !q.difficulty
          ) {
            valid = false;
            break;
          }
        }

        const categoriesCovered = new Set(parsed.map((q: any) => q.category));
        if (!["Statistical", "Technical", "Digital Governance", "Behavioural & Managerial"].every((category) => categoriesCovered.has(category))) {
          valid = false;
        }

        if (valid) questions = parsed;
      } catch {
        console.error("JSON parse failed (attempt " + attempts + ")");
      }
    }

    if (!questions) throw new Error("Failed to generate valid competency questions after 3 attempts");

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
