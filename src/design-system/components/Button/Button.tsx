/**
 * Button Component
 * Migrated to inline styles for Tailwind compatibility
 * Based on Figma Community design system
 */

import React, { useState } from 'react';

export type ButtonColor = 'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'blue' | 'red' | 'neutrals3' | 'toast-cancel' | 'toast-confirm';
export type ButtonSize = 'small' | 'default' | 'large';
export type ButtonVariant = 'solid' | 'ghost' | 'outline';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: ButtonColor;
  size?: ButtonSize;
  variant?: ButtonVariant;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children: React.ReactNode;
}

// Size configurations
const sizeConfig: Record<ButtonSize, { padding: string; fontSize: string; height: string }> = {
  small: { padding: '6px 12px', fontSize: '12px', height: '28px' },
  default: { padding: '8px 16px', fontSize: '14px', height: '36px' },
  large: { padding: '12px 24px', fontSize: '16px', height: '44px' },
};

// Color configurations for solid variant
const colorConfig: Record<ButtonColor, { 
  background: string; 
  color: string; 
  hoverBackground: string;
  hoverColor?: string;
  padding?: string;
  boxShadow?: string;
}> = {
  primary: { 
    background: 'var(--color-primary-1, #E90C17)', 
    color: '#FFFFFF',
    hoverBackground: 'var(--color-neutrals-1, #141416)',
  },
  secondary: { 
    background: '#353945', 
    color: '#FFFFFF',
    hoverBackground: '#2a2d35',
  },
  neutral: { 
    background: 'var(--color-neutrals-5, #B1B5C3)', 
    color: '#FFFFFF',
    hoverBackground: 'var(--color-neutrals-4, #6E7481)',
  },
  success: { 
    background: '#34A853', 
    color: '#FFFFFF',
    hoverBackground: '#2d8f47',
  },
  warning: { 
    background: '#F59E0B', 
    color: '#FFFFFF',
    hoverBackground: '#D97706',
  },
  blue: { 
    background: '#353945', 
    color: '#FFFFFF',
    hoverBackground: '#2a2d35',
  },
  red: { 
    background: 'var(--color-primary-1, #E90C17)', 
    color: '#FFFFFF',
    hoverBackground: 'var(--color-neutrals-1, #141416)',
  },
  neutrals3: { 
    background: '#353945', 
    color: '#FCFCFD',
    hoverBackground: 'var(--color-neutrals-6, #E6E8EC)',
    hoverColor: 'var(--color-neutrals-2, #23262F)',
  },
  'toast-cancel': { 
    background: 'var(--color-neutrals-7, #F4F5F6)', 
    color: 'var(--color-neutrals-2, #23262F)',
    hoverBackground: 'var(--color-neutrals-6, #E6E8EC)',
    padding: '8px 16px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  'toast-confirm': { 
    background: 'var(--color-primary-1, #E90C17)', 
    color: '#FFFFFF',
    hoverBackground: 'var(--color-neutrals-1, #141416)',
    padding: '8px 16px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
};

// Ghost variant overrides
const ghostConfig: Record<ButtonColor, { color: string; hoverBackground: string }> = {
  primary: { color: 'var(--color-primary-1, #E90C17)', hoverBackground: 'rgba(233, 12, 23, 0.1)' },
  secondary: { color: '#353945', hoverBackground: 'rgba(53, 57, 69, 0.1)' },
  neutral: { color: 'var(--color-neutrals-5, #B1B5C3)', hoverBackground: 'rgba(177, 181, 195, 0.1)' },
  success: { color: '#34A853', hoverBackground: 'rgba(52, 168, 83, 0.1)' },
  warning: { color: '#F59E0B', hoverBackground: 'rgba(245, 158, 11, 0.1)' },
  blue: { color: 'var(--color-blue, #186CEA)', hoverBackground: 'rgba(24, 108, 234, 0.1)' },
  red: { color: 'var(--color-primary-2, #E90C17)', hoverBackground: 'rgba(233, 12, 23, 0.1)' },
  neutrals3: { color: 'var(--color-neutrals-5, #B1B5C3)', hoverBackground: 'var(--color-neutrals-2, #23262F)' },
  'toast-cancel': { color: 'var(--color-neutrals-2, #23262F)', hoverBackground: 'rgba(35, 38, 47, 0.1)' },
  'toast-confirm': { color: 'var(--color-primary-1, #E90C17)', hoverBackground: 'rgba(233, 12, 23, 0.1)' },
};

// Outline variant overrides
const outlineConfig: Record<ButtonColor, { color: string; borderColor: string; hoverBackground: string }> = {
  primary: { color: 'var(--color-primary-1, #E90C17)', borderColor: 'var(--color-primary-1, #E90C17)', hoverBackground: 'rgba(233, 12, 23, 0.1)' },
  secondary: { color: '#353945', borderColor: '#353945', hoverBackground: 'rgba(53, 57, 69, 0.1)' },
  neutral: { color: 'var(--color-neutrals-5, #B1B5C3)', borderColor: 'var(--color-neutrals-5, #B1B5C3)', hoverBackground: 'rgba(177, 181, 195, 0.1)' },
  success: { color: '#34A853', borderColor: '#34A853', hoverBackground: 'rgba(52, 168, 83, 0.1)' },
  warning: { color: '#F59E0B', borderColor: '#F59E0B', hoverBackground: 'rgba(245, 158, 11, 0.1)' },
  blue: { color: 'var(--color-blue, #186CEA)', borderColor: 'var(--color-blue, #186CEA)', hoverBackground: 'rgba(24, 108, 234, 0.1)' },
  red: { color: 'var(--color-primary-2, #E90C17)', borderColor: 'var(--color-primary-2, #E90C17)', hoverBackground: 'rgba(233, 12, 23, 0.1)' },
  neutrals3: { color: 'var(--color-neutrals-5, #B1B5C3)', borderColor: 'var(--color-neutrals-5, #B1B5C3)', hoverBackground: 'var(--color-neutrals-2, #23262F)' },
  'toast-cancel': { color: 'var(--color-neutrals-2, #23262F)', borderColor: 'var(--color-neutrals-2, #23262F)', hoverBackground: 'rgba(35, 38, 47, 0.1)' },
  'toast-confirm': { color: 'var(--color-primary-1, #E90C17)', borderColor: 'var(--color-primary-1, #E90C17)', hoverBackground: 'rgba(233, 12, 23, 0.1)' },
};

export const Button: React.FC<ButtonProps> = ({
  color = 'neutrals3',
  size = 'default',
  variant = 'solid',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  children,
  className = '',
  disabled = false,
  style,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const sizeStyle = sizeConfig[size];
  const colorStyle = colorConfig[color];

  // Build base style
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    border: 'none',
    borderRadius: 'var(--border-radius-sm, 4px)',
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontWeight: 600,
    lineHeight: '1em',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    boxShadow: colorStyle.boxShadow || '0 1px 3px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    overflow: 'hidden',
    opacity: disabled ? 0.5 : 1,
    width: fullWidth ? '100%' : undefined,
    // Size
    padding: colorStyle.padding || sizeStyle.padding,
    fontSize: sizeStyle.fontSize,
    height: sizeStyle.height,
  };

  // Apply variant-specific styles
  if (variant === 'solid') {
    baseStyle.backgroundColor = isHovered && !disabled ? colorStyle.hoverBackground : colorStyle.background;
    baseStyle.color = isHovered && !disabled && colorStyle.hoverColor ? colorStyle.hoverColor : colorStyle.color;
    if (isHovered && !disabled) {
      baseStyle.transform = 'translateY(-1px)';
      baseStyle.boxShadow = '0 4px 8px rgba(20, 20, 22, 0.2)';
    }
  } else if (variant === 'ghost') {
    const ghost = ghostConfig[color];
    baseStyle.backgroundColor = isHovered && !disabled ? ghost.hoverBackground : 'transparent';
    baseStyle.color = ghost.color;
    baseStyle.boxShadow = 'none';
    if (isHovered && !disabled) {
      baseStyle.transform = 'translateY(-1px)';
    }
  } else if (variant === 'outline') {
    const outline = outlineConfig[color];
    baseStyle.backgroundColor = isHovered && !disabled ? outline.hoverBackground : 'transparent';
    baseStyle.color = outline.color;
    baseStyle.border = `1px solid ${outline.borderColor}`;
    baseStyle.boxShadow = 'none';
    if (isHovered && !disabled) {
      baseStyle.transform = 'translateY(-1px)';
    }
  }

  // Icon styles
  const iconStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
  };

  // Label styles
  const labelStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
  };

  return (
    <button 
      className={className}
      style={{ ...baseStyle, ...style }}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {icon && iconPosition === 'left' && <span style={iconStyle}>{icon}</span>}
      <span style={labelStyle}>{children}</span>
      {icon && iconPosition === 'right' && <span style={iconStyle}>{icon}</span>}
    </button>
  );
};

export default Button;
