import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { userInfo, competencyResults, priorityGaps, evaluation } = await req.json();
    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
    if (!GROQ_API_KEY) throw new Error("GROQ_API_KEY is not configured");

    if (!userInfo || !Array.isArray(competencyResults)) {
      throw new Error("Official profile and competency results are required");
    }

    const prompt = [
      "You are an expert learning designer for India's official statistical system.",
      "Create a practical 7-day personalized competency development roadmap for a government official.",
      "",
      "OFFICIAL PROFILE:",
      "- Name: " + (userInfo.name ?? ""),
      "- Designation: " + (userInfo.designation ?? ""),
      "- Department / Organization: " + (userInfo.department ?? ""),
      "- Role: " + (userInfo.role ?? ""),
      "- Current Assignment: " + (userInfo.currentAssignment ?? ""),
      "- Qualification: " + (userInfo.qualification ?? ""),
      "- Experience: " + (userInfo.experienceYears ?? 0) + " years",
      "",
      "DETERMINISTIC COMPETENCY RESULTS:",
      JSON.stringify(competencyResults, null, 2),
      "",
      "PRIORITY GAPS:",
      JSON.stringify(priorityGaps ?? [], null, 2),
      "",
      "QUALITATIVE AI ASSESSMENT:",
      JSON.stringify(evaluation ?? {}, null, 2),
      "",
      "Return ONLY valid JSON with this structure:",
      JSON.stringify({
        title: "7-Day Competency Development Roadmap",
        overview: "Brief roadmap overview",
        days: [{
          day: 1,
          title: "Day title",
          goals: ["goal 1"],
          activities: ["activity 1"],
          resources: [{ title: "Resource name", url: "https://...", type: "article" }],
          practice: "Practice exercise"
        }],
        tips: ["tip 1", "tip 2"]
      }, null, 2),
      "",
      "Rules:",
      "- Exactly 7 days.",
      "- Focus primarily on the largest competency gaps.",
      "- Keep activities realistic for a working government official.",
      "- Use official/public-sector learning resources where possible, including iGOT Karmayogi when an appropriate public link is known.",
      "- Do not invent specific iGOT course URLs. If a specific course URL is not known, use a relevant official learning/search URL or omit the resource.",
      "- Include theory, practical application, and reflection.",
      "- Do not change or reinterpret the supplied competency levels.",
      "- No markdown; return only valid JSON."
    ].join("\n");

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + GROQ_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [
          { role: "system", content: "You are a JSON-only response bot. Return only valid JSON." },
          { role: "user", content: prompt },
        ],
        temperature: 0.6,
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Groq roadmap error:", response.status, errText);
      throw new Error("Groq API error: " + response.status);
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content?.trim() || "{}";
    content = content.replace(/^\`\`\`(?:json)?\s*/i, '').replace(/\s*\`\`\`$/i, '');

    let roadmap;
    try {
      roadmap = JSON.parse(content);
    } catch {
      roadmap = {
        title: "Competency Development Roadmap",
        overview: "The roadmap could not be generated. Please try again.",
        days: [],
        tips: []
      };
    }

    return new Response(JSON.stringify({ roadmap }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-roadmap error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
