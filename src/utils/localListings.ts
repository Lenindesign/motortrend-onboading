import type { LocalListing } from '../components/LocalListingsSidebar';

const dealerNames = [
  'AutoNation',
  'CarMax',
  'Lithia Motors',
  'Penske Automotive',
  'Sonic Automotive',
  'Group 1 Automotive',
  'Asbury Automotive',
  'Hendrick Automotive',
  'Larry H. Miller',
  'Van Tuyl Group'
];

const locations = [
  'Los Angeles, CA',
  'San Diego, CA',
  'Irvine, CA',
  'Santa Monica, CA',
  'Pasadena, CA',
  'Long Beach, CA',
  'Glendale, CA',
  'Burbank, CA',
  'Torrance, CA',
  'Costa Mesa, CA'
];

const exteriorColors = [
  'White',
  'Black',
  'Silver',
  'Gray',
  'Red',
  'Blue',
  'Green',
  'Brown',
  'Beige',
  'Gold'
];

const interiorColors = [
  'Black',
  'Beige',
  'Gray',
  'Brown',
  'Tan',
  'White'
];

const trims = [
  'Base',
  'Sport',
  'Premium',
  'Limited',
  'Platinum',
  'Ultimate',
  'SEL',
  'SLE',
  'SLT',
  'Denali'
];

/**
 * Generate sample local listings for a vehicle
 */
export function generateLocalListings(
  vehicleYear: string,
  vehicleImage: string,
  count: number = 5,
  fallbackImages?: string[]
): LocalListing[] {
  const listings: LocalListing[] = [];
  const baseYear = parseInt(vehicleYear);
  
  // Build available images pool from fallback images or just the main image
  const availableImages = fallbackImages && fallbackImages.length > 0 
    ? fallbackImages 
    : [vehicleImage];

  for (let i = 0; i < count; i++) {
    const isNew = i < 2; // First 2 listings are new
    const isCPO = !isNew && i === 2; // Third listing is CPO
    const yearVariation = isNew ? 0 : Math.floor(Math.random() * 3); // Used cars can be up to 3 years old
    const listingYear = (baseYear - yearVariation).toString();
    
    const basePrice = isNew ? 35000 + Math.random() * 30000 : 25000 + Math.random() * 25000;
    const price = Math.round(basePrice / 100) * 100; // Round to nearest hundred
    
    const mileage = isNew ? 0 : Math.round((Math.random() * 50000 + 5000) / 100) * 100;
    
    const condition = isNew ? 'New' : isCPO ? 'Certified Pre-Owned' : 'Used';
    
    const distance = Math.round(Math.random() * 50 + 1);
    
    // Use the main listing image (cycle through available images for each listing)
    const mainImage = availableImages[i % availableImages.length];
    
    // Generate photo URLs using all available images for gallery
    // Start from a different offset for each listing to add variety
    const photoCount = Math.min(availableImages.length, Math.floor(Math.random() * 5) + 3);
    const startOffset = i % availableImages.length;
    const photoUrls = Array(photoCount).fill(null).map((_, idx) => 
      availableImages[(startOffset + idx) % availableImages.length]
    );
    
    listings.push({
      id: `listing-${i}-${Date.now()}`,
      dealerName: dealerNames[Math.floor(Math.random() * dealerNames.length)],
      price,
      mileage,
      year: listingYear,
      condition,
      location: locations[Math.floor(Math.random() * locations.length)],
      distance,
      imageUrl: mainImage,
      photoUrls,
      trim: trims[Math.floor(Math.random() * trims.length)],
      exteriorColor: exteriorColors[Math.floor(Math.random() * exteriorColors.length)],
      interiorColor: interiorColors[Math.floor(Math.random() * interiorColors.length)],
      vin: `1HGBH41JXMN${Math.floor(Math.random() * 900000 + 100000)}`,
      stockNumber: `ST${Math.floor(Math.random() * 90000 + 10000)}`
    });
  }

  // Sort by price (lowest first)
  return listings.sort((a, b) => a.price - b.price);
}

/**
 * Get local listings for a specific vehicle
 * Tries MotorTrend API first (rydeshopper photos), falls back to MarketCheck, then mock data
 */
export async function getLocalListings(
  year: string,
  make: string,
  model: string,
  vehicleImage: string,
  zipCode?: string,
  fallbackImages?: string[]
): Promise<LocalListing[]> {
  console.log(`🔍 Fetching listings for: ${year} ${make} ${model}`);
  
  // Build available images pool from fallback images or just the main image
  const availableImages = fallbackImages && fallbackImages.length > 0 
    ? fallbackImages 
    : [vehicleImage];
  
  // Try MotorTrend API first (preferred - rydeshopper inventory photos)
  try {
    const { fetchMotortrendListings } = await import('../api/motortrendListingsApi');
    const listings = await fetchMotortrendListings(year, make, model, zipCode || '90001', 5);
    
    console.log(`📊 MotorTrend API returned ${listings.length} listings`);
    
    if (listings.length > 0) {
      // If images are placeholders or broken, use images from our vehicles database
      const listingsWithImages = listings.map((l, idx) => {
        const hasValidImage = l.imageUrl && !l.imageUrl.includes('placeholder');
        const hasValidPhotos = l.photoUrls && l.photoUrls.length > 0 && !l.photoUrls[0]?.includes('placeholder');
        
        const fallbackImage = availableImages[idx % availableImages.length];
        const fallbackPhotos = availableImages.length > 1 
          ? Array(Math.min(availableImages.length, 5)).fill(null).map((_, i) => availableImages[(idx + i) % availableImages.length])
          : [fallbackImage];
        
        return {
          ...l,
          imageUrl: hasValidImage ? l.imageUrl : fallbackImage,
          photoUrls: hasValidPhotos ? l.photoUrls : fallbackPhotos
        };
      });
      console.log('✅ Using real listings from MotorTrend API with fallback images from vehicles DB');
      return listingsWithImages;
    } else {
      console.log('⚠️ MotorTrend returned 0 listings, trying MarketCheck...');
    }
  } catch (error: any) {
    console.warn('⚠️ MotorTrend API error, trying MarketCheck:', error?.message);
  }
  
  // Try MarketCheck API as fallback
  try {
    const { getMarketcheckListings } = await import('../api/marketcheckApi');
    const listings = await getMarketcheckListings(year, make, model, zipCode);
    
    console.log(`📊 Marketcheck returned ${listings.length} listings`);
    
    if (listings.length > 0) {
      // Use fallback images if API images are missing
      const listingsWithFallback = listings.map((l, idx) => {
        const hasValidImage = l.imageUrl && l.imageUrl.length > 0;
        const hasValidPhotos = l.photoUrls && l.photoUrls.length > 0;
        
        const fallbackImage = availableImages[idx % availableImages.length];
        const fallbackPhotos = availableImages.length > 1 
          ? Array(Math.min(availableImages.length, 5)).fill(null).map((_, i) => availableImages[(idx + i) % availableImages.length])
          : [fallbackImage];
        
        return {
          ...l,
          imageUrl: hasValidImage ? l.imageUrl : fallbackImage,
          photoUrls: hasValidPhotos ? l.photoUrls : fallbackPhotos
        };
      });
      console.log('✅ Using real listings from Marketcheck API with fallback images:', 
        listingsWithFallback.map(l => ({ name: l.dealerName, photos: l.photoUrls?.length || 0 }))
      );
      return listingsWithFallback;
    } else {
      console.log('⚠️ Marketcheck returned 0 listings, falling back to mock data');
    }
  } catch (error: any) {
    if (error?.message === 'QUOTA_EXHAUSTED') {
      console.warn('⚠️ Marketcheck API quota exhausted.');
    } else {
      console.warn('❌ Marketcheck API error, using mock data:', error?.message);
    }
  }
  
  // Fallback to mock data with vehicle gallery images
  console.log('📝 Using mock listings data with', availableImages.length, 'fallback images');
  return generateLocalListings(year, vehicleImage, 5, fallbackImages);
}

/**
 * Synchronous version for backward compatibility
 */
export function getLocalListingsSync(
  year: string,
  _make: string,
  _model: string,
  vehicleImage: string,
  fallbackImages?: string[]
): LocalListing[] {
  return generateLocalListings(year, vehicleImage, 5, fallbackImages);
}

