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

