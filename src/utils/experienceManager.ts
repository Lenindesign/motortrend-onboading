/**
 * Experience Manager
 * Determines which home page layout to show based on user's vehicle data and shopping intent
 */

import homePageLayoutsDefault from '../config/homePageLayouts.json';
import { getVehicleBodyStyle } from './vehicleBodyStyles';

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
 * Get the current layout configuration based on user state
 */
export const getCurrentLayout = (): LayoutConfig => {
  const onboardingData = getOnboardingData();
  const experience = getExperience(onboardingData);
  const isShopperUser = isShopper(onboardingData?.userType);
  const layoutKey = getLayoutKey(experience, isShopperUser);

  // Try to get saved layouts from localStorage first
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

