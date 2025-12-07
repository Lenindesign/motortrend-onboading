/**
 * CardShell Atom
 * Migrated to inline styles for Tailwind compatibility
 * Shared card container that enforces token-based spacing, radius, and shadow.
 */

import React, { useState } from 'react';

export interface CardShellProps {
  children: React.ReactNode;
  className?: string;
  hasHover?: boolean;
  background?: string;
  padding?: 'sm' | 'md' | 'lg' | 'none';
  noGap?: boolean;
  style?: React.CSSProperties;
}

const paddingMap: Record<'sm' | 'md' | 'lg' | 'none', string> = {
  none: '0',
  sm: 'var(--spacing-card-sm, 12px)',
  md: 'var(--spacing-card-md, 16px)',
  lg: 'var(--spacing-card-lg, 24px)',
};

export const CardShell: React.FC<CardShellProps> = ({
  children,
  className = '',
  hasHover = true,
  background = 'var(--color-neutrals-8, #FCFCFD)',
  padding = 'md',
  noGap = false,
  style,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const shellStyle: React.CSSProperties = {
    border: '1px solid var(--color-neutrals-6, #E6E8EC)',
    borderRadius: 'var(--border-radius-md, 8px)',
    boxShadow: hasHover && isHovered 
      ? 'var(--shadow-card-hover, 0 8px 16px rgba(20, 20, 22, 0.12))' 
      : 'var(--shadow-card, 0 4px 8px rgba(20, 20, 22, 0.06))',
    background,
    width: '100%',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: noGap ? '0' : 'var(--spacing-gap-md, 16px)',
    transition: 'all 150ms ease-in-out',
    padding: paddingMap[padding],
    transform: hasHover && isHovered ? 'translateY(-2px)' : 'none',
    ...style,
  };

  return (
    <div
      className={className}
      style={shellStyle}
      onMouseEnter={() => hasHover && setIsHovered(true)}
      onMouseLeave={() => hasHover && setIsHovered(false)}
    >
      {children}
    </div>
  );
};

export default CardShell;


