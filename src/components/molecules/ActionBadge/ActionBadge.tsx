/**
 * ActionBadge Component
 * Migrated to inline styles for Tailwind compatibility
 */

import React, { useState } from 'react';
import { Badge, type BadgeVariant } from '../../atoms/Badge/Badge';

export interface ActionBadgeProps {
  text: string;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  variant?: 'primary' | 'secondary';
  className?: string;
}

const badgeVariantMap: Record<'primary' | 'secondary', BadgeVariant> = {
  primary: 'new',
  secondary: 'neutral'
};

export const ActionBadge: React.FC<ActionBadgeProps> = ({
  text,
  href,
  onClick,
  variant = 'secondary',
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const Component = href ? 'a' : 'button';
  const badgeVariant = badgeVariantMap[variant];

  const style: React.CSSProperties = {
    display: 'inline-flex',
    textDecoration: 'none',
    transition: 'opacity 150ms ease-in-out',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: 0,
    width: 'fit-content',
    opacity: isHovered ? 0.8 : 1,
  };

  return (
    <Component
      href={href}
      className={className}
      onClick={onClick}
      type={!href ? 'button' : undefined}
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Badge variant={badgeVariant} size="sm">{text}</Badge>
    </Component>
  );
};

export default ActionBadge;
