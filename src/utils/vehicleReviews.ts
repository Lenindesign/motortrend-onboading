/**
 * Utility functions for generating detailed vehicle reviews
 * Creates comprehensive review content based on vehicle characteristics and ratings
 */

import { generateStaffRating } from './vehicleRatings';
import { getVehiclePriceRange } from './vehiclePriceRanges';

export interface ReviewSection {
  title: string;
  content: string;
}

export interface VehicleReviewData {
  title: string;
  content: string;
  detailedSections?: ReviewSection[];
  scores: {
    performance: number;
    efficiency: number;
    tech: number;
    value: number;
  };
  pros: string[];
  cons: string[];
  trims: Array<{ name: string; price: string }>;
  priceRange: string;
  award: string;
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
 * Generate scores based on staff rating and vehicle segment
 */
const generateScores = (staffRating: number, segment: string): {
  performance: number;
  efficiency: number;
  tech: number;
  value: number;
} => {
  // Base scores vary by segment
  let basePerformance = 6;
  let baseEfficiency = 7;
  let baseTech = 7.5;
  let baseValue = 7.5;
  
  // Adjust based on segment
  if (segment === 'performance') {
    basePerformance = 7.5;
    baseEfficiency = 6;
    baseTech = 7;
    baseValue = 7;
  } else if (segment === 'luxury') {
    basePerformance = 7;
    baseEfficiency = 6.5;
    baseTech = 8.5;
    baseValue = 7;
  } else if (segment === 'truck') {
    basePerformance = 6;
    baseEfficiency = 6.5;
    baseTech = 8;
    baseValue = 8;
  } else if (segment === 'suv') {
    basePerformance = 6.5;
    baseEfficiency = 7;
    baseTech = 7.5;
    baseValue = 7.5;
  } else if (segment === 'electric') {
    basePerformance = 8;
    baseEfficiency = 9.5;
    baseTech = 9;
    baseValue = 7;
  } else if (segment === 'compact') {
    basePerformance = 6;
    baseEfficiency = 8;
    baseTech = 7.5;
    baseValue = 8.5;
  }
  
  // Adjust scores based on staff rating (higher rating = better scores)
  const ratingMultiplier = (staffRating - 7) / 2; // Scale from -0.5 to 1.25
  
  return {
    performance: Math.max(4, Math.min(10, basePerformance + (ratingMultiplier * 0.5))),
    efficiency: Math.max(4, Math.min(10, baseEfficiency + (ratingMultiplier * 0.5))),
    tech: Math.max(4, Math.min(10, baseTech + (ratingMultiplier * 0.5))),
    value: Math.max(4, Math.min(10, baseValue + (ratingMultiplier * 0.5)))
  };
};

/**
 * Generate review title based on vehicle
 */
const generateReviewTitle = (year: string, make: string, model: string, segment: string): string => {
  const normalizedModel = model.toLowerCase();
  
  // Special cases
  if (normalizedModel.includes('f-150')) {
    return `${year} ${make} ${model}: Setting the Standard for Full-Size Trucks`;
  }
  if (normalizedModel.includes('wrx')) {
    return `${make} ${model} Turbocharged Thrills, Every Time`;
  }
  if (normalizedModel.includes('mustang')) {
    return `${year} ${make} ${model}: American Performance Icon`;
  }
  if (normalizedModel.includes('camaro')) {
    return `${year} ${make} ${model}: Track-Ready Performance`;
  }
  if (normalizedModel.includes('corvette')) {
    return `${year} ${make} ${model}: Supercar Performance, Accessible Price`;
  }
  if (normalizedModel.includes('prius')) {
    return `${year} ${make} ${model}: Efficiency Meets Style`;
  }
  if (normalizedModel.includes('model 3') || normalizedModel.includes('model s')) {
    return `${year} ${make} ${model}: Electric Revolution`;
  }
  
  // Generic titles by segment
  if (segment === 'performance') {
    return `${year} ${make} ${model}: Performance Redefined`;
  }
  if (segment === 'luxury') {
    return `${year} ${make} ${model}: Premium Excellence`;
  }
  if (segment === 'truck') {
    return `${year} ${make} ${model}: Capability and Comfort`;
  }
  if (segment === 'suv') {
    return `${year} ${make} ${model}: Versatility and Style`;
  }
  if (segment === 'electric') {
    return `${year} ${make} ${model}: Electric Innovation`;
  }
  
  return `${year} ${make} ${model}: Balanced Excellence`;
};

/**
 * Generate introductory review content
 */
const generateReviewContent = (year: string, make: string, model: string, _staffRating: number, segment: string): string => {
  const normalizedModel = model.toLowerCase();
  
  // Special cases
  if (normalizedModel.includes('f-150')) {
    return `The ${year} ${make} ${model} continues to dominate the full-size truck segment with its winning combination of capability, technology, and refinement. While its on-road performance isn't groundbreaking, its exceptional tech suite, impressive efficiency for a truck, and strong value proposition make it one of the most compelling choices in the competitive pickup market.`;
  }
  if (normalizedModel.includes('wrx')) {
    return `The ${year} ${make} ${model} blends turbocharged excitement with daily practicality. While its outright performance isn't class-leading anymore, its superb tech, safety systems, and value make it one of the most compelling all-weather sport sedans on the market.`;
  }
  if (normalizedModel.includes('prius')) {
    return `Toyota put forward its best effort when it developed the current Prius hybrid. The compact hatchback boasts incredible efficiency wrapped up in one of the automaker's best designs in the last two decades. The cabin is decidedly forward-looking with large displays and the latest infotainment technology. What's more, the Prius is actually fun to drive; direct steering and excellent chassis tuning lend themselves to a compact car that's engaging on a winding road.`;
  }
  if (normalizedModel.includes('civic')) {
    return `The ${year} ${make} ${model} continues to prove why it's the compact car benchmark, blending refinement, performance, and practicality in a way few rivals can match. Whether in sedan, coupe, or hatchback form, the Civic's design remains sharp and purposeful, with just the right balance of aggression and sophistication. Behind the wheel, the Civic's chassis feels taut yet compliant—eager to corner but never punishing over bumps.`;
  }
  
  // Generic content by segment
  if (segment === 'performance') {
    return `The ${year} ${make} ${model} represents a compelling option in the performance segment, offering a blend of power, handling, and technology. With its refined design and thoughtful engineering, it delivers a driving experience that balances everyday practicality with thrilling dynamics.`;
  }
  if (segment === 'luxury') {
    return `The ${year} ${make} ${model} continues to set the standard for luxury sedans, combining premium materials, advanced technology, and refined performance. Its well-appointed interior and comprehensive feature set make it a standout choice in the competitive luxury segment.`;
  }
  if (segment === 'truck') {
    return `The ${year} ${make} ${model} offers a winning combination of capability, technology, and comfort. Whether you need serious towing capacity or a comfortable daily driver, this truck delivers with confidence and style.`;
  }
  if (segment === 'suv') {
    return `The ${year} ${make} ${model} strikes an excellent balance between versatility, comfort, and capability. Its spacious interior, advanced safety features, and refined driving dynamics make it an ideal choice for families and adventurers alike.`;
  }
  if (segment === 'electric') {
    return `The ${year} ${make} ${model} represents the future of automotive technology, combining impressive electric range, instant torque, and cutting-edge features. Its innovative design and eco-friendly credentials make it a standout choice in the growing electric vehicle market.`;
  }
  
  return `The ${year} ${make} ${model} represents a compelling option in its segment, offering a blend of performance, efficiency, and technology. With its refined design and thoughtful engineering, it delivers a driving experience that balances everyday practicality with engaging dynamics.`;
};

/**
 * Generate detailed review sections
 */
const generateDetailedSections = (
  year: string,
  make: string,
  model: string,
  scores: { performance: number; efficiency: number; tech: number; value: number },
  staffRating: number,
  segment: string
): ReviewSection[] => {
  const sections: ReviewSection[] = [];
  
  // Performance section
  const performanceContent = segment === 'performance'
    ? `The ${year} ${make} ${model} delivers impressive performance across its engine lineup. Acceleration is strong, with power delivery that feels immediate and responsive. The handling is sharp and precise, with excellent feedback through the steering wheel. The suspension tuning strikes a good balance between sporty dynamics and everyday comfort. While it may not set new lap records, it offers an engaging driving experience that enthusiasts will appreciate.`
    : segment === 'truck'
    ? `The ${year} ${make} ${model} delivers solid performance across its engine lineup, but it doesn't set new benchmarks in the segment. The base engine provides adequate power for daily driving and light hauling, while available higher-output options offer strong acceleration and towing capability. On-road dynamics are predictable rather than exciting—the steering is light and responsive around town but lacks feedback at highway speeds. The suspension does an admirable job smoothing out rough roads, but body roll is noticeable in corners, which is expected for a full-size truck.`
    : segment === 'luxury'
    ? `The ${year} ${make} ${model} offers refined performance that prioritizes comfort and smoothness over outright sportiness. The engine lineup provides adequate power for confident highway merging and passing, while the transmission shifts smoothly and unobtrusively. The suspension tuning emphasizes ride quality, absorbing bumps and road imperfections with ease. Steering is light and precise, making it easy to maneuver in tight spaces. While it won't satisfy those seeking track-day thrills, it excels as a comfortable and composed daily driver.`
    : segment === 'suv'
    ? `The ${year} ${make} ${model} delivers balanced performance that suits its versatile nature. Acceleration is adequate for confident highway merging and passing, though it won't win any drag races. The handling is predictable and composed, with body roll that's expected for an SUV. The suspension does a good job balancing ride comfort with control, smoothing out bumps while maintaining stability in corners. The steering is light and easy to use, making parking and low-speed maneuvering effortless.`
    : segment === 'electric'
    ? `The ${year} ${make} ${model} showcases the advantages of electric powertrains with instant torque delivery and smooth, silent acceleration. The electric motors provide strong performance, with power that's immediately available from a standstill. The low center of gravity from the battery pack contributes to excellent handling and stability. The regenerative braking system provides smooth deceleration while maximizing range. While range anxiety may still be a concern for some, the performance and driving experience are undeniably impressive.`
    : `The ${year} ${make} ${model} delivers solid, predictable performance that suits everyday driving needs. Acceleration is adequate for confident merging and passing, while the handling is composed and easy to manage. The suspension tuning prioritizes comfort, effectively absorbing road imperfections. The steering is light and precise, making it easy to maneuver in tight spaces. While it won't excite performance enthusiasts, it excels as a practical and reliable daily driver.`;
  
  sections.push({
    title: `Performance — ${scores.performance.toFixed(1)}/10`,
    content: performanceContent
  });
  
  // Efficiency section
  const efficiencyContent = segment === 'electric'
    ? `The ${year} ${make} ${model} offers impressive electric range, with EPA estimates typically exceeding 250 miles on a full charge. Real-world range varies based on driving conditions, weather, and driving style, but most owners find the range sufficient for daily commuting and even longer trips with proper planning. The regenerative braking system helps maximize efficiency, and charging infrastructure continues to improve nationwide. While charging times can be longer than filling a gas tank, the lower operating costs and environmental benefits make it a compelling choice.`
    : segment === 'truck'
    ? `For a full-size pickup, the ${year} ${make} ${model} delivers impressive fuel economy. The base engine achieves around 18-20 mpg city and 22-24 mpg highway, while available more efficient configurations can improve these numbers. Real-world testing shows these numbers are achievable under normal driving conditions, though aggressive towing or heavy payloads will naturally reduce efficiency. The large fuel tank provides excellent range, often exceeding 500 miles on a single tank during highway driving. While not as efficient as smaller vehicles, it strikes a commendable balance between capability and economy.`
    : segment === 'performance'
    ? `Efficiency isn't the primary focus of the ${year} ${make} ${model}, but the numbers are respectable considering its performance orientation. The engine typically achieves 18-22 mpg combined depending on driving style and conditions. The fuel tank provides adequate range for most driving needs, though frequent fill-ups may be necessary for those who enjoy spirited driving. Premium fuel may be required for optimal performance, which adds to ownership costs. Overall, it strikes a reasonable balance between performance and efficiency.`
    : segment === 'luxury'
    ? `The ${year} ${make} ${model} delivers fuel economy that's competitive for the luxury segment, typically achieving 20-24 mpg combined depending on engine choice and driving conditions. While efficiency isn't the primary selling point, the numbers are reasonable for a vehicle of this size and capability. The fuel tank provides adequate range for most driving needs, and some models offer hybrid powertrains for improved efficiency.`
    : segment === 'suv'
    ? `The ${year} ${make} ${model} delivers fuel economy that's competitive for the SUV segment, typically achieving 22-26 mpg combined depending on engine choice, drivetrain configuration, and driving conditions. Real-world testing shows these numbers are achievable with normal driving habits. The fuel tank provides good range, often exceeding 400 miles on a single tank during highway driving. Some models offer hybrid powertrains for improved efficiency, which can be particularly beneficial for city driving.`
    : `The ${year} ${make} ${model} delivers impressive fuel economy for its segment, typically achieving 25-30 mpg combined depending on engine choice and driving conditions. The efficient powertrain helps keep operating costs low, while the fuel tank provides excellent range for both city and highway driving. Real-world testing shows these EPA numbers are achievable with normal driving habits, making it an economical choice for daily commuting and longer trips.`;
  
  sections.push({
    title: `Efficiency / Range — ${scores.efficiency.toFixed(1)}/10`,
    content: efficiencyContent
  });
  
  // Tech section
  const techContent = segment === 'electric'
    ? `The ${year} ${make} ${model} showcases cutting-edge technology throughout. The infotainment system features a large, intuitive touchscreen with responsive controls and comprehensive connectivity including Apple CarPlay and Android Auto. Advanced driver-assistance features are comprehensive, including adaptive cruise control, lane-keeping assist, automatic emergency braking, and more. The electric powertrain management system provides detailed information about range, charging status, and efficiency. Over-the-air updates ensure the vehicle's software stays current with the latest features and improvements.`
    : segment === 'luxury'
    ? `This is where the ${year} ${make} ${model} truly excels. The infotainment system features a large, high-resolution touchscreen that's intuitive and responsive. The system supports wireless Apple CarPlay and Android Auto, plus cloud-based navigation and over-the-air updates. Advanced driver-assistance features are comprehensive, including adaptive cruise control, lane-keeping assist, evasive steering assist, and a 360-degree camera system. The interior technology includes premium audio systems, ambient lighting, and advanced climate control. The technology suite rivals and often exceeds competitors in the segment.`
    : segment === 'truck'
    ? `The ${year} ${make} ${model} offers impressive technology that sets new standards for the segment. The infotainment system features a large touchscreen that's intuitive and responsive, with comprehensive connectivity including wireless Apple CarPlay and Android Auto. Advanced driver-assistance features are comprehensive, including adaptive cruise control, lane-keeping assist, and a 360-degree camera system. Innovative features like trailer backup assist and onboard generator systems show thoughtful engineering. The technology suite rivals luxury vehicles and sets a new benchmark for pickup trucks.`
    : `The ${year} ${make} ${model} offers modern technology that's well-integrated and user-friendly. The infotainment system features an intuitive touchscreen with responsive controls, supporting Apple CarPlay and Android Auto. Standard safety features include forward collision warning, automatic emergency braking, and lane-keeping assist. Higher trims add advanced driver-assistance features like adaptive cruise control and blind-spot monitoring. The technology suite provides a good balance of features and value, making modern connectivity and safety accessible.`;
  
  sections.push({
    title: `Tech / Innovation — ${scores.tech.toFixed(1)}/10`,
    content: techContent
  });
  
  // Value section
  const valueContent = segment === 'compact'
    ? `The ${year} ${make} ${model} offers exceptional value across its trim range. Base models start at an affordable price point and provide a well-equipped vehicle with modern safety features and comfortable interior. Stepping up to higher trims adds premium amenities without breaking the bank. Resale value is among the best in the industry, with these vehicles typically retaining 60-70% of their value after three years. Ownership costs are reasonable, with maintenance schedules that are straightforward and parts availability that's excellent. When factoring in reliability, fuel economy, and long-term value, it provides tremendous value for money.`
    : segment === 'luxury'
    ? `The ${year} ${make} ${model} offers strong value in the luxury segment, with base models providing a well-equipped vehicle with premium features. While pricing is higher than mainstream competitors, the quality of materials, advanced technology, and refined driving experience justify the premium. Resale value is competitive for the segment, though not as strong as some Japanese luxury brands. Ownership costs are higher than mainstream vehicles, but the comprehensive warranty and service packages help offset some concerns. The combination of features, quality, and brand cachet makes it a compelling value proposition.`
    : segment === 'truck'
    ? `The ${year} ${make} ${model} offers exceptional value across its trim range. Base models start at a competitive price point and provide a well-equipped truck with modern safety features and comfortable interior. Stepping up to mid-level trims adds premium amenities without breaking the bank, while top-tier models justify their higher prices with luxury-grade interiors and advanced technology. Resale value is among the best in the industry, with these trucks typically retaining 60-70% of their value after three years. Ownership costs are reasonable for the segment, with maintenance schedules that are straightforward and parts availability that's excellent.`
    : segment === 'performance'
    ? `The ${year} ${make} ${model} offers strong value for performance enthusiasts, with base models providing impressive performance at a competitive price point. While ownership costs—fuel, insurance, and maintenance—are higher than mainstream vehicles, the driving experience justifies the premium for enthusiasts. Resale value varies depending on model and condition, but well-maintained examples typically hold their value well. The combination of performance, features, and brand cachet makes it a compelling value proposition for those seeking driving excitement.`
    : `The ${year} ${make} ${model} offers good value across its trim range, with base models providing a well-equipped vehicle with modern features. Stepping up to higher trims adds premium amenities and advanced technology. Resale value is competitive for the segment, and ownership costs are reasonable. The combination of features, reliability, and long-term value makes it a solid choice for budget-conscious buyers.`;
  
  sections.push({
    title: `Value — ${scores.value.toFixed(1)}/10`,
    content: valueContent
  });
  
  // Overall Impression section
  const overallContent = `The ${year} ${make} ${model} continues to be a compelling choice in its segment, offering a winning combination of ${segment === 'performance' ? 'performance, handling, and technology' : segment === 'luxury' ? 'luxury, technology, and refinement' : segment === 'truck' ? 'capability, technology, and comfort' : segment === 'suv' ? 'versatility, comfort, and capability' : segment === 'electric' ? 'electric innovation, performance, and technology' : 'performance, efficiency, and technology'}. While it may not excel in every single category, its overall package provides excellent value and a satisfying ownership experience. Whether you prioritize ${segment === 'performance' ? 'driving excitement' : segment === 'luxury' ? 'luxury and refinement' : segment === 'truck' ? 'towing and hauling capability' : segment === 'suv' ? 'versatility and space' : segment === 'electric' ? 'eco-friendly technology' : 'practicality and efficiency'}, the ${model} delivers with confidence and style.`;
  
  sections.push({
    title: `Overall Impression — ${staffRating.toFixed(1)} Staff Rating`,
    content: overallContent
  });
  
  return sections;
};

/**
 * Generate pros based on segment
 */
const generatePros = (segment: string): string[] => {
  if (segment === 'performance') {
    return ['Strong acceleration', 'Sharp handling', 'Engaging driving experience'];
  }
  if (segment === 'luxury') {
    return ['Premium interior materials', 'Advanced technology', 'Comfortable ride'];
  }
  if (segment === 'truck') {
    return ['Impressive towing capacity', 'Advanced technology', 'Comfortable interior'];
  }
  if (segment === 'suv') {
    return ['Spacious interior', 'Versatile cargo space', 'Comfortable ride'];
  }
  if (segment === 'electric') {
    return ['Instant torque', 'Low operating costs', 'Cutting-edge technology'];
  }
  return ['Excellent fuel economy', 'Reliable and practical', 'Good value'];
};

/**
 * Generate cons based on segment
 */
const generateCons = (segment: string): string[] => {
  if (segment === 'performance') {
    return ['Firm ride quality', 'Premium fuel required', 'Higher insurance costs'];
  }
  if (segment === 'luxury') {
    return ['Higher pricing', 'Premium fuel required', 'Higher maintenance costs'];
  }
  if (segment === 'truck') {
    return ['Fuel economy could be better', 'Large size for city driving', 'Higher trim pricing'];
  }
  if (segment === 'suv') {
    return ['Lower fuel economy than sedans', 'Larger turning radius', 'Higher pricing'];
  }
  if (segment === 'electric') {
    return ['Charging infrastructure concerns', 'Higher initial cost', 'Range limitations'];
  }
  return ['Limited engine options', 'Basic interior materials', 'Average fuel economy'];
};

/**
 * Generate trims and pricing
 */
const generateTrims = (_make: string, model: string, priceRange: string): Array<{ name: string; price: string }> => {
  const normalizedModel = model.toLowerCase();
  
  // Extract price range numbers
  let basePrice = 25000;
  let topPrice = 40000;
  
  if (priceRange.includes('Under')) {
    const priceMatch = priceRange.match(/\$([\d,]+)/);
    if (priceMatch) {
      basePrice = 15000;
      topPrice = parseInt(priceMatch[1].replace(/,/g, '')) - 1000;
    }
  } else if (priceRange.includes('Over')) {
    const priceMatch = priceRange.match(/\$([\d,]+)/);
    if (priceMatch) {
      basePrice = parseInt(priceMatch[1].replace(/,/g, ''));
      topPrice = basePrice + 50000;
    }
  } else {
    const priceMatch = priceRange.match(/\$([\d,]+)/g);
    if (priceMatch) {
      const prices = priceMatch.map(p => parseInt(p.replace(/[$,]/g, '')));
      basePrice = prices[0] || 25000;
      topPrice = prices[prices.length - 1] || 40000;
    }
  }
  
  // Special cases for specific makes/models
  if (normalizedModel.includes('f-150')) {
    // 6 trims: divide by 5
    const priceIncrement = (topPrice - basePrice) / 5;
    return [
      { name: 'XL', price: `$${basePrice.toLocaleString()}` },
      { name: 'XLT', price: `$${Math.round(basePrice + priceIncrement).toLocaleString()}` },
      { name: 'Lariat', price: `$${Math.round(basePrice + priceIncrement * 2).toLocaleString()}` },
      { name: 'King Ranch', price: `$${Math.round(basePrice + priceIncrement * 3).toLocaleString()}` },
      { name: 'Platinum', price: `$${Math.round(basePrice + priceIncrement * 4).toLocaleString()}` },
      { name: 'Limited', price: `$${topPrice.toLocaleString()}` }
    ];
  }
  
  if (normalizedModel.includes('mustang')) {
    // 5 trims: divide by 4
    const priceIncrement = (topPrice - basePrice) / 4;
    return [
      { name: 'EcoBoost', price: `$${basePrice.toLocaleString()}` },
      { name: 'EcoBoost Premium', price: `$${Math.round(basePrice + priceIncrement).toLocaleString()}` },
      { name: 'GT', price: `$${Math.round(basePrice + priceIncrement * 2).toLocaleString()}` },
      { name: 'GT Premium', price: `$${Math.round(basePrice + priceIncrement * 3).toLocaleString()}` },
      { name: 'Mach 1', price: `$${topPrice.toLocaleString()}` }
    ];
  }
  
  // For most vehicles with 3-4 trims: divide by 3
  const priceIncrement = (topPrice - basePrice) / 3;
  
  if (normalizedModel.includes('wrx')) {
    return [
      { name: 'Base', price: `$${basePrice.toLocaleString()}` },
      { name: 'Premium', price: `$${Math.round(basePrice + priceIncrement).toLocaleString()}` },
      { name: 'Limited', price: `$${Math.round(basePrice + priceIncrement * 2).toLocaleString()}` },
      { name: 'GT', price: `$${topPrice.toLocaleString()}` }
    ];
  }
  
  if (normalizedModel.includes('civic')) {
    return [
      { name: 'LX', price: `$${basePrice.toLocaleString()}` },
      { name: 'Sport', price: `$${Math.round(basePrice + priceIncrement).toLocaleString()}` },
      { name: 'EX', price: `$${Math.round(basePrice + priceIncrement * 2).toLocaleString()}` },
      { name: 'Touring', price: `$${topPrice.toLocaleString()}` }
    ];
  }
  
  if (normalizedModel.includes('camry')) {
    return [
      { name: 'LE', price: `$${basePrice.toLocaleString()}` },
      { name: 'SE', price: `$${Math.round(basePrice + priceIncrement).toLocaleString()}` },
      { name: 'XLE', price: `$${Math.round(basePrice + priceIncrement * 2).toLocaleString()}` },
      { name: 'XSE', price: `$${topPrice.toLocaleString()}` }
    ];
  }
  
  if (normalizedModel.includes('accord')) {
    return [
      { name: 'LX', price: `$${basePrice.toLocaleString()}` },
      { name: 'Sport', price: `$${Math.round(basePrice + priceIncrement).toLocaleString()}` },
      { name: 'EX-L', price: `$${Math.round(basePrice + priceIncrement * 2).toLocaleString()}` },
      { name: 'Touring', price: `$${topPrice.toLocaleString()}` }
    ];
  }
  
  if (normalizedModel.includes('rav4')) {
    return [
      { name: 'LE', price: `$${basePrice.toLocaleString()}` },
      { name: 'XLE', price: `$${Math.round(basePrice + priceIncrement).toLocaleString()}` },
      { name: 'XLE Premium', price: `$${Math.round(basePrice + priceIncrement * 2).toLocaleString()}` },
      { name: 'Limited', price: `$${topPrice.toLocaleString()}` }
    ];
  }
  
  if (normalizedModel.includes('forester') || normalizedModel.includes('outback')) {
    return [
      { name: 'Base', price: `$${basePrice.toLocaleString()}` },
      { name: 'Premium', price: `$${Math.round(basePrice + priceIncrement).toLocaleString()}` },
      { name: 'Limited', price: `$${Math.round(basePrice + priceIncrement * 2).toLocaleString()}` },
      { name: 'Touring', price: `$${topPrice.toLocaleString()}` }
    ];
  }
  
  if (normalizedModel.includes('3 series') || normalizedModel.includes('bmw')) {
    return [
      { name: '330i', price: `$${basePrice.toLocaleString()}` },
      { name: '330i xDrive', price: `$${Math.round(basePrice + priceIncrement).toLocaleString()}` },
      { name: 'M340i', price: `$${Math.round(basePrice + priceIncrement * 2).toLocaleString()}` },
      { name: 'M340i xDrive', price: `$${topPrice.toLocaleString()}` }
    ];
  }
  
  if (normalizedModel.includes('a4') || normalizedModel.includes('audi')) {
    return [
      { name: 'Premium', price: `$${basePrice.toLocaleString()}` },
      { name: 'Premium Plus', price: `$${Math.round(basePrice + priceIncrement).toLocaleString()}` },
      { name: 'Prestige', price: `$${Math.round(basePrice + priceIncrement * 2).toLocaleString()}` },
      { name: 'S4', price: `$${topPrice.toLocaleString()}` }
    ];
  }
  
  if (normalizedModel.includes('c-class') || normalizedModel.includes('mercedes')) {
    return [
      { name: 'C 300', price: `$${basePrice.toLocaleString()}` },
      { name: 'C 300 4MATIC', price: `$${Math.round(basePrice + priceIncrement).toLocaleString()}` },
      { name: 'AMG C 43', price: `$${Math.round(basePrice + priceIncrement * 2).toLocaleString()}` },
      { name: 'AMG C 63', price: `$${topPrice.toLocaleString()}` }
    ];
  }
  
  if (normalizedModel.includes('model 3') || normalizedModel.includes('tesla')) {
    // 3 trims: divide by 2
    const priceIncrement = (topPrice - basePrice) / 2;
    return [
      { name: 'Standard Range', price: `$${basePrice.toLocaleString()}` },
      { name: 'Long Range', price: `$${Math.round(basePrice + priceIncrement).toLocaleString()}` },
      { name: 'Performance', price: `$${topPrice.toLocaleString()}` }
    ];
  }
  
  if (normalizedModel.includes('camaro')) {
    return [
      { name: 'LT', price: `$${basePrice.toLocaleString()}` },
      { name: 'LT1', price: `$${Math.round(basePrice + priceIncrement).toLocaleString()}` },
      { name: 'SS', price: `$${Math.round(basePrice + priceIncrement * 2).toLocaleString()}` },
      { name: 'ZL1', price: `$${topPrice.toLocaleString()}` }
    ];
  }
  
  if (normalizedModel.includes('challenger')) {
    return [
      { name: 'SXT', price: `$${basePrice.toLocaleString()}` },
      { name: 'R/T', price: `$${Math.round(basePrice + priceIncrement).toLocaleString()}` },
      { name: 'Scat Pack', price: `$${Math.round(basePrice + priceIncrement * 2).toLocaleString()}` },
      { name: 'Hellcat', price: `$${topPrice.toLocaleString()}` }
    ];
  }
  
  if (normalizedModel.includes('silverado')) {
    return [
      { name: 'Work Truck', price: `$${basePrice.toLocaleString()}` },
      { name: 'LT', price: `$${Math.round(basePrice + priceIncrement).toLocaleString()}` },
      { name: 'RST', price: `$${Math.round(basePrice + priceIncrement * 2).toLocaleString()}` },
      { name: 'High Country', price: `$${topPrice.toLocaleString()}` }
    ];
  }
  
  if (normalizedModel.includes('ram')) {
    return [
      { name: 'Tradesman', price: `$${basePrice.toLocaleString()}` },
      { name: 'Big Horn', price: `$${Math.round(basePrice + priceIncrement).toLocaleString()}` },
      { name: 'Laramie', price: `$${Math.round(basePrice + priceIncrement * 2).toLocaleString()}` },
      { name: 'Limited', price: `$${topPrice.toLocaleString()}` }
    ];
  }
  
  // Generic trims
  return [
    { name: 'Base', price: `$${basePrice.toLocaleString()}` },
    { name: 'Mid', price: `$${Math.round(basePrice + priceIncrement).toLocaleString()}` },
    { name: 'Premium', price: `$${Math.round(basePrice + priceIncrement * 2).toLocaleString()}` },
    { name: 'Limited', price: `$${topPrice.toLocaleString()}` }
  ];
};

/**
 * Generate award based on segment
 */
const generateAward = (segment: string): string => {
  if (segment === 'performance') {
    return 'Best Performance Car';
  }
  if (segment === 'luxury') {
    return 'Best Luxury Sedan';
  }
  if (segment === 'truck') {
    return 'Best Full-Size Truck';
  }
  if (segment === 'suv') {
    return 'Best SUV';
  }
  if (segment === 'electric') {
    return 'Best Electric Vehicle';
  }
  return 'Best Compact';
};

/**
 * Main function to generate comprehensive vehicle review data
 */
export const generateVehicleReview = (
  year: string,
  make: string,
  model: string,
  vehicleName: string
): VehicleReviewData => {
  const segment = getVehicleSegment(make, model);
  const staffRating = generateStaffRating(vehicleName);
  const scores = generateScores(staffRating, segment);
  const priceRanges = getVehiclePriceRange(vehicleName);
  const priceRange = priceRanges[0] || '$25,000 - $40,000';
  
  return {
    title: generateReviewTitle(year, make, model, segment),
    content: generateReviewContent(year, make, model, staffRating, segment),
    detailedSections: generateDetailedSections(year, make, model, scores, staffRating, segment),
    scores,
    pros: generatePros(segment),
    cons: generateCons(segment),
    trims: generateTrims(make, model, priceRange),
    priceRange,
    award: generateAward(segment)
  };
};
