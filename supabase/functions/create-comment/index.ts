import { createClient } from "npm:@supabase/supabase-js@2.88.0";
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

  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Missing authorization" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const openaiKey = Deno.env.get("OPENAI_API_KEY");

  if (!supabaseUrl || !anonKey || !serviceKey) {
    return new Response(JSON.stringify({ error: "Missing Supabase configuration" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (!openaiKey) {
    return new Response(JSON.stringify({ error: "OPENAI_API_KEY is not set" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const {
    data: { user },
    error: userError,
  } = await userClient.auth.getUser();

  if (userError || !user) {
    return new Response(JSON.stringify({ error: "Invalid session" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body: { post_id?: unknown; content?: unknown; parent_id?: unknown };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const post_id = typeof body.post_id === "string" ? body.post_id : "";
  const content = typeof body.content === "string" ? body.content : "";
  const parent_id =
    body.parent_id === null || body.parent_id === undefined
      ? null
      : typeof body.parent_id === "string"
        ? body.parent_id
        : null;

  if (!post_id || !content.trim()) {
    return new Response(JSON.stringify({ error: "post_id and content are required" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const openai = new OpenAI({ apiKey: openaiKey });
  let moderation;
  try {
    moderation = await openai.moderations.create({
      model: MODERATION_MODEL,
      input: content,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Moderation request failed";
    return new Response(JSON.stringify({ error: message }), {
      status: 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const modResult = moderation.results[0];
  if (!modResult) {
    return new Response(JSON.stringify({ error: "No moderation result" }), {
      status: 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (modResult.flagged) {
    return new Response(
      JSON.stringify({
        error: "Comment did not pass moderation",
        flagged: true,
        categories: modResult.categories,
      }),
      { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const admin = createClient(supabaseUrl, serviceKey);

  const { data: comment, error: insertError } = await admin
    .from("comments")
    .insert({
      post_id,
      author_id: user.id,
      parent_id,
      content: content.trim(),
      upvotes: 0,
      downvotes: 0,
    })
    .select(
      `
      *,
      author:profiles!author_id(id, display_name, avatar_url)
    `
    )
    .single();

  if (insertError) {
    return new Response(JSON.stringify({ error: insertError.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { error: rpcError } = await admin.rpc("increment_comment_count", { post_id });
  if (rpcError) {
    console.error("increment_comment_count failed:", rpcError);
  }

  const author = comment.author as { id: string; display_name: string; avatar_url: string | null } | null;

  return new Response(
    JSON.stringify({
      comment: {
        ...comment,
        author: author ?? {
          id: user.id,
          display_name: "Unknown",
          avatar_url: null,
        },
        user_vote: null,
      },
    }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});
