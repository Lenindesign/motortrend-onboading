/**
 * Vehicle Types
 * Centralized type definitions for all vehicle-related data
 * 
 * @module types/vehicle
 */

// ============ Enums & Literal Types ============

/**
 * Vehicle body style categories
 */
export type BodyStyle = 
  | 'Sedan' 
  | 'SUV' 
  | 'Truck' 
  | 'Coupe' 
  | 'Hatchback' 
  | 'Wagon' 
  | 'Convertible' 
  | 'Van'
  | 'Minivan';

/**
 * Fuel type options
 */
export type FuelType = 
  | 'Gas' 
  | 'Electric' 
  | 'Hybrid' 
  | 'Plug-in Hybrid' 
  | 'Diesel';

/**
 * Drivetrain configurations
 */
export type Drivetrain = 'FWD' | 'RWD' | 'AWD' | '4WD';

/**
 * Transmission types
 */
export type Transmission = 'Automatic' | 'Manual' | 'CVT';

/**
 * Vehicle ownership status for user's garage
 */
export type VehicleOwnership = 'own' | 'want' | 'previously_owned' | 'leased';

/**
 * Body style category for filtering (broader groupings)
 */
export type BodyStyleCategory =
  | 'Sedan'
  | 'SUV'
  | 'Truck'
  | 'Coupe'
  | 'Hatchback/Wagon'
  | 'Luxury'
  | 'Sports Car'
  | 'Electric'
  | 'Hybrid'
  | 'Minivan/Van';

/**
 * Lifestyle category for filtering vehicles by use case
 */
export type LifestyleCategory =
  | 'Family & Practical'
  | 'Performance & Enthusiast'
  | 'Luxury & Premium'
  | 'Eco-Friendly'
  | 'Adventure & Off-Road'
  | 'Daily Commute'
  | 'First-Time Buyer';

/**
 * Price range category for filtering
 */
export type PriceRangeCategory =
  | 'Under $25,000'
  | '$25,000 - $35,000'
  | '$35,000 - $50,000'
  | '$50,000 - $75,000'
  | '$75,000 - $100,000'
  | 'Over $100,000';

// ============ Main Vehicle Interface ============

/**
 * Complete vehicle data structure
 * Used throughout the application for vehicle displays
 */
export interface Vehicle {
  /** Unique identifier */
  id: string;
  
  /** Model year (e.g., "2026") */
  year: string;
  
  /** Manufacturer name (e.g., "Toyota") */
  make: string;
  
  /** Model name (e.g., "Camry") */
  model: string;
  
  /** Trim level (e.g., "XLE", "Limited") */
  trim?: string;
  
  /** Body style category */
  bodyStyle: string;
  
  /** Primary display image URL */
  image: string;
  
  /** Additional gallery images */
  galleryImages?: string[];
  
  /** Formatted price range (e.g., "$25,000 - $35,000") */
  priceRange: string;
  
  /** Minimum MSRP in dollars */
  priceMin: number;
  
  /** Maximum MSRP in dollars */
  priceMax: number;
  
  /** MotorTrend staff rating (0-10) */
  staffRating: number;
  
  /** Community/user rating average (0-10) */
  communityRating: number;
  
  /** Number of user reviews */
  reviewCount: number;
  
  /** Fuel/power type */
  fuelType: FuelType;
  
  /** Drivetrain configuration */
  drivetrain: Drivetrain;
  
  /** Transmission type */
  transmission: Transmission;
  
  /** Fuel economy (e.g., "32/41" for city/highway) */
  mpg?: string;
  
  /** Engine horsepower */
  horsepower?: number;
  
  /** Number of seats */
  seatingCapacity?: number;
  
  /** Cargo space in cubic feet */
  cargoSpace?: number;
  
  /** Notable features list */
  features?: string[];
  
  /** URL slug for routing (e.g., "2026/Toyota/Camry") */
  slug: string;
  
  /** Whether vehicle is featured/promoted */
  featured?: boolean;
  
  /** Award designation (e.g., "Car of the Year") */
  award?: string;
  
  /** Tags for filtering/categorization */
  tags?: string[];
}

// ============ Query & Filter Interfaces ============

/**
 * Filter options for vehicle queries
 */
export interface VehicleFilters {
  /** Filter by body styles */
  bodyStyle?: string[];
  
  /** Filter by manufacturers */
  make?: string[];
  
  /** Filter by model years */
  year?: string[];
  
  /** Minimum price filter */
  priceMin?: number;
  
  /** Maximum price filter */
  priceMax?: number;
  
  /** Filter by fuel types */
  fuelType?: string[];
  
  /** Filter by drivetrains */
  drivetrain?: string[];
  
  /** Minimum rating filter */
  minRating?: number;
  
  /** Search query string */
  search?: string;
}

/**
 * Sort options for vehicle queries
 */
export interface VehicleSortOptions {
  /** Field to sort by */
  sortBy?: 'price' | 'rating' | 'name' | 'year' | 'popularity';
  
  /** Sort direction */
  sortOrder?: 'asc' | 'desc';
}

/**
 * Complete query options combining filters, sorting, and pagination
 */
export interface VehicleQueryOptions extends VehicleFilters, VehicleSortOptions {
  /** Maximum results to return */
  limit?: number;
  
  /** Number of results to skip (for pagination) */
  offset?: number;
  
  /** Vehicle IDs to exclude from results */
  excludeIds?: string[];
  
  /** Filter to featured vehicles only */
  featured?: boolean;
  
  /** Use only detailed vehicle database, exclude generated legacy vehicles */
  useApiOnly?: boolean;
}

// ============ User Vehicle Data ============

/**
 * Vehicle saved by a user in their garage
 */
export interface SavedVehicle {
  /** Vehicle display name (e.g., "2026 Toyota Camry") */
  name: string;
  
  /** Model year */
  year?: string;
  
  /** Manufacturer */
  make?: string;
  
  /** Model name */
  model?: string;
  
  /** User's relationship to this vehicle */
  ownership: VehicleOwnership;
}

/**
 * User's rating for a vehicle
 */
export interface UserVehicleRating {
  /** Vehicle name */
  vehicleName: string;
  
  /** User's rating (1-10) */
  rating: number;
  
  /** When the rating was submitted */
  ratedAt?: string;
}

// ============ Display/UI Types ============

/**
 * Vehicle card display data (simplified for cards/lists)
 */
export interface VehicleCardData {
  name: string;
  image: string;
  bodyStyle: string;
  staffRating: number;
  communityRating?: number;
  priceRange?: string;
  isBookmarked?: boolean;
  slug?: string;
}

/**
 * Vehicle for Top 10 carousel display
 */
export interface Top10Vehicle {
  rank: number;
  name: string;
  image: string;
  galleryImages?: string[];
  bodyStyle: string;
  staffRating: number;
  year?: string;
  make?: string;
  model?: string;
}

/**
 * Filter options available in the UI
 */
export interface VehicleFilterOptions {
  makes: string[];
  years: string[];
  bodyStyles: string[];
  fuelTypes: string[];
  drivetrains: string[];
  priceRange: {
    min: number;
    max: number;
  };
}

// ============ API Response Types ============

/**
 * Statistics about the vehicle database
 */
export interface VehicleStats {
  total: number;
  byBodyStyle: Record<string, number>;
  byMake: Record<string, number>;
  byFuelType: Record<string, number>;
  averagePrice: number;
  averageRating: number;
}


