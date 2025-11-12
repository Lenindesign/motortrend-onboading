/**
 * Vertical Card Component
 * Vertical card for video/article content
 */

import React from 'react';
import './VerticalCard.css';

export interface VerticalCardProps {
  imageUrl: string;
  title: string;
  type?: 'Video' | 'Article';
  onClick?: () => void;
}

export const VerticalCard: React.FC<VerticalCardProps> = ({
  imageUrl,
  title,
  type = 'Video',
  onClick,
}) => {
  return (
    <div 
      className="vertical-card"
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      <div className="vertical-card__image-container">
        <img 
          src={imageUrl} 
          alt={title} 
          className="vertical-card__image"
        />
        {type === 'Video' && (
          <div className="vertical-card__play-overlay">
            <svg 
              width="64" 
              height="64" 
              viewBox="0 0 64 64" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="vertical-card__play-icon"
            >
              <circle cx="32" cy="32" r="32" fill="rgba(20, 20, 22, 0.6)"/>
              <path d="M26 20L26 44L42 32L26 20Z" fill="white"/>
            </svg>
          </div>
        )}
      </div>
      <div className="vertical-card__content">
        <h4 className="vertical-card__title">{title}</h4>
      </div>
    </div>
  );
};

export default VerticalCard;



