/**
 * Design Tokens - Effects
 * Extracted from Figma Community design system
 * Includes shadows, border radius, transitions
 */

export const effects = {
  // Shadows (Depth system - Elevation-based)
  shadow: {
    depth0: 'none',
    depth1: '0px 1px 2px 0px rgba(20, 20, 22, 0.05)',   // Subtle elevation
    depth2: '0px 2px 4px 0px rgba(20, 20, 22, 0.08)',   // Low elevation
    depth3: '0px 4px 8px 0px rgba(20, 20, 22, 0.1)',    // Medium elevation
    depth4: '0px 4px 12px 0px rgba(20, 20, 22, 0.12)',   // High elevation
    depth5: '0px 4px 20px 0px rgba(20, 20, 22, 0.06)',   // Current standard
    depth6: '0px 8px 24px 0px rgba(20, 20, 22, 0.15)',   // Very high elevation
    depth7: '0px 12px 32px 0px rgba(20, 20, 22, 0.2)',   // Highest elevation
  },
  
  // Component-specific shadows
  shadowComponent: {
    card: '0px 4px 8px 0px rgba(20, 20, 22, 0.1)',
    cardHover: '0px 4px 12px 0px rgba(20, 20, 22, 0.12)',
    button: '0 1px 3px rgba(0, 0, 0, 0.1)',
    buttonHover: '0 4px 8px rgba(233, 12, 23, 0.3)',
    buttonPrimary: '0 2px 4px rgba(233, 12, 23, 0.2)',
    modal: '0 24px 48px rgba(0, 0, 0, 0.3)',
    modalLg: '0 20px 60px rgba(0, 0, 0, 0.3)',
    dropdown: '0px 4px 20px rgba(0, 0, 0, 0.15)',
  },
  
  // Text shadows
  textShadow: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
    md: '0 2px 4px rgba(0, 0, 0, 0.5)',
    lg: '0 4px 8px rgba(0, 0, 0, 0.6)',
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

