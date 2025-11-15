// Body style categories for vehicle filtering
export type BodyStyleCategory =
  | 'Sedan'
  | 'SUV'
  | 'Truck'
  | 'Coupe'
  | 'Hatchback'
  | 'Convertible'
  | 'Wagon';

// Map vehicles to their body styles based on make/model characteristics
const vehicleBodyStyleMap: Record<string, BodyStyleCategory[]> = {
  // Sedans
  'civic': ['Sedan'],
  'corolla': ['Sedan'],
  'camry': ['Sedan'],
  'accord': ['Sedan'],
  'altima': ['Sedan'],
  'sentra': ['Sedan'],
  'sonata': ['Sedan'],
  'legacy': ['Sedan', 'Wagon'],
  'impreza': ['Sedan'],
  'mazda6': ['Sedan'],
  'mazda 6': ['Sedan'],
  'bmw 3 series': ['Sedan'],
  '3 series': ['Sedan'],
  'audi a4': ['Sedan'],
  'a4': ['Sedan'],
  'mercedes c-class': ['Sedan'],
  'c-class': ['Sedan'],
  'lexus is': ['Sedan'],
  'acura tlx': ['Sedan'],
  'tlx': ['Sedan'],
  'infiniti q50': ['Sedan'],
  'q50': ['Sedan'],
  'genesis g70': ['Sedan'],
  'g70': ['Sedan'],
  'volvo s60': ['Sedan'],
  's60': ['Sedan'],
  'cadillac ct4': ['Sedan'],
  'ct4': ['Sedan'],
  'jaguar xe': ['Sedan'],
  'xe': ['Sedan'],
  'jaguar xjs': ['Sedan'],
  'xjs': ['Sedan'],
  'giulia': ['Sedan'],
  'stinger': ['Sedan'],
  'model 3': ['Sedan'],
  'model s': ['Sedan'],
  
  // SUVs
  'rav4': ['SUV'],
  'cr-v': ['SUV'],
  'outback': ['SUV', 'Wagon'],
  'forester': ['SUV'],
  'crosstrek': ['SUV'],
  'ascent': ['SUV'],
  'explorer': ['SUV'],
  'edge': ['SUV'],
  'escape': ['SUV'],
  'bronco': ['SUV'],
  'bronco sport': ['SUV'],
  'cx-5': ['SUV'],
  'cx-9': ['SUV'],
  'cx-50': ['SUV'],
  'cx-30': ['SUV'],
  'suburban': ['SUV'],
  'tahoe': ['SUV'],
  'equinox': ['SUV'],
  'traverse': ['SUV'],
  'blazer': ['SUV'],
  'highlander': ['SUV'],
  '4runner': ['SUV'],
  'pilot': ['SUV'],
  'passport': ['SUV'],
  'ridgeline': ['SUV'],
  'hr-v': ['SUV'],
  'rogue': ['SUV'],
  'pathfinder': ['SUV'],
  'murano': ['SUV'],
  'wrangler': ['SUV'],
  'grand cherokee': ['SUV'],
  'cherokee': ['SUV'],
  'compass': ['SUV'],
  'gladiator': ['SUV'],
  'durango': ['SUV'],
  'x3': ['SUV'],
  'x5': ['SUV'],
  'x7': ['SUV'],
  'glc': ['SUV'],
  'gle': ['SUV'],
  'gls': ['SUV'],
  'q5': ['SUV'],
  'q7': ['SUV'],
  'q8': ['SUV'],
  'rx': ['SUV'],
  'gx': ['SUV'],
  'lx': ['SUV'],
  'yukon': ['SUV'],
  'tucson': ['SUV'],
  'santa fe': ['SUV'],
  'palisade': ['SUV'],
  'sportage': ['SUV'],
  'sorento': ['SUV'],
  'telluride': ['SUV'],
  'tiguan': ['SUV'],
  'atlas': ['SUV'],
  'xc60': ['SUV'],
  'xc90': ['SUV'],
  'escalade': ['SUV'],
  'xt5': ['SUV'],
  'xt6': ['SUV'],
  'qx60': ['SUV'],
  'qx80': ['SUV'],
  'rdx': ['SUV'],
  'mdx': ['SUV'],
  'gv70': ['SUV'],
  'gv80': ['SUV'],
  'model y': ['SUV'],
  
  // Trucks
  'f-150': ['Truck'],
  'silverado': ['Truck'],
  'ram': ['Truck'],
  'ranger': ['Truck'],
  'maverick': ['Truck'],
  'tacoma': ['Truck'],
  'tundra': ['Truck'],
  'frontier': ['Truck'],
  'titan': ['Truck'],
  'sierra': ['Truck'],
  '2500': ['Truck'],
  '3500': ['Truck'],
  
  // Coupes
  'mustang': ['Coupe'],
  'camaro': ['Coupe'],
  'challenger': ['Coupe'],
  'corvette': ['Coupe', 'Convertible'],
  '911': ['Coupe', 'Convertible'],
  'brz': ['Coupe'],
  'supra': ['Coupe'],
  
  // Hatchbacks
  'gti': ['Hatchback'],
  'wrx': ['Hatchback'],
  'wrx sti': ['Hatchback'],
};

/**
 * Get body style categories for a vehicle based on its name
 * @param vehicleName - Full vehicle name (e.g., "2021 Subaru WRX")
 * @returns Array of body style categories
 */
export const getVehicleBodyStyle = (vehicleName: string): BodyStyleCategory[] => {
  const normalizedName = vehicleName.toLowerCase();
  const styles: Set<BodyStyleCategory> = new Set();
  
  // Check each key in the map for matches
  for (const [key, categories] of Object.entries(vehicleBodyStyleMap)) {
    if (normalizedName.includes(key)) {
      categories.forEach(cat => styles.add(cat));
    }
  }
  
  // Default to Sedan if no match found
  if (styles.size === 0) {
    styles.add('Sedan');
  }
  
  return Array.from(styles);
};

/**
 * Filter vehicles by body style
 * @param vehicles - Array of vehicles to filter
 * @param bodyStyle - Body style category to filter by
 * @returns Filtered array of vehicles
 */
export const filterVehiclesByBodyStyle = <T extends { name: string }>(
  vehicles: T[],
  bodyStyle: BodyStyleCategory
): T[] => {
  return vehicles.filter(vehicle => {
    const vehicleStyles = getVehicleBodyStyle(vehicle.name);
    return vehicleStyles.includes(bodyStyle);
  });
};

// All available body style categories
export const BODY_STYLE_CATEGORIES: BodyStyleCategory[] = [
  'Sedan',
  'SUV',
  'Truck',
  'Coupe',
  'Hatchback',
  'Convertible',
  'Wagon',
];

