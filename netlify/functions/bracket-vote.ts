/**
 * Bracket votes.
 * GET  /api/bracket-vote?bracketId=…  → { counts } (server votes on top of the baseline)
 * POST /api/bracket-vote              → records one vote per device per matchup
 *
 * Repeat voting is limited with an anonymous device ID (one vote per matchup)
 * plus a per-IP rate limit. IPs are stored only as salted hashes.
 */

import { getStore } from '@netlify/blobs';
import bracketFixture from '../../src/data/brackets/f-series-generations.mock.json';
import { findMatchup, roundPhase, slotCandidates, type Bracket, type VoteCounts } from '../../src/utils/bracketModel';

export const config = { path: '/api/bracket-vote' };

const bracket = bracketFixture as Bracket;
const RATE_WINDOW_MS = 10 * 60 * 1000;
// Generous so offices and campuses behind one IP aren't blocked.
const RATE_LIMIT_PER_WINDOW = 120;
const DEVICE_ID_PATTERN = /^[a-z0-9-]{16,64}$/i;

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });

async function hashIp(ip: string): Promise<string> {
  const salt = process.env.BRACKET_IP_SALT || 'motortrend-bracket';
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${salt}:${ip}`));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('').slice(0, 32);
}

function clientIp(request: Request): string {
  return request.headers.get('x-nf-client-connection-ip')
    || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || 'unknown';
}

async function readCounts(bracketId: string): Promise<VoteCounts> {
  const store = getStore('bracket-votes');
  const { blobs } = await store.list({ prefix: `tally/${bracketId}/` });
  const counts: VoteCounts = {};
  for (const { key } of blobs) {
    // tally/{bracketId}/{matchupId}/{generationId}/{deviceId}
    const [, , matchupId, generationId] = key.split('/');
    if (!matchupId || !generationId) continue;
    counts[matchupId] ??= {};
    counts[matchupId][generationId] = (counts[matchupId][generationId] ?? 0) + 1;
  }
  return counts;
}

export default async function handler(request: Request) {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204 });

  if (request.method === 'GET') {
    const bracketId = new URL(request.url).searchParams.get('bracketId');
    if (bracketId !== bracket.id) return json({ error: 'Unknown bracket' }, 404);
    return json({ counts: await readCounts(bracketId) });
  }

  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  let body: { bracketId?: unknown; matchupId?: unknown; generationId?: unknown; deviceId?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const { bracketId, matchupId, generationId, deviceId } = body;
  if (bracketId !== bracket.id) return json({ error: 'Unknown bracket' }, 404);
  if (typeof matchupId !== 'string' || typeof generationId !== 'string') {
    return json({ error: 'matchupId and generationId are required' }, 400);
  }
  if (typeof deviceId !== 'string' || !DEVICE_ID_PATTERN.test(deviceId)) {
    return json({ error: 'A valid deviceId is required' }, 400);
  }

  const found = findMatchup(bracket, matchupId);
  if (!found) return json({ error: 'Unknown matchup' }, 404);
  if (roundPhase(found.round, new Date()) !== 'open') return json({ error: 'This round is not open for voting' }, 403);
  const allowed = new Set([
    ...slotCandidates(bracket, found.matchup.first),
    ...slotCandidates(bracket, found.matchup.second),
  ]);
  if (!allowed.has(generationId)) return json({ error: 'That generation is not in this matchup' }, 400);

  const store = getStore('bracket-votes');

  const rateKey = `rate/${await hashIp(clientIp(request))}/${Math.floor(Date.now() / RATE_WINDOW_MS)}`;
  const used = Number(await store.get(rateKey)) || 0;
  if (used >= RATE_LIMIT_PER_WINDOW) return json({ error: 'Too many votes from this network. Try again later.' }, 429);
  await store.set(rateKey, String(used + 1));

  const claim = await store.set(`device/${bracketId}/${matchupId}/${deviceId}`, generationId, { onlyIfNew: true });
  if (!claim.modified) return json({ error: 'Already voted on this matchup', duplicate: true }, 409);

  await store.set(`tally/${bracketId}/${matchupId}/${generationId}/${deviceId}`, new Date().toISOString());
  return json({ ok: true });
}
