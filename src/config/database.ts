/**
 * Database Configuration
 * Central configuration for data access across the application
 * 
 * === COMMUNITY FEATURE BACKEND SETUP ===
 * 
 * The Community feature supports two modes:
 * 
 * 1. DEMO MODE (Default) - Uses localStorage
 *    - No configuration needed
 *    - Data persists locally in your browser
 *    - Perfect for development and testing
 * 
 * 2. SUPABASE MODE - Real backend with authentication
 *    - Create a free project at https://supabase.com
 *    - Run the schema and migrations from /supabase/ (SQL Editor or supabase db push)
 *    - Set environment variables:
 *      VITE_SUPABASE_URL=https://your-project.supabase.co
 *      VITE_SUPABASE_ANON_KEY=your-anon-key-here
 *    - Comments: deploy Edge Function create-comment and set secret OPENAI_API_KEY
 *      (see supabase/functions/create-comment). Migration 003 removes direct client INSERT.
 *    - Features: Real-time updates, user auth, persistent data
 */

export const DATABASE_CONFIG = {
  /**
   * Data source mode
   * - 'local': Use local JSON data (current implementation)
   * - 'api': Use remote API endpoints (future implementation)
   * - 'hybrid': Use API with local fallback
   */
  mode: 'local' as 'local' | 'api' | 'hybrid',
  
  /**
   * API endpoint base URL (for future backend integration)
   */
  apiEndpoint: import.meta.env.VITE_API_ENDPOINT || '',
  
  /**
   * Cache timeout in milliseconds (5 minutes)
   */
  cacheTimeout: 5 * 60 * 1000,
  
  /**
   * Enable mock data for development
   */
  enableMockData: true,
  
  /**
   * API request timeout in milliseconds
   */
  requestTimeout: 10000,
  
  /**
   * Number of retry attempts for failed API requests
   */
  maxRetries: 3,
  
  /**
   * Enable offline mode support
   */
  enableOfflineMode: false,
};

export const FEATURE_FLAGS = {
  /**
   * Use the unified vehicles API
   */
  useVehiclesApi: true,
  
  /**
   * Use articles API (future: when backend is ready)
   */
  useArticlesApi: false,
  
  /**
   * Enable data caching
   */
  enableCaching: true,
  
  /**
   * Enable real-time updates via WebSocket
   */
  enableRealTimeUpdates: false,
  
  /**
   * Enable analytics tracking
   */
  enableAnalytics: false,
};

/**
 * API Endpoints (for future backend integration)
 */
export const API_ENDPOINTS = {
  vehicles: '/api/vehicles',
  vehicleDetails: '/api/vehicles/:id',
  articles: '/api/articles',
  articleDetails: '/api/articles/:slug',
  search: '/api/search',
  filters: '/api/filters',
  ratings: '/api/ratings',
  reviews: '/api/reviews',
};

/**
 * Get full API URL
 */
export function getApiUrl(endpoint: string, params?: Record<string, string>): string {
  let url = `${DATABASE_CONFIG.apiEndpoint}${endpoint}`;
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, encodeURIComponent(value));
    });
  }
  
  return url;
}

/**
 * Check if API mode is enabled
 */
export function isApiMode(): boolean {
  return DATABASE_CONFIG.mode === 'api' || DATABASE_CONFIG.mode === 'hybrid';
}

/**
 * Check if local mode is enabled
 */
export function isLocalMode(): boolean {
  return DATABASE_CONFIG.mode === 'local' || DATABASE_CONFIG.mode === 'hybrid';
}
















