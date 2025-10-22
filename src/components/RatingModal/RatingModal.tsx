/**
 * Rating Modal Component
 * Modal overlay for rating vehicles with 1-10 star selection
 */

import React, { useState } from 'react';
import './RatingModal.css';
import Icon from '../Icon';

export interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRate: (rating: number) => void;
  vehicleName: string;
  currentRating?: number;
}

export const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  onClose,
  onRate,
  vehicleName,
  currentRating = 0
}) => {
  const [selectedRating, setSelectedRating] = useState(currentRating);
  const [hoveredRating, setHoveredRating] = useState(0);

  const ratingLabels = {
    1: "Awful – Never again",
    2: "Poor – Major regrets", 
    3: "Below Average – Disappointed",
    4: "Fair – Just okay",
    5: "Average – Meets basic needs",
    6: "Decent – Would consider again",
    7: "Good – Happy overall",
    8: "Very Good – Impressive value",
    9: "Excellent – Love this car",
    10: "Perfect – Dream car!"
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
    onRate(selectedRating);
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
                  src="https://d2kde5ohu8qb21.cloudfront.net/files/68f66c095d4ae300022a2b0e/starbluesolid.svg"
                  alt="Rating star"
                  className="rating-modal__score-star-icon"
                />
                <span className="rating-modal__rating-number-large">
                  {selectedRating > 0 ? selectedRating : '0'}
                </span>
              </div>
            </div>
            <h2 className="rating-modal__title">RATE THIS</h2>
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
            {Array.from({ length: 10 }, (_, index) => {
              const starNumber = index + 1;
              const isSelected = starNumber <= selectedRating;
              const isHovered = starNumber <= hoveredRating;
              const isActive = isSelected || (hoveredRating > 0 && isHovered);
              const showTooltip = hoveredRating > 0 && starNumber === hoveredRating;

              return (
                <div key={starNumber} className="rating-modal__star-container">
                  {showTooltip && (
                    <div className="rating-modal__tooltip">
                      {ratingLabels[starNumber as keyof typeof ratingLabels]}
                    </div>
                  )}
                  <button
                    className={`rating-modal__star ${isActive ? 'rating-modal__star--active' : ''}`}
                    onClick={() => handleStarClick(starNumber)}
                    onMouseEnter={() => handleStarHover(starNumber)}
                    onMouseLeave={handleStarLeave}
                    aria-label={`Rate ${starNumber} star${starNumber > 1 ? 's' : ''}`}
                  >
                    <img 
                      src={isActive ? 'https://d2kde5ohu8qb21.cloudfront.net/files/68f66c095d4ae300022a2b0e/starbluesolid.svg' : 'https://d2kde5ohu8qb21.cloudfront.net/files/68f66c095d4ae300022a2b10/starbluenotsolid.svg'}
                      alt={`${starNumber} star rating`}
                      className="rating-modal__star-icon"
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rating-modal__footer">
          <button 
            className="rating-modal__btn rating-modal__btn--submit"
            onClick={handleSubmit}
            disabled={selectedRating === 0}
          >
            RATE
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
