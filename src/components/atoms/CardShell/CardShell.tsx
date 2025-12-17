/**
 * CardShell Atom
 * Migrated to inline styles for Tailwind compatibility
 * Standardized card wrapper with consistent padding, shadows, and hover states
 */

import React, { useState } from 'react';

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
  /** Additional inline styles */
  style?: React.CSSProperties;
  /** Mouse enter handler */
  onMouseEnter?: () => void;
  /** Mouse leave handler */
  onMouseLeave?: () => void;
}

// Padding map using design tokens
const paddingMap: Record<'none' | 'sm' | 'md' | 'lg' | 'xl', string> = {
  none: '0',
  sm: 'var(--spacing-2, 16px)',
  md: 'var(--spacing-3, 24px)',
  lg: 'var(--spacing-4, 32px)',
  xl: 'var(--spacing-5, 40px)',
};

// Border radius map using design tokens
const borderRadiusMap: Record<'sm' | 'md' | 'lg' | 'xl', string> = {
  sm: 'var(--border-radius-sm, 4px)',
  md: 'var(--border-radius-md, 8px)',
  lg: 'var(--border-radius-lg, 16px)',
  xl: 'var(--border-radius-xl, 24px)',
};

// Background color map
const backgroundMap: Record<'white' | 'neutral-light' | 'neutral-lighter' | 'transparent', string> = {
  white: 'var(--color-white, #FFFFFF)',
  'neutral-light': 'var(--color-neutrals-7, #F4F5F6)',
  'neutral-lighter': 'var(--color-neutrals-6, #E6E8EC)',
  transparent: 'transparent',
};

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
  style,
  onMouseEnter,
  onMouseLeave,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const isClickable = !!onClick;
  const showHoverEffect = hasHover && isHovered && !isActive;

  const cardStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    transition: 'all 150ms ease-in-out',
    position: 'relative',
    backgroundColor: backgroundMap[background],
    padding: paddingMap[padding],
    borderRadius: borderRadiusMap[borderRadius],
    boxShadow: hasShadow 
      ? (showHoverEffect 
          ? 'var(--shadow-card-hover, 0 8px 16px rgba(20, 20, 22, 0.12))' 
          : 'var(--shadow-card, 0 4px 8px rgba(20, 20, 22, 0.06))')
      : 'none',
    transform: showHoverEffect ? 'translateY(-2px)' : (isActive ? 'translateY(0)' : 'none'),
    cursor: isClickable ? 'pointer' : undefined,
    userSelect: isClickable ? 'none' : undefined,
    ...style,
  };

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
      className={className}
      style={cardStyle}
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      onMouseEnter={() => { setIsHovered(true); onMouseEnter?.(); }}
      onMouseLeave={() => { setIsHovered(false); setIsActive(false); onMouseLeave?.(); }}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      role={role || (onClick ? 'button' : undefined)}
      aria-label={ariaLabel}
      tabIndex={onClick ? (tabIndex ?? 0) : tabIndex}
    >
      {children}
    </div>
  );
};

export default CardShell;


