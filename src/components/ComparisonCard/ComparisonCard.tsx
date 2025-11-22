/**
 * Comparison Card Component
 * Simplified design with single image and title
 */

import React from 'react';
import './ComparisonCard.css';
import Icon from '../Icon';
import { Button } from '../../design-system/components';

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
    <div className="comparison-card">
      <div className="comparison-card__content">
        <div className="comparison-card__image-wrapper">
          <img src={vehicle1.image} alt={comparisonTitle} className="comparison-card__image" />
          {onBookmark && (
            <button 
              className={`comparison-card__bookmark-btn ${isBookmarked ? 'comparison-card__bookmark-btn--active' : ''}`}
              onClick={onBookmark}
              aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
            >
              <Icon name={isBookmarked ? 'bookmark' : 'bookmark_border'} variant={isBookmarked ? 'filled' : 'outlined'} size={20} />
            </button>
          )}
        </div>
        
        <div className="comparison-card__info">
          <h3 className="comparison-card__title">{comparisonTitle}</h3>
          <p className="comparison-card__label">Comparison</p>
          {onViewComparison && (
            <Button 
              color="secondary" 
              className="comparison-card__button" 
              onClick={onViewComparison}
            >
              View Comparison
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

