/**
 * Button Component
 * Based on Figma Community design system
 */

import React from 'react';
import './Button.css';

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
  ...props
}) => {
  const classNames = [
    'cta',
    `cta--${color}`,
    `cta--${size}`,
    variant !== 'solid' && `cta--${variant}`,
    fullWidth && 'cta--full-width',
    // We rely on :disabled pseudo-class from global.css, but keep class for override flexibility if needed
    disabled && 'cta--disabled', 
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classNames} disabled={disabled} {...props}>
      {icon && iconPosition === 'left' && <span className="cta__icon cta__icon--left">{icon}</span>}
      <span className="cta__label">{children}</span>
      {icon && iconPosition === 'right' && <span className="cta__icon cta__icon--right">{icon}</span>}
    </button>
  );
};

export default Button;
