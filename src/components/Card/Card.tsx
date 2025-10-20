/**
 * Universal Card Component
 * Based on VehicleCard structure following atomic design principles
 */

import React from 'react';
import './Card.css';
import Icon from '../Icon';

export interface CardProps {
  // Core content
  image: string;
  title: string;
  subtitle?: string;
  type?: string;
  
  // Optional content sections
  metadata?: string; // For author/date info
  ratings?: Array<{ value: number; color: string }>;
  hasMultipleRatings?: boolean;
  
  // Interactive elements
  onBookmark?: () => void;
  isBookmarked?: boolean;
  onAction?: () => void;
  actionText?: string;
  
  // Vehicle-specific props (optional)
  ownership?: 'own' | 'want';
  onOwnershipChange?: (value: 'own' | 'want') => void;
  
  // Video-specific props (optional)
  showPlayIcon?: boolean;
  
  // Custom styling
  className?: string;
  variant?: 'default' | 'compact';
}

export const Card: React.FC<CardProps> = ({
  image,
  title,
  subtitle,
  type,
  metadata,
  ratings = [],
  hasMultipleRatings = false,
  onBookmark,
  isBookmarked = false,
  onAction,
  actionText = 'View Details',
  ownership,
  onOwnershipChange,
  showPlayIcon = false,
  className = '',
  variant = 'default'
}) => {
  const cardClasses = `card card--${variant} ${className}`.trim();

  return (
    <div className={cardClasses}>
      <div className="card__top-row">
        <div className="card__image-container">
          <img src={image} alt={title} className="card__image" />
          {onBookmark && (
            <button 
              className={`card__bookmark-btn ${isBookmarked ? 'card__bookmark-btn--active' : ''}`}
              onClick={onBookmark}
              aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
            >
              <Icon name={isBookmarked ? 'bookmark' : 'bookmark_border'} variant={isBookmarked ? 'filled' : 'outlined'} size={16} />
            </button>
          )}
          {showPlayIcon && (
            <div className="card__play-icon">
              <Icon name="play_circle" variant="filled" size={64} />
            </div>
          )}
        </div>
        
        <div className="card__content">
          <div className="card__info">
            <h4 className="card__title">{title}</h4>
            {subtitle && <p className="card__subtitle">{subtitle}</p>}
            {type && <p className="card__type">{type}</p>}
            {metadata && <p className="card__metadata">{metadata}</p>}
          </div>
          
          {/* Vehicle ownership section */}
          {ownership && onOwnershipChange && (
            <div className="card__ownership">
              <label className="card__ownership-option" onClick={() => onOwnershipChange('own')}>
                <Icon name={ownership === 'own' ? 'radio_button_checked' : 'radio_button_unchecked'} size={20} className="card__ownership-icon" style={{ color: ownership === 'own' ? 'var(--color-red, #E11D2E)' : 'var(--color-neutrals-3)' }} />
                <span>Own</span>
              </label>
              <label className="card__ownership-option" onClick={() => onOwnershipChange('want')}>
                <Icon name={ownership === 'want' ? 'radio_button_checked' : 'radio_button_unchecked'} size={20} className="card__ownership-icon" style={{ color: ownership === 'want' ? 'var(--color-red, #E11D2E)' : 'var(--color-neutrals-3)' }} />
                <span>Want</span>
              </label>
            </div>
          )}
        </div>
      </div>

      <div className="card__bottom-row">
        {/* Ratings section */}
        {hasMultipleRatings && ratings.length > 0 && (
          <div className="card__ratings">
            {ratings.map((rating, index) => (
              <div key={index} className="card__rating">
                <Icon name="star" size={18} style={{ color: rating.color }} />
                <span>{rating.value}</span>
              </div>
            ))}
          </div>
        )}
        
        {/* Spacer when no ratings */}
        {(!hasMultipleRatings || ratings.length === 0) && <div></div>}
        
        {/* Action button */}
        {onAction && (
          <button className="card__button" onClick={onAction}>
            {actionText}
            <Icon name="chevron_right" size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Card;
