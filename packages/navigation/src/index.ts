/**
 * MotorTrend Navigation Package
 * Exports the GlobalHeader component and its dependencies
 */

// Main component
export { 
  GlobalHeader, 
  type GlobalHeaderProps,
  type SearchResult,
  type FilterOptions,
  type Vehicle 
} from './components/GlobalHeader';

// Supporting components
export { Icon, type IconProps, type IconVariant } from './components/Icon';
export { Badge, type BadgeProps, type BadgeVariant, type BadgeSize } from './components/Badge';

// Types
export type { NavigationItem, MegaDropdown } from './types';

// Default export
export { GlobalHeader as default } from './components/GlobalHeader';

