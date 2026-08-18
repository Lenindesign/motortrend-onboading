/**
 * MotorTrend Listings API
 * Uses the MotorTrend GraphQL API to fetch real vehicle listings
 */

import type { LocalListing } from '../components/LocalListingsSidebar';

const MOTORTREND_API_URL = 'https://api.motortrend.com';
const MOTORTREND_AUTH_TOKEN = import.meta.env.VITE_MOTORTREND_AUTH_TOKEN || 'thAjiBOs7lpa';

// In-memory cache for API responses
const listingsCache: Map<string, { data: LocalListing[]; timestamp: number }> = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface DTCListing {
  inventoryID: number;
  VIN: string;
  year: number;
  make: string;
  model: string;
  trim: string;
  sellingPrice: string;
  mileage: string;
  exteriorColor: string;
  interiorColor: string;
  dealerName: string;
  dealerRadius: number;
  certified: string;
  conditions: string;
  images: string;
  numberOfImages: number;
  bodyType: string;
  zipCode: string;
  vehicle?: {
    featuredImageUrl: string;
    thumbnailUrl: string;
    marketingImageUrl: string | null;
  };
}

interface GraphQLResponse {
  data?: {
    dtcListing: DTCListing[];
  };
  errors?: Array<{ message: string }>;
}

/**
 * Fetch vehicle listings from MotorTrend GraphQL API
 */
export async function fetchMotortrendListings(
  year: string,
  make: string,
  model: string,
  zipCode: string = '90001',
  rows: number = 5
): Promise<LocalListing[]> {
  // Check cache first
  const cacheKey = `${year}-${make}-${model}-${zipCode}-${rows}`;
  const cached = listingsCache.get(cacheKey);
  
  if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
    console.log('📦 Using cached MotorTrend listings for:', { make, model });
    return cached.data;
  }

  console.log('🔍 Fetching listings from MotorTrend API:', { year, make, model, zipCode });

  const query = `
    query getdtcListing($make: String, $model: String, $zipCodes: [String]) {
      dtcListing(make: $make, model: $model, zipCodes: $zipCodes) {
        inventoryID
        VIN
        year
        make
        model
        trim
        sellingPrice
        mileage
        exteriorColor
        interiorColor
        dealerName
        dealerRadius
        certified
        conditions
        images
        numberOfImages
        bodyType
        zipCode
        vehicle {
          featuredImageUrl
          thumbnailUrl
          marketingImageUrl
        }
      }
    }
  `;

  try {
    const response = await fetch(MOTORTREND_API_URL, {
      method: 'POST',
      headers: {
        'auth_token': MOTORTREND_AUTH_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: {
          make,
          model,
          zipCodes: zipCode,
        },
      }),
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('INVALID_AUTH_TOKEN');
      }
      throw new Error(`API_ERROR: ${response.status}`);
    }

    const data: GraphQLResponse = await response.json();

    if (data.errors && data.errors.length > 0) {
      console.error('❌ MotorTrend API errors:', data.errors);
      throw new Error('GRAPHQL_ERROR');
    }

    if (!data.data?.dtcListing || data.data.dtcListing.length === 0) {
      console.warn('⚠️ No listings found from MotorTrend API');
      return [];
    }

    console.log('✅ MotorTrend API response:', {
      listingsFound: data.data.dtcListing.length,
    });

    // Transform to LocalListing format and limit to requested rows
    const listings: LocalListing[] = data.data.dtcListing
      .slice(0, rows)
      .map((listing) => {
        // Determine condition
        let condition: 'New' | 'Used' | 'Certified Pre-Owned' = 'Used';
        if (listing.conditions === 'New') {
          condition = 'New';
        } else if (listing.certified === '1') {
          condition = 'Certified Pre-Owned';
        } else if (listing.conditions === 'Pre-Owned') {
          condition = 'Used';
        }

        // Build image URLs from rydeshopper pattern: https://inventoryimage.rydeshopper.com/images/<VIN>/Original/<IMAGE-ID>.jpg
        const imageIds = listing.images ? listing.images.split('|') : [];
        const rydeShopperPhotos = imageIds.map(id => 
          `https://inventoryimage.rydeshopper.com/images/${listing.VIN}/Original/${id}.jpg`
        );

        // Get image URL - prefer rydeshopper inventory photos, fallback to vehicle images
        const imageUrl = rydeShopperPhotos.length > 0
          ? rydeShopperPhotos[0]
          : (listing.vehicle?.featuredImageUrl ||
             listing.vehicle?.thumbnailUrl ||
             listing.vehicle?.marketingImageUrl ||
             'https://www.motortrend.com/files/placeholder-vehicle.jpg');

        // Parse price and mileage
        const price = parseInt(listing.sellingPrice) || 0;
        const mileage = parseInt(listing.mileage) || 0;

        // Format dealer name
        const dealerName = listing.dealerName || 'Local Dealer';

        // Calculate distance from dealer radius
        const distance = Math.round(listing.dealerRadius || Math.random() * 30 + 5);

        // Get all photo URLs - use rydeshopper photos if available
        const photoUrls = rydeShopperPhotos.length > 0 
          ? rydeShopperPhotos 
          : [imageUrl];
        
        console.log(`📸 ${listing.year} ${listing.make} ${listing.model}: ${photoUrls.length} photos from rydeshopper`);

        return {
          id: listing.inventoryID.toString(),
          dealerName,
          price,
          mileage,
          year: listing.year.toString(),
          condition,
          location: `ZIP: ${listing.zipCode}`,
          distance,
          imageUrl,
          photoUrls,
          trim: listing.trim || '',
          exteriorColor: listing.exteriorColor || '',
          interiorColor: listing.interiorColor || '',
          vin: listing.VIN || '',
          stockNumber: `MT${listing.inventoryID.toString().slice(-5)}`,
        };
      });

    // Cache the results
    listingsCache.set(cacheKey, { data: listings, timestamp: Date.now() });

    return listings;
  } catch (error) {
    console.error('❌ MotorTrend API error:', error);
    throw error;
  }
}

/**
 * Clear the listings cache
 */
export function clearMotortrendCache(): void {
  listingsCache.clear();
  console.log('🧹 MotorTrend listings cache cleared');
}

