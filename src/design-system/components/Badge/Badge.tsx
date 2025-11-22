/**
 * Badge Atom
 * Reusable pill badge for statuses and labels following design tokens.
 */

import React from 'react';
import './Badge.css';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'info';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = ''
}) => {
  const badgeClasses = `badge badge--${variant} ${className}`.trim();

  return <span className={badgeClasses}>{children}</span>;
};

export default Badge;

