/**
 * Tooltip Atom
 * Simple tooltip that follows tokenized styles and placements.
 */

import React from 'react';
import './Tooltip.css';

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
  className = ''
}) => {
  const tooltipClasses = `tooltip tooltip--${placement} ${className}`.trim();

  return (
    <div className={tooltipClasses} aria-label={content} role="tooltip">
      {children}
      <span className="tooltip__content">{content}</span>
    </div>
  );
};

export default Tooltip;


