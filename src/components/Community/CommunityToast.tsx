/**
 * CommunityToast Component
 * Simple notification toast for community actions
 */

import React, { useEffect, useState } from 'react';
import Icon from '../Icon';

export type ToastType = 'success' | 'error' | 'info';

export interface CommunityToastProps {
  message: string;
  type?: ToastType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const typeConfig: Record<ToastType, { icon: string; bgColor: string; iconColor: string }> = {
  success: { 
    icon: 'check_circle', 
    bgColor: 'var(--color-semantic-success, #34A853)',
    iconColor: 'var(--color-white, #FFFFFF)'
  },
  error: { 
    icon: 'error', 
    bgColor: 'var(--color-primary-1, #E90C17)',
    iconColor: 'var(--color-white, #FFFFFF)'
  },
  info: { 
    icon: 'info', 
    bgColor: 'var(--color-neutrals-2, #23262F)',
    iconColor: 'var(--color-white, #FFFFFF)'
  },
};

export const CommunityToast: React.FC<CommunityToastProps> = ({
  message,
  type = 'info',
  isVisible,
  onClose,
  duration = 3000,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(onClose, 200); // Wait for fade out animation
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible && !isAnimating) return null;

  const config = typeConfig[type];

  const toastStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '24px',
    left: '50%',
    transform: `translateX(-50%) translateY(${isAnimating ? '0' : '20px'})`,
    backgroundColor: config.bgColor,
    color: 'var(--color-white, #FFFFFF)',
    padding: '12px 20px',
    borderRadius: 'var(--border-radius-md, 8px)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    zIndex: 9999,
    opacity: isAnimating ? 1 : 0,
    transition: 'all 0.2s ease-in-out',
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontSize: '14px',
    fontWeight: 500,
    maxWidth: '400px',
  };

  const iconStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: config.iconColor,
    flexShrink: 0,
  };

  const closeButtonStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    padding: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--color-white, #FFFFFF)',
    opacity: 0.7,
    marginLeft: '8px',
    borderRadius: '4px',
    transition: 'opacity 0.15s ease',
  };

  return (
    <div style={toastStyle} role="alert" aria-live="polite">
      <span style={iconStyle}>
        <Icon name={config.icon} size={20} />
      </span>
      <span>{message}</span>
      <button 
        style={closeButtonStyle} 
        onClick={onClose}
        aria-label="Close notification"
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
      >
        <Icon name="close" size={18} />
      </button>
    </div>
  );
};

export default CommunityToast;

