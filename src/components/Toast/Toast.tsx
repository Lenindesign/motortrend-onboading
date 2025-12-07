/**
 * Toast Component
 * Migrated to inline styles for Tailwind compatibility
 * Confirmation dialog for destructive actions
 */

import React, { useEffect, useState } from 'react';
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

// Inject keyframe animations once
const KEYFRAMES_ID = 'toast-keyframes';
const injectKeyframes = () => {
  if (typeof document !== 'undefined' && !document.getElementById(KEYFRAMES_ID)) {
    const style = document.createElement('style');
    style.id = KEYFRAMES_ID;
    style.textContent = `
      @keyframes toastFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes toastModalFadeIn {
        from { transform: translate(-50%, -50%) scale(0.9); opacity: 0; }
        to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }
};

// Type-specific colors for icon and border
const typeColors: Record<'warning' | 'success' | 'error' | 'info', { icon: string; border?: string }> = {
  warning: { icon: 'var(--color-primary-1, #E90C17)' },
  error: { icon: 'var(--color-primary-1, #E90C17)', border: '4px solid var(--color-primary-1, #E90C17)' },
  success: { icon: 'var(--color-semantic-success, #34A853)', border: '4px solid var(--color-semantic-success, #34A853)' },
  info: { icon: 'var(--color-blue, #186CEA)', border: '4px solid var(--color-blue, #186CEA)' },
};

// Type-specific icons
const typeIcons: Record<'warning' | 'success' | 'error' | 'info', string> = {
  warning: 'warning',
  error: 'error',
  success: 'check_circle',
  info: 'info',
};

export const Toast: React.FC<ToastProps> = ({
  message,
  isVisible,
  onConfirm,
  onCancel,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  type = 'warning',
}) => {
  const [isCloseHovered, setIsCloseHovered] = useState(false);

  // Inject keyframes on mount
  useEffect(() => {
    injectKeyframes();
  }, []);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isVisible) {
        onCancel();
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isVisible, onCancel]);

  if (!isVisible) return null;

  const typeConfig = typeColors[type];

  // Overlay styles
  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(20, 20, 22, 0.6)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    zIndex: 9998,
    animation: 'toastFadeIn 150ms ease-in-out',
  };

  // Toast container styles
  const toastStyle: React.CSSProperties = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'var(--color-white, #FFFFFF)',
    borderRadius: 'var(--border-radius-lg, 16px)',
    boxShadow: 'var(--shadow-depth-5, 0 4px 20px rgba(20, 20, 22, 0.06))',
    padding: 'var(--spacing-4, 32px)',
    minWidth: '360px',
    maxWidth: '480px',
    zIndex: 9999,
    animation: 'toastModalFadeIn 250ms ease-out',
    borderLeft: typeConfig.border,
  };

  // Close button styles
  const closeButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: 'var(--spacing-2, 16px)',
    right: 'var(--spacing-2, 16px)',
    background: isCloseHovered ? 'var(--color-neutrals-7, #F4F5F6)' : 'none',
    border: 'none',
    padding: 'var(--spacing-1, 8px)',
    cursor: 'pointer',
    color: isCloseHovered ? 'var(--color-neutrals-2, #23262F)' : 'var(--color-neutrals-4, #6E7481)',
    borderRadius: 'var(--border-radius-sm, 4px)',
    transition: 'all 150ms ease-in-out',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  // Content styles
  const contentStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2, 16px)',
    marginBottom: 'var(--spacing-2, 16px)',
  };

  // Icon container styles
  const iconStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    color: typeConfig.icon,
  };

  // Message styles
  const messageStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontSize: '15px',
    lineHeight: 1.5,
    color: 'var(--color-neutrals-2, #23262F)',
    margin: 0,
    flex: 1,
  };

  // Actions styles
  const actionsStyle: React.CSSProperties = {
    display: 'flex',
    gap: 'var(--spacing-2, 16px)',
    justifyContent: 'flex-end',
  };

  return (
    <>
      <div style={overlayStyle} onClick={onCancel} />
      <div style={toastStyle}>
        <button
          style={closeButtonStyle}
          onClick={onCancel}
          aria-label="Close"
          onMouseEnter={() => setIsCloseHovered(true)}
          onMouseLeave={() => setIsCloseHovered(false)}
        >
          <Icon name="close" size={20} />
        </button>
        <div style={contentStyle}>
          <div style={iconStyle}>
            <Icon name={typeIcons[type]} size={24} />
          </div>
          <p style={messageStyle}>{message}</p>
        </div>
        <div style={actionsStyle}>
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

