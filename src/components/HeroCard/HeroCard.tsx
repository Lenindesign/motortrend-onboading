/**
 * Hero Card Component
 * Large hero card for featured content
 * Now uses CardShell atom for consistent card wrapper styling
 */

import React from 'react';
import './HeroCard.css';
import { CardShell } from '../atoms/CardShell/CardShell';
import { useImageFallback } from '../../hooks/useImageFallback';

// Fallback placeholder for broken images (larger size for Hero)
const HERO_FALLBACK_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400"%3E%3Crect fill="%23374151" width="800" height="400"/%3E%3Ctext fill="%239CA3AF" font-family="system-ui" font-size="24" text-anchor="middle" x="400" y="200"%3EImage unavailable%3C/text%3E%3C/svg%3E';

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
  const { imgSrc, handleImageError } = useImageFallback(imageUrl, HERO_FALLBACK_IMAGE);

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
          src={imgSrc} 
          alt={title} 
          className="hero-card__image"
          onError={handleImageError}
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



