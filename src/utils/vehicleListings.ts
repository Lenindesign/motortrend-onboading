/**
 * Vehicle Listings Utility
 * Fetches real local car listings for vehicles
 */

export interface VehicleListing {
  id: string;
  image: string;
  price: string;
  name: string;
  mileage: string;
  location: string;
  dealer: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  url?: string;
}

/**
 * Generate realistic pricing based on vehicle year, make, and model
 * Uses market data patterns for different vehicle types
 */
function generateRealisticPrice(year: number, make: string, model: string): number {
  const currentYear = new Date().getFullYear();
  const age = currentYear - year;
  
  // Base prices by make (approximate market values)
  const makeBasePrices: Record<string, number> = {
    'Toyota': 25000,
    'Honda': 24000,
    'Ford': 28000,
    'Chevrolet': 27000,
    'BMW': 45000,
    'Mercedes': 50000,
    'Audi': 42000,
    'Lexus': 40000,
    'Subaru': 28000,
    'Nissan': 23000,
    'Hyundai': 22000,
    'Kia': 21000,
    'Mazda': 25000,
    'Volkswagen': 26000,
    'Jeep': 32000,
    'Dodge': 29000,
    'Tesla': 55000,
    'Bentley': 230000,
    'Rolls-Royce': 370000,
    'Ferrari': 475000,
    'Porsche': 100000,
    'Rivian': 75000,
    'Land Rover': 60000,
  };
  
  // Model multipliers (some models are more expensive)
  const modelMultipliers: Record<string, number> = {
    'WRX': 1.2,
    'Mustang': 1.3,
    'Camaro': 1.3,
    'Challenger': 1.2,
    'Corvette': 2.8,
    'Corvette Z06': 4.5,
    'Corvette ZR1': 6.5,
    'Corvette-ZR1': 6.5,
    'Model 3': 1.1,
    'Model S': 1.8,
    'Model Y': 1.4,
    '3 Series': 1.3,
    'C-Class': 1.3,
    'A4': 1.2,
    'IS': 1.2,
    'Ghost': 1.0,
    'Flying Spur': 1.0,
    'Continental GT Supersports': 1.4,
    'Maybach': 1.1,
    '911': 1.2,
    'Taycan': 0.9,
    'Panamera': 1.0,
    'R1T': 1.0,
    'F-150 Lightning': 0.85,
    'Defender': 1.0,
  };
  
  const basePrice = makeBasePrices[make] || 25000;
  const modelMultiplier = modelMultipliers[model] || 1.0;
  const adjustedBase = basePrice * modelMultiplier;
  
  // Depreciation: ~15% per year for first 3 years, then ~10% per year
  let depreciation = 1.0;
  if (age <= 3) {
    depreciation = Math.pow(0.85, age);
  } else {
    depreciation = Math.pow(0.85, 3) * Math.pow(0.90, age - 3);
  }
  
  // Add some randomness (±5%)
  const randomFactor = 0.95 + Math.random() * 0.1;
  const finalPrice = adjustedBase * depreciation * randomFactor;
  
  // Round to nearest $50
  return Math.round(finalPrice / 50) * 50;
}

/**
 * Generate realistic mileage based on vehicle age
 */
function generateRealisticMileage(year: number): number {
  const currentYear = new Date().getFullYear();
  const age = currentYear - year;
  
  // For current year vehicles (especially high-end sports cars), use very low mileage
  if (age === 0) {
    // Brand new or dealer demo: 0-500 miles
    return Math.round(Math.random() * 500);
  }
  
  // For 1-year-old vehicles, use lower mileage
  if (age === 1) {
    // Low mileage: 500-15000 miles
    return Math.round(500 + Math.random() * 14500);
  }
  
  // Average 12,000 miles per year for older vehicles
  const baseMileage = age * 12000;
  
  // Add randomness (±30%)
  const randomFactor = 0.7 + Math.random() * 0.6;
  return Math.round(baseMileage * randomFactor);
}

/**
 * Vehicle-specific listing images
 * Maps vehicle identifier to array of image URLs for local listings
 */
const vehicleListingImages: Record<string, string[]> = {
  '2026-bentley-continental-gt-supersports': [
    'https://d2kde5ohu8qb21.cloudfront.net/files/691afd34bc179600027d188e/f78d2e19ba9d9ab1093200e441e1948ax.avif',
    'https://d2kde5ohu8qb21.cloudfront.net/files/691afd15eea5d80002ef4f36/d3c368dd4db34a71991a03465fd97a9bx.avif',
    'https://d2kde5ohu8qb21.cloudfront.net/files/691afd0c7be8e500020c5075/2e0a2b261a27534a358d319b45fe8de4x.avif',
    'https://d2kde5ohu8qb21.cloudfront.net/files/691afd0a7be8e500020c5074/1b215920f0bed0292fa2a366f6b7c86bx.avif',
  ],
  '2025-chevrolet-corvette-zr1': [
    'https://d2kde5ohu8qb21.cloudfront.net/files/691b05132301ef0002f28cb8/621d52b9ab9894256510bf3018db47a1.jpg',
    'https://d2kde5ohu8qb21.cloudfront.net/files/691b05142301ef0002f28cba/37180202a3bfcd82497cb69f5964317c.jpg',
    'https://d2kde5ohu8qb21.cloudfront.net/files/691b050a0ff7fc0002b26229/0a6cc2c939b1e4c8bdb5c3d623836425x.jpg',
    'https://d2kde5ohu8qb21.cloudfront.net/files/691b050c0ff7fc0002b2622b/32f5340298ccc772c9b2bee261b0c352x.jpg',
  ],
};

/**
 * Get listing images for a specific vehicle
 */
function getListingImagesForVehicle(year: number, make: string, model: string): string[] {
  const vehicleKey = `${year}-${make}-${model}`.toLowerCase().replace(/\s+/g, ' ');
  return vehicleListingImages[vehicleKey] || [];
}

/**
 * Generate realistic dealer locations (California-based for MotorTrend)
 */
const californiaDealers = [
  'Garden Grove Toyota',
  'Long Beach Honda',
  'Costa Mesa BMW',
  'Irvine Subaru',
  'Santa Ana Ford',
  'Anaheim Chevrolet',
  'Huntington Beach Mercedes',
  'Fountain Valley Audi',
  'Tustin Lexus',
  'Orange Nissan',
  'Fullerton Hyundai',
  'Westminster Kia',
  'Brea Mazda',
  'Yorba Linda Volkswagen',
  'La Habra Jeep',
  'Placentia Dodge',
];

function getRandomDealer(): string {
  return californiaDealers[Math.floor(Math.random() * californiaDealers.length)];
}

function getRandomLocation(): string {
  const locations = [
    'Garden Grove, CA',
    'Long Beach, CA',
    'Costa Mesa, CA',
    'Irvine, CA',
    'Santa Ana, CA',
    'Anaheim, CA',
    'Huntington Beach, CA',
    'Fountain Valley, CA',
    'Tustin, CA',
    'Orange, CA',
  ];
  return locations[Math.floor(Math.random() * locations.length)];
}

/**
 * Fetch local listings for a vehicle
 * In production, this would call a real API like Cars.com, AutoTrader, etc.
 */
export async function fetchVehicleListings(
  year: number,
  make: string,
  model: string,
  limit: number = 4
): Promise<VehicleListing[]> {
  // TODO: Replace with real API call when available
  // Example: const response = await fetch(`https://api.cars.com/v1/listings?year=${year}&make=${make}&model=${model}&limit=${limit}`);
  
  // For now, generate realistic listings based on vehicle data
  const listings: VehicleListing[] = [];
  
  // Get specific listing images if available
  const listingImages = getListingImagesForVehicle(year, make, model);
  
  for (let i = 0; i < limit; i++) {
    const price = generateRealisticPrice(year, make, model);
    const mileage = generateRealisticMileage(year);
    const dealer = getRandomDealer();
    const location = getRandomLocation();
    
    // Vary the year slightly (±1 year) for variety
    const listingYear = year + (Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0);
    const listingYearBounded = Math.max(2015, Math.min(new Date().getFullYear(), listingYear));
    
    // Format price with commas
    const formattedPrice = `$${price.toLocaleString('en-US')}`;
    
    // Format mileage with commas
    const formattedMileage = `${mileage.toLocaleString('en-US')} miles`;
    
    // Generate vehicle name
    let trimOptions = ['Base', 'S', 'SE', 'SX', 'Limited', 'Premium', 'Sport'];
    let bodyStyle = '4 dr Sedan';
    
    // Special handling for Corvette models
    if (model.includes('Corvette')) {
      trimOptions = ['Base', 'Premium', 'Limited', 'SX'];
      bodyStyle = Math.random() > 0.5 ? 'Coupe' : 'Convertible';
    } else if (model.includes('SUV') || model.includes('Truck')) {
      bodyStyle = 'SUV';
    } else if (model.includes('Sedan')) {
      bodyStyle = 'Sedan';
    }
    
    const trim = trimOptions[Math.floor(Math.random() * trimOptions.length)];
    const vehicleName = `${listingYearBounded} ${make} ${model} ${trim} ${bodyStyle}`;
    
    // Use specific listing image if available, cycling through the array
    const listingImage = listingImages.length > 0 
      ? listingImages[i % listingImages.length] 
      : '';
    
    listings.push({
      id: `listing-${year}-${make}-${model}-${i}`,
      image: listingImage, // Use vehicle-specific image if available
      price: formattedPrice,
      name: vehicleName,
      mileage: formattedMileage,
      location: location,
      dealer: dealer,
      year: listingYearBounded,
      make: make,
      model: model,
      trim: trim,
    });
  }
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return listings;
}

/**
 * Format price for display
 */
export function formatPrice(price: number): string {
  return `$${price.toLocaleString('en-US')}`;
}

/**
 * Format mileage for display
 */
export function formatMileage(mileage: number): string {
  return `${mileage.toLocaleString('en-US')} miles`;
}



