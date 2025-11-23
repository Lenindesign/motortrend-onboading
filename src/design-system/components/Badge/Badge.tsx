/**
 * Badge Atom
 * Reusable pill badge for statuses and labels following design tokens.
 */

import React from 'react';
import './Badge.css';

export type BadgeVariant = 'new' | 'premium' | 'verified' | 'info' | 'success' | 'warning' | 'error' | 'neutral';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
  icon?: React.ReactNode;
  outline?: boolean;
  onClick?: () => void;
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
  'aria-label': ariaLabel
}) => {
  const classNames = [
    'badge',
    `badge--${variant}`,
    `badge--${size}`,
    outline && 'badge--outline',
    onClick && 'badge--clickable',
    className
  ]
    .filter(Boolean)
    .join(' ');

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.stopPropagation();
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


