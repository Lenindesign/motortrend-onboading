/**
 * Hero Card Component
 * Large hero card for featured content
 * Now uses CardShell atom for consistent card wrapper styling
 */

import React from 'react';
import './HeroCard.css';
import { CardShell } from '../atoms/CardShell/CardShell';

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
    <CardShell
      padding="none"
      hasHover={true}
      hasShadow={true}
      borderRadius="md"
      background="neutral-lighter"
      onClick={onClick}
      className="hero-card"
    >
      <div className="hero-card__inner">
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
    </CardShell>
  );
};

export default HeroCard;



