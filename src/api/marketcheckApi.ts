/**
 * Marketcheck API Integration
 * Free tier: 100 requests/day
 * Documentation: https://www.marketcheck.com/automotive/api/documentation
 */

import type { LocalListing } from '../components/LocalListingsSidebar/LocalListingsSidebar';

// API Configuration
const MARKETCHECK_API_BASE = 'https://api.marketcheck.com/v2';
const MARKETCHECK_API_KEY = import.meta.env.VITE_MARKETCHECK_API_KEY || '';

interface MarketcheckListing {
  id: string;
  vin: string;
  heading: string;
  ref_price?: number;  // Reference price
  price?: number;  // Alternative price field
  asking_price?: number;  // Another price field
  msrp?: number;  // MSRP for new cars
  miles: number;
  source?: string;  // Dealer website/source
  vdp_url?: string;  // Vehicle detail page URL
  distance?: number;
  media?: {
    photo_links?: string[];
  };
  build?: {
    year?: number;
    make?: string;
    model?: string;
    trim?: string;
  };
  exterior_color?: string;
  interior_color?: string;
  stock_no?: string;
  inventory_type?: string;  // 'new', 'used', 'certified'
}

interface MarketcheckResponse {
  num_found: number;
  listings: MarketcheckListing[];
}

/**
 * Fetch real car listings from Marketcheck API
 */
export async function fetchMarketcheckListings(
  year: string,
  make: string,
  model: string,
  zipCode: string = '90001', // Default to Los Angeles
  radius: number = 50,
  rows: number = 5
): Promise<LocalListing[]> {
  // Check if API key is configured
  if (!MARKETCHECK_API_KEY) {
    console.warn('⚠️ Marketcheck API key not configured. Using mock data.');
    throw new Error('API_KEY_NOT_CONFIGURED');
  }

  try {
    const params = new URLSearchParams({
      api_key: MARKETCHECK_API_KEY,
      year: year,
      make: make,
      model: model,
      zip: zipCode,
      radius: radius.toString(),
      rows: rows.toString(),
      start: '0',
      sort_by: 'price',
      sort_order: 'asc'
    });

    const url = `${MARKETCHECK_API_BASE}/search/car/active?${params.toString()}`;
    
    console.log('🔍 Fetching listings from Marketcheck API:', { year, make, model, zipCode });
    
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('INVALID_API_KEY');
      } else if (response.status === 429) {
        throw new Error('RATE_LIMIT_EXCEEDED');
      }
      throw new Error(`API_ERROR: ${response.status}`);
    }

    const data: MarketcheckResponse = await response.json();
    
    console.log('✅ Marketcheck API response:', { 
      numFound: data.num_found, 
      listingsReturned: data.listings?.length || 0 
    });

    if (!data.listings || data.listings.length === 0) {
      console.warn('⚠️ No listings found from Marketcheck API');
      return [];
    }

    // Transform Marketcheck listings to our LocalListing format
    const listings: LocalListing[] = data.listings.map((listing) => {
      // Determine condition
      let condition: 'New' | 'Used' | 'Certified Pre-Owned' = 'Used';
      if (listing.miles === 0 || listing.miles < 100) {
        condition = 'New';
      } else if (listing.inventory_type === 'certified' || listing.inventory_type === 'cpo') {
        condition = 'Certified Pre-Owned';
      } else if (listing.inventory_type === 'new') {
        condition = 'New';
      }

      // Get image URLs (all available photos)
      const photoUrls = listing.media?.photo_links || [];
      const imageUrl = photoUrls[0] || 'https://d2kde5ohu8qb21.cloudfront.net/files/placeholder-vehicle.jpg';

      // Extract dealer name from source or use heading
      const dealerName = listing.source 
        ? listing.source.replace(/\.com$/, '').replace(/[-_]/g, ' ').split('.')[0]
        : 'Local Dealer';
      
      // Format dealer name nicely
      const formattedDealerName = dealerName
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      // Extract location from VDP URL or use default
      const location = 'Los Angeles, CA';  // Default for now, API doesn't provide city/state
      const distance = Math.round(listing.distance || 0);

      // Get price from multiple possible fields
      let price = listing.ref_price || listing.price || listing.asking_price || listing.msrp || 0;
      
      // If no price from API, generate estimated price based on year and condition
      if (price === 0) {
        console.warn('⚠️ No price from API, using estimated price for:', listing.heading);
        const vehicleYear = listing.build?.year || parseInt(year);
        const currentYear = new Date().getFullYear();
        const age = currentYear - vehicleYear;
        
        // Base price estimation
        if (condition === 'New') {
          price = 30000 + Math.random() * 20000; // $30k-$50k for new
        } else if (condition === 'Certified Pre-Owned') {
          price = 25000 + Math.random() * 15000; // $25k-$40k for CPO
        } else {
          // Used: depreciate based on age
          const basePrice = 35000;
          const depreciationRate = 0.15; // 15% per year
          price = basePrice * Math.pow(1 - depreciationRate, age);
          price = Math.max(price, 10000); // Minimum $10k
        }
        
        // Round to nearest $500
        price = Math.round(price / 500) * 500;
      }

      return {
        id: listing.id || listing.vin,
        dealerName: formattedDealerName,
        price,
        mileage: listing.miles || 0,
        year: listing.build?.year?.toString() || year,
        condition,
        location,
        distance,
        imageUrl,
        photoUrls: photoUrls.length > 0 ? photoUrls : undefined,
        trim: listing.build?.trim,
        exteriorColor: listing.exterior_color,
        interiorColor: listing.interior_color,
        vin: listing.vin,
        stockNumber: listing.stock_no
      };
    });

    return listings;
  } catch (error) {
    console.error('❌ Error fetching Marketcheck listings:', error);
    throw error;
  }
}

/**
 * Get cached listings or fetch new ones
 * Implements simple in-memory caching to reduce API calls
 */
const listingsCache = new Map<string, { data: LocalListing[]; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getMarketcheckListings(
  year: string,
  make: string,
  model: string,
  zipCode?: string
): Promise<LocalListing[]> {
  const cacheKey = `${year}-${make}-${model}-${zipCode || 'default'}`;
  
  // Check cache
  const cached = listingsCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log('📦 Using cached Marketcheck listings');
    return cached.data;
  }

  // Fetch new data
  try {
    const listings = await fetchMarketcheckListings(year, make, model, zipCode);
    
    // Cache the results
    listingsCache.set(cacheKey, {
      data: listings,
      timestamp: Date.now()
    });
    
    return listings;
  } catch (error) {
    // If we have stale cached data, return it as fallback
    if (cached) {
      console.warn('⚠️ Using stale cached data due to API error');
      return cached.data;
    }
    throw error;
  }
}

