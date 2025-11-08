/**
 * Utility functions for generating AI insights for vehicles
 * Creates comprehensive AI-generated insights based on vehicle characteristics
 */

interface AIInsightsData {
  whatStandsOut: string[];
  whatToKnow: string[];
  bestFitFor: string[];
  trimsToConsider: Array<{ name: string; description: string }>;
  ownerTip: string;
  similarToCrossShop: string;
}

/**
 * Determine vehicle segment based on make/model
 */
const getVehicleSegment = (_make: string, model: string): string => {
  const normalizedModel = model.toLowerCase();
  
  // Performance/Sports Cars
  if (normalizedModel.includes('mustang') || normalizedModel.includes('camaro') || 
      normalizedModel.includes('challenger') || normalizedModel.includes('corvette') ||
      normalizedModel.includes('911') || normalizedModel.includes('supra') ||
      normalizedModel.includes('wrx') || normalizedModel.includes('stinger') ||
      normalizedModel.includes('giulia') || normalizedModel.includes('brz')) {
    return 'performance';
  }
  
  // Luxury Sedans
  if (normalizedModel.includes('bmw') || normalizedModel.includes('3 series') ||
      normalizedModel.includes('mercedes') || normalizedModel.includes('c-class') ||
      normalizedModel.includes('audi') || normalizedModel.includes('a4') ||
      normalizedModel.includes('lexus') || normalizedModel.includes('acura') ||
      normalizedModel.includes('tlx') || normalizedModel.includes('infiniti') ||
      normalizedModel.includes('q50') || normalizedModel.includes('genesis') ||
      normalizedModel.includes('g70') || normalizedModel.includes('volvo') ||
      normalizedModel.includes('s60') || normalizedModel.includes('cadillac') ||
      normalizedModel.includes('ct4') || normalizedModel.includes('jaguar') ||
      normalizedModel.includes('xe') || normalizedModel.includes('xjs')) {
    return 'luxury';
  }
  
  // Trucks
  if (normalizedModel.includes('f-150') || normalizedModel.includes('silverado') ||
      normalizedModel.includes('ram') || normalizedModel.includes('ranger') ||
      normalizedModel.includes('tacoma') || normalizedModel.includes('tundra') ||
      normalizedModel.includes('maverick')) {
    return 'truck';
  }
  
  // SUVs
  if (normalizedModel.includes('rav4') || normalizedModel.includes('cr-v') ||
      normalizedModel.includes('forester') || normalizedModel.includes('outback') ||
      normalizedModel.includes('explorer') || normalizedModel.includes('edge') ||
      normalizedModel.includes('escape') || normalizedModel.includes('bronco') ||
      normalizedModel.includes('cx-5') || normalizedModel.includes('cx-30') ||
      normalizedModel.includes('ascent') || normalizedModel.includes('crosstrek') ||
      normalizedModel.includes('highlander') || normalizedModel.includes('4runner') ||
      normalizedModel.includes('sequoia') || normalizedModel.includes('land cruiser') ||
      normalizedModel.includes('suburban') || normalizedModel.includes('wrangler') ||
      normalizedModel.includes('grand cherokee') || normalizedModel.includes('cherokee') ||
      normalizedModel.includes('model y')) {
    return 'suv';
  }
  
  // Electric
  if (normalizedModel.includes('model 3') || normalizedModel.includes('model s') ||
      normalizedModel.includes('model y')) {
    return 'electric';
  }
  
  // Compact/Economy Sedans
  if (normalizedModel.includes('civic') || normalizedModel.includes('corolla') ||
      normalizedModel.includes('camry') || normalizedModel.includes('accord') ||
      normalizedModel.includes('altima') || normalizedModel.includes('sentra') ||
      normalizedModel.includes('sonata') || normalizedModel.includes('legacy') ||
      normalizedModel.includes('impreza') || normalizedModel.includes('mazda6') ||
      normalizedModel.includes('prius')) {
    return 'compact';
  }
  
  return 'general';
};

/**
 * Generate "What stands out" insights based on vehicle segment
 */
const generateWhatStandsOut = (segment: string, make: string, model: string): string[] => {
  const normalizedModel = model.toLowerCase();
  const normalizedMake = make.toLowerCase();
  
  if (segment === 'performance') {
    if (normalizedModel.includes('wrx')) {
      return [
        'Turbo punch with confident AWD traction, rain or shine',
        'Engaging 6-speed manual; responsive steering and chassis',
        'Practical 4-door layout with usable trunk'
      ];
    }
    if (normalizedModel.includes('mustang')) {
      return [
        'Legendary V8 power with sharp, aggressive styling',
        'Excellent handling and track-ready performance options',
        'Strong resale value and extensive aftermarket support'
      ];
    }
    if (normalizedModel.includes('camaro') || normalizedModel.includes('corvette')) {
      return [
        'Exceptional track performance and handling dynamics',
        'Powerful engine options with impressive acceleration',
        'Distinctive design with strong brand heritage'
      ];
    }
    return [
      'Strong performance credentials and sporty dynamics',
      'Engaging driving experience with responsive handling',
      'Distinctive styling that stands out from the crowd'
    ];
  }
  
  if (segment === 'luxury') {
    if (normalizedMake.includes('bmw') || normalizedMake.includes('mercedes') || normalizedMake.includes('audi')) {
      return [
        'Premium materials and refined interior craftsmanship',
        'Advanced technology and driver assistance features',
        'Smooth, powerful engines with excellent ride quality'
      ];
    }
    return [
      'Luxurious interior with premium materials and attention to detail',
      'Advanced technology and infotainment systems',
      'Comfortable ride with excellent build quality'
    ];
  }
  
  if (segment === 'truck') {
    return [
      'Impressive towing and payload capabilities',
      'Rugged durability with strong off-road options',
      'Spacious interior and versatile cargo solutions'
    ];
  }
  
  if (segment === 'suv') {
    if (normalizedModel.includes('forester') || normalizedModel.includes('outback')) {
      return [
        'Excellent all-weather capability with standard AWD',
        'Spacious interior with impressive cargo capacity',
        'Outstanding safety ratings and reliability'
      ];
    }
    return [
      'Versatile interior space with flexible seating configurations',
      'Strong safety ratings and family-friendly features',
      'Good ground clearance with available all-wheel drive'
    ];
  }
  
  if (segment === 'electric') {
    return [
      'Instant torque and smooth, quiet acceleration',
      'Low operating costs and minimal maintenance',
      'Advanced tech and cutting-edge driver assistance'
    ];
  }
  
  if (segment === 'compact') {
    return [
      'Excellent fuel economy and low cost of ownership',
      'Reliable and practical daily driver',
      'Strong resale value and comprehensive safety features'
    ];
  }
  
  return [
    'Well-rounded package with good value proposition',
    'Reliable engineering with proven track record',
    'Practical features for everyday driving needs'
  ];
};

/**
 * Generate "What to know" insights based on vehicle segment
 */
const generateWhatToKnow = (segment: string, _make: string, model: string): string[] => {
  const normalizedModel = model.toLowerCase();
  
  if (segment === 'performance') {
    if (normalizedModel.includes('wrx')) {
      return [
        'Cabin and infotainment feel a generation behind rivals',
        'Louder road/engine noise than most daily commuters',
        'Ride can be firm over rough pavement'
      ];
    }
    return [
      'Higher fuel consumption compared to economy cars',
      'Firm ride quality prioritizes handling over comfort',
      'Premium fuel requirement and higher insurance costs'
    ];
  }
  
  if (segment === 'luxury') {
    return [
      'Higher initial cost and premium maintenance expenses',
      'Some tech features may require subscription after trial',
      'Depreciation can be significant in early years'
    ];
  }
  
  if (segment === 'truck') {
    return [
      'Lower fuel economy compared to sedans and SUVs',
      'Larger size can be challenging in tight parking spaces',
      'Higher purchase price and operating costs'
    ];
  }
  
  if (segment === 'suv') {
    return [
      'Fuel economy typically lower than sedans',
      'Larger size affects maneuverability in city driving',
      'Third-row seating often compromises cargo space'
    ];
  }
  
  if (segment === 'electric') {
    return [
      'Charging infrastructure varies by region',
      'Longer trips require charging stop planning',
      'Higher initial purchase price compared to gas equivalents'
    ];
  }
  
  if (segment === 'compact') {
    return [
      'Limited engine options and power output',
      'Basic interior materials on lower trims',
      'Cramped rear seating in some models'
    ];
  }
  
  return [
    'May lack some advanced features found in newer models',
    'Interior quality varies significantly by trim level',
    'Consider total cost of ownership beyond purchase price'
  ];
};

/**
 * Generate "Best fit for" insights
 */
const generateBestFitFor = (segment: string, model: string): string[] => {
  const normalizedModel = model.toLowerCase();
  
  if (segment === 'performance') {
    if (normalizedModel.includes('wrx')) {
      return [
        'Enthusiasts who want year-round performance and a manual',
        'Buyers needing one car that does commute + weekend fun'
      ];
    }
    return [
      'Driving enthusiasts seeking engaging performance',
      'Buyers who prioritize sporty dynamics over comfort'
    ];
  }
  
  if (segment === 'luxury') {
    return [
      'Buyers seeking premium comfort and advanced technology',
      'Professionals wanting refined daily driving experience'
    ];
  }
  
  if (segment === 'truck') {
    return [
      'Buyers needing towing capacity and hauling capability',
      'Outdoor enthusiasts and work-focused drivers'
    ];
  }
  
  if (segment === 'suv') {
    return [
      'Families needing space and versatility',
      'Buyers wanting all-weather capability and cargo room'
    ];
  }
  
  if (segment === 'electric') {
    return [
      'Eco-conscious buyers and tech early adopters',
      'Drivers with home charging and regular commute patterns'
    ];
  }
  
  if (segment === 'compact') {
    return [
      'Budget-conscious buyers seeking reliability',
      'First-time car buyers and daily commuters'
    ];
  }
  
  return [
    'Practical buyers seeking value and reliability',
    'Daily commuters needing efficient transportation'
  ];
};

/**
 * Generate "Trims to consider" insights
 */
const generateTrimsToConsider = (make: string, model: string): Array<{ name: string; description: string }> => {
  const normalizedModel = model.toLowerCase();
  const normalizedMake = make.toLowerCase();
  
  if (normalizedModel.includes('wrx')) {
    return [
      { name: 'Base/Premium', description: 'Best value; core WRX experience' },
      { name: 'Limited', description: 'Adds driver aids and comfort features without dulling the feel' }
    ];
  }
  
  if (normalizedModel.includes('camry') || normalizedModel.includes('accord')) {
    return [
      { name: 'LE/LX', description: 'Best value with essential features' },
      { name: 'XSE/EX', description: 'Premium features and sportier styling' }
    ];
  }
  
  if (normalizedMake.includes('bmw') || normalizedMake.includes('mercedes') || normalizedMake.includes('audi')) {
    return [
      { name: 'Base', description: 'Core luxury experience with essential features' },
      { name: 'Premium', description: 'Enhanced technology and comfort packages' }
    ];
  }
  
  if (normalizedModel.includes('f-150') || normalizedModel.includes('silverado')) {
    return [
      { name: 'XL/XLT', description: 'Best value for work and daily use' },
      { name: 'Lariat/LTZ', description: 'Premium features and enhanced comfort' }
    ];
  }
  
  if (normalizedModel.includes('rav4') || normalizedModel.includes('cr-v')) {
    return [
      { name: 'LE/LX', description: 'Excellent value with strong feature set' },
      { name: 'XLE/EX', description: 'Enhanced comfort and technology features' }
    ];
  }
  
  return [
    { name: 'Base', description: 'Best value with essential features' },
    { name: 'Premium', description: 'Enhanced features and improved materials' }
  ];
};

/**
 * Generate "Owner tip" insights
 */
const generateOwnerTip = (segment: string, model: string): string => {
  const normalizedModel = model.toLowerCase();
  
  if (normalizedModel.includes('wrx')) {
    return 'Budget for better tires: quality rubber noticeably sharpens grip, braking, and noise.';
  }
  
  if (segment === 'performance') {
    return 'Consider upgrading brakes and tires for track use; maintain premium fuel for optimal performance.';
  }
  
  if (segment === 'luxury') {
    return 'Factor in extended warranty or service plans; premium maintenance keeps value higher.';
  }
  
  if (segment === 'truck') {
    return 'Consider bed liners and tonneau covers for cargo protection; regular maintenance ensures longevity.';
  }
  
  if (segment === 'suv') {
    return 'All-season tires work well, but dedicated winter tires dramatically improve snow performance.';
  }
  
  if (segment === 'electric') {
    return 'Install home charging for convenience; plan charging stops for longer trips using apps.';
  }
  
  return 'Follow manufacturer maintenance schedule; quality parts and service preserve resale value.';
};

/**
 * Generate "Similar to cross-shop" insights
 */
const generateSimilarToCrossShop = (segment: string, make: string, model: string): string => {
  const normalizedModel = model.toLowerCase();
  const normalizedMake = make.toLowerCase();
  
  if (normalizedModel.includes('wrx')) {
    return 'VW Golf GTI / Golf R, Honda Civic Si/Type R, Hyundai Elantra N';
  }
  
  if (normalizedModel.includes('mustang')) {
    return 'Chevrolet Camaro, Dodge Challenger, Nissan 370Z';
  }
  
  if (normalizedModel.includes('camry') || normalizedModel.includes('accord')) {
    return 'Honda Accord/Camry, Nissan Altima, Hyundai Sonata';
  }
  
  if (normalizedMake.includes('bmw') && normalizedModel.includes('3 series')) {
    return 'Mercedes-Benz C-Class, Audi A4, Lexus IS';
  }
  
  if (normalizedModel.includes('f-150')) {
    return 'Chevrolet Silverado, Ram 1500, GMC Sierra';
  }
  
  if (normalizedModel.includes('rav4')) {
    return 'Honda CR-V, Mazda CX-5, Subaru Forester';
  }
  
  if (segment === 'performance') {
    return 'Consider similar sports sedans and coupes in the segment';
  }
  
  if (segment === 'luxury') {
    return 'Compare with other German and Japanese luxury brands';
  }
  
  if (segment === 'truck') {
    return 'Compare with other full-size and midsize trucks';
  }
  
  if (segment === 'suv') {
    return 'Compare with other compact and midsize SUVs';
  }
  
  if (segment === 'electric') {
    return 'Compare with other electric vehicles in the segment';
  }
  
  return 'Compare with similar vehicles in the same segment';
};

/**
 * Generate AI insights for a vehicle
 */
export const generateAIInsights = (vehicleName: string): AIInsightsData => {
  const parts = vehicleName.trim().split(/\s+/);
  const yearIndex = parts.findIndex(part => /^\d{4}$/.test(part));
  
  let make = '';
  let model = '';
  
  if (yearIndex !== -1) {
    const remaining = parts.slice(yearIndex + 1);
    if (remaining.length > 0) {
      make = remaining[0];
      model = remaining.slice(1).join(' ');
    }
  } else {
    if (parts.length > 0) {
      make = parts[0];
      model = parts.slice(1).join(' ');
    }
  }
  
  const segment = getVehicleSegment(make, model);
  
  return {
    whatStandsOut: generateWhatStandsOut(segment, make, model),
    whatToKnow: generateWhatToKnow(segment, make, model),
    bestFitFor: generateBestFitFor(segment, model),
    trimsToConsider: generateTrimsToConsider(make, model),
    ownerTip: generateOwnerTip(segment, model),
    similarToCrossShop: generateSimilarToCrossShop(segment, make, model)
  };
};

export default generateAIInsights;

