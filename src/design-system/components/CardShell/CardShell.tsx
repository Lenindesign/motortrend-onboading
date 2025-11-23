/**
 * CardShell Atom
 * Shared card container that enforces token-based spacing, radius, and shadow.
 */

import React from 'react';
import './CardShell.css';

export interface CardShellProps {
  children: React.ReactNode;
  className?: string;
  hasHover?: boolean;
  background?: string;
  padding?: 'sm' | 'md' | 'lg';
}

const paddingMap = {
  sm: 'var(--spacing-card-sm)',
  md: 'var(--spacing-card-md)',
  lg: 'var(--spacing-card-lg)'
} as const;

export const CardShell: React.FC<CardShellProps> = ({
  children,
  className = '',
  hasHover = true,
  background = 'var(--color-neutrals-8)',
  padding = 'md'
}) => {
  const shellClasses = `card-shell ${hasHover ? 'card-shell--hoverable' : ''} ${className}`.trim();

  return (
    <div
      className={shellClasses}
      style={{
        background,
        padding: paddingMap[padding]
      }}
    >
      {children}
    </div>
  );
};

export default CardShell;


