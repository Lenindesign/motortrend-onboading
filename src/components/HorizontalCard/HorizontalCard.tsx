/**
 * Horizontal Card Component
 * Horizontal card for news river layout
 */

import React from 'react';
import './HorizontalCard.css';

export interface HorizontalCardProps {
  imageUrl: string;
  title: string;
  author?: string;
  date?: string;
  category?: string;
  onClick?: () => void;
}

export const HorizontalCard: React.FC<HorizontalCardProps> = ({
  imageUrl,
  title,
  author,
  date,
  category,
  onClick,
}) => {
  return (
    <div 
      className="horizontal-card"
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
      <div className="horizontal-card__image-container">
        <img 
          src={imageUrl} 
          alt={title} 
          className="horizontal-card__image"
        />
      </div>
      <div className="horizontal-card__content">
        {category && (
          <div className="horizontal-card__category">
            {category}
          </div>
        )}
        <h4 className="horizontal-card__title">{title}</h4>
        {(author || date) && (
          <div className="horizontal-card__metadata">
            {author && date ? `${author} | ${date}` : author || date}
          </div>
        )}
      </div>
    </div>
  );
};

export default HorizontalCard;



