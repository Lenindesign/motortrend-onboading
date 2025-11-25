/**
 * Comparison Card Component
 * Uses atomic design principles matching Card component structure
 */

import React from 'react';
import './ComparisonCard.css';
import Icon from '../Icon';
import { CardShell } from '../atoms/CardShell/CardShell';

export interface ComparisonCardProps {
  vehicle1: {
    image: string;
    name: string;
  };
  vehicle2: {
    image: string;
    name: string;
  };
  onBookmark?: () => void;
  isBookmarked?: boolean;
  onViewComparison?: () => void;
}

export const ComparisonCard: React.FC<ComparisonCardProps> = ({ 
  vehicle1, 
  vehicle2,
  onBookmark,
  isBookmarked = false,
  onViewComparison
}) => {
  // Create combined title
  const comparisonTitle = `${vehicle1.name} / ${vehicle2.name}`;
  
  return (
    <CardShell
      padding="sm"
      hasHover={true}
      hasShadow={true}
      borderRadius="md"
      background="neutral-lighter"
      className="comparison-card"
    >
      <div className="card__inner">
        <div className="card__top-row">
          <div
            className={`card__image-container ${onViewComparison ? 'card__image-container--clickable' : ''}`}
            onClick={onViewComparison ? (e) => {
              e.stopPropagation();
              onViewComparison();
            } : undefined}
          >
            <img src={vehicle1.image} alt={comparisonTitle} className="card__image" />
          {onBookmark && (
            <button 
                className={`card__bookmark-btn ${isBookmarked ? 'card__bookmark-btn--active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onBookmark();
                }}
              aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
            >
              <Icon name={isBookmarked ? 'bookmark' : 'bookmark_border'} variant={isBookmarked ? 'filled' : 'outlined'} size={20} />
            </button>
          )}
        </div>
        
          <div className="card__content">
            <div className="card__info">
              <h4 className="card__title">{comparisonTitle}</h4>
              <p className="card__type">Comparison</p>
            </div>
          </div>
        </div>

        <div className="card__bottom-row">
          <div></div>
          {onViewComparison && (
            <button className="card__button" onClick={(e) => {
              e.stopPropagation();
              onViewComparison();
            }}>
              View Comparison
              <Icon name="chevron_right" size={18} />
            </button>
          )}
        </div>
      </div>
    </CardShell>
  );
};

