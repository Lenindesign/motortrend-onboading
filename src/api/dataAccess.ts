/**
 * Unified Data Access Layer
 * Provides a single interface for accessing all application data
 * Supports both local and remote data sources
 */

import { getVehicles as getVehiclesLocal, searchVehicles as searchVehiclesLocal, type Vehicle, type VehicleFilters } from './vehiclesApi';
import { articles } from '../utils/articles';
import { DATABASE_CONFIG, FEATURE_FLAGS, getApiUrl, API_ENDPOINTS } from '../config/database';
import { getCachedData, setCachedData, clearCache } from '../utils/dataCache';

/**
 * Get all vehicles with optional filtering
 */
export async function getVehicles(filters?: VehicleFilters): Promise<Vehicle[]> {
  // Check cache first if enabled
  if (FEATURE_FLAGS.enableCaching) {
    const cacheKey = `vehicles_${JSON.stringify(filters || {})}`;
    const cached = getCachedData<Vehicle[]>(cacheKey);
    if (cached) {
      return cached;
    }
  }

  let vehicles: Vehicle[];

  // Use API if enabled
  if (DATABASE_CONFIG.mode === 'api' || DATABASE_CONFIG.mode === 'hybrid') {
    try {
      const url = getApiUrl(API_ENDPOINTS.vehicles);
      const response = await fetchWithTimeout(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters || {}),
      });
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }
      
      vehicles = await response.json();
    } catch (error) {
      console.error('Failed to fetch vehicles from API:', error);
      
      // Fallback to local data in hybrid mode
      if (DATABASE_CONFIG.mode === 'hybrid') {
        vehicles = getVehiclesLocal(filters);
      } else {
        throw error;
      }
    }
  } else {
    // Use local data
    vehicles = getVehiclesLocal(filters);
  }

  // Cache the results
  if (FEATURE_FLAGS.enableCaching) {
    const cacheKey = `vehicles_${JSON.stringify(filters || {})}`;
    setCachedData(cacheKey, vehicles, DATABASE_CONFIG.cacheTimeout);
  }

  return vehicles;
}

/**
 * Search vehicles by query string
 */
export async function searchVehicles(query: string, limit?: number): Promise<Vehicle[]> {
  // Check cache first if enabled
  if (FEATURE_FLAGS.enableCaching) {
    const cacheKey = `search_${query}_${limit || 'all'}`;
    const cached = getCachedData<Vehicle[]>(cacheKey);
    if (cached) {
      return cached;
    }
  }

  let results: Vehicle[];

  // Use API if enabled
  if (DATABASE_CONFIG.mode === 'api' || DATABASE_CONFIG.mode === 'hybrid') {
    try {
      const url = `${getApiUrl(API_ENDPOINTS.search)}?q=${encodeURIComponent(query)}&limit=${limit || 50}`;
      const response = await fetchWithTimeout(url);
      
      if (!response.ok) {
        throw new Error(`Search request failed: ${response.statusText}`);
      }
      
      results = await response.json();
    } catch (error) {
      console.error('Failed to search vehicles via API:', error);
      
      // Fallback to local search in hybrid mode
      if (DATABASE_CONFIG.mode === 'hybrid') {
        results = searchVehiclesLocal(query, limit);
      } else {
        throw error;
      }
    }
  } else {
    // Use local search
    results = searchVehiclesLocal(query, limit);
  }

  // Cache the results
  if (FEATURE_FLAGS.enableCaching) {
    const cacheKey = `search_${query}_${limit || 'all'}`;
    setCachedData(cacheKey, results, DATABASE_CONFIG.cacheTimeout);
  }

  return results;
}

/**
 * Get a single vehicle by ID
 */
export async function getVehicleById(id: string): Promise<Vehicle | null> {
  // Check cache first
  if (FEATURE_FLAGS.enableCaching) {
    const cacheKey = `vehicle_${id}`;
    const cached = getCachedData<Vehicle>(cacheKey);
    if (cached) {
      return cached;
    }
  }

  let vehicle: Vehicle | null;

  if (DATABASE_CONFIG.mode === 'api' || DATABASE_CONFIG.mode === 'hybrid') {
    try {
      const url = getApiUrl(API_ENDPOINTS.vehicleDetails, { id });
      const response = await fetchWithTimeout(url);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Failed to fetch vehicle: ${response.statusText}`);
      }
      
      vehicle = await response.json();
    } catch (error) {
      console.error('Failed to fetch vehicle from API:', error);
      
      // Fallback to local data in hybrid mode
      if (DATABASE_CONFIG.mode === 'hybrid') {
        const vehicles = getVehiclesLocal();
        vehicle = vehicles.find(v => v.id === id) || null;
      } else {
        throw error;
      }
    }
  } else {
    // Use local data
    const vehicles = getVehiclesLocal();
    vehicle = vehicles.find(v => v.id === id) || null;
  }

  // Cache the result
  if (vehicle && FEATURE_FLAGS.enableCaching) {
    const cacheKey = `vehicle_${id}`;
    setCachedData(cacheKey, vehicle, DATABASE_CONFIG.cacheTimeout);
  }

  return vehicle;
}

/**
 * Get all articles
 */
export function getArticles() {
  // Articles are currently local only
  return articles;
}

/**
 * Get article by slug
 */
export function getArticleBySlug(slug: string) {
  return articles[slug] || null;
}

/**
 * Clear all cached data
 */
export function clearDataCache() {
  clearCache();
}

/**
 * Fetch with timeout support
 */
async function fetchWithTimeout(url: string, options?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DATABASE_CONFIG.requestTimeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
}

/**
 * Retry a function with exponential backoff
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = DATABASE_CONFIG.maxRetries,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError!;
}

/**
 * Export retry function for external use
 */
export { retryWithBackoff };

