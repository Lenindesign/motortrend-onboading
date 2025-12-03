/**
 * Horizontal Card Component
 * Horizontal card for news river layout
 * Now uses CardShell atom for consistent card wrapper styling
 */

import React from 'react';
import './HorizontalCard.css';
import { CardShell } from '../atoms/CardShell/CardShell';
import { useImageFallback } from '../../hooks/useImageFallback';

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
  const { imgSrc, handleImageError } = useImageFallback(imageUrl);

  return (
    <CardShell
      padding="none"
      hasHover={true}
      hasShadow={true}
      borderRadius="lg"
      background="neutral-lighter"
      onClick={onClick}
      className="horizontal-card"
    >
      <div className="horizontal-card__inner">
        <div className="horizontal-card__image-container">
        <img 
          src={imgSrc} 
          alt={title} 
          className="horizontal-card__image"
          onError={handleImageError}
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
    </CardShell>
  );
};

export default HorizontalCard;



