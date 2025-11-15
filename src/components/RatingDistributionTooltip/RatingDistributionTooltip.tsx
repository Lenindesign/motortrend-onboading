import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './RatingDistributionTooltip.css';

export interface RatingDistributionData {
  [rating: number]: number; // rating (1-10) -> percentage
}

export interface RatingDistributionTooltipProps {
  distribution: RatingDistributionData;
  totalReviews: number;
  isVisible: boolean;
  triggerRef?: React.RefObject<HTMLElement | null>;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onRequestClose?: () => void;
}

export const RatingDistributionTooltip: React.FC<RatingDistributionTooltipProps> = ({
  distribution,
  totalReviews,
  isVisible,
  triggerRef,
  onMouseEnter,
  onMouseLeave,
  onRequestClose
}) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isVisible || !triggerRef?.current) return;

    const updatePosition = () => {
      if (triggerRef?.current) {
        const triggerRect = triggerRef.current.getBoundingClientRect();
        
        // Use getBoundingClientRect() for fixed positioning (viewport coordinates)
        setPosition({
          top: triggerRect.bottom + 4,
          left: triggerRect.left + triggerRect.width / 2
        });
      }
    };

    // Initial position calculation
    updatePosition();

    // Update position on scroll and resize
    window.addEventListener('scroll', updatePosition, { passive: true });
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isVisible, triggerRef]);

  console.log('Tooltip render:', { isVisible, totalReviews, distribution });
  if (!isVisible) return null;

  // Generate rating distribution data for 1-10 stars
  const ratingBars = [];
  for (let rating = 10; rating >= 1; rating--) {
    const percentage = distribution[rating] || 0;
    
    ratingBars.push(
      <div key={rating} className="rating-tooltip__bar-row">
        <div className="rating-tooltip__rating-label">{rating}</div>
        <div className="rating-tooltip__bar-container">
          <div 
            className="rating-tooltip__bar-fill"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="rating-tooltip__percentage">{percentage}%</div>
      </div>
    );
  }

  const tooltipContent = (
    <div 
      ref={tooltipRef}
      className={`rating-tooltip rating-tooltip--portal ${isVisible ? 'rating-tooltip--visible' : ''}`}
      style={{
        position: 'fixed',
        top: position.top,
        left: position.left,
        transform: 'translateX(-50%)',
        zIndex: 99999
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="rating-tooltip__header">
        <div className="rating-tooltip__title">Rating Distribution</div>
        <div className="rating-tooltip__total">{totalReviews} reviews</div>
      </div>
      <div className="rating-tooltip__content">
        {ratingBars}
      </div>
      <div className="rating-tooltip__footer">
        <a
          href="#user-reviews"
          className="rating-tooltip__link"
          onClick={() => {
            onRequestClose?.();
          }}
        >
          See User Reviews
        </a>
      </div>
    </div>
  );

  return createPortal(tooltipContent, document.body);
};
