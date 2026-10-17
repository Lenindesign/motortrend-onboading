/**
 * Client for the bracket vote and reminder endpoints (netlify/functions/bracket-*.ts).
 * Every call degrades gracefully: when the endpoints aren't reachable (plain
 * `vite` dev, offline) the component keeps working with local-only votes.
 */

import type { VoteCounts } from '../utils/bracketModel';

const DEVICE_ID_KEY = 'motortrend-device-id';

/** Anonymous per-browser ID used for one-vote-per-matchup checks on the server. */
export function getDeviceId(): string {
  try {
    const existing = localStorage.getItem(DEVICE_ID_KEY);
    if (existing) return existing;
    const created = crypto.randomUUID();
    localStorage.setItem(DEVICE_ID_KEY, created);
    return created;
  } catch {
    return crypto.randomUUID();
  }
}

/** Demo-only: start over as a new anonymous voter. */
export function resetDeviceId(): void {
  try {
    localStorage.removeItem(DEVICE_ID_KEY);
  } catch {
    // Nothing stored.
  }
}

export async function fetchBracketCounts(bracketId: string): Promise<VoteCounts | null> {
  try {
    const response = await fetch(`/api/bracket-vote?bracketId=${encodeURIComponent(bracketId)}`, {
      headers: { Accept: 'application/json' },
    });
    if (!response.ok || !(response.headers.get('content-type') || '').includes('application/json')) return null;
    const result = await response.json() as { counts?: VoteCounts };
    return result.counts ?? null;
  } catch {
    return null;
  }
}

export type VotePayload = { bracketId: string; matchupId: string; generationId: string };

/**
 * `counted`: the server recorded it. `duplicate`: this browser already voted.
 * `local`: the server didn't take it (unreachable, round not open, rate limited),
 * so the vote only counts in this browser.
 */
export type VoteResult = 'counted' | 'duplicate' | 'local';

export async function submitBracketVote(payload: VotePayload): Promise<VoteResult> {
  try {
    const response = await fetch('/api/bracket-vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ ...payload, deviceId: getDeviceId() }),
    });
    if (response.status === 409) return 'duplicate';
    return response.ok && (response.headers.get('content-type') || '').includes('application/json') ? 'counted' : 'local';
  } catch {
    return 'local';
  }
}

/** Fire-and-forget submit for a pending pick when the page is closing. */
export function beaconBracketVote(payload: VotePayload): void {
  try {
    const body = new Blob([JSON.stringify({ ...payload, deviceId: getDeviceId() })], { type: 'application/json' });
    navigator.sendBeacon?.('/api/bracket-vote', body);
  } catch {
    // Best effort only.
  }
}

export type ReminderPayload = {
  bracketId: string;
  /** `round-2` … `round-4`, or `next-bracket` after the Final. */
  target: string;
  subscriberId: string;
  email: string;
};

/** Returns true when the server stored the reminder. */
export async function subscribeBracketReminder(payload: ReminderPayload): Promise<boolean> {
  try {
    const response = await fetch('/api/bracket-reminder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) return false;
    const result = await response.json() as { stored?: boolean };
    return result.stored === true;
  } catch {
    return false;
  }
}
