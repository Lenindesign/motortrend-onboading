import React, { useCallback, useId, useMemo, useRef, useState } from 'react';
import { AuthPromptModal } from '../AuthPromptModal';
import { useAuth } from '../../contexts/AuthContext';
import { useAuthPrompt } from '../../hooks/useAuthPrompt';
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
  previewBeforeVote?: boolean;
  showPhotos?: boolean;
};

type PollUpdate = {
  storageKey: string;
  votes: Record<string, number>;
  selectedOption: string;
};

export const PollOfTheDay: React.FC<PollOfTheDayProps> = ({
  variant = 'sidebar',
  previewBeforeVote = false,
  showPhotos = true,
}) => {
  const instanceId = useId().replace(/:/g, '');
  const { isAuthenticated } = useAuth();
  const { isAuthPromptOpen, promptAction, requireAuth, closeAuthPrompt } = useAuthPrompt();
  const authRedirectInProgress = useRef(false);
  const titleId = `${instanceId}-poll-title`;
  const statusId = `${instanceId}-poll-status`;
  const pollDate = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const storageKey = `motortrend-poll-${pollDate}`;
  const voteKey = `${storageKey}-vote`;
  const pendingKey = `${storageKey}-pending`;
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
  const [pendingOption, setPendingOption] = useState<PollOption['id'] | null>(() => {
    try {
      const saved = sessionStorage.getItem(pendingKey);
      return pollOptions.some(({ id }) => id === saved) ? saved as PollOption['id'] : null;
    } catch { return null; }
  });
  const [voteError, setVoteError] = useState('');

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
  const visibleSelectedOption = previewBeforeVote ? null : selectedOption;

  const handleVote = useCallback((optionId: PollOption['id']) => {
    if (selectedOption || previewBeforeVote) return;
    setVoteError('');
    if (!requireAuth('default')) {
      setPendingOption(optionId);
      try { sessionStorage.setItem(pendingKey, optionId); } catch { /* keep intent in memory */ }
      return;
    }

    const nextVotes = { ...votes, [optionId]: (votes[optionId] || 0) + 1 };
    let previousVotes: string | null = null;
    let previousVote: string | null = null;
    let snapshotAvailable = false;
    try {
      previousVotes = localStorage.getItem(storageKey);
      previousVote = localStorage.getItem(voteKey);
      snapshotAvailable = true;
      localStorage.setItem(storageKey, JSON.stringify(nextVotes));
      localStorage.setItem(voteKey, optionId);
    } catch {
      if (snapshotAvailable) {
        try {
          if (previousVotes === null) localStorage.removeItem(storageKey);
          else localStorage.setItem(storageKey, previousVotes);
          if (previousVote === null) localStorage.removeItem(voteKey);
          else localStorage.setItem(voteKey, previousVote);
        } catch { /* keep the failed vote hidden in this session */ }
      }
      try { sessionStorage.removeItem(pendingKey); } catch { /* local demo only */ }
      setVoteError('We couldn’t save your vote. Please try again.');
      return;
    }
    setVotes(nextVotes);
    setSelectedOption(optionId);
    try { sessionStorage.removeItem(pendingKey); } catch { /* ignore storage cleanup failure */ }
    setPendingOption(null);
    window.dispatchEvent(new CustomEvent<PollUpdate>('motortrend-poll-update', {
      detail: { storageKey, votes: nextVotes, selectedOption: optionId },
    }));
  }, [selectedOption, previewBeforeVote, requireAuth, votes, storageKey, voteKey, pendingKey]);

  const cancelAuthPrompt = () => {
    closeAuthPrompt();
    if (!isAuthenticated && !authRedirectInProgress.current) {
      setPendingOption(null);
      try { sessionStorage.removeItem(pendingKey); } catch { /* local demo only */ }
    }
  };

  React.useEffect(() => {
    if (isAuthenticated && pendingOption) {
      const optionToVote = pendingOption;
      setPendingOption(null);
      handleVote(optionToVote);
    }
  }, [isAuthenticated, pendingOption, handleVote]);

  const leader = percentageFor('bronco') >= percentageFor('wrangler') ? 'Bronco' : 'Wrangler';
  const leaderId = leader.toLowerCase();

  return (
    <section
      className={`poll-matchup poll-matchup--${variant}`}
      data-state={visibleSelectedOption ? 'after' : 'before'}
      data-preview-only={previewBeforeVote || undefined}
      data-photos={showPhotos ? 'shown' : 'hidden'}
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
          const isSelected = visibleSelectedOption === option.id;

          return (
            <React.Fragment key={option.id}>
              {index === 1 && <span className="poll-matchup__versus" aria-hidden="true"><span>VS</span></span>}
              <label
                className={`poll-matchup__contender ${index === 1 ? 'poll-matchup__contender--right' : ''} ${!showPhotos ? 'poll-matchup__contender--text-only' : ''} ${isSelected ? 'is-selected' : ''}`}
                style={{ '--poll-result': `${percentage}%` } as React.CSSProperties}
              >
                {showPhotos && <img className="poll-matchup__image" src={option.image} alt={option.imageAlt} loading="lazy" />}
                {showPhotos && <span className="poll-matchup__shade" aria-hidden="true" />}
                <span className="poll-matchup__vehicle-name">
                  <span className="poll-matchup__make">{option.make}</span>
                  <span className="poll-matchup__model">{option.model}</span>
                </span>
                <span className="poll-matchup__result-fill" aria-hidden="true" />
                <input
                  type="radio"
                  name={`${instanceId}-motortrend-poll-vote`}
                  value={option.id}
                  checked={visibleSelectedOption === option.id}
                  disabled={Boolean(visibleSelectedOption) || previewBeforeVote}
                  onChange={() => handleVote(option.id)}
                  aria-label={`${option.make} ${option.model}${visibleSelectedOption ? `, ${percentage}% of votes${isSelected ? ', your choice' : ''}` : ', vote for this vehicle'}`}
                />
                <span className="poll-matchup__action" aria-hidden="true">
                  <span className="poll-matchup__action-cta cta cta--secondary cta--default cta--full-width">
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
          {visibleSelectedOption
            ? `You voted for the ${visibleSelectedOption === 'bronco' ? 'Bronco' : 'Wrangler'}. ${leader} leads ${percentageFor(leaderId)} to ${percentageFor(leaderId === 'bronco' ? 'wrangler' : 'bronco')} percent.`
            : 'Choose a side to reveal how the community voted.'}
        </p>
        <span className="poll-matchup__vote-count">
          {visibleSelectedOption && totalVotes >= 10 ? `${totalVotes.toLocaleString()} votes` : ''}
        </span>
      </footer>
      {voteError && <p className="poll-matchup__error" role="alert">{voteError}</p>}
      {!visibleSelectedOption && !previewBeforeVote && <p className="poll-matchup__auth-note">Sign in or create an account to vote. Results stay hidden until your vote is recorded.</p>}
      <AuthPromptModal isOpen={isAuthPromptOpen} onClose={cancelAuthPrompt} onAuthRedirect={() => { authRedirectInProgress.current = true; }} action={promptAction} title="Join to vote" description="Sign in or create an account. We’ll keep your choice and submit your vote when you’re done." contextId={`poll-${pollDate}`} />
    </section>
  );
};
