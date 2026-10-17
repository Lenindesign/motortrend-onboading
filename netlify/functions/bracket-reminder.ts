/**
 * POST /api/bracket-reminder
 * Stores a signed-in reader's request to be reminded when a bracket round opens
 * (`round-2` … `round-4`) or when the next bracket launches (`next-bracket`).
 * bracket-round-reminders.ts sends them when the round opens.
 */

import { getStore } from '@netlify/blobs';
import bracketFixture from '../../src/data/brackets/f-series-generations.mock.json';
import type { Bracket } from '../../src/utils/bracketModel';

export const config = { path: '/api/bracket-reminder' };

const bracket = bracketFixture as Bracket;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });

const validTargets = new Set([
  ...bracket.rounds.map((round) => `round-${round.number}`),
  'next-bracket',
]);

export default async function handler(request: Request) {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204 });
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  let body: { bracketId?: unknown; target?: unknown; subscriberId?: unknown; email?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const subscriberId = typeof body.subscriberId === 'string' ? body.subscriberId.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  if (body.bracketId !== bracket.id) return json({ error: 'Unknown bracket' }, 404);
  if (typeof body.target !== 'string' || !validTargets.has(body.target)) return json({ error: 'Unknown reminder target' }, 400);
  if (!subscriberId || !EMAIL_PATTERN.test(email)) return json({ error: 'subscriberId and a valid email are required' }, 400);

  await getStore('bracket-reminders').setJSON(`${bracket.id}/${body.target}/${subscriberId}`, {
    subscriberId,
    email,
    createdAt: new Date().toISOString(),
  });
  return json({ stored: true });
}
