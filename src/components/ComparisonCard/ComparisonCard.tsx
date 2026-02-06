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
  const imageContainerStyle: React.CSSProperties = { position: 'relative', width: isMobile ? '100%' : '150px', maxWidth: isMobile ? '100%' : '150px', height: isMobile ? '200px' : '100px', borderRadius: 'var(--border-radius-md, 8px)', overflow: 'hidden', cursor: onViewComparison ? 'pointer' : 'default' };
  const imageStyle: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'cover' };
  const bookmarkBtnStyle: React.CSSProperties = { 
    position: 'absolute', 
    top: 'var(--spacing-component-md, 12px)', 
    left: 'var(--spacing-component-md, 12px)', 
    width: '32px', 
    height: '32px', 
    padding: '6px',
    borderRadius: 'var(--border-radius-sm, 4px)', 
    border: 'none', 
    background: isBookmarkHovered 
      ? (isBookmarked ? 'var(--color-overlay-dark, rgba(0,0,0,0.7))' : 'var(--color-overlay-medium, rgba(0,0,0,0.6))')
      : (isBookmarked ? 'var(--color-overlay-medium, rgba(0,0,0,0.5))' : 'var(--color-overlay-light, rgba(0,0,0,0.4))'),
    cursor: 'pointer', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    color: 'var(--color-white, #FFFFFF)', 
    backdropFilter: 'blur(4px)',
    zIndex: 10,
    transition: 'all 150ms ease-in-out',
    transform: isBookmarkHovered ? 'scale(1.05)' : 'scale(1)'
  };
  const contentStyle: React.CSSProperties = { flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' };
  const infoStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 'var(--spacing-gap-xs, 4px)' };
  const titleStyle: React.CSSProperties = { 
    fontFamily: 'var(--font-heading, Poppins, sans-serif)', 
    fontWeight: 'var(--font-weight-bold, 600)', 
    fontSize: isMobile ? '20px' : '18px', 
    lineHeight: isMobile ? '1.3em' : '1.2em', 
    color: 'var(--color-neutrals-1, #141416)', 
    margin: '0 0 var(--spacing-1, 8px) 0' 
  };
  const typeStyle: React.CSSProperties = { 
    fontFamily: 'var(--font-body, Geist, sans-serif)', 
    fontWeight: 'var(--font-weight-regular, 400)', 
    fontSize: isMobile ? '13px' : '14px', 
    lineHeight: '1.33em', 
    color: 'var(--color-neutrals-4, #6E7481)', 
    margin: 0 
  };
  const bottomRowStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--spacing-2, 16px)', minHeight: '34px' };
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const buttonStyle: React.CSSProperties = { 
    display: 'flex', 
    alignItems: 'center', 
    gap: 0, 
    padding: isMobile ? 'var(--spacing-1, 8px) var(--spacing-2, 16px)' : 'var(--spacing-2, 16px) var(--spacing-3, 24px)', 
    background: 'var(--color-neutrals-1, #141416)', 
    border: 'none', 
    borderRadius: 'var(--border-radius-md, 8px)', 
    fontFamily: 'var(--font-body, Geist, sans-serif)', 
    fontWeight: 'var(--font-weight-bold, 600)', 
    fontSize: isMobile ? '12px' : '14px', 
    color: 'var(--color-white, #FFFFFF)', 
    cursor: 'pointer', 
    transition: 'all var(--transition-fast, all 150ms ease-in-out)', 
    whiteSpace: 'nowrap',
    height: '36px',
    boxShadow: 'var(--shadow-depth-5, 0px 4px 20px 0px rgba(20, 20, 22, 0.06))',
    transform: isButtonPressed ? 'translateY(0)' : (isButtonHovered ? 'translateY(-1px)' : 'translateY(0)'),
    width: isMobile ? 'auto' : undefined
  };

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
            <button 
              style={buttonStyle} 
              onClick={(e) => { e.stopPropagation(); onViewComparison(); }} 
              onMouseEnter={() => setIsButtonHovered(true)} 
              onMouseLeave={() => { setIsButtonHovered(false); setIsButtonPressed(false); }}
              onMouseDown={() => setIsButtonPressed(true)}
              onMouseUp={() => setIsButtonPressed(false)}
            >
              View Comparison
              <Icon name="chevron_right" size={18} />
            </button>
          )}
        </div>
      </div>
    </CardShell>
  );
};
