/**
 * Vertical Card Component
 * Migrated to inline styles for Tailwind compatibility
 */

import React, { useState, useEffect } from 'react';
import Icon from '../Icon';
import { CardShell } from '../atoms/CardShell/CardShell';
import { useImageFallback } from '../../hooks/useImageFallback';

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
  const { imgSrc, handleImageError } = useImageFallback(imageUrl);
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
  const innerStyle: React.CSSProperties = { position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', height: '100%' };
  const imageContainerStyle: React.CSSProperties = { position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden', backgroundColor: 'var(--color-neutrals-7, #F4F5F6)' };
  const imageStyle: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)', transformOrigin: 'center center', display: 'block', transform: isHovered ? 'scale(1.03)' : 'none' };
  const playOverlayStyle: React.CSSProperties = { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' };
  const playIconStyle: React.CSSProperties = { transition: 'transform 150ms ease-in-out', transform: isHovered ? 'scale(1.1)' : 'none' };
  const contentStyle: React.CSSProperties = { padding: isMobile ? 'var(--spacing-2, 16px)' : 'var(--spacing-3, 24px)', flex: 1, display: 'flex', alignItems: 'flex-start' };
  const titleStyle: React.CSSProperties = { fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: isMobile ? '18px' : '16px', lineHeight: 1.4, color: isMobile ? 'var(--color-neutrals-2, #23262F)' : 'var(--color-neutrals-1, #141416)', margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' };

  return (
    <CardShell padding="none" hasHover={true} hasShadow={true} borderRadius="md" background="white" onClick={onClick} style={cardStyle} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div style={innerStyle}>
        <div style={imageContainerStyle}>
          <img src={imgSrc} alt={title} style={imageStyle} onError={handleImageError} />
          {type === 'Video' && (
            <div style={playOverlayStyle}>
              <span style={{ ...playIconStyle, display: 'flex', width: 64, height: 64, alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'var(--color-overlay-dark, rgba(0,0,0,0.5))' }}>
                <Icon name="play" variant="filled" size={32} style={{ color: 'white' }} />
              </span>
            </div>
          )}
        </div>
        <div style={contentStyle}>
          <h4 style={titleStyle}>{title}</h4>
        </div>
      </div>
    </CardShell>
  );
};

export default VerticalCard;
