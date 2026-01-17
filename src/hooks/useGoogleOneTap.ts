/**
 * useGoogleOneTap Hook
 * 
 * A custom hook for managing Google One Tap authentication on high-intent pages.
 * This hook handles the logic for when to show the G1T prompt based on:
 * - User authentication state
 * - Page type (high-intent vs. regular)
 * - User's previous interactions with G1T
 * - Cooldown periods after dismissal
 * 
 * Usage:
 * ```tsx
 * const { showOneTap, triggerOneTap, dismissOneTap } = useGoogleOneTap({
 *   pageType: 'mmp',
 *   vehicleInfo: { year: 2024, make: 'Honda', model: 'Accord' },
 *   autoTrigger: true,
 * });
 * ```
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { trackHighIntentPageView, HIGH_INTENT_PAGES, type HighIntentPage } from '../utils/cdpTracking';

// Cooldown configuration - DISABLED for aggressive G1T display
const G1T_COOLDOWN_KEY = 'g1t_cooldown_until';
const G1T_DISMISS_COUNT_KEY = 'g1t_dismiss_count';
const G1T_LAST_SHOWN_KEY = 'g1t_last_shown';

// Cooldown periods - ALL SET TO 0 to show G1T on every visit
const COOLDOWN_HOURS = {
  first: 0,       // No cooldown
  second: 0,      // No cooldown
  third: 0,       // No cooldown
  max: 0,         // No cooldown
};

// Minimum time between prompts (in minutes) - set to 0 for immediate re-display
const MIN_TIME_BETWEEN_PROMPTS = 0;

export interface UseGoogleOneTapOptions {
  /** The type of page (for CDP tracking and trigger logic) */
  pageType?: HighIntentPage | string;
  /** Vehicle information for MMP pages */
  vehicleInfo?: {
    year?: number;
    make?: string;
    model?: string;
    trim?: string;
  };
  /** Whether to automatically trigger G1T on mount */
  autoTrigger?: boolean;
  /** Delay before auto-triggering (ms) */
  triggerDelay?: number;
  /** Whether to respect cooldown periods */
  respectCooldown?: boolean;
  /** Callback when G1T is successfully shown */
  onShow?: () => void;
  /** Callback when G1T is dismissed */
  onDismiss?: () => void;
  /** Callback when user signs in via G1T */
  onSignIn?: (user: unknown) => void;
}

export interface UseGoogleOneTapReturn {
  /** Whether G1T should be shown */
  showOneTap: boolean;
  /** Whether G1T is currently visible */
  isVisible: boolean;
  /** Whether the user is in a cooldown period */
  isInCooldown: boolean;
  /** Time remaining in cooldown (ms) */
  cooldownRemaining: number;
  /** Number of times user has dismissed G1T */
  dismissCount: number;
  /** Manually trigger G1T prompt */
  triggerOneTap: () => void;
  /** Manually dismiss G1T prompt */
  dismissOneTap: () => void;
  /** Reset cooldown (for testing) */
  resetCooldown: () => void;
  /** Whether this is a high-intent page */
  isHighIntentPage: boolean;
}

/**
 * Check if currently in cooldown period
 * DISABLED: Always return false to show G1T on every visit
 */
function checkCooldown(): { isInCooldown: boolean; remaining: number } {
  // Always allow G1T to show - no cooldown
  return { isInCooldown: false, remaining: 0 };
}

/**
 * Check if enough time has passed since last prompt
 * DISABLED: Always return true to show G1T on every visit
 */
function canShowAgain(): boolean {
  // Always allow G1T to show
  return true;
}

/**
 * Get dismiss count
 */
function getDismissCount(): number {
  const count = localStorage.getItem(G1T_DISMISS_COUNT_KEY);
  return count ? parseInt(count, 10) : 0;
}

/**
 * Set cooldown based on dismiss count
 * DISABLED: No cooldown to show G1T on every visit
 */
function setCooldown(): void {
  // No-op: Don't set any cooldown
  // This allows G1T to appear on every page visit for non-authenticated users
}

/**
 * Record that prompt was shown
 */
function recordPromptShown(): void {
  localStorage.setItem(G1T_LAST_SHOWN_KEY, Date.now().toString());
}

/**
 * Check if page type is high-intent
 */
function isHighIntent(pageType?: string): boolean {
  if (!pageType) return false;
  return Object.values(HIGH_INTENT_PAGES).includes(pageType as HighIntentPage);
}

export function useGoogleOneTap(options: UseGoogleOneTapOptions = {}): UseGoogleOneTapReturn {
  const {
    pageType,
    vehicleInfo,
    autoTrigger = true,
    triggerDelay = 500, // Show quickly - 0.5 seconds
    respectCooldown = true,
    onShow,
    onDismiss,
    // onSignIn is available for future use when actual Google auth is implemented
    onSignIn: _onSignIn,
  } = options;

  const { isAuthenticated } = useAuth();
  const [showOneTap, setShowOneTap] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [cooldownState, setCooldownState] = useState(checkCooldown());
  const [dismissCount, setDismissCount] = useState(getDismissCount());
  const triggerTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasTriggeredRef = useRef(false);

  const isHighIntentPage = isHighIntent(pageType);

  // Track high-intent page view
  useEffect(() => {
    if (isHighIntentPage && pageType) {
      trackHighIntentPageView(pageType as HighIntentPage, vehicleInfo);
    }
  }, [isHighIntentPage, pageType, vehicleInfo]);

  // Update cooldown state periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setCooldownState(checkCooldown());
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  // Determine if we should show G1T
  useEffect(() => {
    // Don't show if user is already authenticated
    if (isAuthenticated) {
      setShowOneTap(false);
      return;
    }

    // Don't show if in cooldown (and respecting cooldown)
    if (respectCooldown && cooldownState.isInCooldown) {
      setShowOneTap(false);
      return;
    }

    // Don't show if not enough time has passed
    if (!canShowAgain()) {
      setShowOneTap(false);
      return;
    }

    // Show on high-intent pages
    if (isHighIntentPage) {
      setShowOneTap(true);
    }
  }, [isAuthenticated, cooldownState.isInCooldown, respectCooldown, isHighIntentPage]);

  // Auto-trigger with delay
  useEffect(() => {
    if (!autoTrigger || !showOneTap || hasTriggeredRef.current) {
      return;
    }

    triggerTimeoutRef.current = setTimeout(() => {
      if (showOneTap && !isAuthenticated) {
        hasTriggeredRef.current = true;
        setIsVisible(true);
        recordPromptShown();
        onShow?.();
      }
    }, triggerDelay);

    return () => {
      if (triggerTimeoutRef.current) {
        clearTimeout(triggerTimeoutRef.current);
      }
    };
  }, [autoTrigger, showOneTap, triggerDelay, isAuthenticated, onShow]);

  // Manual trigger
  const triggerOneTap = useCallback(() => {
    if (isAuthenticated) {
      console.log('Cannot show G1T: user is authenticated');
      return;
    }

    if (respectCooldown && cooldownState.isInCooldown) {
      console.log('Cannot show G1T: in cooldown period');
      return;
    }

    setShowOneTap(true);
    setIsVisible(true);
    recordPromptShown();
    onShow?.();
  }, [isAuthenticated, respectCooldown, cooldownState.isInCooldown, onShow]);

  // Dismiss handler
  const dismissOneTap = useCallback(() => {
    setIsVisible(false);
    setCooldown();
    setDismissCount(getDismissCount());
    setCooldownState(checkCooldown());
    onDismiss?.();
  }, [onDismiss]);

  // Reset cooldown (for testing)
  const resetCooldown = useCallback(() => {
    localStorage.removeItem(G1T_COOLDOWN_KEY);
    localStorage.removeItem(G1T_DISMISS_COUNT_KEY);
    localStorage.removeItem(G1T_LAST_SHOWN_KEY);
    setCooldownState({ isInCooldown: false, remaining: 0 });
    setDismissCount(0);
    hasTriggeredRef.current = false;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (triggerTimeoutRef.current) {
        clearTimeout(triggerTimeoutRef.current);
      }
    };
  }, []);

  return {
    showOneTap,
    isVisible,
    isInCooldown: cooldownState.isInCooldown,
    cooldownRemaining: cooldownState.remaining,
    dismissCount,
    triggerOneTap,
    dismissOneTap,
    resetCooldown,
    isHighIntentPage,
  };
}

export default useGoogleOneTap;
