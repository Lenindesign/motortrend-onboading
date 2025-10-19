/**
 * Material Icon Component
 * Wrapper for Google Material Icons
 */

import React from 'react';
import './Icon.css';

export type IconVariant = 'outlined' | 'filled' | 'rounded' | 'sharp';

export interface IconProps {
  name: string;
  variant?: IconVariant;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const Icon: React.FC<IconProps> = ({ 
  name, 
  variant = 'outlined',
  size,
  className = '',
  style = {}
}) => {
  const iconClass = variant === 'outlined' 
    ? 'material-symbols-outlined' 
    : variant === 'filled'
    ? 'material-icons'
    : variant === 'rounded'
    ? 'material-icons-round'
    : 'material-icons-sharp';

  const iconStyle = size ? { ...style, fontSize: `${size}px` } : style;

  return (
    <span className={`icon ${iconClass} ${className}`} style={iconStyle}>
      {name}
    </span>
  );
};

export default Icon;

