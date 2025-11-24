/**
 * Utility to generate Top 10 lists for each lifestyle category
 * Uses actual vehicle scores and images
 */

import { getVehicles } from '../api/vehiclesApi';
import { generateStaffRating } from './vehicleRatings';
import { getVehicleLifestyles, type LifestyleCategory } from './vehicleLifestyles';
import { vehicleImageFor } from './vehicleImages';

export interface Top10Vehicle {
  name: string;
  image: string;
  rating: number;
  year: string;
  make: string;
  model: string;
}

/**
 * Get top 10 vehicles for a lifestyle category sorted by MotorTrend rating
 */
export const getTop10ForCategory = (category: LifestyleCategory): Top10Vehicle[] => {
  // Get all vehicles from API
  const allVehicles = getVehicles();
  
  // Filter vehicles by category
  const vehiclesInCategory = allVehicles
    .map(vehicle => {
      const vehicleName = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
      const lifestyles = getVehicleLifestyles(vehicleName);
      if (!lifestyles.includes(category)) {
        return null;
      }
      
      return {
        name: vehicleName,
        image: vehicle.image || vehicleImageFor(vehicleName),
        rating: vehicle.staffRating || generateStaffRating(vehicleName),
        year: vehicle.year,
        make: vehicle.make,
        model: vehicle.model
      };
    })
    .filter((v): v is Top10Vehicle => v !== null);

  // Sort by rating (highest first), then by year (newest first)
  const sorted = vehiclesInCategory.sort((a, b) => {
    if (b.rating !== a.rating) {
      return b.rating - a.rating;
    }
    return parseInt(b.year) - parseInt(a.year);
  });

  // Get top 10, removing duplicates by make/model (keep newest year)
  const seen = new Map<string, Top10Vehicle>();
  const unique: Top10Vehicle[] = [];
  
  for (const vehicle of sorted) {
    const key = `${vehicle.make.toLowerCase()}-${vehicle.model.toLowerCase()}`;
    if (!seen.has(key)) {
      seen.set(key, vehicle);
      unique.push(vehicle);
    } else {
      // Keep the one with higher rating or newer year
      const existing = seen.get(key)!;
      if (vehicle.rating > existing.rating || 
          (vehicle.rating === existing.rating && parseInt(vehicle.year) > parseInt(existing.year))) {
        const index = unique.indexOf(existing);
        unique[index] = vehicle;
        seen.set(key, vehicle);
      }
    }
  }

  return unique.slice(0, 10);
};

