/**
 * Article Hero Component
 * Migrated to inline styles for Tailwind compatibility
 */

import React, { useState } from 'react';

export interface ArticleHeroProps {
  imageUrl?: string;
  videoUrl?: string;
  title: string;
  onShare?: () => void;
  onImageClick?: () => void;
}

export const ArticleHero: React.FC<ArticleHeroProps> = ({ imageUrl, videoUrl, title, onImageClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Styles
  const containerStyle: React.CSSProperties = {
    width: '100%',
    marginBottom: 'var(--spacing-3, 24px)'
  };

  const imageWrapperStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    aspectRatio: '16 / 9',
    borderRadius: 'var(--border-radius-md, 8px)',
    overflow: 'hidden',
    background: 'var(--color-neutrals-7, #F4F5F6)'
  };

  const mediaStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: onImageClick ? 'pointer' : 'default',
    transform: isHovered ? 'scale(1.02)' : 'scale(1)'
  };

  return (
    <div style={containerStyle}>
      <div 
        style={imageWrapperStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {videoUrl ? (
          <video
            src={videoUrl}
            style={mediaStyle}
            onClick={onImageClick}
            autoPlay
            loop
            muted
            playsInline
          />
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            style={mediaStyle}
            onClick={onImageClick}
          />
        ) : null}
      </div>
    </div>
  );
};

export default ArticleHero;
