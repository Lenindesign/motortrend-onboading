import { canUseSupabase } from '../lib/supabase';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export interface ModerationResult {
  flagged: boolean;
  categories?: Record<string, boolean>;
}

/**
 * Check text against OpenAI moderation via the moderate-text Edge Function.
 * Does not require a Supabase auth session — only the anon key.
 * Returns { flagged: false } when Supabase is not configured (demo mode).
 */
export async function moderateText(text: string): Promise<ModerationResult> {
  if (!canUseSupabase() || !SUPABASE_URL || !ANON_KEY) {
    return { flagged: false };
  }

  const fnUrl = `${SUPABASE_URL.replace(/\/$/, '')}/functions/v1/moderate-text`;

  const res = await fetch(fnUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: ANON_KEY,
    },
    body: JSON.stringify({ text }),
  });

  const payload = await res.json();

  if (!res.ok) {
    throw new Error(payload.error || 'Moderation check failed');
  }

  return {
    flagged: !!payload.flagged,
    categories: payload.categories,
  };
}
