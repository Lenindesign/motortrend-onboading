/**
 * Toast Component
 * Confirmation dialog for destructive actions
 */

import React from 'react';
import './Toast.css';
import Icon from '../Icon';

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
  if (!isVisible) return null;

  return (
    <>
      <div className="toast-overlay" onClick={onCancel} />
      <div className={`toast toast--${type}`}>
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
          <button className="toast__button toast__button--cancel" onClick={onCancel}>
            {cancelText}
          </button>
          <button className="toast__button toast__button--confirm" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </>
  );
};

export default Toast;

