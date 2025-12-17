/**
 * Badge Atom
 * Standardized badge component with semantic variants
 */

import React from 'react';

export type BadgeVariant = 
  | 'new' 
  | 'premium' 
  | 'verified' 
  | 'info' 
  | 'success' 
  | 'warning' 
  | 'error'
  | 'neutral';

export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
  icon?: React.ReactNode;
  outline?: boolean;
  /** Makes the badge circular - ideal for notification counts */
  circle?: boolean;
  onClick?: () => void;
  'aria-label'?: string;
  style?: React.CSSProperties;
}

// Size: padding-y padding-x font-size gap
const sizeStyles: Record<BadgeSize, React.CSSProperties> = {
  sm: { padding: '6px 12px', fontSize: '11px', gap: '4px' },
  md: { padding: '8px 20px', fontSize: '12px', gap: '4px' },
  lg: { padding: '10px 24px', fontSize: '14px', gap: '4px' },
};

// Circle badge sizes - fixed dimensions for circular badges
const circleSizeStyles: Record<BadgeSize, React.CSSProperties> = {
  sm: { width: '18px', height: '18px', fontSize: '10px', padding: '0' },
  md: { width: '22px', height: '22px', fontSize: '11px', padding: '0' },
  lg: { width: '28px', height: '28px', fontSize: '13px', padding: '0' },
};

// Variant colors - Using CSS variables from design system
const variantStyles: Record<BadgeVariant, { bg: string; color: string }> = {
  neutral: { 
    bg: 'var(--color-neutrals-6, #E6E8EC)', 
    color: 'var(--color-neutrals-3, #353945)' 
  },
  new: { 
    bg: 'var(--color-primary-1, #E90C17)', 
    color: 'var(--color-white, #FFFFFF)' 
  },
  premium: { 
    bg: 'var(--color-neutrals-1, #141416)', 
    color: 'var(--color-white, #FFFFFF)' 
  },
  verified: { 
    bg: 'var(--color-secondary-1, #0865b4)', 
    color: 'var(--color-white, #FFFFFF)' 
  },
  info: { 
    bg: 'var(--color-semantic-info-light, #c1eaff)', 
    color: 'var(--color-info-1, #1d3b54)' 
  },
  success: { 
    bg: 'var(--color-semantic-success-light, #e7f4e7)', 
    color: 'var(--color-success-1, #283d32)' 
  },
  warning: { 
    bg: 'var(--color-semantic-warning-light, #fff1df)', 
    color: 'var(--color-warning-1, #553925)' 
  },
  error: { 
    bg: 'var(--color-semantic-error-light, #fae5e5)', 
    color: 'var(--color-error-1, #4c272e)' 
  },
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  icon,
  outline = false,
  circle = false,
  onClick,
  'aria-label': ariaLabel,
  style: customStyle,
}) => {
  const sizeStyle = circle ? circleSizeStyles[size] : sizeStyles[size];
  const variantStyle = variantStyles[variant];

  const style: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-body, Geist, system-ui, sans-serif)',
    fontWeight: circle ? 600 : 800,
    borderRadius: circle ? '50%' : 'var(--border-radius-sm, 4px)',
    transition: 'var(--transition-fast, 150ms ease-in-out)',
    whiteSpace: 'nowrap',
    lineHeight: 1,
    cursor: onClick ? 'pointer' : 'default',
    // Size
    padding: sizeStyle.padding,
    fontSize: sizeStyle.fontSize,
    gap: circle ? '0' : (sizeStyles[size].gap || '4px'),
    // Circle-specific sizing
    ...(circle && {
      width: sizeStyle.width,
      height: sizeStyle.height,
      minWidth: sizeStyle.width,
      minHeight: sizeStyle.height,
    }),
    // Variant
    backgroundColor: outline ? 'transparent' : variantStyle.bg,
    color: variantStyle.color,
    border: outline ? '1px solid currentColor' : 'none',
    ...customStyle,
  };

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.stopPropagation();
      onClick();
    }
  };

  const Content = (
    <>
      {icon && <span style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}>{icon}</span>}
      <span>{children}</span>
    </>
  );

  if (onClick) {
    return (
      <button
        className={className}
        style={style}
        onClick={handleClick}
        aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
        type="button"
      >
        {Content}
      </button>
    );
  }

  return (
    <span className={className} style={style} aria-label={ariaLabel} role={ariaLabel ? 'status' : undefined}>
      {Content}
    </span>
  );
};

export default Badge;
