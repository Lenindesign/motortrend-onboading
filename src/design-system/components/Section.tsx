/**
 * Section Component
 * 
 * A standardized wrapper component that provides consistent vertical spacing
 * for all page sections. This eliminates the need to manually set margins/padding
 * in individual components.
 * 
 * USAGE:
 * - Wrap any section content with <Section> to get consistent padding
 * - Parent containers should use CSS gap for spacing BETWEEN sections
 * - Section component handles INTERNAL padding only
 * 
 * SPACING RULES:
 * - Sections do NOT add external margins (parent's gap handles that)
 * - Internal padding follows design system tokens
 * - Full-width sections extend to edges but keep internal padding
 */

import React from 'react';

export type SectionPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';
export type SectionBackground = 'transparent' | 'white' | 'light' | 'dark' | 'primary';

export interface SectionProps {
  /** Content to render inside the section */
  children: React.ReactNode;
  /** Internal vertical padding size */
  padding?: SectionPadding;
  /** Background color variant */
  background?: SectionBackground;
  /** Whether section should span full viewport width */
  fullWidth?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Custom inline styles (use sparingly) */
  style?: React.CSSProperties;
  /** HTML element to render as */
  as?: 'section' | 'div' | 'article' | 'aside';
  /** Accessible label for the section */
  'aria-label'?: string;
  /** ID for anchor linking */
  id?: string;
}

// Padding values from design system
const paddingMap: Record<SectionPadding, string> = {
  none: '0',
  sm: 'var(--section-padding-sm, 16px)',
  md: 'var(--section-padding-md, 24px)',
  lg: 'var(--section-padding-lg, 32px)',
  xl: 'var(--section-padding-xl, 48px)',
};

// Background values from design system
const backgroundMap: Record<SectionBackground, string> = {
  transparent: 'transparent',
  white: 'var(--color-white, #FFFFFF)',
  light: 'var(--color-neutrals-7, #F4F5F6)',
  dark: 'var(--color-neutrals-2, #23262F)',
  primary: 'var(--color-primary-1, #E90C17)',
};

export const Section: React.FC<SectionProps> = ({
  children,
  padding = 'md',
  background = 'transparent',
  fullWidth = false,
  className = '',
  style,
  as: Component = 'section',
  'aria-label': ariaLabel,
  id,
}) => {
  const baseStyles: React.CSSProperties = {
    width: '100%',
    maxWidth: fullWidth ? 'none' : 'var(--max-width-container, 1280px)',
    margin: fullWidth ? '0' : '0 auto',
    paddingTop: paddingMap[padding],
    paddingBottom: paddingMap[padding],
    paddingLeft: fullWidth ? '0' : 'var(--page-padding-desktop, 0)',
    paddingRight: fullWidth ? '0' : 'var(--page-padding-desktop, 0)',
    backgroundColor: backgroundMap[background],
    // NO external margins - parent container's gap handles spacing between sections
  };

  // Combine base styles with any custom styles
  const combinedStyles: React.CSSProperties = {
    ...baseStyles,
    ...style,
  };

  // Build class names
  const classNames = [
    'section',
    `section--padding-${padding}`,
    `section--bg-${background}`,
    fullWidth && 'section--full-width',
    className,
  ].filter(Boolean).join(' ');

  return (
    <Component
      id={id}
      className={classNames}
      style={combinedStyles}
      aria-label={ariaLabel}
    >
      {fullWidth ? (
        <div className="section__inner" style={{
          maxWidth: 'var(--max-width-container, 1280px)',
          margin: '0 auto',
          paddingLeft: 'var(--page-padding-desktop, 0)',
          paddingRight: 'var(--page-padding-desktop, 0)',
        }}>
          {children}
        </div>
      ) : (
        children
      )}
    </Component>
  );
};

export default Section;









