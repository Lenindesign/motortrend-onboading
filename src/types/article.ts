/**
 * Article Types
 * Centralized type definitions for all article/content-related data
 * 
 * @module types/article
 */

// ============ Content Types ============

/**
 * Article content block (paragraph or heading)
 */
export interface ArticleContent {
  /** Type of content block */
  type: 'paragraph' | 'heading';
  
  /** Text content */
  text: string;
}

/**
 * Vehicle specifications for review articles
 */
export interface ArticleSpecifications {
  /** Base MSRP */
  basePrice?: string;
  
  /** Engine/motor layout */
  layout?: string;
  
  /** Motor configuration (for EVs) */
  motors?: string;
  
  /** Transmission type */
  transmission?: string;
  
  /** Vehicle curb weight */
  curbWeight?: string;
  
  /** Wheelbase measurement */
  wheelbase?: string;
  
  /** Overall dimensions (L x W x H) */
  dimensions?: string;
  
  /** 0-60 mph time */
  zeroToSixty?: string;
  
  /** EPA fuel economy rating */
  epaFuelEcon?: string;
  
  /** EPA range estimate (for EVs) */
  epaRange?: string;
  
  /** On-sale date */
  onSale?: string;
  
  /** Allow additional spec fields */
  [key: string]: string | undefined;
}

// ============ Rating & Score Types ============

/**
 * MotorTrend expert score breakdown
 */
export interface MotorTrendScoreBreakdown {
  /** Performance score (0-10) */
  performance: number;
  
  /** Efficiency score (0-10) */
  efficiency: number;
  
  /** Technology score (0-10) */
  tech: number;
  
  /** Value score (0-10) */
  value: number;
}

/**
 * Detailed section in expert review
 */
export interface ReviewSection {
  /** Section title */
  title: string;
  
  /** Section content */
  content: string;
}

/**
 * Expert reviewer information
 */
export interface ReviewerInfo {
  /** Reviewer name */
  name: string;
  
  /** Reviewer avatar URL */
  avatar: string;
  
  /** Review date */
  date: string;
  
  /** Review title/headline */
  title: string;
  
  /** Short excerpt */
  excerpt: string;
  
  /** Detailed review sections (optional) */
  detailedSections?: ReviewSection[];
}

/**
 * Complete MotorTrend score card data
 */
export interface MotorTrendScore {
  /** Overall rating (0-10) */
  overallRating: number;
  
  /** Category score breakdown */
  scores: MotorTrendScoreBreakdown;
  
  /** Award designation if any */
  award?: string;
  
  /** Vehicle being reviewed */
  vehicleName: string;
  
  /** Reviewer information */
  reviewer: ReviewerInfo;
}

// ============ Main Article Interface ============

/**
 * Article category types
 */
export type ArticleCategory = 
  | 'Reviews' 
  | 'First Drive' 
  | 'Comparison' 
  | 'News' 
  | 'Features'
  | 'Buying Guide'
  | 'Top 10';

/**
 * Complete article data structure
 */
export interface Article {
  /** Article title/headline */
  title: string;
  
  /** Author name */
  author: string;
  
  /** Publication date (formatted string) */
  date: string;
  
  /** Article category */
  category: string;
  
  /** Hero/featured image URL */
  heroImage: string;
  
  /** Hero/featured video URL (optional, takes precedence over heroImage if provided) */
  heroVideo?: string;
  
  /** Additional article images */
  images: string[];
  
  /** Short excerpt/summary */
  excerpt: string;
  
  /** Article body content blocks */
  content: ArticleContent[];
  
  /** Vehicle specifications (for reviews) */
  specifications?: ArticleSpecifications;
  
  /** MotorTrend score data (for reviews) */
  motortrendScore?: MotorTrendScore;
  
  /** Vehicles in comparison (for comparison articles) */
  comparisonVehicles?: string[];
}

// ============ User Review Types ============

/**
 * User verification level
 */
export type VerificationLevel = 
  | 'none' 
  | 'owner' 
  | 'verified' 
  | 'verified_documents';

/**
 * User's relationship to the reviewed vehicle
 */
export type VehicleRelationship = 
  | 'own' 
  | 'previously_owned' 
  | 'leased' 
  | 'rented' 
  | 'test_drove' 
  | 'passenger';

/**
 * Reply to a user review
 */
export interface ReviewReply {
  /** Reply unique ID */
  id: string;
  
  /** Reply author */
  author: string;
  
  /** Reply content */
  content: string;
  
  /** Timestamp */
  date: string;
  
  /** Author avatar URL */
  avatar?: string;
}

/**
 * User-submitted vehicle review
 */
export interface UserReview {
  /** Review unique ID */
  id: string;
  
  /** Review author name */
  author: string;
  
  /** Author avatar URL */
  avatar?: string;
  
  /** Review title */
  title: string;
  
  /** Review body content */
  content: string;
  
  /** User's rating (1-10) */
  rating: number;
  
  /** Submission date */
  date: string;
  
  /** Number of helpful votes */
  helpful: number;
  
  /** Author's verification level */
  verificationLevel?: VerificationLevel;
  
  /** Author's relationship to vehicle */
  vehicleRelationship?: VehicleRelationship;
  
  /** Replies to this review */
  replies?: ReviewReply[];
  
  /** Attached media */
  media?: string[];
}

// ============ Article Query Types ============

/**
 * Filter options for article queries
 */
export interface ArticleFilters {
  /** Filter by category */
  category?: ArticleCategory[];
  
  /** Filter by author */
  author?: string;
  
  /** Search query */
  search?: string;
  
  /** Filter by vehicle name */
  vehicleName?: string;
  
  /** Filter by date range (start) */
  dateFrom?: string;
  
  /** Filter by date range (end) */
  dateTo?: string;
}

/**
 * Article query options with pagination
 */
export interface ArticleQueryOptions extends ArticleFilters {
  /** Maximum results */
  limit?: number;
  
  /** Results to skip */
  offset?: number;
  
  /** Sort by field */
  sortBy?: 'date' | 'title' | 'popularity';
  
  /** Sort direction */
  sortOrder?: 'asc' | 'desc';
}

