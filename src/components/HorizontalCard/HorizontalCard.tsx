/**
 * Horizontal Card Component
 * Migrated to inline styles for Tailwind compatibility
 */

import React, { useState, useEffect } from 'react';
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
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Styles
  const innerStyle: React.CSSProperties = {
    display: 'flex',
    gap: isMobile ? 'var(--spacing-2, 16px)' : 'var(--spacing-3, 24px)',
    padding: isMobile ? 'var(--spacing-2, 16px)' : 'var(--spacing-2, 16px) 0',
    textDecoration: 'none',
    color: 'inherit',
    flexDirection: isMobile ? 'column' : 'row',
  };

  const imageContainerStyle: React.CSSProperties = {
    flexShrink: 0,
    width: isMobile ? '100%' : '50%',
    aspectRatio: '16/9',
    height: 'auto',
    overflow: 'hidden',
    borderRadius: 'var(--border-radius-md, 8px)',
    backgroundColor: 'var(--color-neutrals-7, #F4F5F6)',
    marginLeft: isMobile ? 0 : '16px',
  };

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    transformOrigin: 'center center',
    transform: isImageHovered ? 'scale(1.03)' : 'none',
  };

  const contentStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-1, 8px)',
    minWidth: 0,
    paddingRight: isMobile ? 0 : '16px',
    paddingLeft: isMobile ? 0 : undefined,
  };

  const categoryStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body)',
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: 1.4,
    color: 'var(--color-neutrals-3, #353945)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: 'var(--font-heading)',
    fontWeight: 600,
    fontSize: isMobile ? '18px' : '24px',
    lineHeight: 1.3,
    color: 'var(--color-neutrals-2, #23262F)',
    margin: 0,
  };

  const metadataStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body)',
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: 1.4,
    color: 'var(--color-neutrals-3, #353945)',
  };

  return (
    <CardShell padding="none" hasHover={true} hasShadow={true} borderRadius="lg" background="neutral-lighter" onClick={onClick} style={{ width: '100%' }}>
      <div style={innerStyle}>
        <div style={imageContainerStyle} onMouseEnter={() => setIsImageHovered(true)} onMouseLeave={() => setIsImageHovered(false)}>
          <img src={imgSrc} alt={title} style={imageStyle} onError={handleImageError} />
        </div>
        <div style={contentStyle}>
          {category && <div style={categoryStyle}>{category}</div>}
          <h4 style={titleStyle}>{title}</h4>
          {(author || date) && <div style={metadataStyle}>{author && date ? `${author} | ${date}` : author || date}</div>}
        </div>
      </div>
    </CardShell>
  );
};

export default HorizontalCard;
