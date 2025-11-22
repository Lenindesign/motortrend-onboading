/**
 * CardShell Atom
 * Standardized card wrapper with consistent padding, shadows, and hover states
 */

import React from 'react';
import './CardShell.css';

export interface CardShellProps {
  /** Card content */
  children: React.ReactNode;
  /** Padding size - uses design tokens */
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /** Enable hover effect (lift and shadow) */
  hasHover?: boolean;
  /** Show shadow (default: true) */
  hasShadow?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Click handler */
  onClick?: () => void;
  /** Border radius size */
  borderRadius?: 'sm' | 'md' | 'lg' | 'xl';
  /** Background color variant */
  background?: 'white' | 'neutral-light' | 'neutral-lighter' | 'transparent';
  /** ARIA role */
  role?: string;
  /** ARIA label */
  'aria-label'?: string;
  /** Tab index for keyboard navigation */
  tabIndex?: number;
}

export const CardShell: React.FC<CardShellProps> = ({
  children,
  padding = 'md',
  hasHover = false,
  hasShadow = true,
  className = '',
  onClick,
  borderRadius = 'md',
  background = 'white',
  role,
  'aria-label': ariaLabel,
  tabIndex,
}) => {
  const classNames = [
    'card-shell',
    `card-shell--padding-${padding}`,
    `card-shell--radius-${borderRadius}`,
    `card-shell--bg-${background}`,
    hasShadow && 'card-shell--shadow',
    hasHover && 'card-shell--hover',
    onClick && 'card-shell--clickable',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={classNames}
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      role={role || (onClick ? 'button' : undefined)}
      aria-label={ariaLabel}
      tabIndex={onClick ? (tabIndex ?? 0) : tabIndex}
    >
      {children}
    </div>
  );
};

export default CardShell;

