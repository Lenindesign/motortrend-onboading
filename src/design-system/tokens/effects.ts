/**
 * Design Tokens - Effects
 * Extracted from Figma Community design system
 * Includes shadows, border radius, transitions
 */

export const effects = {
  // Shadows (Depth system)
  shadow: {
    depth5: '0px 4px 20px 0px rgba(20, 20, 22, 0.06)',
  },
  
  // Border Radius
  borderRadius: {
    none: '0px',
    sm: '4px',
    md: '8px',
    lg: '16px',
    full: '100px',
    circle: '400px',
  },
  
  // Transitions
  transition: {
    fast: '150ms ease-in-out',
    normal: '250ms ease-in-out',
    slow: '350ms ease-in-out',
  },
  
  // Border Weights
  borderWeight: {
    thin: '1px',
    medium: '2px',
    thick: '4px',
  },
} as const;

