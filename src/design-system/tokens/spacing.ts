/**
 * Design Tokens - Spacing
 * Extracted from Figma Community design system
 * 
 * USAGE GUIDELINES:
 * - Use base spacing (1-6) for component-level spacing
 * - Use section.gap for spacing between major page sections
 * - Use section.padding for internal section padding
 * - Use page.padding for container horizontal padding
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
  
  // Section spacing (legacy - use section.gap/padding instead)
  section: {
    vertical: '32px',      // 2rem standard vertical spacing between sections
    horizontal: '24px',
  },
} as const;

/**
 * UNIFORM SECTION SPACING SYSTEM
 * 
 * Use these values for consistent spacing between page sections.
 * All values follow an 8px base system for harmony.
 * 
 * CSS Variables:
 * - --section-gap-sm: 24px  (tight spacing)
 * - --section-gap-md: 40px  (standard spacing) 
 * - --section-gap-lg: 56px  (major breaks)
 * - --section-gap-xl: 72px  (hero sections)
 */
export const sectionSpacing = {
  // Gap between major page sections
  gap: {
    sm: '24px',   // Tight spacing between related sections
    md: '40px',   // Standard spacing between sections (DEFAULT)
    lg: '56px',   // Large spacing for major section breaks
    xl: '72px',   // Extra large for hero/featured sections
  },
  
  // Internal padding within sections
  padding: {
    sm: '16px',   // Compact section padding
    md: '24px',   // Standard section padding
    lg: '32px',   // Large section padding
    xl: '48px',   // Extra large for featured sections
  },
  
  // Page container horizontal padding
  page: {
    mobile: '16px',   // Mobile horizontal padding
    tablet: '24px',   // Tablet horizontal padding
    desktop: '0px',   // Desktop (uses max-width constraint)
  },
} as const;

// Maximum content width
export const maxWidth = {
  container: '1280px',  // Standard container max-width from design rules
  content: '1280px',    // Content area from Figma
} as const;

