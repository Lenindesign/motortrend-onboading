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
  onRate?: () => void; // New prop for the "Rate" action
  userRating?: number; // User's rating for the vehicle
  
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
  onRate,
  userRating,
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
        <div 
          className={`card__image-container ${onAction ? 'card__image-container--clickable' : ''}`}
          onClick={onAction ? (e) => {
            e.stopPropagation();
            onAction();
          } : undefined}
        >
          <img src={image} alt={title} className="card__image" />
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
          
          {/* Vehicle ownership section with emojis */}
          {ownership && onOwnershipChange && (
            <div className="card__ownership">
              <label className="card__ownership-option" onClick={() => onOwnershipChange('own')}>
                <div className={`card__ownership-radio ${ownership === 'own' ? 'card__ownership-radio--active' : ''}`}>
                  {ownership === 'own' && <div className="card__ownership-radio-dot" />}
                </div>
                <span className="card__ownership-emoji">🔑</span>
                <span className="card__ownership-label">Own</span>
              </label>
              <label className="card__ownership-option" onClick={() => onOwnershipChange('want')}>
                <div className={`card__ownership-radio ${ownership === 'want' ? 'card__ownership-radio--active' : ''}`}>
                  {ownership === 'want' && <div className="card__ownership-radio-dot" />}
                </div>
                <span className="card__ownership-emoji">😍</span>
                <span className="card__ownership-label">Want</span>
              </label>
            </div>
          )}
        </div>
      </div>

      <div className="card__bottom-row">
        {/* Ratings section */}
        {(hasMultipleRatings && ratings.length > 0) || onRate ? (
          <div className="card__ratings">
            {hasMultipleRatings && ratings.length > 0 && (
              <>
                {ratings.map((rating, index) => {
                  const tooltipText = rating.color === '#FFB74D' ? 'Expert Rating' : 'Community Rating (25)';
                  const isMotorTrendRating = rating.color === '#FFB74D';
                  return (
                    <div key={index} className="card__rating card__rating--with-tooltip">
                      <div className="card__rating-tooltip">
                        {tooltipText}
                      </div>
                      {isMotorTrendRating ? (
                        <img 
                          src="https://d2kde5ohu8qb21.cloudfront.net/files/691b33a319d4b50002408402/mt-rating.svg" 
                          alt="MotorTrend" 
                          className="card__rating-mt-logo"
                        />
                      ) : (
                        <img 
                          src="https://d2kde5ohu8qb21.cloudfront.net/files/68f66c095d4ae300022a2b0e/starbluesolid.svg" 
                          alt="Star rating" 
                          className="card__rating-star"
                        />
                      )}
                      <span>{rating.value}</span>
                    </div>
                  );
                })}
              </>
            )}
            {onRate && (
              <div className="card__rating">
                {userRating ? (
                  <button className="card__rate-option" onClick={(e) => {
                    e.stopPropagation();
                    onRate();
                  }}>
                    <img 
                      src="https://d2kde5ohu8qb21.cloudfront.net/files/68f66c095d4ae300022a2b0e/starbluesolid.svg"
                      alt="User rated star" 
                      className="card__rating-star"
                    />
                    <span className="card__rating-value">{userRating.toString()}</span>
                  </button>
                ) : (
                  <button className="card__rate-star-btn" onClick={(e) => {
                    e.stopPropagation();
                    onRate();
                  }}>
                    <img 
                      src="https://d2kde5ohu8qb21.cloudfront.net/files/691b47c61d356000022d5f14/star-stroke.svg" 
                      alt="Rate star" 
                      className="card__rating-star"
                    />
                    <span className="card__rate-star-tooltip">Rate This Car</span>
                  </button>
                )}
              </div>
            )}
          </div>
        ) : null}
        
        {/* Spacer when no ratings or rate option */}
        {!((hasMultipleRatings && ratings.length > 0) || onRate) && <div></div>}
        
        {/* Action button */}
        {onAction && (
          <button className="card__button" onClick={(e) => {
            e.stopPropagation();
            onAction();
          }}>
            {actionText}
            <Icon name="chevron_right" size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Card;
