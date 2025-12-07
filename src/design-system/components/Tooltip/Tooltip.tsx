/**
 * Tooltip Atom
 * Migrated to inline styles for Tailwind compatibility
 * Simple tooltip that follows tokenized styles and placements.
 */

import React, { useState } from 'react';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  children: React.ReactNode;
  content: string;
  placement?: TooltipPlacement;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  placement = 'top',
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
  };

  // Base tooltip content styles
  const baseTooltipStyle: React.CSSProperties = {
    position: 'absolute',
    padding: '6px 12px',
    borderRadius: 'var(--border-radius-sm, 4px)',
    background: 'var(--color-neutrals-1, #141416)',
    color: 'var(--color-white, #FFFFFF)',
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontSize: '12px',
    lineHeight: '1.2',
    whiteSpace: 'nowrap',
    opacity: isHovered ? 1 : 0,
    pointerEvents: 'none',
    transition: 'opacity 150ms ease-in-out, transform 150ms ease-in-out',
    boxShadow: 'var(--shadow-dropdown, 0 4px 12px rgba(20, 20, 22, 0.15))',
    zIndex: 100,
  };

  // Placement-specific positioning
  const placementStyles: Record<TooltipPlacement, React.CSSProperties> = {
    top: {
      bottom: 'calc(100% + 8px)',
      left: '50%',
      transform: `translate(-50%, ${isHovered ? '0' : '4px'})`,
    },
    bottom: {
      top: 'calc(100% + 8px)',
      left: '50%',
      transform: `translate(-50%, ${isHovered ? '0' : '-4px'})`,
    },
    left: {
      right: 'calc(100% + 8px)',
      top: '50%',
      transform: `translate(${isHovered ? '0' : '4px'}, -50%)`,
    },
    right: {
      left: 'calc(100% + 8px)',
      top: '50%',
      transform: `translate(${isHovered ? '0' : '-4px'}, -50%)`,
    },
  };

  const tooltipStyle: React.CSSProperties = {
    ...baseTooltipStyle,
    ...placementStyles[placement],
  };

  return (
    <div
      className={className}
      style={containerStyle}
      aria-label={content}
      role="tooltip"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      {children}
      <span style={tooltipStyle}>{content}</span>
    </div>
  );
};

export default Tooltip;


