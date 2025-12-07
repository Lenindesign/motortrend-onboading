/**
 * Saved Modal Component
 * Migrated to inline styles for Tailwind compatibility
 * Modal that appears when a user saves an item
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ModalShell } from '../atoms/ModalShell';
import Icon from '../Icon';

export interface SavedModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemTitle: string;
  itemType?: 'article' | 'vehicle' | 'comparison' | 'video' | 'lead';
}

export const SavedModal: React.FC<SavedModalProps> = ({
  isOpen,
  onClose,
  itemTitle
}) => {
  const navigate = useNavigate();
  const [isLinkHovered, setIsLinkHovered] = useState(false);
  const [isCloseHovered, setIsCloseHovered] = useState(false);

  const handleViewSavedItems = () => {
    onClose();
    navigate('/my-account/saved-items');
  };

  // Inner container styles
  const innerStyle: React.CSSProperties = {
    padding: 'var(--spacing-5, 40px)',
  };

  // Title styles
  const titleStyle: React.CSSProperties = {
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontWeight: 600,
    fontSize: '24px',
    lineHeight: 1.2,
    color: 'var(--color-neutrals-1, #141416)',
    margin: '0 0 var(--spacing-3, 24px) 0',
    padding: 0,
  };

  // Content styles
  const contentStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontWeight: 400,
    fontSize: '16px',
    lineHeight: 1.5,
    color: 'var(--color-neutrals-2, #23262F)',
    margin: '0 0 var(--spacing-4, 32px) 0',
    padding: 0,
  };

  // Actions container styles
  const actionsStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 'var(--spacing-3, 24px)',
  };

  // View link styles
  const viewLinkStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontWeight: 500,
    fontSize: '16px',
    color: isLinkHovered ? 'var(--color-primary-1, #E90C17)' : 'var(--color-neutrals-2, #23262F)',
    textDecoration: 'underline',
    cursor: 'pointer',
    padding: 0,
    transition: 'color 150ms ease-in-out',
  };

  // Close button styles
  const closeButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-1, 8px)',
    padding: '10px 20px',
    backgroundColor: isCloseHovered ? 'var(--color-neutrals-2, #23262F)' : 'var(--color-neutrals-3, #353945)',
    border: 'none',
    borderRadius: 'var(--border-radius-md, 8px)',
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontWeight: 500,
    fontSize: '16px',
    color: 'var(--color-white, #FFFFFF)',
    cursor: 'pointer',
    transition: 'all 150ms ease-in-out',
    transform: isCloseHovered ? 'translateY(-1px)' : 'none',
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="480px"
    >
      <div style={innerStyle}>
        <h2 style={titleStyle}>Saved</h2>
        <p style={contentStyle}>{itemTitle}</p>
        <div style={actionsStyle}>
          <button 
            style={viewLinkStyle}
            onClick={handleViewSavedItems}
            onMouseEnter={() => setIsLinkHovered(true)}
            onMouseLeave={() => setIsLinkHovered(false)}
          >
            View Saved Items
          </button>
          <button 
            style={closeButtonStyle}
            onClick={onClose}
            onMouseEnter={() => setIsCloseHovered(true)}
            onMouseLeave={() => setIsCloseHovered(false)}
            aria-label="Close"
          >
            <Icon name="close" size={20} />
            <span>Close</span>
          </button>
        </div>
      </div>
    </ModalShell>
  );
};

export default SavedModal;

