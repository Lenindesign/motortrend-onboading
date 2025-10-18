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
  
  // Component-specific spacing
  component: {
    padding: {
      xs: '6px',
      sm: '8px',
      md: '12px',
      lg: '16px',
      xl: '24px',
      xxl: '48px',
    },
    gap: {
      xs: '8px',
      sm: '12px',
      md: '16px',
      lg: '24px',
      xl: '32px',
      xxl: '48px',
    },
  },
  
  // Section spacing
  section: {
    vertical: '32px',      // 2rem standard vertical spacing between sections
    horizontal: '24px',
  },
} as const;

// Maximum content width
export const maxWidth = {
  container: '1040px',  // Standard container max-width from design rules
  content: '1280px',    // Content area from Figma
} as const;

