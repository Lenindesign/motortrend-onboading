/**
 * Vehicle Specifications Utility
 * Generates realistic vehicle specifications based on vehicle name
 */

export interface VehicleSpecs {
  price: string;
  mpg: string;
  zeroToSixty: string;
  horsepower?: string;
  torque?: string;
  engine?: string;
  transmission?: string;
  drivetrain?: string;
}

/**
 * Generate realistic vehicle specifications based on vehicle name
 * @param vehicleName - Full vehicle name (e.g., "2021 Subaru WRX")
 * @returns Vehicle specifications object
 */
export const getVehicleSpecs = (vehicleName: string): VehicleSpecs => {
  const normalizedName = vehicleName.toLowerCase();
  const yearMatch = vehicleName.match(/^(\d{4})/);
  const year = yearMatch ? parseInt(yearMatch[1]) : 2024;
  
  // Base price based on make/model
  let basePrice = 35000;
  let mpg = '25/32/28';
  let zeroToSixty = '6.5';
  let horsepower = '260';
  let torque = '280 lb-ft';
  let engine = '2.0L Turbocharged I4';
  let transmission = '6-Speed Manual';
  let drivetrain = 'AWD';
  
  // Price adjustments based on make/model
  // Ultra-Luxury Vehicles
  if (normalizedName.includes('rolls') && normalizedName.includes('royce') && normalizedName.includes('ghost')) {
    basePrice = 370000;
    mpg = '14/21/17';
    zeroToSixty = '4.6';
    horsepower = '563';
    torque = '627 lb-ft';
    engine = '6.75L Twin-Turbocharged V12';
    transmission = '8-Speed Automatic';
    drivetrain = 'RWD';
  } else if (normalizedName.includes('bentley') && normalizedName.includes('continental') && normalizedName.includes('supersports')) {
    basePrice = 325000;
    mpg = '15/24/18';
    zeroToSixty = '3.7';
    horsepower = '657';
    torque = '590 lb-ft';
    engine = '4.0L Twin-Turbocharged V8';
    transmission = '8-Speed Dual-Clutch';
    drivetrain = 'RWD';
  } else if (normalizedName.includes('bentley') && normalizedName.includes('flying spur')) {
    basePrice = 230000;
    mpg = '15/24/18';
    zeroToSixty = '3.7';
    horsepower = '626';
    torque = '664 lb-ft';
    engine = '6.0L Twin-Turbocharged W12';
    transmission = '8-Speed Dual-Clutch';
    drivetrain = 'AWD';
  } else if (normalizedName.includes('mercedes') && normalizedName.includes('maybach') && normalizedName.includes('sl')) {
    basePrice = 260000;
    mpg = '16/23/19';
    zeroToSixty = '4.1';
    horsepower = '577';
    torque = '590 lb-ft';
    engine = '4.0L Twin-Turbocharged V8';
    transmission = '9-Speed Automatic';
    drivetrain = 'AWD';
  } else if (normalizedName.includes('ferrari') && normalizedName.includes('296') && normalizedName.includes('speciale')) {
    basePrice = 475000;
    mpg = '18/22/20';
    zeroToSixty = '2.7';
    horsepower = '819';
    torque = '546 lb-ft';
    engine = '3.0L Twin-Turbocharged V6 + Electric Motor';
    transmission = '8-Speed Dual-Clutch';
    drivetrain = 'RWD';
  } else if (normalizedName.includes('bmw') || normalizedName.includes('mercedes') || normalizedName.includes('audi')) {
    basePrice = 45000;
    mpg = '23/32/26';
    zeroToSixty = '5.2';
    horsepower = '320';
    torque = '330 lb-ft';
    engine = '2.0L Turbocharged I4';
    transmission = '8-Speed Automatic';
  } else if (normalizedName.includes('tesla')) {
    basePrice = 40000;
    mpg = 'N/A (Electric)';
    zeroToSixty = '4.2';
    horsepower = '283';
    torque = '302 lb-ft';
    engine = 'Electric Motor';
    transmission = 'Single-Speed Direct Drive';
    drivetrain = 'RWD';
  } else if (normalizedName.includes('mustang') || normalizedName.includes('camaro') || normalizedName.includes('challenger')) {
    basePrice = 38000;
    mpg = '18/25/21';
    zeroToSixty = '4.5';
    horsepower = '450';
    torque = '410 lb-ft';
    engine = '5.0L V8';
    transmission = '6-Speed Manual';
    drivetrain = 'RWD';
  } else if (normalizedName.includes('wrx')) {
    basePrice = 30000;
    mpg = '20/27/23';
    zeroToSixty = '5.4';
    horsepower = '271';
    torque = '258 lb-ft';
    engine = '2.4L Turbocharged Flat-4';
    transmission = '6-Speed Manual';
  } else if (normalizedName.includes('civic') || normalizedName.includes('corolla')) {
    basePrice = 24000;
    mpg = '31/40/35';
    zeroToSixty = '7.8';
    horsepower = '180';
    torque = '177 lb-ft';
    engine = '2.0L I4';
    transmission = 'CVT';
    drivetrain = 'FWD';
  } else if (normalizedName.includes('camry') || normalizedName.includes('accord')) {
    basePrice = 28000;
    mpg = '28/39/32';
    zeroToSixty = '7.2';
    horsepower = '203';
    torque = '184 lb-ft';
    engine = '2.5L I4';
    transmission = '8-Speed Automatic';
    drivetrain = 'FWD';
  } else if (normalizedName.includes('rav4') || normalizedName.includes('cr-v') || normalizedName.includes('forester')) {
    basePrice = 28000;
    mpg = '27/35/30';
    zeroToSixty = '8.1';
    horsepower = '203';
    torque = '184 lb-ft';
    engine = '2.5L I4';
    transmission = 'CVT';
  } else if (normalizedName.includes('f-150') || normalizedName.includes('silverado') || normalizedName.includes('ram')) {
    basePrice = 35000;
    mpg = '20/24/22';
    zeroToSixty = '6.8';
    horsepower = '290';
    torque = '265 lb-ft';
    engine = '3.3L V6';
    transmission = '10-Speed Automatic';
    drivetrain = '4WD';
  }
  
  // Year adjustments (newer = slightly higher price, better MPG)
  const yearMultiplier = 1 + ((year - 2020) * 0.02);
  const adjustedPrice = Math.round(basePrice * yearMultiplier);
  
  return {
    price: `$${adjustedPrice.toLocaleString()}`,
    mpg,
    zeroToSixty: `${zeroToSixty} sec`,
    horsepower: `${horsepower} hp`,
    torque,
    engine,
    transmission,
    drivetrain,
  };
};

