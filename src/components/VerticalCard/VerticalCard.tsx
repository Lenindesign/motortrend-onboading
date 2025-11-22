/**
 * Vertical Card Component
 * Vertical card for video/article content
 * Now uses CardShell atom for consistent card wrapper styling
 */

import React from 'react';
import './VerticalCard.css';
import { CardShell } from '../atoms/CardShell/CardShell';

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
    <CardShell
      padding="none"
      hasHover={true}
      hasShadow={true}
      borderRadius="md"
      background="white"
      onClick={onClick}
      className="vertical-card"
    >
      <div className="vertical-card__inner">
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
              <circle cx="32" cy="32" r="32" className="vertical-card__play-icon-circle" />
              <path d="M26 20L26 44L42 32L26 20Z" fill="white"/>
            </svg>
          </div>
        )}
      </div>
      <div className="vertical-card__content">
        <h4 className="vertical-card__title">{title}</h4>
      </div>
      </div>
    </CardShell>
  );
};

export default VerticalCard;



