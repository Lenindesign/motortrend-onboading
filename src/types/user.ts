/**
 * User Types
 * Centralized type definitions for user-related data
 * 
 * @module types/user
 */

import type { SavedVehicle } from './vehicle';

// ============ User Profile Types ============

/**
 * User type based on their interests
 */
export type UserType = 'buyer' | 'enthusiast' | 'both';

/**
 * User's onboarding status
 */
export interface OnboardingStatus {
  /** Step 1: User type selection */
  step1Complete: boolean;
  
  /** Step 2: Vehicle selection */
  step2Complete: boolean;
  
  /** Step 3: Profile setup */
  step3Complete: boolean;
  
  /** Step 4: Preferences */
  step4Complete: boolean;
  
  /** Overall completion status */
  allComplete: boolean;
}

/**
 * User's onboarding data (stored in localStorage)
 */
export interface OnboardingData {
  /** User's display name */
  name?: string;
  
  /** User's email */
  email?: string;
  
  /** User type selection */
  userType?: UserType;
  
  /** Saved vehicles */
  vehicles?: SavedVehicle[];
  
  /** User's avatar URL */
  avatar?: string;
  
  /** User's banner image URL */
  banner?: string;
  
  /** User's location */
  location?: string;
  
  /** User's ZIP code */
  zipCode?: string;
  
  /** Newsletter subscription */
  newsletter?: string;
  
  /** When account was created */
  memberSince?: string;
  
  /** Selected interests */
  interests?: string[];
  
  /** Preferred content types */
  contentPreferences?: string[];
}

// ============ User Ratings Types ============

/**
 * User ratings storage (vehicleName -> rating)
 */
export type UserRatings = Record<string, number>;

/**
 * Rating context type for React Context
 */
export interface RatingContextType {
  /** All user ratings */
  userRatings: UserRatings;
  
  /** Set a rating for a vehicle */
  setUserRating: (vehicleName: string, rating: number) => void;
  
  /** Get user's rating for a vehicle */
  getUserRating: (vehicleName: string) => number;
  
  /** Clear rating for a vehicle */
  clearRating: (vehicleName: string) => void;
  
  /** Clear all ratings */
  clearAllRatings: () => void;
}

// ============ Profile Navigation Types ============

/**
 * Profile page tab options
 */
export type ProfileNavTab = 'my-account' | 'saved-items' | 'subscriptions';

/**
 * Profile section types
 */
export type ProfileSection = 
  | 'vehicles-i-own'
  | 'vehicles-i-want'
  | 'saved-articles'
  | 'my-reviews'
  | 'account-settings'
  | 'newsletter-preferences';

// ============ User Session Types ============

/**
 * User session data
 */
export interface UserSession {
  /** Is user authenticated */
  isAuthenticated: boolean;
  
  /** User's display name */
  name?: string;
  
  /** User's avatar URL */
  avatar?: string;
  
  /** User's email */
  email?: string;
}

/**
 * User preferences
 */
export interface UserPreferences {
  /** Preferred measurement units */
  units?: 'imperial' | 'metric';
  
  /** Email notification settings */
  emailNotifications?: boolean;
  
  /** Push notification settings */
  pushNotifications?: boolean;
  
  /** Theme preference */
  theme?: 'light' | 'dark' | 'system';
  
  /** Default location for listings */
  defaultLocation?: string;
  
  /** Default search radius (miles) */
  searchRadius?: number;
}

// ============ Garage Types ============

/**
 * Vehicle in user's garage with additional metadata
 */
export interface GarageVehicle extends SavedVehicle {
  /** When vehicle was added */
  addedAt?: string;
  
  /** User's notes about the vehicle */
  notes?: string;
  
  /** User's rating if given */
  userRating?: number;
  
  /** Vehicle image URL */
  image?: string;
}

/**
 * User's complete garage
 */
export interface UserGarage {
  /** Vehicles user owns */
  owned: GarageVehicle[];
  
  /** Vehicles user wants */
  wishlist: GarageVehicle[];
  
  /** Previously owned vehicles */
  history: GarageVehicle[];
}

