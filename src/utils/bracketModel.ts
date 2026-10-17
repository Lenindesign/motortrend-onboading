/**
 * Bracket voting model shared by the BracketVotingV2 component and the
 * bracket Netlify functions. Pure logic only: no browser or server APIs.
 *
 * Rounds open and close on editor-set dates; community votes decide who
 * advances; ties go to the higher seed (lower seed number).
 */

export type Generation = {
  id: string;
  seed: number;
  generation: number;
  years: string;
  name: string;
  fact?: string;
  image?: string;
  imageAlt?: string;
};
export type Matchup = { id: string; first: string; second: string; votes: number[] };
export type Round = {
  id: string;
  number: number;
  label: string;
  opensAt: string;
  closesAt: string;
  byes?: string[];
  matchups?: Matchup[];
};
export type Bracket = {
  id: string;
  title: string;
  question: string;
  roundCount: number;
  rounds: Round[];
  generations: Generation[];
};

/** Extra votes per matchup, keyed by generation id, on top of the baseline `votes`. */
export type VoteCounts = Record<string, Record<string, number>>;

export type RoundPhase = 'scheduled' | 'open' | 'closed';

export type BracketPhase =
  | { kind: 'upcoming'; next: Round }
  | { kind: 'open'; round: Round; previous?: Round; next?: Round }
  | { kind: 'between'; previous: Round; next: Round }
  | { kind: 'complete'; final: Round };

export type ResolvedMatchup = { config: Matchup; first: Generation; second: Generation };

export type Tally = {
  firstVotes: number;
  secondVotes: number;
  firstPercent: number;
  secondPercent: number;
  winner: Generation;
  loser: Generation;
  tied: boolean;
};

export function roundPhase(round: Round, now: Date): RoundPhase {
  const time = now.getTime();
  if (time < Date.parse(round.opensAt)) return 'scheduled';
  if (time < Date.parse(round.closesAt)) return 'open';
  return 'closed';
}

export function bracketPhase(bracket: Bracket, now: Date): BracketPhase {
  const rounds = bracket.rounds;
  const openIndex = rounds.findIndex((round) => roundPhase(round, now) === 'open');
  if (openIndex >= 0) {
    return { kind: 'open', round: rounds[openIndex], previous: rounds[openIndex - 1], next: rounds[openIndex + 1] };
  }
  const nextIndex = rounds.findIndex((round) => roundPhase(round, now) === 'scheduled');
  if (nextIndex === 0) return { kind: 'upcoming', next: rounds[0] };
  if (nextIndex > 0) return { kind: 'between', previous: rounds[nextIndex - 1], next: rounds[nextIndex] };
  return { kind: 'complete', final: rounds[rounds.length - 1] };
}

export function findMatchup(bracket: Bracket, matchupId: string): { round: Round; matchup: Matchup } | undefined {
  for (const round of bracket.rounds) {
    const matchup = round.matchups?.find((candidate) => candidate.id === matchupId);
    if (matchup) return { round, matchup };
  }
  return undefined;
}

export function tally(config: Matchup, first: Generation, second: Generation, counts: VoteCounts): Tally {
  const extra = counts[config.id] ?? {};
  const firstVotes = config.votes[0] + (extra[first.id] ?? 0);
  const secondVotes = config.votes[1] + (extra[second.id] ?? 0);
  const total = Math.max(1, firstVotes + secondVotes);
  const tied = firstVotes === secondVotes;
  const firstWins = tied ? first.seed < second.seed : firstVotes > secondVotes;
  return {
    firstVotes,
    secondVotes,
    firstPercent: Math.round((firstVotes / total) * 100),
    secondPercent: Math.round((secondVotes / total) * 100),
    winner: firstWins ? first : second,
    loser: firstWins ? second : first,
    tied,
  };
}

function generationIndex(bracket: Bracket) {
  return new Map(bracket.generations.map((generation) => [generation.id, generation]));
}

/** Resolve a matchup slot (`generation-3` or `winner:opening-1`) from community results. */
export function resolveGeneration(bracket: Bracket, reference: string, counts: VoteCounts): Generation | undefined {
  const byId = generationIndex(bracket);
  const resolve = (ref: string): Generation | undefined => {
    const direct = byId.get(ref);
    if (direct) return direct;
    if (!ref.startsWith('winner:')) return undefined;
    const found = findMatchup(bracket, ref.slice('winner:'.length));
    if (!found) return undefined;
    const first = resolve(found.matchup.first);
    const second = resolve(found.matchup.second);
    return first && second ? tally(found.matchup, first, second, counts).winner : undefined;
  };
  return resolve(reference);
}

export function resolveRound(bracket: Bracket, round: Round, counts: VoteCounts): ResolvedMatchup[] {
  return (round.matchups ?? []).flatMap((config) => {
    const first = resolveGeneration(bracket, config.first, counts);
    const second = resolveGeneration(bracket, config.second, counts);
    return first && second ? [{ config, first, second }] : [];
  });
}

/** Every generation that could fill a slot, used to validate votes server-side. */
export function slotCandidates(bracket: Bracket, reference: string): Set<string> {
  const byId = generationIndex(bracket);
  const collect = (ref: string, into: Set<string>): Set<string> => {
    if (byId.has(ref)) return into.add(ref);
    if (!ref.startsWith('winner:')) return into;
    const found = findMatchup(bracket, ref.slice('winner:'.length));
    if (found) {
      collect(found.matchup.first, into);
      collect(found.matchup.second, into);
    }
    return into;
  };
  return collect(reference, new Set());
}
