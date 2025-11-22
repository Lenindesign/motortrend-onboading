import React from 'react';
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
  onRequestClose?: () => void;
  // Legacy props
  isVisible?: boolean;
  triggerRef?: React.RefObject<HTMLElement | null>;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const StaffRatingTooltip: React.FC<StaffRatingTooltipProps> = ({
  overallRating,
  scores,
  onRequestClose,
  onMouseEnter,
  onMouseLeave
}) => {
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
          <div className="staff-rating-tooltip__score">{score.toFixed(1)}</div>
        </div>
      );
    }
  });

  return (
    <div 
      className="staff-rating-tooltip__inner"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="staff-rating-tooltip__header">
        <div className="staff-rating-tooltip__title">MotorTrend</div>
        <div className="staff-rating-tooltip__total">{typeof overallRating === 'number' ? overallRating.toFixed(1) : overallRating}/10</div>
      </div>
      <div className="staff-rating-tooltip__content">
        {ratingBars}
      </div>
      <div className="staff-rating-tooltip__footer">
        <a
          href="#staff-rating"
          className="staff-rating-tooltip__link"
          onClick={() => {
            if (onRequestClose) {
              onRequestClose();
            }
          }}
        >
          See Full MotorTrend Review
        </a>
      </div>
    </div>
  );
};
