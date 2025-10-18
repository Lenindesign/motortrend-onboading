/**
 * TextField Component
 * Based on Figma Community design system
 */

import React, { useState } from 'react';
import './TextField.css';

export interface TextFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  onIconClick?: () => void;
}

export const TextField: React.FC<TextFieldProps> = ({
  label,
  error,
  helperText,
  fullWidth = false,
  icon,
  iconPosition = 'right',
  onIconClick,
  className = '',
  disabled = false,
  type = 'text',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const containerClassNames = [
    'text-field',
    fullWidth && 'text-field--full-width',
    error && 'text-field--error',
    disabled && 'text-field--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const inputClassNames = [
    'text-field__input',
    icon && `text-field__input--icon-${iconPosition}`,
    isFocused && 'text-field__input--focused',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClassNames}>
      {label && (
        <label className="text-field__label">
          {label}
        </label>
      )}
      <div className="text-field__input-container">
        {icon && iconPosition === 'left' && (
          <button
            type="button"
            className="text-field__icon text-field__icon--left"
            onClick={onIconClick}
            tabIndex={-1}
            aria-hidden={!onIconClick}
          >
            {icon}
          </button>
        )}
        <input
          className={inputClassNames}
          disabled={disabled}
          type={type}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {icon && iconPosition === 'right' && (
          <button
            type="button"
            className="text-field__icon text-field__icon--right"
            onClick={onIconClick}
            tabIndex={-1}
            aria-hidden={!onIconClick}
          >
            {icon}
          </button>
        )}
      </div>
      {(error || helperText) && (
        <div className={`text-field__helper-text ${error ? 'text-field__helper-text--error' : ''}`}>
          {error || helperText}
        </div>
      )}
    </div>
  );
};

export default TextField;

