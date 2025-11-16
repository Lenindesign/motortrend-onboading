/**
 * Personas System
 * Defines user personas and their content preferences for personalization
 */

import type { ContentCategory } from './contentFiltering';

export type PersonaName =
  | 'Gearhead Greg'
  | 'Technology Geek Theo'
  | 'DIY Road Warrior Jayden'
  | 'Classic Collector Carl'
  | 'Practical Paula'
  | 'Deal Hunter Dan'
  | 'Luxury Upgrader Leo'
  | 'Curious Explorer Casey';

export type PrimaryContentType = 'Reviews' | 'Features' | 'Cars' | 'Other';

export interface Persona {
  name: PersonaName;
  displayName: string; // Shorter name for display (e.g., "Paula", "Greg")
  tribe: 'Enthusiast' | 'Car Shoppers';
  description: string;
  primaryContentType: PrimaryContentType;
  priorityCategories: ContentCategory[];
  preferredArticleTypes: string[];
  preferredVehicleTypes: string[];
}

/**
 * Persona definitions based on the provided personas
 */
export const personas: Record<PersonaName, Persona> = {
  'Gearhead Greg': {
    name: 'Gearhead Greg',
    displayName: 'Greg',
    tribe: 'Enthusiast',
    description: 'Performance & tech-focused user who loves reviews',
    primaryContentType: 'Reviews',
    priorityCategories: ['Performance & Enthusiast', 'Adventure & Off-Road'],
    preferredArticleTypes: ['Reviews', 'First Test', 'Comparison'],
    preferredVehicleTypes: ['Performance', 'Sports Car', 'Hot Hatch', 'Muscle Car'],
  },
  'Technology Geek Theo': {
    name: 'Technology Geek Theo',
    displayName: 'Theo',
    tribe: 'Enthusiast',
    description: 'Tech-focused enthusiast interested in features and innovation',
    primaryContentType: 'Features',
    priorityCategories: ['Eco & Future-Ready', 'Performance & Enthusiast'],
    preferredArticleTypes: ['Features', 'First-Look', 'News'],
    preferredVehicleTypes: ['EV', 'Hybrid', 'Tech-Forward', 'Performance'],
  },
  'DIY Road Warrior Jayden': {
    name: 'DIY Road Warrior Jayden',
    displayName: 'Jayden',
    tribe: 'Enthusiast',
    description: 'DIY enthusiast and adventure seeker',
    primaryContentType: 'Other',
    priorityCategories: ['Adventure & Off-Road', 'Utility & Work'],
    preferredArticleTypes: ['How-To', 'Features', 'Reviews'],
    preferredVehicleTypes: ['Truck', 'SUV', 'Off-Road', 'Utility'],
  },
  'Classic Collector Carl': {
    name: 'Classic Collector Carl',
    displayName: 'Carl',
    tribe: 'Enthusiast',
    description: 'Classic car enthusiast interested in features and history',
    primaryContentType: 'Features',
    priorityCategories: ['Performance & Enthusiast', 'Luxury & Comfort'],
    preferredArticleTypes: ['Features', 'News', 'Reviews'],
    preferredVehicleTypes: ['Classic', 'Luxury', 'Performance', 'Collector'],
  },
  'Practical Paula': {
    name: 'Practical Paula',
    displayName: 'Paula',
    tribe: 'Car Shoppers',
    description: 'Purchase-focused decision maker who values reviews',
    primaryContentType: 'Reviews',
    priorityCategories: ['Family & Practical', 'Daily Commute'],
    preferredArticleTypes: ['Reviews', 'Buyer\'s Guide', 'Comparison'],
    preferredVehicleTypes: ['Sedan', 'SUV', 'Family', 'Practical'],
  },
  'Deal Hunter Dan': {
    name: 'Deal Hunter Dan',
    displayName: 'Dan',
    tribe: 'Car Shoppers',
    description: 'Value-focused shopper looking for the best deals',
    primaryContentType: 'Cars',
    priorityCategories: ['Family & Practical', 'Utility & Work'],
    preferredArticleTypes: ['Buyer\'s Guide', 'News', 'Reviews'],
    preferredVehicleTypes: ['Value', 'Practical', 'Family', 'Budget'],
  },
  'Luxury Upgrader Leo': {
    name: 'Luxury Upgrader Leo',
    displayName: 'Leo',
    tribe: 'Car Shoppers',
    description: 'Luxury-focused shopper looking to upgrade',
    primaryContentType: 'Cars',
    priorityCategories: ['Luxury & Comfort', 'Performance & Enthusiast'],
    preferredArticleTypes: ['Reviews', 'First-Look', 'Buyer\'s Guide'],
    preferredVehicleTypes: ['Luxury', 'Premium', 'Performance', 'Sedan'],
  },
  'Curious Explorer Casey': {
    name: 'Curious Explorer Casey',
    displayName: 'Casey',
    tribe: 'Car Shoppers',
    description: 'Explorer interested in learning about features',
    primaryContentType: 'Features',
    priorityCategories: ['Eco & Future-Ready', 'Urban & Style'],
    preferredArticleTypes: ['Features', 'First-Look', 'News'],
    preferredVehicleTypes: ['EV', 'Hybrid', 'Modern', 'Stylish'],
  },
};

/**
 * Map userType to likely personas
 * This allows backward compatibility with existing userType system
 */
export const getUserTypeToPersonas = (userType: string | null): PersonaName[] => {
  if (userType === 'buyer') {
    return ['Practical Paula', 'Deal Hunter Dan', 'Curious Explorer Casey'];
  } else if (userType === 'enthusiast') {
    return ['Gearhead Greg', 'Technology Geek Theo', 'DIY Road Warrior Jayden'];
  } else if (userType === 'both') {
    return ['Gearhead Greg', 'Practical Paula', 'Luxury Upgrader Leo'];
  }
  return [];
};

/**
 * Get persona by name
 */
export const getPersona = (name: PersonaName | null): Persona | null => {
  if (!name) return null;
  return personas[name] || null;
};

/**
 * Get persona from onboarding data
 * Checks for explicit persona selection, otherwise infers from userType
 */
export const getPersonaFromOnboarding = (): PersonaName | null => {
  try {
    const onboardingData = localStorage.getItem('onboardingData');
    if (onboardingData) {
      const parsed = JSON.parse(onboardingData);
      // Check for explicit persona selection
      if (parsed.persona && personas[parsed.persona as PersonaName]) {
        return parsed.persona as PersonaName;
      }
      // Otherwise infer from userType
      const userTypePersonas = getUserTypeToPersonas(parsed.userType);
      // Return first persona as default (can be enhanced to be smarter)
      return userTypePersonas[0] || null;
    }
  } catch (error) {
    console.error('Error reading persona from onboarding:', error);
  }
  return null;
};

/**
 * Get all personas for a user type (for multi-persona personalization)
 */
export const getPersonasForUserType = (userType: string | null): Persona[] => {
  const personaNames = getUserTypeToPersonas(userType);
  return personaNames.map(name => personas[name]).filter(Boolean) as Persona[];
};

