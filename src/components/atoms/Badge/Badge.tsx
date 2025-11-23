/**
 * Badge Atom
 * Standardized badge component with semantic variants
 */

import React from 'react';
import './Badge.css';

export type BadgeVariant = 
  | 'new' 
  | 'premium' 
  | 'verified' 
  | 'info' 
  | 'success' 
  | 'warning' 
  | 'error'
  | 'neutral';

export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  /** Badge content */
  children: React.ReactNode;
  /** Visual variant with semantic meaning */
  variant?: BadgeVariant;
  /** Size of the badge */
  size?: BadgeSize;
  /** Additional CSS classes */
  className?: string;
  /** Icon to display before text */
  icon?: React.ReactNode;
  /** Whether badge has a subtle outline style */
  outline?: boolean;
  /** Click handler (makes badge interactive) */
  onClick?: () => void;
  /** ARIA label for accessibility */
  'aria-label'?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  icon,
  outline = false,
  onClick,
  'aria-label': ariaLabel,
}) => {
  const classNames = [
    'badge',
    `badge--${variant}`,
    `badge--${size}`,
    outline && 'badge--outline',
    onClick && 'badge--clickable',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.stopPropagation(); // Prevent event bubbling
      onClick();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      e.stopPropagation();
      onClick();
    }
  };

  const BadgeContent = (
    <>
      {icon && <span className="badge__icon">{icon}</span>}
      <span className="badge__text">{children}</span>
    </>
  );

  if (onClick) {
    return (
      <button
        className={classNames}
        onClick={handleClick}
        onKeyPress={handleKeyPress}
        aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
        type="button"
      >
        {BadgeContent}
      </button>
    );
  }

  return (
    <span 
      className={classNames}
      aria-label={ariaLabel}
      role={ariaLabel ? 'status' : undefined}
    >
      {BadgeContent}
    </span>
  );
};

export default Badge;


