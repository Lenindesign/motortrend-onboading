import React from 'react';
import './ComparisonCard.css';
import Icon from '../Icon';

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
}

export const ComparisonCard: React.FC<ComparisonCardProps> = ({ 
  vehicle1, 
  vehicle2,
  onBookmark,
  isBookmarked = false
}) => {
  return (
    <div className="comparison-card">
      <div className="comparison-card__content">
        <div className="comparison-card__vehicle">
          <div className="comparison-card__image-container">
            <img src={vehicle1.image} alt={vehicle1.name} className="comparison-card__image" />
            <button 
              className={`comparison-card__bookmark-btn ${isBookmarked ? 'comparison-card__bookmark-btn--active' : ''}`}
              onClick={onBookmark}
              aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
            >
              <Icon name={isBookmarked ? 'bookmark' : 'bookmark_border'} variant={isBookmarked ? 'filled' : 'outlined'} size={16} />
            </button>
          </div>
          <h4 className="comparison-card__name">{vehicle1.name}</h4>
        </div>
        
        <div className="comparison-card__vs">VS</div>
        
        <div className="comparison-card__vehicle">
          <div className="comparison-card__image-container">
            <img src={vehicle2.image} alt={vehicle2.name} className="comparison-card__image" />
          </div>
          <h4 className="comparison-card__name">{vehicle2.name}</h4>
        </div>
      </div>
      
      <div className="comparison-card__actions">
        <button className="comparison-card__button">View Comparison</button>
      </div>
    </div>
  );
};

