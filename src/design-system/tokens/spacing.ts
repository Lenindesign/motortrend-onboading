/**
 * Design Tokens - Spacing
 * Extracted from Figma Community design system
 */

export const spacing = {
  // Base spacing unit (8px system)
  0: '0px',
  1: '8px',
  2: '16px',
  3: '24px',
  4: '32px',
  5: '40px',
  6: '48px',
  
  // Component-specific spacing (8px-based system)
  component: {
    padding: {
      xs: '4px',    // Tight spacing (half base)
      sm: '8px',    // Small padding (1x base)
      md: '12px',   // Medium padding (1.5x base)
      lg: '16px',   // Large padding (2x base)
      xl: '24px',   // Extra large (3x base)
      xxl: '32px',  // 2XL padding (4x base)
    },
    gap: {
      xs: '4px',
      sm: '8px',
      md: '12px',
      lg: '16px',
      xl: '24px',
      xxl: '32px',
    },
  },
  
  // Button-specific padding
  button: {
    xs: '6px 12px',   // Small button
    sm: '8px 16px',   // Default button
    md: '12px 24px',  // Large button
    lg: '16px 32px',  // Extra large button
  },
  
  // Card-specific padding
  card: {
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  
  // Modal/Dialog spacing
  modal: {
    xs: '16px',
    sm: '20px',
    md: '24px',
    lg: '32px',
    xl: '40px',
  },
  
  // Grid spacing
  grid: {
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  
  // Section spacing
  section: {
    vertical: '32px',      // 2rem standard vertical spacing between sections
    horizontal: '24px',
  },
} as const;

// Maximum content width
export const maxWidth = {
  container: '1280px',  // Standard container max-width from design rules
  content: '1280px',    // Content area from Figma
} as const;

