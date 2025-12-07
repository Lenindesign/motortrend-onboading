/**
 * Hero Card Component
 * Migrated to inline styles for Tailwind compatibility
 */

import React, { useState, useEffect } from 'react';
import { CardShell } from '../atoms/CardShell/CardShell';
import { useImageFallback } from '../../hooks/useImageFallback';

const HERO_FALLBACK_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400"%3E%3Crect fill="%23374151" width="800" height="400"/%3E%3Ctext fill="%239CA3AF" font-family="system-ui" font-size="24" text-anchor="middle" x="400" y="200"%3EImage unavailable%3C/text%3E%3C/svg%3E';

export interface HeroCardProps {
  imageUrl: string;
  title: string;
  onClick?: () => void;
}

export const HeroCard: React.FC<HeroCardProps> = ({ imageUrl, title, onClick }) => {
  const { imgSrc, handleImageError } = useImageFallback(imageUrl, HERO_FALLBACK_IMAGE);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Styles
  const cardStyle: React.CSSProperties = { width: '100%', overflow: 'hidden' };
  const innerStyle: React.CSSProperties = { position: 'relative', width: '100%', overflow: 'hidden', display: isMobile ? 'flex' : 'block', flexDirection: isMobile ? 'column' : undefined };
  const imageContainerStyle: React.CSSProperties = { position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden', backgroundColor: 'var(--color-neutrals-7, #F4F5F6)' };
  const imageStyle: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)', transformOrigin: 'center center', transform: isHovered ? 'scale(1.03)' : 'none' };
  const contentStyle: React.CSSProperties = isMobile ? { position: 'relative', background: 'transparent', padding: 'var(--spacing-2, 16px)', borderRadius: 0 } : { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 'var(--spacing-4, 32px)', background: 'linear-gradient(to top, var(--color-gradient-overlay-start, rgba(244,245,246,1)), var(--color-gradient-overlay-mid, rgba(244,245,246,0.8)), var(--color-gradient-overlay-end, rgba(244,245,246,0)))', borderRadius: 'var(--border-radius-md, 8px) var(--border-radius-md, 8px) 0 0' };
  const titleStyle: React.CSSProperties = { fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: isMobile ? '18px' : '32px', lineHeight: 1.2, color: isMobile ? 'var(--color-neutrals-2, #23262F)' : 'var(--color-neutrals-8, #FCFCFD)', margin: 0 };

  return (
    <CardShell padding="none" hasHover={true} hasShadow={true} borderRadius="md" background="neutral-lighter" onClick={onClick} style={cardStyle} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div style={innerStyle}>
        <div style={imageContainerStyle}>
          <img src={imgSrc} alt={title} style={imageStyle} onError={handleImageError} />
        </div>
        <div style={contentStyle}>
          <h3 style={titleStyle}>{title}</h3>
        </div>
      </div>
    </CardShell>
  );
};

export default HeroCard;
