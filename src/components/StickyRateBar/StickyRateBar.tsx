/**
 * StickyRateBar Component
 * Migrated to inline React styles - no external CSS dependency
 * A reusable sticky navigation bar for displaying vehicle ratings
 */

import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRating } from '../../contexts/RatingContext';
import { StaffRatingTooltip } from '../StaffRatingTooltip';
import { RatingDistributionTooltip } from '../RatingDistributionTooltip';
import { Badge } from '../../design-system/components';
import { ActionBadge } from '../molecules/ActionBadge';
import { Popover } from '../atoms/Popover';
import Icon from '../Icon';

export interface RatingItem {
  type: 'motortrend' | 'user-reviews' | 'your-rating';
  value: number | string;
  onClick?: () => void;
  label?: string;
  showStars?: boolean;
  showHalfStars?: boolean;
  iconSrc?: string;
  iconAlt?: string;
  labelTop?: string;
  labelBottom?: string;
  format?: 'vehicle-details' | 'article';
}

export interface StickyRateBarProps {
  vehicleName: string;
  vehiclePath?: string;
  /** When multiple vehicles (e.g. comparison article), show YMM + arrow and dropdown to switch */
  vehicles?: Array<{ name: string; path?: string }>;
  selectedVehicleIndex?: number;
  onSelectVehicle?: (index: number) => void;
  ratings: RatingItem[];
  ctaText?: string;
  ctaOnClick?: () => void;
  isVisible: boolean;
  isSticky?: boolean;
  className?: string;
  barRef?: React.RefObject<HTMLDivElement | null>;
  staffRatingScores?: { performance?: number; efficiency?: number; tech?: number; value?: number };
  ratingDistribution?: { [key: number]: number };
  totalReviews?: number;
  hideCtaButton?: boolean;
}

const StickyRateBar: React.FC<StickyRateBarProps> = ({
  vehicleName,
  vehiclePath,
  vehicles,
  selectedVehicleIndex = 0,
  onSelectVehicle,
  ratings,
  ctaText,
  ctaOnClick,
  isVisible,
  isSticky = false,
  className = '',
  barRef,
  staffRatingScores,
  ratingDistribution,
  totalReviews,
  hideCtaButton
}) => {
  const navigate = useNavigate();
  const { getUserRating } = useRating();
  const [isStaffTooltipVisible, setIsStaffTooltipVisible] = useState(false);
  const [isDistributionTooltipVisible, setIsDistributionTooltipVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isNarrowScreen, setIsNarrowScreen] = useState(window.innerWidth < 1280);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [isCtaHovered, setIsCtaHovered] = useState(false);
  const [isVehicleNameHovered, setIsVehicleNameHovered] = useState(false);
  const [isBuyersGuideHovered, setIsBuyersGuideHovered] = useState(false);
  const [isLocalListingsHovered, setIsLocalListingsHovered] = useState(false);
  const [isVehicleDropdownOpen, setIsVehicleDropdownOpen] = useState(false);

  const hideStaffTooltipTimeout = useRef<number | null>(null);
  const hideDistributionTooltipTimeout = useRef<number | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsNarrowScreen(window.innerWidth < 1280);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleStaffTooltipMouseEnter = () => {
    if (hideStaffTooltipTimeout.current) {
      clearTimeout(hideStaffTooltipTimeout.current);
      hideStaffTooltipTimeout.current = null;
    }
    setIsStaffTooltipVisible(true);
  };

  const handleStaffTooltipMouseLeave = () => {
    hideStaffTooltipTimeout.current = window.setTimeout(() => {
      setIsStaffTooltipVisible(false);
    }, 100);
  };

  const handleDistributionTooltipMouseEnter = () => {
    if (hideDistributionTooltipTimeout.current) {
      clearTimeout(hideDistributionTooltipTimeout.current);
      hideDistributionTooltipTimeout.current = null;
    }
    setIsDistributionTooltipVisible(true);
  };

  const handleDistributionTooltipMouseLeave = () => {
    hideDistributionTooltipTimeout.current = window.setTimeout(() => {
      setIsDistributionTooltipVisible(false);
    }, 100);
  };

  // ==================== INLINE STYLES ====================

  const barStyle: React.CSSProperties = {
    width: isSticky ? undefined : '100vw',
    backgroundColor: 'var(--color-neutrals-2, #353945)',
    boxShadow: 'var(--shadow-depth-5, 0px 4px 20px 0px rgba(20, 20, 22, 0.06))',
    position: isSticky ? 'fixed' : 'relative',
    top: isSticky ? 0 : undefined,
    left: isSticky ? 0 : undefined,
    right: isSticky ? 0 : undefined,
    zIndex: isSticky ? 1010 : 10,
    transform: isSticky ? (isVisible ? 'translateY(0)' : 'translateY(-100%)') : undefined,
    opacity: isSticky ? (isVisible ? 1 : 0) : 1,
    pointerEvents: isSticky && !isVisible ? 'none' : 'auto',
    transition: isSticky ? 'transform var(--transition-normal, 250ms ease-in-out), opacity var(--transition-normal, 250ms ease-in-out)' : 'none',
    margin: isSticky ? undefined : 0,
    marginLeft: isSticky || isMobile ? undefined : 'calc(-50vw + 50%)',
    marginRight: isSticky || isMobile ? undefined : 'calc(-50vw + 50%)',
  };

  const contentStyle: React.CSSProperties = {
    maxWidth: 'var(--max-width-content, 1280px)',
    width: '100%',
    margin: '0 auto',
    padding: isMobile ? '10px 12px' : `${isSticky ? '16px' : '32px'} ${isNarrowScreen ? '16px' : '0'}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: isMobile ? '12px' : 'var(--spacing-3, 24px)',
    flexDirection: 'row',
    flexWrap: isMobile ? 'wrap' : 'nowrap',
    transition: 'padding var(--transition-normal, 250ms ease-in-out)',
  };

  const nameContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: isMobile ? '4px' : (isSticky ? '8px' : '16px'),
    flexShrink: isMobile ? 1 : 0,
    minWidth: isMobile ? 0 : undefined,
    flex: isMobile ? '1 1 0' : undefined,
    transition: 'gap var(--transition-normal, 250ms ease-in-out)',
  };

  const badgesRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  };

  const buyersGuideBadgeStyle: React.CSSProperties = {
    display: 'inline-flex',
    textDecoration: 'none',
    transition: 'opacity 0.2s ease',
    width: 'fit-content',
    opacity: isBuyersGuideHovered ? 0.8 : 1,
  };

  const localListingsBadgeStyle: React.CSSProperties = {
    display: 'inline-flex',
    textDecoration: 'none',
    transition: 'opacity var(--transition-fast, 150ms ease-in-out)',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: 0,
    width: 'fit-content',
    opacity: isLocalListingsHovered ? 0.8 : 1,
  };

  const vehicleNameStyle: React.CSSProperties = {
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontWeight: 700,
    fontSize: isMobile ? '24px' : (isSticky ? '24px' : '36px'),
    lineHeight: '1.2em',
    color: 'var(--color-white, #FFFFFF)',
    whiteSpace: isMobile ? 'normal' : 'nowrap',
    flexShrink: 0,
    textDecoration: 'none',
    transition: 'font-size var(--transition-normal, 250ms ease-in-out), opacity var(--transition-fast, all 150ms ease-in-out)',
    opacity: isVehicleNameHovered ? 0.8 : 1,
  };

  const ratingsStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: isMobile ? '8px' : 'var(--spacing-4, 32px)',
    flexShrink: 0,
    justifyContent: 'flex-end',
    flexWrap: 'nowrap',
  };

  const separatorStyle: React.CSSProperties = {
    width: '1px',
    height: isMobile ? '24px' : '40px',
    backgroundColor: 'var(--color-neutrals-4, #6E7481)',
    margin: isMobile ? '0 4px' : '0 var(--spacing-3, 24px)',
    flexShrink: 0,
  };

  const getRatingItemStyle = (type: string, index: number): React.CSSProperties => {
    const isYourRating = type === 'your-rating';
    const isVertical = type === 'user-reviews' || type === 'your-rating';
    const isMotortrend = type === 'motortrend';
    
    // Determine gap based on type
    const getGap = () => {
      if (isMobile) return '2px';
      if (isMotortrend) return '4px';
      if (isVertical) return '12px';
      return 'var(--spacing-2, 16px)';
    };
    
    return {
      display: isMobile && isYourRating ? 'none' : 'flex',
      alignItems: 'center',
      gap: getGap(),
      cursor: 'pointer',
      transition: 'opacity var(--transition-fast, all 150ms ease-in-out)',
      background: 'none',
      border: 'none',
      padding: 0,
      minWidth: 0,
      flexShrink: 0,
      height: 'fit-content',
      flexDirection: isMobile ? 'row' : (isVertical || isMotortrend ? 'column' : 'row'),
      textAlign: isMobile ? 'left' : undefined,
      fontSize: isMobile ? '12px' : undefined,
      opacity: hoveredItem === index ? 0.8 : 1,
    };
  };

  const ratingLabelWrapperStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-gap-xs, 4px)',
    flexShrink: 0,
    alignItems: 'center',
  };

  const ratingLabelStyle: React.CSSProperties = {
    color: 'var(--color-neutrals-8, #FCFCFD)',
    fontSize: isMobile ? '9px' : '12px',
    fontWeight: 500,
    lineHeight: 1.2,
    textDecoration: 'none',
  };

  const ratingIconStyle: React.CSSProperties = {
    flexShrink: 0,
    width: isMobile ? '18px' : '24px',
    height: isMobile ? '18px' : '24px',
    minWidth: isMobile ? '18px' : '24px',
    minHeight: isMobile ? '18px' : '24px',
    maxWidth: isMobile ? '18px' : '24px',
    maxHeight: isMobile ? '18px' : '24px',
    objectFit: 'contain',
    display: 'block',
    lineHeight: 1,
    margin: isMobile ? '0 0 2px 0' : 0,
    padding: 0,
    background: 'transparent',
    border: 'none',
    order: isMobile ? 1 : undefined,
  };

  const ratingValueStyle: React.CSSProperties = {
    color: 'var(--color-neutrals-8, #FCFCFD)',
    fontSize: isMobile ? '20px' : '32px',
    fontWeight: isMobile ? 600 : 500,
    fontFamily: "'Geist', system-ui, -apple-system, sans-serif",
    order: isMobile ? 2 : undefined,
    margin: isMobile ? 0 : undefined,
  };

  const ratingStarsStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    flexShrink: 0,
    justifyContent: 'center',
    order: isMobile ? 1 : undefined,
    margin: isMobile ? '0 0 2px 0' : undefined,
  };

  const starWrapperStyle: React.CSSProperties = {
    position: 'relative',
    width: '18px',
    height: '18px',
    flexShrink: 0,
  };

  const ratingTextStyle: React.CSSProperties = {
    fontFamily: "'Geist', sans-serif",
    color: 'var(--color-neutrals-7, #F4F5F6)',
    fontSize: isMobile ? '10px' : '14px',
    fontWeight: 400,
    lineHeight: 1.2,
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-gap-xs, 4px)',
    whiteSpace: 'nowrap',
    order: isMobile ? 3 : undefined,
  };

  const scoreRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-1, 8px)',
  };

  const scoreLargeStyle: React.CSSProperties = {
    color: 'var(--color-neutrals-8, #FCFCFD)',
    fontSize: isMobile ? '20px' : (isSticky ? '24px' : '36px'),
    fontWeight: 600,
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    lineHeight: 1,
    display: 'flex',
    alignItems: 'baseline',
    gap: isMobile ? '1px' : 'var(--spacing-gap-xs, 4px)',
    whiteSpace: 'nowrap',
    transition: 'font-size var(--transition-normal, 250ms ease-in-out)',
  };

  const scoreMaxStyle: React.CSSProperties = {
    color: 'var(--color-neutrals-4, #6E7481)',
    fontSize: isMobile ? '11px' : '18px',
    fontWeight: 400,
    lineHeight: 1,
  };

  const mtBadgeStyle: React.CSSProperties = {
    width: isMobile ? '14px' : '16px',
    height: isMobile ? '14px' : '16px',
    flexShrink: 0,
    objectFit: 'contain',
  };

  const motortrendTextStyle: React.CSSProperties = {
    color: 'var(--color-white, #FFFFFF)',
    fontSize: isMobile ? '11px' : '14px',
    fontWeight: 500,
    lineHeight: 1.2,
    whiteSpace: 'nowrap',
  };

  const ctaStyle: React.CSSProperties = {
    display: isMobile ? 'none' : 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--spacing-component-sm, 8px) var(--spacing-component-lg, 24px)',
    backgroundColor: isCtaHovered ? 'var(--color-primary-1, #E90C17)' : 'var(--color-primary-2, #FF3B42)',
    border: 'none',
    borderRadius: 'var(--border-radius-md, 8px)',
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontWeight: 600,
    fontSize: '16px',
    color: 'var(--color-neutrals-8, #FCFCFD)',
    cursor: 'pointer',
    transition: 'all var(--transition-fast, all 150ms ease-in-out)',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    transform: isCtaHovered ? 'translateY(-1px)' : undefined,
    boxShadow: isCtaHovered ? 'var(--shadow-button-hover, 0 4px 12px rgba(0,0,0,0.15))' : undefined,
  };

  const renderStarRating = (ratingValue: number, showHalfStars: boolean = true, singleStar: boolean = false) => {
    const normalizedRating = ratingValue / 20;
    const starSize = isMobile ? 14 : 18;
    const starsToShow = singleStar ? [1] : [1, 2, 3, 4, 5];

    return (
      <div style={ratingStarsStyle}>
        {starsToShow.map((star) => {
          // For single star mode, always show filled
          const isFilled = singleStar ? true : star <= normalizedRating;
          const isHalf = !singleStar && showHalfStars && star === Math.ceil(normalizedRating) && normalizedRating % 1 !== 0;

          return (
            <div key={star} style={{ ...starWrapperStyle, width: starSize, height: starSize }}>
              {/* Outline star */}
              <svg 
                width={starSize} 
                height={starSize} 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg" 
                style={{ position: 'absolute', top: 0, left: 0 }}
              >
                <path 
                  d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                  fill="none"
                  stroke="#33C4FF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {/* Filled star */}
              {isFilled && (
                <svg 
                  width={starSize} 
                  height={starSize} 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg" 
                  style={{ position: 'absolute', top: 0, left: 0 }}
                >
                  <path 
                    d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                    fill="#33C4FF"
                  />
                </svg>
              )}
              {isHalf && (
                <div style={{ position: 'absolute', top: 0, left: 0, width: '50%', height: '100%', overflow: 'hidden' }}>
                  <svg 
                    width={starSize} 
                    height={starSize} 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                      fill="#33C4FF"
                    />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderRatingItem = (rating: RatingItem, index: number) => {
    const isLast = index === ratings.length - 1;
    const isButton = rating.type === 'your-rating' || rating.onClick;
    const Component = isButton ? 'button' : 'div';
    const userRating = rating.type === 'your-rating' ? getUserRating(vehicleName) : 0;
    const displayRating = rating.type === 'your-rating' ? userRating : rating.value;

    let ratingDisplay: React.ReactNode = null;

    if (rating.type === 'motortrend') {
      if (rating.format === 'article') {
        ratingDisplay = (
          <>
            {rating.labelTop && rating.labelBottom && (
              <div style={ratingLabelWrapperStyle}>
                <span style={ratingLabelStyle}>{rating.labelTop}</span>
                <span style={ratingLabelStyle}>{rating.labelBottom}</span>
              </div>
            )}
            {rating.iconSrc && (
              <img
                src={rating.iconSrc}
                alt={rating.iconAlt || 'Rating icon'}
                style={ratingIconStyle}
              />
            )}
            <span style={ratingValueStyle}>
              {typeof displayRating === 'number' ? displayRating.toFixed(1) : displayRating}
            </span>
          </>
        );
      } else {
        ratingDisplay = (
          <>
            <div style={scoreRowStyle}>
              {rating.iconSrc && (
                <img
                  src={rating.iconSrc}
                  alt={rating.iconAlt || 'MT'}
                  style={mtBadgeStyle}
                />
              )}
              <div style={scoreLargeStyle}>
                {typeof displayRating === 'number' ? displayRating.toFixed(1) : displayRating}
                <span style={scoreMaxStyle}>/10</span>
              </div>
            </div>
            {!isMobile && <span style={motortrendTextStyle}>MotorTrend Rating</span>}
          </>
        );
      }
    } else if (rating.type === 'user-reviews') {
      const ratingValue = typeof displayRating === 'number' ? displayRating / 2 : parseFloat(String(displayRating)) / 2;
      const ratingForStars = ratingValue * 20;
      
      if (isMobile) {
        // Compact mobile: single star + value
        ratingDisplay = (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {renderStarRating(ratingForStars, false, true)}
            <span style={{ 
              color: 'var(--color-neutrals-8, #FCFCFD)', 
              fontSize: '14px', 
              fontWeight: 600,
              fontFamily: 'var(--font-heading, Poppins, sans-serif)',
            }}>
              {Number.isInteger(ratingValue) ? ratingValue : ratingValue.toFixed(1)}
            </span>
          </div>
        );
      } else {
      ratingDisplay = (
        <>
          {renderStarRating(ratingForStars, rating.showHalfStars !== false)}
          <div style={ratingTextStyle}>
            {rating.label || 'User Reviews'}{' '}
            <Badge variant="neutral" size="sm">
              {Number.isInteger(ratingValue) ? ratingValue : ratingValue.toFixed(1)}/5
            </Badge>
          </div>
        </>
      );
      }
    } else if (rating.type === 'your-rating') {
      const ratingValue = typeof displayRating === 'number' ? displayRating / 20 : 0;
      ratingDisplay = (
        <>
          {renderStarRating(displayRating as number, rating.showHalfStars !== false)}
          <div style={ratingTextStyle}>
            Rate This Vehicle{userRating > 0 && (
              <>
                {' '}
                <Badge variant="neutral" size="sm">
                  {Number.isInteger(ratingValue) ? ratingValue : ratingValue.toFixed(1)}/5
                </Badge>
              </>
            )}
          </div>
        </>
      );
    }

    const mouseHandlers: React.DOMAttributes<HTMLElement> = {
      onMouseEnter: () => setHoveredItem(index),
      onMouseLeave: () => setHoveredItem(null),
    };
    
    let tooltipContent: React.ReactNode = null;
    let isTooltipOpen = false;
    let onTooltipOpenChange: ((isOpen: boolean) => void) | undefined = undefined;
    let popoverClass = '';

    if (rating.type === 'motortrend' && staffRatingScores) {
      mouseHandlers.onMouseEnter = () => {
        setHoveredItem(index);
        handleStaffTooltipMouseEnter();
      };
      mouseHandlers.onMouseLeave = () => {
        setHoveredItem(null);
        handleStaffTooltipMouseLeave();
      };
      isTooltipOpen = isStaffTooltipVisible;
      onTooltipOpenChange = setIsStaffTooltipVisible;
      popoverClass = 'staff-rating-tooltip-popover';
      tooltipContent = (
        <StaffRatingTooltip
          overallRating={ratings.find(r => r.type === 'motortrend')?.value as number || 0}
          scores={staffRatingScores}
          onMouseEnter={handleStaffTooltipMouseEnter}
          onMouseLeave={handleStaffTooltipMouseLeave}
          onRequestClose={() => setIsStaffTooltipVisible(false)}
        />
      );
    } else if (rating.type === 'user-reviews' && ratingDistribution && totalReviews) {
      mouseHandlers.onMouseEnter = () => {
        setHoveredItem(index);
        handleDistributionTooltipMouseEnter();
      };
      mouseHandlers.onMouseLeave = () => {
        setHoveredItem(null);
        handleDistributionTooltipMouseLeave();
      };
      isTooltipOpen = isDistributionTooltipVisible;
      onTooltipOpenChange = setIsDistributionTooltipVisible;
      popoverClass = 'rating-tooltip-popover';
      tooltipContent = (
        <RatingDistributionTooltip
          distribution={ratingDistribution}
          totalReviews={totalReviews}
          onMouseEnter={handleDistributionTooltipMouseEnter}
          onMouseLeave={handleDistributionTooltipMouseLeave}
          onRequestClose={() => setIsDistributionTooltipVisible(false)}
        />
      );
    }

    const content = (
      <Component
        style={getRatingItemStyle(rating.type, index)}
        onClick={rating.onClick}
        {...mouseHandlers}
      >
        {ratingDisplay}
      </Component>
    );

    // Hide separator before "Rate This Vehicle" on mobile
    const showSeparator = !isLast && !(isMobile && ratings[index + 1]?.type === 'your-rating');

    return (
      <React.Fragment key={index}>
        {tooltipContent ? (
          <Popover
            content={tooltipContent}
            isOpen={isTooltipOpen}
            onOpenChange={onTooltipOpenChange}
            trigger="click"
            placement="bottom"
            className={popoverClass}
            variant="dark"
          >
            {content}
          </Popover>
        ) : (
          content
        )}
        {showSeparator && <div style={separatorStyle}></div>}
      </React.Fragment>
    );
  };

  return (
    <div
      ref={barRef}
      style={barStyle}
      className={className}
    >
      <div style={contentStyle}>
        <div style={nameContainerStyle}>
          <div style={badgesRowStyle}>
            {!isMobile && vehiclePath ? (
              <a
                href={vehiclePath}
                style={buyersGuideBadgeStyle}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(vehiclePath);
                }}
                onMouseEnter={() => setIsBuyersGuideHovered(true)}
                onMouseLeave={() => setIsBuyersGuideHovered(false)}
              >
                <ActionBadge
                  text="Buyers Guide"
                  variant="secondary"
                />
              </a>
            ) : !isMobile ? (
              <div style={buyersGuideBadgeStyle}>
                <Badge variant="info" size="sm">Buyers Guide</Badge>
              </div>
            ) : null}
            <div
              style={localListingsBadgeStyle}
              onMouseEnter={() => setIsLocalListingsHovered(true)}
              onMouseLeave={() => setIsLocalListingsHovered(false)}
            >
              <ActionBadge
                text={isMobile ? "Local Listings" : "See Local Listings"}
                variant="primary"
              onClick={(e) => {
                e.stopPropagation();
                const localListingsSection = document.getElementById('local-listings');
                if (localListingsSection) {
                  localListingsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                  // Fallback to vehicle inventory if section not found
                  navigate(`/vehicle-inventory?search=${encodeURIComponent(vehicleName)}`);
                }
              }}
              />
            </div>
            {ctaText && isMobile && !hideCtaButton && (
              <ActionBadge
                onClick={(e) => {
                  e.stopPropagation();
                  ctaOnClick?.();
                }}
                text={ctaText}
                variant="primary"
              />
            )}
          </div>
          <h1 style={{ margin: 0 }}>
          {vehicles && vehicles.length > 1 && onSelectVehicle ? (
            <Popover
              trigger="click"
              placement="bottom"
              isOpen={isVehicleDropdownOpen}
              onOpenChange={setIsVehicleDropdownOpen}
              closeOnOutsideClick={true}
              variant="dark"
              showArrow={true}
              content={
                <div style={{ padding: '8px 0', minWidth: '220px' }}>
                  {vehicles.map((v, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        onSelectVehicle(i);
                        setIsVehicleDropdownOpen(false);
                      }}
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: '10px 16px',
                        textAlign: 'left',
                        background: selectedVehicleIndex === i ? 'var(--color-neutrals-3)' : 'transparent',
                        border: 'none',
                        color: 'var(--color-white)',
                        fontFamily: 'var(--font-body, Geist, sans-serif)',
                        fontSize: '14px',
                        cursor: 'pointer',
                      }}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              }
            >
              <div
                style={{
                  ...vehicleNameStyle,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                }}
                onMouseEnter={() => setIsVehicleNameHovered(true)}
                onMouseLeave={() => setIsVehicleNameHovered(false)}
              >
                {vehicles[selectedVehicleIndex]?.name ?? vehicleName}
                <Icon name="keyboard_arrow_down" size={24} style={{ color: 'var(--color-white)', flexShrink: 0 }} />
              </div>
            </Popover>
          ) : vehiclePath ? (
            <Link 
              to={vehiclePath} 
              style={vehicleNameStyle}
              onMouseEnter={() => setIsVehicleNameHovered(true)}
              onMouseLeave={() => setIsVehicleNameHovered(false)}
            >
              {vehicleName}
            </Link>
          ) : (
              <span style={vehicleNameStyle}>
              {vehicleName}
              </span>
          )}
          </h1>
        </div>
        <div style={ratingsStyle}>
          {ratings.map((rating, index) => renderRatingItem(rating, index))}
        </div>
        {ctaText && !hideCtaButton && !isMobile && (
          <button
            style={ctaStyle}
            onClick={ctaOnClick}
            onMouseEnter={() => setIsCtaHovered(true)}
            onMouseLeave={() => setIsCtaHovered(false)}
          >
            {ctaText}
          </button>
        )}
      </div>
    </div>
  );
};

export default StickyRateBar;
