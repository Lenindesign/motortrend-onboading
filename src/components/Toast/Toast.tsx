/**
 * Toast Component
 * Confirmation dialog for destructive actions
 */

import React, { useEffect } from 'react';
import './Toast.css';
import Icon from '../Icon';
import { Button } from '../../design-system/components';

export interface ToastProps {
  message: string;
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'success' | 'error' | 'info';
}

export const Toast: React.FC<ToastProps> = ({
  message,
  isVisible,
  onConfirm,
  onCancel,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  type = 'warning',
}) => {
  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isVisible) {
        onCancel();
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isVisible, onCancel]);

  if (!isVisible) return null;

  return (
    <>
      <div className="toast-overlay" onClick={onCancel} />
      <div className={`toast toast--${type}`}>
        <button className="toast__close" onClick={onCancel} aria-label="Close">
          <Icon name="close" size={20} />
        </button>
        <div className="toast__content">
          <div className="toast__icon">
            {type === 'warning' && <Icon name="warning" size={24} />}
            {type === 'error' && <Icon name="error" size={24} />}
            {type === 'success' && <Icon name="check_circle" size={24} />}
            {type === 'info' && <Icon name="info" size={24} />}
          </div>
          <p className="toast__message">{message}</p>
        </div>
        <div className="toast__actions">
          <Button color="toast-cancel" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button color="toast-confirm" onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </>
  );
};

export default Toast;

