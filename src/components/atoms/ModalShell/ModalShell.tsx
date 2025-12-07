/**
 * ModalShell Atom
 * Migrated to inline styles for Tailwind compatibility
 * Reusable modal wrapper with standardized overlay and shadow
 */

import React, { useEffect } from 'react';

export interface ModalShellProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when overlay is clicked or escape is pressed */
  onClose: () => void;
  /** Modal content */
  children: React.ReactNode;
  /** Maximum width of the modal (default: 600px) */
  maxWidth?: string;
  /** Maximum height of the modal (default: 90vh) */
  maxHeight?: string;
  /** Width of the modal (default: 100%) */
  width?: string;
  /** Overlay opacity variant */
  overlayVariant?: 'medium' | 'dark';
  /** Position variant for the modal */
  position?: 'center' | 'side-right';
  /** Whether to show close on overlay click (default: true) */
  closeOnOverlayClick?: boolean;
  /** Whether to show close on escape key (default: true) */
  closeOnEscape?: boolean;
  /** Custom className for the modal content */
  className?: string;
  /** Animation variant */
  animation?: 'fade-slide' | 'slide-right';
  /** z-index for the modal (default: 1000) */
  zIndex?: number;
}

// Inject keyframe animations once
const KEYFRAMES_ID = 'modal-shell-keyframes';
const injectKeyframes = () => {
  if (typeof document !== 'undefined' && !document.getElementById(KEYFRAMES_ID)) {
    const style = document.createElement('style');
    style.id = KEYFRAMES_ID;
    style.textContent = `
      @keyframes modalFadeSlide {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes modalSlideRight {
        from { opacity: 0; transform: translateX(100%); }
        to { opacity: 1; transform: translateX(0); }
      }
    `;
    document.head.appendChild(style);
  }
};

// Overlay background colors
const overlayStyles: Record<'medium' | 'dark', React.CSSProperties> = {
  medium: { 
    background: 'rgba(20, 20, 22, 0.6)', 
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
  },
  dark: { 
    background: 'rgba(20, 20, 22, 0.8)', 
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
  },
};

// Position configurations
const positionStyles: Record<'center' | 'side-right', React.CSSProperties> = {
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--spacing-3, 24px)',
  },
  'side-right': {
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    padding: 0,
  },
};

// Animation names
const animationNames: Record<'fade-slide' | 'slide-right', string> = {
  'fade-slide': 'modalFadeSlide 0.3s ease-out',
  'slide-right': 'modalSlideRight 0.3s ease-out',
};

export const ModalShell: React.FC<ModalShellProps> = ({
  isOpen,
  onClose,
  children,
  maxWidth = '600px',
  maxHeight = '90vh',
  width = '100%',
  overlayVariant = 'medium',
  position = 'center',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = '',
  animation = 'fade-slide',
  zIndex = 1000
}) => {
  // Inject keyframes on mount
  useEffect(() => {
    injectKeyframes();
  }, []);

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, closeOnEscape]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  // Build overlay styles
  const shellStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    zIndex,
    ...overlayStyles[overlayVariant],
    ...positionStyles[position],
  };

  // Build content styles
  const contentStyle: React.CSSProperties = {
    position: 'relative',
    backgroundColor: 'var(--color-white, #FFFFFF)',
    borderRadius: position === 'side-right' ? 0 : 'var(--border-radius-lg, 16px)',
    boxShadow: 'var(--shadow-modal, 0 24px 48px rgba(20, 20, 22, 0.24))',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    maxWidth: position === 'side-right' ? '400px' : maxWidth,
    maxHeight: position === 'side-right' ? '100%' : maxHeight,
    width,
    height: position === 'side-right' ? '100%' : undefined,
    animation: animationNames[animation],
  };

  return (
    <div
      style={shellStyle}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
    >
      <div className={className} style={contentStyle}>
        {children}
      </div>
    </div>
  );
};


