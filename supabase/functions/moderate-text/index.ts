import OpenAI from "npm:openai@6.34.0";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const MODERATION_MODEL = "omni-moderation-latest";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const openaiKey = Deno.env.get("OPENAI_API_KEY");
  if (!openaiKey) {
    return new Response(JSON.stringify({ error: "OPENAI_API_KEY is not set" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let text: string;
  try {
    const body = await req.json();
    if (typeof body.text !== "string" || !body.text.trim()) {
      return new Response(JSON.stringify({ error: "Body must have a non-empty `text` field" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    text = body.text;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const openai = new OpenAI({ apiKey: openaiKey });

  try {
    const response = await openai.moderations.create({
      model: MODERATION_MODEL,
      input: text,
    });
    const result = response.results[0];
    if (!result) {
      return new Response(JSON.stringify({ error: "No moderation result" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        flagged: result.flagged,
        categories: result.categories,
        category_scores: result.category_scores,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Moderation request failed";
    return new Response(JSON.stringify({ error: message }), {
      status: 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
