/**
 * Scheduled: every Monday shortly after rounds open (14:00 UTC), send a reminder
 * to everyone who asked to hear about the round that just opened.
 * Delivery goes through the Novu workflow, which owns the email template.
 */

import { getStore } from '@netlify/blobs';
import bracketFixture from '../../src/data/brackets/f-series-generations.mock.json';
import { roundPhase, type Bracket } from '../../src/utils/bracketModel';

export const config = { schedule: '30 14 * * 1' };

const bracket = bracketFixture as Bracket;
const SITE_URL = process.env.URL || 'https://motortrend-onboarding.netlify.app';
const BRACKET_PAGE = '/vehicles/2026/Ford/F-150';

type Subscription = { subscriberId: string; email: string };

export default async function handler() {
  const now = new Date();
  // The round that opened within the last day.
  const opened = bracket.rounds.find((round) =>
    roundPhase(round, now) === 'open' && now.getTime() - Date.parse(round.opensAt) < 24 * 60 * 60 * 1000);
  if (!opened) return;

  const secretKey = process.env.NOVU_SECRET_KEY;
  const workflowId = process.env.NOVU_BRACKET_WORKFLOW_ID || 'motortrend-bracket-round-open';
  if (!secretKey) {
    console.warn(`Bracket reminders for ${opened.label} skipped: NOVU_SECRET_KEY is not set.`);
    return;
  }

  const store = getStore('bracket-reminders');
  const prefix = `${bracket.id}/round-${opened.number}/`;
  const { blobs } = await store.list({ prefix });

  let sent = 0;
  for (const { key } of blobs) {
    const sentKey = `sent/${key}`;
    if (await store.get(sentKey)) continue;
    const subscription = await store.get(key, { type: 'json' }) as Subscription | null;
    if (!subscription) continue;

    const url = new URL(`${BRACKET_PAGE}?utm_source=bracket_reminder&utm_medium=email&utm_campaign=${encodeURIComponent(bracket.id)}`, SITE_URL);
    const response = await fetch('https://api.novu.co/v1/events/trigger', {
      method: 'POST',
      headers: { Authorization: `ApiKey ${secretKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: workflowId,
        to: [{ subscriberId: subscription.subscriberId, email: subscription.email }],
        payload: {
          bracketTitle: bracket.title,
          roundLabel: opened.label,
          closesAt: opened.closesAt,
          url: url.toString(),
        },
      }),
    });
    if (response.ok) {
      await store.set(sentKey, now.toISOString());
      sent += 1;
    } else {
      console.error('Novu bracket reminder failed:', response.status, await response.text());
    }
  }
  console.log(`Bracket reminders for ${opened.label}: sent ${sent} of ${blobs.length}.`);
}
