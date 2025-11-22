/**
 * Tooltip Atom
 * Accessible tooltip component with positioning and delay control
 */

import React, { useState, useRef, useEffect } from 'react';
import './Tooltip.css';

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

  // Calculate tooltip position
  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const offset = showArrow ? 12 : 8; // Extra space for arrow

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

  // Show tooltip with delay
  const handleShow = () => {
    if (disabled) return;

    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    if (showDelay > 0) {
      showTimeoutRef.current = window.setTimeout(() => {
        setIsVisible(true);
      }, showDelay);
    } else {
      setIsVisible(true);
    }
  };

  // Hide tooltip with delay
  const handleHide = () => {
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }

    if (hideDelay > 0) {
      hideTimeoutRef.current = window.setTimeout(() => {
        setIsVisible(false);
      }, hideDelay);
    } else {
      setIsVisible(false);
    }
  };

  // Toggle tooltip (for click trigger)
  const handleToggle = () => {
    if (disabled) return;
    setIsVisible(!isVisible);
  };

  // Calculate position when tooltip becomes visible
  useEffect(() => {
    if (isVisible) {
      calculatePosition();
    }
  }, [isVisible, content]);

  // Recalculate position on scroll/resize
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

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  // Handle click outside to close (for click trigger)
  useEffect(() => {
    if (trigger !== 'click' || !isVisible) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [trigger, isVisible]);

  // Event handlers based on trigger type
  const triggerProps: any = {};
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

  const tooltipClasses = [
    'tooltip',
    `tooltip--${placement}`,
    showArrow && 'tooltip--with-arrow',
    isVisible && 'tooltip--visible',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <div
        ref={triggerRef}
        className="tooltip-trigger"
        aria-describedby={isVisible ? 'tooltip-content' : undefined}
        {...triggerProps}
      >
        {children}
      </div>

      {isVisible && (
        <div
          ref={tooltipRef}
          id="tooltip-content"
          className={tooltipClasses}
          role="tooltip"
          aria-label={ariaLabel}
          style={{
            position: 'fixed',
            top: `${position.top}px`,
            left: `${position.left}px`,
            maxWidth,
            zIndex: 10000,
          }}
          onMouseEnter={trigger === 'hover' ? handleShow : undefined}
          onMouseLeave={trigger === 'hover' ? handleHide : undefined}
        >
          <div className="tooltip__content">{content}</div>
          {showArrow && <div className="tooltip__arrow" />}
        </div>
      )}
    </>
  );
};

export default Tooltip;

