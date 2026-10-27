import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { ArrowRight, Bell, CaretDown, Check, CheckCircle, TreeStructure, X } from '@phosphor-icons/react';
import { ModalShell } from '../atoms/ModalShell';
import { AuthPromptModal } from '../AuthPromptModal';
import { useAuth } from '../../contexts/AuthContext';
import { getAutosUgcBracketPreview } from '../../services/autosUgcBracketPreview';
import {
  beaconBracketVote,
  fetchBracketCounts,
  resetDeviceId,
  submitBracketVote,
  subscribeBracketReminder,
} from '../../services/bracketVotes';
import { trackCDPEvent } from '../../utils/cdpTracking';
import {
  bracketPhase,
  resolveRound,
  roundPhase,
  tally,
  type Bracket,
  type Generation,
  type Round,
  type VoteCounts,
} from '../../utils/bracketModel';
import './BracketVotingV2.css';

/**
 * F-Series bracket voting. See docs/f-series-bracket-voting-design.md.
 * Editors open one round a week; community votes decide who advances.
 * Anyone can vote; reminders need a signed-in account.
 */

type LocalState = {
  /** Locked picks (the reader tapped Next), keyed by matchup id. */
  picks: Record<string, string>;
  /** Picks the server didn't take; they only count in this browser. */
  localVotes: Record<string, string>;
  /** Reminder targets this reader asked for: `round-2`, `next-bracket`, … */
  reminders: Record<string, boolean>;
  /** Rounds for which the return-voter event already fired. */
  returnTracked: Record<string, boolean>;
};
type Pending = { matchupId: string; generationId: string };
type View = 'voting' | 'recap' | 'strip';

const HISTORY_URL = 'https://www.motortrend.com/reviews/ford-f-150-from-1948-to-2021';
const bracket = getAutosUgcBracketPreview() as Bracket;
const storageKey = `motortrend-bracket-v2:${bracket.id}`;
const simulatedDateKey = `motortrend-bracket-sim-date:${bracket.id}`;
const pendingReminderKey = `motortrend-bracket-pending-reminder:${bracket.id}`;
const reminderVisitKey = `motortrend-bracket-reminder-visit:${bracket.id}`;
const emptyState: LocalState = { picks: {}, localVotes: {}, reminders: {}, returnTracked: {} };

const formatVotes = (value: number) => new Intl.NumberFormat('en-US').format(value);
const formatDay = (iso: string) => new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).format(new Date(iso));
const formatShortDay = (iso: string) => new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date(iso));

function readLocalState(): LocalState {
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey) || '{}') as Partial<LocalState>;
    const record = (value: unknown) => (value && typeof value === 'object' ? value as Record<string, never> : {});
    return {
      picks: record(parsed.picks),
      localVotes: record(parsed.localVotes),
      reminders: record(parsed.reminders),
      returnTracked: record(parsed.returnTracked),
    };
  } catch {
    return emptyState;
  }
}

function readSession(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeSession(key: string, value: string | null) {
  try {
    if (value === null) sessionStorage.removeItem(key);
    else sessionStorage.setItem(key, value);
  } catch {
    // Session storage unavailable; the feature just won't persist across reloads.
  }
}

function addVote(counts: VoteCounts, matchupId: string, generationId: string): VoteCounts {
  const matchup = counts[matchupId] ?? {};
  return { ...counts, [matchupId]: { ...matchup, [generationId]: (matchup[generationId] ?? 0) + 1 } };
}

function track(event: string, properties: Record<string, string | number | boolean> = {}) {
  trackCDPEvent({ event, properties: { bracketId: bracket.id, ...properties }, timestamp: new Date().toISOString() });
}

/** Demo controls are for internal review only: dev builds, or `?bracketDemo=1`. */
const demoEnabled = import.meta.env.DEV
  || (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('bracketDemo') === '1');

/** Moments the demo can jump to: one hour into each round, or after the Final. */
const demoMoments = [
  ...bracket.rounds.map((round) => ({
    value: new Date(Date.parse(round.opensAt) + 60 * 60 * 1000).toISOString(),
    label: `${round.label} open (${formatShortDay(round.opensAt)})`,
  })),
  {
    value: new Date(Date.parse(bracket.rounds[bracket.rounds.length - 1].closesAt) + 60 * 60 * 1000).toISOString(),
    label: 'After the Final',
  },
];

export const BracketVotingV2: React.FC = () => {
  const { user } = useAuth();
  const signedIn = Boolean(user && !user.isAnonymous);

  const [local, setLocal] = useState<LocalState>(readLocalState);
  const [serverCounts, setServerCounts] = useState<VoteCounts | null>(null);
  const [pending, setPending] = useState<Pending | null>(null);
  const [simulatedDate, setSimulatedDate] = useState<string | null>(() => (demoEnabled ? readSession(simulatedDateKey) : null));
  const [clock, setClock] = useState(() => Date.now());
  const [matchIndex, setMatchIndex] = useState(0);
  const [view, setView] = useState<View>('voting');
  const [demoOpen, setDemoOpen] = useState(false);
  const [isFullBracketOpen, setIsFullBracketOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [pendingReminder, setPendingReminder] = useState<string | null>(() => readSession(pendingReminderKey));
  const fullBracketTriggerRef = useRef<HTMLButtonElement>(null);
  const fullBracketCloseRef = useRef<HTMLButtonElement>(null);
  const wasFullBracketOpen = useRef(false);
  const uid = useId().replace(/:/g, '');
  const fullBracketTitleId = `${uid}-full-bracket-title`;
  const demoPanelId = `${uid}-demo-controls`;

  const now = useMemo(() => (simulatedDate ? new Date(simulatedDate) : new Date(clock)), [simulatedDate, clock]);
  const phase = bracketPhase(bracket, now);
  const openRound = phase.kind === 'open' ? phase.round : undefined;

  // Community counts: baseline + server votes + votes only this browser knows about + the undoable pick.
  const counts = useMemo(() => {
    let merged: VoteCounts = serverCounts ?? {};
    for (const [matchupId, generationId] of Object.entries(local.localVotes)) merged = addVote(merged, matchupId, generationId);
    if (pending) merged = addVote(merged, pending.matchupId, pending.generationId);
    return merged;
  }, [serverCounts, local.localVotes, pending]);

  const matchups = useMemo(() => (openRound ? resolveRound(bracket, openRound, counts) : []), [openRound, counts]);
  const roundDone = matchups.length > 0 && matchups.every(({ config }) => local.picks[config.id]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(local));
    } catch {
      // Keep voting usable when browser storage is unavailable.
    }
  }, [local]);

  useEffect(() => {
    let cancelled = false;
    void fetchBracketCounts(bracket.id).then((result) => {
      if (!cancelled && result) setServerCounts(result);
    });
    return () => { cancelled = true; };
  }, []);

  // Rounds open and close on a schedule, so keep the clock moving.
  useEffect(() => {
    const interval = window.setInterval(() => setClock(Date.now()), 60_000);
    return () => window.clearInterval(interval);
  }, []);

  // Arriving from a reminder email or inbox notification.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('utm_source') !== 'bracket_reminder' || readSession(reminderVisitKey)) return;
    writeSession(reminderVisitKey, '1');
    track('bracket_reminder_visit', { medium: params.get('utm_medium') || 'unknown' });
  }, []);

  // Each time the open round changes, start on the first unvoted matchup, or the compact strip if all are voted.
  const openRoundId = openRound?.id;
  useEffect(() => {
    if (!openRound) return;
    const firstOpen = (openRound.matchups ?? []).findIndex((matchup) => !local.picks[matchup.id]);
    setMatchIndex(Math.max(0, firstOpen));
    setView(firstOpen === -1 ? 'strip' : 'voting');
    setPending(null);
    // Only when the round itself changes, not on every pick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openRoundId]);

  useEffect(() => {
    if (isFullBracketOpen) {
      wasFullBracketOpen.current = true;
      const focusTimer = window.setTimeout(() => fullBracketCloseRef.current?.focus(), 0);
      return () => window.clearTimeout(focusTimer);
    }
    if (wasFullBracketOpen.current) {
      wasFullBracketOpen.current = false;
      fullBracketTriggerRef.current?.focus();
    }
  }, [isFullBracketOpen]);

  const lockPending = useCallback(() => {
    if (!pending) return;
    const { matchupId, generationId } = pending;
    setPending(null);
    setLocal((state) => ({ ...state, picks: { ...state.picks, [matchupId]: generationId } }));
    void submitBracketVote({ bracketId: bracket.id, matchupId, generationId }).then((result) => {
      if (result === 'counted') setServerCounts((current) => (current ? addVote(current, matchupId, generationId) : current));
      if (result === 'local') setLocal((state) => ({ ...state, localVotes: { ...state.localVotes, [matchupId]: generationId } }));
    });
  }, [pending]);

  // A pick that was never confirmed with Next still counts if the reader leaves the page.
  useEffect(() => {
    if (!pending) return;
    const onPageHide = () => {
      beaconBracketVote({ bracketId: bracket.id, ...pending });
      try {
        const saved = readLocalState();
        saved.picks[pending.matchupId] = pending.generationId;
        if (!serverCounts) saved.localVotes[pending.matchupId] = pending.generationId;
        localStorage.setItem(storageKey, JSON.stringify(saved));
      } catch {
        // Best effort only.
      }
    };
    window.addEventListener('pagehide', onPageHide);
    return () => window.removeEventListener('pagehide', onPageHide);
  }, [pending, serverCounts]);

  const subscribe = useCallback((target: string) => {
    if (!user || user.isAnonymous) return;
    setLocal((state) => ({ ...state, reminders: { ...state.reminders, [target]: true } }));
    void subscribeBracketReminder({ bracketId: bracket.id, target, subscriberId: user.id, email: user.email }).then((stored) => {
      track('bracket_reminder_subscribed', { target, stored });
    });
  }, [user]);

  const requestReminder = (target: string) => {
    track('bracket_reminder_click', { target, signedIn });
    if (signedIn) {
      subscribe(target);
      return;
    }
    setPendingReminder(target);
    writeSession(pendingReminderKey, target);
    setAuthOpen(true);
    track('bracket_reminder_auth_prompt', { target });
  };

  // Finish the reminder the reader asked for once they've signed in (including after an OAuth redirect).
  useEffect(() => {
    if (!signedIn || !pendingReminder) return;
    subscribe(pendingReminder);
    setPendingReminder(null);
    writeSession(pendingReminderKey, null);
    setAuthOpen(false);
  }, [signedIn, pendingReminder, subscribe]);

  const index = Math.min(matchIndex, Math.max(0, matchups.length - 1));
  const current = matchups[index];
  const selected = current && (pending?.matchupId === current.config.id ? pending.generationId : local.picks[current.config.id]);
  const locked = Boolean(current && local.picks[current.config.id]);
  const revealed = Boolean(selected);
  const outcome = current ? tally(current.config, current.first, current.second, counts) : undefined;

  const vote = (generationId: string) => {
    if (!current || !openRound || revealed) return;
    setPending({ matchupId: current.config.id, generationId });
    track('bracket_vote', { roundNumber: openRound.number, matchupId: current.config.id, generationId });
    const votedEarlier = bracket.rounds
      .filter((round) => round.number < openRound.number)
      .some((round) => (round.matchups ?? []).some((matchup) => local.picks[matchup.id]));
    if (votedEarlier && !local.returnTracked[openRound.number]) {
      track('bracket_return_voter', { roundNumber: openRound.number });
      setLocal((state) => ({ ...state, returnTracked: { ...state.returnTracked, [openRound.number]: true } }));
    }
  };

  const undo = () => {
    if (!pending) return;
    track('bracket_vote_undo', { matchupId: pending.matchupId });
    setPending(null);
  };

  const next = () => {
    if (!openRound) return;
    lockPending();
    const voted = (matchupId: string) => local.picks[matchupId] || pending?.matchupId === matchupId;
    const order = [...matchups.slice(index + 1), ...matchups.slice(0, index)];
    const target = order.find(({ config }) => !voted(config.id));
    if (target) {
      setMatchIndex(matchups.indexOf(target));
      return;
    }
    setView('recap');
    track('bracket_round_complete', { roundNumber: openRound.number });
  };

  const jumpTo = (target: number) => {
    lockPending();
    setView('voting');
    setMatchIndex(target);
  };

  let status = 'Tap a truck to cast your vote.';
  if (current && outcome && selected) {
    const myPercent = selected === current.first.id ? outcome.firstPercent : outcome.secondPercent;
    if (outcome.tied) status = `Dead even. Generation ${outcome.winner.generation} leads on the higher-seed tiebreak.`;
    else if (myPercent >= 50) status = `You’re with ${myPercent}% of voters.`;
    else status = `Bold pick: ${myPercent}% of voters agree with you.`;
  }

  const recapPicks = matchups.flatMap(({ config, first, second }) => {
    const pick = local.picks[config.id];
    if (!pick) return [];
    const result = tally(config, first, second, counts);
    const mine = pick === first.id ? first : second;
    const percent = mine.id === first.id ? result.firstPercent : result.secondPercent;
    return [{ id: config.id, generation: mine, percent, leading: result.winner.id === mine.id }];
  });
  const leadingCount = recapPicks.filter((pick) => pick.leading).length;

  // Final results of the round that just closed (shown at the top of the next round).
  const previousResults = useMemo(() => {
    if (phase.kind !== 'open' || !phase.previous) return undefined;
    const previous = phase.previous;
    const results = resolveRound(bracket, previous, counts).map(({ config, first, second }) => {
      const result = tally(config, first, second, counts);
      return { id: config.id, result, winnerPercent: result.winner.id === first.id ? result.firstPercent : result.secondPercent };
    });
    const mine = results.filter(({ id }) => local.picks[id]);
    const advanced = mine.filter(({ id, result }) => local.picks[id] === result.winner.id).length;
    return { round: previous, results, mine: mine.length, advanced };
  }, [phase, counts, local.picks]);

  const champion = useMemo(() => {
    if (phase.kind !== 'complete') return undefined;
    const [finalMatchup] = resolveRound(bracket, phase.final, counts);
    if (!finalMatchup) return undefined;
    const result = tally(finalMatchup.config, finalMatchup.first, finalMatchup.second, counts);
    return {
      generation: result.winner,
      mine: local.picks[finalMatchup.config.id] === result.winner.id,
      percent: result.winner.id === finalMatchup.first.id ? result.firstPercent : result.secondPercent,
      total: result.firstVotes + result.secondVotes,
    };
  }, [phase, counts, local.picks]);

  const fullBracketRounds = useMemo(() => bracket.rounds.map((round) => {
    const roundStatus = roundPhase(round, now);
    return {
      ...round,
      roundStatus,
      resolved: roundStatus === 'scheduled' ? [] : resolveRound(bracket, round, counts).map((matchup) => ({
        ...matchup,
        result: tally(matchup.config, matchup.first, matchup.second, counts),
      })),
    };
  }), [now, counts]);

  const nextStep = (round: Round) => {
    const following = bracket.rounds.find((candidate) => candidate.number === round.number + 1);
    return following
      ? { target: `round-${following.number}`, headline: `${following.label} open ${formatDay(following.opensAt)}`, cta: `Remind me when the ${following.label} open` }
      : { target: 'next-bracket', headline: `The champion is crowned ${formatDay(round.closesAt)}`, cta: 'Tell me when the next bracket starts' };
  };

  const reminderButton = (target: string, cta: string, compact = false) => {
    const isSet = Boolean(local.reminders[target]);
    return (
      <button
        type="button"
        className={compact ? 'bv2__link' : `bv2__primary ${isSet ? 'is-set' : ''}`}
        onClick={() => !isSet && requestReminder(target)}
        aria-pressed={isSet}
        disabled={compact && isSet}
      >
        {isSet ? <Check size={14} weight="bold" aria-hidden="true" /> : <Bell size={14} weight="bold" aria-hidden="true" />}
        {isSet ? 'Reminder set' : cta}
      </button>
    );
  };

  const renderPhoto = (generation: Generation) => (generation.image
    ? <img src={generation.image} alt="" loading="lazy" />
    : <span className="bv2__photo-empty" aria-hidden="true" />);

  const selectDemoMoment = (value: string) => {
    const nextValue = value || null;
    setSimulatedDate(nextValue);
    writeSession(simulatedDateKey, nextValue);
  };

  const resetDemo = () => {
    setLocal(emptyState);
    setPending(null);
    setMatchIndex(0);
    setView('voting');
    resetDeviceId();
  };

  return (
    <section className="bv2" id="bracket" aria-labelledby={`${uid}-title`}>
      <div className="bv2__topline">
        <span className="bv2__eyebrow">Bracket voting</span>
        <button type="button" className="bv2__ghost" onClick={() => setIsFullBracketOpen(true)} ref={fullBracketTriggerRef}>
          <TreeStructure size={16} aria-hidden="true" />
          View full bracket
        </button>
      </div>
      <h2 id={`${uid}-title`} className="bv2__title">{bracket.title}</h2>
      {view !== 'strip' && (
        <p className="bv2__intro">America’s best-selling truck for 49 consecutive years. Vote through 14 generations and choose your champion.</p>
      )}

      <div className="bv2__progress" aria-label="Bracket progress">
        {bracket.rounds.map((round) => {
          const status = roundPhase(round, now);
          return (
            <span
              key={round.id}
              className={`${status === 'open' ? 'is-current' : ''} ${status === 'closed' ? 'is-complete' : ''}`}
              aria-current={status === 'open' ? 'step' : undefined}
            >
              {round.label}
            </span>
          );
        })}
      </div>

      {previousResults && view !== 'strip' && (
        <p className="bv2__results" role="status">
          <CheckCircle size={18} weight="fill" aria-hidden="true" />
          <span>
            {previousResults.mine > 0
              ? `${previousResults.round.label} is final: ${previousResults.advanced} of your ${previousResults.mine} picks advanced.`
              : (() => {
                const [headline, ...rest] = previousResults.results;
                return `Last round: Generation ${headline.result.winner.generation} knocked out Generation ${headline.result.loser.generation} (${headline.winnerPercent}%)${rest.length ? `, plus ${rest.length} more results` : ''}.`;
              })()}
          </span>
          <button type="button" className="bv2__link" onClick={() => setIsFullBracketOpen(true)}>See results</button>
        </p>
      )}

      {openRound && view === 'voting' && current && outcome && (
        <div className="bv2__voting">
          <div className="bv2__match-meta">
            <span className="bv2__match-label">{openRound.label} · Matchup {index + 1} of {matchups.length}</span>
            <div className="bv2__dots" role="group" aria-label="Jump to a matchup">
              {matchups.map(({ config }, dotIndex) => {
                const done = Boolean(local.picks[config.id]);
                const isCurrent = dotIndex === index;
                return (
                  <button
                    type="button"
                    key={config.id}
                    className={`bv2__dot ${done ? 'is-done' : ''} ${isCurrent ? 'is-current' : ''}`}
                    onClick={() => jumpTo(dotIndex)}
                    aria-label={`Matchup ${dotIndex + 1}${done ? ', voted' : ''}`}
                    aria-current={isCurrent ? 'step' : undefined}
                  >
                    <span />
                  </button>
                );
              })}
            </div>
          </div>
          <div className="bv2__h2h">
            {[current.first, current.second].map((generation, optionIndex) => {
              const mine = selected === generation.id;
              const percent = optionIndex === 0 ? outcome.firstPercent : outcome.secondPercent;
              const votes = optionIndex === 0 ? outcome.firstVotes : outcome.secondVotes;
              const leading = revealed && outcome.winner.id === generation.id;
              return (
                <button
                  type="button"
                  key={generation.id}
                  className={`bv2__card ${mine ? 'is-mine' : ''} ${revealed && !mine ? 'is-other' : ''} ${leading ? 'is-leading' : ''}`}
                  onClick={() => vote(generation.id)}
                  disabled={revealed}
                  aria-pressed={mine}
                  aria-label={`Vote for Generation ${generation.generation}, ${generation.name}, ${generation.years}`}
                >
                  <span className="bv2__photo">
                    {renderPhoto(generation)}
                    <span className="bv2__photo-copy" aria-hidden="true">
                      <span>Ford</span>
                      <strong>Generation {generation.generation}</strong>
                    </span>
                    {!revealed && <span className="bv2__vote-cta">Vote Generation {generation.generation}</span>}
                    {mine && (
                      <span className="bv2__mine">
                        <Check size={12} weight="bold" aria-hidden="true" />
                        Your pick
                      </span>
                    )}
                  </span>
                  <span className="bv2__body">
                    <span className="bv2__years">{generation.years}</span>
                    {generation.fact && <span className="bv2__fact">{generation.fact}</span>}
                    <span className={`bv2__result ${revealed ? 'is-visible' : ''}`} aria-hidden={!revealed}>
                      <span className="bv2__track">
                        <span className="bv2__fill" style={{ width: revealed ? `${percent}%` : '0%' }} />
                      </span>
                      <span className="bv2__result-row">
                        <strong>{percent}%</strong>
                        <small>{formatVotes(votes)} votes</small>
                      </span>
                    </span>
                  </span>
                </button>
              );
            })}
            <span className="bv2__vs" aria-hidden="true"><span>VS</span></span>
          </div>

          <div className="bv2__status" aria-live="polite">
            <p className={revealed ? 'is-strong' : ''}>{status}</p>
            {revealed && (
              <div className="bv2__status-actions">
                {!locked && <button type="button" className="bv2__ghost" onClick={undo}>Undo</button>}
                <button type="button" className="bv2__primary bv2__primary--dark" onClick={next}>
                  {matchups.some(({ config }) => config.id !== current.config.id && !local.picks[config.id]) ? 'Next matchup' : 'See your picks'}
                  <ArrowRight size={14} weight="bold" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {openRound && view === 'recap' && (
        <div className="bv2__recap" role="status">
          <h3>{openRound.label}: your picks are in</h3>
          <p>{leadingCount} of {recapPicks.length} of your picks are leading. Voting closes {formatDay(openRound.closesAt)}.</p>
          <div className="bv2__recap-grid">
            {recapPicks.map((pick) => (
              <div className="bv2__recap-item" key={pick.id}>
                {renderPhoto(pick.generation)}
                <span>
                  <strong>Generation {pick.generation.generation}</strong>
                  <small className={pick.leading ? 'is-leading' : ''}>{pick.leading ? 'Leading' : 'Trailing'} · {pick.percent}%</small>
                </span>
              </div>
            ))}
          </div>
          <div className="bv2__ctas">
            <div className="bv2__ctas-copy">
              <strong>{nextStep(openRound).headline}</strong>
              <span>{signedIn ? 'We’ll email you and add it to your notifications.' : 'Sign in and we’ll email you when it’s time to vote again.'}</span>
            </div>
            {reminderButton(nextStep(openRound).target, nextStep(openRound).cta)}
          </div>
          <button type="button" className="bv2__link bv2__done" onClick={() => setView('strip')}>Done</button>
        </div>
      )}

      {openRound && view === 'strip' && roundDone && (
        <div className="bv2__strip" role="status">
          <CheckCircle size={20} weight="fill" aria-hidden="true" />
          <p>
            <strong>You’ve voted in the {openRound.label}</strong>
            <span>{nextStep(openRound).headline}</span>
          </p>
          <div className="bv2__strip-actions">
            <button type="button" className="bv2__link" onClick={() => setView('recap')}>See my picks</button>
            {reminderButton(nextStep(openRound).target, 'Remind me', true)}
          </div>
        </div>
      )}

      {phase.kind === 'upcoming' && (
        <div className="bv2__ctas">
          <div className="bv2__ctas-copy">
            <strong>The {phase.next.label} opens {formatDay(phase.next.opensAt)}</strong>
            <span>Fourteen generations of F-Series trucks, one champion.</span>
          </div>
          {reminderButton(`round-${phase.next.number}`, 'Remind me when voting opens')}
        </div>
      )}

      {phase.kind === 'between' && (
        <div className="bv2__ctas">
          <div className="bv2__ctas-copy">
            <strong>The {phase.next.label} open {formatDay(phase.next.opensAt)}</strong>
            <span>The {phase.previous.label.toLowerCase()} results are in the full bracket.</span>
          </div>
          {reminderButton(`round-${phase.next.number}`, `Remind me when the ${phase.next.label} open`)}
        </div>
      )}

      {champion && (
        <div className="bv2__champion" role="status">
          {champion.generation.image && (
            <img src={champion.generation.image} alt={champion.generation.imageAlt || `Ford F-Series generation ${champion.generation.generation}`} />
          )}
          <div className="bv2__champion-copy">
            <span className="bv2__champion-label">{champion.mine ? 'Champion · Your pick' : 'Champion'}</span>
            <h3>Generation {champion.generation.generation}</h3>
            <p className="bv2__champion-sub">{champion.generation.name} · {champion.generation.years}</p>
            {champion.generation.fact && <p className="bv2__fact">{champion.generation.fact}</p>}
            <strong>{champion.percent}% of {formatVotes(champion.total)} votes in the Final</strong>
            <div className="bv2__champion-next">
              <span>Next bracket coming soon.</span>
              {reminderButton('next-bracket', 'Tell me when it starts')}
            </div>
          </div>
        </div>
      )}

      <div className="bv2__footer">
        <a href={HISTORY_URL}>Read the full F-Series history on MotorTrend</a>
        <span className="bv2__rule">Ties go to the higher seed.</span>
        {demoEnabled && (
          <button
            type="button"
            className="bv2__ghost bv2__ghost--pill"
            onClick={() => setDemoOpen((open) => !open)}
            aria-expanded={demoOpen}
            aria-controls={demoPanelId}
          >
            Demo controls
            <CaretDown size={12} weight="bold" aria-hidden="true" className={demoOpen ? 'is-open' : ''} />
          </button>
        )}
      </div>
      {demoEnabled && demoOpen && (
        <div className="bv2__demo" id={demoPanelId}>
          <label>
            Simulate date
            <span className="bv2__select">
              <select value={simulatedDate ?? ''} onChange={(event) => selectDemoMoment(event.target.value)}>
                <option value="">Today (live schedule)</option>
                {demoMoments.map((moment) => <option value={moment.value} key={moment.value}>{moment.label}</option>)}
              </select>
              <CaretDown size={14} weight="bold" aria-hidden="true" />
            </span>
          </label>
          <button type="button" className="bv2__ghost" onClick={resetDemo}>Reset my votes</button>
          <p>Only visible in dev builds or with ?bracketDemo=1. A simulated date changes this browser only; votes in rounds that aren’t really open stay local.</p>
        </div>
      )}

      <AuthPromptModal
        isOpen={authOpen}
        onClose={() => {
          setAuthOpen(false);
          setPendingReminder(null);
          writeSession(pendingReminderKey, null);
        }}
        action="default"
        title="Never miss a round"
        supportingCopy="Sign in and we’ll let you know when the next round of the F-Series bracket opens."
        description={'An email when each round opens\nUpdates in your MotorTrend notifications\nFree MotorTrend account'}
        contextId={`bracket-reminder:${bracket.id}`}
      />

      <ModalShell
        isOpen={isFullBracketOpen}
        onClose={() => setIsFullBracketOpen(false)}
        maxWidth="1120px"
        maxHeight="min(88vh, 900px)"
        width="calc(100% - 32px)"
        className="bv2__modal"
        ariaLabelledBy={fullBracketTitleId}
      >
        <div className="bv2__modal-header">
          <div>
            <span className="bv2__eyebrow">Full bracket</span>
            <h2 id={fullBracketTitleId}>{bracket.question}</h2>
            <p>A new round opens every Monday. Community votes decide who advances; ties go to the higher seed.</p>
          </div>
          <button ref={fullBracketCloseRef} type="button" className="bv2__ghost bv2__icon-btn" onClick={() => setIsFullBracketOpen(false)} aria-label="Close full bracket">
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <div className="bv2__modal-scroll" tabIndex={0} aria-label="Full bracket, scroll horizontally to see each round">
          <div className="bv2__modal-rounds">
            {fullBracketRounds.map((round) => (
              <section className="bv2__modal-round" key={round.id} aria-label={round.label}>
                <h3>
                  {round.label}
                  <small>{round.roundStatus === 'closed' ? 'Final' : round.roundStatus === 'open' ? `Voting until ${formatShortDay(round.closesAt)}` : `Opens ${formatShortDay(round.opensAt)}`}</small>
                </h3>
                <div className="bv2__modal-matches">
                  {round.roundStatus === 'scheduled' ? (
                    <div className="bv2__modal-pending">Opens {formatDay(round.opensAt)}.</div>
                  ) : round.resolved.map(({ config, first, second, result }) => (
                    <article className="bv2__modal-match" key={config.id}>
                      {[first, second].map((generation) => {
                        const win = result.winner.id === generation.id;
                        const percent = generation.id === first.id ? result.firstPercent : result.secondPercent;
                        return (
                          <div className={`bv2__modal-entry ${win ? 'is-winner' : ''} ${round.roundStatus === 'closed' && !win ? 'is-out' : ''}`} key={generation.id}>
                            {renderPhoto(generation)}
                            <span>
                              <strong>Gen {generation.generation} · {generation.years}</strong>
                              <small>{generation.name} · {percent}%</small>
                            </span>
                            {local.picks[config.id] === generation.id && <span className="bv2__modal-pick">Pick</span>}
                          </div>
                        );
                      })}
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </ModalShell>
    </section>
  );
};

export default BracketVotingV2;
