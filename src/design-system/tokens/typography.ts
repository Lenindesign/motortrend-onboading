/**
 * Design Tokens - Typography
 * Extracted from Figma Community design system
 * Uses Poppins for headings and Geist for body text
 */

export const typography = {
  // Font Families
  fontFamily: {
    heading: 'Poppins, sans-serif',
    body: 'Geist, system-ui, -apple-system, sans-serif',
  },
  
  // Font Weights
  fontWeight: {
    regular: 400,
    medium: 600,
    bold: 700,
  },
  
  // Text Styles
  styles: {
    // Hero
    hero: {
      fontFamily: 'Poppins, sans-serif',
      fontWeight: 600,
      fontSize: '96px',
      lineHeight: '1em',
    },
    
    // Headings
    h5: {
      fontFamily: 'Poppins, sans-serif',
      fontWeight: 600,
      fontSize: '24px',
      lineHeight: '1.167em',
    },
    
    subtitle1: {
      fontFamily: 'Poppins, sans-serif',
      fontWeight: 600,
      fontSize: '18px',
      lineHeight: '1.333em',
    },
    
    // Body Text
    body2: {
      fontFamily: 'Geist, system-ui, sans-serif',
      fontWeight: 400,
      fontSize: '18px',
      lineHeight: '1.556em',
    },
    
    body3: {
      fontFamily: 'Geist, system-ui, sans-serif',
      fontWeight: 400,
      fontSize: '16px',
      lineHeight: '1.5em',
    },
    
    // Button
    button1: {
      fontFamily: 'Poppins, sans-serif',
      fontWeight: 600,
      fontSize: '16px',
      lineHeight: '1em',
    },
    
    // Captions
    caption1: {
      fontFamily: 'Geist, system-ui, sans-serif',
      fontWeight: 400,
      fontSize: '14px',
      lineHeight: '1.286em',
    },
    
    caption2: {
      fontFamily: 'Geist, system-ui, sans-serif',
      fontWeight: 400,
      fontSize: '12px',
      lineHeight: '1.333em',
    },
  },
} as const;

export type TypographyStyle = keyof typeof typography.styles;

