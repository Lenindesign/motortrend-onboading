/**
 * CDP (Customer Data Platform) Tracking Utility
 * 
 * This module provides utilities for tracking user events and registration sources
 * to the Customer Data Platform. It enables distinction between different registration
 * methods (Google One Tap vs. normal onboarding) and supports personalized re-engagement
 * email triggers.
 * 
 * Key Features:
 * - Registration source tracking (G1T vs. normal onboarding)
 * - High-intent page visit tracking (MMP, Car Rankings, etc.)
 * - User behavior event logging
 * - Email subscription eligibility tracking
 * 
 * Integration Points:
 * - Google One Tap component
 * - Normal sign-up/sign-in flows
 * - High-intent page components
 * - Email marketing automation
 */

// Registration source constants for CDP distinction
export const CDP_REGISTRATION_SOURCE = {
  GOOGLE_ONE_TAP: 'google_one_tap',
  NORMAL_SIGNUP: 'normal_signup',
  SOCIAL_OAUTH: 'social_oauth',
  EMAIL_MAGIC_LINK: 'email_magic_link',
} as const;

export type CDPRegistrationSource = typeof CDP_REGISTRATION_SOURCE[keyof typeof CDP_REGISTRATION_SOURCE];

// High-intent page types for tracking
export const HIGH_INTENT_PAGES = {
  MMP: 'mmp', // Make/Model Page (Vehicle Details)
  CAR_RANKINGS: 'car_rankings',
  COMPARE_VEHICLES: 'compare_vehicles',
  PRICING_PAGE: 'pricing_page',
  DEALER_INVENTORY: 'dealer_inventory',
  FINANCE_CALCULATOR: 'finance_calculator',
  TRADE_IN_VALUE: 'trade_in_value',
  REVIEWS: 'reviews',
  BUYING_GUIDE: 'buying_guide',
} as const;

export type HighIntentPage = typeof HIGH_INTENT_PAGES[keyof typeof HIGH_INTENT_PAGES];

// CDP Event types
export interface CDPEvent {
  event: string;
  source?: CDPRegistrationSource;
  method?: string;
  pageType?: string;
  vehicleInfo?: {
    year?: number;
    make?: string;
    model?: string;
    trim?: string;
    price?: number;
  };
  userData?: {
    email?: string;
    name?: string;
    googleId?: string;
    userId?: string;
  };
  preferences?: {
    highIntentPage?: string;
    vehicleInterest?: unknown;
    emailOptIn?: boolean;
  };
  email?: string;
  reason?: string;
  timestamp: string;
  sessionId?: string;
  deviceInfo?: {
    userAgent?: string;
    platform?: string;
    language?: string;
  };
}

// User profile for CDP
export interface CDPUserProfile {
  id: string;
  email: string;
  name?: string;
  registrationSource: CDPRegistrationSource;
  registrationTimestamp: string;
  registrationPage?: string;
  interestedVehicles: Array<{
    year?: number;
    make?: string;
    model?: string;
    viewedAt: string;
  }>;
  highIntentPageViews: Array<{
    pageType: HighIntentPage;
    viewedAt: string;
    vehicleInfo?: unknown;
  }>;
  emailPreferences: {
    subscribed: boolean;
    frequency?: 'daily' | 'weekly' | 'monthly';
    categories?: string[];
  };
  lastActivity: string;
}

// Generate a session ID for tracking
function getSessionId(): string {
  let sessionId = sessionStorage.getItem('cdp_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('cdp_session_id', sessionId);
  }
  return sessionId;
}

// Get device info for tracking
function getDeviceInfo(): CDPEvent['deviceInfo'] {
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
  };
}

// Local storage key for CDP events queue
const CDP_EVENTS_QUEUE_KEY = 'cdp_events_queue';
const CDP_USER_PROFILE_KEY = 'cdp_user_profile';

/**
 * Track a CDP event
 * In production, this would send to your CDP endpoint
 * For POC, we store locally and log to console
 */
export function trackCDPEvent(event: Omit<CDPEvent, 'sessionId' | 'deviceInfo'>): void {
  const fullEvent: CDPEvent = {
    ...event,
    sessionId: getSessionId(),
    deviceInfo: getDeviceInfo(),
  };

  // Log for development/debugging
  console.log('[CDP Event]', fullEvent);

  // Store in local queue (for POC - in production, send to CDP API)
  try {
    const queue = JSON.parse(localStorage.getItem(CDP_EVENTS_QUEUE_KEY) || '[]');
    queue.push(fullEvent);
    
    // Keep only last 100 events locally
    if (queue.length > 100) {
      queue.shift();
    }
    
    localStorage.setItem(CDP_EVENTS_QUEUE_KEY, JSON.stringify(queue));

    // In production, you would send to your CDP endpoint:
    // sendToCDP(fullEvent);
  } catch (error) {
    console.error('Failed to store CDP event:', error);
  }

  // Dispatch custom event for real-time listeners
  window.dispatchEvent(new CustomEvent('cdp_event', { detail: fullEvent }));
}

/**
 * Track a high-intent page view
 */
export function trackHighIntentPageView(
  pageType: HighIntentPage,
  vehicleInfo?: CDPEvent['vehicleInfo']
): void {
  trackCDPEvent({
    event: 'high_intent_page_view',
    pageType,
    vehicleInfo,
    timestamp: new Date().toISOString(),
  });

  // Update user profile if exists
  updateUserProfileHighIntentView(pageType, vehicleInfo);
}

/**
 * Track user registration with source
 */
export function trackUserRegistration(
  source: CDPRegistrationSource,
  userData: CDPEvent['userData'],
  pageType?: string,
  vehicleInfo?: CDPEvent['vehicleInfo']
): void {
  trackCDPEvent({
    event: 'user_registration',
    source,
    userData,
    pageType,
    vehicleInfo,
    timestamp: new Date().toISOString(),
  });

  // Create/update user profile
  if (userData?.email) {
    createOrUpdateUserProfile({
      id: userData.userId || userData.googleId || `user_${Date.now()}`,
      email: userData.email,
      name: userData.name,
      registrationSource: source,
      registrationTimestamp: new Date().toISOString(),
      registrationPage: pageType,
      interestedVehicles: vehicleInfo ? [{
        ...vehicleInfo,
        viewedAt: new Date().toISOString(),
      }] : [],
      highIntentPageViews: pageType ? [{
        pageType: pageType as HighIntentPage,
        viewedAt: new Date().toISOString(),
        vehicleInfo,
      }] : [],
      emailPreferences: {
        subscribed: true, // Default to subscribed for G1T users
      },
      lastActivity: new Date().toISOString(),
    });
  }
}

/**
 * Track email subscription eligibility (for personalized re-engagement)
 */
export function trackEmailSubscriptionEligible(
  email: string,
  source: CDPRegistrationSource,
  preferences?: CDPEvent['preferences']
): void {
  trackCDPEvent({
    event: 'email_subscription_eligible',
    source,
    email,
    preferences,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Get stored CDP events (for debugging/analytics)
 */
export function getCDPEvents(): CDPEvent[] {
  try {
    return JSON.parse(localStorage.getItem(CDP_EVENTS_QUEUE_KEY) || '[]');
  } catch {
    return [];
  }
}

/**
 * Clear stored CDP events
 */
export function clearCDPEvents(): void {
  localStorage.removeItem(CDP_EVENTS_QUEUE_KEY);
}

/**
 * Get user's registration source
 */
export function getUserRegistrationSource(): CDPRegistrationSource | null {
  const source = localStorage.getItem('registration_source');
  if (source && Object.values(CDP_REGISTRATION_SOURCE).includes(source as CDPRegistrationSource)) {
    return source as CDPRegistrationSource;
  }
  return null;
}

/**
 * Check if user registered via Google One Tap
 */
export function isGoogleOneTapUser(): boolean {
  return getUserRegistrationSource() === CDP_REGISTRATION_SOURCE.GOOGLE_ONE_TAP;
}

/**
 * Get user CDP profile
 */
export function getUserCDPProfile(): CDPUserProfile | null {
  try {
    const profile = localStorage.getItem(CDP_USER_PROFILE_KEY);
    return profile ? JSON.parse(profile) : null;
  } catch {
    return null;
  }
}

/**
 * Create or update user CDP profile
 */
function createOrUpdateUserProfile(profile: CDPUserProfile): void {
  try {
    const existingProfile = getUserCDPProfile();
    
    if (existingProfile) {
      // Merge profiles
      const mergedProfile: CDPUserProfile = {
        ...existingProfile,
        ...profile,
        interestedVehicles: [
          ...existingProfile.interestedVehicles,
          ...profile.interestedVehicles,
        ].slice(-20), // Keep last 20 vehicles
        highIntentPageViews: [
          ...existingProfile.highIntentPageViews,
          ...profile.highIntentPageViews,
        ].slice(-50), // Keep last 50 page views
        lastActivity: new Date().toISOString(),
      };
      localStorage.setItem(CDP_USER_PROFILE_KEY, JSON.stringify(mergedProfile));
    } else {
      localStorage.setItem(CDP_USER_PROFILE_KEY, JSON.stringify(profile));
    }
  } catch (error) {
    console.error('Failed to update CDP user profile:', error);
  }
}

/**
 * Update user profile with high-intent page view
 */
function updateUserProfileHighIntentView(
  pageType: HighIntentPage,
  vehicleInfo?: CDPEvent['vehicleInfo']
): void {
  const profile = getUserCDPProfile();
  if (profile) {
    profile.highIntentPageViews.push({
      pageType,
      viewedAt: new Date().toISOString(),
      vehicleInfo,
    });
    profile.lastActivity = new Date().toISOString();
    
    if (vehicleInfo) {
      profile.interestedVehicles.push({
        ...vehicleInfo,
        viewedAt: new Date().toISOString(),
      });
    }
    
    localStorage.setItem(CDP_USER_PROFILE_KEY, JSON.stringify(profile));
  }
}

/**
 * Get G1T vs Normal registration stats (for POC analytics)
 */
export function getRegistrationStats(): {
  total: number;
  googleOneTap: number;
  normalSignup: number;
  socialOAuth: number;
  other: number;
} {
  const events = getCDPEvents().filter(e => e.event === 'user_registration');
  
  return {
    total: events.length,
    googleOneTap: events.filter(e => e.source === CDP_REGISTRATION_SOURCE.GOOGLE_ONE_TAP).length,
    normalSignup: events.filter(e => e.source === CDP_REGISTRATION_SOURCE.NORMAL_SIGNUP).length,
    socialOAuth: events.filter(e => e.source === CDP_REGISTRATION_SOURCE.SOCIAL_OAUTH).length,
    other: events.filter(e => 
      !e.source || 
      !Object.values(CDP_REGISTRATION_SOURCE).includes(e.source)
    ).length,
  };
}

/**
 * Export CDP data for analysis (POC)
 */
export function exportCDPData(): {
  events: CDPEvent[];
  userProfile: CDPUserProfile | null;
  registrationStats: ReturnType<typeof getRegistrationStats>;
} {
  return {
    events: getCDPEvents(),
    userProfile: getUserCDPProfile(),
    registrationStats: getRegistrationStats(),
  };
}

// Production CDP API integration (placeholder)
// In production, implement these functions to send data to your CDP
/*
async function sendToCDP(event: CDPEvent): Promise<void> {
  const CDP_API_ENDPOINT = import.meta.env.VITE_CDP_API_ENDPOINT;
  const CDP_API_KEY = import.meta.env.VITE_CDP_API_KEY;
  
  if (!CDP_API_ENDPOINT || !CDP_API_KEY) {
    console.warn('CDP API not configured');
    return;
  }
  
  try {
    await fetch(CDP_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CDP_API_KEY}`,
      },
      body: JSON.stringify(event),
    });
  } catch (error) {
    console.error('Failed to send event to CDP:', error);
    // Queue for retry
  }
}
*/

export default {
  trackCDPEvent,
  trackHighIntentPageView,
  trackUserRegistration,
  trackEmailSubscriptionEligible,
  getCDPEvents,
  clearCDPEvents,
  getUserRegistrationSource,
  isGoogleOneTapUser,
  getUserCDPProfile,
  getRegistrationStats,
  exportCDPData,
  CDP_REGISTRATION_SOURCE,
  HIGH_INTENT_PAGES,
};
