/**
 * Button Component
 * Based on Figma Community design system
 */

import React from 'react';
import './Button.css';

export type ButtonColor = 'blue' | 'red' | 'neutrals3' | 'toast-cancel' | 'toast-confirm';
export type ButtonSize = 'default' | 'large';
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
    'btn',
    color === 'toast-cancel' || color === 'toast-confirm' ? `btn--${color}` : `btn--${color}`,
    color === 'toast-cancel' || color === 'toast-confirm' ? '' : `btn--${size}`,
    color === 'toast-cancel' || color === 'toast-confirm' ? '' : `btn--${variant}`,
    fullWidth && 'btn--full-width',
    disabled && 'btn--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classNames} disabled={disabled} {...props}>
      {icon && iconPosition === 'left' && <span className="btn__icon btn__icon--left">{icon}</span>}
      <span className="btn__label">{children}</span>
      {icon && iconPosition === 'right' && <span className="btn__icon btn__icon--right">{icon}</span>}
    </button>
  );
};

export default Button;

