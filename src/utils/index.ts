/**
 * Utils Index
 * Central export point for all utility functions
 * 
 * Organization:
 * - Vehicle categorization: bodyStyles, lifestyles, priceRanges
 * - Vehicle data: images, specs, ratings, reviews
 * - Content: articles, filtering, personas
 * - Infrastructure: dataCache, dateUtils
 * 
 * Usage:
 * ```typescript
 * import { vehicleImageFor, filterVehiclesByLifestyle } from '../utils';
 * ```
 * 
 * @module utils
 */

// ============ Vehicle Categorization ============

export {
  BODY_STYLE_CATEGORIES,
  getVehicleBodyStyle,
  filterVehiclesByBodyStyle,
  type BodyStyleCategory,
} from './vehicleBodyStyles';

export {
  LIFESTYLE_CATEGORIES,
  getVehicleLifestyles,
  filterVehiclesByLifestyle,
  type LifestyleCategory,
} from './vehicleLifestyles';

export {
  PRICE_RANGE_CATEGORIES,
  getVehiclePriceRange,
  filterVehiclesByPriceRange,
  type PriceRangeCategory,
} from './vehiclePriceRanges';

// ============ Vehicle Data ============

export {
  vehicleImageFor,
  parseVehicleName,
} from './vehicleImages';

export {
  generateStaffRating,
  generateCommunityRating,
} from './vehicleRatings';

export {
  getVehicleSpecs,
  type VehicleSpecs,
} from './vehicleSpecs';

export {
  generateVehicleReview,
  type ReviewSection,
  type VehicleReviewData,
} from './vehicleReviews';

export {
  generateUserReviews,
} from './vehicleUserReviews';

export {
  generateAIInsights,
} from './vehicleInsights';

// ============ Listings ============

export {
  formatPrice,
  formatMileage,
  type VehicleListing,
} from './vehicleListings';

export {
  generateLocalListings,
  getLocalListingsSync,
} from './localListings';

// ============ Content ============

export {
  articles,
  getArticleBySlug,
  getDefaultArticle,
  type Article,
  type ArticleContent,
  type ArticleSpecifications,
  type MotorTrendScore,
} from './articles';

export {
  getPriorityCategories,
  getPriorityCategoriesFromPersona,
  matchesPriorityCategories,
  getPersonaMatchScore,
  sortContentByUserType,
  sortContentByPersona,
  sortContentForPersonalization,
  type ContentCategory,
  type CategorizableContent,
} from './contentFiltering';

export {
  personas,
  getUserTypeToPersonas,
  getPersona,
  getPersonaFromOnboarding,
  getPersonasForUserType,
  type Persona,
  type PersonaName,
  type PrimaryContentType,
} from './personas';

// ============ Top 10 ============

export {
  getTop10ForCategory,
  type Top10Vehicle,
} from './top10Generator';

// ============ Infrastructure ============

export {
  getCachedData,
  setCachedData,
  clearCache,
  hasCachedData,
  deleteCachedData,
  clearExpiredCache,
  getCacheStats,
  getCacheInstance,
} from './dataCache';

export {
  formatJoinDate,
  getCurrentJoinDate,
  parseJoinDate,
} from './dateUtils';

export {
  computeOverallRating,
} from './ratingUtils';

