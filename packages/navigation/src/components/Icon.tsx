/**
 * Material Icon Component
 * Wrapper for Google Material Icons
 */

import React from 'react';

export type IconVariant = 'outlined' | 'filled' | 'rounded' | 'sharp';

export interface IconProps {
  name: string;
  variant?: IconVariant;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

const variantClassMap: Record<IconVariant, string> = {
  outlined: 'material-symbols-outlined',
  filled: 'material-icons',
  rounded: 'material-icons-round',
  sharp: 'material-icons-sharp',
};

export const Icon: React.FC<IconProps> = ({ 
  name, 
  variant = 'outlined',
  size,
  className = '',
  style = {}
}) => {
  const iconClass = variantClassMap[variant];

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none',
    verticalAlign: 'middle',
    lineHeight: 1,
    fontSize: size ? `${size}px` : '24px',
    letterSpacing: 'normal',
    textTransform: 'none',
    whiteSpace: 'nowrap',
    wordWrap: 'normal',
    direction: 'ltr',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    textRendering: 'optimizeLegibility',
    fontFeatureSettings: '"liga"',
    ...style,
  };

  return (
    <span className={`${iconClass} ${className}`} style={baseStyle}>
      {name}
    </span>
  );
};

export default Icon;
















