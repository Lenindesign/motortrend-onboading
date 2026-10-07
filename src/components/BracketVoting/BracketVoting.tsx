import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AuthPromptModal } from '../AuthPromptModal';
import { useAuth } from '../../contexts/AuthContext';
import { useAuthPrompt } from '../../hooks/useAuthPrompt';
import './BracketVoting.css';

type VehicleOption = { seed: number; name: string; percent: number };
type Matchup = { id: string; first: VehicleOption; second: VehicleOption; votes: string };
type BracketConfig = {
  id: string;
  title: string;
  currentRound: number;
  roundCount: number;
  roundLabel: string;
  intro: string;
  reminderLabel: string;
  matchups: Matchup[];
};
type StoredVote = {
  bracketId: string;
  round: number;
  matchupId: string;
  selectedVehicle: string;
  memberId: string;
  timestamp: string;
};

const bracket: BracketConfig = {
  id: 'motortrend-off-road-showdown',
  title: 'MotorTrend Off-Road Showdown',
  currentRound: 2,
  roundCount: 4,
  roundLabel: 'Quarterfinals',
  intro: 'Quarterfinals. Staff seeded, voting closes Friday.',
  reminderLabel: 'Get a reminder when the next round opens',
  matchups: [
    { id: 'match-1', first: { seed: 1, name: 'Bronco', percent: 64 }, second: { seed: 8, name: '4Runner', percent: 36 }, votes: '2,140' },
    { id: 'match-2', first: { seed: 2, name: 'Wrangler', percent: 51 }, second: { seed: 7, name: 'Land Cruiser', percent: 49 }, votes: '1,905' },
  ],
};

const roundLabels = ['Round of 8', 'Quarterfinals', 'Semifinals', 'Final'];
const roundKey = `motortrend-bracket-round-${bracket.id}`;
const demoOpponents = [
  { seed: 3, name: 'Defender', percent: 45 },
  { seed: 4, name: 'Ranger Raptor', percent: 45 },
];

function getRoundMatchups(round: number, picks: Record<string, string>): Matchup[] {
  if (round === bracket.currentRound) return bracket.matchups;
  const roundTwoWinners = bracket.matchups.map((matchup) => ({
    seed: picks[`2:${matchup.id}`] === matchup.first.name ? matchup.first.seed : matchup.second.seed,
    name: picks[`2:${matchup.id}`] || matchup.first.name,
    percent: 55,
  }));
  if (round === 3) {
    return roundTwoWinners.map((winner, index) => ({
      id: `round-3-match-${index + 1}`,
      first: winner,
      second: demoOpponents[index],
      votes: 'Demo matchup',
    }));
  }
  const semifinalWinners = [1, 2].map((index) => {
    const id = `round-3-match-${index}`;
    const first = roundTwoWinners[index - 1];
    const second = demoOpponents[index - 1];
    const winner = picks[`3:${id}`];
    return { ...(winner === second.name ? second : first), percent: 55 };
  });
  return [{ id: 'round-4-final', first: semifinalWinners[0], second: semifinalWinners[1], votes: 'Demo matchup' }];
}

const roundOfEightReference: Matchup[] = [
  { id: 'reference-1', first: { seed: 1, name: 'Bronco', percent: 64 }, second: { seed: 8, name: '4Runner', percent: 36 }, votes: '2,140' },
  { id: 'reference-2', first: { seed: 2, name: 'Wrangler', percent: 51 }, second: { seed: 7, name: 'Land Cruiser', percent: 49 }, votes: '1,905' },
  { id: 'reference-3', first: { seed: 3, name: 'Defender', percent: 58 }, second: { seed: 6, name: 'Tacoma', percent: 42 }, votes: '1,742' },
  { id: 'reference-4', first: { seed: 4, name: 'G-Class', percent: 55 }, second: { seed: 5, name: 'Ranger Raptor', percent: 45 }, votes: '1,688' },
];

const picksKey = `motortrend-bracket-picks-${bracket.id}`;
const votesKey = `motortrend-bracket-votes-${bracket.id}`;
const reminderKey = `motortrend-bracket-reminder-${bracket.id}`;
const reminderChannelKey = `motortrend-bracket-reminder-channels-${bracket.id}`;
const pendingVoteKey = `motortrend-bracket-pending-vote-${bracket.id}`;

function readStorage<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) as T : fallback;
  } catch {
    return fallback;
  }
}

export const BracketVoting: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { isAuthPromptOpen, promptAction, requireAuth, closeAuthPrompt } = useAuthPrompt();
  const authRedirectInProgress = useRef(false);
  const [currentRound, setCurrentRound] = useState(() => readStorage(roundKey, bracket.currentRound));
  const [picks, setPicks] = useState<Record<string, string>>(() => readStorage(picksKey, {}));
  const [pendingPick, setPendingPick] = useState<{ matchupId: string; vehicle: string } | null>(() => {
    try { return JSON.parse(sessionStorage.getItem(pendingVoteKey) || 'null') as { matchupId: string; vehicle: string } | null; }
    catch { return null; }
  });
  const [reminderOptIn, setReminderOptIn] = useState(() => readStorage(reminderKey, false));
  const [reminderChannels, setReminderChannels] = useState<string[]>(() => readStorage(reminderChannelKey, []));
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRoundOfEight, setShowRoundOfEight] = useState(false);
  const [showCompletedExample, setShowCompletedExample] = useState(false);
  const currentMatchups = useMemo(() => getRoundMatchups(currentRound, picks), [currentRound, picks]);
  const hasPicks = currentMatchups.some((matchup) => Boolean(picks[`${currentRound}:${matchup.id}`]));
  const roundComplete = currentMatchups.every((matchup) => Boolean(picks[`${currentRound}:${matchup.id}`]));

  const recordVote = useCallback((matchupId: string, vehicle: string) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const pickId = `${currentRound}:${matchupId}`;
      const nextPicks = { ...picks, [pickId]: vehicle };
      const vote: StoredVote = {
        bracketId: bracket.id,
        round: currentRound,
        matchupId,
        selectedVehicle: vehicle,
        memberId: user?.id || 'demo_user',
        timestamp: new Date().toISOString(),
      };
      const existingVotes = readStorage<StoredVote[]>(votesKey, []);
      const previousPicks = localStorage.getItem(picksKey);
      const previousVoteLog = localStorage.getItem(votesKey);
      localStorage.setItem(picksKey, JSON.stringify(nextPicks));
      try {
        localStorage.setItem(votesKey, JSON.stringify([...existingVotes, vote]));
      } catch (error) {
        try {
          if (previousPicks === null) localStorage.removeItem(picksKey);
          else localStorage.setItem(picksKey, previousPicks);
          if (previousVoteLog === null) localStorage.removeItem(votesKey);
          else localStorage.setItem(votesKey, previousVoteLog);
        } catch { /* keep the vote unselected in this session */ }
        throw error;
      }
      try { sessionStorage.removeItem(pendingVoteKey); } catch { /* no-op in the local demo */ }
      setPicks(nextPicks);
      setPendingPick(null);
    } catch {
      try { sessionStorage.removeItem(pendingVoteKey); } catch { /* local demo only */ }
      setError('Your vote could not be saved. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [currentRound, picks, user]);

  const choose = (matchupId: string, vehicle: string) => {
    if (isSubmitting || picks[`${currentRound}:${matchupId}`]) return;
    if (requireAuth('default')) {
      recordVote(matchupId, vehicle);
    } else {
      setPendingPick({ matchupId, vehicle });
      try { sessionStorage.setItem(pendingVoteKey, JSON.stringify({ matchupId, vehicle })); } catch { /* pending state remains in memory */ }
    }
  };

  const advanceDemoRound = () => {
    if (!roundComplete || currentRound >= bracket.roundCount) return;
    const nextRound = currentRound + 1;
    setCurrentRound(nextRound);
    localStorage.setItem(roundKey, JSON.stringify(nextRound));
  };

  useEffect(() => {
    if (isAuthenticated && pendingPick) {
      const pick = pendingPick;
      setPendingPick(null);
      recordVote(pick.matchupId, pick.vehicle);
    }
  }, [isAuthenticated, pendingPick, recordVote]);

  const toggleReminder = () => {
    if (!requireAuth('default')) return;
    const nextValue = !reminderOptIn;
    setReminderOptIn(nextValue);
    localStorage.setItem(reminderKey, JSON.stringify(nextValue));
  };

  const toggleReminderChannel = (channel: 'email' | 'onsite') => {
    if (!requireAuth('default')) return;
    const next = reminderChannels.includes(channel)
      ? reminderChannels.filter((item) => item !== channel)
      : [...reminderChannels, channel];
    setReminderChannels(next);
    localStorage.setItem(reminderChannelKey, JSON.stringify(next));
  };

  const cancelAuthPrompt = () => {
    closeAuthPrompt();
    if (!isAuthenticated && pendingPick && !authRedirectInProgress.current) {
      setPendingPick(null);
      try { sessionStorage.removeItem(pendingVoteKey); } catch { /* local demo only */ }
    }
  };

  return (
    <section className="bracket-voting" aria-labelledby="bracket-voting-title">
      <div className="bracket-voting__eyebrow-row">
        <span className="bracket-voting__eyebrow">Bracket voting</span>
        <span className="bracket-voting__pill">Round {currentRound} of {bracket.roundCount}</span>
        <span className="bracket-voting__pill">Sample data</span>
      </div>
      <h2 id="bracket-voting-title">{bracket.title}</h2>
      <p className="bracket-voting__intro">{currentRound === bracket.currentRound ? bracket.intro : `${roundLabels[currentRound - 1]} · illustrative demo round`}</p>

      <button
        type="button"
        className="bracket-voting__reference-toggle"
        onClick={() => setShowCompletedExample((isOpen) => !isOpen)}
        aria-expanded={showCompletedExample}
        aria-controls="bracket-completed-example"
      >
        {showCompletedExample ? 'Hide completed bracket example' : 'View completed bracket example'}
        <span aria-hidden="true">{showCompletedExample ? '−' : '+'}</span>
      </button>
      {showCompletedExample && <div className="bracket-voting__round-complete" id="bracket-completed-example">
        <strong>Final winner · illustrative sample</strong>
        <span>Bronco — example outcome for the completed bracket flow.</span>
      </div>}

      <div className="bracket-voting__progress" aria-label="Bracket progress">
        {roundLabels.map((label, index) => (
          <span className={index === currentRound - 1 ? 'is-current' : ''} key={label}>{label}</span>
        ))}
      </div>

      <button
        type="button"
        className="bracket-voting__reference-toggle"
        onClick={() => setShowRoundOfEight((isOpen) => !isOpen)}
        aria-expanded={showRoundOfEight}
        aria-controls="bracket-round-of-eight"
      >
        {showRoundOfEight ? 'Hide Round of 8' : 'View Round of 8 for reference'}
        <span aria-hidden="true">{showRoundOfEight ? '−' : '+'}</span>
      </button>
      {reminderOptIn && <fieldset className="bracket-voting__reminder-channels">
        <legend>Reminder channels · simulated</legend>
        <label><input type="checkbox" checked={reminderChannels.includes('email')} onChange={() => toggleReminderChannel('email')} /> Email</label>
        <label><input type="checkbox" checked={reminderChannels.includes('onsite')} onChange={() => toggleReminderChannel('onsite')} /> On-site</label>
      </fieldset>}

      {showRoundOfEight && (
        <div className="bracket-voting__reference" id="bracket-round-of-eight">
          <div className="bracket-voting__reference-heading">
            <strong>Round of 8</strong>
            <span>Completed matchups</span>
          </div>
          <div className="bracket-voting__reference-grid">
            {roundOfEightReference.map((matchup) => (
              <div className="bracket-voting__reference-matchup" key={matchup.id}>
                <span>{matchup.first.seed} {matchup.first.name} <b>{matchup.first.percent}%</b></span>
                <span>{matchup.second.seed} {matchup.second.name} <b>{matchup.second.percent}%</b></span>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="bracket-voting__prompt" aria-live="polite">
        {hasPicks ? 'Your picks are in. Here is how readers split this round.' : 'Choose one vehicle in each matchup to cast your votes.'}
      </p>

      <div className="bracket-voting__matchups">
        {currentMatchups.map((matchup) => (
          <div className="bracket-voting__matchup" key={matchup.id}>
            <span className="bracket-voting__match-label">Match {matchup.id.slice(-1)}</span>
            {[matchup.first, matchup.second].map((vehicle) => {
              const selected = picks[`${currentRound}:${matchup.id}`] === vehicle.name;
              return (
                <button
                  type="button"
                  className={`bracket-voting__option ${selected ? 'is-selected' : ''}`}
                  key={vehicle.name}
                  onClick={() => choose(matchup.id, vehicle.name)}
                  aria-pressed={selected}
                  disabled={Boolean(picks[`${currentRound}:${matchup.id}`]) || isSubmitting}
                >
                  <span><b>{vehicle.seed}</b> {vehicle.name} {selected && <em>Your pick</em>}</span>
                  <strong>{picks[`${currentRound}:${matchup.id}`] ? `${vehicle.percent}%` : 'Vote to reveal'}</strong>
                  {picks[`${currentRound}:${matchup.id}`] && <span className="bracket-voting__bar" style={{ width: `${vehicle.percent}%` }} />}
                </button>
              );
            })}
            <span className="bracket-voting__votes">{matchup.votes} votes</span>
          </div>
        ))}
      </div>

      {roundComplete && currentRound < bracket.roundCount && (
        <div className="bracket-voting__round-complete" role="status">
          <strong>{roundLabels[currentRound - 1]} picks complete</strong>
          <span>Advance manually to preview the next sample round. Matchups and timing here are illustrative demo defaults.</span>
          <button type="button" className="bracket-voting__advance" onClick={advanceDemoRound}>Advance demo to {roundLabels[currentRound]}</button>
        </div>
      )}
      {roundComplete && currentRound === bracket.roundCount && (
        <div className="bracket-voting__round-complete" role="status">
          <strong>Final winner · illustrative demo</strong>
          <span>{picks[`4:${currentMatchups[0].id}`]} wins this sample bracket. This does not represent a finalized tie-break or live result.</span>
        </div>
      )}

      {error && <p className="bracket-voting__error" role="alert">{error}</p>}

      <button
        type="button"
        className={`bracket-voting__reminder ${reminderOptIn ? 'is-active' : ''}`}
        onClick={toggleReminder}
        aria-pressed={reminderOptIn}
      >
        <span aria-hidden="true">{reminderOptIn ? '✓' : '+'}</span>
        {reminderOptIn ? 'You are opted in to a next-round reminder' : bracket.reminderLabel}
      </button>

      {!isAuthenticated && <p className="bracket-voting__auth-note">Sign in or create an account to vote and save your progress.</p>}

      <AuthPromptModal
        isOpen={isAuthPromptOpen}
        onClose={cancelAuthPrompt}
        onAuthRedirect={() => { authRedirectInProgress.current = true; }}
        action={promptAction}
        title="Join to vote"
        description="Create an account or sign in to record your vote and continue through the bracket."
        contextId={`bracket-${bracket.id}`}
      />
    </section>
  );
};

export default BracketVoting;
