import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './StaffRatingTooltip.css';

export interface StaffRatingScores {
  performance?: number;
  efficiency?: number;
  tech?: number;
  value?: number;
}

export interface StaffRatingTooltipProps {
  overallRating: number;
  scores: StaffRatingScores;
  isVisible: boolean;
  triggerRef?: React.RefObject<HTMLElement | null>;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onRequestClose?: () => void;
}

export const StaffRatingTooltip: React.FC<StaffRatingTooltipProps> = ({
  overallRating,
  scores,
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

  if (!isVisible) return null;

  // Category labels mapping
  const categoryLabels: { [key: string]: string } = {
    performance: 'Performance',
    efficiency: 'Efficiency/Range',
    tech: 'Tech/Innovation',
    value: 'Value'
  };

  // Generate rating bars for each category
  const ratingBars: React.ReactElement[] = [];
  const categories = ['performance', 'efficiency', 'tech', 'value'] as const;
  
  categories.forEach((category) => {
    const score = scores[category];
    if (score !== undefined) {
      const percentage = (score / 10) * 100;
      ratingBars.push(
        <div key={category} className="staff-rating-tooltip__bar-row">
          <div className="staff-rating-tooltip__rating-label">
            {categoryLabels[category]}
          </div>
          <div className="staff-rating-tooltip__bar-container">
            <div 
              className="staff-rating-tooltip__bar-fill"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="staff-rating-tooltip__score">{score}</div>
        </div>
      );
    }
  });

  const tooltipContent = (
    <div 
      ref={tooltipRef}
      className={`staff-rating-tooltip staff-rating-tooltip--portal ${isVisible ? 'staff-rating-tooltip--visible' : ''}`}
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
      <div className="staff-rating-tooltip__header">
        <div className="staff-rating-tooltip__title">Staff Rating</div>
        <div className="staff-rating-tooltip__total">{overallRating}/10</div>
      </div>
      <div className="staff-rating-tooltip__content">
        {ratingBars}
      </div>
      <div className="staff-rating-tooltip__footer">
        <a
          href="#staff-rating"
          className="staff-rating-tooltip__link"
          onClick={() => {
            onRequestClose?.();
          }}
        >
          See Full Staff Review
        </a>
      </div>
    </div>
  );

  return createPortal(tooltipContent, document.body);
};

