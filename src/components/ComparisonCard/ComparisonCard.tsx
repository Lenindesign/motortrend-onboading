/**
 * Comparison Card Component
 * Migrated to inline styles for Tailwind compatibility
 */

import React, { useState, useEffect } from 'react';
import Icon from '../Icon';
import { CardShell } from '../atoms/CardShell/CardShell';

export interface ComparisonCardProps {
  vehicle1: {
    image: string;
    name: string;
  };
  vehicle2: {
    image: string;
    name: string;
  };
  onBookmark?: () => void;
  isBookmarked?: boolean;
  onViewComparison?: () => void;
}

export const ComparisonCard: React.FC<ComparisonCardProps> = ({ 
  vehicle1, 
  vehicle2,
  onBookmark,
  isBookmarked = false,
  onViewComparison
}) => {
  const [isBookmarkHovered, setIsBookmarkHovered] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const comparisonTitle = `${vehicle1.name} / ${vehicle2.name}`;

  // Styles
  const innerStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '12px' };
  const topRowStyle: React.CSSProperties = { display: 'flex', gap: '16px', alignItems: isMobile ? 'stretch' : 'center', flexDirection: isMobile ? 'column' : 'row' };
  const imageContainerStyle: React.CSSProperties = { position: 'relative', width: isMobile ? '100%' : '150px', maxWidth: isMobile ? '100%' : '150px', height: isMobile ? '200px' : '100px', borderRadius: '8px', overflow: 'hidden', cursor: onViewComparison ? 'pointer' : 'default' };
  const imageStyle: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'cover' };
  const bookmarkBtnStyle: React.CSSProperties = { position: 'absolute', top: '8px', right: '8px', width: '32px', height: '32px', borderRadius: '50%', border: 'none', background: isBookmarked ? 'var(--color-primary-1, #E90C17)' : (isBookmarkHovered ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.9)'), cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isBookmarked ? '#fff' : 'var(--color-neutrals-3, #353945)', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', transition: 'all 150ms ease-in-out' };
  const contentStyle: React.CSSProperties = { flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' };
  const infoStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '4px' };
  const titleStyle: React.CSSProperties = { fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '16px', lineHeight: 1.3, color: 'var(--color-neutrals-1, #141416)', margin: 0 };
  const typeStyle: React.CSSProperties = { fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: '14px', color: 'var(--color-neutrals-4, #6E7481)', margin: 0 };
  const bottomRowStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
  const buttonStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 16px', background: isButtonHovered ? 'var(--color-neutrals-7, #F4F5F6)' : 'none', border: '1px solid var(--color-neutrals-6, #E6E8EC)', borderRadius: '6px', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '14px', color: 'var(--color-neutrals-2, #23262F)', cursor: 'pointer', transition: 'all 150ms ease-in-out', width: isMobile ? '100%' : 'auto', justifyContent: isMobile ? 'center' : 'flex-start' };

  return (
    <CardShell padding="sm" hasHover={true} hasShadow={true} borderRadius="md" background="neutral-lighter" style={{ maxWidth: isMobile ? '100%' : '650px' }}>
      <div style={innerStyle}>
        <div style={topRowStyle}>
          <div style={imageContainerStyle} onClick={onViewComparison ? (e) => { e.stopPropagation(); onViewComparison(); } : undefined}>
            <img src={vehicle1.image} alt={comparisonTitle} style={imageStyle} />
            {onBookmark && (
              <button style={bookmarkBtnStyle} onClick={(e) => { e.stopPropagation(); onBookmark(); }} onMouseEnter={() => setIsBookmarkHovered(true)} onMouseLeave={() => setIsBookmarkHovered(false)} aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark'}>
                <Icon name={isBookmarked ? 'bookmark' : 'bookmark_border'} variant={isBookmarked ? 'filled' : 'outlined'} size={20} />
              </button>
            )}
          </div>
          <div style={contentStyle}>
            <div style={infoStyle}>
              <h4 style={titleStyle}>{comparisonTitle}</h4>
              <p style={typeStyle}>Comparison</p>
            </div>
          </div>
        </div>
        <div style={bottomRowStyle}>
          <div></div>
          {onViewComparison && (
            <button style={buttonStyle} onClick={(e) => { e.stopPropagation(); onViewComparison(); }} onMouseEnter={() => setIsButtonHovered(true)} onMouseLeave={() => setIsButtonHovered(false)}>
              View Comparison
              <Icon name="chevron_right" size={18} />
            </button>
          )}
        </div>
      </div>
    </CardShell>
  );
};
