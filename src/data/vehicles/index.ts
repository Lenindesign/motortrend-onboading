/**
 * Vehicle Data Loader
 * Imports vehicle data from JSON files and combines them into a single database
 * 
 * The JSON files contain vehicle data extracted from the original vehiclesApi.ts
 * Images are resolved using vehicleImageFor() for vehicles that don't have direct URLs
 * 
 * @module data/vehicles
 */

import { vehicleImageFor } from '../../utils/vehicleImages';
import type { Vehicle } from '../../types/vehicle';

// Import JSON data
import sedansData from './sedans.json';
import suvsData from './suvs.json';
import trucksData from './trucks.json';
import coupesData from './coupes.json';
import hatchbacksData from './hatchbacks.json';
import convertiblesData from './convertibles.json';
import wagonsData from './wagons.json';

/**
 * Raw vehicle data from JSON (before image resolution)
 */
interface RawVehicle {
  id: string;
  year: string;
  make: string;
  model: string;
  trim?: string;
  bodyStyle: string;
  imageSource?: string | null; // Vehicle name for vehicleImageFor()
  image?: string | null; // Direct image URL
  galleryImages?: string[];
  priceRange: string;
  priceMin: number;
  priceMax: number;
  staffRating: number;
  communityRating: number;
  reviewCount: number;
  fuelType: string;
  drivetrain: string;
  transmission: string;
  mpg?: string;
  horsepower?: number;
  seatingCapacity?: number;
  cargoSpace?: number;
  features?: string[];
  slug: string;
  featured?: boolean;
  award?: string;
  tags?: string[];
}

/**
 * Process a raw vehicle from JSON into a complete Vehicle object
 * Resolves images using vehicleImageFor() when needed
 */
function processVehicle(raw: RawVehicle): Vehicle {
  // Resolve image: use direct URL if available, otherwise use vehicleImageFor()
  const vehicleName = `${raw.year} ${raw.make} ${raw.model}`;
  const resolvedImage = raw.image || (raw.imageSource ? vehicleImageFor(raw.imageSource) : vehicleImageFor(vehicleName));
  
  return {
    id: raw.id,
    year: raw.year,
    make: raw.make,
    model: raw.model,
    trim: raw.trim,
    bodyStyle: raw.bodyStyle,
    image: resolvedImage,
    galleryImages: raw.galleryImages,
    priceRange: raw.priceRange,
    priceMin: raw.priceMin,
    priceMax: raw.priceMax,
    staffRating: raw.staffRating,
    communityRating: raw.communityRating,
    reviewCount: raw.reviewCount,
    fuelType: raw.fuelType as Vehicle['fuelType'],
    drivetrain: raw.drivetrain as Vehicle['drivetrain'],
    transmission: raw.transmission as Vehicle['transmission'],
    mpg: raw.mpg,
    horsepower: raw.horsepower,
    seatingCapacity: raw.seatingCapacity,
    cargoSpace: raw.cargoSpace,
    features: raw.features,
    slug: raw.slug,
    featured: raw.featured,
    award: raw.award,
    tags: raw.tags,
  };
}

/**
 * Process an array of raw vehicles
 */
function processVehicles(rawVehicles: RawVehicle[]): Vehicle[] {
  return rawVehicles.map(processVehicle);
}

// Process all vehicle data
export const sedans = processVehicles(sedansData as RawVehicle[]);
export const suvs = processVehicles(suvsData as RawVehicle[]);
export const trucks = processVehicles(trucksData as RawVehicle[]);
export const coupes = processVehicles(coupesData as RawVehicle[]);
export const hatchbacks = processVehicles(hatchbacksData as RawVehicle[]);
export const convertibles = processVehicles(convertiblesData as RawVehicle[]);
export const wagons = processVehicles(wagonsData as RawVehicle[]);

/**
 * Complete vehicle database combining all body styles
 */
export const vehicleDatabase: Vehicle[] = [
  ...sedans,
  ...suvs,
  ...trucks,
  ...coupes,
  ...hatchbacks,
  ...convertibles,
  ...wagons,
];

/**
 * Statistics about the vehicle database
 */
export const vehicleStats = {
  total: vehicleDatabase.length,
  byBodyStyle: {
    Sedan: sedans.length,
    SUV: suvs.length,
    Truck: trucks.length,
    Coupe: coupes.length,
    Hatchback: hatchbacks.length,
    Convertible: convertibles.length,
    Wagon: wagons.length,
  },
};

// Default export
export default vehicleDatabase;


