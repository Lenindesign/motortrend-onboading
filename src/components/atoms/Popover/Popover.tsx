/**
 * Popover Atom
 * Migrated to inline styles for Tailwind compatibility
 * Interactive popover component for rich content
 * Uses React Portal for rendering outside the DOM hierarchy
 */

import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';

export type PopoverPlacement = 'top' | 'bottom' | 'left' | 'right';
export type PopoverTrigger = 'click' | 'hover';

export interface PopoverProps {
  /** Popover content (rich text, components, etc.) */
  content: React.ReactNode;
  /** Element that triggers the popover */
  children: React.ReactNode;
  /** Popover placement relative to trigger */
  placement?: PopoverPlacement;
  /** Initial open state (uncontrolled mode) */
  defaultOpen?: boolean;
  /** Controlled open state */
  isOpen?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (isOpen: boolean) => void;
  /** Trigger method */
  trigger?: PopoverTrigger;
  /** Show arrow indicator */
  showArrow?: boolean;
  /** Close when clicking outside */
  closeOnOutsideClick?: boolean;
  /** Close when pressing Escape key */
  closeOnEsc?: boolean;
  /** Additional CSS classes for the popover container */
  className?: string;
  /** Offset from trigger element in pixels */
  offset?: number;
}

// Inject keyframe animations once
const KEYFRAMES_ID = 'popover-keyframes';
const injectKeyframes = () => {
  if (typeof document !== 'undefined' && !document.getElementById(KEYFRAMES_ID)) {
    const style = document.createElement('style');
    style.id = KEYFRAMES_ID;
    style.textContent = `
      @keyframes popoverFadeIn {
        from { opacity: 0; transform: scale(0.98); }
        to { opacity: 1; transform: scale(1); }
      }
    `;
    document.head.appendChild(style);
  }
};

// Arrow positioning based on placement
const getArrowStyle = (placement: PopoverPlacement): React.CSSProperties => {
  const baseArrowStyle: React.CSSProperties = {
    position: 'absolute',
    width: '12px',
    height: '12px',
    backgroundColor: 'var(--color-white, #FFFFFF)',
    border: '1px solid var(--color-neutrals-6, #E6E8EC)',
    transform: 'rotate(45deg)',
    zIndex: 1,
  };

  const placementStyles: Record<PopoverPlacement, React.CSSProperties> = {
    top: {
      ...baseArrowStyle,
      bottom: '-6px',
      left: '50%',
      marginLeft: '-6px',
      borderTop: 'none',
      borderLeft: 'none',
    },
    bottom: {
      ...baseArrowStyle,
      top: '-6px',
      left: '50%',
      marginLeft: '-6px',
      borderBottom: 'none',
      borderRight: 'none',
    },
    left: {
      ...baseArrowStyle,
      right: '-6px',
      top: '50%',
      marginTop: '-6px',
      borderLeft: 'none',
      borderBottom: 'none',
    },
    right: {
      ...baseArrowStyle,
      left: '-6px',
      top: '50%',
      marginTop: '-6px',
      borderRight: 'none',
      borderTop: 'none',
    },
  };

  return placementStyles[placement];
};

export const Popover: React.FC<PopoverProps> = ({
  content,
  children,
  placement = 'bottom',
  defaultOpen = false,
  isOpen: controlledOpen,
  onOpenChange,
  trigger = 'click',
  showArrow = true,
  closeOnOutsideClick = true,
  closeOnEsc = true,
  className = '',
  offset = 8,
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  
  const isOpen = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;
  
  const triggerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Inject keyframes on mount
  useEffect(() => {
    injectKeyframes();
  }, []);

  const handleOpenChange = (open: boolean) => {
    if (controlledOpen === undefined) {
      setUncontrolledOpen(open);
    }
    onOpenChange?.(open);
  };

  // Calculate position
  const updatePosition = () => {
    if (!triggerRef.current || !popoverRef.current || !isOpen) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const popoverRect = popoverRef.current.getBoundingClientRect();
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    let top = 0;
    let left = 0;
    const arrowOffset = showArrow ? 12 : 0;
    const totalOffset = offset + arrowOffset;

    switch (placement) {
      case 'top':
        top = triggerRect.top + scrollY - popoverRect.height - totalOffset;
        left = triggerRect.left + scrollX + (triggerRect.width - popoverRect.width) / 2;
        break;
      case 'bottom':
        top = triggerRect.bottom + scrollY + totalOffset;
        left = triggerRect.left + scrollX + (triggerRect.width - popoverRect.width) / 2;
        break;
      case 'left':
        top = triggerRect.top + scrollY + (triggerRect.height - popoverRect.height) / 2;
        left = triggerRect.left + scrollX - popoverRect.width - totalOffset;
        break;
      case 'right':
        top = triggerRect.top + scrollY + (triggerRect.height - popoverRect.height) / 2;
        left = triggerRect.right + scrollX + totalOffset;
        break;
    }

    // Viewport collision detection (basic)
    const padding = 16;
    if (left < padding) left = padding;
    if (left + popoverRect.width > window.innerWidth - padding) {
      left = window.innerWidth - popoverRect.width - padding;
    }
    
    // Apply position
    setPosition({ top, left });
  };

  // Update position when opening
  useLayoutEffect(() => {
    if (isOpen) {
      updatePosition();
      // Update on scroll and resize
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isOpen, placement, content]);

  // Handle interactions
  const handleTriggerClick = (e: React.MouseEvent) => {
    if (trigger === 'click') {
      e.stopPropagation();
      handleOpenChange(!isOpen);
    }
  };

  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      handleOpenChange(true);
    }
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover') {
      handleOpenChange(false);
    }
  };

  // Close on outside click
  useEffect(() => {
    if (isOpen && closeOnOutsideClick) {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          popoverRef.current && 
          !popoverRef.current.contains(event.target as Node) &&
          triggerRef.current && 
          !triggerRef.current.contains(event.target as Node)
        ) {
          handleOpenChange(false);
        }
      };
      
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, closeOnOutsideClick]);

  // Close on Esc
  useEffect(() => {
    if (isOpen && closeOnEsc) {
      const handleEsc = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          handleOpenChange(false);
        }
      };
      
      document.addEventListener('keydown', handleEsc);
      return () => {
        document.removeEventListener('keydown', handleEsc);
      };
    }
  }, [isOpen, closeOnEsc]);

  // Popover container styles
  const popoverStyle: React.CSSProperties = {
    position: 'absolute',
    zIndex: 10000,
    backgroundColor: 'var(--color-white, #FFFFFF)',
    borderRadius: 'var(--border-radius-md, 8px)',
    boxShadow: 'var(--shadow-dropdown, 0 4px 12px rgba(20, 20, 22, 0.15))',
    border: '1px solid var(--color-neutrals-6, #E6E8EC)',
    padding: 0,
    minWidth: '200px',
    maxWidth: '400px',
    animation: 'popoverFadeIn 0.2s ease-out',
    top: position.top,
    left: position.left,
  };

  // Content wrapper styles
  const contentStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 2,
    overflow: 'hidden',
    borderRadius: 'var(--border-radius-md, 8px)',
  };

  // Trigger styles
  const triggerStyle: React.CSSProperties = {
    display: 'inline-block',
    cursor: 'pointer',
  };

  const popoverContent = isOpen ? (
    <div
      ref={popoverRef}
      className={className}
      style={popoverStyle}
      role="dialog"
      aria-modal="true"
      onMouseEnter={trigger === 'hover' ? handleMouseEnter : undefined}
      onMouseLeave={trigger === 'hover' ? handleMouseLeave : undefined}
    >
      <div style={contentStyle}>
        {content}
      </div>
      {showArrow && <div style={getArrowStyle(placement)} />}
    </div>
  ) : null;

  return (
    <>
      <div
        ref={triggerRef}
        style={triggerStyle}
        onClick={handleTriggerClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        {children}
      </div>
      {isOpen && createPortal(popoverContent, document.body)}
    </>
  );
};

export default Popover;


