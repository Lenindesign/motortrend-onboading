/**
 * StickyRateBar Component
 * A reusable sticky navigation bar for displaying vehicle ratings
 * Supports MotorTrend ratings, User Reviews, and Your Rating with half-star display
 */

import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRating } from '../../contexts/RatingContext';
import { StaffRatingTooltip } from '../StaffRatingTooltip';
import { RatingDistributionTooltip } from '../RatingDistributionTooltip';
import { Badge, Button } from '../../design-system/components';
import { ActionBadge } from '../molecules/ActionBadge';
import { Popover } from '../atoms/Popover';
import './StickyRateBar.css';

export interface RatingItem {
  type: 'motortrend' | 'user-reviews' | 'your-rating';
  value: number | string; // Rating value (0-100 for your-rating, 0-10 for motortrend, 0-10 for user-reviews)
  onClick?: () => void;
  label?: string; // For user-reviews: "User Reviews"
  showStars?: boolean; // For user-reviews and your-rating
  showHalfStars?: boolean; // Enable half-star display
  iconSrc?: string; // Icon URL for motortrend type
  iconAlt?: string; // Alt text for icon
  labelTop?: string; // For Article format: "Expert" or "Community"
  labelBottom?: string; // For Article format: "Rating" or "Rating (count)"
  format?: 'vehicle-details' | 'article'; // Display format
}

export interface StickyRateBarProps {
  vehicleName: string;
  vehiclePath?: string; // Optional link path for vehicle name
  ratings: RatingItem[];
  ctaText?: string; // Call-to-action button text
  ctaOnClick?: () => void;
  isVisible: boolean;
  isSticky?: boolean; // Whether the bar should be fixed (sticky) or static
  className?: string;
  barRef?: React.RefObject<HTMLDivElement | null>; // Ref for scroll detection
  // Tooltip data
  staffRatingScores?: { performance?: number; efficiency?: number; tech?: number; value?: number };
  ratingDistribution?: { [key: number]: number };
  totalReviews?: number;
  hideCtaButton?: boolean;
}

const StickyRateBar: React.FC<StickyRateBarProps> = ({
  vehicleName,
  vehiclePath,
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
  console.log('[StickyRateBar] Received totalReviews:', totalReviews);
  console.log('[StickyRateBar] Received ratingDistribution:', ratingDistribution);
  const navigate = useNavigate();
  const { getUserRating } = useRating();
  const [isStaffTooltipVisible, setIsStaffTooltipVisible] = useState(false);
  const [isDistributionTooltipVisible, setIsDistributionTooltipVisible] = useState(false);
  // Refs removed as Popover handles positioning
  const hideStaffTooltipTimeout = useRef<number | null>(null);
  const hideDistributionTooltipTimeout = useRef<number | null>(null);

  // Tooltip handlers for staff rating
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

  // Tooltip handlers for distribution rating
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

  const renderStarRating = (ratingValue: number, showHalfStars: boolean = true) => {
    // Convert rating to 0-5 scale
    const normalizedRating = ratingValue / 20; // Assuming 0-100 scale input

    return (
      <div className="sticky-rate-bar__rating-stars">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= normalizedRating;
          const isHalf = showHalfStars && star === Math.ceil(normalizedRating) && normalizedRating % 1 !== 0;

          return (
            <div key={star} className={`sticky-rate-bar__star-wrapper ${isHalf ? 'sticky-rate-bar__star-wrapper--half' : ''}`}>
              {/* Outline star */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sticky-rate-bar__rating-star sticky-rate-bar__rating-star--outline">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                  fill="none"
                  stroke="#33C4FF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {/* Filled star (full or half) */}
              {isFilled && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sticky-rate-bar__rating-star sticky-rate-bar__rating-star--filled">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                    fill="#33C4FF"
                  />
                </svg>
              )}
              {isHalf && (
                <div className="sticky-rate-bar__star-half-fill">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sticky-rate-bar__rating-star">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
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

    // Handle different rating formats
    let ratingDisplay: React.ReactNode = null;

    if (rating.type === 'motortrend') {
      if (rating.format === 'article') {
        // Article format: Label wrapper + Icon + Value
        ratingDisplay = (
          <>
            {rating.labelTop && rating.labelBottom && (
              <div className="sticky-rate-bar__rating-label-wrapper">
                <span className="sticky-rate-bar__rating-label-top">{rating.labelTop}</span>
                <span className="sticky-rate-bar__rating-label-bottom">{rating.labelBottom}</span>
              </div>
            )}
            {rating.iconSrc && (
              <img
                src={rating.iconSrc}
                alt={rating.iconAlt || 'Rating icon'}
                className="sticky-rate-bar__rating-icon"
              />
            )}
            <span className="sticky-rate-bar__rating-value">
              {typeof displayRating === 'number' ? displayRating.toFixed(1) : displayRating}
            </span>
          </>
        );
      } else {
        // VehicleDetails format: Icon + Score on top, Label below
        ratingDisplay = (
          <>
            <div className="sticky-rate-bar__rating-score-row">
              {rating.iconSrc && (
                <img
                  src={rating.iconSrc}
                  alt={rating.iconAlt || 'MT'}
                  className="sticky-rate-bar__rating-mt-badge"
                />
              )}
              <div className="sticky-rate-bar__rating-score-large">
                {typeof displayRating === 'number' ? displayRating.toFixed(1) : displayRating}
                <span className="sticky-rate-bar__rating-score-max">/10</span>
              </div>
            </div>
            <span className="sticky-rate-bar__rating-motortrend-text">MotorTrend Rating</span>
          </>
        );
      }
    } else if (rating.type === 'user-reviews') {
      // User Reviews: Stars + Text
      // Rating is in 0-10 scale, convert to 0-5 for display
      const ratingValue = typeof displayRating === 'number' ? displayRating / 2 : parseFloat(String(displayRating)) / 2;
      // Convert to 0-100 scale for renderStarRating (which expects 0-100 and divides by 20)
      const ratingForStars = ratingValue * 20;
      ratingDisplay = (
        <>
          {renderStarRating(ratingForStars, rating.showHalfStars !== false)}
          <div className="sticky-rate-bar__rating-text">
            {rating.label || 'User Reviews'}{' '}
            <Badge variant="neutral" size="sm">
              {Number.isInteger(ratingValue) ? ratingValue : ratingValue.toFixed(1)}/5
            </Badge>
          </div>
        </>
      );
    } else if (rating.type === 'your-rating') {
      // Your Rating: Stars + Text
      const ratingValue = typeof displayRating === 'number' ? displayRating / 20 : 0;
      ratingDisplay = (
        <>
          {renderStarRating(displayRating as number, rating.showHalfStars !== false)}
          <div className="sticky-rate-bar__rating-text">
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

    const itemClasses = [
      'sticky-rate-bar__rating-item',
      rating.type === 'motortrend' ? 'sticky-rate-bar__rating-item--motortrend' : '',
      rating.type === 'user-reviews' || rating.type === 'your-rating' ? 'sticky-rate-bar__rating-item--vertical' : '',
      rating.type === 'your-rating' ? 'sticky-rate-bar__rate-btn' : ''
    ].filter(Boolean).join(' ');

    // Mouse handlers for tooltips
    const mouseHandlers: React.DOMAttributes<HTMLElement> = {};
    let tooltipContent: React.ReactNode = null;
    let isTooltipOpen = false;
    let onTooltipOpenChange: ((isOpen: boolean) => void) | undefined = undefined;
    let popoverClass = '';

    if (rating.type === 'motortrend' && staffRatingScores) {
      mouseHandlers.onMouseEnter = handleStaffTooltipMouseEnter;
      mouseHandlers.onMouseLeave = handleStaffTooltipMouseLeave;
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
      mouseHandlers.onMouseEnter = handleDistributionTooltipMouseEnter;
      mouseHandlers.onMouseLeave = handleDistributionTooltipMouseLeave;
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
        className={itemClasses}
        onClick={rating.onClick}
        {...mouseHandlers}
      >
        {ratingDisplay}
      </Component>
    );

    return (
      <React.Fragment key={index}>
        {tooltipContent ? (
          <Popover
            content={tooltipContent}
            isOpen={isTooltipOpen}
            onOpenChange={onTooltipOpenChange}
            trigger="click" // Disabled internal hover logic, managed by state
            placement="bottom"
            className={popoverClass}
          >
            {content}
          </Popover>
        ) : (
          content
        )}
        {!isLast && <div className="sticky-rate-bar__rating-separator"></div>}
      </React.Fragment>
    );
  };

  return (
    <div
      ref={barRef}
      className={`sticky-rate-bar ${isSticky ? 'sticky-rate-bar--sticky' : 'sticky-rate-bar--static'} ${isVisible ? 'sticky-rate-bar--visible' : ''} ${className}`}
    >
      <div className="sticky-rate-bar__content">
        <div className="sticky-rate-bar__name-container">
          <div className="sticky-rate-bar__badges-row">
            {vehiclePath ? (
              <ActionBadge
                text="Buyers Guide"
                variant="secondary"
                href={vehiclePath}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(vehiclePath);
                }}
                className="sticky-rate-bar__buyers-guide-badge"
              />
            ) : (
              <div className="sticky-rate-bar__buyers-guide-badge">
                <Badge variant="info" size="sm">Buyers Guide</Badge>
              </div>
            )}
            {ctaText && (
              <ActionBadge
                className="sticky-rate-bar__cta-badge"
                onClick={(e) => {
                  e.stopPropagation();
                  ctaOnClick?.();
                }}
                text={ctaText}
                variant="primary"
              />
            )}
          </div>
        {vehiclePath ? (
          <Link to={vehiclePath} className="sticky-rate-bar__vehicle-name sticky-rate-bar__vehicle-name--link">
            {vehicleName}
          </Link>
        ) : (
          <div className="sticky-rate-bar__vehicle-name">
            {vehicleName}
          </div>
        )}
        </div>
        <div className="sticky-rate-bar__ratings">
          {ratings.map((rating, index) => renderRatingItem(rating, index))}
        </div>
        {ctaText && !hideCtaButton && (
          <Button
            className="sticky-rate-bar__cta sticky-rate-bar__cta--desktop"
            color="primary"
            onClick={ctaOnClick}
          >
            {ctaText}
          </Button>
        )}
      </div>
    </div>
  );
};

export default StickyRateBar;
