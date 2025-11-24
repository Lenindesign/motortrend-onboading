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
  count: number = 5
): LocalListing[] {
  const listings: LocalListing[] = [];
  const baseYear = parseInt(vehicleYear);

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
    
    // Generate multiple photo URLs (for demo, we'll use the same image)
    // In production, this would be different photos of the same vehicle
    const photoCount = Math.floor(Math.random() * 5) + 3; // 3-7 photos per listing
    const photoUrls = Array(photoCount).fill(vehicleImage);
    
    listings.push({
      id: `listing-${i}-${Date.now()}`,
      dealerName: dealerNames[Math.floor(Math.random() * dealerNames.length)],
      price,
      mileage,
      year: listingYear,
      condition,
      location: locations[Math.floor(Math.random() * locations.length)],
      distance,
      imageUrl: vehicleImage,
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
 * Tries Marketcheck API first, falls back to mock data
 */
export async function getLocalListings(
  year: string,
  make: string,
  model: string,
  vehicleImage: string,
  zipCode?: string
): Promise<LocalListing[]> {
  try {
    // Try to import and use Marketcheck API
    const { getMarketcheckListings } = await import('../api/marketcheckApi');
    const listings = await getMarketcheckListings(year, make, model, zipCode);
    
    if (listings.length > 0) {
      console.log('✅ Using real listings from Marketcheck API');
      return listings;
    }
  } catch (error) {
    console.warn('⚠️ Marketcheck API unavailable, using mock data:', error);
  }
  
  // Fallback to mock data
  console.log('📝 Using mock listings data');
  return generateLocalListings(year, vehicleImage, 5);
}

/**
 * Synchronous version for backward compatibility
 */
export function getLocalListingsSync(
  year: string,
  _make: string,
  _model: string,
  vehicleImage: string
): LocalListing[] {
  return generateLocalListings(year, vehicleImage, 5);
}

