/**
 * Saved Modal Component
 * Modal that appears when a user saves an item
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../Icon';
import './SavedModal.css';

export interface SavedModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemTitle: string;
  itemType?: 'article' | 'vehicle' | 'comparison' | 'video';
}

export const SavedModal: React.FC<SavedModalProps> = ({
  isOpen,
  onClose,
  itemTitle
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleViewSavedItems = () => {
    onClose();
    navigate('/profile?tab=saved-items');
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="saved-modal-overlay" onClick={handleOverlayClick}>
      <div className="saved-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="saved-modal__title">Saved</h2>
        <p className="saved-modal__content">{itemTitle}</p>
        <div className="saved-modal__actions">
          <button 
            className="saved-modal__view-link"
            onClick={handleViewSavedItems}
          >
            View Saved Items
          </button>
          <button 
            className="saved-modal__close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <Icon name="close" size={20} />
            <span>Close</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SavedModal;

