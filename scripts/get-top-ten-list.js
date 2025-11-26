/**
 * Script to generate Top Ten lists for all categories
 * Run with: node scripts/get-top-ten-list.js
 */

// Import the necessary functions
const fs = require('fs');
const path = require('path');

// Read the TypeScript files and extract the logic
const vehiclesApiPath = path.join(__dirname, '../src/api/vehiclesApi.ts');
const vehicleBodyStylesPath = path.join(__dirname, '../src/utils/vehicleBodyStyles.ts');

// Since we can't directly import TypeScript, we'll need to use a different approach
// Let's create a simplified version that uses the actual API

console.log('Generating Top Ten lists for all categories...\n');

// Vehicle types and subcategories
const vehicleTypes = ['SUV', 'Sedan', 'Truck', 'Coupe'];
const subcategories = ['All', 'Subcompact', 'Compact', 'Midsize', 'Full-Size', 'Luxury', 'Electric'];

// Helper function to get vehicle subcategory (simplified version)
function getVehicleSubcategory(vehicleName, vehicleType) {
  const name = vehicleName.toLowerCase();
  
  // Electric vehicles (highest priority)
  const electricModels = ['electric', 'ev', 'e-tron', 'taycan', 'model 3', 'model s', 'model x', 'model y', 'i4', 'eq', 'ioniq', 'leaf', 'bolt', 'id.4', 'mach-e', 'lightning', 'rivian', 'lucid', 'polestar', 'ariya', 'bz4x'];
  if (electricModels.some(model => name.includes(model))) return 'Electric';

  // SUV subcategories
  if (vehicleType === 'SUV') {
    const subcompactSUVs = ['venue', 'trailblazer', 'kicks', 'soul', 'encore', 'encore gx', 'trax', 'seltos', 'crosstrek', 'kona', 'hr-v'];
    const compactSUVs = ['cr-v', 'rav4', 'rogue', 'equinox', 'escape', 'tucson', 'sportage', 'cx-5', 'forester', 'cherokee', 'compass', 'q3', 'x1', 'x3', 'glb', 'qx50'];
    const midsizeSUVs = ['pilot', 'highlander', 'pathfinder', 'traverse', 'explorer', 'santa fe', 'sorento', 'cx-9', 'ascent', 'grand cherokee', 'passport', 'q5', 'x5', 'gle', 'qx60', 'cx-90'];
    const fullSizeSUVs = ['expedition', 'tahoe', 'suburban', 'yukon', 'armada', 'sequoia', 'durango', 'telluride', 'palisade', 'atlas', 'qx80', 'escalade', 'navigator'];
    
    if (subcompactSUVs.some(model => name.includes(model))) return 'Subcompact';
    if (compactSUVs.some(model => name.includes(model))) return 'Compact';
    if (midsizeSUVs.some(model => name.includes(model))) return 'Midsize';
    if (fullSizeSUVs.some(model => name.includes(model))) return 'Full-Size';
  }

  // Truck subcategories
  if (vehicleType === 'Truck') {
    const compactTrucks = ['maverick', 'santa cruz'];
    const midsizeTrucks = ['ranger', 'colorado', 'tacoma', 'frontier', 'gladiator', 'canyon', 'ridgeline'];
    const fullSizeTrucks = ['f-150', 'silverado', 'sierra', 'ram 1500', 'tundra', 'titan'];
    
    if (compactTrucks.some(model => name.includes(model))) return 'Compact';
    if (midsizeTrucks.some(model => name.includes(model))) return 'Midsize';
    if (fullSizeTrucks.some(model => name.includes(model))) return 'Full-Size';
  }

  // Sedan subcategories
  if (vehicleType === 'Sedan') {
    const subcompactSedans = ['rio', 'versa', 'mirage'];
    const compactSedans = ['civic', 'corolla', 'sentra', 'elantra', 'forte', 'mazda3', 'impreza', 'jetta', 'a3'];
    const midsizeSedans = ['accord', 'camry', 'altima', 'sonata', 'optima', 'mazda6', 'legacy', 'passat', 'a4', '3 series', 'c-class'];
    const fullSizeSedans = ['avalon', 'maxima', 'charger', '300', 'impala', 'a6', '5 series', 'e-class'];
    
    if (subcompactSedans.some(model => name.includes(model))) return 'Subcompact';
    if (compactSedans.some(model => name.includes(model))) return 'Compact';
    if (midsizeSedans.some(model => name.includes(model))) return 'Midsize';
    if (fullSizeSedans.some(model => name.includes(model))) return 'Full-Size';
  }

  // Luxury classification
  const luxuryBrands = ['mercedes', 'bmw', 'audi', 'lexus', 'infiniti', 'acura', 'cadillac', 'lincoln', 'genesis', 'porsche', 'jaguar', 'land rover', 'volvo'];
  if (luxuryBrands.some(brand => name.includes(brand))) return 'Luxury';

  return 'All';
}

// Note: This script requires the actual API to be available
// For now, we'll output the structure that would be used
console.log('This script requires access to the vehicles API.');
console.log('Please run this from the browser console or use the actual API.\n');
console.log('Categories to generate:');
console.log('Vehicle Types:', vehicleTypes.join(', '));
console.log('Subcategories:', subcategories.join(', '));
console.log('\nTotal combinations:', vehicleTypes.length * subcategories.length);

