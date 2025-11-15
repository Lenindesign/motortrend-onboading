// Utility functions for generating consistent vehicle ratings
// Predefined array of varied ratings to ensure diversity
// Staff ratings between 6.0 and 9.5
const STAFF_RATINGS = [
  6.0, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9,
  7.0, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9,
  8.0, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9,
  9.0, 9.1, 9.2, 9.3, 9.4, 9.5
];

// Community ratings between 5.5 and 8.8
const COMMUNITY_RATINGS = [
  5.5, 5.6, 5.7, 5.8, 5.9,
  6.0, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9,
  7.0, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9,
  8.0, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8
];

/**
 * Generate consistent staff rating based on vehicle name (deterministic)
 * @param vehicleName - Full vehicle name (e.g., "2021 Subaru WRX")
 * @returns Staff rating between 6.0 and 9.5
 */
export const generateStaffRating = (vehicleName: string): number => {
  // Specific vehicle rating overrides
  const normalizedName = vehicleName.toLowerCase();
  if (normalizedName.includes('2026') && normalizedName.includes('hyundai') && normalizedName.includes('ioniq') && normalizedName.includes('6') && normalizedName.includes('n')) {
    return 9.2;
  }
  if (normalizedName.includes('2025') && normalizedName.includes('f-150')) {
    return 9.2;
  }
  if (normalizedName.includes('2026') && normalizedName.includes('f-150')) {
    return 9.5;
  }
  
  // Honda - ensure rating is at least 8.5 for all models and years
  if (normalizedName.includes('honda')) {
    // Simple hash from vehicle name for deterministic results
    let hash = 0;
    for (let i = 0; i < vehicleName.length; i++) {
      hash = ((hash << 5) - hash) + vehicleName.charCodeAt(i);
      hash = hash | 0; // Convert to 32-bit integer
    }
    hash = Math.abs(hash);
    
    // Select from ratings array (8.5-9.5 range)
    const hondaRatings = [8.5, 8.6, 8.7, 8.8, 8.9, 9.0, 9.1, 9.2, 9.3, 9.4, 9.5];
    return hondaRatings[hash % hondaRatings.length];
  }
  
  // Tesla - ensure rating is at least 8.5 for all models and years
  if (normalizedName.includes('tesla')) {
    // Simple hash from vehicle name for deterministic results
    let hash = 0;
    for (let i = 0; i < vehicleName.length; i++) {
      hash = ((hash << 5) - hash) + vehicleName.charCodeAt(i);
      hash = hash | 0; // Convert to 32-bit integer
    }
    hash = Math.abs(hash);
    
    // Select from ratings array (8.5-9.5 range)
    const teslaRatings = [8.5, 8.6, 8.7, 8.8, 8.9, 9.0, 9.1, 9.2, 9.3, 9.4, 9.5];
    return teslaRatings[hash % teslaRatings.length];
  }
  
  // Ford Explorer - ensure rating is at least 8.5 for all years
  if (normalizedName.includes('ford') && normalizedName.includes('explorer')) {
    // Simple hash from vehicle name for deterministic results
    let hash = 0;
    for (let i = 0; i < vehicleName.length; i++) {
      hash = ((hash << 5) - hash) + vehicleName.charCodeAt(i);
      hash = hash | 0; // Convert to 32-bit integer
    }
    hash = Math.abs(hash);
    
    // Select from ratings array (8.5-9.5 range)
    const explorerRatings = [8.5, 8.6, 8.7, 8.8, 8.9, 9.0, 9.1, 9.2, 9.3, 9.4, 9.5];
    return explorerRatings[hash % explorerRatings.length];
  }
  
  // Simple hash from vehicle name for deterministic results
  let hash = 0;
  for (let i = 0; i < vehicleName.length; i++) {
    hash = ((hash << 5) - hash) + vehicleName.charCodeAt(i);
    hash = hash | 0; // Convert to 32-bit integer
  }
  hash = Math.abs(hash);
  
  // Select from predefined ratings array
  const rating = STAFF_RATINGS[hash % STAFF_RATINGS.length];
  
  // Override: Change 6.3 to 9.3
  if (rating === 6.3) {
    return 9.3;
  }
  
  return rating;
};

/**
 * Generate consistent community rating based on vehicle name (deterministic)
 * @param vehicleName - Full vehicle name (e.g., "2021 Subaru WRX")
 * @returns Community rating between 5.5 and 8.8 (or specific overrides)
 */
export const generateCommunityRating = (vehicleName: string): number => {
  // Specific vehicle rating overrides
  const normalizedName = vehicleName.toLowerCase();
  if (normalizedName.includes('2026') && normalizedName.includes('hyundai') && normalizedName.includes('ioniq') && normalizedName.includes('6') && normalizedName.includes('n')) {
    return 8.9;
  }
  if (normalizedName.includes('2025') && normalizedName.includes('f-150')) {
    return 8.9;
  }
  if (normalizedName.includes('2026') && normalizedName.includes('f-150')) {
    return 9.2;
  }
  
  // Honda - ensure rating is at least 8.5 for all models and years
  if (normalizedName.includes('honda')) {
    // Different hash for community rating to ensure variation
    let hash = 5381;
    for (let i = 0; i < vehicleName.length; i++) {
      hash = ((hash << 5) + hash) + vehicleName.charCodeAt(i);
      hash = hash | 0;
    }
    hash = Math.abs(hash);
    
    // Select from ratings array (8.5-9.5 range)
    const hondaRatings = [8.5, 8.6, 8.7, 8.8, 8.9, 9.0, 9.1, 9.2, 9.3, 9.4, 9.5];
    return hondaRatings[hash % hondaRatings.length];
  }
  
  // Different hash for community rating to ensure variation
  let hash = 5381;
  for (let i = 0; i < vehicleName.length; i++) {
    hash = ((hash << 5) + hash) + vehicleName.charCodeAt(i);
    hash = hash | 0;
  }
  hash = Math.abs(hash);
  
  // Select from predefined ratings array
  return COMMUNITY_RATINGS[hash % COMMUNITY_RATINGS.length];
};

