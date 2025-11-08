/**
 * Review Submitted Modal Component
 * Success notification modal that appears after submitting a review
 */

import React, { useEffect } from 'react';
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
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isVisible]);

  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        onClose();
    }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="review-modal-overlay" onClick={onClose}>
      <div className="review-modal" onClick={(e) => e.stopPropagation()}>
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
      </div>
    </div>
  );
};

export default ReviewSubmittedToast;

