/**
 * Rating Grid Component
 * Displays ratings in a 3-column, 2-row grid layout
 * Row 1: MT Logo + Score | User Review Stars | Rate This Vehicle Stars
 * Row 2: "MotorTrend Rating" | "User Reviews" + Score | "Rate This Vehicle"
 */

import React, { useState } from 'react';
import './RatingGrid.css';

export interface RatingGridProps {
  motorTrendRating: number; // 0-10 scale
  userReviewsRating: number; // 0-5 scale
  userReviewsCount?: number;
  onRateClick?: () => void;
  className?: string;
}

export const RatingGrid: React.FC<RatingGridProps> = ({
  motorTrendRating,
  userReviewsRating,
  userReviewsCount: _userReviewsCount = 0,
  onRateClick,
  className = ''
}) => {
  const [userRating, setUserRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);

  // Render filled/empty stars for user reviews (5-star scale)
  const renderStars = (rating: number, interactive: boolean = false) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      const isFilled = interactive 
        ? i <= (hoverRating || userRating)
        : i <= fullStars || (i === fullStars + 1 && hasHalfStar);

      stars.push(
        <svg
          key={i}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill={isFilled ? 'var(--color-primary-1)' : 'none'}
          stroke={isFilled ? 'var(--color-primary-1)' : 'var(--color-neutrals-5)'}
          strokeWidth="2"
          className={interactive ? 'rating-grid__star--interactive' : ''}
          onMouseEnter={() => interactive && setHoverRating(i)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          onClick={() => {
            if (interactive) {
              setUserRating(i);
              onRateClick?.();
            }
          }}
          style={{ cursor: interactive ? 'pointer' : 'default' }}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
    }

    return stars;
  };

  return (
    <div className={`rating-grid ${className}`}>
      {/* Row 1: Icons and Scores */}
      <div className="rating-grid__row rating-grid__row--top">
        {/* Column 1: MotorTrend Logo + Score */}
        <div className="rating-grid__cell rating-grid__cell--motortrend">
          <img
            src="https://www.motortrend.com/files/692374f1d13f5100022ddf61/mticon.svg"
            alt="MotorTrend"
            className="rating-grid__mt-logo"
          />
          <div className="rating-grid__score">
            <span className="rating-grid__score-value">{motorTrendRating.toFixed(1)}</span>
            <span className="rating-grid__score-max">/10</span>
          </div>
        </div>

        {/* Column 2: User Review Stars */}
        <div className="rating-grid__cell rating-grid__cell--user-reviews">
          <div className="rating-grid__stars">
            {renderStars(userReviewsRating, false)}
          </div>
        </div>

        {/* Column 3: Rate This Vehicle Stars */}
        <div className="rating-grid__cell rating-grid__cell--rate">
          <div className="rating-grid__stars">
            {renderStars(userRating, true)}
          </div>
        </div>
      </div>

      {/* Row 2: Labels */}
      <div className="rating-grid__row rating-grid__row--bottom">
        {/* Column 1: MotorTrend Rating Label */}
        <div className="rating-grid__cell rating-grid__cell--label">
          <span className="rating-grid__label">MotorTrend Rating</span>
        </div>

        {/* Column 2: User Reviews Label + Score */}
        <div className="rating-grid__cell rating-grid__cell--label">
          <span className="rating-grid__label">User Reviews</span>
          <span className="rating-grid__score-badge">{userReviewsRating.toFixed(1)}/5</span>
        </div>

        {/* Column 3: Rate This Vehicle Label */}
        <div className="rating-grid__cell rating-grid__cell--label">
          <span className="rating-grid__label">Rate This Vehicle</span>
        </div>
      </div>
    </div>
  );
};

export default RatingGrid;



