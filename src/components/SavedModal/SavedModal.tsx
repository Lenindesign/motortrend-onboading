/**
 * Saved Modal Component
 * Modal that appears when a user saves an item
 * Now uses ModalShell atom for consistent overlay and shadow
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ModalShell } from '../atoms/ModalShell';
import Icon from '../Icon';
import './SavedModal.css';

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

  const handleViewSavedItems = () => {
    onClose();
    navigate('/my-account/saved-items');
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="480px"
      className="saved-modal"
    >
      <div className="saved-modal__inner">
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
    </ModalShell>
  );
};

export default SavedModal;

