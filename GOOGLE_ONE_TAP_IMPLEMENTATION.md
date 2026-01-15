# Google One Tap (G1T) Implementation

## Overview

This document describes the Google One Tap (G1T) implementation for MotorTrend's onboarding experience. G1T is a Google Identity Services feature that allows users to create an account or sign in with a single click using their existing Google credentials.

## Goals (Q1 POC)

1. **Grow Known User Base**: Use G1T on high-intent pages to convert anonymous visitors into known users
2. **CDP Integration**: Track and distinguish G1T registrants from normal onboarding users
3. **Personalized Re-engagement**: Enable targeted email campaigns based on user behavior and registration source

## Architecture

### Components

```
src/
├── components/
│   └── GoogleOneTap/
│       ├── GoogleOneTap.tsx    # Main G1T component
│       └── index.ts            # Exports
├── hooks/
│   └── useGoogleOneTap.ts      # Hook for G1T logic
└── utils/
    └── cdpTracking.ts          # CDP tracking utilities
```

### Flow Diagram

```
User visits high-intent page (MMP, Rankings, etc.)
         │
         ▼
┌─────────────────────────────────────┐
│  useGoogleOneTap hook initializes   │
│  - Checks if user is authenticated  │
│  - Checks cooldown period           │
│  - Tracks page view in CDP          │
└─────────────────────────────────────┘
         │
         ▼ (if eligible)
┌─────────────────────────────────────┐
│  GoogleOneTap component renders     │
│  - Loads Google Identity Services   │
│  - Shows One Tap prompt             │
└─────────────────────────────────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌───────┐ ┌───────────┐
│ Sign  │ │ Dismiss   │
│ In    │ │           │
└───────┘ └───────────┘
    │         │
    ▼         ▼
┌───────────────────────────────────┐
│ CDP Event Tracked                 │
│ - Registration source: G1T        │
│ - Page type                       │
│ - Vehicle interest (if MMP)       │
└───────────────────────────────────┘
```

## High-Intent Pages

G1T is configured to appear on these high-intent pages:

| Page Type | Constant | Trigger Delay | Description |
|-----------|----------|---------------|-------------|
| MMP (Make/Model Page) | `HIGH_INTENT_PAGES.MMP` | 3000ms | Vehicle details page |
| Car Rankings | `HIGH_INTENT_PAGES.CAR_RANKINGS` | 2500ms | Rankings & Awards page |
| Compare Vehicles | `HIGH_INTENT_PAGES.COMPARE_VEHICLES` | 3000ms | Vehicle comparison |
| Pricing Page | `HIGH_INTENT_PAGES.PRICING_PAGE` | 2000ms | Pricing information |
| Dealer Inventory | `HIGH_INTENT_PAGES.DEALER_INVENTORY` | 2000ms | Local dealer listings |
| Finance Calculator | `HIGH_INTENT_PAGES.FINANCE_CALCULATOR` | 2500ms | Payment calculator |
| Trade-In Value | `HIGH_INTENT_PAGES.TRADE_IN_VALUE` | 2500ms | Trade-in estimator |
| Reviews | `HIGH_INTENT_PAGES.REVIEWS` | 3000ms | User reviews section |
| Buying Guide | `HIGH_INTENT_PAGES.BUYING_GUIDE` | 3000ms | Buying guides |

## Configuration

### Environment Variables

Add to your `.env.local`:

```bash
# Google One Tap Configuration
VITE_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com

# CDP API (for production)
VITE_CDP_API_ENDPOINT=https://your-cdp-api.com/events
VITE_CDP_API_KEY=your_cdp_api_key
```

### Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select a project
3. Navigate to **APIs & Services > Credentials**
4. Click **Create Credentials > OAuth 2.0 Client ID**
5. Select **Web application**
6. Add authorized JavaScript origins:
   - `http://localhost:5173` (development)
   - `https://your-production-domain.com` (production)
7. Copy the Client ID to your environment variables

## Usage

### Basic Usage on a Page

```tsx
import { GoogleOneTap } from '../../components/GoogleOneTap';
import { useGoogleOneTap } from '../../hooks/useGoogleOneTap';
import { HIGH_INTENT_PAGES } from '../../utils/cdpTracking';

const MyHighIntentPage: React.FC = () => {
  const { showOneTap, dismissOneTap } = useGoogleOneTap({
    pageType: HIGH_INTENT_PAGES.MMP,
    vehicleInfo: { year: 2024, make: 'Honda', model: 'Accord' },
    autoTrigger: true,
    triggerDelay: 3000,
  });

  return (
    <div>
      {showOneTap && (
        <GoogleOneTap
          mode="prompt"
          pageType={HIGH_INTENT_PAGES.MMP}
          vehicleInfo={{ year: 2024, make: 'Honda', model: 'Accord' }}
          onSuccess={(user) => console.log('Signed in:', user)}
          onDismiss={dismissOneTap}
        />
      )}
      {/* Page content */}
    </div>
  );
};
```

### Hook Options

```typescript
interface UseGoogleOneTapOptions {
  pageType?: HighIntentPage | string;  // Page type for tracking
  vehicleInfo?: {                       // Vehicle info for MMP pages
    year?: number;
    make?: string;
    model?: string;
  };
  autoTrigger?: boolean;                // Auto-show prompt (default: true)
  triggerDelay?: number;                // Delay before showing (default: 2000ms)
  respectCooldown?: boolean;            // Honor cooldown periods (default: true)
  onShow?: () => void;                  // Callback when shown
  onDismiss?: () => void;               // Callback when dismissed
  onSignIn?: (user: unknown) => void;   // Callback on sign-in
}
```

### Component Props

```typescript
interface GoogleOneTapProps {
  mode?: 'prompt' | 'button' | 'both';  // Display mode
  autoSelect?: boolean;                  // Auto-select returning users
  context?: 'signin' | 'signup' | 'use'; // Prompt context
  pageType?: string;                     // Page type for CDP
  vehicleInfo?: object;                  // Vehicle info for personalization
  onSuccess?: (user: GoogleOneTapUser) => void;
  onError?: (error: Error) => void;
  onDismiss?: () => void;
  buttonContainerId?: string;            // Custom button container
  buttonConfig?: GoogleButtonConfig;     // Button styling
  promptDelay?: number;                  // Delay before prompt
  enabled?: boolean;                     // Enable/disable
}
```

## CDP Tracking

### Registration Source Tracking

The CDP tracks the registration source to distinguish G1T users:

```typescript
// Registration sources
CDP_REGISTRATION_SOURCE = {
  GOOGLE_ONE_TAP: 'google_one_tap',
  NORMAL_SIGNUP: 'normal_signup',
  SOCIAL_OAUTH: 'social_oauth',
  EMAIL_MAGIC_LINK: 'email_magic_link',
}
```

### Events Tracked

| Event | Description | Data |
|-------|-------------|------|
| `user_registration` | User signs up | source, method, pageType, vehicleInfo, userData |
| `high_intent_page_view` | User visits high-intent page | pageType, vehicleInfo |
| `g1t_prompt_triggered` | G1T prompt shown | pageType, vehicleInfo |
| `g1t_prompt_skipped` | User skipped/dismissed | reason, pageType |
| `g1t_prompt_not_displayed` | Prompt couldn't show | reason, pageType |
| `email_subscription_eligible` | User eligible for emails | email, preferences |

### Accessing CDP Data

```typescript
import { 
  getCDPEvents, 
  getUserCDPProfile, 
  getRegistrationStats,
  isGoogleOneTapUser,
  exportCDPData 
} from '../../utils/cdpTracking';

// Check if user registered via G1T
if (isGoogleOneTapUser()) {
  // Show G1T-specific content
}

// Get registration statistics
const stats = getRegistrationStats();
console.log(`G1T registrations: ${stats.googleOneTap}`);
console.log(`Normal signups: ${stats.normalSignup}`);

// Export all CDP data for analysis
const data = exportCDPData();
```

## Cooldown Logic

To prevent user fatigue, G1T implements progressive cooldowns:

| Dismiss Count | Cooldown Period |
|---------------|-----------------|
| 1st dismiss | 24 hours |
| 2nd dismiss | 72 hours (3 days) |
| 3rd dismiss | 168 hours (1 week) |
| 4+ dismisses | 720 hours (30 days) |

### Reset Cooldown (Testing)

```typescript
const { resetCooldown } = useGoogleOneTap({ pageType: 'mmp' });

// Reset for testing
resetCooldown();
```

## Personalized Re-engagement Emails

When a user signs up via G1T, the system captures:

1. **Registration Page**: Which high-intent page they were on
2. **Vehicle Interest**: If on MMP, which vehicle they were viewing
3. **Email Eligibility**: Automatically marked for personalized emails

This data enables:
- "You were looking at the 2024 Honda Accord" emails
- "Top 10 vehicles in your category" recommendations
- Price drop alerts for viewed vehicles

## Testing

### Local Development

1. Set up Google OAuth credentials for `localhost:5173`
2. Add `VITE_GOOGLE_CLIENT_ID` to `.env.local`
3. Visit a high-intent page (e.g., `/vehicles/2024/Honda/Accord`)
4. Wait for the G1T prompt to appear

### Debug Mode

Open browser console to see CDP events:

```javascript
// View all CDP events
localStorage.getItem('cdp_events_queue');

// View user profile
localStorage.getItem('cdp_user_profile');

// Check registration source
localStorage.getItem('registration_source');
```

### Reset State

```javascript
// Clear all G1T state
localStorage.removeItem('g1t_cooldown_until');
localStorage.removeItem('g1t_dismiss_count');
localStorage.removeItem('g1t_last_shown');
localStorage.removeItem('registration_source');
localStorage.removeItem('cdp_events_queue');
localStorage.removeItem('cdp_user_profile');
```

## Production Considerations

### CDP API Integration

For production, implement the CDP API calls in `cdpTracking.ts`:

```typescript
async function sendToCDP(event: CDPEvent): Promise<void> {
  const CDP_API_ENDPOINT = import.meta.env.VITE_CDP_API_ENDPOINT;
  const CDP_API_KEY = import.meta.env.VITE_CDP_API_KEY;
  
  await fetch(CDP_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${CDP_API_KEY}`,
    },
    body: JSON.stringify(event),
  });
}
```

### Analytics Integration

Track G1T performance:

```typescript
// Example: Google Analytics 4 integration
gtag('event', 'g1t_signup', {
  registration_source: 'google_one_tap',
  page_type: 'mmp',
  vehicle: '2024 Honda Accord',
});
```

### A/B Testing

For the POC, consider A/B testing:
- G1T vs. traditional sign-up modal
- Different trigger delays
- Different high-intent page combinations

## Metrics to Track (POC)

1. **Conversion Rate**: G1T sign-ups / G1T prompts shown
2. **Registration Source Split**: G1T vs. normal signup ratio
3. **Page-Level Performance**: Which pages convert best
4. **Email Engagement**: Open/click rates for G1T users vs. normal
5. **User Quality**: Retention and engagement of G1T users

## Troubleshooting

### G1T Not Showing

1. Check `VITE_GOOGLE_CLIENT_ID` is set
2. Verify authorized origins in Google Console
3. Check browser console for errors
4. Ensure user is not already authenticated
5. Check if in cooldown period

### "opt_out_or_no_session" Error

User has opted out of Google One Tap or has no active Google session.

### "unregistered_origin" Error

Add your domain to authorized JavaScript origins in Google Console.

## Files Reference

| File | Purpose |
|------|---------|
| `src/components/GoogleOneTap/GoogleOneTap.tsx` | Main G1T component |
| `src/hooks/useGoogleOneTap.ts` | G1T logic hook |
| `src/utils/cdpTracking.ts` | CDP tracking utilities |
| `src/pages/VehicleDetails/VehicleDetails.tsx` | MMP integration |
| `src/pages/RankingsAndAwards/RankingsAndAwards.tsx` | Rankings integration |
