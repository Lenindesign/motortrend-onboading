/**
 * Google One Tap Component
 * 
 * Implements Google Identity Services (GIS) One Tap sign-in for frictionless authentication.
 * This component provides a single-click sign-up/sign-in experience using existing Google credentials.
 * 
 * Features:
 * - Automatic prompt display on high-intent pages (MMP, Car Rankings, etc.)
 * - CDP tracking to distinguish G1T registrants from normal onboarding
 * - Configurable display modes (prompt, button, or both)
 * - Session management and token handling
 * - Personalized re-engagement email triggers
 * 
 * @see https://developers.google.com/identity/gsi/web/guides/overview
 */

import React, { useEffect, useCallback, useRef, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { trackCDPEvent, CDP_REGISTRATION_SOURCE } from '../../utils/cdpTracking';

// Google Identity Services types
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: GoogleOneTapConfig) => void;
          prompt: (callback?: (notification: PromptMomentNotification) => void) => void;
          renderButton: (element: HTMLElement, config: GoogleButtonConfig) => void;
          disableAutoSelect: () => void;
          revoke: (hint: string, callback: () => void) => void;
          cancel: () => void;
        };
      };
    };
  }
}

interface GoogleOneTapConfig {
  client_id: string;
  callback: (response: CredentialResponse) => void;
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
  context?: 'signin' | 'signup' | 'use';
  itp_support?: boolean;
  login_uri?: string;
  native_callback?: (response: CredentialResponse) => void;
  nonce?: string;
  prompt_parent_id?: string;
  state_cookie_domain?: string;
  ux_mode?: 'popup' | 'redirect';
  allowed_parent_origin?: string | string[];
  intermediate_iframe_close_callback?: () => void;
}

interface GoogleButtonConfig {
  type?: 'standard' | 'icon';
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  size?: 'large' | 'medium' | 'small';
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
  shape?: 'rectangular' | 'pill' | 'circle' | 'square';
  logo_alignment?: 'left' | 'center';
  width?: number;
  locale?: string;
}

interface CredentialResponse {
  credential: string;
  select_by: 'auto' | 'user' | 'user_1tap' | 'user_2tap' | 'btn' | 'btn_confirm' | 'btn_add_session' | 'btn_confirm_add_session';
  clientId?: string;
}

interface PromptMomentNotification {
  isDisplayMoment: () => boolean;
  isDisplayed: () => boolean;
  isNotDisplayed: () => boolean;
  getNotDisplayedReason: () => 'browser_not_supported' | 'invalid_client' | 'missing_client_id' | 'opt_out_or_no_session' | 'secure_http_required' | 'suppressed_by_user' | 'unregistered_origin' | 'unknown_reason';
  isSkippedMoment: () => boolean;
  getSkippedReason: () => 'auto_cancel' | 'user_cancel' | 'tap_outside' | 'issuing_failed';
  isDismissedMoment: () => boolean;
  getDismissedReason: () => 'credential_returned' | 'cancel_called' | 'flow_restarted';
  getMomentType: () => 'display' | 'skipped' | 'dismissed';
}

export interface GoogleOneTapProps {
  /** Display mode: 'prompt' shows One Tap popup, 'button' shows sign-in button, 'both' shows both */
  mode?: 'prompt' | 'button' | 'both';
  /** Auto-select returning users (skip account chooser) */
  autoSelect?: boolean;
  /** Context for the prompt (affects messaging) */
  context?: 'signin' | 'signup' | 'use';
  /** Page type for CDP tracking (e.g., 'mmp', 'car_rankings', 'homepage') */
  pageType?: string;
  /** Vehicle info for personalization (if on MMP page) */
  vehicleInfo?: {
    year?: number;
    make?: string;
    model?: string;
  };
  /** Callback when sign-in is successful */
  onSuccess?: (user: GoogleOneTapUser) => void;
  /** Callback when sign-in fails */
  onError?: (error: Error) => void;
  /** Callback when prompt is dismissed */
  onDismiss?: () => void;
  /** Custom button container ID */
  buttonContainerId?: string;
  /** Button configuration */
  buttonConfig?: GoogleButtonConfig;
  /** Delay before showing prompt (ms) - default 500ms for fast appearance */
  promptDelay?: number;
  /** Whether to show on this render */
  enabled?: boolean;
}

export interface GoogleOneTapUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  locale?: string;
  registrationSource: 'google_one_tap';
}

// Decode JWT token from Google
function decodeJWT(token: string): Record<string, unknown> {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    throw new Error('Failed to decode Google credential');
  }
}

// Cooldown functions - DISABLED to show G1T on every visit for non-authenticated users

function isInCooldown(): boolean {
  // Always return false to show G1T on every visit
  return false;
}

function setCooldown(): void {
  // No-op: Don't set cooldown, allow G1T to show on next visit
}

export const GoogleOneTap: React.FC<GoogleOneTapProps> = ({
  mode = 'prompt',
  autoSelect = false,
  context = 'signin',
  pageType = 'unknown',
  vehicleInfo,
  onSuccess,
  onError,
  onDismiss,
  buttonContainerId = 'g1t-button-container',
  buttonConfig = {
    type: 'standard',
    theme: 'filled_blue',
    size: 'large',
    text: 'continue_with',
    shape: 'rectangular',
    logo_alignment: 'left',
  },
  promptDelay = 500, // Show quickly - 0.5 seconds after page load
  enabled = true,
}) => {
  const { isAuthenticated, setDemoUser } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  const [, setIsPromptShown] = useState(false);
  const promptTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scriptLoadedRef = useRef(false);

  // Get Google Client ID from environment
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  // Handle credential response from Google
  const handleCredentialResponse = useCallback((response: CredentialResponse) => {
    try {
      const payload = decodeJWT(response.credential);
      
      const user: GoogleOneTapUser = {
        id: payload.sub as string,
        email: payload.email as string,
        name: payload.name as string,
        picture: payload.picture as string | undefined,
        given_name: payload.given_name as string | undefined,
        family_name: payload.family_name as string | undefined,
        locale: payload.locale as string | undefined,
        registrationSource: 'google_one_tap',
      };

      // Track CDP event for G1T registration
      trackCDPEvent({
        event: 'user_registration',
        source: CDP_REGISTRATION_SOURCE.GOOGLE_ONE_TAP,
        method: response.select_by,
        pageType,
        vehicleInfo,
        userData: {
          email: user.email,
          name: user.name,
          googleId: user.id,
        },
        timestamp: new Date().toISOString(),
      });

      // Store registration source for CDP distinction
      localStorage.setItem('registration_source', 'google_one_tap');
      localStorage.setItem('registration_timestamp', new Date().toISOString());
      localStorage.setItem('registration_page', pageType);

      // Set demo user with Google data (for demo mode)
      setDemoUser(user.name, user.picture);

      // Store additional user data
      const onboardingData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
      onboardingData.email = user.email;
      onboardingData.googleId = user.id;
      onboardingData.registrationSource = 'google_one_tap';
      onboardingData.registrationPage = pageType;
      if (vehicleInfo) {
        onboardingData.interestedVehicle = vehicleInfo;
      }
      localStorage.setItem('onboardingData', JSON.stringify(onboardingData));

      // Trigger personalized re-engagement email setup
      trackCDPEvent({
        event: 'email_subscription_eligible',
        source: CDP_REGISTRATION_SOURCE.GOOGLE_ONE_TAP,
        email: user.email,
        preferences: {
          highIntentPage: pageType,
          vehicleInterest: vehicleInfo,
        },
        timestamp: new Date().toISOString(),
      });

      onSuccess?.(user);
    } catch (error) {
      console.error('Google One Tap error:', error);
      onError?.(error instanceof Error ? error : new Error('Failed to process Google credential'));
    }
  }, [pageType, vehicleInfo, setDemoUser, onSuccess, onError]);

  // Handle prompt moment notifications
  const handlePromptMoment = useCallback((notification: PromptMomentNotification) => {
    if (notification.isDisplayMoment()) {
      setIsPromptShown(notification.isDisplayed());
      
      if (notification.isNotDisplayed()) {
        const reason = notification.getNotDisplayedReason();
        console.log('Google One Tap not displayed:', reason);
        
        // Track why prompt wasn't shown
        trackCDPEvent({
          event: 'g1t_prompt_not_displayed',
          reason,
          pageType,
          timestamp: new Date().toISOString(),
        });
      }
    }

    if (notification.isSkippedMoment()) {
      const reason = notification.getSkippedReason();
      console.log('Google One Tap skipped:', reason);
      
      if (reason === 'user_cancel' || reason === 'tap_outside') {
        setCooldown();
        onDismiss?.();
      }

      trackCDPEvent({
        event: 'g1t_prompt_skipped',
        reason,
        pageType,
        timestamp: new Date().toISOString(),
      });
    }

    if (notification.isDismissedMoment()) {
      const reason = notification.getDismissedReason();
      console.log('Google One Tap dismissed:', reason);
      
      if (reason !== 'credential_returned') {
        onDismiss?.();
      }
    }
  }, [pageType, onDismiss]);

  // Load Google Identity Services script
  useEffect(() => {
    if (!enabled || !clientId || scriptLoadedRef.current) return;

    const loadScript = () => {
      if (document.querySelector('script[src*="accounts.google.com/gsi/client"]')) {
        scriptLoadedRef.current = true;
        setIsLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        scriptLoadedRef.current = true;
        setIsLoaded(true);
      };
      script.onerror = () => {
        console.error('Failed to load Google Identity Services');
        onError?.(new Error('Failed to load Google Identity Services'));
      };
      document.head.appendChild(script);
    };

    loadScript();
  }, [enabled, clientId, onError]);

  // Initialize Google One Tap
  useEffect(() => {
    if (!isLoaded || !window.google || !clientId || isAuthenticated) return;

    // Don't show if in cooldown
    if (isInCooldown() && mode === 'prompt') {
      console.log('Google One Tap in cooldown period');
      return;
    }

    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        auto_select: autoSelect,
        cancel_on_tap_outside: false, // Don't cancel when clicking outside - stays longer
        context,
        itp_support: true,
        ux_mode: 'popup',
      });

      // Show prompt with delay
      if (mode === 'prompt' || mode === 'both') {
        promptTimeoutRef.current = setTimeout(() => {
          window.google?.accounts.id.prompt(handlePromptMoment);
          
          // Track prompt display attempt
          trackCDPEvent({
            event: 'g1t_prompt_triggered',
            pageType,
            vehicleInfo,
            timestamp: new Date().toISOString(),
          });
        }, promptDelay);
      }

      // Render button if needed
      if (mode === 'button' || mode === 'both') {
        const buttonContainer = document.getElementById(buttonContainerId);
        if (buttonContainer) {
          window.google.accounts.id.renderButton(buttonContainer, buttonConfig);
        }
      }
    } catch (error) {
      console.error('Failed to initialize Google One Tap:', error);
      onError?.(error instanceof Error ? error : new Error('Failed to initialize Google One Tap'));
    }

    return () => {
      if (promptTimeoutRef.current) {
        clearTimeout(promptTimeoutRef.current);
      }
      // Cancel any pending prompts
      window.google?.accounts.id.cancel();
    };
  }, [
    isLoaded,
    clientId,
    isAuthenticated,
    mode,
    autoSelect,
    context,
    pageType,
    vehicleInfo,
    promptDelay,
    buttonContainerId,
    buttonConfig,
    handleCredentialResponse,
    handlePromptMoment,
    onError,
  ]);

  // Don't render anything if disabled or no client ID
  if (!enabled || !clientId) {
    return null;
  }

  // Render button container if in button mode
  if (mode === 'button' || mode === 'both') {
    return (
      <div
        id={buttonContainerId}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '44px',
        }}
      />
    );
  }

  // Prompt-only mode doesn't render anything visible
  return null;
};

export default GoogleOneTap;
