import React, { useMemo, useState } from 'react';
import './BracketVoting.css';

type Matchup = {
  id: string;
  first: { seed: number; name: string; percent: number };
  second: { seed: number; name: string; percent: number };
};

const matchups: Matchup[] = [
  {
    id: 'match-1',
    first: { seed: 1, name: 'Bronco', percent: 64 },
    second: { seed: 8, name: '4Runner', percent: 36 },
  },
  {
    id: 'match-2',
    first: { seed: 2, name: 'Wrangler', percent: 51 },
    second: { seed: 7, name: 'Land Cruiser', percent: 49 },
  },
];

export const BracketVoting: React.FC = () => {
  const storageKey = 'motortrend-bracket-voting-round-2';
  const [picks, setPicks] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const hasPicks = useMemo(() => Object.keys(picks).length > 0, [picks]);

  const choose = (matchupId: string, vehicle: string) => {
    const nextPicks = { ...picks, [matchupId]: vehicle };
    setPicks(nextPicks);
    localStorage.setItem(storageKey, JSON.stringify(nextPicks));
  };

  return (
    <section className="bracket-voting" aria-labelledby="bracket-voting-title">
      <div className="bracket-voting__eyebrow-row">
        <span className="bracket-voting__eyebrow">Bracket voting</span>
        <span className="bracket-voting__pill">Round 2 of 4</span>
        <span className="bracket-voting__pill">Sample data</span>
      </div>
      <h2 id="bracket-voting-title">MotorTrend Off-Road Showdown</h2>
      <p className="bracket-voting__intro">Quarterfinals. Staff seeded, voting closes Friday.</p>

      <div className="bracket-voting__progress" aria-label="Bracket progress">
        <span>Round of 8</span>
        <span className="is-current">Quarterfinals</span>
        <span>Semifinals</span>
        <span>Final</span>
      </div>

      <p className="bracket-voting__prompt">Your picks are in. Here is how readers split this round.</p>
      <div className="bracket-voting__matchups">
        {matchups.map((matchup) => (
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
                >
                  <span><b>{vehicle.seed}</b> {vehicle.name} {selected && <em>Your pick</em>}</span>
                  <strong>{vehicle.percent}%</strong>
                  <span className="bracket-voting__bar" style={{ width: `${vehicle.percent}%` }} />
                </button>
              );
            })}
            <span className="bracket-voting__votes">{matchup.id === 'match-1' ? '2,140' : '1,905'} votes</span>
          </div>
        ))}
      </div>

      <div className={`bracket-voting__reminder ${hasPicks ? 'is-active' : ''}`}>
        <span aria-hidden="true">✓</span>
        {hasPicks ? 'You will be reminded when Round 3 opens' : 'Choose a matchup to get a reminder when Round 3 opens'}
      </div>
    </section>
  );
};

export default BracketVoting;
