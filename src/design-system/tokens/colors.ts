/**
 * Design Tokens - Colors
 * Extracted from Figma Community design system
 */

export const colors = {
  // Neutrals Palette
  neutrals: {
    1: '#141416',  // Darkest - Headers, footers
    2: '#23262F',  // Dark backgrounds
    3: '#353945',  // Medium dark - Buttons, borders
    4: '#6E7481',  // Medium - Secondary text
    5: '#B1B5C3',  // Light - Tertiary text, placeholders
    6: '#E6E8EC',  // Very light - Borders
    7: '#F4F5F6',  // Near white - Backgrounds
    8: '#FCFCFD',  // White - Text on dark, input backgrounds
  },
  
  // Primary Colors
  primary: {
    1: '#E90C17',  // MotorTrend Red (lighter)
    2: '#E90C17',  // MotorTrend Red (standard)
  },
  
  // Semantic Colors
  blue: '#186CEA',
  
  // Pure colors
  white: '#FFFFFF',
  black: '#000000',
  
  // Semantic Status Colors
  semantic: {
    success: {
      base: '#34A853',
      light: '#E8F5E9',
      dark: '#2E7D32',
    },
    warning: {
      base: '#F59E0B',
      light: '#FFF3E0',
      dark: '#D97706',
    },
    error: {
      base: '#EA4335',
      light: '#FFEBEE',
      dark: '#C62828',
    },
    info: {
      base: '#186CEA',
      light: '#E3F2FD',
      dark: '#1976D2',
    },
  },
  
  // Rating Colors
  rating: {
    motortrend: '#FFB74D',   // MotorTrend rating (orange)
    community: '#33CCFF',    // Community rating (cyan)
    staff: '#FFB74D',        // Staff rating (orange)
  },
  
  // State Colors
  state: {
    hover: {
      overlay: 'rgba(0, 0, 0, 0.1)',
      overlayDark: 'rgba(0, 0, 0, 0.2)',
    },
    active: {
      overlay: 'rgba(0, 0, 0, 0.15)',
    },
    disabled: {
      bg: '#353945',  // neutrals-3
      text: '#B1B5C3', // neutrals-5
      opacity: 0.5,
    },
  },
  
  // Overlay Colors
  overlay: {
    light: 'rgba(0, 0, 0, 0.5)',
    medium: 'rgba(0, 0, 0, 0.7)',
    dark: 'rgba(0, 0, 0, 0.9)',
  },
  
  // Gradient Overlay Colors
  gradientOverlay: {
    start: 'rgba(0, 0, 0, 0.9)',
    mid: 'rgba(0, 0, 0, 0.7)',
    end: 'rgba(0, 0, 0, 0)',
  },
  
  // Additional Neutrals (found in components)
  neutralsExtended: {
    '2.5': '#282a30',  // Between neutrals-2 and neutrals-3
    '3.5': '#374151',  // Between neutrals-3 and neutrals-4
  },
  
  // Social Brand Colors
  social: {
    google: {
      blue: '#4285F4',
      green: '#34A853',
      yellow: '#FBBC05',
      red: '#EA4335',
    },
    facebook: '#186CEA',
    apple: '#000000',
  },
} as const;

// Color utility types
export type NeutralColor = keyof typeof colors.neutrals;
export type PrimaryColor = keyof typeof colors.primary;

