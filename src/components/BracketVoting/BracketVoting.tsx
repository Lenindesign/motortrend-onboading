import React, { useEffect, useMemo, useState } from 'react';
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
  reminderLabel: 'Get a reminder when Round 3 opens',
  matchups: [
    { id: 'match-1', first: { seed: 1, name: 'Bronco', percent: 64 }, second: { seed: 8, name: '4Runner', percent: 36 }, votes: '2,140' },
    { id: 'match-2', first: { seed: 2, name: 'Wrangler', percent: 51 }, second: { seed: 7, name: 'Land Cruiser', percent: 49 }, votes: '1,905' },
  ],
};

const roundOfEightReference: Matchup[] = [
  { id: 'reference-1', first: { seed: 1, name: 'Bronco', percent: 64 }, second: { seed: 8, name: '4Runner', percent: 36 }, votes: '2,140' },
  { id: 'reference-2', first: { seed: 2, name: 'Wrangler', percent: 51 }, second: { seed: 7, name: 'Land Cruiser', percent: 49 }, votes: '1,905' },
  { id: 'reference-3', first: { seed: 3, name: 'Defender', percent: 58 }, second: { seed: 6, name: 'Tacoma', percent: 42 }, votes: '1,742' },
  { id: 'reference-4', first: { seed: 4, name: 'G-Class', percent: 55 }, second: { seed: 5, name: 'Ranger Raptor', percent: 45 }, votes: '1,688' },
];

const picksKey = `motortrend-bracket-picks-${bracket.id}`;
const votesKey = `motortrend-bracket-votes-${bracket.id}`;
const reminderKey = `motortrend-bracket-reminder-${bracket.id}`;

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
  const [picks, setPicks] = useState<Record<string, string>>(() => readStorage(picksKey, {}));
  const [pendingPick, setPendingPick] = useState<{ matchupId: string; vehicle: string } | null>(null);
  const [reminderOptIn, setReminderOptIn] = useState(() => readStorage(reminderKey, false));
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRoundOfEight, setShowRoundOfEight] = useState(false);

  const hasPicks = useMemo(() => Object.keys(picks).length > 0, [picks]);

  const recordVote = (matchupId: string, vehicle: string) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const nextPicks = { ...picks, [matchupId]: vehicle };
      const vote: StoredVote = {
        bracketId: bracket.id,
        round: bracket.currentRound,
        matchupId,
        selectedVehicle: vehicle,
        memberId: user?.id || 'demo_user',
        timestamp: new Date().toISOString(),
      };
      const existingVotes = readStorage<StoredVote[]>(votesKey, []);
      localStorage.setItem(picksKey, JSON.stringify(nextPicks));
      localStorage.setItem(votesKey, JSON.stringify([...existingVotes, vote]));
      setPicks(nextPicks);
      setPendingPick(null);
    } catch {
      setError('Your vote could not be saved. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const choose = (matchupId: string, vehicle: string) => {
    if (isSubmitting || picks[matchupId]) return;
    if (requireAuth('default')) {
      recordVote(matchupId, vehicle);
    } else {
      setPendingPick({ matchupId, vehicle });
    }
  };

  useEffect(() => {
    if (isAuthenticated && pendingPick) recordVote(pendingPick.matchupId, pendingPick.vehicle);
  }, [isAuthenticated, pendingPick]);

  const toggleReminder = () => {
    if (!requireAuth('default')) return;
    const nextValue = !reminderOptIn;
    setReminderOptIn(nextValue);
    localStorage.setItem(reminderKey, JSON.stringify(nextValue));
  };

  return (
    <section className="bracket-voting" aria-labelledby="bracket-voting-title">
      <div className="bracket-voting__eyebrow-row">
        <span className="bracket-voting__eyebrow">Bracket voting</span>
        <span className="bracket-voting__pill">Round {bracket.currentRound} of {bracket.roundCount}</span>
        <span className="bracket-voting__pill">Sample data</span>
      </div>
      <h2 id="bracket-voting-title">{bracket.title}</h2>
      <p className="bracket-voting__intro">{bracket.intro}</p>

      <div className="bracket-voting__progress" aria-label="Bracket progress">
        {['Round of 8', bracket.roundLabel, 'Semifinals', 'Final'].map((label, index) => (
          <span className={index === bracket.currentRound - 1 ? 'is-current' : ''} key={label}>{label}</span>
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
        {bracket.matchups.map((matchup) => (
          <div className="bracket-voting__matchup" key={matchup.id}>
            <span className="bracket-voting__match-label">Match {matchup.id.slice(-1)}</span>
            {[matchup.first, matchup.second].map((vehicle) => {
              const selected = picks[matchup.id] === vehicle.name;
              return (
                <button
                  type="button"
                  className={`bracket-voting__option ${selected ? 'is-selected' : ''}`}
                  key={vehicle.name}
                  onClick={() => choose(matchup.id, vehicle.name)}
                  aria-pressed={selected}
                  disabled={Boolean(picks[matchup.id]) || isSubmitting}
                >
                  <span><b>{vehicle.seed}</b> {vehicle.name} {selected && <em>Your pick</em>}</span>
                  <strong>{vehicle.percent}%</strong>
                  <span className="bracket-voting__bar" style={{ width: `${vehicle.percent}%` }} />
                </button>
              );
            })}
            <span className="bracket-voting__votes">{matchup.votes} votes</span>
          </div>
        ))}
      </div>

      {error && <p className="bracket-voting__error" role="alert">{error}</p>}

      <button
        type="button"
        className={`bracket-voting__reminder ${reminderOptIn ? 'is-active' : ''}`}
        onClick={toggleReminder}
        aria-pressed={reminderOptIn}
      >
        <span aria-hidden="true">{reminderOptIn ? '✓' : '+'}</span>
        {reminderOptIn ? 'You will be reminded when Round 3 opens' : bracket.reminderLabel}
      </button>

      {!isAuthenticated && <p className="bracket-voting__auth-note">Sign in or create an account to vote and save your progress.</p>}

      <AuthPromptModal
        isOpen={isAuthPromptOpen}
        onClose={closeAuthPrompt}
        action={promptAction}
        title="Join to vote"
        description="Create an account or sign in to record your vote and continue through the bracket."
        contextId={`bracket-${bracket.id}`}
      />
    </section>
  );
};

export default BracketVoting;
