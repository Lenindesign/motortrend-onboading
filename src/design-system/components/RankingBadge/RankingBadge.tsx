/**
 * Ranking Badge Component
 * Displays a ranking number with consistent styling across the application
 * Used in Top Ten Carousel and Top 10 articles
 */

import React from 'react';
import './RankingBadge.css';

export interface RankingBadgeProps {
  /** The ranking number to display (1-10) */
  rank: number;
  /** Optional CSS class name */
  className?: string;
  /** Size variant */
  size?: 'small' | 'medium' | 'large';
  /** Position variant for different contexts */
  position?: 'inline' | 'overlay';
}

export const RankingBadge: React.FC<RankingBadgeProps> = ({ 
  rank, 
  className = '',
  size = 'medium',
  position = 'inline'
}) => {
  return (
    <div className={`ranking-badge ranking-badge--${size} ranking-badge--${position} ${className}`}>
      <span className="ranking-badge__content">
        <span className="ranking-badge__hash">#</span>
        <span className="ranking-badge__number">{rank}</span>
      </span>
    </div>
  );
};

