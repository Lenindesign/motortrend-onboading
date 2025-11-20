/**
 * Rating Modal Component
 * Modal overlay for rating vehicles with 1-10 star selection
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './RatingModal.css';
import Icon from '../Icon';

export interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRate: (rating: number) => void;
  vehicleName: string;
  currentRating?: number;
  onRateAndReview?: (rating: number) => void;
  onClear?: () => void;
  hasExistingReview?: boolean; // Whether the user has already written a review
}

export const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  onClose,
  onRate,
  vehicleName,
  currentRating = 0,
  onRateAndReview,
  onClear,
  hasExistingReview = false
}) => {
  const [selectedRating, setSelectedRating] = useState(currentRating);
  const [hoveredRating, setHoveredRating] = useState(0);

  // Sync selectedRating with currentRating when modal opens or currentRating changes
  useEffect(() => {
    if (isOpen) {
      setSelectedRating(currentRating);
    }
  }, [isOpen, currentRating]);

  const ratingLabels: { [key: number]: string } = {
    10: "Awful – Never again",
    20: "Poor – Major regrets",
    30: "Below Average – Disappointed",
    40: "Fair – Just okay",
    50: "Average – Meets basic needs",
    60: "Decent – Would consider again",
    70: "Good – Happy overall",
    80: "Very Good – Impressive value",
    90: "Excellent – Love this car",
    100: "Perfect – Dream car!"
  };

  const handleStarClick = (rating: number) => {
    setSelectedRating(rating);
  };

  const handleStarHover = (rating: number) => {
    setHoveredRating(rating);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  const handleSubmit = () => {
    // If there's an existing rating, clear it
    if (currentRating > 0 && onClear) {
      onClear();
      setSelectedRating(0);
      onClose();
    } else if (selectedRating > 0) {
      // Submit a new rating
      onRate(selectedRating);
      onClose();
    }
  };

  const handleRateAndReview = () => {
    if (onRateAndReview) {
      onRateAndReview(selectedRating);
    } else {
      // Default behavior: just submit the rating if handler not provided
      onRate(selectedRating);
    }
    onClose();
  };

  const handleCancel = () => {
    setSelectedRating(currentRating);
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="rating-modal-overlay" onClick={handleOverlayClick}>
      <div className="rating-modal">
        <div className="rating-modal__header">
          <div className="rating-modal__title-section">
            <div className="rating-modal__main-rating">
              <div className="rating-modal__score-star">
                <img
                  src="https://d2kde5ohu8qb21.cloudfront.net/files/691bde547554840002bab60c/star.svg"
                  alt="Rating star"
                  className="rating-modal__score-star-icon"
                />
                <span className="rating-modal__rating-number-large">
                  {hoveredRating > 0 ? hoveredRating / 20 : (selectedRating > 0 ? selectedRating / 20 : '0')}
                </span>
              </div>
            </div>
            <div className="rating-modal__title-wrapper">
              <h2 className="rating-modal__title">RATE THIS</h2>
              <div className="rating-modal__info-icon-wrapper">
                <img
                  src="https://d2kde5ohu8qb21.cloudfront.net/files/6918b2a80074bb0002840bac/demography.svg"
                  alt="Community Guidelines"
                  className="rating-modal__info-icon"
                  onError={(e) => {
                    console.error('Failed to load community guidelines icon');
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="rating-modal__info-tooltip">
                  1–5 Rating Guide<br />
                  0.5–1: Poor · 1.5–2: Below average · 2.5–3: Average · 3.5–4: Good · 4.5–5: Excellent.<br /><br />
                  Overall ratings reflect factors like review recency, verified ownership, and trust signals — not just simple averages.<br /><br />
                  <Link to="/article/how-to-rate-vehicles" className="rating-modal__tooltip-link" onClick={(e) => e.stopPropagation()}>
                    Read Our Rating Overview
                  </Link>
                </div>
              </div>
            </div>
            <p className="rating-modal__vehicle-name">{vehicleName}</p>
          </div>
          <button
            className="rating-modal__close-btn"
            onClick={handleCancel}
            aria-label="Close rating modal"
          >
            <Icon name="close" size={24} />
          </button>
        </div>

        <div className="rating-modal__content">
          <div className="rating-modal__stars">
            {Array.from({ length: 5 }, (_, index) => {
              const starPosition = index + 1;
              const oddRating = starPosition * 20 - 10; // 10, 30, 50, 70, 90
              const evenRating = starPosition * 20; // 20, 40, 60, 80, 100

              // Determine if this star should show as full, half, or empty
              const isOddSelected = oddRating <= selectedRating;
              const isEvenSelected = evenRating <= selectedRating;
              const isOddHovered = oddRating <= hoveredRating;
              const isEvenHovered = evenRating <= hoveredRating;

              // Show half star if odd is selected/hovered but even is not
              const showHalfStar = (isOddSelected && !isEvenSelected) || (hoveredRating > 0 && isOddHovered && !isEvenHovered && !isEvenSelected);
              // Show full star if even is selected, or if hovering over even (and odd is already selected or we're hovering over even)
              const showFullStar = isEvenSelected || (hoveredRating > 0 && isEvenHovered);

              const showTooltipOdd = hoveredRating > 0 && hoveredRating === oddRating;
              const showTooltipEven = hoveredRating > 0 && hoveredRating === evenRating;

              return (
                <div key={starPosition} className="rating-modal__star-container">
                  {showTooltipOdd && (
                    <div className={`rating-modal__tooltip ${starPosition <= 2 ? 'rating-modal__tooltip--left' : starPosition >= 4 ? 'rating-modal__tooltip--right' : ''}`}>
                      {ratingLabels[oddRating]}
                    </div>
                  )}
                  {showTooltipEven && (
                    <div className={`rating-modal__tooltip ${starPosition <= 2 ? 'rating-modal__tooltip--left' : starPosition >= 4 ? 'rating-modal__tooltip--right' : ''}`}>
                      {ratingLabels[evenRating]}
                    </div>
                  )}
                  <div className="rating-modal__star-wrapper">
                    {/* Visual star display */}
                    <div className="rating-modal__star-visual">
                      {showHalfStar ? (
                        <img
                          src="https://d2kde5ohu8qb21.cloudfront.net/files/691c8ba6a619270002cb5797/half-star.svg"
                          alt={`${oddRating} star rating`}
                          className="rating-modal__star-icon"
                        />
                      ) : showFullStar ? (
                        <img
                          src="https://d2kde5ohu8qb21.cloudfront.net/files/691bde547554840002bab60c/star.svg"
                          alt={`${evenRating} star rating`}
                          className="rating-modal__star-icon"
                        />
                      ) : (
                        <img
                          src="https://d2kde5ohu8qb21.cloudfront.net/files/691bde5264217700021d6b71/star-stroke.svg"
                          alt="Empty star"
                          className="rating-modal__star-icon"
                        />
                      )}
                    </div>
                    {/* Left half clickable area for odd rating */}
                    <button
                      className={`rating-modal__star-click rating-modal__star-click--left ${isOddSelected || (hoveredRating > 0 && isOddHovered) ? 'rating-modal__star--active' : ''}`}
                      onClick={() => handleStarClick(oddRating)}
                      onMouseEnter={() => handleStarHover(oddRating)}
                      onMouseLeave={handleStarLeave}
                      aria-label={`Rate ${oddRating} out of 100`}
                    />
                    {/* Right half clickable area for even rating */}
                    <button
                      className={`rating-modal__star-click rating-modal__star-click--right ${isEvenSelected || (hoveredRating > 0 && isEvenHovered) ? 'rating-modal__star--active' : ''}`}
                      onClick={() => handleStarClick(evenRating)}
                      onMouseEnter={() => handleStarHover(evenRating)}
                      onMouseLeave={handleStarLeave}
                      aria-label={`Rate ${evenRating} out of 100`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rating-modal__footer">
          <button
            className="rating-modal__btn rating-modal__btn--submit"
            onClick={handleSubmit}
            disabled={selectedRating === 0 && currentRating === 0}
          >
            {currentRating > 0 ? 'CLEAR RATING' : 'RATE'}
          </button>
          <button
            className="rating-modal__btn rating-modal__btn--rate-and-review"
            onClick={handleRateAndReview}
            disabled={selectedRating === 0}
          >
            {hasExistingReview ? 'EDIT YOUR REVIEW' : 'WRITE A REVIEW'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
