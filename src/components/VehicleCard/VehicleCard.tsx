import React from 'react';
import './VehicleCard.css';
import Icon from '../Icon';

export interface VehicleCardProps {
  image: string;
  name: string;
  type: string;
  rating1?: number;
  rating2?: number;
  hasMultipleRatings?: boolean;
  onBookmark?: () => void;
  isBookmarked?: boolean;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ 
  image, 
  name, 
  type, 
  rating1, 
  rating2,
  hasMultipleRatings = false,
  onBookmark,
  isBookmarked = false
}) => {
  return (
    <div className="vehicle-card">
      <div className="vehicle-card__image-container">
        <img src={image} alt={name} className="vehicle-card__image" />
        <button 
          className={`vehicle-card__bookmark-btn ${isBookmarked ? 'vehicle-card__bookmark-btn--active' : ''}`}
          onClick={onBookmark}
          aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
        >
          <Icon name={isBookmarked ? 'bookmark' : 'bookmark_border'} variant={isBookmarked ? 'filled' : 'outlined'} size={16} />
        </button>
      </div>
      
      <div className="vehicle-card__content">
        <div className="vehicle-card__info">
          <h4 className="vehicle-card__name">{name}</h4>
          <p className="vehicle-card__type">{type}</p>
        </div>
        
        <div className="vehicle-card__actions">
          {hasMultipleRatings && rating1 && rating2 && (
            <div className="vehicle-card__ratings">
              <div className="vehicle-card__rating">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 1.5L12.5 8H19L13.5 12.5L16 19L10 14.5L4 19L6.5 12.5L1 8H7.5L10 1.5Z" fill="#FFB74D"/>
                </svg>
                <span>{rating1}</span>
              </div>
              <div className="vehicle-card__rating">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 1.5L12.5 8H19L13.5 12.5L16 19L10 14.5L4 19L6.5 12.5L1 8H7.5L10 1.5Z" fill="#33CCFF"/>
                </svg>
                <span>{rating2}</span>
              </div>
            </div>
          )}
          <button className="vehicle-card__button">View Details</button>
        </div>
      </div>
    </div>
  );
};

