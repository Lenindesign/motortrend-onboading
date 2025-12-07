/**
 * Review Submitted Modal Component
 * Migrated to inline styles for Tailwind compatibility
 * Success notification modal that appears after submitting a review
 */

import React, { useState } from 'react';
import { ModalShell } from '../atoms/ModalShell';
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
  const [isPrimaryHovered, setIsPrimaryHovered] = useState(false);
  const [isSecondaryHovered, setIsSecondaryHovered] = useState(false);
  const [isCloseHovered, setIsCloseHovered] = useState(false);

  // Content container styles
  const contentStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px 32px 32px',
    gap: '24px',
    textAlign: 'center',
    position: 'relative',
  };

  // Icon container styles
  const iconContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80px',
    height: '80px',
    borderRadius: 'var(--border-radius-circle, 50%)',
    backgroundColor: 'var(--color-semantic-success-light, #E8F5E9)',
    color: 'var(--color-semantic-success, #34A853)',
    flexShrink: 0,
  };

  // Message container styles
  const messageStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    width: '100%',
  };

  // Title styles
  const titleStyle: React.CSSProperties = {
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontWeight: 600,
    fontSize: '24px',
    lineHeight: 1.3,
    color: 'var(--color-neutrals-2, #23262F)',
    margin: 0,
  };

  // Subtitle styles
  const subtitleStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontSize: '16px',
    lineHeight: 1.5,
    color: 'var(--color-neutrals-4, #6E7481)',
    margin: 0,
  };

  // Actions container styles
  const actionsStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    width: '100%',
    marginTop: '8px',
  };

  // Base button styles
  const buttonBaseStyle: React.CSSProperties = {
    flex: 1,
    padding: '12px 24px',
    borderRadius: 'var(--border-radius-md, 8px)',
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontWeight: 600,
    fontSize: '15px',
    lineHeight: 1.4,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: 'none',
  };

  // Primary button styles
  const primaryButtonStyle: React.CSSProperties = {
    ...buttonBaseStyle,
    backgroundColor: isPrimaryHovered ? 'var(--color-neutrals-1, #141416)' : 'var(--color-neutrals-2, #23262F)',
    color: 'var(--color-white, #FFFFFF)',
  };

  // Secondary button styles
  const secondaryButtonStyle: React.CSSProperties = {
    ...buttonBaseStyle,
    backgroundColor: isSecondaryHovered ? 'var(--color-neutrals-6, #E6E8EC)' : 'var(--color-neutrals-7, #F4F5F6)',
    color: 'var(--color-neutrals-2, #23262F)',
  };

  // Close button styles
  const closeButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: isCloseHovered ? 'var(--color-neutrals-7, #F4F5F6)' : 'none',
    border: 'none',
    padding: '8px',
    cursor: 'pointer',
    color: isCloseHovered ? 'var(--color-neutrals-2, #23262F)' : 'var(--color-neutrals-4, #6E7481)',
    borderRadius: 'var(--border-radius-sm, 4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s ease, color 0.2s ease',
    width: '32px',
    height: '32px',
  };

  return (
    <ModalShell
      isOpen={isVisible}
      onClose={onClose}
      maxWidth="480px"
    >
      <div style={contentStyle}>
        <div style={iconContainerStyle}>
          <Icon name="check_circle" size={48} />
        </div>
        <div style={messageStyle}>
          <h2 style={titleStyle}>Review added!</h2>
          <p style={subtitleStyle}>Your review for {vehicleName} has been successfully submitted.</p>
        </div>
        <div style={actionsStyle}>
          <button 
            style={primaryButtonStyle}
            onClick={onViewReview}
            onMouseEnter={() => setIsPrimaryHovered(true)}
            onMouseLeave={() => setIsPrimaryHovered(false)}
          >
            View Review
          </button>
          <button 
            style={secondaryButtonStyle}
            onClick={onClose}
            onMouseEnter={() => setIsSecondaryHovered(true)}
            onMouseLeave={() => setIsSecondaryHovered(false)}
          >
            Close
          </button>
        </div>
        <button 
          style={closeButtonStyle}
          onClick={onClose}
          onMouseEnter={() => setIsCloseHovered(true)}
          onMouseLeave={() => setIsCloseHovered(false)}
          aria-label="Close notification"
        >
          <Icon name="close" size={24} />
        </button>
      </div>
    </ModalShell>
  );
};

export default ReviewSubmittedToast;

