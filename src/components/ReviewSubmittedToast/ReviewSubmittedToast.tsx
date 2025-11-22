/**
 * Review Submitted Modal Component
 * Success notification modal that appears after submitting a review
 * Now uses ModalShell atom for consistent overlay and shadow
 */

import React from 'react';
import { ModalShell } from '../atoms/ModalShell';
import './ReviewSubmittedToast.css';
import Icon from '../Icon';

export interface ReviewSubmittedToastProps {
  isVisible: boolean;
  onClose: () => void;
  onViewReview: () => void;
  vehicleName: string;
}

export const ReviewSubmittedToast: React.FC<ReviewSubmittedToastProps> = ({
  isVisible,
  onClose,
  onViewReview,
  vehicleName
}) => {
  return (
    <ModalShell
      isOpen={isVisible}
      onClose={onClose}
      maxWidth="480px"
      className="review-modal"
    >
      <div className="review-modal__content">
        <div className="review-modal__icon">
          <Icon name="check_circle" size={48} />
        </div>
        <div className="review-modal__message">
          <h2 className="review-modal__title">Review added!</h2>
          <p className="review-modal__subtitle">Your review for {vehicleName} has been successfully submitted.</p>
        </div>
        <div className="review-modal__actions">
          <button 
            className="review-modal__button review-modal__button--primary"
            onClick={onViewReview}
          >
            View Review
          </button>
          <button 
            className="review-modal__button review-modal__button--secondary"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <button 
          className="review-modal__close"
          onClick={onClose}
          aria-label="Close notification"
        >
          <Icon name="close" size={24} />
        </button>
      </div>
    </ModalShell>
  );
};

export default ReviewSubmittedToast;

