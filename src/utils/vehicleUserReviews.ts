/**
 * Utility functions for generating user reviews for vehicles
 * Creates realistic user reviews based on vehicle characteristics
 */

import type { ReviewData, VerificationLevel, VehicleRelationship } from '../components/UserReviews/UserReviews';

interface ReviewTemplate {
  reviewerName: string;
  rating: number;
  title: string;
  content: string;
  vehicleModel: string;
  thumbsUpCount: number;
  categoryRatings: {
    reliability: number;
    driverExperience: number;
    budgetFriendly: number;
    manufacturerWarranty: number;
  };
  verificationLevel: VerificationLevel;
  vehicleRelationship: VehicleRelationship;
  experienceDuration: string;
  date: string;
}

/**
 * Generate reviewer names pool
 */
const reviewerNames = [
  'Mike Chen', 'Jessica Martinez', 'David Thompson', 'Alex Rodriguez', 'Emily Watson',
  'Ryan Kim', 'Sarah Johnson', 'James Wilson', 'Maria Garcia', 'Chris Anderson',
  'Lisa Brown', 'Robert Taylor', 'Jennifer Lee', 'Michael Davis', 'Amanda White',
  'Daniel Moore', 'Nicole Harris', 'Kevin Jackson', 'Stephanie Clark', 'Brian Lewis',
  'Rachel Walker', 'Matthew Hall', 'Lauren Allen', 'Tyler Young', 'Samantha King',
  'Andrew Wright', 'Olivia Lopez', 'Nathan Hill', 'Hannah Green', 'Jordan Adams'
];

/**
 * Get vehicle segment
 */
const getVehicleSegment = (_make: string, model: string): string => {
  const normalizedModel = model.toLowerCase();
  
  if (normalizedModel.includes('mustang') || normalizedModel.includes('camaro') || 
      normalizedModel.includes('challenger') || normalizedModel.includes('corvette') ||
      normalizedModel.includes('911') || normalizedModel.includes('supra') ||
      normalizedModel.includes('wrx') || normalizedModel.includes('stinger') ||
      normalizedModel.includes('giulia') || normalizedModel.includes('brz')) {
    return 'performance';
  }
  
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
  
  if (normalizedModel.includes('f-150') || normalizedModel.includes('silverado') ||
      normalizedModel.includes('ram') || normalizedModel.includes('ranger') ||
      normalizedModel.includes('tacoma') || normalizedModel.includes('tundra') ||
      normalizedModel.includes('maverick')) {
    return 'truck';
  }
  
  if (normalizedModel.includes('rav4') || normalizedModel.includes('cr-v') ||
      normalizedModel.includes('forester') || normalizedModel.includes('outback') ||
      normalizedModel.includes('explorer') || normalizedModel.includes('edge') ||
      normalizedModel.includes('escape') || normalizedModel.includes('bronco') ||
      normalizedModel.includes('cx-5') || normalizedModel.includes('cx-30') ||
      normalizedModel.includes('ascent') || normalizedModel.includes('crosstrek') ||
      normalizedModel.includes('highlander') || normalizedModel.includes('4runner')) {
    return 'suv';
  }
  
  if (normalizedModel.includes('model 3') || normalizedModel.includes('model s') ||
      normalizedModel.includes('model y')) {
    return 'electric';
  }
  
  return 'compact';
};

/**
 * Generate review templates based on vehicle segment
 */
const generateReviewTemplates = (
  year: string,
  make: string,
  model: string,
  segment: string
): ReviewTemplate[] => {
  const normalizedModel = model.toLowerCase();
  const templates: ReviewTemplate[] = [];
  
  // Get random reviewer names
  const shuffledNames = [...reviewerNames].sort(() => Math.random() - 0.5);
  let nameIndex = 0;
  
  // Helper to get next unique name
  const getNextName = () => {
    const name = shuffledNames[nameIndex % shuffledNames.length];
    nameIndex++;
    return name;
  };
  
  // Helper to generate date
  const generateDate = (monthsAgo: number) => {
    const date = new Date();
    date.setMonth(date.getMonth() - monthsAgo);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };
  
  // Helper to get trim model
  const getTrimModel = (index: number): string => {
    if (normalizedModel.includes('wrx')) {
      return ['Base', 'Premium', 'Limited'][index % 3];
    }
    if (normalizedModel.includes('mustang')) {
      return ['EcoBoost', 'EcoBoost Premium', 'GT'][index % 3];
    }
    if (normalizedModel.includes('civic')) {
      return ['LX', 'Sport', 'EX'][index % 3];
    }
    if (normalizedModel.includes('camry')) {
      return ['LE', 'SE', 'XLE'][index % 3];
    }
    if (normalizedModel.includes('f-150')) {
      return ['XL', 'XLT', 'Lariat'][index % 3];
    }
    return ['Base', 'Premium', 'Limited'][index % 3];
  };
  
  // Review 1: Positive/Enthusiast review
  if (segment === 'performance') {
    if (normalizedModel.includes('wrx')) {
      templates.push({
        reviewerName: getNextName(),
        rating: 8.5,
        title: 'Excellent daily driver with rally heritage',
        content: `The ${year} ${make} ${model} is the perfect balance between practicality and performance. I've owned mine for 3 years now and it's been incredibly reliable. The AWD system is fantastic in winter conditions, and the turbo engine provides plenty of power when you need it. The manual transmission is engaging and makes every drive enjoyable.`,
        vehicleModel: getTrimModel(1),
        thumbsUpCount: 24 + Math.floor(Math.random() * 10),
        categoryRatings: {
          reliability: 85,
          driverExperience: 80,
          budgetFriendly: 85,
          manufacturerWarranty: 80
        },
        verificationLevel: 'verified_documents',
        vehicleRelationship: 'own',
        experienceDuration: '3 years',
        date: generateDate(2)
      });
    } else if (normalizedModel.includes('mustang')) {
      templates.push({
        reviewerName: getNextName(),
        rating: 9.0,
        title: 'Incredible V8 power and classic American muscle',
        content: `The ${year} ${make} ${model} delivers exactly what I wanted - raw power and aggressive styling. The V8 engine sounds amazing and the acceleration is thrilling. The handling is much better than older Mustangs, and the tech features are modern without being overwhelming. This is a proper American muscle car that can also handle corners well.`,
        vehicleModel: getTrimModel(1),
        thumbsUpCount: 32 + Math.floor(Math.random() * 15),
        categoryRatings: {
          reliability: 85,
          driverExperience: 80,
          budgetFriendly: 85,
          manufacturerWarranty: 80
        },
        verificationLevel: 'verified_documents',
        vehicleRelationship: 'own',
        experienceDuration: '2 years',
        date: generateDate(3)
      });
    } else {
      templates.push({
        reviewerName: getNextName(),
        rating: 8.5,
        title: 'Thrilling performance and engaging driving experience',
        content: `The ${year} ${make} ${model} delivers on its performance promises. The engine is powerful and responsive, the handling is sharp, and it feels planted in corners. The driving dynamics are what make this car special - it's engaging and fun to drive every day.`,
        vehicleModel: getTrimModel(1),
        thumbsUpCount: 28 + Math.floor(Math.random() * 12),
        categoryRatings: {
          reliability: 85,
          driverExperience: 80,
          budgetFriendly: 85,
          manufacturerWarranty: 80
        },
        verificationLevel: 'verified_documents',
        vehicleRelationship: 'own',
        experienceDuration: '2 years',
        date: generateDate(2)
      });
    }
  } else if (segment === 'luxury') {
    templates.push({
      reviewerName: getNextName(),
      rating: 8.8,
      title: 'Premium experience with excellent build quality',
      content: `The ${year} ${make} ${model} represents true luxury at a competitive price. The interior materials are premium, the technology is intuitive, and the ride quality is excellent. The engine is smooth and powerful, and the overall refinement is impressive. This is a well-rounded luxury vehicle that doesn't disappoint.`,
      vehicleModel: getTrimModel(1),
      thumbsUpCount: 35 + Math.floor(Math.random() * 15),
      categoryRatings: {
        reliability: 85,
        driverExperience: 80,
        budgetFriendly: 85,
        manufacturerWarranty: 80
      },
      verificationLevel: 'verified_documents',
      vehicleRelationship: 'own',
      experienceDuration: '1.5 years',
      date: generateDate(2)
    });
  } else if (segment === 'truck') {
    templates.push({
      reviewerName: getNextName(),
      rating: 9.0,
      title: 'Incredible capability and daily comfort',
      content: `The ${year} ${make} ${model} is everything I needed in a truck. It tows with confidence, has excellent payload capacity, and the interior is surprisingly comfortable for daily driving. The tech features make it feel modern, and the build quality is solid. This is a truck that works hard and plays hard.`,
      vehicleModel: getTrimModel(1),
      thumbsUpCount: 42 + Math.floor(Math.random() * 18),
      categoryRatings: {
        reliability: 85,
        driverExperience: 80,
        budgetFriendly: 85,
        manufacturerWarranty: 80
      },
      verificationLevel: 'verified_documents',
      vehicleRelationship: 'own',
      experienceDuration: '2 years',
      date: generateDate(3)
    });
  } else if (segment === 'suv') {
    if (normalizedModel.includes('forester') || normalizedModel.includes('outback')) {
      templates.push({
        reviewerName: getNextName(),
        rating: 8.5,
        title: 'Perfect for families and outdoor adventures',
        content: `The ${year} ${make} ${model} is the ideal family vehicle. The AWD system handles all weather conditions beautifully, the cargo space is excellent, and the safety features give me peace of mind. The interior is spacious and comfortable, and the reliability has been outstanding.`,
        vehicleModel: getTrimModel(1),
        thumbsUpCount: 38 + Math.floor(Math.random() * 15),
        categoryRatings: {
          reliability: 85,
          driverExperience: 80,
          budgetFriendly: 85,
          manufacturerWarranty: 80
        },
        verificationLevel: 'verified_documents',
        vehicleRelationship: 'own',
        experienceDuration: '2.5 years',
        date: generateDate(2)
      });
    } else {
      templates.push({
        reviewerName: getNextName(),
        rating: 8.5,
        title: 'Versatile and reliable family SUV',
        content: `The ${year} ${make} ${model} has been perfect for our family. It's spacious enough for everyone and their gear, the safety features are comprehensive, and the fuel economy is reasonable for an SUV. The build quality is solid and it handles well for its size.`,
        vehicleModel: getTrimModel(1),
        thumbsUpCount: 32 + Math.floor(Math.random() * 12),
        categoryRatings: {
          reliability: 85,
          driverExperience: 80,
          budgetFriendly: 85,
          manufacturerWarranty: 80
        },
        verificationLevel: 'verified_documents',
        vehicleRelationship: 'own',
        experienceDuration: '2 years',
        date: generateDate(2)
      });
    }
  } else if (segment === 'electric') {
    templates.push({
      reviewerName: getNextName(),
      rating: 9.0,
      title: 'The future of driving - instant torque and low costs',
      content: `The ${year} ${make} ${model} has completely changed my perspective on electric vehicles. The instant torque is incredible, the tech is cutting-edge, and the operating costs are minimal. Charging at home is convenient, and the range is more than sufficient for daily use. This is the best car I've ever owned.`,
      vehicleModel: getTrimModel(1),
      thumbsUpCount: 45 + Math.floor(Math.random() * 20),
      categoryRatings: {
        reliability: 85,
        driverExperience: 80,
        budgetFriendly: 85,
        manufacturerWarranty: 80
      },
      verificationLevel: 'verified_documents',
      vehicleRelationship: 'own',
      experienceDuration: '1 year',
      date: generateDate(1)
    });
  } else {
    templates.push({
      reviewerName: getNextName(),
      rating: 8.5,
      title: 'Excellent value and reliability',
      content: `The ${year} ${make} ${model} offers exceptional value for the money. It's reliable, fuel-efficient, and practical for daily commuting. The interior is well-designed, the safety features are comprehensive, and the overall build quality is solid. This is a great car that won't break the bank.`,
      vehicleModel: getTrimModel(1),
      thumbsUpCount: 28 + Math.floor(Math.random() * 12),
      categoryRatings: {
        reliability: 85,
        driverExperience: 80,
        budgetFriendly: 85,
        manufacturerWarranty: 80
      },
      verificationLevel: 'verified_documents',
      vehicleRelationship: 'own',
      experienceDuration: '2 years',
      date: generateDate(2)
    });
  }
  
  // Review 2: Balanced/Realistic review with some concerns
  if (segment === 'performance') {
    if (normalizedModel.includes('wrx')) {
      templates.push({
        reviewerName: getNextName(),
        rating: 7.8,
        title: 'Fun car but requires premium fuel',
        content: `I love my ${year} ${make} ${model} for its sporty character and all-wheel drive capability. The handling is sharp and it corners with confidence. My main complaint is the fuel economy - it requires premium gas and I average about 22 mpg in mixed driving. The interior materials could be better for the price, but overall it's a great enthusiast car.`,
        vehicleModel: getTrimModel(0),
        thumbsUpCount: 18 + Math.floor(Math.random() * 10),
        categoryRatings: {
          reliability: 85,
          driverExperience: 80,
          budgetFriendly: 85,
          manufacturerWarranty: 80
        },
        verificationLevel: 'verified',
        vehicleRelationship: 'own',
        experienceDuration: '2 years',
        date: generateDate(4)
      });
    } else if (normalizedModel.includes('mustang')) {
      templates.push({
        reviewerName: getNextName(),
        rating: 8.0,
        title: 'Powerful but fuel economy is a concern',
        content: `The ${year} ${make} ${model} is a blast to drive with its V8 power and aggressive styling. The acceleration is incredible and it sounds amazing. However, the fuel economy is poor - I average around 18 mpg in mixed driving. The rear seats are cramped, and insurance costs are high. Still, the driving experience makes it worth it for enthusiasts.`,
        vehicleModel: getTrimModel(0),
        thumbsUpCount: 25 + Math.floor(Math.random() * 12),
        categoryRatings: {
          reliability: 85,
          driverExperience: 80,
          budgetFriendly: 85,
          manufacturerWarranty: 80
        },
        verificationLevel: 'verified',
        vehicleRelationship: 'own',
        experienceDuration: '1.5 years',
        date: generateDate(3)
      });
    } else {
      templates.push({
        reviewerName: getNextName(),
        rating: 7.5,
        title: 'Great performance with some trade-offs',
        content: `The ${year} ${make} ${model} delivers strong performance and engaging handling. The engine is powerful and responsive. However, the ride is firm and can be harsh on rough roads. Fuel economy isn't great, and the interior could use more premium materials. But if you prioritize driving dynamics, this is a solid choice.`,
        vehicleModel: getTrimModel(0),
        thumbsUpCount: 22 + Math.floor(Math.random() * 10),
        categoryRatings: {
          reliability: 85,
          driverExperience: 80,
          budgetFriendly: 85,
          manufacturerWarranty: 80
        },
        verificationLevel: 'verified',
        vehicleRelationship: 'own',
        experienceDuration: '1.5 years',
        date: generateDate(3)
      });
    }
  } else if (segment === 'luxury') {
    templates.push({
      reviewerName: getNextName(),
      rating: 7.8,
      title: 'Premium feel but expensive to maintain',
      content: `The ${year} ${make} ${model} offers a luxurious experience with excellent materials and advanced technology. The ride is smooth and comfortable, and the interior is well-appointed. However, maintenance costs are high, and some features require subscription fees after the trial period. Resale value isn't as strong as some competitors. Still, it's a great luxury vehicle if you can afford the upkeep.`,
      vehicleModel: getTrimModel(0),
      thumbsUpCount: 28 + Math.floor(Math.random() * 12),
      categoryRatings: {
        reliability: 85,
        driverExperience: 80,
        budgetFriendly: 85,
        manufacturerWarranty: 80
      },
      verificationLevel: 'verified',
      vehicleRelationship: 'own',
      experienceDuration: '1 year',
      date: generateDate(2)
    });
  } else if (segment === 'truck') {
    templates.push({
      reviewerName: getNextName(),
      rating: 8.0,
      title: 'Capable truck with thirsty fuel economy',
      content: `The ${year} ${make} ${model} is a capable truck that does everything I need. The towing capacity is impressive, the bed is useful, and the interior is comfortable. My main concern is fuel economy - it's not great, especially when towing. The price is also high for a fully loaded model. But it's reliable and built to last.`,
      vehicleModel: getTrimModel(0),
      thumbsUpCount: 35 + Math.floor(Math.random() * 15),
      categoryRatings: {
        reliability: 85,
        driverExperience: 80,
        budgetFriendly: 85,
        manufacturerWarranty: 80
      },
      verificationLevel: 'verified',
      vehicleRelationship: 'own',
      experienceDuration: '1.5 years',
      date: generateDate(3)
    });
  } else if (segment === 'suv') {
    templates.push({
      reviewerName: getNextName(),
      rating: 8.0,
      title: 'Great family vehicle with some compromises',
      content: `The ${year} ${make} ${model} has been a reliable family vehicle. It's spacious, safe, and handles well. The fuel economy is reasonable for an SUV, though not great. The third row is cramped and reduces cargo space. Some tech features feel dated compared to newer models. Overall, it's a solid choice for families.`,
      vehicleModel: getTrimModel(0),
      thumbsUpCount: 30 + Math.floor(Math.random() * 12),
      categoryRatings: {
        reliability: 85,
        driverExperience: 80,
        budgetFriendly: 85,
        manufacturerWarranty: 80
      },
      verificationLevel: 'verified',
      vehicleRelationship: 'own',
      experienceDuration: '2 years',
      date: generateDate(2)
    });
  } else if (segment === 'electric') {
    templates.push({
      reviewerName: getNextName(),
      rating: 8.0,
      title: 'Great EV but charging can be inconvenient',
      content: `The ${year} ${make} ${model} is an excellent electric vehicle with impressive performance and technology. The instant torque is addictive, and the low operating costs are great. However, long trips require planning for charging stops, and public charging infrastructure can be inconsistent. The initial price is higher than gas equivalents. Still, it's a great car for daily use.`,
      vehicleModel: getTrimModel(0),
      thumbsUpCount: 38 + Math.floor(Math.random() * 15),
      categoryRatings: {
        reliability: 85,
        driverExperience: 80,
        budgetFriendly: 85,
        manufacturerWarranty: 80
      },
      verificationLevel: 'verified',
      vehicleRelationship: 'own',
      experienceDuration: '1 year',
      date: generateDate(1)
    });
  } else {
    templates.push({
      reviewerName: getNextName(),
      rating: 8.0,
      title: 'Reliable and practical with basic features',
      content: `The ${year} ${make} ${model} is a solid, reliable car that gets the job done. It's fuel-efficient, practical, and won't break the bank. The interior is functional but basic, and some tech features are missing compared to competitors. However, it's reliable, affordable to maintain, and holds its value well.`,
      vehicleModel: getTrimModel(0),
      thumbsUpCount: 24 + Math.floor(Math.random() * 10),
      categoryRatings: {
        reliability: 85,
        driverExperience: 80,
        budgetFriendly: 85,
        manufacturerWarranty: 80
      },
      verificationLevel: 'verified',
      vehicleRelationship: 'own',
      experienceDuration: '2 years',
      date: generateDate(2)
    });
  }
  
  return templates;
};

/**
 * Generate user reviews for a vehicle
 */
export const generateUserReviews = (vehicleName: string): ReviewData[] => {
  const parts = vehicleName.trim().split(/\s+/);
  const yearIndex = parts.findIndex(part => /^\d{4}$/.test(part));
  
  let year = '2025';
  let make = '';
  let model = '';
  
  if (yearIndex !== -1) {
    year = parts[yearIndex];
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
  const templates = generateReviewTemplates(year, make, model, segment);
  
  // Convert templates to ReviewData format
  return templates.map((template, index) => ({
    id: `${make.toLowerCase()}-${model.toLowerCase().replace(/\s+/g, '-')}-${index + 1}`,
    reviewerName: template.reviewerName,
    rating: template.rating,
    title: template.title,
    content: template.content,
    vehicleType: segment === 'truck' ? 'truck' : segment === 'suv' ? 'suv' : 'sedan',
    vehicleModel: template.vehicleModel,
    date: template.date,
    mediaPreviews: [],
    thumbsUpCount: template.thumbsUpCount,
    categoryRatings: template.categoryRatings,
    verificationLevel: template.verificationLevel,
    vehicleRelationship: template.vehicleRelationship,
    experienceDuration: template.experienceDuration
  }));
};

export default generateUserReviews;

