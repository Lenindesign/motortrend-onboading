/**
 * Universal Card Component
 * Migrated to inline React styles - no external CSS dependency
 * Based on VehicleCard structure following atomic design principles
 */

import React, { useState, useEffect } from 'react';
import Icon from '../Icon';
import { CardShell } from '../atoms/CardShell/CardShell';
import { useImageFallback } from '../../hooks/useImageFallback';

export interface CardProps {
  // Core content
  image: string;
  title: string;
  subtitle?: string;
  type?: string;

  // Optional content sections
  metadata?: string;
  ratings?: Array<{ value: number | string; color: string }>;
  hasMultipleRatings?: boolean;

  // Interactive elements
  onBookmark?: () => void;
  isBookmarked?: boolean;
  onAction?: () => void;
  actionText?: string;
  onRate?: () => void;
  userRating?: number;

  // Vehicle-specific props
  ownership?: 'own' | 'want';
  onOwnershipChange?: (value: 'own' | 'want') => void;

  // Video-specific props
  showPlayIcon?: boolean;

  // Custom styling
  className?: string;
  variant?: 'default' | 'compact';
}

export const Card: React.FC<CardProps> = ({
  image,
  title,
  subtitle,
  type,
  metadata,
  ratings = [],
  hasMultipleRatings = false,
  onBookmark,
  isBookmarked = false,
  onAction,
  actionText = 'View Details',
  onRate,
  userRating,
  ownership,
  onOwnershipChange,
  showPlayIcon = false,
  className = '',
  variant = 'default'
}) => {
  const { imgSrc, handleImageError } = useImageFallback(image);
  
  // Responsive state
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  // Hover states
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [isBookmarkHovered, setIsBookmarkHovered] = useState(false);
  const [hoveredOwnership, setHoveredOwnership] = useState<string | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [isRateStarHovered, setIsRateStarHovered] = useState(false);
  const [isRateOptionHovered, setIsRateOptionHovered] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  
  // Responsive handler
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isCompact = variant === 'compact';

  // ==================== INLINE STYLES ====================

  const innerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: isCompact ? 'var(--spacing-1, 8px)' : (isMobile ? 'var(--spacing-gap-sm, 4px)' : 'var(--spacing-2, 16px)'),
    width: '100%',
    alignSelf: 'space-between',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    textAlign: 'start',
  };

  const topRowStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: isMobile ? 'var(--spacing-2, 16px)' : 'var(--spacing-2, 16px)',
  };

  const imageContainerStyle: React.CSSProperties = {
    position: 'relative',
    width: isMobile ? '160px' : '150px',
    height: isMobile ? '100px' : '100px',
    flexShrink: 0,
    overflow: 'hidden',
    borderRadius: 'var(--border-radius-md, 8px)',
    cursor: onAction ? 'pointer' : 'default',
  };

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: 'var(--border-radius-md, 8px)',
    transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    transformOrigin: 'center center',
    transform: isImageHovered ? 'scale(1.03)' : 'scale(1)',
  };

  const bookmarkBtnStyle: React.CSSProperties = {
    position: 'absolute',
    top: 'var(--spacing-component-md, 12px)',
    left: 'var(--spacing-component-md, 12px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    padding: '6px',
    background: isBookmarkHovered 
      ? (isBookmarked ? 'var(--color-overlay-dark, rgba(0,0,0,0.7))' : 'var(--color-overlay-medium, rgba(0,0,0,0.6))')
      : (isBookmarked ? 'var(--color-overlay-medium, rgba(0,0,0,0.5))' : 'var(--color-overlay-light, rgba(0,0,0,0.4))'),
    border: 'none',
    borderRadius: 'var(--border-radius-sm, 4px)',
    color: 'var(--color-white, #FFFFFF)',
    cursor: 'pointer',
    transition: 'all var(--transition-fast, all 150ms ease-in-out)',
    backdropFilter: 'blur(4px)',
    zIndex: 10,
    transform: isBookmarkHovered ? 'scale(1.05)' : 'scale(1)',
  };

  const playIconStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '64px',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    color: 'rgba(255, 255, 255, 0.9)',
    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
  };

  const contentStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
  };

  const infoStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-gap-xs, 4px)',
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontWeight: 'var(--font-weight-bold, 600)',
    fontSize: isCompact ? '12px' : (isMobile ? '20px' : '18px'),
    lineHeight: isMobile ? '1.3em' : '1.2em',
    color: 'var(--color-neutrals-1, #141416)',
    margin: '0 0 var(--spacing-1, 8px) 0',
  };

  const subtitleStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontWeight: 400,
    fontSize: isCompact ? '12px' : (isMobile ? '14px' : '12px'),
    lineHeight: isMobile ? '1.3em' : '1.29em',
    color: 'var(--color-neutrals-3, #353945)',
    margin: 0,
    display: '-webkit-box',
    WebkitLineClamp: 1,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  };

  const typeStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontWeight: 'var(--font-weight-regular, 400)',
    fontSize: isCompact ? '12px' : (isMobile ? '13px' : '14px'),
    lineHeight: '1.33em',
    color: 'var(--color-neutrals-4, #6E7481)',
    margin: 0,
  };

  const metadataStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontWeight: 400,
    fontSize: isCompact ? '11px' : (isMobile ? '13px' : '12px'),
    lineHeight: '1.33em',
    color: 'var(--color-neutrals-3, #353945)',
    margin: 0,
  };

  const ownershipStyle: React.CSSProperties = {
    display: 'flex',
    gap: isMobile ? 'var(--spacing-gap-sm, 4px)' : 'var(--spacing-gap-sm, 4px)',
    alignItems: 'center',
    marginTop: isMobile ? 'var(--spacing-component-sm, 8px)' : 'var(--spacing-component-md, 12px)',
  };

  const getOwnershipOptionStyle = (value: string): React.CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--spacing-gap-sm, 4px)',
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontSize: isMobile ? '14px' : '16px',
    fontWeight: 400,
    color: 'var(--color-neutrals-2, #23262F)',
    cursor: 'pointer',
    transition: 'opacity var(--transition-fast, all 150ms ease-in-out)',
    opacity: hoveredOwnership === value ? 0.8 : 1,
  });

  const getOwnershipRadioStyle = (isActive: boolean): React.CSSProperties => ({
    width: '24px',
    height: '24px',
    borderRadius: 'var(--border-radius-circle, 50%)',
    border: `2px solid ${isActive ? 'var(--color-neutrals-1, #141416)' : 'var(--color-neutrals-5, #B1B5C3)'}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all var(--transition-fast, all 150ms ease-in-out)',
    flexShrink: 0,
    backgroundColor: 'transparent',
  });

  const ownershipRadioDotStyle: React.CSSProperties = {
    width: '12px',
    height: '12px',
    borderRadius: 'var(--border-radius-circle, 50%)',
    backgroundColor: 'var(--color-neutrals-1, #141416)',
  };

  const ownershipEmojiStyle: React.CSSProperties = {
    fontSize: '18px',
    lineHeight: 1,
    flexShrink: 0,
  };

  const ownershipLabelStyle: React.CSSProperties = {
    fontWeight: 400,
  };

  const bottomRowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 'var(--spacing-2, 16px)',
    minHeight: '34px',
    overflow: 'visible',
    position: 'relative',
  };

  const ratingsStyle: React.CSSProperties = {
    display: 'flex',
    gap: 'var(--spacing-2, 16px)',
    alignItems: 'center',
    padding: 'var(--spacing-component-xs, 4px) var(--spacing-component-sm, 8px)',
    background: 'transparent',
    borderRadius: 'var(--border-radius-sm, 4px)',
    color: 'var(--color-neutrals-2, #23262F)',
    minWidth: 0,
    flexWrap: 'nowrap',
    overflow: 'visible',
  };

  const getRatingStyle = (_index: number): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-gap-xs, 4px)',
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontWeight: 'var(--font-weight-bold, 600)',
    fontSize: isMobile ? '12px' : '14px',
    color: 'var(--color-neutrals-2, #23262F)',
    minWidth: 0,
    flexShrink: 0,
    height: 'fit-content',
    alignSelf: 'flex-start',
    overflow: 'visible',
    position: 'relative',
  });

  const ratingTooltipStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'var(--color-neutrals-2, #23262F)',
    color: 'var(--color-white, #FFFFFF)',
    padding: 'var(--spacing-component-xs, 4px) var(--spacing-component-sm, 8px)',
    borderRadius: 'var(--border-radius-sm, 4px)',
    fontFamily: "'Geist', system-ui, -apple-system, sans-serif",
    fontWeight: 600,
    fontSize: '12px',
    lineHeight: 1.2,
    whiteSpace: 'nowrap',
    marginBottom: 'var(--spacing-component-sm, 8px)',
    boxShadow: 'var(--shadow-dropdown, 0 4px 12px rgba(0,0,0,0.15))',
    zIndex: 1001,
    opacity: hoveredRating !== null ? 1 : 0,
    visibility: hoveredRating !== null ? 'visible' : 'hidden',
    transition: 'all var(--transition-fast, all 150ms ease-in-out)',
    pointerEvents: 'none',
  };

  const ratingStarStyle: React.CSSProperties = {
    width: isMobile ? '16px' : '18px',
    height: isMobile ? '16px' : '18px',
    minWidth: isMobile ? '16px' : '18px',
    minHeight: isMobile ? '16px' : '18px',
    maxWidth: isMobile ? '16px' : '18px',
    maxHeight: isMobile ? '16px' : '18px',
    objectFit: 'contain',
    display: 'block',
    lineHeight: 1,
    margin: 0,
    padding: 0,
    background: 'transparent',
    border: 'none',
    flexShrink: 0,
  };

  const ratingMtLogoStyle: React.CSSProperties = {
    width: isMobile ? '16px' : '20px',
    height: isMobile ? '16px' : '20px',
    minWidth: isMobile ? '16px' : '20px',
    minHeight: isMobile ? '16px' : '20px',
    maxWidth: isMobile ? '16px' : '20px',
    maxHeight: isMobile ? '16px' : '20px',
    objectFit: 'contain',
    display: 'block',
    lineHeight: 1,
    margin: 0,
    padding: 0,
    background: 'transparent',
    border: 'none',
    flexShrink: 0,
  };

  const rateStarBtnStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    padding: 0,
    margin: 0,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    transition: 'transform 0.2s ease',
    overflow: 'visible',
    transform: isRateStarHovered ? 'scale(1.1)' : 'scale(1)',
  };

  const rateStarTooltipStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: 'calc(100% + var(--spacing-component-sm, 8px))',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: 'var(--spacing-component-xs, 4px) var(--spacing-component-sm, 8px)',
    backgroundColor: 'var(--color-neutrals-1, #141416)',
    color: 'var(--color-neutrals-6, #E6E8EC)',
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontSize: '12px',
    fontWeight: 600,
    whiteSpace: 'nowrap',
    borderRadius: 'var(--border-radius-sm, 4px)',
    opacity: isRateStarHovered ? 1 : 0,
    pointerEvents: 'none',
    transition: 'opacity var(--transition-fast, all 150ms ease-in-out)',
    zIndex: 10000,
  };

  const rateOptionStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-gap-xs, 4px)',
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    transition: 'opacity 0.2s ease',
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontWeight: 'var(--font-weight-medium, 600)',
    fontSize: '12px',
    color: 'var(--color-neutrals-2, #23262F)',
    opacity: isRateOptionHovered ? 0.7 : 1,
  };

  const ratingValueStyle: React.CSSProperties = {
    fontFamily: "'Geist', system-ui, -apple-system, sans-serif",
    fontWeight: 600,
    fontSize: '14px',
    color: 'var(--color-neutrals-2, #23262F)',
    paddingLeft: 'var(--spacing-gap-xs, 4px)',
  };

  const buttonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 0,
    padding: isCompact ? '6px 12px' : (isMobile ? 'var(--spacing-1, 8px) var(--spacing-2, 16px)' : 'var(--spacing-2, 16px) var(--spacing-3, 24px)'),
    background: 'var(--color-neutrals-1, #141416)',
    border: 'none',
    borderRadius: 'var(--border-radius-md, 8px)',
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontWeight: 'var(--font-weight-bold, 600)',
    fontSize: isCompact ? '12px' : (isMobile ? '12px' : '14px'),
    color: 'var(--color-white, #FFFFFF)',
    cursor: 'pointer',
    transition: 'all var(--transition-fast, all 150ms ease-in-out)',
    whiteSpace: 'nowrap',
    height: isMobile ? '36px' : '36px',
    minHeight: isMobile ? '36px' : undefined,
    boxShadow: 'var(--shadow-depth-5, 0px 4px 20px 0px rgba(20, 20, 22, 0.06))',
    transform: isButtonPressed ? 'translateY(0)' : (isButtonHovered ? 'translateY(-1px)' : 'translateY(0)'),
    width: isMobile ? 'auto' : undefined,
    justifyContent: isMobile ? 'flex-start' : undefined,
  };

  return (
    <CardShell
      padding="sm"
      hasHover={true}
      hasShadow={true}
      borderRadius="md"
      background="neutral-lighter"
      className={className}
      style={{ width: '100%', height: isMobile ? '180px' : undefined }}
    >
      <div style={innerStyle}>
        <div style={topRowStyle}>
          <div
            style={imageContainerStyle}
            onClick={onAction ? (e) => {
              e.stopPropagation();
              onAction();
            } : undefined}
            onMouseEnter={() => setIsImageHovered(true)}
            onMouseLeave={() => setIsImageHovered(false)}
          >
            <img 
              src={imgSrc} 
              alt={title} 
              style={imageStyle}
              onError={handleImageError}
            />
            {onBookmark && (
              <button
                style={bookmarkBtnStyle}
                onClick={(e) => {
                  e.stopPropagation();
                  onBookmark();
                }}
                onMouseEnter={() => setIsBookmarkHovered(true)}
                onMouseLeave={() => setIsBookmarkHovered(false)}
                aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
              >
                <Icon name={isBookmarked ? 'bookmark' : 'bookmark_border'} variant={isBookmarked ? 'filled' : 'outlined'} size={20} />
              </button>
            )}
            {showPlayIcon && (
              <div style={playIconStyle}>
                <Icon name="play_circle" variant="filled" size={64} />
              </div>
            )}
          </div>

          <div style={contentStyle}>
            <div style={infoStyle}>
              <h4 style={titleStyle}>{title}</h4>
              {subtitle && <p style={subtitleStyle}>{subtitle}</p>}
              {type && <p style={typeStyle}>{type}</p>}
              {metadata && <p style={metadataStyle}>{metadata}</p>}
            </div>

            {/* Vehicle ownership section with emojis */}
            {ownership && onOwnershipChange && (
              <div style={ownershipStyle}>
                <label 
                  style={getOwnershipOptionStyle('own')} 
                  onClick={() => onOwnershipChange('own')}
                  onMouseEnter={() => setHoveredOwnership('own')}
                  onMouseLeave={() => setHoveredOwnership(null)}
                >
                  <div style={getOwnershipRadioStyle(ownership === 'own')}>
                    {ownership === 'own' && <div style={ownershipRadioDotStyle} />}
                  </div>
                  <span style={ownershipEmojiStyle}>🔑</span>
                  <span style={ownershipLabelStyle}>Own</span>
                </label>
                <label 
                  style={getOwnershipOptionStyle('want')} 
                  onClick={() => onOwnershipChange('want')}
                  onMouseEnter={() => setHoveredOwnership('want')}
                  onMouseLeave={() => setHoveredOwnership(null)}
                >
                  <div style={getOwnershipRadioStyle(ownership === 'want')}>
                    {ownership === 'want' && <div style={ownershipRadioDotStyle} />}
                  </div>
                  <span style={ownershipEmojiStyle}>😍</span>
                  <span style={ownershipLabelStyle}>Want</span>
                </label>
              </div>
            )}
          </div>
        </div>

        <div style={bottomRowStyle}>
          {/* Ratings section */}
          {(hasMultipleRatings && ratings.length > 0) || onRate ? (
            <div style={ratingsStyle}>
              {hasMultipleRatings && ratings.length > 0 && (
                <>
                  {ratings.map((rating, index) => {
                    const tooltipText = rating.color === '#FFB74D' ? 'MotorTrend Rating' : 'Community Rating (25)';
                    const isMotorTrendRating = rating.color === '#FFB74D';
                    return (
                      <div 
                        key={index} 
                        style={getRatingStyle(index)}
                        onMouseEnter={() => setHoveredRating(index)}
                        onMouseLeave={() => setHoveredRating(null)}
                      >
                        <div style={{ ...ratingTooltipStyle, opacity: hoveredRating === index ? 1 : 0, visibility: hoveredRating === index ? 'visible' : 'hidden' }}>
                          {tooltipText}
                        </div>
                        {isMotorTrendRating ? (
                          <img
                            src="https://d2kde5ohu8qb21.cloudfront.net/files/692374f1d13f5100022ddf61/mticon.svg"
                            alt="MotorTrend"
                            style={ratingMtLogoStyle}
                          />
                        ) : (
                          <img
                            src="https://d2kde5ohu8qb21.cloudfront.net/files/691bde547554840002bab60c/star.svg"
                            alt="Star rating"
                            style={ratingStarStyle}
                          />
                        )}
                        <span style={{ fontFamily: "'Geist', system-ui, -apple-system, sans-serif", fontSize: '14px', color: 'var(--color-neutrals-2, #23262F)' }}>
                          {rating.value}
                        </span>
                      </div>
                    );
                  })}
                </>
              )}
              {onRate && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-gap-xs, 4px)', position: 'relative', overflow: 'visible' }}>
                  {userRating ? (
                    <button 
                      style={rateOptionStyle} 
                      onClick={(e) => {
                        e.stopPropagation();
                        onRate();
                      }}
                      onMouseEnter={() => setIsRateOptionHovered(true)}
                      onMouseLeave={() => setIsRateOptionHovered(false)}
                    >
                      <img
                        src="https://d2kde5ohu8qb21.cloudfront.net/files/691bde547554840002bab60c/star.svg"
                        alt="User rated star"
                        style={ratingStarStyle}
                      />
                      <span style={ratingValueStyle}>{(userRating / 20).toFixed(1)}/5</span>
                    </button>
                  ) : (
                    <button 
                      style={rateStarBtnStyle} 
                      onClick={(e) => {
                        e.stopPropagation();
                        onRate();
                      }}
                      onMouseEnter={() => setIsRateStarHovered(true)}
                      onMouseLeave={() => setIsRateStarHovered(false)}
                    >
                      <img
                        src="https://d2kde5ohu8qb21.cloudfront.net/files/691bde5264217700021d6b71/star-stroke.svg"
                        alt="Rate star"
                        style={ratingStarStyle}
                      />
                      <span style={rateStarTooltipStyle}>Rate This Car</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : null}

          {/* Spacer when no ratings or rate option */}
          {!((hasMultipleRatings && ratings.length > 0) || onRate) && <div></div>}

          {/* Action button */}
          {onAction && (
            <button 
              style={buttonStyle} 
              onClick={(e) => {
                e.stopPropagation();
                onAction();
              }}
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => { setIsButtonHovered(false); setIsButtonPressed(false); }}
              onMouseDown={() => setIsButtonPressed(true)}
              onMouseUp={() => setIsButtonPressed(false)}
            >
              {actionText}
              <Icon name="chevron_right" size={18} />
            </button>
          )}
        </div>
      </div>
    </CardShell>
  );
};

export default Card;
