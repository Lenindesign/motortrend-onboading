/**
 * Experience Manager
 * Determines which home page layout to show based on user's vehicle data and shopping intent
 * 
 * This module bridges the Journey Builder (which saves layouts) with the Home page (which renders them).
 * It supports both Supabase (production) and localStorage (fallback) for layout storage.
 */

import homePageLayoutsDefault from '../config/homePageLayouts.json';
import { getVehicleBodyStyle } from './vehicleBodyStyles';
import { getLayouts as getLayoutsFromService, type LayoutKey as ServiceLayoutKey } from '../services/journeyLayoutService';

export type ExperienceKey = 'A' | 'B' | 'C' | 'D';
export type LayoutKey = 'A-shopper' | 'A-browser' | 'B-shopper' | 'B-browser' | 'C-shopper' | 'C-browser' | 'D-shopper' | 'D-browser';

export interface SectionConfig {
  componentId: string;
  props: Record<string, string | number | boolean>;
  enabled: boolean;
}

export interface LayoutConfig {
  id: string;
  name: string;
  description: string;
  experience: string;
  isShopper: boolean;
  sections: SectionConfig[];
}

export interface OnboardingData {
  userType?: 'buyer' | 'enthusiast' | 'both' | null;
  vehicles?: Array<{
    name: string;
    ownership: 'own' | 'want';
  }>;
  persona?: string;
}

// Cache for layouts to avoid repeated fetches
let layoutsCache: Record<LayoutKey, LayoutConfig> | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 30000; // 30 seconds

/**
 * Get the user's experience based on their vehicle data
 * A: Want ✓ + Own ✓ (full data)
 * B: Want ✓ + Own ✗ (shopping only)
 * C: Want ✗ + Own ✓ (owner only)
 * D: Want ✗ + Own ✗ (no data)
 */
export const getExperience = (onboardingData: OnboardingData | null): ExperienceKey => {
  if (!onboardingData || !onboardingData.vehicles || onboardingData.vehicles.length === 0) {
    return 'D';
  }

  const vehicles = onboardingData.vehicles;
  const hasWantVehicles = vehicles.some(v => v.ownership === 'want');
  const hasOwnVehicles = vehicles.some(v => v.ownership === 'own');

  if (hasWantVehicles && hasOwnVehicles) return 'A';
  if (hasWantVehicles && !hasOwnVehicles) return 'B';
  if (!hasWantVehicles && hasOwnVehicles) return 'C';
  return 'D';
};

/**
 * Determine if user is a shopper based on their userType
 * Shoppers: buyer, both
 * Browsers: enthusiast, null/undefined
 */
export const isShopper = (userType: string | null | undefined): boolean => {
  return userType === 'buyer' || userType === 'both';
};

/**
 * Get the layout key based on experience and shopper status
 */
export const getLayoutKey = (experience: ExperienceKey, isShopperUser: boolean): LayoutKey => {
  return `${experience}-${isShopperUser ? 'shopper' : 'browser'}` as LayoutKey;
};

/**
 * Get onboarding data from localStorage
 */
export const getOnboardingData = (): OnboardingData | null => {
  try {
    const data = localStorage.getItem('onboardingData');
    if (data) {
      return JSON.parse(data) as OnboardingData;
    }
  } catch (error) {
    console.error('Error reading onboarding data:', error);
  }
  return null;
};

/**
 * Get the current layout configuration based on user state (synchronous - uses cache)
 */
export const getCurrentLayout = (): LayoutConfig => {
  const onboardingData = getOnboardingData();
  const experience = getExperience(onboardingData);
  const isShopperUser = isShopper(onboardingData?.userType);
  const layoutKey = getLayoutKey(experience, isShopperUser);

  // Use cached layouts if available and fresh
  if (layoutsCache && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return layoutsCache[layoutKey] || layoutsCache['D-browser'];
  }

  // Fallback to localStorage/default if cache is stale
  let layouts = homePageLayoutsDefault.layouts as Record<LayoutKey, LayoutConfig>;
  
  try {
    const savedLayouts = localStorage.getItem('homePageLayouts');
    if (savedLayouts) {
      const parsed = JSON.parse(savedLayouts);
      if (parsed.layouts) {
        layouts = parsed.layouts as Record<LayoutKey, LayoutConfig>;
      }
    }
  } catch (error) {
    console.error('Error reading saved layouts:', error);
  }

  return layouts[layoutKey] || layouts['D-browser'];
};

/**
 * Get the current layout configuration asynchronously (fetches from Supabase)
 */
export const getCurrentLayoutAsync = async (): Promise<LayoutConfig> => {
  const onboardingData = getOnboardingData();
  const experience = getExperience(onboardingData);
  const isShopperUser = isShopper(onboardingData?.userType);
  const layoutKey = getLayoutKey(experience, isShopperUser);

  try {
    // Fetch from Supabase via journeyLayoutService
    const layouts = await getLayoutsFromService();
    
    // Update cache
    layoutsCache = layouts as Record<LayoutKey, LayoutConfig>;
    cacheTimestamp = Date.now();
    
    return layouts[layoutKey as ServiceLayoutKey] || layouts['D-browser'];
  } catch (error) {
    console.error('Error fetching layouts from service:', error);
    // Fallback to synchronous method
    return getCurrentLayout();
  }
};

/**
 * Get all layouts asynchronously (for components that need all layouts)
 */
export const getAllLayoutsAsync = async (): Promise<Record<LayoutKey, LayoutConfig>> => {
  try {
    const layouts = await getLayoutsFromService();
    
    // Update cache
    layoutsCache = layouts as Record<LayoutKey, LayoutConfig>;
    cacheTimestamp = Date.now();
    
    return layouts as Record<LayoutKey, LayoutConfig>;
  } catch (error) {
    console.error('Error fetching all layouts:', error);
    return homePageLayoutsDefault.layouts as Record<LayoutKey, LayoutConfig>;
  }
};

/**
 * Invalidate the layouts cache (call this when layouts are updated)
 */
export const invalidateLayoutsCache = (): void => {
  layoutsCache = null;
  cacheTimestamp = 0;
};

/**
 * Get user's preferred body style based on their "want" vehicles
 */
export const getPreferredBodyStyle = (): 'SUV' | 'Sedan' | 'Truck' | 'Coupe' => {
  try {
    const onboardingData = getOnboardingData();
    if (onboardingData?.vehicles) {
      const wantVehicles = onboardingData.vehicles.filter(v => v.ownership === 'want');
      if (wantVehicles.length > 0) {
        const bodyStyles = getVehicleBodyStyle(wantVehicles[0].name);
        if (bodyStyles.length > 0) {
          const style = bodyStyles[0];
          if (style === 'SUV' || style === 'Sedan' || style === 'Truck' || style === 'Coupe') {
            return style;
          }
        }
      }
    }
  } catch (error) {
    console.error('Error getting preferred body style:', error);
  }
  return 'SUV';
};

/**
 * Resolve dynamic props in section configuration
 */
export const resolveDynamicProps = (
  props: Record<string, string | number | boolean>
): Record<string, string | number | boolean> => {
  const resolved: Record<string, string | number | boolean> = {};
  
  for (const [key, value] of Object.entries(props)) {
    if (typeof value === 'string' && value.startsWith('dynamic:')) {
      const dynamicKey = value.replace('dynamic:', '');
      if (dynamicKey === 'preferredBodyStyle') {
        resolved[key] = getPreferredBodyStyle();
      } else {
        resolved[key] = value; // Keep as-is if unknown dynamic key
      }
    } else {
      resolved[key] = value;
    }
  }
  
  return resolved;
};

/**
 * Get debug info about current user state
 */
export const getDebugInfo = () => {
  const onboardingData = getOnboardingData();
  const experience = getExperience(onboardingData);
  const isShopperUser = isShopper(onboardingData?.userType);
  const layoutKey = getLayoutKey(experience, isShopperUser);
  const layout = getCurrentLayout();

  return {
    onboardingData,
    experience,
    isShopper: isShopperUser,
    layoutKey,
    layoutName: layout.name,
    sectionsCount: layout.sections.length,
    enabledSections: layout.sections.filter(s => s.enabled).length,
  };
};

