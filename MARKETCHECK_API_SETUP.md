# Marketcheck API Setup Guide

## Overview
The LocalListingsSidebar now supports real car listings via the Marketcheck API. The integration includes automatic fallback to mock data if the API is unavailable.

## Getting Started

### 1. Sign Up for Marketcheck API
1. Visit: https://www.marketcheck.com/automotive/api
2. Sign up for a **FREE account**
3. Get your API key from the dashboard

**Free Tier Includes:**
- 100 API requests per day
- Real dealer inventory data
- Pricing information
- Location-based search

### 2. Configure Your API Key

Create a `.env` file in the project root:

```bash
VITE_MARKETCHECK_API_KEY=your_actual_api_key_here
```

**Important:** Never commit your `.env` file to git. It's already in `.gitignore`.

### 3. Restart Development Server

After adding your API key:

```bash
npm run dev
```

## How It Works

### Automatic Fallback System
The integration uses a smart fallback system:

1. **Try Marketcheck API** - Fetches real listings
2. **Check Cache** - Uses cached data if available (5-minute cache)
3. **Fallback to Mock Data** - If API fails or key is missing

### Features

✅ **Real Listings** - Actual dealer inventory with pricing  
✅ **Caching** - Reduces API calls (5-minute cache)  
✅ **Error Handling** - Graceful fallback to mock data  
✅ **Location-Based** - Shows listings near specified ZIP code  
✅ **Free Tier** - 100 requests/day included  

## API Response Example

```json
{
  "num_found": 42,
  "listings": [
    {
      "id": "abc123",
      "vin": "1HGBH41JXMN109186",
      "price": 35400,
      "miles": 37100,
      "dealer_name": "Group 1 Automotive",
      "dealer_city": "Glendale",
      "dealer_state": "CA",
      "distance": 30,
      "build": {
        "year": 2026,
        "make": "Hyundai",
        "model": "Ioniq 6",
        "trim": "SEL"
      }
    }
  ]
}
```

## Usage in Code

```typescript
import { getLocalListings } from '../../utils/localListings';

// Async function - tries API first, falls back to mock
const listings = await getLocalListings(
  '2024',      // year
  'Honda',     // make
  'Accord',    // model
  imageUrl,    // vehicle image
  '90001'      // ZIP code (optional, defaults to LA)
);
```

## Testing Without API Key

The app works perfectly without an API key - it will automatically use mock data. This is great for:
- Development
- Testing
- Demo purposes
- When API limit is reached

## Monitoring API Usage

Check the browser console for API status:
- `✅ Using real listings from Marketcheck API` - API working
- `📦 Using cached Marketcheck listings` - Using cache
- `⚠️ Marketcheck API unavailable, using mock data` - Fallback active
- `📝 Using mock listings data` - Mock data in use

## Rate Limiting

**Free Tier:** 100 requests/day

To stay within limits:
- ✅ Caching is enabled (5 minutes)
- ✅ Only fetches on page load
- ✅ Reuses cached data when possible

**Estimated Usage:**
- ~20 vehicle detail page views per day = within limit
- Cache reduces actual API calls significantly

## Troubleshooting

### "API_KEY_NOT_CONFIGURED" Error
- Add your API key to `.env` file
- Restart dev server
- App will use mock data automatically

### "RATE_LIMIT_EXCEEDED" Error
- You've hit the 100 requests/day limit
- App will use cached or mock data
- Limit resets at midnight UTC

### "INVALID_API_KEY" Error
- Check your API key is correct
- Verify it's properly formatted in `.env`
- Make sure there are no extra spaces

## Files Modified

- `src/api/marketcheckApi.ts` - New API integration
- `src/utils/localListings.ts` - Updated with async support
- `src/pages/VehicleDetails/VehicleDetails.tsx` - Uses async listings

## Next Steps

Want to enhance the integration? Consider:
1. Add user location detection (geolocation API)
2. Add filtering options (price range, mileage, etc.)
3. Add sorting options
4. Implement infinite scroll for more listings
5. Add "Save Listing" functionality

## Support

- Marketcheck API Docs: https://www.marketcheck.com/automotive/api/documentation
- Support: support@marketcheck.com


