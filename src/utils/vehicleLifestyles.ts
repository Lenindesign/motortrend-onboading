// Lifestyle categories for vehicle filtering
export type LifestyleCategory =
  | 'Daily Commute'
  | 'Family & Practical'
  | 'Adventure & Off-Road'
  | 'Urban & Style'
  | 'Performance & Enthusiast'
  | 'Eco & Future-Ready'
  | 'Luxury & Comfort'
  | 'Utility & Work';

// Map vehicles to their lifestyle categories based on make/model characteristics
const vehicleLifestyleMap: Record<string, LifestyleCategory[]> = {
  // Daily Commute - Efficient, practical sedans and compact cars
  'civic': ['Daily Commute', 'Family & Practical'],
  'corolla': ['Daily Commute', 'Family & Practical'],
  'camry': ['Daily Commute', 'Family & Practical'],
  'accord': ['Daily Commute', 'Family & Practical'],
  'altima': ['Daily Commute', 'Family & Practical'],
  'sentra': ['Daily Commute'],
  'sonata': ['Daily Commute', 'Family & Practical'],
  'legacy': ['Daily Commute', 'Family & Practical'],
  'impreza': ['Daily Commute', 'Family & Practical'],
  'mazda6': ['Daily Commute', 'Urban & Style'],
  'mazda 6': ['Daily Commute', 'Urban & Style'],
  
  // Family & Practical - SUVs, crossovers, minivans
  'rav4': ['Family & Practical', 'Adventure & Off-Road'],
  'cr-v': ['Family & Practical', 'Adventure & Off-Road'],
  'outback': ['Family & Practical', 'Adventure & Off-Road'],
  'forester': ['Family & Practical', 'Adventure & Off-Road'],
  'crosstrek': ['Family & Practical', 'Adventure & Off-Road'],
  'ascent': ['Family & Practical'],
  'explorer': ['Family & Practical', 'Utility & Work'],
  'edge': ['Family & Practical'],
  'escape': ['Family & Practical'],
  'bronco sport': ['Family & Practical', 'Adventure & Off-Road'],
  'cx-5': ['Family & Practical', 'Urban & Style'],
  'cx-30': ['Family & Practical', 'Urban & Style'],
  
  // Adventure & Off-Road - Rugged SUVs, trucks, off-road vehicles
  'bronco': ['Adventure & Off-Road'],
  'f-150': ['Adventure & Off-Road', 'Utility & Work'],
  'ranger': ['Adventure & Off-Road', 'Utility & Work'],
  'maverick': ['Adventure & Off-Road', 'Utility & Work'],
  'silverado': ['Utility & Work', 'Adventure & Off-Road'],
  'ram': ['Utility & Work', 'Adventure & Off-Road'],
  'suburban': ['Family & Practical', 'Utility & Work'],
  'wrx': ['Adventure & Off-Road', 'Performance & Enthusiast'],
  'wrx sti': ['Adventure & Off-Road', 'Performance & Enthusiast'],
  
  // Urban & Style - Stylish, compact, city-friendly vehicles
  'brz': ['Urban & Style', 'Performance & Enthusiast'],
  'gti': ['Urban & Style', 'Performance & Enthusiast'],
  'supra': ['Urban & Style', 'Performance & Enthusiast'],
  
  // Performance & Enthusiast - Sports cars, high-performance vehicles
  'mustang': ['Performance & Enthusiast'],
  'camaro': ['Performance & Enthusiast'],
  'challenger': ['Performance & Enthusiast'],
  'corvette': ['Performance & Enthusiast', 'Luxury & Comfort'],
  '911': ['Performance & Enthusiast', 'Luxury & Comfort'],
  'giulia': ['Performance & Enthusiast', 'Urban & Style'],
  'stinger': ['Performance & Enthusiast'],
  
  // Eco & Future-Ready - Electric and hybrid vehicles
  'model 3': ['Eco & Future-Ready', 'Daily Commute'],
  'model s': ['Eco & Future-Ready', 'Luxury & Comfort'],
  'model y': ['Eco & Future-Ready', 'Family & Practical'],
  
  // Luxury & Comfort - Premium vehicles
  'bmw 3 series': ['Luxury & Comfort', 'Performance & Enthusiast'],
  '3 series': ['Luxury & Comfort', 'Performance & Enthusiast'],
  'audi a4': ['Luxury & Comfort', 'Urban & Style'],
  'a4': ['Luxury & Comfort', 'Urban & Style'],
  'mercedes c-class': ['Luxury & Comfort'],
  'c-class': ['Luxury & Comfort'],
  'lexus is': ['Luxury & Comfort'],
  'infiniti q50': ['Luxury & Comfort', 'Performance & Enthusiast'],
  'q50': ['Luxury & Comfort', 'Performance & Enthusiast'],
  'acura tlx': ['Luxury & Comfort'],
  'tlx': ['Luxury & Comfort'],
  'genesis g70': ['Luxury & Comfort', 'Performance & Enthusiast'],
  'g70': ['Luxury & Comfort', 'Performance & Enthusiast'],
  'volvo s60': ['Luxury & Comfort', 'Family & Practical'],
  's60': ['Luxury & Comfort', 'Family & Practical'],
  'cadillac ct4': ['Luxury & Comfort', 'Performance & Enthusiast'],
  'ct4': ['Luxury & Comfort', 'Performance & Enthusiast'],
  'jaguar xe': ['Luxury & Comfort', 'Urban & Style'],
  'xe': ['Luxury & Comfort', 'Urban & Style'],
  'jaguar xjs': ['Luxury & Comfort', 'Performance & Enthusiast'],
  'xjs': ['Luxury & Comfort', 'Performance & Enthusiast'],
};

/**
 * Get lifestyle categories for a vehicle based on its name
 * @param vehicleName - Full vehicle name (e.g., "2021 Subaru WRX")
 * @returns Array of lifestyle categories
 */
export const getVehicleLifestyles = (vehicleName: string): LifestyleCategory[] => {
  const normalizedName = vehicleName.toLowerCase();
  const lifestyles: Set<LifestyleCategory> = new Set();
  
  // Check each key in the map for matches
  for (const [key, categories] of Object.entries(vehicleLifestyleMap)) {
    if (normalizedName.includes(key)) {
      categories.forEach(cat => lifestyles.add(cat));
    }
  }
  
  // Default to "Daily Commute" if no match found
  if (lifestyles.size === 0) {
    lifestyles.add('Daily Commute');
  }
  
  return Array.from(lifestyles);
};

/**
 * Filter vehicles by lifestyle category
 * @param vehicles - Array of vehicles to filter
 * @param lifestyle - Lifestyle category to filter by
 * @returns Filtered array of vehicles
 */
export const filterVehiclesByLifestyle = <T extends { name: string }>(
  vehicles: T[],
  lifestyle: LifestyleCategory
): T[] => {
  return vehicles.filter(vehicle => {
    const vehicleLifestyles = getVehicleLifestyles(vehicle.name);
    return vehicleLifestyles.includes(lifestyle);
  });
};

// All available lifestyle categories
export const LIFESTYLE_CATEGORIES: LifestyleCategory[] = [
  'Daily Commute',
  'Family & Practical',
  'Adventure & Off-Road',
  'Urban & Style',
  'Performance & Enthusiast',
  'Eco & Future-Ready',
  'Luxury & Comfort',
  'Utility & Work',
];

