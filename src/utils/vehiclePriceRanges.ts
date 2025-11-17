// Price range categories for vehicle filtering
export type PriceRangeCategory =
  | 'Under $25,000'
  | '$25,000 - $40,000'
  | '$40,000 - $60,000'
  | '$60,000 - $80,000'
  | '$80,000 - $100,000'
  | 'Over $100,000';

// Map vehicles to their price ranges based on make/model characteristics
// This is a simplified mapping - in production, this would come from actual vehicle data
const vehiclePriceRangeMap: Record<string, PriceRangeCategory[]> = {
  // Under $25,000 - Entry-level and compact vehicles
  'civic': ['Under $25,000'],
  'corolla': ['Under $25,000'],
  'sentra': ['Under $25,000'],
  'impreza': ['Under $25,000'],
  'maverick': ['Under $25,000'],
  'crosstrek': ['Under $25,000'],
  
  // $25,000 - $40,000 - Mid-range sedans and compact SUVs
  'camry': ['$25,000 - $40,000'],
  'accord': ['$25,000 - $40,000'],
  'altima': ['$25,000 - $40,000'],
  'sonata': ['$25,000 - $40,000'],
  'legacy': ['$25,000 - $40,000'],
  'mazda6': ['$25,000 - $40,000'],
  'mazda 6': ['$25,000 - $40,000'],
  'rav4': ['$25,000 - $40,000'],
  'cr-v': ['$25,000 - $40,000'],
  'forester': ['$25,000 - $40,000'],
  'outback': ['$25,000 - $40,000'],
  'escape': ['$25,000 - $40,000'],
  'edge': ['$25,000 - $40,000'],
  'cx-5': ['$25,000 - $40,000'],
  'cx-30': ['$25,000 - $40,000'],
  'bronco sport': ['$25,000 - $40,000'],
  'ranger': ['$25,000 - $40,000'],
  'explorer': ['$25,000 - $40,000'],
  
  // $40,000 - $60,000 - Premium sedans and mid-size SUVs
  'bmw 3 series': ['$40,000 - $60,000'],
  '3 series': ['$40,000 - $60,000'],
  'audi a4': ['$40,000 - $60,000'],
  'a4': ['$40,000 - $60,000'],
  'mercedes c-class': ['$40,000 - $60,000'],
  'c-class': ['$40,000 - $60,000'],
  'lexus is': ['$40,000 - $60,000'],
  'acura tlx': ['$40,000 - $60,000'],
  'tlx': ['$40,000 - $60,000'],
  'infiniti q50': ['$40,000 - $60,000'],
  'q50': ['$40,000 - $60,000'],
  'genesis g70': ['$40,000 - $60,000'],
  'g70': ['$40,000 - $60,000'],
  'volvo s60': ['$40,000 - $60,000'],
  's60': ['$40,000 - $60,000'],
  'cadillac ct4': ['$40,000 - $60,000'],
  'ct4': ['$40,000 - $60,000'],
  'jaguar xe': ['$40,000 - $60,000'],
  'xe': ['$40,000 - $60,000'],
  'ascent': ['$40,000 - $60,000'],
  'bronco': ['$40,000 - $60,000'],
  'f-150': ['$40,000 - $60,000'],
  'silverado': ['$40,000 - $60,000'],
  'ram': ['$40,000 - $60,000'],
  
  // $40,000 - $60,000 - Performance cars and mid-range luxury
  'mustang': ['$40,000 - $60,000'],
  'camaro': ['$40,000 - $60,000'],
  'challenger': ['$40,000 - $60,000'],
  'wrx': ['$25,000 - $40,000'],
  'wrx sti': ['$40,000 - $60,000'],
  'giulia': ['$40,000 - $60,000'],
  'stinger': ['$40,000 - $60,000'],
  'model 3': ['$40,000 - $60,000'],
  
  // $60,000 - $80,000 - Premium luxury and high-performance
  'jaguar xjs': ['$60,000 - $80,000'],
  'xjs': ['$60,000 - $80,000'],
  
  // $80,000 - $100,000 - Premium luxury and high-performance
  'corvette': ['$80,000 - $100,000', 'Over $100,000'],
  '911': ['$80,000 - $100,000', 'Over $100,000'],
  'model s': ['$80,000 - $100,000'],
  'model y': ['$80,000 - $100,000'],
  
  // Over $100,000 - Ultra-luxury and exotic vehicles
  'ferrari': ['Over $100,000'],
  '296 speciale': ['Over $100,000'],
  '296-speciale': ['Over $100,000'],
  'bentley': ['Over $100,000'],
  'continental gt supersports': ['Over $100,000'],
  'continental gt': ['Over $100,000'],
  'flying spur': ['Over $100,000'],
  'rolls-royce': ['Over $100,000'],
  'rolls royce': ['Over $100,000'],
  'ghost': ['Over $100,000'],
  'maybach': ['Over $100,000'],
  'panamera': ['$80,000 - $100,000', 'Over $100,000'],
  'taycan': ['$80,000 - $100,000', 'Over $100,000'],
  'porsche': ['$80,000 - $100,000', 'Over $100,000'],
  'corvette z06': ['Over $100,000'],
  'z06': ['Over $100,000'],
  'rivian r1t': ['$60,000 - $80,000', '$80,000 - $100,000'],
  'r1t': ['$60,000 - $80,000', '$80,000 - $100,000'],
  'f-150 lightning': ['$60,000 - $80,000', '$80,000 - $100,000'],
  'defender': ['$60,000 - $80,000', '$80,000 - $100,000'],
  'land rover': ['$60,000 - $80,000', '$80,000 - $100,000'],
};

/**
 * Get price range category for a vehicle based on its name
 * @param vehicleName - Full vehicle name (e.g., "2021 Subaru WRX")
 * @returns Array of price range categories
 */
export const getVehiclePriceRange = (vehicleName: string): PriceRangeCategory[] => {
  const normalizedName = vehicleName.toLowerCase();
  const ranges: Set<PriceRangeCategory> = new Set();
  
  // Check each key in the map for matches
  for (const [key, categories] of Object.entries(vehiclePriceRangeMap)) {
    if (normalizedName.includes(key)) {
      categories.forEach(cat => ranges.add(cat));
    }
  }
  
  // Default to $25,000 - $40,000 if no match found
  if (ranges.size === 0) {
    ranges.add('$25,000 - $40,000');
  }
  
  return Array.from(ranges);
};

/**
 * Filter vehicles by price range
 * @param vehicles - Array of vehicles to filter
 * @param priceRange - Price range category to filter by
 * @returns Filtered array of vehicles
 */
export const filterVehiclesByPriceRange = <T extends { name: string }>(
  vehicles: T[],
  priceRange: PriceRangeCategory
): T[] => {
  return vehicles.filter(vehicle => {
    const vehicleRanges = getVehiclePriceRange(vehicle.name);
    return vehicleRanges.includes(priceRange);
  });
};

// All available price range categories
export const PRICE_RANGE_CATEGORIES: PriceRangeCategory[] = [
  'Under $25,000',
  '$25,000 - $40,000',
  '$40,000 - $60,000',
  '$60,000 - $80,000',
  '$80,000 - $100,000',
  'Over $100,000',
];

