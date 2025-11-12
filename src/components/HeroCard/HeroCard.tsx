/**
 * Hero Card Component
 * Large hero card for featured content
 */

import React from 'react';
import './HeroCard.css';

export interface HeroCardProps {
  imageUrl: string;
  title: string;
  onClick?: () => void;
}

export const HeroCard: React.FC<HeroCardProps> = ({
  imageUrl,
  title,
  onClick,
}) => {
  return (
    <div 
      className="hero-card"
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
      <div className="hero-card__image-container">
        <img 
          src={imageUrl} 
          alt={title} 
          className="hero-card__image"
        />
      </div>
      <div className="hero-card__content">
        <h3 className="hero-card__title">{title}</h3>
      </div>
    </div>
  );
};

export default HeroCard;



