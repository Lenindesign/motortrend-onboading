/**
 * Tooltip Atom
 * Migrated to inline styles for Tailwind compatibility
 * Accessible tooltip component with positioning and delay control
 */

import React, { useState, useRef, useEffect } from 'react';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';
export type TooltipTrigger = 'hover' | 'click' | 'focus';

export interface TooltipProps {
  /** Tooltip content */
  content: React.ReactNode;
  /** Element that triggers the tooltip */
  children: React.ReactNode;
  /** Tooltip placement relative to trigger */
  placement?: TooltipPlacement;
  /** Delay before showing tooltip (ms) */
  showDelay?: number;
  /** Delay before hiding tooltip (ms) */
  hideDelay?: number;
  /** Show arrow indicator */
  showArrow?: boolean;
  /** Trigger method */
  trigger?: TooltipTrigger;
  /** Disabled state */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Max width of tooltip */
  maxWidth?: string;
  /** ARIA label for accessibility */
  'aria-label'?: string;
}

// Arrow styles for each placement
const arrowStyles: Record<TooltipPlacement, React.CSSProperties> = {
  top: {
    position: 'absolute',
    bottom: '-6px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderWidth: '6px 6px 0 6px',
    borderColor: 'var(--color-neutrals-2, #23262F) transparent transparent transparent',
  },
  bottom: {
    position: 'absolute',
    top: '-6px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderWidth: '0 6px 6px 6px',
    borderColor: 'transparent transparent var(--color-neutrals-2, #23262F) transparent',
  },
  left: {
    position: 'absolute',
    right: '-6px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderWidth: '6px 0 6px 6px',
    borderColor: 'transparent transparent transparent var(--color-neutrals-2, #23262F)',
  },
  right: {
    position: 'absolute',
    left: '-6px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderWidth: '6px 6px 6px 0',
    borderColor: 'transparent var(--color-neutrals-2, #23262F) transparent transparent',
  },
};

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  placement = 'top',
  showDelay = 200,
  hideDelay = 0,
  showArrow = true,
  trigger = 'hover',
  disabled = false,
  className = '',
  maxWidth = '300px',
  'aria-label': ariaLabel,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const showTimeoutRef = useRef<number | null>(null);
  const hideTimeoutRef = useRef<number | null>(null);

  // Trigger wrapper styles
  const triggerStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    cursor: 'help',
  };

  // Tooltip container styles
  const tooltipStyle: React.CSSProperties = {
    position: 'fixed',
    top: `${position.top}px`,
    left: `${position.left}px`,
    maxWidth,
    zIndex: 10000,
    backgroundColor: 'var(--color-neutrals-2, #23262F)',
    color: 'var(--color-white, #FFFFFF)',
    padding: '8px 12px',
    borderRadius: 'var(--border-radius-sm, 4px)',
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: '1.4',
    boxShadow: 'var(--shadow-tooltip, 0 4px 12px rgba(20, 20, 22, 0.2))',
    opacity: isVisible ? 1 : 0,
    visibility: isVisible ? 'visible' : 'hidden',
    transition: 'opacity 150ms ease-in-out, visibility 150ms ease-in-out',
    pointerEvents: isVisible ? 'auto' : 'none',
  };

  // Content wrapper styles
  const contentStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 1,
  };

  // Calculate tooltip position
  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const offset = showArrow ? 12 : 8;

    let top = 0;
    let left = 0;

    switch (placement) {
      case 'top':
        top = triggerRect.top - tooltipRect.height - offset;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = triggerRect.bottom + offset;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.left - tooltipRect.width - offset;
        break;
      case 'right':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.right + offset;
        break;
    }

    // Keep tooltip within viewport
    const padding = 8;
    if (left < padding) left = padding;
    if (left + tooltipRect.width > window.innerWidth - padding) {
      left = window.innerWidth - tooltipRect.width - padding;
    }
    if (top < padding) top = padding;
    if (top + tooltipRect.height > window.innerHeight - padding) {
      top = window.innerHeight - tooltipRect.height - padding;
    }

    setPosition({ top, left });
  };

  const handleShow = () => {
    if (disabled) return;
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    if (showDelay > 0) {
      showTimeoutRef.current = window.setTimeout(() => setIsVisible(true), showDelay);
    } else {
      setIsVisible(true);
    }
  };

  const handleHide = () => {
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }
    if (hideDelay > 0) {
      hideTimeoutRef.current = window.setTimeout(() => setIsVisible(false), hideDelay);
    } else {
      setIsVisible(false);
    }
  };

  const handleToggle = () => {
    if (disabled) return;
    setIsVisible(!isVisible);
  };

  useEffect(() => {
    if (isVisible) calculatePosition();
  }, [isVisible, content]);

  useEffect(() => {
    if (!isVisible) return;
    const handleUpdate = () => calculatePosition();
    window.addEventListener('scroll', handleUpdate, true);
    window.addEventListener('resize', handleUpdate);
    return () => {
      window.removeEventListener('scroll', handleUpdate, true);
      window.removeEventListener('resize', handleUpdate);
    };
  }, [isVisible]);

  useEffect(() => {
    return () => {
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (trigger !== 'click' || !isVisible) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.current && !triggerRef.current.contains(event.target as Node) &&
        tooltipRef.current && !tooltipRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [trigger, isVisible]);

  const triggerProps: Record<string, () => void> = {};
  if (trigger === 'hover') {
    triggerProps.onMouseEnter = handleShow;
    triggerProps.onMouseLeave = handleHide;
    triggerProps.onFocus = handleShow;
    triggerProps.onBlur = handleHide;
  } else if (trigger === 'click') {
    triggerProps.onClick = handleToggle;
  } else if (trigger === 'focus') {
    triggerProps.onFocus = handleShow;
    triggerProps.onBlur = handleHide;
  }

  return (
    <>
      <div
        ref={triggerRef}
        className={className}
        style={triggerStyle}
        aria-describedby={isVisible ? 'tooltip-content' : undefined}
        {...triggerProps}
      >
        {children}
      </div>

      {isVisible && (
        <div
          ref={tooltipRef}
          id="tooltip-content"
          role="tooltip"
          aria-label={ariaLabel}
          style={tooltipStyle}
          onMouseEnter={trigger === 'hover' ? handleShow : undefined}
          onMouseLeave={trigger === 'hover' ? handleHide : undefined}
        >
          <div style={contentStyle}>{content}</div>
          {showArrow && <div style={arrowStyles[placement]} />}
        </div>
      )}
    </>
  );
};

export default Tooltip;


