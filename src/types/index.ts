/**
 * Types Index
 * Central export point for all application types
 * 
 * Usage:
 * ```typescript
 * import type { Vehicle, Article, OnboardingData } from '../types';
 * ```
 * 
 * @module types
 */

// ============ Vehicle Types ============
export type {
  // Enums & Literal Types
  BodyStyle,
  FuelType,
  Drivetrain,
  Transmission,
  VehicleOwnership,
  BodyStyleCategory,
  LifestyleCategory,
  PriceRangeCategory,
  
  // Main Interfaces
  Vehicle,
  VehicleFilters,
  VehicleSortOptions,
  VehicleQueryOptions,
  
  // User Vehicle Data
  SavedVehicle,
  UserVehicleRating,
  
  // Display/UI Types
  VehicleCardData,
  Top10Vehicle,
  VehicleFilterOptions,
  
  // API Response Types
  VehicleStats,
} from './vehicle';

// ============ Article Types ============
export type {
  // Content Types
  ArticleContent,
  ArticleSpecifications,
  
  // Rating & Score Types
  MotorTrendScoreBreakdown,
  ReviewSection,
  ReviewerInfo,
  MotorTrendScore,
  
  // Main Interfaces
  ArticleCategory,
  Article,
  
  // User Review Types
  VerificationLevel,
  VehicleRelationship,
  ReviewReply,
  UserReview,
  
  // Query Types
  ArticleFilters,
  ArticleQueryOptions,
} from './article';

// ============ User Types ============
export type {
  // Profile Types
  UserType,
  OnboardingStatus,
  OnboardingData,
  
  // Rating Types
  UserRatings,
  RatingContextType,
  
  // Navigation Types
  ProfileNavTab,
  ProfileSection,
  
  // Session Types
  UserSession,
  UserPreferences,
  
  // Garage Types
  GarageVehicle,
  UserGarage,
} from './user';


