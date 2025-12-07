/**
 * Vote Control Component
 * Migrated to inline styles for Tailwind compatibility
 */

import React, { useState } from 'react';
import Icon from '../Icon';

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
  const [hoveredBtn, setHoveredBtn] = useState<'up' | 'down' | null>(null);
  const score = upvotes - downvotes;
  const isVertical = orientation === 'vertical';
  const isSm = size === 'sm';

  // Styles
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: isVertical ? 'transparent' : 'var(--color-neutrals-7, #F4F5F6)',
    borderRadius: isVertical ? '8px' : '100px',
    flexDirection: isVertical ? 'column' : 'row',
    padding: isVertical ? '4px' : '2px 8px',
    gap: isVertical ? 0 : '4px',
  };

  const getBtnStyle = (direction: 'up' | 'down'): React.CSSProperties => {
    const isActive = userVote === direction;
    const isHovered = hoveredBtn === direction;
    const isUp = direction === 'up';
    const activeColor = isUp ? '#34A853' : 'var(--color-primary-1, #E90C17)';
    
    return {
      background: isHovered ? 'rgba(0, 0, 0, 0.05)' : 'none',
      border: 'none',
      cursor: 'pointer',
      color: (isActive || isHovered) ? activeColor : 'var(--color-neutrals-4, #6E7481)',
      padding: '4px',
      borderRadius: 'var(--border-radius-sm, 4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s ease',
    };
  };

  const scoreStyle: React.CSSProperties = {
    fontWeight: 600,
    color: userVote === 'up' ? '#34A853' : userVote === 'down' ? 'var(--color-primary-1, #E90C17)' : 'var(--color-black, #000000)',
    minWidth: '2ch',
    textAlign: 'center',
    fontSize: isSm ? '12px' : '14px',
    margin: isVertical ? (isSm ? 0 : '4px 0') : (isSm ? '0 4px' : '0 4px'),
  };

  return (
    <div style={containerStyle}>
      <button
        style={getBtnStyle('up')}
        onClick={(e) => { e.stopPropagation(); onVote('up'); }}
        onMouseEnter={() => setHoveredBtn('up')}
        onMouseLeave={() => setHoveredBtn(null)}
        aria-label="Upvote"
      >
        <Icon name="arrow_upward" size={isSm ? 16 : 24} />
      </button>
      
      <span style={scoreStyle}>{score}</span>
      
      <button
        style={getBtnStyle('down')}
        onClick={(e) => { e.stopPropagation(); onVote('down'); }}
        onMouseEnter={() => setHoveredBtn('down')}
        onMouseLeave={() => setHoveredBtn(null)}
        aria-label="Downvote"
      >
        <Icon name="arrow_downward" size={isSm ? 16 : 24} />
      </button>
    </div>
  );
};

export default VoteControl;
