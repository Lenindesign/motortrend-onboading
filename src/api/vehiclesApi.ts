/**
 * Vehicles API
 * Provides filtering, sorting, and querying capabilities for vehicles
 * 
 * DATA SOURCES:
 * - Primary: JSON files in src/data/vehicles/ (214 detailed vehicles)
 * - Legacy: carDatabase for hybrid mode (auto-generated)
 * 
 * Types are centralized in src/types/vehicle.ts
 */

import { vehicleImageFor } from '../utils/vehicleImages';

// Import vehicle data from JSON files
import { vehicleDatabase } from '../data/vehicles';

// Import types from centralized location
import type {
  Vehicle as VehicleType,
  VehicleFilters as VehicleFiltersType,
  VehicleSortOptions as VehicleSortOptionsType,
  VehicleQueryOptions as VehicleQueryOptionsType,
  FuelType,
  Drivetrain,
  Transmission,
} from '../types/vehicle';

// Re-export types for backward compatibility
export type Vehicle = VehicleType;
export type VehicleFilters = VehicleFiltersType;
export type VehicleSortOptions = VehicleSortOptionsType;
export type VehicleQueryOptions = VehicleQueryOptionsType;
export type { FuelType, Drivetrain, Transmission };

/**
 * Legacy car database for hybrid vehicle generation
 * Contains simple vehicle name strings used to auto-generate Vehicle objects
 * when detailed data isn't available in vehicleDatabase
 */
const carDatabase = [
  '2015 Subaru WRX', '2021 Subaru WRX', '2018 Subaru WRX', '2017 Subaru WRX', '2024 Subaru WRX', '2022 Subaru WRX', '2025 Subaru WRX',
  '2020 Honda Civic', '2021 Honda Civic', '2022 Honda Civic', '2023 Honda Civic', '2024 Honda Civic', '2025 Honda Civic', '2026 Honda Civic',
  '2019 Toyota Camry', '2020 Toyota Camry', '2021 Toyota Camry', '2022 Toyota Camry', '2023 Toyota Camry', '2024 Toyota Camry', '2025 Toyota Camry',
  '2020 Ford Mustang', '2021 Ford Mustang', '2022 Ford Mustang', '2023 Ford Mustang', '2024 Ford Mustang', '2025 Ford Mustang',
  '2021 Tesla Model 3', '2022 Tesla Model 3', '2023 Tesla Model 3', '2024 Tesla Model 3', '2025 Tesla Model 3',
  '2020 BMW 3 Series', '2021 BMW 3 Series', '2022 BMW 3 Series', '2023 BMW 3 Series', '2024 BMW 3 Series', '2025 BMW 3 Series',
  '2020 BMW M2', '2021 BMW M2', '2022 BMW M2', '2023 BMW M2', '2024 BMW M2', '2025 BMW M2', '2026 BMW M2',
  '2019 Audi A4', '2020 Audi A4', '2021 Audi A4', '2022 Audi A4', '2023 Audi A4', '2024 Audi A4', '2025 Audi A4',
  '2020 Mercedes C-Class', '2021 Mercedes C-Class', '2022 Mercedes C-Class', '2023 Mercedes C-Class', '2024 Mercedes C-Class', '2025 Mercedes C-Class',
  '2021 Nissan Altima', '2022 Nissan Altima', '2023 Nissan Altima', '2024 Nissan Altima', '2025 Nissan Altima',
  '2020 Chevrolet Camaro', '2021 Chevrolet Camaro', '2022 Chevrolet Camaro', '2023 Chevrolet Camaro', '2024 Chevrolet Camaro', '2025 Chevrolet Camaro',
  '2021 Dodge Challenger', '2022 Dodge Challenger', '2023 Dodge Challenger', '2024 Dodge Challenger',
  '2020 Lexus IS', '2021 Lexus IS', '2022 Lexus IS', '2023 Lexus IS', '2024 Lexus IS', '2025 Lexus IS',
  '2021 Infiniti Q50', '2022 Infiniti Q50', '2023 Infiniti Q50', '2024 Infiniti Q50', '2025 Infiniti Q50',
  '2020 Acura TLX', '2021 Acura TLX', '2022 Acura TLX', '2023 Acura TLX', '2024 Acura TLX', '2025 Acura TLX',
  '2021 Genesis G70', '2022 Genesis G70', '2023 Genesis G70', '2024 Genesis G70', '2025 Genesis G70',
  '2020 Volvo S60', '2021 Volvo S60', '2022 Volvo S60', '2023 Volvo S60', '2024 Volvo S60', '2025 Volvo S60',
  '2021 Cadillac CT4', '2022 Cadillac CT4', '2023 Cadillac CT4', '2024 Cadillac CT4', '2025 Cadillac CT4',
  '2021 Cadillac Optiq', '2022 Cadillac Optiq', '2023 Cadillac Optiq', '2024 Cadillac Optiq', '2025 Cadillac Optiq', '2026 Cadillac Optiq',
  '2020 Jaguar XE', '2021 Jaguar XE', '2022 Jaguar XE', '2023 Jaguar XE', '2024 Jaguar XE', '2025 Jaguar XE',
  '2021 Alfa Romeo Giulia', '2022 Alfa Romeo Giulia', '2023 Alfa Romeo Giulia', '2024 Alfa Romeo Giulia', '2025 Alfa Romeo Giulia',
  '2020 Kia Stinger', '2021 Kia Stinger', '2022 Kia Stinger', '2023 Kia Stinger', '2024 Kia Stinger', '2025 Kia Stinger',
  '2021 Hyundai Sonata', '2022 Hyundai Sonata', '2023 Hyundai Sonata', '2024 Hyundai Sonata', '2025 Hyundai Sonata',
  '2020 Mazda6', '2021 Mazda6', '2022 Mazda6', '2023 Mazda6', '2024 Mazda6', '2025 Mazda6',
  '2020 Subaru Legacy', '2021 Subaru Legacy', '2022 Subaru Legacy', '2023 Subaru Legacy', '2024 Subaru Legacy', '2025 Subaru Legacy',
  '2020 Subaru Impreza', '2021 Subaru Impreza', '2022 Subaru Impreza', '2023 Subaru Impreza', '2024 Subaru Impreza', '2025 Subaru Impreza',
  '2020 Subaru Outback', '2021 Subaru Outback', '2022 Subaru Outback', '2023 Subaru Outback', '2024 Subaru Outback', '2025 Subaru Outback',
  '2020 Subaru Forester', '2021 Subaru Forester', '2022 Subaru Forester', '2023 Subaru Forester', '2024 Subaru Forester', '2025 Subaru Forester',
  '2020 Subaru Ascent', '2021 Subaru Ascent', '2022 Subaru Ascent', '2023 Subaru Ascent', '2024 Subaru Ascent', '2025 Subaru Ascent',
  '2020 Subaru Crosstrek', '2021 Subaru Crosstrek', '2022 Subaru Crosstrek', '2023 Subaru Crosstrek', '2024 Subaru Crosstrek', '2025 Subaru Crosstrek',
  '2020 Subaru BRZ', '2021 Subaru BRZ', '2022 Subaru BRZ', '2023 Subaru BRZ', '2024 Subaru BRZ', '2025 Subaru BRZ',
  '2020 Subaru WRX STI', '2021 Subaru WRX STI', '2022 Subaru WRX STI', '2023 Subaru WRX STI', '2024 Subaru WRX STI', '2025 Subaru WRX STI',
  '2020 Ford F-150', '2021 Ford F-150', '2022 Ford F-150', '2023 Ford F-150', '2024 Ford F-150', '2025 Ford F-150', '2026 Ford F-150',
  '2020 Ford Explorer', '2021 Ford Explorer', '2022 Ford Explorer', '2023 Ford Explorer', '2024 Ford Explorer', '2025 Ford Explorer',
  '2020 Ford Escape', '2021 Ford Escape', '2022 Ford Escape', '2023 Ford Escape', '2024 Ford Escape', '2025 Ford Escape',
  '2020 Ford Edge', '2021 Ford Edge', '2022 Ford Edge', '2023 Ford Edge', '2024 Ford Edge', '2025 Ford Edge',
  '2020 Ford Bronco', '2021 Ford Bronco', '2022 Ford Bronco', '2023 Ford Bronco', '2024 Ford Bronco', '2025 Ford Bronco',
  '2020 Ford Bronco Sport', '2021 Ford Bronco Sport', '2022 Ford Bronco Sport', '2023 Ford Bronco Sport', '2024 Ford Bronco Sport', '2025 Ford Bronco Sport',
  '2020 Ford Ranger', '2021 Ford Ranger', '2022 Ford Ranger', '2023 Ford Ranger', '2024 Ford Ranger', '2025 Ford Ranger',
  '2020 Ford Maverick', '2021 Ford Maverick', '2022 Ford Maverick', '2023 Ford Maverick', '2024 Ford Maverick', '2025 Ford Maverick',
  '2020 Chevrolet Silverado', '2021 Chevrolet Silverado', '2022 Chevrolet Silverado', '2023 Chevrolet Silverado', '2024 Chevrolet Silverado', '2025 Chevrolet Silverado',
  '2021 Toyota RAV4', '2022 Toyota RAV4', '2023 Toyota RAV4', '2024 Toyota RAV4', '2025 Toyota RAV4', '2026 Toyota RAV4',
  '2021 Honda CR-V', '2022 Honda CR-V', '2023 Honda CR-V', '2024 Honda CR-V', '2025 Honda CR-V', '2026 Honda CR-V',
  '2021 Mazda CX-5', '2022 Mazda CX-5', '2023 Mazda CX-5', '2024 Mazda CX-5', '2025 Mazda CX-5', '2026 Mazda CX-5',
  '2021 Toyota Corolla', '2022 Toyota Corolla', '2023 Toyota Corolla', '2024 Toyota Corolla', '2025 Toyota Corolla',
  '2021 Honda Accord', '2022 Honda Accord', '2023 Honda Accord', '2024 Honda Accord', '2025 Honda Accord', '2026 Honda Accord',
  '2021 Honda Passport', '2022 Honda Passport', '2023 Honda Passport', '2024 Honda Passport', '2025 Honda Passport', '2026 Honda Passport',
  '2021 Honda Pilot', '2022 Honda Pilot', '2023 Honda Pilot', '2024 Honda Pilot', '2025 Honda Pilot', '2026 Honda Pilot',
  '2021 Honda Ridgeline', '2022 Honda Ridgeline', '2023 Honda Ridgeline', '2024 Honda Ridgeline', '2025 Honda Ridgeline', '2026 Honda Ridgeline',
  '2021 Honda HR-V', '2022 Honda HR-V', '2023 Honda HR-V', '2024 Honda HR-V', '2025 Honda HR-V', '2026 Honda HR-V',
  '2021 Nissan Sentra', '2022 Nissan Sentra', '2023 Nissan Sentra', '2024 Nissan Sentra', '2025 Nissan Sentra',
  '2021 Kia Forte', '2022 Kia Forte', '2023 Kia Forte', '2024 Kia Forte', '2025 Kia K4',
  '2021 Volkswagen Jetta', '2022 Volkswagen Jetta', '2023 Volkswagen Jetta', '2024 Volkswagen Jetta', '2025 Volkswagen Jetta',
  '2021 Mazda 3', '2022 Mazda 3', '2023 Mazda 3', '2024 Mazda 3', '2025 Mazda 3',
  '2021 Hyundai Elantra', '2022 Hyundai Elantra', '2023 Hyundai Elantra', '2024 Hyundai Elantra', '2025 Hyundai Elantra',
  '2021 Toyota Prius', '2022 Toyota Prius', '2023 Toyota Prius', '2024 Toyota Prius', '2025 Toyota Prius',
  '2021 Tesla Model Y', '2022 Tesla Model Y', '2023 Tesla Model Y', '2024 Tesla Model Y', '2025 Tesla Model Y',
  '2021 Tesla Model S', '2022 Tesla Model S', '2023 Tesla Model S', '2024 Tesla Model S', '2025 Tesla Model S',
  '2021 Toyota Tacoma', '2022 Toyota Tacoma', '2023 Toyota Tacoma', '2024 Toyota Tacoma', '2025 Toyota Tacoma',
  '2021 Toyota Tundra', '2022 Toyota Tundra', '2023 Toyota Tundra', '2024 Toyota Tundra', '2025 Toyota Tundra',
  '2021 Chevrolet Colorado', '2022 Chevrolet Colorado', '2023 Chevrolet Colorado', '2024 Chevrolet Colorado', '2025 Chevrolet Colorado',
  '2021 Ram 1500', '2022 Ram 1500', '2023 Ram 1500', '2024 Ram 1500', '2025 Ram 1500',
  '2021 GMC Sierra', '2022 GMC Sierra', '2023 GMC Sierra', '2024 GMC Sierra', '2025 GMC Sierra',
  '2021 Nissan Titan', '2022 Nissan Titan', '2023 Nissan Titan', '2024 Nissan Titan', '2025 Nissan Titan',
  '2021 Toyota 4Runner', '2022 Toyota 4Runner', '2023 Toyota 4Runner', '2024 Toyota 4Runner', '2025 Toyota 4Runner',
  '2021 Jeep Wrangler', '2022 Jeep Wrangler', '2023 Jeep Wrangler', '2024 Jeep Wrangler', '2025 Jeep Wrangler',
  '2021 Land Rover Defender', '2022 Land Rover Defender', '2023 Land Rover Defender', '2024 Land Rover Defender', '2025 Land Rover Defender',
  '2021 Porsche 911', '2022 Porsche 911', '2023 Porsche 911', '2024 Porsche 911', '2025 Porsche 911',
  '2021 Chevrolet Corvette', '2022 Chevrolet Corvette', '2023 Chevrolet Corvette', '2024 Chevrolet Corvette', '2025 Chevrolet Corvette',
  '2021 Toyota Supra', '2022 Toyota Supra', '2023 Toyota Supra', '2024 Toyota Supra', '2025 Toyota Supra',
  '2021 BMW M3', '2022 BMW M3', '2023 BMW M3', '2024 BMW M3', '2025 BMW M3',
  '2021 Audi RS 5', '2022 Audi RS 5', '2023 Audi RS 5', '2024 Audi RS 5', '2025 Audi RS 5',
  '2021 Lexus LS', '2022 Lexus LS', '2023 Lexus LS', '2024 Lexus LS', '2025 Lexus LS',
  '2021 Genesis G90', '2022 Genesis G90', '2023 Genesis G90', '2024 Genesis G90', '2025 Genesis G90',
  '2021 Mercedes S-Class', '2022 Mercedes S-Class', '2023 Mercedes S-Class', '2024 Mercedes S-Class', '2025 Mercedes S-Class',
  '2021 Mercedes-Maybach SL680', '2022 Mercedes-Maybach SL680', '2023 Mercedes-Maybach SL680', '2024 Mercedes-Maybach SL680', '2025 Mercedes-Maybach SL680', '2026 Mercedes-Maybach SL680',
  '2021 BMW 7 Series', '2022 BMW 7 Series', '2023 BMW 7 Series', '2024 BMW 7 Series', '2025 BMW 7 Series',
  '2021 Audi A8', '2022 Audi A8', '2023 Audi A8', '2024 Audi A8', '2025 Audi A8',
  '2021 Cadillac CT6', '2022 Cadillac CT6', '2023 Cadillac CT6', '2024 Cadillac CT6', '2025 Cadillac CT6',
  '2021 Porsche Panamera', '2022 Porsche Panamera', '2023 Porsche Panamera', '2024 Porsche Panamera', '2025 Porsche Panamera',
  '2021 Bentley Flying Spur', '2022 Bentley Flying Spur', '2023 Bentley Flying Spur', '2024 Bentley Flying Spur', '2025 Bentley Flying Spur',
  '2026 Bentley Continental GT Supersports',
  '2021 Rolls-Royce Ghost', '2022 Rolls-Royce Ghost', '2023 Rolls-Royce Ghost', '2024 Rolls-Royce Ghost', '2025 Rolls-Royce Ghost',
  '2021 Rivian R1T', '2022 Rivian R1T', '2023 Rivian R1T', '2024 Rivian R1T', '2025 Rivian R1T',
  '2024 Rivian R2', '2025 Rivian R2', '2026 Rivian R2',
  '2021 Ford F-150 Lightning', '2022 Ford F-150 Lightning', '2023 Ford F-150 Lightning', '2024 Ford F-150 Lightning', '2025 Ford F-150 Lightning',
  '2021 Hyundai Ioniq 5', '2022 Hyundai Ioniq 5', '2023 Hyundai Ioniq 5', '2024 Hyundai Ioniq 5', '2025 Hyundai Ioniq 5', '2026 Hyundai Ioniq 5',
  '2021 Hyundai Ioniq 6', '2022 Hyundai Ioniq 6', '2023 Hyundai Ioniq 6', '2024 Hyundai Ioniq 6', '2025 Hyundai Ioniq 6', '2026 Hyundai Ioniq 6',
  '2021 BMW i4', '2022 BMW i4', '2023 BMW i4', '2024 BMW i4', '2025 BMW i4',
  '2021 Porsche Taycan', '2022 Porsche Taycan', '2023 Porsche Taycan', '2024 Porsche Taycan', '2025 Porsche Taycan',
  '2026 Ferrari 296 Speciale',
  '2021 Toyota RAV4 Hybrid', '2022 Toyota RAV4 Hybrid', '2023 Toyota RAV4 Hybrid', '2024 Toyota RAV4 Hybrid', '2025 Toyota RAV4 Hybrid',
  '2021 MINI Cooper', '2022 MINI Cooper', '2023 MINI Cooper', '2024 MINI Cooper', '2025 MINI Cooper',
  '2021 Chevrolet Traverse', '2022 Chevrolet Traverse', '2023 Chevrolet Traverse', '2024 Chevrolet Traverse', '2025 Chevrolet Traverse',
  '2021 Kia Sorento', '2022 Kia Sorento', '2023 Kia Sorento', '2024 Kia Sorento', '2025 Kia Sorento',
  '2021 Hyundai Santa Fe', '2022 Hyundai Santa Fe', '2023 Hyundai Santa Fe', '2024 Hyundai Santa Fe', '2025 Hyundai Santa Fe',
  '2021 Toyota Highlander', '2022 Toyota Highlander', '2023 Toyota Highlander', '2024 Toyota Highlander', '2025 Toyota Highlander',
  '2021 Subaru Outback Wilderness', '2022 Subaru Outback Wilderness', '2023 Subaru Outback Wilderness', '2024 Subaru Outback Wilderness', '2025 Subaru Outback Wilderness',
];

// ============ Legacy Vehicle Generation ============

function parseLegacyVehicleName(name: string): { year: string; make: string; model: string } | null {
  const parts = name.trim().split(' ');
  if (parts.length < 3) return null;
  return { year: parts[0], make: parts[1], model: parts.slice(2).join(' ') };
}

function generateVehicleFromLegacy(legacyName: string): Vehicle | null {
  const parsed = parseLegacyVehicleName(legacyName);
  if (!parsed) return null;
  
  const { year, make, model } = parsed;
  const modelLower = model.toLowerCase();
  const makeLower = make.toLowerCase();
  
  // Determine body style
  let bodyStyle: string = 'Sedan';
  if (makeLower.includes('land rover') || modelLower.includes('suv') || modelLower.includes('cr-v') || modelLower.includes('rav4') || 
      modelLower.includes('pilot') || modelLower.includes('explorer') || modelLower.includes('highlander') ||
      modelLower.includes('cx-') || modelLower.includes('outback') || modelLower.includes('forester') ||
      modelLower.includes('ascent') || modelLower.includes('crosstrek') || modelLower.includes('escape') ||
      modelLower.includes('edge') || modelLower.includes('bronco') || modelLower.includes('4runner') ||
      modelLower.includes('wrangler') || modelLower.includes('defender') || modelLower.includes('traverse') ||
      modelLower.includes('sorento') || modelLower.includes('santa fe') || modelLower.includes('passport') ||
      modelLower.includes('range rover')) {
    bodyStyle = 'SUV';
  } else if (modelLower.includes('f-150') || modelLower.includes('silverado') || modelLower.includes('ram') ||
             modelLower.includes('ranger') || modelLower.includes('maverick') || modelLower.includes('tacoma') ||
             modelLower.includes('tundra') || modelLower.includes('colorado') || modelLower.includes('sierra') ||
             modelLower.includes('titan') || modelLower.includes('ridgeline') || modelLower.includes('lightning') ||
             modelLower.includes('r1t')) {
    bodyStyle = 'Truck';
  } else if (modelLower.includes('mustang') || modelLower.includes('camaro') || modelLower.includes('challenger') ||
             modelLower.includes('corvette') || modelLower.includes('911') || modelLower.includes('supra') ||
             modelLower.includes('brz') || modelLower.includes('gt') || modelLower.includes('m2') ||
             modelLower.includes('m3') || modelLower.includes('m4')) {
    bodyStyle = 'Coupe';
  } else if (modelLower.includes('prius') || modelLower.includes('cooper') || modelLower.includes('golf')) {
    bodyStyle = 'Hatchback';
  }
  
  // Generate price
  const yearNum = parseInt(year);
  let priceMin: number;
  let priceMax: number;
  
  if (modelLower.includes('escalade') && (modelLower.includes('iq') || modelLower.includes('v'))) {
    priceMin = 100000 + (yearNum - 2020) * 2000;
    priceMax = Math.round(priceMin * 1.2);
  } else {
  const basePrice = 25000 + (yearNum - 2020) * 1000;
    const makeFactor = makeLower.includes('bmw') || makeLower.includes('mercedes') || 
                       makeLower.includes('audi') || makeLower.includes('lexus') || 
                       makeLower.includes('cadillac') || makeLower.includes('lincoln') ||
                       makeLower.includes('infiniti') || makeLower.includes('acura') ? 1.8 :
                       makeLower.includes('tesla') ? 2.0 :
                       makeLower.includes('porsche') || makeLower.includes('bentley') ||
                       makeLower.includes('rolls-royce') || makeLower.includes('ferrari') ||
                       makeLower.includes('lamborghini') || makeLower.includes('mclaren') ? 4.0 : 1.0;
    priceMin = Math.round(basePrice * makeFactor);
    priceMax = Math.round(priceMin * 1.4);
  }
  
  // Determine fuel type
  let fuelType: 'Gas' | 'Electric' | 'Hybrid' | 'Plug-in Hybrid' | 'Diesel' = 'Gas';
  if (modelLower.includes('electric') || modelLower.includes('ev') || modelLower.includes('model ') ||
      modelLower.includes('lightning') || modelLower.includes('r1t') || modelLower.includes('ioniq') ||
      modelLower.includes('i4') || modelLower.includes('taycan')) {
    fuelType = 'Electric';
  } else if (modelLower.includes('hybrid') || modelLower.includes('prius')) {
    fuelType = 'Hybrid';
  }
  
  // Generate ratings
  const hash = legacyName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const staffRating = 7.5 + (hash % 15) / 10;
  const communityRating = staffRating - 0.3 + (hash % 6) / 10;
  const reviewCount = 50 + (hash % 300);
  
  const slug = `${year}/${make}/${model.replace(/\s+/g, '-')}`;
  const id = `legacy_${slug.replace(/\//g, '_').replace(/-/g, '_').toLowerCase()}`;
  
  return {
    id,
    year,
    make,
    model,
    bodyStyle,
    image: vehicleImageFor(legacyName),
    priceRange: `$${priceMin.toLocaleString()} - $${priceMax.toLocaleString()}`,
    priceMin,
    priceMax,
    staffRating: Math.round(staffRating * 10) / 10,
    communityRating: Math.round(communityRating * 10) / 10,
    reviewCount,
    fuelType,
    drivetrain: fuelType === 'Electric' ? 'AWD' : bodyStyle === 'Truck' ? '4WD' : 'FWD',
    transmission: fuelType === 'Electric' ? 'Automatic' : 'CVT',
    mpg: fuelType === 'Electric' ? '100 MPGe' : bodyStyle === 'Truck' ? '18/24' : '28/36',
    horsepower: bodyStyle === 'Truck' ? 300 : bodyStyle === 'Coupe' ? 350 : 200,
    seatingCapacity: bodyStyle === 'Truck' || bodyStyle === 'SUV' ? 7 : 5,
    features: [`${make} Safety System`, 'Apple CarPlay', 'LED Headlights'],
    slug
  };
}

function getAllVehiclesHybrid(): Vehicle[] {
  const detailedVehicles = [...vehicleDatabase];
  const existingVehicles = new Set(
    detailedVehicles.map(v => `${v.year} ${v.make} ${v.model}`.toLowerCase())
  );
  
  const generatedVehicles: Vehicle[] = [];
  for (const legacyName of carDatabase) {
    const normalized = legacyName.toLowerCase();
    if (!existingVehicles.has(normalized)) {
      const generated = generateVehicleFromLegacy(legacyName);
      if (generated) {
        generatedVehicles.push(generated);
        existingVehicles.add(normalized);
      }
    }
  }
  
  return [...detailedVehicles, ...generatedVehicles];
}

// ============ API Functions ============

export const getVehicles = (options: VehicleQueryOptions = {}): Vehicle[] => {
  let results = options.useApiOnly 
    ? [...vehicleDatabase]
    : getAllVehiclesHybrid();

  // Apply filters
  if (options.bodyStyle?.length) {
    results = results.filter(v => options.bodyStyle!.includes(v.bodyStyle));
  }
  if (options.make?.length) {
    results = results.filter(v => options.make!.includes(v.make));
  }
  if (options.year?.length) {
    results = results.filter(v => options.year!.includes(v.year));
  }
  if (options.priceMin !== undefined) {
    results = results.filter(v => v.priceMax >= options.priceMin!);
  }
  if (options.priceMax !== undefined) {
    results = results.filter(v => v.priceMin <= options.priceMax!);
  }
  if (options.fuelType?.length) {
    results = results.filter(v => options.fuelType!.includes(v.fuelType));
  }
  if (options.drivetrain?.length) {
    results = results.filter(v => options.drivetrain!.includes(v.drivetrain));
  }
  if (options.minRating !== undefined) {
    results = results.filter(v => v.staffRating >= options.minRating!);
  }
  if (options.search) {
    const searchLower = options.search.toLowerCase();
    results = results.filter(v =>
      v.make.toLowerCase().includes(searchLower) ||
      v.model.toLowerCase().includes(searchLower) ||
      v.year.includes(searchLower) ||
      `${v.year} ${v.make} ${v.model}`.toLowerCase().includes(searchLower)
    );
  }
  if (options.excludeIds?.length) {
    results = results.filter(v => !options.excludeIds!.includes(v.id));
  }
  if (options.featured !== undefined) {
    results = results.filter(v => v.featured === options.featured);
  }

  // Apply sorting
  const sortBy = options.sortBy || 'popularity';
  const sortOrder = options.sortOrder || 'desc';

  results.sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'price': comparison = a.priceMin - b.priceMin; break;
      case 'rating': comparison = a.staffRating - b.staffRating; break;
      case 'name': comparison = `${a.make} ${a.model}`.localeCompare(`${b.make} ${b.model}`); break;
      case 'year': comparison = parseInt(a.year) - parseInt(b.year); break;
      case 'popularity': comparison = a.reviewCount - b.reviewCount; break;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Apply pagination
  if (options.offset !== undefined || options.limit !== undefined) {
    const offset = options.offset || 0;
    const limit = options.limit || results.length;
    results = results.slice(offset, offset + limit);
  }

  return results;
};

export const getVehicleById = (id: string): Vehicle | undefined => {
  return vehicleDatabase.find(v => v.id === id);
};

export const getVehicleBySlug = (slug: string): Vehicle | undefined => {
  return vehicleDatabase.find(v => v.slug === slug);
};

export const getVehicleByName = (vehicleName: string): Vehicle | undefined => {
  const parts = vehicleName.trim().split(/\s+/);
  if (parts.length < 3) return undefined;
  
  const year = parts[0];
  const make = parts[1];
  const model = parts.slice(2).join(' ');
  const normalizedModel = model.replace(/-/g, ' ').toLowerCase();
  
  return vehicleDatabase.find(v => {
    const yearMatch = v.year === year;
    const makeMatch = v.make === make;
    const normalizedDbModel = v.model.replace(/-/g, ' ').toLowerCase();
    const modelMatch = normalizedDbModel === normalizedModel;
    return yearMatch && makeMatch && modelMatch;
  });
};

export const getFilterOptions = () => {
  const makes = [...new Set(vehicleDatabase.map(v => v.make))].sort();
  const years = [...new Set(vehicleDatabase.map(v => v.year))].sort((a, b) => parseInt(b) - parseInt(a));
  const bodyStyles = [...new Set(vehicleDatabase.map(v => v.bodyStyle))].sort();
  const fuelTypes = [...new Set(vehicleDatabase.map(v => v.fuelType))].sort();
  const drivetrains = [...new Set(vehicleDatabase.map(v => v.drivetrain))].sort();
  const priceMin = Math.min(...vehicleDatabase.map(v => v.priceMin));
  const priceMax = Math.max(...vehicleDatabase.map(v => v.priceMax));

  return { makes, years, bodyStyles, fuelTypes, drivetrains, priceRange: { min: priceMin, max: priceMax } };
};

export const getVehicleStats = () => ({
    total: vehicleDatabase.length,
  byBodyStyle: vehicleDatabase.reduce((acc, v) => { acc[v.bodyStyle] = (acc[v.bodyStyle] || 0) + 1; return acc; }, {} as Record<string, number>),
  byMake: vehicleDatabase.reduce((acc, v) => { acc[v.make] = (acc[v.make] || 0) + 1; return acc; }, {} as Record<string, number>),
  byFuelType: vehicleDatabase.reduce((acc, v) => { acc[v.fuelType] = (acc[v.fuelType] || 0) + 1; return acc; }, {} as Record<string, number>),
    averagePrice: vehicleDatabase.reduce((sum, v) => sum + (v.priceMin + v.priceMax) / 2, 0) / vehicleDatabase.length,
    averageRating: vehicleDatabase.reduce((sum, v) => sum + v.staffRating, 0) / vehicleDatabase.length
});

export const searchVehicles = (query: string, limit: number = 10): Vehicle[] => {
  if (!query || query.length < 2) return [];
  const searchLower = query.toLowerCase();
  const results = vehicleDatabase.filter(v =>
    v.make.toLowerCase().includes(searchLower) ||
    v.model.toLowerCase().includes(searchLower) ||
    `${v.year} ${v.make} ${v.model}`.toLowerCase().includes(searchLower)
  );
  return results.slice(0, limit);
};

export const getFeaturedVehicles = (limit?: number): Vehicle[] => 
  getVehicles({ featured: true, sortBy: 'rating', sortOrder: 'desc', limit });

export const getTopRatedVehicles = (limit: number = 10): Vehicle[] => 
  getVehicles({ sortBy: 'rating', sortOrder: 'desc', limit });

export const getVehiclesByBodyStyle = (bodyStyle: string, limit?: number): Vehicle[] => 
  getVehicles({ bodyStyle: [bodyStyle], sortBy: 'rating', sortOrder: 'desc', limit });

export const getSimilarVehicles = (vehicleId: string, limit: number = 4): Vehicle[] => {
  const vehicle = getVehicleById(vehicleId);
  if (!vehicle) return [];
  const priceMargin = 10000;
  return getVehicles({
    bodyStyle: [vehicle.bodyStyle],
    priceMin: vehicle.priceMin - priceMargin,
    priceMax: vehicle.priceMax + priceMargin,
    excludeIds: [vehicleId],
    sortBy: 'rating',
    sortOrder: 'desc',
    limit
  });
};

export const getNewArrivals = (limit: number = 6): Vehicle[] => 
  getVehicles({ sortBy: 'year', sortOrder: 'desc', limit });

export const getVehiclesByPriceRange = (min: number, max: number, limit?: number): Vehicle[] => 
  getVehicles({ priceMin: min, priceMax: max, sortBy: 'rating', sortOrder: 'desc', limit });

export const getElectricVehicles = (limit?: number): Vehicle[] => 
  getVehicles({ fuelType: ['Electric', 'Plug-in Hybrid'], sortBy: 'rating', sortOrder: 'desc', limit });

export const getVehicleCount = (filters: VehicleFilters = {}): number => 
  getVehicles(filters).length;

export default {
  getVehicles,
  getVehicleById,
  getVehicleBySlug,
  getVehicleByName,
  getFilterOptions,
  getVehicleStats,
  searchVehicles,
  getFeaturedVehicles,
  getTopRatedVehicles,
  getVehiclesByBodyStyle,
  getSimilarVehicles,
  getNewArrivals,
  getVehiclesByPriceRange,
  getElectricVehicles,
  getVehicleCount
};
