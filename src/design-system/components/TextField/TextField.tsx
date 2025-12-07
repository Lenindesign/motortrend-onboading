/**
 * TextField Component
 * Migrated to inline styles for Tailwind compatibility
 * Based on Figma Community design system
 */

import React, { useState } from 'react';

export interface TextFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: React.ReactNode;
  error?: string;
  helperText?: React.ReactNode;
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
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isIconHovered, setIsIconHovered] = useState(false);

  // Container styles
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-1, 8px)',
    width: fullWidth ? '100%' : undefined,
    ...style,
  };

  // Label styles
  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontWeight: 400,
    fontSize: '16px',
    lineHeight: 'normal',
    color: 'var(--color-neutrals-3, #353945)',
    letterSpacing: '0px',
  };

  // Input container styles
  const inputContainerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: disabled ? 'var(--color-neutrals-7, #F4F5F6)' : 'var(--color-neutrals-8, #FCFCFD)',
    border: `1px solid ${
      error 
        ? 'var(--color-primary-2, #E90C17)' 
        : isFocused 
          ? 'var(--color-blue, #186CEA)' 
          : 'var(--color-neutrals-5, #B1B5C3)'
    }`,
    borderRadius: 'var(--border-radius-md, 8px)',
    transition: 'border-color 150ms ease-in-out',
    cursor: disabled ? 'not-allowed' : undefined,
  };

  // Input styles
  const inputStyle: React.CSSProperties = {
    flex: 1,
    padding: '9px 15px',
    paddingLeft: icon && iconPosition === 'left' ? '40px' : '15px',
    paddingRight: icon && iconPosition === 'right' ? '40px' : '15px',
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontWeight: 400,
    fontSize: '18px',
    lineHeight: '1.556em',
    color: disabled ? 'var(--color-neutrals-4, #6E7481)' : 'var(--color-neutrals-1, #141416)',
    backgroundColor: 'transparent',
    border: 'none',
    outline: 'none',
    cursor: disabled ? 'not-allowed' : undefined,
  };

  // Icon styles
  const iconStyle: React.CSSProperties = {
    position: 'absolute',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    padding: 0,
    background: 'none',
    border: 'none',
    cursor: onIconClick ? 'pointer' : 'default',
    color: isIconHovered ? 'var(--color-neutrals-3, #353945)' : 'var(--color-neutrals-4, #6E7481)',
    transition: 'color 150ms ease-in-out',
    pointerEvents: onIconClick ? 'auto' : 'none',
    ...(iconPosition === 'left' ? { left: '12px' } : { right: '12px' }),
  };

  // Helper text styles
  const helperTextStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '1.286em',
    color: error ? 'var(--color-primary-2, #E90C17)' : 'var(--color-neutrals-4, #6E7481)',
  };

  return (
    <div className={className} style={containerStyle}>
      {label && (
        <label style={labelStyle}>
          {label}
        </label>
      )}
      <div style={inputContainerStyle}>
        {icon && iconPosition === 'left' && (
          <button
            type="button"
            style={iconStyle}
            onClick={onIconClick}
            onMouseEnter={() => setIsIconHovered(true)}
            onMouseLeave={() => setIsIconHovered(false)}
            tabIndex={-1}
            aria-hidden={!onIconClick}
          >
            {icon}
          </button>
        )}
        <input
          style={inputStyle}
          disabled={disabled}
          type={type}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {icon && iconPosition === 'right' && (
          <button
            type="button"
            style={iconStyle}
            onClick={onIconClick}
            onMouseEnter={() => setIsIconHovered(true)}
            onMouseLeave={() => setIsIconHovered(false)}
            tabIndex={-1}
            aria-hidden={!onIconClick}
          >
            {icon}
          </button>
        )}
      </div>
      {(error || helperText) && (
        <div style={helperTextStyle}>
          {error || helperText}
        </div>
      )}
    </div>
  );
};

export default TextField;
