/**
 * Top Ten Management Page
 * Professional dashboard for managing Top Ten categories and vehicle rankings
 */

import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getVehicles } from '../../api/vehiclesApi';
import { getVehicleBodyStyle } from '../../utils/vehicleBodyStyles';
import { getVehicleLifestyles, LIFESTYLE_CATEGORIES } from '../../utils/vehicleLifestyles';
import type { VehicleType, Subcategory } from '../../components/TopTenCarousel/TopTenCarousel';
import './TopTenManagement.css';

import Icon from '../../components/Icon';

// Helper function to get subcategories for a vehicle type
const getSubcategoriesForType = (type: VehicleType): Subcategory[] => {
  if (type === 'Performance') {
    return ['All'];
  }
  
  const commonSubcategories: Subcategory[] = ['All', 'Subcompact', 'Compact', 'Midsize', 'Full-Size', 'Luxury', 'Electric'];
  
  switch (type) {
    case 'SUV':
      return commonSubcategories;
    case 'Sedan':
      return ['All', 'Compact', 'Midsize', 'Full-Size', 'Electric'];
    case 'Truck':
      return ['All', 'Midsize', 'Full-Size', 'Electric'];
    case 'Coupe':
      return ['All', 'Compact', 'Midsize', 'Electric'];
    default:
      return ['All'];
  }
};

// Helper function to categorize vehicles
const getVehicleSubcategory = (vehicleName: string, vehicleType: VehicleType): Subcategory => {
  const name = vehicleName.toLowerCase();
  
  const electricModels = ['electric', 'ev', 'e-tron', 'taycan', 'model 3', 'model s', 'model x', 'model y', 'i4', 'i8', 'eq', 'ioniq', 'leaf', 'bolt', 'id.4', 'mach-e', 'lightning', 'rivian', 'lucid', 'polestar', 'ariya', 'bz4x'];
  if (electricModels.some(model => name.includes(model))) return 'Electric';

  if (vehicleType === 'SUV') {
    const subcompactSUVs = ['venue', 'trailblazer', 'kicks', 'soul', 'encore', 'encore gx', 'trax', 'seltos', 'crosstrek', 'kona', 'hr-v'];
    const compactSUVs = ['cr-v', 'rav4', 'rogue', 'equinox', 'escape', 'tucson', 'sportage', 'cx-5', 'forester', 'cherokee', 'compass', 'q3', 'x1', 'x3', 'glb', 'qx50'];
    const midsizeSUVs = ['pilot', 'highlander', 'pathfinder', 'traverse', 'explorer', 'santa fe', 'sorento', 'cx-9', 'ascent', 'grand cherokee', 'passport', 'q5', 'x5', 'gle', 'qx60', 'cx-90'];
    const fullSizeSUVs = ['expedition', 'tahoe', 'suburban', 'yukon', 'armada', 'sequoia', 'durango', 'telluride', 'palisade', 'atlas', 'qx80', 'escalade', 'navigator'];
    const luxurySUVs = ['q7', 'q8', 'x7', 'gls', 'gx', 'lx', 'escalade', 'navigator', 'range rover', 'defender', 'discovery', 'velar', 'evoque', 'cayenne', 'macan', 'model x', 'model y'];
    
    if (subcompactSUVs.some(model => name.includes(model))) return 'Subcompact';
    if (compactSUVs.some(model => name.includes(model))) return 'Compact';
    if (midsizeSUVs.some(model => name.includes(model))) return 'Midsize';
    if (fullSizeSUVs.some(model => name.includes(model))) return 'Full-Size';
    if (luxurySUVs.some(model => name.includes(model))) return 'Luxury';
  }

  if (vehicleType === 'Sedan') {
    const compactSedans = ['civic', 'corolla', 'sentra', 'elantra', 'forte', 'mazda3', 'impreza', 'jetta', 'a3', '2 series'];
    const midsizeSedans = ['accord', 'camry', 'altima', 'sonata', 'optima', 'mazda6', 'legacy', 'passat', 'a4', '3 series', 'c-class', 'is', 'tlx', 'q50', 'g70', 's60', 'ct4', 'xe'];
    const fullSizeSedans = ['avalon', 'maxima', 'charger', '300', 'impala', 'a6', '5 series', 'e-class', 'ct5', 'ct6', 'continental', 's90', 'gs', 'ls', 'q70', 'panamera', 'taycan', 'model s', 'a8', '7 series', 's-class', 'g80', 'xf'];
    
    if (compactSedans.some(model => name.includes(model))) return 'Compact';
    if (midsizeSedans.some(model => name.includes(model))) return 'Midsize';
    if (fullSizeSedans.some(model => name.includes(model))) return 'Full-Size';
  }

  if (vehicleType === 'Truck') {
    const midsizeTrucks = ['ranger', 'colorado', 'canyon', 'frontier', 'tacoma', 'gladiator', 'maverick'];
    const fullSizeTrucks = ['f-150', 'silverado', 'ram', 'sierra', 'tundra', 'titan', 'ridgeline'];
    
    if (midsizeTrucks.some(model => name.includes(model))) return 'Midsize';
    if (fullSizeTrucks.some(model => name.includes(model))) return 'Full-Size';
  }

  if (vehicleType === 'Coupe') {
    const compactCoupes = ['brz', '86', 'miata', 'z'];
    const midsizeCoupes = ['mustang', 'camaro', 'challenger', 'supra'];
    
    if (compactCoupes.some(model => name.includes(model))) return 'Compact';
    if (midsizeCoupes.some(model => name.includes(model))) return 'Midsize';
  }

  return 'All';
};

// Layout type definition
type BentoLayoutType = 'spotlight' | 'editorial' | 'cascade' | 'mosaic' | 'minimal';

// Helper function for bento grid layout - Redesigned layouts
const getBentoGridLayout = (layout: BentoLayoutType, index: number): { gridColumn: string; gridRow: string; className?: string } => {
  switch (layout) {
    case 'spotlight':
      // Hero spotlight: Large #1 card with flanking cards
      if (index === 0) return { gridColumn: 'span 2', gridRow: 'span 2', className: 'bento-card--hero' };
      if (index === 1) return { gridColumn: 'span 1', gridRow: 'span 1', className: 'bento-card--accent' };
      if (index === 2) return { gridColumn: 'span 1', gridRow: 'span 1', className: 'bento-card--accent' };
      if (index === 3) return { gridColumn: 'span 2', gridRow: 'span 1', className: 'bento-card--wide' };
      if (index === 4) return { gridColumn: 'span 1', gridRow: 'span 1' };
      if (index === 5) return { gridColumn: 'span 1', gridRow: 'span 1' };
      if (index === 6) return { gridColumn: 'span 1', gridRow: 'span 1' };
      if (index === 7) return { gridColumn: 'span 1', gridRow: 'span 1' };
      if (index === 8) return { gridColumn: 'span 2', gridRow: 'span 1', className: 'bento-card--wide' };
      if (index === 9) return { gridColumn: 'span 2', gridRow: 'span 1', className: 'bento-card--wide' };
      return { gridColumn: 'span 1', gridRow: 'span 1' };
    
    case 'editorial':
      // Magazine editorial style: Featured story with supporting articles
      if (index === 0) return { gridColumn: 'span 2', gridRow: 'span 3', className: 'bento-card--feature' };
      if (index === 1) return { gridColumn: 'span 2', gridRow: 'span 1', className: 'bento-card--headline' };
      if (index === 2) return { gridColumn: 'span 1', gridRow: 'span 2', className: 'bento-card--sidebar' };
      if (index === 3) return { gridColumn: 'span 1', gridRow: 'span 2', className: 'bento-card--sidebar' };
      if (index === 4) return { gridColumn: 'span 2', gridRow: 'span 1', className: 'bento-card--headline' };
      if (index === 5) return { gridColumn: 'span 1', gridRow: 'span 1' };
      if (index === 6) return { gridColumn: 'span 1', gridRow: 'span 1' };
      if (index === 7) return { gridColumn: 'span 1', gridRow: 'span 1' };
      if (index === 8) return { gridColumn: 'span 1', gridRow: 'span 1' };
      if (index === 9) return { gridColumn: 'span 2', gridRow: 'span 1', className: 'bento-card--headline' };
      return { gridColumn: 'span 1', gridRow: 'span 1' };
    
    case 'cascade':
      // Waterfall cascade: Diagonal visual flow
      if (index === 0) return { gridColumn: 'span 2', gridRow: 'span 2', className: 'bento-card--primary' };
      if (index === 1) return { gridColumn: 'span 1', gridRow: 'span 1' };
      if (index === 2) return { gridColumn: 'span 1', gridRow: 'span 2', className: 'bento-card--tall' };
      if (index === 3) return { gridColumn: 'span 2', gridRow: 'span 1', className: 'bento-card--wide' };
      if (index === 4) return { gridColumn: 'span 1', gridRow: 'span 2', className: 'bento-card--tall' };
      if (index === 5) return { gridColumn: 'span 1', gridRow: 'span 1' };
      if (index === 6) return { gridColumn: 'span 2', gridRow: 'span 1', className: 'bento-card--wide' };
      if (index === 7) return { gridColumn: 'span 1', gridRow: 'span 1' };
      if (index === 8) return { gridColumn: 'span 1', gridRow: 'span 1' };
      if (index === 9) return { gridColumn: 'span 2', gridRow: 'span 1', className: 'bento-card--wide' };
      return { gridColumn: 'span 1', gridRow: 'span 1' };
    
    case 'mosaic':
      // Artistic mosaic: Varied asymmetric pattern
      if (index === 0) return { gridColumn: 'span 2', gridRow: 'span 2', className: 'bento-card--mosaic-hero' };
      if (index === 1) return { gridColumn: 'span 1', gridRow: 'span 2', className: 'bento-card--mosaic-tall' };
      if (index === 2) return { gridColumn: 'span 1', gridRow: 'span 1' };
      if (index === 3) return { gridColumn: 'span 1', gridRow: 'span 1' };
      if (index === 4) return { gridColumn: 'span 1', gridRow: 'span 1' };
      if (index === 5) return { gridColumn: 'span 2', gridRow: 'span 1', className: 'bento-card--mosaic-wide' };
      if (index === 6) return { gridColumn: 'span 1', gridRow: 'span 2', className: 'bento-card--mosaic-tall' };
      if (index === 7) return { gridColumn: 'span 2', gridRow: 'span 1', className: 'bento-card--mosaic-wide' };
      if (index === 8) return { gridColumn: 'span 1', gridRow: 'span 1' };
      if (index === 9) return { gridColumn: 'span 1', gridRow: 'span 1' };
      return { gridColumn: 'span 1', gridRow: 'span 1' };
    
    case 'minimal':
      // Clean minimal grid: Uniform with subtle highlights
      if (index === 0) return { gridColumn: 'span 2', gridRow: 'span 2', className: 'bento-card--minimal-hero' };
      if (index === 1) return { gridColumn: 'span 1', gridRow: 'span 1' };
      if (index === 2) return { gridColumn: 'span 1', gridRow: 'span 1' };
      if (index === 3) return { gridColumn: 'span 1', gridRow: 'span 1' };
      if (index === 4) return { gridColumn: 'span 1', gridRow: 'span 1' };
      if (index === 5) return { gridColumn: 'span 1', gridRow: 'span 1' };
      if (index === 6) return { gridColumn: 'span 1', gridRow: 'span 1' };
      if (index === 7) return { gridColumn: 'span 1', gridRow: 'span 1' };
      if (index === 8) return { gridColumn: 'span 1', gridRow: 'span 1' };
      if (index === 9) return { gridColumn: 'span 2', gridRow: 'span 1', className: 'bento-card--minimal-footer' };
      return { gridColumn: 'span 1', gridRow: 'span 1' };
    
    default:
      return { gridColumn: 'span 1', gridRow: 'span 1' };
  }
};

interface VehicleRanking {
  name: string;
  year: string;
  make: string;
  model: string;
  image: string;
  staffRating: number;
  communityRating: number;
  priceMin: number;
  priceMax: number;
  rank: number;
}

type TabType = 'rankings' | 'all-vehicles' | 'bento' | 'lifestyle-bento';

const TAB_CONFIG = [
  { id: 'rankings' as TabType, label: 'Top Ten Rankings', icon: '🏆', description: 'View ranked vehicles' },
  { id: 'all-vehicles' as TabType, label: 'All Vehicles', icon: '🚗', description: 'Browse database' },
  { id: 'bento' as TabType, label: 'Bento View', icon: '📱', description: 'Visual grid layout' },
  { id: 'lifestyle-bento' as TabType, label: 'Lifestyle Bento', icon: '🎯', description: 'By lifestyle category' },
];

export const TopTenManagement: React.FC = () => {
  const vehicleTypes: VehicleType[] = ['SUV', 'Sedan', 'Truck', 'Coupe', 'Performance'];
  const [ratingType, setRatingType] = React.useState<'MotorTrend' | 'User Reviews'>('MotorTrend');
  const [activeTab, setActiveTab] = React.useState<TabType>('rankings');
  const [bentoLayout, setBentoLayout] = React.useState<BentoLayoutType>('spotlight');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  
  const [filters, setFilters] = React.useState({
    year: '',
    make: '',
    model: '',
    bodyStyle: '',
    staffRatingMin: '',
    staffRatingMax: '',
    communityRatingMin: '',
    communityRatingMax: '',
    priceMin: '',
    priceMax: ''
  });

  // Get all vehicles and calculate rankings
  const categoryRankings = useMemo(() => {
    const apiVehicles = getVehicles();
    
    const allVehicleItems = apiVehicles.map(v => ({
      name: `${v.year} ${v.make} ${v.model}`,
      image: v.image,
      galleryImages: v.galleryImages,
      bodyStyle: v.bodyStyle,
      staffRating: v.staffRating ?? 0,
      communityRating: v.communityRating ?? 0,
      year: v.year,
      make: v.make,
      model: v.model,
      priceMin: v.priceMin ?? 0,
      priceMax: v.priceMax ?? 0
    }));

    const rankings: Record<string, VehicleRanking[]> = {};

    vehicleTypes.forEach(vehicleType => {
      const subcategories = getSubcategoriesForType(vehicleType);
      
      subcategories.forEach(subcategory => {
        const key = `${vehicleType}-${subcategory}`;
        
        let filteredVehicles = allVehicleItems;
        
        if (vehicleType === 'Performance') {
          filteredVehicles = allVehicleItems.filter(vehicle => vehicle.priceMin > 150000);
        } else {
          filteredVehicles = allVehicleItems.filter(vehicle => {
            if (vehicle.bodyStyle) {
              return vehicle.bodyStyle === vehicleType;
            }
            if (vehicleType === 'SUV' || vehicleType === 'Sedan' || vehicleType === 'Truck' || vehicleType === 'Coupe') {
              const bodyStyles = getVehicleBodyStyle(vehicle.name);
              return bodyStyles.includes(vehicleType);
            }
            return false;
          });

          filteredVehicles = filteredVehicles.filter(vehicle => vehicle.priceMin <= 150000);
          
          if (subcategory !== 'All') {
            filteredVehicles = filteredVehicles.filter(vehicle => {
              return getVehicleSubcategory(vehicle.name, vehicleType) === subcategory;
            });
          }
        }

        const vehiclesWithRatings = filteredVehicles.map(vehicle => {
          const currentYear = new Date().getFullYear();
          const vehicleYear = parseInt(vehicle.year) || currentYear;
          
          return {
            name: vehicle.name,
            year: vehicle.year,
            make: vehicle.make,
            model: vehicle.model,
            image: vehicle.image,
            staffRating: vehicle.staffRating,
            communityRating: vehicle.communityRating,
            priceMin: vehicle.priceMin,
            priceMax: vehicle.priceMax,
            vehicleYear
          };
        });

        const uniqueVehicles = new Map<string, typeof vehiclesWithRatings[0]>();
        vehiclesWithRatings.forEach(vehicle => {
          const key = `${vehicle.make}-${vehicle.model}`.toLowerCase();
          const existing = uniqueVehicles.get(key);
          if (!existing) {
            uniqueVehicles.set(key, vehicle);
          } else if (vehicle.vehicleYear > existing.vehicleYear) {
            uniqueVehicles.set(key, vehicle);
          } else if (vehicle.vehicleYear === existing.vehicleYear && vehicle.image && !existing.image) {
            existing.image = vehicle.image;
          }
        });

        const sortedVehicles = Array.from(uniqueVehicles.values()).sort((a, b) => {
          const aRating = ratingType === 'MotorTrend' ? a.staffRating : a.communityRating;
          const bRating = ratingType === 'MotorTrend' ? b.staffRating : b.communityRating;
          
          if (Math.abs(aRating - bRating) > 0.01) {
            return bRating - aRating;
          }
          return b.vehicleYear - a.vehicleYear;
        });

        const topTen = sortedVehicles.slice(0, 10).map((vehicle, index) => ({
          ...vehicle,
          rank: index + 1
        }));

        rankings[key] = topTen;
      });
    });

    return rankings;
  }, [ratingType]);

  // Get all vehicles from database
  const allVehiclesUnfiltered = useMemo(() => {
    const apiVehicles = getVehicles();
    return apiVehicles.map(v => ({
      name: `${v.year} ${v.make} ${v.model}`,
      image: v.image,
      year: v.year,
      make: v.make,
      model: v.model,
      bodyStyle: v.bodyStyle || 'Unknown',
      staffRating: v.staffRating ?? 0,
      communityRating: v.communityRating ?? 0,
      priceMin: v.priceMin ?? 0,
      priceMax: v.priceMax ?? 0,
      slug: v.slug || `${v.year}/${v.make}/${v.model.replace(/\s+/g, '-')}`
    }));
  }, []);

  // Get unique filter options
  const filterOptions = useMemo(() => {
    const years = Array.from(new Set(allVehiclesUnfiltered.map(v => v.year))).sort((a, b) => parseInt(b) - parseInt(a));
    const makes = Array.from(new Set(allVehiclesUnfiltered.map(v => v.make))).sort();
    const bodyStyles = Array.from(new Set(allVehiclesUnfiltered.map(v => v.bodyStyle))).sort();
    return { years, makes, bodyStyles };
  }, [allVehiclesUnfiltered]);

  // Filter and sort vehicles
  const allVehicles = useMemo(() => {
    let filtered = allVehiclesUnfiltered.filter(vehicle => {
      if (filters.year && vehicle.year !== filters.year) return false;
      if (filters.make && vehicle.make !== filters.make) return false;
      if (filters.model && !vehicle.model.toLowerCase().includes(filters.model.toLowerCase())) return false;
      if (filters.bodyStyle && vehicle.bodyStyle !== filters.bodyStyle) return false;
      
      if (filters.staffRatingMin && vehicle.staffRating < parseFloat(filters.staffRatingMin)) return false;
      if (filters.staffRatingMax && vehicle.staffRating > parseFloat(filters.staffRatingMax)) return false;
      
      if (filters.communityRatingMin && vehicle.communityRating < parseFloat(filters.communityRatingMin)) return false;
      if (filters.communityRatingMax && vehicle.communityRating > parseFloat(filters.communityRatingMax)) return false;
      
      if (filters.priceMin && vehicle.priceMin < parseFloat(filters.priceMin)) return false;
      if (filters.priceMax && vehicle.priceMax > parseFloat(filters.priceMax)) return false;
      
      return true;
    });

    return filtered.sort((a, b) => {
      const yearDiff = parseInt(b.year) - parseInt(a.year);
      if (yearDiff !== 0) return yearDiff;
      const makeDiff = a.make.localeCompare(b.make);
      if (makeDiff !== 0) return makeDiff;
      return a.model.localeCompare(b.model);
    });
  }, [allVehiclesUnfiltered, filters]);

  // Get vehicles grouped by subcategory for bento view
  const bentoVehicles = useMemo(() => {
    const apiVehicles = getVehicles();
    const allVehicleItems = apiVehicles.map(v => ({
      name: `${v.year} ${v.make} ${v.model}`,
      image: v.image,
      galleryImages: v.galleryImages,
      bodyStyle: v.bodyStyle,
      staffRating: v.staffRating ?? 0,
      communityRating: v.communityRating ?? 0,
      year: v.year,
      make: v.make,
      model: v.model,
      priceMin: v.priceMin ?? 0,
      priceMax: v.priceMax ?? 0,
      slug: v.slug || `${v.year}/${v.make}/${v.model.replace(/\s+/g, '-')}`
    }));

    const grouped: Record<string, typeof allVehicleItems> = {};

    vehicleTypes.forEach(vehicleType => {
      const subcategories = getSubcategoriesForType(vehicleType);
      
      subcategories.forEach(subcategory => {
        const key = `${vehicleType}-${subcategory}`;
        
        let filteredVehicles = allVehicleItems;
        
        if (vehicleType === 'Performance') {
          filteredVehicles = allVehicleItems.filter(vehicle => vehicle.priceMin > 150000);
        } else {
          filteredVehicles = allVehicleItems.filter(vehicle => {
            if (vehicle.bodyStyle) {
              return vehicle.bodyStyle === vehicleType;
            }
            if (vehicleType === 'SUV' || vehicleType === 'Sedan' || vehicleType === 'Truck' || vehicleType === 'Coupe') {
              const bodyStyles = getVehicleBodyStyle(vehicle.name);
              return bodyStyles.includes(vehicleType);
            }
            return false;
          });

          filteredVehicles = filteredVehicles.filter(vehicle => vehicle.priceMin <= 150000);
          
          if (subcategory !== 'All') {
            filteredVehicles = filteredVehicles.filter(vehicle => {
              return getVehicleSubcategory(vehicle.name, vehicleType) === subcategory;
            });
          }
        }

        const vehiclesWithRatings = filteredVehicles.map(vehicle => {
          const currentYear = new Date().getFullYear();
          const vehicleYear = parseInt(vehicle.year) || currentYear;
          
          return {
            ...vehicle,
            vehicleYear
          };
        });

        const uniqueVehicles = new Map<string, typeof vehiclesWithRatings[0]>();
        vehiclesWithRatings.forEach(vehicle => {
          const uniqueKey = `${vehicle.make}-${vehicle.model}`.toLowerCase();
          const existing = uniqueVehicles.get(uniqueKey);
          if (!existing || vehicle.vehicleYear > existing.vehicleYear) {
            uniqueVehicles.set(uniqueKey, vehicle);
          }
        });

        const sortedVehicles = Array.from(uniqueVehicles.values()).sort((a, b) => {
          const aRating = ratingType === 'MotorTrend' ? a.staffRating : a.communityRating;
          const bRating = ratingType === 'MotorTrend' ? b.staffRating : b.communityRating;
          
          if (Math.abs(aRating - bRating) > 0.01) {
            return bRating - aRating;
          }
          return b.vehicleYear - a.vehicleYear;
        });

        const topVehicles = sortedVehicles.slice(0, 10);
        
        if (topVehicles.length > 0) {
          grouped[key] = topVehicles;
        }
      });
    });

    return grouped;
  }, [ratingType]);

  // Get vehicles grouped by lifestyle category
  const lifestyleBentoVehicles = useMemo(() => {
    const apiVehicles = getVehicles();
    const allVehicleItems = apiVehicles.map(v => ({
      name: `${v.year} ${v.make} ${v.model}`,
      image: v.image,
      galleryImages: v.galleryImages,
      bodyStyle: v.bodyStyle,
      staffRating: v.staffRating ?? 0,
      communityRating: v.communityRating ?? 0,
      year: v.year,
      make: v.make,
      model: v.model,
      priceMin: v.priceMin ?? 0,
      priceMax: v.priceMax ?? 0,
      slug: v.slug || `${v.year}/${v.make}/${v.model.replace(/\s+/g, '-')}`
    }));

    const grouped: Record<string, typeof allVehicleItems> = {};

    LIFESTYLE_CATEGORIES.forEach(lifestyle => {
      let filteredVehicles = allVehicleItems.filter(vehicle => {
        const vehicleLifestyles = getVehicleLifestyles(vehicle.name);
        return vehicleLifestyles.includes(lifestyle);
      });

      if (lifestyle === 'Daily Commute') {
        filteredVehicles = filteredVehicles.filter(vehicle => vehicle.priceMin <= 80000);
      }

      const vehiclesWithRatings = filteredVehicles.map(vehicle => {
        const currentYear = new Date().getFullYear();
        const vehicleYear = parseInt(vehicle.year) || currentYear;
        
        return {
          ...vehicle,
          vehicleYear
        };
      });

      const uniqueVehicles = new Map<string, typeof vehiclesWithRatings[0]>();
      vehiclesWithRatings.forEach(vehicle => {
        const uniqueKey = `${vehicle.make}-${vehicle.model}`.toLowerCase();
        const existing = uniqueVehicles.get(uniqueKey);
        if (!existing || vehicle.vehicleYear > existing.vehicleYear) {
          uniqueVehicles.set(uniqueKey, vehicle);
        }
      });

      const sortedVehicles = Array.from(uniqueVehicles.values()).sort((a, b) => {
        const aRating = ratingType === 'MotorTrend' ? a.staffRating : a.communityRating;
        const bRating = ratingType === 'MotorTrend' ? b.staffRating : b.communityRating;
        
        if (Math.abs(aRating - bRating) > 0.01) {
          return bRating - aRating;
        }
        return b.vehicleYear - a.vehicleYear;
      });

      const topVehicles = sortedVehicles.slice(0, 10);
      
      if (topVehicles.length > 0) {
        grouped[lifestyle] = topVehicles;
      }
    });

    return grouped;
  }, [ratingType]);

  // Calculate stats
  const totalCategories = useMemo(() => {
    let count = 0;
    vehicleTypes.forEach(type => {
      count += getSubcategoriesForType(type).length;
    });
    return count + LIFESTYLE_CATEGORIES.length;
  }, []);

  const getRatingClass = (rating: number) => {
    if (rating >= 8) return 'top-ten-management__rating--high';
    if (rating >= 6) return 'top-ten-management__rating--medium';
    return 'top-ten-management__rating--low';
  };

  const getRankBadgeClass = (rank: number) => {
    if (rank === 1) return 'top-ten-management__rank-badge top-ten-management__rank-badge--gold';
    if (rank === 2) return 'top-ten-management__rank-badge top-ten-management__rank-badge--silver';
    if (rank === 3) return 'top-ten-management__rank-badge top-ten-management__rank-badge--bronze';
    return 'top-ten-management__rank-badge';
  };

  return (
    <div className="top-ten-management">
      {/* Sidebar Navigation */}
      <aside className={`top-ten-management__sidebar ${isSidebarCollapsed ? 'top-ten-management__sidebar--collapsed' : ''}`}>
        <div className="top-ten-management__sidebar-header">
          <div className="top-ten-management__sidebar-header-top">
            <div className="top-ten-management__sidebar-logo">10</div>
            <button 
              className="top-ten-management__sidebar-toggle"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <Icon name={isSidebarCollapsed ? "chevron_right" : "chevron_left"} size={20} />
            </button>
          </div>
          {!isSidebarCollapsed && (
            <div className="top-ten-management__sidebar-info">
              <span className="top-ten-management__sidebar-title">Top Ten Manager</span>
              <span className="top-ten-management__sidebar-subtitle">Vehicle Rankings Dashboard</span>
            </div>
          )}
        </div>

        <nav className="top-ten-management__sidebar-nav">
          <div className="top-ten-management__sidebar-nav-group">
            {!isSidebarCollapsed && <span className="top-ten-management__sidebar-nav-label">Views</span>}
            {TAB_CONFIG.map(tab => (
              <button
                key={tab.id}
                className={`top-ten-management__sidebar-nav-item ${activeTab === tab.id ? 'top-ten-management__sidebar-nav-item--active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                title={isSidebarCollapsed ? tab.label : undefined}
              >
                <span className="top-ten-management__sidebar-nav-icon">{tab.icon}</span>
                {!isSidebarCollapsed && tab.label}
              </button>
            ))}
          </div>

          <div className="top-ten-management__sidebar-nav-group">
            {!isSidebarCollapsed && <span className="top-ten-management__sidebar-nav-label">Quick Stats</span>}
            <div className="top-ten-management__sidebar-nav-item" style={{ cursor: 'default' }} title={isSidebarCollapsed ? `Total Vehicles: ${allVehiclesUnfiltered.length}` : undefined}>
              <span className="top-ten-management__sidebar-nav-icon">📊</span>
              {!isSidebarCollapsed && (
                <>
                  Total Vehicles
                  <span className="top-ten-management__sidebar-nav-badge">{allVehiclesUnfiltered.length}</span>
                </>
              )}
            </div>
            <div className="top-ten-management__sidebar-nav-item" style={{ cursor: 'default' }} title={isSidebarCollapsed ? `Categories: ${totalCategories}` : undefined}>
              <span className="top-ten-management__sidebar-nav-icon">📁</span>
              {!isSidebarCollapsed && (
                <>
                  Categories
                  <span className="top-ten-management__sidebar-nav-badge">{totalCategories}</span>
                </>
              )}
            </div>
          </div>
        </nav>

        <div className="top-ten-management__sidebar-footer">
          <Link to="/" className="top-ten-management__sidebar-link" title={isSidebarCollapsed ? "Back to Home" : undefined}>
            {!isSidebarCollapsed ? "← Back to Home" : "←"}
          </Link>
          <Link to="/design-system" className="top-ten-management__sidebar-link" title={isSidebarCollapsed ? "Design System" : undefined}>
            {!isSidebarCollapsed ? "Design System" : "DS"}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`top-ten-management__main ${isSidebarCollapsed ? 'top-ten-management__main--collapsed' : ''}`}>
        <div className="top-ten-management__container">
          {/* Header */}
          <header className="top-ten-management__header">
            <div className="top-ten-management__header-content">
              <div className="top-ten-management__header-text">
                <span className="top-ten-management__eyebrow">Management Dashboard</span>
                <h1 className="top-ten-management__title">Top Ten Rankings</h1>
                <p className="top-ten-management__description">
                  Complete audit of all Top Ten categories and vehicle rankings. 
                  Rankings are calculated based on the selected rating type, 
                  with newer vehicles prioritized when ratings are equal.
                </p>
              </div>
              <div className="top-ten-management__header-stats">
                <div className="top-ten-management__stat-card top-ten-management__stat-card--highlight">
                  <span className="top-ten-management__stat-value">{allVehiclesUnfiltered.length}</span>
                  <span className="top-ten-management__stat-label">Total Vehicles</span>
                </div>
                <div className="top-ten-management__stat-card">
                  <span className="top-ten-management__stat-value">{vehicleTypes.length}</span>
                  <span className="top-ten-management__stat-label">Body Types</span>
                </div>
                <div className="top-ten-management__stat-card">
                  <span className="top-ten-management__stat-value">{totalCategories}</span>
                  <span className="top-ten-management__stat-label">Categories</span>
                </div>
              </div>
            </div>
          </header>

          {/* Tab Navigation (Mobile) */}
          <div className="top-ten-management__tabs">
            {TAB_CONFIG.map(tab => (
              <button
                key={tab.id}
                className={`top-ten-management__tab ${activeTab === tab.id ? 'top-ten-management__tab--active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Controls Bar */}
          {(activeTab === 'rankings' || activeTab === 'bento' || activeTab === 'lifestyle-bento') && (
            <div className="top-ten-management__controls-bar">
              <div className="top-ten-management__controls">
                <div className="top-ten-management__control-group">
                  <label className="top-ten-management__control-label">Ranking by:</label>
                  <select 
                    className="top-ten-management__control-select"
                    value={ratingType}
                    onChange={(e) => setRatingType(e.target.value as 'MotorTrend' | 'User Reviews')}
                  >
                    <option value="MotorTrend">MotorTrend Staff Rating</option>
                    <option value="User Reviews">User Reviews Rating</option>
                  </select>
                </div>
                {(activeTab === 'bento' || activeTab === 'lifestyle-bento') && (
                  <div className="top-ten-management__control-group">
                    <label className="top-ten-management__control-label">Layout:</label>
                    <select 
                      className="top-ten-management__control-select"
                      value={bentoLayout}
                      onChange={(e) => setBentoLayout(e.target.value as BentoLayoutType)}
                    >
                      <option value="spotlight">✨ Spotlight</option>
                      <option value="editorial">📰 Editorial</option>
                      <option value="cascade">🌊 Cascade</option>
                      <option value="mosaic">🎨 Mosaic</option>
                      <option value="minimal">◻️ Minimal</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Content Area */}
          <div className="top-ten-management__content">
            {activeTab === 'all-vehicles' ? (
              /* All Vehicles Tab */
              <section className="top-ten-management__section">
                <div className="top-ten-management__section-header">
                  <div className="top-ten-management__section-icon">🚗</div>
                  <h2 className="top-ten-management__section-title">
                    All Vehicles
                  </h2>
                  <span className="top-ten-management__vehicle-count">
                    {allVehicles.length} vehicles
                  </span>
                </div>
                
                {/* Filters */}
                <div className="top-ten-management__filters">
                  <div className="top-ten-management__filter-row">
                    <div className="top-ten-management__filter-group">
                      <label className="top-ten-management__filter-label">Year</label>
                      <select
                        className="top-ten-management__filter-select"
                        value={filters.year}
                        onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                      >
                        <option value="">All Years</option>
                        {filterOptions.years.map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="top-ten-management__filter-group">
                      <label className="top-ten-management__filter-label">Make</label>
                      <select
                        className="top-ten-management__filter-select"
                        value={filters.make}
                        onChange={(e) => setFilters({ ...filters, make: e.target.value })}
                      >
                        <option value="">All Makes</option>
                        {filterOptions.makes.map(make => (
                          <option key={make} value={make}>{make}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="top-ten-management__filter-group">
                      <label className="top-ten-management__filter-label">Model</label>
                      <input
                        type="text"
                        className="top-ten-management__filter-input"
                        placeholder="Search model..."
                        value={filters.model}
                        onChange={(e) => setFilters({ ...filters, model: e.target.value })}
                      />
                    </div>
                    
                    <div className="top-ten-management__filter-group">
                      <label className="top-ten-management__filter-label">Body Style</label>
                      <select
                        className="top-ten-management__filter-select"
                        value={filters.bodyStyle}
                        onChange={(e) => setFilters({ ...filters, bodyStyle: e.target.value })}
                      >
                        <option value="">All Body Styles</option>
                        {filterOptions.bodyStyles.map(style => (
                          <option key={style} value={style}>{style}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="top-ten-management__filter-row">
                    <div className="top-ten-management__filter-group">
                      <label className="top-ten-management__filter-label">Staff Rating</label>
                      <div className="top-ten-management__filter-range">
                        <input
                          type="number"
                          className="top-ten-management__filter-input"
                          placeholder="Min"
                          min="0"
                          max="10"
                          step="0.1"
                          value={filters.staffRatingMin}
                          onChange={(e) => setFilters({ ...filters, staffRatingMin: e.target.value })}
                        />
                        <span className="top-ten-management__filter-separator">-</span>
                        <input
                          type="number"
                          className="top-ten-management__filter-input"
                          placeholder="Max"
                          min="0"
                          max="10"
                          step="0.1"
                          value={filters.staffRatingMax}
                          onChange={(e) => setFilters({ ...filters, staffRatingMax: e.target.value })}
                        />
                      </div>
                    </div>
                    
                    <div className="top-ten-management__filter-group">
                      <label className="top-ten-management__filter-label">Community Rating</label>
                      <div className="top-ten-management__filter-range">
                        <input
                          type="number"
                          className="top-ten-management__filter-input"
                          placeholder="Min"
                          min="0"
                          max="10"
                          step="0.1"
                          value={filters.communityRatingMin}
                          onChange={(e) => setFilters({ ...filters, communityRatingMin: e.target.value })}
                        />
                        <span className="top-ten-management__filter-separator">-</span>
                        <input
                          type="number"
                          className="top-ten-management__filter-input"
                          placeholder="Max"
                          min="0"
                          max="10"
                          step="0.1"
                          value={filters.communityRatingMax}
                          onChange={(e) => setFilters({ ...filters, communityRatingMax: e.target.value })}
                        />
                      </div>
                    </div>
                    
                    <div className="top-ten-management__filter-group">
                      <label className="top-ten-management__filter-label">Price</label>
                      <div className="top-ten-management__filter-range">
                        <input
                          type="number"
                          className="top-ten-management__filter-input"
                          placeholder="Min $"
                          min="0"
                          step="1000"
                          value={filters.priceMin}
                          onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
                        />
                        <span className="top-ten-management__filter-separator">-</span>
                        <input
                          type="number"
                          className="top-ten-management__filter-input"
                          placeholder="Max $"
                          min="0"
                          step="1000"
                          value={filters.priceMax}
                          onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="top-ten-management__filter-actions">
                    <button
                      className="top-ten-management__filter-clear"
                      onClick={() => setFilters({
                        year: '',
                        make: '',
                        model: '',
                        bodyStyle: '',
                        staffRatingMin: '',
                        staffRatingMax: '',
                        communityRatingMin: '',
                        communityRatingMax: '',
                        priceMin: '',
                        priceMax: ''
                      })}
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>
                
                <div className="top-ten-management__table-container">
                  <table className="top-ten-management__table">
                    <thead>
                      <tr>
                        <th>Vehicle</th>
                        <th>Year</th>
                        <th>Make</th>
                        <th>Model</th>
                        <th>Body Style</th>
                        <th>Staff Rating</th>
                        <th>Community</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allVehicles.map((vehicle) => (
                        <tr key={`${vehicle.year}-${vehicle.make}-${vehicle.model}`}>
                          <td className="top-ten-management__vehicle-name">
                            <Link 
                              to={`/vehicles/${vehicle.slug}`}
                              className="top-ten-management__vehicle-link"
                            >
                              <div className="top-ten-management__vehicle-name-content">
                                {vehicle.image && (
                                  <img 
                                    src={vehicle.image} 
                                    alt={vehicle.name}
                                    className="top-ten-management__vehicle-thumbnail"
                                  />
                                )}
                                <span>{vehicle.name}</span>
                              </div>
                            </Link>
                          </td>
                          <td>{vehicle.year}</td>
                          <td>{vehicle.make}</td>
                          <td>{vehicle.model}</td>
                          <td>{vehicle.bodyStyle}</td>
                          <td className={`top-ten-management__rating ${getRatingClass(vehicle.staffRating)}`}>
                            {vehicle.staffRating > 0 ? `${vehicle.staffRating.toFixed(1)}` : 'N/A'}
                          </td>
                          <td className={`top-ten-management__rating ${getRatingClass(vehicle.communityRating)}`}>
                            {vehicle.communityRating > 0 ? `${vehicle.communityRating.toFixed(1)}` : 'N/A'}
                          </td>
                          <td className="top-ten-management__price">
                            {vehicle.priceMin > 0 
                              ? (vehicle.priceMin === vehicle.priceMax 
                                  ? `$${vehicle.priceMin.toLocaleString()}`
                                  : `$${vehicle.priceMin.toLocaleString()} - $${vehicle.priceMax.toLocaleString()}`)
                              : 'N/A'
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ) : activeTab === 'bento' ? (
              /* Bento View Tab */
              <>
                {vehicleTypes.map(vehicleType => {
                  const subcategories = getSubcategoriesForType(vehicleType);
                  
                  return (
                    <section key={vehicleType} className="top-ten-management__section">
                      <div className="top-ten-management__section-header">
                        <div className="top-ten-management__section-icon">
                          {vehicleType === 'SUV' ? '🚙' : vehicleType === 'Sedan' ? '🚗' : vehicleType === 'Truck' ? '🛻' : vehicleType === 'Coupe' ? '🏎️' : '⚡'}
                        </div>
                        <h2 style={{ color: '#FFFFFF', margin: 0, fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '24px' }}>
                          Top Ten {vehicleType === 'Performance' ? 'Performance' : `${vehicleType}s`}
                        </h2>
                      </div>
                      
                      <div className="top-ten-management__bento-categories">
                        {subcategories.map(subcategory => {
                          const key = `${vehicleType}-${subcategory}`;
                          const vehicles = bentoVehicles[key] || [];
                          const categoryName = subcategory === 'All' 
                            ? `All Categories` 
                            : subcategory;
                          
                          if (vehicles.length === 0) return null;
                          
                          return (
                            <div key={key} className="top-ten-management__bento-category">
                              <h3 className="top-ten-management__bento-category-title">
                                {categoryName}
                              </h3>
                              <div className="top-ten-management__bento-grid">
                                {vehicles.map((vehicle, index) => {
                                  const rating = ratingType === 'MotorTrend' ? vehicle.staffRating : vehicle.communityRating;
                                  const vehicleImage = vehicle.image && 
                                    typeof vehicle.image === 'string' && 
                                    vehicle.image.trim() !== '' &&
                                    vehicle.image.startsWith('http')
                                    ? vehicle.image 
                                    : null;
                                  
                                  const { gridColumn, gridRow, className: layoutClass } = getBentoGridLayout(bentoLayout, index);
                                  
                                  return (
                                    <Link
                                      key={`${vehicle.year}-${vehicle.make}-${vehicle.model}-${index}`}
                                      to={`/vehicles/${vehicle.slug}`}
                                      className={`top-ten-management__bento-card ${layoutClass || ''}`}
                                      style={{ gridColumn, gridRow }}
                                    >
                                      {vehicleImage ? (
                                        <div className="top-ten-management__bento-image-container">
                                          <img 
                                            src={vehicleImage} 
                                            alt={vehicle.name}
                                            className="top-ten-management__bento-image"
                                          />
                                          <div className="top-ten-management__bento-overlay">
                                            <div className="top-ten-management__bento-rank">
                                              <span className="top-ten-management__bento-rank-badge">#{index + 1}</span>
                                            </div>
                                            <div className="top-ten-management__bento-rating">
                                              {rating.toFixed(1)}/10
                                            </div>
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="top-ten-management__bento-placeholder">
                                          <div className="top-ten-management__bento-rank">#{index + 1}</div>
                                          <div className="top-ten-management__bento-name">{vehicle.name}</div>
                                          <div className="top-ten-management__bento-rating">
                                            {rating.toFixed(1)}/10
                                          </div>
                                        </div>
                                      )}
                                      <div className="top-ten-management__bento-info">
                                        <div className="top-ten-management__bento-name">{vehicle.name}</div>
                                      </div>
                                    </Link>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  );
                })}
              </>
            ) : activeTab === 'lifestyle-bento' ? (
              /* Lifestyle Bento View Tab */
              <>
                {LIFESTYLE_CATEGORIES.map(lifestyle => {
                  const vehicles = lifestyleBentoVehicles[lifestyle] || [];
                  
                  if (vehicles.length === 0) return null;
                  
                  return (
                    <section key={lifestyle} className="top-ten-management__section">
                      <div className="top-ten-management__section-header">
                        <div className="top-ten-management__section-icon">🎯</div>
                        <h2 className="top-ten-management__section-title">
                          {lifestyle}
                        </h2>
                      </div>
                      
                      <div className="top-ten-management__bento-category">
                        <div className="top-ten-management__bento-grid">
                          {vehicles.map((vehicle: { name: string; image: string | null; staffRating: number; communityRating: number; year: string; make: string; model: string; slug: string }, index: number) => {
                            const rating = ratingType === 'MotorTrend' ? vehicle.staffRating : vehicle.communityRating;
                            const vehicleImage = vehicle.image && 
                              typeof vehicle.image === 'string' && 
                              vehicle.image.trim() !== '' &&
                              vehicle.image.startsWith('http')
                              ? vehicle.image 
                              : null;
                            
                            const { gridColumn, gridRow, className: layoutClass } = getBentoGridLayout(bentoLayout, index);
                            
                            return (
                              <Link
                                key={`${vehicle.year}-${vehicle.make}-${vehicle.model}-${index}`}
                                to={`/vehicles/${vehicle.slug}`}
                                className={`top-ten-management__bento-card ${layoutClass || ''}`}
                                style={{ gridColumn, gridRow }}
                              >
                                {vehicleImage ? (
                                  <div className="top-ten-management__bento-image-container">
                                    <img 
                                      src={vehicleImage} 
                                      alt={vehicle.name}
                                      className="top-ten-management__bento-image"
                                    />
                                    <div className="top-ten-management__bento-overlay">
                                      <div className="top-ten-management__bento-rank">
                                        <span className="top-ten-management__bento-rank-badge">#{index + 1}</span>
                                      </div>
                                      <div className="top-ten-management__bento-rating">
                                        {rating.toFixed(1)}/10
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="top-ten-management__bento-placeholder">
                                    <div className="top-ten-management__bento-rank">#{index + 1}</div>
                                    <div className="top-ten-management__bento-name">{vehicle.name}</div>
                                    <div className="top-ten-management__bento-rating">
                                      {rating.toFixed(1)}/10
                                    </div>
                                  </div>
                                )}
                                <div className="top-ten-management__bento-info">
                                  <div className="top-ten-management__bento-name">{vehicle.name}</div>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </section>
                  );
                })}
              </>
            ) : (
              /* Top Ten Rankings Tab */
              <>
                {vehicleTypes.map(vehicleType => {
                  const subcategories = getSubcategoriesForType(vehicleType);
                  
                  return (
                    <section key={vehicleType} className="top-ten-management__section">
                      <div className="top-ten-management__section-header">
                        <div className="top-ten-management__section-icon">
                          {vehicleType === 'SUV' ? '🚙' : vehicleType === 'Sedan' ? '🚗' : vehicleType === 'Truck' ? '🛻' : vehicleType === 'Coupe' ? '🏎️' : '⚡'}
                        </div>
                        <h2 style={{ color: '#FFFFFF', margin: 0, fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '24px' }}>
                          Top Ten {vehicleType === 'Performance' ? 'Performance' : `${vehicleType}s`}
                        </h2>
                      </div>
                      
                      <div className="top-ten-management__categories">
                        {subcategories.map(subcategory => {
                          const key = `${vehicleType}-${subcategory}`;
                          const vehicles = categoryRankings[key] || [];
                          const categoryName = subcategory === 'All' 
                            ? `All Categories` 
                            : subcategory;
                          
                          return (
                            <div key={key} className="top-ten-management__category">
                              <div className="top-ten-management__category-header">
                                <h3 className="top-ten-management__category-title">
                                  {categoryName}
                                </h3>
                                <span className="top-ten-management__category-badge">
                                  {vehicles.length} vehicles
                                </span>
                              </div>
                              
                              {vehicles.length === 0 ? (
                                <div className="top-ten-management__empty">
                                  <div className="top-ten-management__empty-icon">📭</div>
                                  <p className="top-ten-management__empty-text">No vehicles found in this category.</p>
                                  <p className="top-ten-management__empty-note">
                                    Add vehicles to the database that match this category to populate the list.
                                  </p>
                                </div>
                              ) : (
                                <div className="top-ten-management__table-container">
                                  <table className="top-ten-management__table">
                                    <thead>
                                      <tr>
                                        <th>Rank</th>
                                        <th>Vehicle</th>
                                        <th>Year</th>
                                        <th>Make</th>
                                        <th>Model</th>
                                        <th>Staff Rating</th>
                                        <th>Community</th>
                                        <th>Price</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {vehicles.map((vehicle) => (
                                        <tr key={`${vehicle.year}-${vehicle.make}-${vehicle.model}`}>
                                          <td className="top-ten-management__rank">
                                            <span className={getRankBadgeClass(vehicle.rank)}>
                                              #{vehicle.rank}
                                            </span>
                                          </td>
                                          <td className="top-ten-management__vehicle-name">
                                            <Link 
                                              to={`/vehicles/${vehicle.year}/${vehicle.make}/${vehicle.model.replace(/\s+/g, '-')}`}
                                              className="top-ten-management__vehicle-link"
                                            >
                                              <div className="top-ten-management__vehicle-name-content">
                                                {vehicle.image && (
                                                  <img 
                                                    src={vehicle.image} 
                                                    alt={vehicle.name}
                                                    className="top-ten-management__vehicle-thumbnail"
                                                  />
                                                )}
                                                <span>{vehicle.name}</span>
                                              </div>
                                            </Link>
                                          </td>
                                          <td>{vehicle.year}</td>
                                          <td>{vehicle.make}</td>
                                          <td>{vehicle.model}</td>
                                          <td className={`top-ten-management__rating ${getRatingClass(vehicle.staffRating)}`}>
                                            {vehicle.staffRating.toFixed(1)}
                                          </td>
                                          <td className={`top-ten-management__rating ${getRatingClass(vehicle.communityRating)}`}>
                                            {vehicle.communityRating.toFixed(1)}
                                          </td>
                                          <td className="top-ten-management__price">
                                            {vehicle.priceMin === vehicle.priceMax 
                                              ? `$${vehicle.priceMin.toLocaleString()}`
                                              : `$${vehicle.priceMin.toLocaleString()} - $${vehicle.priceMax.toLocaleString()}`
                                            }
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  );
                })}
              </>
            )}

            {/* Footer */}
            <footer className="top-ten-management__footer">
              <p className="top-ten-management__footer-note">
                <strong>Note:</strong> Rankings are dynamically calculated from the vehicle database using the selected rating type ({ratingType === 'MotorTrend' ? 'MotorTrend Staff Rating' : 'User Reviews Rating'}). 
                To update rankings, modify vehicle ratings in the database. 
                Newer vehicles are prioritized when ratings are equal. 
                The Top Ten Carousel displays vehicles in reverse order (rank 10 to rank 1).
              </p>
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TopTenManagement;
