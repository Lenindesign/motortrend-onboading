import React from 'react';
import Icon from '../Icon';
import './VoteControl.css';

interface VoteControlProps {
  upvotes: number;
  downvotes: number;
  userVote?: 'up' | 'down' | null;
  onVote: (direction: 'up' | 'down') => void;
  orientation?: 'vertical' | 'horizontal';
  size?: 'sm' | 'md';
}

export const VoteControl: React.FC<VoteControlProps> = ({
  upvotes,
  downvotes,
  userVote,
  onVote,
  orientation = 'vertical',
  size = 'md'
}) => {
  const score = upvotes - downvotes;

  return (
    <div className={`vote-control vote-control--${orientation} vote-control--${size}`}>
      <button 
        className={`vote-control__btn vote-control__btn--up ${userVote === 'up' ? 'vote-control__btn--active' : ''}`}
        onClick={(e) => { e.stopPropagation(); onVote('up'); }}
        aria-label="Upvote"
      >
        <Icon name="arrow_upward" size={size === 'sm' ? 16 : 24} />
      </button>
      
      <span className={`vote-control__score ${userVote ? `vote-control__score--${userVote}` : ''}`}>
        {score}
      </span>
      
      <button 
        className={`vote-control__btn vote-control__btn--down ${userVote === 'down' ? 'vote-control__btn--active' : ''}`}
        onClick={(e) => { e.stopPropagation(); onVote('down'); }}
        aria-label="Downvote"
      >
        <Icon name="arrow_downward" size={size === 'sm' ? 16 : 24} />
      </button>
    </div>
  );
};


