import React from 'react';
import { Badge } from '../../atoms/Badge/Badge';
import './ActionBadge.css';

export interface ActionBadgeProps {
  text: string;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  variant?: 'primary' | 'secondary'; // primary = red (Local Listings), secondary = grey (Buyers Guide)
  className?: string;
}

export const ActionBadge: React.FC<ActionBadgeProps> = ({
  text,
  href,
  onClick,
  variant = 'secondary',
  className = ''
}) => {
  const Component = href ? 'a' : 'button';
  
  return (
    <Component
      href={href}
      className={`action-badge action-badge--${variant} ${className}`}
      onClick={onClick}
      type={!href ? 'button' : undefined}
    >
      <Badge variant="info" size="sm">{text}</Badge>
    </Component>
  );
};

export default ActionBadge;

