/**
 * ModalShell Atom
 * Reusable modal wrapper with standardized overlay and shadow
 */

import React, { useEffect } from 'react';
import './ModalShell.css';

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

  const overlayClass = `modal-shell__overlay modal-shell__overlay--${overlayVariant}`;
  const positionClass = `modal-shell__wrapper--${position}`;
  const animationClass = `modal-shell__content--${animation}`;

  return (
    <div
      className={`modal-shell ${overlayClass} ${positionClass}`}
      onClick={handleOverlayClick}
      style={{ zIndex }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`modal-shell__content ${animationClass} ${className}`}
        style={{
          maxWidth,
          maxHeight,
          width
        }}
      >
        {children}
      </div>
    </div>
  );
};


