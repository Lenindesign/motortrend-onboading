import React, { useId, useMemo, useState } from 'react';
import './PollOfTheDay.css';

type PollOption = {
  id: 'bronco' | 'wrangler';
  make: string;
  model: string;
  image: string;
  imageAlt: string;
};

const pollOptions: PollOption[] = [
  {
    id: 'bronco',
    make: 'Ford',
    model: 'Bronco',
    image: 'https://www.motortrend.com/files/674e2b7efe24400008290ba0/003-2025-ford-bronco-free-wheeling.jpg',
    imageAlt: '2025 Ford Bronco',
  },
  {
    id: 'wrangler',
    make: 'Jeep',
    model: 'Wrangler',
    image: 'https://www.motortrend.com/files/67bcc6dd6cace60008cb8ca2/023-2025-jeep-wrangler-willys-4xe.jpg',
    imageAlt: '2025 Jeep Wrangler',
  },
];

const seedVotes: Record<PollOption['id'], number> = { bronco: 692, wrangler: 592 };

type PollOfTheDayProps = {
  variant?: 'sidebar' | 'horizontal';
};

type PollUpdate = {
  storageKey: string;
  votes: Record<string, number>;
  selectedOption: string;
};

export const PollOfTheDay: React.FC<PollOfTheDayProps> = ({ variant = 'sidebar' }) => {
  const instanceId = useId().replace(/:/g, '');
  const titleId = `${instanceId}-poll-title`;
  const statusId = `${instanceId}-poll-status`;
  const pollDate = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const storageKey = `motortrend-poll-${pollDate}`;
  const voteKey = `${storageKey}-vote`;
  const [votes, setVotes] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? { ...seedVotes, ...JSON.parse(saved) } : seedVotes;
    } catch {
      return seedVotes;
    }
  });
  const [selectedOption, setSelectedOption] = useState<string | null>(() => {
    try {
      const savedVote = localStorage.getItem(voteKey);
      return pollOptions.some(({ id }) => id === savedVote) ? savedVote : null;
    } catch {
      return null;
    }
  });

  React.useEffect(() => {
    const syncPoll = (event: Event) => {
      const update = (event as CustomEvent<PollUpdate>).detail;
      if (update?.storageKey !== storageKey) return;
      setVotes(update.votes);
      setSelectedOption(update.selectedOption);
    };

    window.addEventListener('motortrend-poll-update', syncPoll);
    return () => window.removeEventListener('motortrend-poll-update', syncPoll);
  }, [storageKey]);

  const totalVotes = Object.values(votes).reduce((total, count) => total + count, 0);
  const percentageFor = (optionId: string) => Math.round(((votes[optionId] || 0) / totalVotes) * 100);

  const handleVote = (optionId: PollOption['id']) => {
    if (selectedOption) return;

    const nextVotes = { ...votes, [optionId]: (votes[optionId] || 0) + 1 };
    setVotes(nextVotes);
    setSelectedOption(optionId);
    try {
      localStorage.setItem(storageKey, JSON.stringify(nextVotes));
      localStorage.setItem(voteKey, optionId);
    } catch {
      // The in-page results remain available when storage is disabled.
    }
    window.dispatchEvent(new CustomEvent<PollUpdate>('motortrend-poll-update', {
      detail: { storageKey, votes: nextVotes, selectedOption: optionId },
    }));
  };

  const leader = percentageFor('bronco') >= percentageFor('wrangler') ? 'Bronco' : 'Wrangler';
  const leaderId = leader.toLowerCase();

  return (
    <section
      className={`poll-matchup poll-matchup--${variant}`}
      data-state={selectedOption ? 'after' : 'before'}
      aria-labelledby={titleId}
    >
      <header className="poll-matchup__header">
        <div>
          <p className="poll-matchup__eyebrow">Today’s poll</p>
          <h2 id={titleId}>Bronco or Wrangler?</h2>
        </div>
        <p className="poll-matchup__dek">Pick your favorite off-roader.</p>
      </header>

      <fieldset className="poll-matchup__duel" aria-describedby={statusId}>
        <legend className="poll-matchup__sr-only">Choose your favorite off-roader</legend>
        {pollOptions.map((option, index) => {
          const percentage = percentageFor(option.id);
          const isSelected = selectedOption === option.id;

          return (
            <React.Fragment key={option.id}>
              {index === 1 && <span className="poll-matchup__versus" aria-hidden="true"><span>VS</span></span>}
              <label
                className={`poll-matchup__contender ${index === 1 ? 'poll-matchup__contender--right' : ''} ${isSelected ? 'is-selected' : ''}`}
                style={{ '--poll-result': `${percentage}%` } as React.CSSProperties}
              >
                <img className="poll-matchup__image" src={option.image} alt={option.imageAlt} loading="lazy" />
                <span className="poll-matchup__shade" aria-hidden="true" />
                <span className="poll-matchup__vehicle-name">
                  <span className="poll-matchup__make">{option.make}</span>
                  <span className="poll-matchup__model">{option.model}</span>
                </span>
                <span className="poll-matchup__result-fill" aria-hidden="true" />
                <input
                  type="radio"
                  name={`${instanceId}-motortrend-poll-vote`}
                  value={option.id}
                  checked={isSelected}
                  disabled={Boolean(selectedOption)}
                  onChange={() => handleVote(option.id)}
                  aria-label={`${option.make} ${option.model}${selectedOption ? `, ${percentage}% of votes${isSelected ? ', your choice' : ''}` : ', vote for this vehicle'}`}
                />
                <span className="poll-matchup__action" aria-hidden="true">
                  <span className="poll-matchup__action-cta cta cta--primary cta--default cta--full-width">
                    <span className="poll-matchup__vote-action">Vote {option.model}</span>
                    <span className="poll-matchup__result-action">{option.model}<b>{percentage}%</b></span>
                  </span>
                </span>
              </label>
            </React.Fragment>
          );
        })}
      </fieldset>

      <footer className="poll-matchup__footer">
        <p id={statusId} role="status" aria-live="polite">
          {selectedOption
            ? `You voted for the ${selectedOption === 'bronco' ? 'Bronco' : 'Wrangler'}. ${leader} leads ${percentageFor(leaderId)} to ${percentageFor(leaderId === 'bronco' ? 'wrangler' : 'bronco')} percent.`
            : 'Choose a side to reveal how the community voted.'}
        </p>
        <span className="poll-matchup__vote-count">{totalVotes.toLocaleString()} votes</span>
      </footer>
    </section>
  );
};
