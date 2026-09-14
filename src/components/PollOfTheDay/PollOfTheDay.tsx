import React, { useMemo, useState } from 'react';
import './PollOfTheDay.css';

type PollOption = {
  id: string;
  label: string;
};

const pollOptions: PollOption[] = [
  { id: 'bronco', label: 'Ford Bronco' },
  { id: 'wrangler', label: 'Jeep Wrangler' },
];

const seedVotes = { bronco: 54, wrangler: 46 };

export const PollOfTheDay: React.FC = () => {
  const pollDate = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const storageKey = `motortrend-poll-${pollDate}`;
  const voteKey = `${storageKey}-vote`;
  const [votes, setVotes] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : seedVotes;
    } catch {
      return seedVotes;
    }
  });
  const [selectedOption, setSelectedOption] = useState<string | null>(() => {
    try {
      return localStorage.getItem(voteKey);
    } catch {
      return null;
    }
  });

  const totalVotes = Object.values(votes).reduce((total, count) => total + count, 0);

  const handleVote = (optionId: string) => {
    if (selectedOption) return;

    const nextVotes = { ...votes, [optionId]: (votes[optionId] || 0) + 1 };
    setVotes(nextVotes);
    setSelectedOption(optionId);
    localStorage.setItem(storageKey, JSON.stringify(nextVotes));
    localStorage.setItem(voteKey, optionId);
  };

  return (
    <section className="poll-of-the-day" aria-labelledby="poll-of-the-day-title">
      <div className="poll-of-the-day__intro">
        <span className="poll-of-the-day__eyebrow">MotorTrend · Today’s poll</span>
        <h2 id="poll-of-the-day-title">Bronco or Wrangler?</h2>
        <p>Pick your off-roader. Come back tomorrow for a new matchup.</p>
      </div>

      <div className="poll-of-the-day__choices" role="group" aria-label="Poll choices">
        {pollOptions.map((option) => {
          const percentage = Math.round((votes[option.id] / totalVotes) * 100);
          const isSelected = selectedOption === option.id;

          return (
            <button
              key={option.id}
              type="button"
              className={`poll-of-the-day__choice ${isSelected ? 'is-selected' : ''}`}
              onClick={() => handleVote(option.id)}
              aria-pressed={isSelected}
              disabled={Boolean(selectedOption)}
            >
              <span className="poll-of-the-day__choice-fill" style={{ width: `${percentage}%` }} />
              <span className="poll-of-the-day__choice-content">
                <span>{option.label}</span>
                <strong>{selectedOption ? `${percentage}%` : 'Vote'}</strong>
              </span>
            </button>
          );
        })}
      </div>

      <p className="poll-of-the-day__meta" aria-live="polite">
        {selectedOption ? `You voted · ${totalVotes.toLocaleString()} votes today` : 'Tap a choice to see the results'}
      </p>
    </section>
  );
};

